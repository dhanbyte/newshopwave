const fs = require('fs');
const path = require('path');

const filesToFix = [
    'src/lib/data/tech.ts',
    'src/lib/data/home.ts',
    'src/lib/data/newarrivals.ts',
    'src/lib/data/customizable-products.ts',
    'src/lib/data/fashion.ts'
];

const basePath = process.cwd();

filesToFix.forEach(file => {
    const filePath = path.join(basePath, file);
    if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${file}`);
        return;
    }

    console.log(`Fixing ${file}...`);
    const content = fs.readFileSync(filePath, 'utf8');

    // Divide by 1.05 to undo one of the 5% increases
    const fixedContent = content.replace(/((?:original|discounted|price_original|price_discounted)["']?\s*:\s*)(\d+)/g, (match, prefix, price) => {
        const doubleUpdatedPrice = parseInt(price);
        if (isNaN(doubleUpdatedPrice)) return match;
        const correctPrice = Math.round(doubleUpdatedPrice / 1.05);
        return prefix + correctPrice;
    });

    fs.writeFileSync(filePath, fixedContent);
    console.log(`Fixed ${file} successfully.`);
});
