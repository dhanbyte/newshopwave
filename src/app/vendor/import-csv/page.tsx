'use client';

import { useState, useCallback } from 'react';
import Papa from 'papaparse';


// --- AI-Powered CSV Processing Engine (v10 - Header Debugging) ---

// AI Function 1: Extracts key features from a product description (body HTML).
const extractFeaturesAI = (description) => {
  if (!description) return [];
  const cleanText = description.replace(/<[^>]*>/g, ' \n ').trim();
  const candidates = cleanText.split(/\n|\.|•/)
    .map(s => s.trim())
    .filter(s => s.length > 10 && s.length < 150);
  return [...new Set(candidates)].slice(0, 5);
};

// AI Function 2: Generates a product SKU from its title.
const generateSkuAI = (title) => {
  if (!title) return 'SKU-MISSING-TITLE';
  const prefix = title.slice(0, 3).toUpperCase();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `DSIN-${prefix}${randomNum}`;
};

// AI Function 3: Smart Category & Subcategory Detection
const detectCategoryAI = (title, description, existingCategory) => {
  const text = `${title} ${description}`.toLowerCase();
  
  // Category mapping rules
  const categoryRules = {
    'Tech': [
      'headphone', 'earphone', 'bluetooth', 'wireless', 'speaker', 'charger', 'cable', 'usb',
      'phone case', 'mobile cover', 'screen protector', 'power bank', 'adapter', 'keyboard',
      'mouse', 'laptop', 'computer', 'tablet', 'smartwatch', 'fitness tracker', 'camera',
      'vr', 'virtual reality', 'gaming', 'electronic', 'gadget', 'tech', 'digital'
    ],
    'Home': [
      'kitchen', 'cooking', 'utensil', 'cookware', 'plate', 'bowl', 'cup', 'mug', 'glass',
      'bottle', 'container', 'storage', 'basket', 'organizer', 'spoon', 'fork', 'knife',
      'chopping board', 'blender', 'mixer', 'pressure cooker', 'pan', 'pot', 'kettle',
      'home', 'household', 'cleaning', 'laundry', 'bathroom', 'bedroom', 'living room'
    ],
    'Fashion': [
      'shirt', 'tshirt', 't-shirt', 'jeans', 'trouser', 'dress', 'top', 'jacket', 'hoodie',
      'shoes', 'sandal', 'slipper', 'bag', 'wallet', 'belt', 'watch', 'jewelry', 'ring',
      'necklace', 'earring', 'bracelet', 'clothing', 'apparel', 'fashion', 'wear',
      'kurta', 'saree', 'legging', 'palazzo', 'ethnic', 'formal', 'casual', 'sports'
    ],
    'New Arrivals': [
      'new', 'latest', 'trending', 'popular', 'bestseller', 'gift', 'premium', 'luxury',
      'exclusive', 'limited', 'special', 'featured', 'arrival', 'fresh'
    ]
  };
  
  // Subcategory mapping
  const subcategoryRules = {
    // Tech subcategories
    'Headphones': ['headphone', 'earphone', 'earbud', 'audio'],
    'Mobile Accessories': ['phone case', 'mobile cover', 'screen protector', 'phone holder'],
    'Mobile Chargers': ['charger', 'charging cable', 'power adapter', 'usb cable'],
    'Speakers': ['speaker', 'bluetooth speaker', 'wireless speaker'],
    'Watches': ['smartwatch', 'fitness tracker', 'wearable'],
    'Computer Accessories': ['keyboard', 'mouse', 'laptop stand', 'webcam'],
    
    // Home subcategories
    'Kitchen Tools': ['knife', 'chopping board', 'spatula', 'tongs', 'whisk'],
    'Kitchen Appliances': ['blender', 'mixer', 'pressure cooker', 'kettle', 'toaster'],
    'Cookware': ['pan', 'pot', 'frying pan', 'saucepan', 'wok'],
    'Kitchen Storage & Container': ['container', 'jar', 'storage box', 'food container'],
    'Water Bottles': ['bottle', 'water bottle', 'sipper', 'flask'],
    'Plates': ['plate', 'dinner plate', 'serving plate'],
    'Glassware': ['glass', 'tumbler', 'mug', 'cup'],
    
    // Fashion subcategories
    "Men's T-Shirts": ['mens tshirt', 'men t-shirt', 'mens casual shirt'],
    "Men's Shirts": ['mens shirt', 'formal shirt', 'dress shirt'],
    "Men's Jeans": ['mens jeans', 'denim jeans', 'mens denim'],
    "Women's Tops": ['womens top', 'ladies top', 'women shirt'],
    "Women's Dresses": ['dress', 'womens dress', 'ladies dress', 'gown'],
    "Women's Jeans": ['womens jeans', 'ladies jeans', 'women denim'],
    "Women's Kurtis": ['kurti', 'kurta', 'ethnic wear'],
    "Women's Leggings": ['legging', 'jegging', 'tights'],
    'Shoes': ['shoes', 'sneaker', 'boot', 'loafer'],
    'Sandals': ['sandal', 'chappal', 'flip flop'],
    'Bags': ['bag', 'handbag', 'backpack', 'purse', 'sling bag'],
    'Jewelry': ['jewelry', 'necklace', 'earring', 'ring', 'bracelet']
  };
  
  // First try to detect category
  let detectedCategory = existingCategory;
  let maxCategoryScore = 0;
  
  for (const [category, keywords] of Object.entries(categoryRules)) {
    const score = keywords.reduce((acc, keyword) => {
      return acc + (text.includes(keyword) ? 1 : 0);
    }, 0);
    
    if (score > maxCategoryScore) {
      maxCategoryScore = score;
      detectedCategory = category;
    }
  }
  
  // Then detect subcategory
  let detectedSubcategory = '';
  let maxSubcategoryScore = 0;
  
  for (const [subcategory, keywords] of Object.entries(subcategoryRules)) {
    const score = keywords.reduce((acc, keyword) => {
      return acc + (text.includes(keyword) ? 2 : 0); // Higher weight for exact matches
    }, 0);
    
    if (score > maxSubcategoryScore) {
      maxSubcategoryScore = score;
      detectedSubcategory = subcategory;
    }
  }
  
  // Fallback subcategory based on category
  if (!detectedSubcategory) {
    const fallbackSubcategories = {
      'Tech': 'Viral Gadget',
      'Home': 'Kitchen Tools',
      'Fashion': 'Fashion Accessories',
      'New Arrivals': 'Shopwave'
    };
    detectedSubcategory = fallbackSubcategories[detectedCategory] || 'Shopwave';
  }
  
  return {
    category: detectedCategory || 'New Arrivals',
    subcategory: detectedSubcategory,
    confidence: maxCategoryScore + maxSubcategoryScore
  };
};

