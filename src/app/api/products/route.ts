// @ts-nocheck
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { TECH_PRODUCTS } from '@/lib/data/tech';
import { HOME_PRODUCTS } from '@/lib/data/home';
import { FASHION_PRODUCTS } from '@/lib/data/fashion';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// GET all products with filtering support
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const limit = searchParams.get('limit')
        
        console.log('Fetching products from Supabase...');
        
        try {
            // Fetch both regular products and vendor products from Supabase (exclude customizable products)
            const [regularProductsResult, vendorProductsResult] = await Promise.all([
                supabase.from('products').select('*').neq('category', 'customizable').or('status.eq.active,status.is.null').order('created_at', { ascending: false }),
                supabase.from('vendor_products').select('*').neq('category', 'customizable').eq('status', 'active').order('created_at', { ascending: false })
            ]);
            
            const regularProducts = regularProductsResult.data || [];
            const vendorProducts = vendorProductsResult.data || [];
            
            console.log(`Found ${regularProducts.length} regular products and ${vendorProducts.length} vendor products from Supabase`);
            if (regularProducts.length > 0) {
                console.log('Sample regular product prices:', regularProducts.slice(0, 2).map(p => ({ 
                    name: p.name, 
                    price: p.price, 
                    original_price: p.original_price 
                })));
            }
            if (vendorProducts.length > 0) {
                console.log('Sample vendor product prices:', vendorProducts.slice(0, 2).map(p => ({ 
                    name: p.name, 
                    price: p.price, 
                    original_price: p.original_price 
                })));
            }
            
            if (regularProductsResult.error) {
                console.error('Regular products query error:', regularProductsResult.error);
            }
            
            if (vendorProductsResult.error) {
                console.error('Vendor products query error:', vendorProductsResult.error);
            }
            
            if (vendorProducts.length > 0) {
                console.log('Sample vendor products:', vendorProducts.slice(0, 2).map(p => ({ id: p.id, name: p.name, status: p.status, stock: p.stock })));
            } else {
                console.log('No vendor products found in database');
            }
            
            // Transform regular products - ensure price is Money object
            const transformedRegularProducts = regularProducts.map(product => {
                // Handle price transformation with better null/undefined checks
                let priceObj;
                const rawPrice = product.price;
                const rawOriginalPrice = product.original_price;
                
                if (typeof rawPrice === 'object' && rawPrice !== null && rawPrice.original) {
                    // Already in correct Money format
                    priceObj = rawPrice;
                } else {
                    // Convert to Money object
                    const priceValue = Number(rawPrice) || 0;
                    const originalPriceValue = Number(rawOriginalPrice) || 0;
                    
                    // If we have both original_price and price, and original is higher, show discount
                    if (originalPriceValue > 0 && priceValue > 0 && originalPriceValue > priceValue) {
                        priceObj = { 
                            original: originalPriceValue,
                            discounted: priceValue,
                            currency: '₹'
                        };
                    } else {
                        // No discount, just use price
                        priceObj = { 
                            original: priceValue || originalPriceValue || 0,
                            currency: '₹'
                        };
                    }
                }

                return {
                    ...product,
                    price: priceObj,
                    slug: product.slug || product.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || product.id,
                    shortDescription: product.description?.substring(0, 100) + '...' || '',
                    extraImages: product.extra_images || [],
                    features: product.features || [],
                    specifications: product.specifications || {},
                    ratings: product.ratings || { average: 4.2, count: Math.floor(Math.random() * 50) + 10 },
                    subcategory: product.subcategory || '',
                    isVendorProduct: false
                };
            });

            // Transform vendor products - ensure price is Money object
            const transformedVendorProducts = vendorProducts
                .map(product => {
                    const rawPrice = Number(product.price) || 0;
                    const rawOriginalPrice = Number(product.original_price) || 0;
                    
                    // Determine the correct original and discounted prices
                    let originalPrice, discountedPrice;
                    
                    if (rawOriginalPrice > 0 && rawPrice > 0 && rawOriginalPrice > rawPrice) {
                        // We have a discount
                        originalPrice = rawOriginalPrice;
                        discountedPrice = rawPrice;
                    } else if (rawOriginalPrice > 0) {
                        // Use original_price as the main price
                        originalPrice = rawOriginalPrice;
                        discountedPrice = undefined;
                    } else {
                        // Use price as the main price
                        originalPrice = rawPrice;
                        discountedPrice = undefined;
                    }
                    
                    return {
                        id: product.id,
                        name: product.name,
                        image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=No+Image',
                        extraImages: Array.isArray(product.images) ? product.images : [],
                        shortDescription: product.description?.substring(0, 100) + '...' || '',
                        description: product.description || '',
                        category: product.category,
                        subcategory: product.subcategory || '',
                        price: {
                            original: originalPrice,
                            discounted: discountedPrice,
                            currency: '₹'
                        },
                        quantity: Number(product.stock) || 0,
                        stock: Number(product.stock) || 0,
                        brand: product.brand || 'ShopWave',
                        features: [],
                        specifications: {},
                        ratings: { average: 4.2, count: Math.floor(Math.random() * 50) + 10 },
                        isVendorProduct: true,
                        slug: product.slug || product.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || product.id.toString(),
                        inStock: (product.stock || 0) > 0
                    };
                });

            // Combine all products
            let allProducts = [...transformedRegularProducts, ...transformedVendorProducts];
            
            // Add JSON products as fallback (exclude customizable products)
            const jsonProducts = [...FASHION_PRODUCTS, ...TECH_PRODUCTS, ...HOME_PRODUCTS]
                .filter(p => p.category !== 'Customizable')
                .map(p => ({
                    ...p,
                    isVendorProduct: false,
                    inStock: true
                }));
            
            allProducts = [...allProducts, ...jsonProducts];
            console.log('Combined products: DB=' + allProducts.filter(p => p.isVendorProduct).length + ', JSON=' + jsonProducts.length);
            
            // Apply limit if specified
            const finalProducts = limit && !isNaN(Number(limit)) ? 
                allProducts.slice(0, Number(limit)) : allProducts;

            console.log(`Returning ${finalProducts.length} products (${transformedVendorProducts.length} vendor products)`);
            
            const response = NextResponse.json(finalProducts);
            response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
            response.headers.set('Pragma', 'no-cache');
            response.headers.set('Expires', '0');
            return response;
            
        } catch (supabaseError) {
            console.error('Supabase connection failed:', supabaseError);
            // Fall through to fallback
        }
        
        // Return JSON products as fallback (exclude customizable products)
        console.log('Using JSON products as fallback');
        const allProducts = [...FASHION_PRODUCTS, ...TECH_PRODUCTS, ...HOME_PRODUCTS]
            .filter(p => p.category !== 'Customizable')
            .map(p => ({
                ...p,
                isVendorProduct: false,
                inStock: true
            }));
        
        const finalProducts = limit && !isNaN(Number(limit)) ? 
            allProducts.slice(0, Number(limit)) : allProducts;
            
        return NextResponse.json(finalProducts);
        
    } catch (error) {
        console.error('Error in GET /api/products:', error);
        return NextResponse.json([]);
    }
}

// POST - create a new product
export async function POST(request: Request) {
    try {
        const productData = await request.json();
        console.log('Creating product in Supabase:', productData);
        
        const { data, error } = await supabase
            .from('products')
            .insert([productData])
            .select()
            .single();

        if (error) {
            console.error('Supabase insert error:', error);
            return NextResponse.json({ 
                success: false, 
                error: error.message 
            }, { status: 500 });
        }

        return NextResponse.json({ 
            success: true,
            data: data 
        }, { status: 201 });
        
    } catch (error) {
        console.error('Error in POST /api/products:', error);
        return NextResponse.json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Failed to create product' 
        }, { status: 500 });
    }
}