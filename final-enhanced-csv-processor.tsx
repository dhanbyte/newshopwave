'use client';

import { useState, useCallback } from 'react';
import Papa from 'papaparse';

// Comprehensive Category Mapping System
function intelligentCategoryMapping(title, description, brand) {
  const text = `${title} ${description} ${brand}`.toLowerCase();
  
  // Jewelry & Accessories - Crystal Mala, Beads, etc.
  if (text.match(/jewelry|jewellery|necklace|earring|ring|bracelet|mala|beads|crystal|pendant|chain|locket/)) {
    if (text.match(/mala|beads|crystal|meditation|healing|spiritual/)) return { category: 'Jewellery', subcategory: 'Bracelets' };
    if (text.match(/necklace|pendant|chain|locket/)) return { category: 'Jewellery', subcategory: 'Necklaces' };
    if (text.match(/earring|ear ring/)) return { category: 'Jewellery', subcategory: 'Earrings' };
    if (text.match(/ring|finger ring/)) return { category: 'Jewellery', subcategory: 'Rings' };
    if (text.match(/watch|wrist watch/)) return { category: 'Jewellery', subcategory: 'Watches' };
    return { category: 'Jewellery', subcategory: 'Fashion Jewelry' };
  }
  
  // Electronics & Mobile
  if (text.match(/mobile|phone|smartphone|iphone|android|samsung|oneplus|xiaomi|realme|oppo|vivo/)) {
    if (text.match(/cover|case|back cover|flip cover|protective/)) return { category: 'Mobile Covers', subcategory: 'Phone Cases' };
    if (text.match(/screen guard|tempered glass|protector/)) return { category: 'Mobile Covers', subcategory: 'Screen Protectors' };
    if (text.match(/stand|holder|mount/)) return { category: 'Mobile Accessories', subcategory: 'Mobile Stands' };
    if (text.match(/charger|charging|cable|usb/)) return { category: 'Mobile Accessories', subcategory: 'Chargers' };
    if (text.match(/power bank|powerbank|battery/)) return { category: 'Mobile Accessories', subcategory: 'Power Banks' };
    if (text.match(/headphone|earphone|earbud|headset/)) return { category: 'Mobile Accessories', subcategory: 'Headphones' };
    return { category: 'Mobile Accessories', subcategory: 'Mobile Stands' };
  }
  
  // Electronics General
  if (text.match(/electronic|gadget|device|tech|bluetooth|wireless|smart/)) {
    if (text.match(/headphone|earphone|speaker|audio/)) return { category: 'Electronics', subcategory: 'Audio & Video' };
    if (text.match(/watch|smartwatch|fitness band/)) return { category: 'Electronics', subcategory: 'Wearables' };
    if (text.match(/camera|webcam|security cam/)) return { category: 'Electronics', subcategory: 'Cameras' };
    if (text.match(/gaming|game|controller/)) return { category: 'Electronics', subcategory: 'Gaming' };
    return { category: 'Electronics', subcategory: 'Smart Devices' };
  }
  
  // Home & Kitchen
  if (text.match(/kitchen|cooking|utensil|cookware|appliance|home|house/)) {
    if (text.match(/bottle|water bottle|sipper|flask/)) return { category: 'Home & Kitchen', subcategory: 'Storage Containers' };
    if (text.match(/container|storage|box|jar|canister/)) return { category: 'Home & Kitchen', subcategory: 'Storage Containers' };
    if (text.match(/glass|glassware|tumbler|mug|cup/)) return { category: 'Home & Kitchen', subcategory: 'Dining' };
    if (text.match(/spoon|fork|knife|cutlery|utensil/)) return { category: 'Home & Kitchen', subcategory: 'Kitchen Tools' };
    if (text.match(/plate|dish|bowl|serving/)) return { category: 'Home & Kitchen', subcategory: 'Dining' };
    if (text.match(/blender|mixer|grinder|juicer/)) return { category: 'Kitchen & Home Appliances', subcategory: 'Small Appliances' };
    if (text.match(/pan|pot|kadai|tawa|cookware/)) return { category: 'Home & Kitchen', subcategory: 'Cookware' };
    if (text.match(/appliance|electric|machine/)) return { category: 'Kitchen & Home Appliances', subcategory: 'Kitchen Gadgets' };
    return { category: 'Home & Kitchen', subcategory: 'Kitchen Tools' };
  }
  
  // Fashion & Clothing
  if (text.match(/fashion|clothing|wear|dress|shirt|pant|jean|trouser|jacket|hoodie|kurta|saree|legging/)) {
    if (text.match(/men|male|boy|gents/) && text.match(/shirt/)) return { category: 'Clothing & Accessories', subcategory: 'Men Clothing' };
    if (text.match(/men|male|boy|gents/) && text.match(/t-shirt|tshirt/)) return { category: 'Clothing & Accessories', subcategory: 'Men Clothing' };
    if (text.match(/women|female|girl|ladies|woman/) && text.match(/dress|frock/)) return { category: 'Clothing & Accessories', subcategory: 'Women Clothing' };
    if (text.match(/women|female|girl|ladies|woman/) && text.match(/kurta|kurti|top/)) return { category: 'Clothing & Accessories', subcategory: 'Women Clothing' };
    if (text.match(/saree|sari/)) return { category: 'Clothing & Accessories', subcategory: 'Women Clothing' };
    if (text.match(/kids|child|baby|infant/)) return { category: 'Clothing & Accessories', subcategory: 'Kids Clothing' };
    return { category: 'Clothing & Accessories', subcategory: 'Fashion Accessories' };
  }
  
  // Beauty & Personal Care
  if (text.match(/beauty|cosmetic|makeup|skincare|hair|personal care|grooming/)) {
    if (text.match(/hair|shampoo|conditioner|oil|serum/)) return { category: 'Health & Beauty Accessories', subcategory: 'Hair Care' };
    if (text.match(/skin|face|cream|lotion|moisturizer/)) return { category: 'Health & Beauty Accessories', subcategory: 'Skincare' };
    if (text.match(/makeup|lipstick|foundation|mascara/)) return { category: 'Health & Beauty Accessories', subcategory: 'Makeup' };
    return { category: 'Health & Beauty Accessories', subcategory: 'Personal Care' };
  }
  
  // Baby Products
  if (text.match(/baby|infant|newborn|toddler|child|kid/)) {
    if (text.match(/toy|play|game/)) return { category: 'Baby Products', subcategory: 'Baby Toys' };
    if (text.match(/cloth|dress|wear/)) return { category: 'Baby Products', subcategory: 'Baby Clothing' };
    return { category: 'Baby Products', subcategory: 'Baby Care' };
  }
  
  // Car & Automotive
  if (text.match(/car|auto|vehicle|bike|motorcycle|automotive/)) {
    if (text.match(/interior|seat|dashboard/)) return { category: 'Car Accessories', subcategory: 'Interior Accessories' };
    if (text.match(/exterior|bumper|light/)) return { category: 'Car Accessories', subcategory: 'Exterior Accessories' };
    return { category: 'Car & Motorbike', subcategory: 'Car Accessories' };
  }
  
  // Toys & Games
  if (text.match(/toy|game|play|puzzle|doll|action figure/)) {
    if (text.match(/educational|learning|study/)) return { category: 'Toys & Games', subcategory: 'Educational Toys' };
    if (text.match(/action figure|superhero/)) return { category: 'Toys & Games', subcategory: 'Action Figures' };
    if (text.match(/board game|card game/)) return { category: 'Toys & Games', subcategory: 'Board Games' };
    return { category: 'Toys & Games', subcategory: 'Educational Toys' };
  }
  
  // Office & Stationery
  if (text.match(/office|stationery|pen|pencil|notebook|paper|file/)) {
    if (text.match(/pen|pencil|marker|highlighter/)) return { category: 'Stationery', subcategory: 'Pens & Pencils' };
    if (text.match(/notebook|diary|journal|book/)) return { category: 'Stationery', subcategory: 'Notebooks' };
    return { category: 'Office Products', subcategory: 'Office Supplies' };
  }
  
  // Gift Items
  if (text.match(/gift|present|hamper|combo|set/)) {
    if (text.match(/box|hamper|basket/)) return { category: 'Gift Boxes', subcategory: 'Corporate Gift Boxes' };
    if (text.match(/card|voucher/)) return { category: 'Gift Cards', subcategory: 'Physical Gift Cards' };
    return { category: 'Gift', subcategory: 'Personalized Gifts' };
  }
  
  // Religious & Spiritual
  if (text.match(/pooja|puja|religious|spiritual|god|temple|prayer|worship/)) {
    if (text.match(/idol|statue|murti/)) return { category: 'Pooja Essentials', subcategory: 'Idols' };
    if (text.match(/incense|agarbatti|dhoop/)) return { category: 'Pooja Essentials', subcategory: 'Incense' };
    if (text.match(/diya|lamp|light/)) return { category: 'Pooja Essentials', subcategory: 'Diyas' };
    return { category: 'Pooja Essentials', subcategory: 'Puja Items' };
  }
  
  // Default fallback
  return { category: 'New Arrivals', subcategory: 'Latest Products' };
}