// Main processing function with header logging for debugging.
const processCsvWithAIEngine = (data, log) => {
  log('[AI_START] AI Engine v10 starting...');
  if (!data || data.length === 0) {
    log('[AI_ERROR] No data found in CSV.');
    return [];
  }

  // --- **NEW: Log all headers for debugging** ---
  const allHeaders = Object.keys(data[0]);
  log(`[AI_DEBUG] CSV Headers: ${allHeaders.join(', ')}`);

  // --- Smarter Column Name Detection ---
  const findKey = (possibleNames) => {
      const lowerCaseNames = possibleNames.map(n => n.toLowerCase());
      return allHeaders.find(h => lowerCaseNames.includes(h.trim().toLowerCase()));
  };

  const handleKey = findKey(['Handle']);
  if (!handleKey) {
    log('[AI_CRITICAL] No "Handle" column found. Cannot group products.');
    return [];
  }

  const titleKey = findKey(['Title']);
  const bodyKey = findKey(['Body (HTML)', 'Description']);
  const vendorKey = findKey(['Vendor', 'Brand']);
  const priceKey = findKey(['Variant Price', 'Price']);
  const compareAtPriceKey = findKey(['Variant Compare At Price', 'Compare At Price']);
  const weightKey = findKey(['Variant Grams', 'Weight']);
  const typeKey = findKey(['Type', 'Category']);
  // Find all image columns (Image Src 1, Image Src 2, etc.)
  const imageKeys = allHeaders.filter(h => 
    h.toLowerCase().includes('image src') || 
    h.toLowerCase().includes('image url') ||
    h.toLowerCase().includes('image link')
  );

  log('[AI_SETUP] Column mapping complete.');
  if (imageKeys.length === 0) {
    log('[AI_WARNING] Could not find any image columns!');
  } else {
    log(`[AI_INFO] Found ${imageKeys.length} image columns: ${imageKeys.join(', ')}`);
  }

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

  log('[AI_PASS_2] Processing each product with AI...');
  const finalProducts = [];
  for (const handle in productsByHandle) {
    const rows = productsByHandle[handle];
    const masterRow = rows.find(r => r[titleKey]?.trim()) || rows[0];

    const title = masterRow[titleKey]?.trim() || `Untitled Product - ${handle}`;
    const description = masterRow[bodyKey] || '';
    const price = parseFloat(masterRow[priceKey] || 0);
    const compareAtPrice = parseFloat(masterRow[compareAtPriceKey] || 0);
    const weight = masterRow[weightKey] ? `${masterRow[weightKey]}g` : null;
    const existingCategory = masterRow[typeKey] || null;
    
    // AI-powered category detection
    const categoryResult = detectCategoryAI(title, description, existingCategory);
    log(`[AI_CATEGORY] ${title} -> ${categoryResult.category} > ${categoryResult.subcategory} (confidence: ${categoryResult.confidence})`);
    
    // Collect images from all image columns
    const allImages = [];
    imageKeys.forEach(key => {
      rows.forEach(row => {
        const imageUrl = row[key]?.trim();
        if (imageUrl && !allImages.includes(imageUrl)) {
          allImages.push(imageUrl);
        }
      });
    });

    const features = extractFeaturesAI(description);
    const sku = generateSkuAI(title);
    const defaultRating = { average: 4.5, count: Math.floor(Math.random() * 50) + 5 };

    finalProducts.push({
      handle: handle,
      title: title,
      brand: masterRow[vendorKey] || 'Unknown Brand',
      price: price.toFixed(2),
      originalPrice: compareAtPrice > price ? compareAtPrice.toFixed(2) : null,
      weight: weight,
      category: categoryResult.category,
      subcategory: categoryResult.subcategory,
      categoryConfidence: categoryResult.confidence,
      images: allImages,
      features: features,
      sku: sku,
      rating: defaultRating,
      fullDescription: description.replace(/<[^>]*>/g, ' ').trim(),
    });
  }
  log('[AI_COMPLETE] AI processing finished.');
  return finalProducts;
};

