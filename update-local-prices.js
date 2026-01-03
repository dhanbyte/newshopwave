const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    'src/lib/data/tech.ts',
    'src/lib/data/home.ts',
    'src/lib/data/newarrivals.ts',
    'src/lib/data/customizable-products.ts',
    'src/lib/data/fashion.ts',
    'src/lib/data/products.json'
];

const basePath = process.cwd();

filesToUpdate.forEach(file => {
    const filePath = path.join(basePath, file);
    if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${file}`);
        return;
    }

    console.log(`Updating ${file}...`);
    const content = fs.readFileSync(filePath, 'utf8');

    // Regex to find original and discounted prices
    // It captures the key and the number, preserving quotes and spacing
    const updatedContent = content.replace(/((?:original|discounted|price_original|price_discounted)["']?\s*:\s*)(\d+)/g, (match, prefix, price) => {
        const oldPrice = parseInt(price);
        if (isNaN(oldPrice)) return match;
        const newPrice = Math.round(oldPrice * 1.05);
        return prefix + newPrice;
    });

    fs.writeFileSync(filePath, updatedContent);
    console.log(`Updated ${file} successfully.`);
});