const extractFeaturesAI = (description) => {
  if (!description) return [];
  const cleanText = description.replace(/<[^>]*>/g, ' \n ').trim();
  const candidates = cleanText.split(/\n|\.|\u2022/)
    .map(s => s.trim())
    .filter(s => s.length > 10 && s.length < 150);
  return [...new Set(candidates)].slice(0, 5);
};

const generateSkuAI = (title) => {
  if (!title) return 'SKU-MISSING-TITLE';
  const prefix = title.slice(0, 3).toUpperCase();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `DSIN-${prefix}${randomNum}`;
};

// Enhanced CSV Processing with Proper Categories
const processCsvWithEnhancedCategories = (data, log) => {
  log('[ENHANCED] Starting enhanced category mapping...');
  if (!data || data.length === 0) {
    log('[AI_ERROR] No data found in CSV.');
    return [];
  }

  const allHeaders = Object.keys(data[0]);
  log(`[AI_DEBUG] CSV Headers: ${allHeaders.join(', ')}`);

  const findKey = (possibleNames) => {
      const lowerCaseNames = possibleNames.map(n => n.toLowerCase());
      return allHeaders.find(h => lowerCaseNames.includes(h.trim().toLowerCase()));
  };

  const handleKey = findKey(['Handle']);
  const titleKey = findKey(['Title']);
  const bodyKey = findKey(['Body (HTML)', 'Description']);
  const vendorKey = findKey(['Vendor', 'Brand']);
  const priceKey = findKey(['Variant Price', 'Price']);
  const compareAtPriceKey = findKey(['Variant Compare At Price', 'Compare At Price']);
  const weightKey = findKey(['Variant Grams', 'Weight']);
  
  const imageKeys = allHeaders.filter(h => 
    h.toLowerCase().includes('image src') || 
    h.toLowerCase().includes('image url') ||
    h.toLowerCase().includes('image link')
  );

  log('[AI_SETUP] Column mapping complete.');
  log(`[AI_INFO] Found ${imageKeys.length} image columns: ${imageKeys.join(', ')}`);

  log('[AI_PASS_1] Grouping products by handle...');
  const productsByHandle = data.reduce((acc, row) => {
    const handle = row[handleKey]?.trim();
    if (handle) {
      if (!acc[handle]) acc[handle] = [];
      acc[handle].push(row);
    }
    return acc;
  }, {});
  log(`[AI_INFO] Found ${Object.keys(productsByHandle).length} unique products.`);

  log('[AI_PASS_2] Processing each product with enhanced categories...');
  const finalProducts = [];
  for (const handle in productsByHandle) {
    const rows = productsByHandle[handle];
    const masterRow = rows.find(r => r[titleKey]?.trim()) || rows[0];

    const title = masterRow[titleKey]?.trim() || `Untitled Product - ${handle}`;
    const description = masterRow[bodyKey] || '';
    const price = parseFloat(masterRow[priceKey] || 0);
    const compareAtPrice = parseFloat(masterRow[compareAtPriceKey] || 0);
    const vendor = masterRow[vendorKey] || 'BBJ';
    
    // Enhanced weight handling
    let weight = masterRow[weightKey] || 200;
    if (typeof weight === 'string') {
      weight = parseInt(weight.replace(/[^0-9]/g, '')) || 200;
    }
    
    // Collect and validate images
    const allImages = [];
    imageKeys.forEach(key => {
      rows.forEach(row => {
        const imageUrl = row[key]?.trim();
        if (imageUrl && imageUrl.startsWith('http') && !allImages.includes(imageUrl)) {
          allImages.push(imageUrl);
        }
      });
    });

    // Enhanced category mapping
    const categoryMapping = intelligentCategoryMapping(title, description, vendor);
    
    const features = extractFeaturesAI(description);
    const sku = generateSkuAI(title);
    const defaultRating = { average: 4.5, count: Math.floor(Math.random() * 50) + 5 };

    finalProducts.push({
      handle: handle,
      title: title,
      brand: vendor,
      price: price.toFixed(2),
      originalPrice: compareAtPrice > price ? compareAtPrice.toFixed(2) : null,
      weight: `${weight}g`,
      category: categoryMapping.category,
      subcategory: categoryMapping.subcategory,
      images: allImages,
      features: features,
      sku: sku,
      rating: defaultRating,
      fullDescription: description.replace(/<[^>]*>/g, ' ').trim(),
    });
    
    log(`[MAPPED] ${title} -> ${categoryMapping.category}/${categoryMapping.subcategory}`);
  }
  log('[ENHANCED] Enhanced processing complete.');
  return finalProducts;
};

