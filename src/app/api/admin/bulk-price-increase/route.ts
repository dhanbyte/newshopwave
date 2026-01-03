import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        console.log('Starting price increase process...');
        
        // 1. Update Regular Products
        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('id, price, original_price');
        
        if (productsError) throw productsError;
        
        console.log(`Updating ${products.length} regular products...`);
        let productsUpdated = 0;
        
        for (const product of products) {
            let updates = {};
            
            if (product.price) {
                // Check if price is an object (Money type) or a number
                if (typeof product.price === 'object') {
                    updates.price = {
                        ...product.price,
                        original: Math.round((Number(product.price.original) || 0) * 1.05),
                        discounted: product.price.discounted ? Math.round(Number(product.price.discounted) * 1.05) : undefined
                    };
                } else {
                    updates.price = Math.round(Number(product.price) * 1.05);
                }
            }
            
            if (product.original_price) {
                updates.original_price = Math.round(Number(product.original_price) * 1.05);
            }
            
            if (Object.keys(updates).length > 0) {
                await supabase.from('products').update(updates).eq('id', product.id);
                productsUpdated++;
            }
        }
        
        // 2. Update Vendor Products
        const { data: vendorProducts, error: vendorError } = await supabase
            .from('vendor_products')
            .select('id, price, original_price');
            
        if (vendorError) throw vendorError;
        
        console.log(`Updating ${vendorProducts.length} vendor products...`);
        let vendorsUpdated = 0;
        
        for (const product of vendorProducts) {
            let updates = {};
            
            if (product.price) {
                updates.price = Math.round(Number(product.price) * 1.05);
            }
            
            if (product.original_price) {
                updates.original_price = Math.round(Number(product.original_price) * 1.05);
            }
            
            if (Object.keys(updates).length > 0) {
                await supabase.from('vendor_products').update(updates).eq('id', product.id);
                vendorsUpdated++;
            }
        }
        
        return NextResponse.json({
            success: true,
            summary: {
                regularProducts: {
                    total: products.length,
                    updated: productsUpdated
                },
                vendorProducts: {
                    total: vendorProducts.length,
                    updated: vendorsUpdated
                }
            }
        });
        
    } catch (error) {
        console.error('Price update failed:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