// --- React Component --- //

const ImportCSVPage = () => {
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
        logger('[SYSTEM] CSV Parsed. Handing off to AI Engine.');
        if (results.errors.length) {
            setError('Error parsing CSV. Check console for details.');
            logger(`[SYSTEM_ERROR] Parse errors: ${JSON.stringify(results.errors)}`);
            setIsProcessing(false);
            return;
        }
        const processed = processCsvWithAIEngine(results.data, logger);
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
      // Convert products to CSV format for API
      const csvProducts = products.map(p => ({
        Handle: p.handle,
        Title: p.title,
        'Body (HTML)': p.fullDescription,
        Vendor: p.brand,
        Type: p.category || '',
        Subcategory: p.subcategory || '',
        'Variant Price': parseFloat(p.price) || 0,
        'Variant Compare At Price': p.originalPrice ? parseFloat(p.originalPrice) : '',
        'Variant Grams': p.weight ? parseInt(p.weight.replace('g', '')) : '',
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
          vendorId: 1, // Default vendor ID
          products: csvProducts
        })
      });
      
      const result = await response.json();
      logger(`[UPLOAD] API Response: ${JSON.stringify(result)}`);
      
      if (result.success) {
        const count = result.processed || result.inserted || 0;
        logger(`[UPLOAD_SUCCESS] ${count} products uploaded to database`);
        alert(`Success! ${count} products uploaded to database for admin review.`);
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
        <h1 className="text-2xl font-bold">Import & Preview Products</h1>
        <button 
          onClick={handleSendToAdmin}
          disabled={products.length === 0 || isProcessing}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? 'Uploading...' : 'Send to Admin for Review'}
        </button>
      </div>

      <div className="mb-4 p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-green-50">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🤖</span>
          <h3 className="text-lg font-semibold text-gray-800">AI-Powered Product Import</h3>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Our AI automatically detects and categorizes your products into proper categories and subcategories:
          <span className="font-medium"> Tech, Home & Kitchen, Fashion, New Arrivals</span>
        </p>
        <label className="block text-sm font-medium text-gray-700 mb-2">Upload CSV File</label>
        <input type="file" accept=".csv" onChange={handleFileChange} disabled={isProcessing} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50" />
        {isProcessing && <p className="text-blue-600 mt-2">🔄 AI is analyzing and categorizing your products...</p>}
        {error && <p className="text-red-600 mt-2">Error: {error}</p>}
      </div>

      <div className="flex gap-8">
        <div className="w-1/3">
          <h2 className="text-xl font-semibold mb-2">AI Live Log</h2>
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
                           <div className="text-xs text-gray-500 space-y-1">
                             {p.category && (
                               <p className="flex items-center gap-2">
                                 <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                   {p.category}
                                 </span>
                                 {p.subcategory && (
                                   <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                     {p.subcategory}
                                   </span>
                                 )}
                                 {p.categoryConfidence > 0 && (
                                   <span className="text-xs text-gray-400">
                                     AI: {p.categoryConfidence}✓
                                   </span>
                                 )}
                               </p>
                             )}
                             {p.weight && <p>Weight: {p.weight}</p>}
                           </div>
                           <div className="mt-2">
                            <p className="text-xs font-bold text-gray-600">AI-Generated Features:</p>
                            <ul className="list-disc list-inside text-xs text-gray-600 pl-2">{p.features.map((f, i) => <li key={i}>{f}</li>)}</ul>
                           </div>
                        </div>
                         <div className="text-right text-xs text-gray-500 shrink-0">
                            <p>{p.images.length} image{p.images.length !== 1 ? 's' : ''}</p>
                            <p>⭐ {p.rating.average} ({p.rating.count} reviews)</p>
                            {p.fullDescription && (
                              <p className="text-xs text-gray-400 mt-1 max-w-xs truncate">{p.fullDescription.substring(0, 50)}...</p>
                            )}
                        </div>
                      </div>
                    </li>
                ))}</ul>
              ) : (
                <div className="text-center py-16 text-gray-500">Upload a CSV to see a preview</div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ImportCSVPage;
