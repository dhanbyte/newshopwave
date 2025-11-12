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
      price: parseFloat(masterRow[priceKey] || 0).toFixed(2),
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
    alert(`Simulating push to admin: The following ${products.length} products would be saved to a review file.\n(This is a frontend demo - no file is actually saved in this step)`);
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
          Send to Admin for Review
        </button>
      </div>

      <div className="mb-4 p-4 border rounded-lg bg-gray-50">
        <label className="block text-sm font-medium text-gray-700 mb-2">Upload CSV</label>
        <input type="file" accept=".csv" onChange={handleFileChange} disabled={isProcessing} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50" />
        {isProcessing && <p className="text-blue-600 mt-2">Processing, please wait...</p>}
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
                        <img src={p.images[0] || 'https://via.placeholder.com/80x80?text=No+Image'} alt={p.title} width={80} height={80} className="rounded-md bg-gray-200 object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/80x80?text=No+Image' }} />
                        <div className="flex-grow">
                           <p className="text-sm text-gray-500">{p.brand} | SKU: {p.sku}</p>
                           <p className="font-semibold text-gray-800">{p.title}</p>
                           <p className="text-lg font-bold text-blue-600">₹{p.price}</p>
                           <div className="mt-2">
                            <p className="text-xs font-bold text-gray-600">AI-Generated Features:</p>
                            <ul className="list-disc list-inside text-xs text-gray-600 pl-2">{p.features.map((f, i) => <li key={i}>{f}</li>)}</ul>
                           </div>
                        </div>
                         <div className="text-right text-xs text-gray-500 shrink-0">
                            <p>{p.images.length} images</p>
                            <p>⭐ {p.rating.average} ({p.rating.count} reviews)</p>
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