const EnhancedImportCSVPage = () => {
  const [products, setProducts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const logger = useCallback((message) => {
    setLogs(prev => [message, ...prev]);
  }, []);

  const handleFileChange = (e) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setProducts([]);
    setLogs([]);
    setError('');
    setIsProcessing(true);
    logger('[SYSTEM] File selected. Parsing CSV...');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        logger('[SYSTEM] CSV Parsed. Processing with enhanced categories...');
        if (results.errors.length) {
            setError('Error parsing CSV. Check console for details.');
            logger(`[SYSTEM_ERROR] Parse errors: ${JSON.stringify(results.errors)}`);
            setIsProcessing(false);
            return;
        }
        const processed = processCsvWithEnhancedCategories(results.data, logger);
        setProducts(processed);
        setIsProcessing(false);
      },
      error: (err) => {
        setError(`Critical CSV Error: ${err.message}`);
        logger(`[SYSTEM_CRITICAL] ${err.message}`);
        setIsProcessing(false);
      },
    });
  };

  const handleSendToAdmin = async () => {
    if (products.length === 0) {
        alert("No products to send!");
        return;
    }
    
    setIsProcessing(true);
    logger('[UPLOAD] Starting database upload...');
    
    try {
      const csvProducts = products.map(p => ({
        Handle: p.handle,
        Title: p.title,
        'Body (HTML)': p.fullDescription,
        Vendor: p.brand,
        Type: p.category,
        Subcategory: p.subcategory,
        'Variant Price': parseFloat(p.price) || 0,
        'Variant Compare At Price': p.originalPrice ? parseFloat(p.originalPrice) : '',
        'Variant Grams': p.weight ? parseInt(p.weight.replace('g', '')) : 200,
        Published: 'TRUE',
        ...p.images.reduce((acc, img, idx) => {
          acc[`Image Src ${idx + 1}`] = img;
          return acc;
        }, {})
      }));
      
      const response = await fetch('/api/vendor/import-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: 1,
          products: csvProducts
        })
      });
      
      const result = await response.json();
      logger(`[UPLOAD] API Response: ${JSON.stringify(result)}`);
      
      if (result.success) {
        const count = result.processed || result.inserted || 0;
        logger(`[UPLOAD_SUCCESS] ${count} products uploaded with proper categories`);
        alert(`Success! ${count} products uploaded with proper categories.`);
        setProducts([]);
      } else {
        logger(`[UPLOAD_ERROR] ${result.message}`);
        alert(`Upload failed: ${result.message}`);
      }
    } catch (error) {
      logger(`[UPLOAD_CRITICAL] ${error.message}`);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-4 font-sans">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Enhanced CSV Import with Proper Categories</h1>
        <button 
          onClick={handleSendToAdmin}
          disabled={products.length === 0 || isProcessing}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? 'Uploading...' : 'Send to Admin for Review'}
        </button>
      </div>

      <div className="mb-4 p-4 border rounded-lg bg-gray-50">
        <label className="block text-sm font-medium text-gray-700 mb-2">Upload CSV</label>
        <input type="file" accept=".csv" onChange={handleFileChange} disabled={isProcessing} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50" />
        {isProcessing && <p className="text-blue-600 mt-2">Processing with enhanced categories...</p>}
        {error && <p className="text-red-600 mt-2">Error: {error}</p>}
      </div>

      <div className="flex gap-8">
        <div className="w-1/3">
          <h2 className="text-xl font-semibold mb-2">Processing Log</h2>
          <pre className="bg-black text-white text-xs font-mono p-4 rounded-lg h-96 overflow-y-auto">
            {logs.join('\n')}
          </pre>
        </div>
        <div className="w-2/3">
            <h2 className="text-xl font-semibold mb-2">Product Preview ({products.length})</h2>
            <div className="border rounded-lg h-96 overflow-y-auto bg-white">
              {products.length > 0 ? (
                <ul className="divide-y divide-gray-200">{products.map(p => (
                    <li key={p.handle} className="p-4 hover:bg-gray-50">
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col gap-1">
                          <img src={p.images[0] || 'https://via.placeholder.com/80x80?text=No+Image'} alt={p.title} width={80} height={80} className="rounded-md bg-gray-200 object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/80x80?text=No+Image' }} />
                          {p.images.length > 1 && (
                            <div className="flex gap-1">
                              {p.images.slice(1, 4).map((img, idx) => (
                                <img key={idx} src={img} alt={`${p.title} ${idx + 2}`} width={25} height={25} className="rounded object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/25x25?text=+' }} />
                              ))}
                              {p.images.length > 4 && (
                                <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center text-xs">+{p.images.length - 4}</div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                           <p className="text-sm text-gray-500">{p.brand} | SKU: {p.sku}</p>
                           <p className="font-semibold text-gray-800">{p.title}</p>
                           <div className="flex items-center gap-2">
                             <p className="text-lg font-bold text-blue-600">₹{p.price}</p>
                             {p.originalPrice && (
                               <p className="text-sm text-gray-500 line-through">₹{p.originalPrice}</p>
                             )}
                           </div>
                           <p className="text-xs text-gray-500">
                             <span className="font-semibold text-green-600">{p.category}</span>
                             {p.subcategory && ` > ${p.subcategory}`}
                             {p.weight && ` | Weight: ${p.weight}`}
                           </p>
                           <div className="mt-2">
                            <p className="text-xs font-bold text-gray-600">AI-Generated Features:</p>
                            <ul className="list-disc list-inside text-xs text-gray-600 pl-2">{p.features.map((f, i) => <li key={i}>{f}</li>)}</ul>
                           </div>
                        </div>
                         <div className="text-right text-xs text-gray-500 shrink-0">
                            <p>{p.images.length} image{p.images.length !== 1 ? 's' : ''}</p>
                            <p>⭐ {p.rating.average} ({p.rating.count} reviews)</p>
                        </div>
                      </div>
                    </li>
                ))}</ul>
              ) : (
                <div className="text-center py-16 text-gray-500">Upload a CSV to see enhanced preview</div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedImportCSVPage;