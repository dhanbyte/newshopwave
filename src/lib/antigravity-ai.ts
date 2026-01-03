/**
 * Antigravity AI - Core Message Generation & Tracking
 * 
 * This module handles:
 * 1. AI-driven message generation based on context
 * 2. Smart pricing and urgency injection
 * 3. Google Sheets logging integration
 * 4. WhatsApp redirect link generation
 */

// --- Types ---

export interface UserContext {
    name?: string;
    phone?: string;
    city?: string;
    isReturning?: boolean;
    lastPurchaseDate?: Date;
}

export interface ProductContext {
    name: string;
    price: number;
    image?: string;
    category?: string;
}

export interface MessageOptions {
    type: 'abandoned_cart' | 'order_confirmation' | 'welcome' | 'cod_verification' | 'wishlist_reminder';
    language: 'en' | 'hi' | 'hinglish';
    urgencyLevel: 'low' | 'medium' | 'high';
}

// --- Constants ---

const GREETINGS = {
    morning: ['Good Morning', 'Suprabhat', 'Rise and Shine'],
    afternoon: ['Good Afternoon', 'Namaste'],
    evening: ['Good Evening', 'Shubh Sandhya']
};

const URGENCY_PHRASES = {
    low: ['', 'Check this out', 'Ek baar dekho'],
    medium: ['Limited Stock', 'Jaldi kijiye', 'Selling Fast'],
    high: ['Last 2 units left!', 'Abhi order karein nahi to khatam', 'Price increasing soon!']
};

// --- Core Functions ---

/**
 * Generates an AI-optimized message based on user and product context.
 */
export function antigravityAI(
    user: UserContext,
    product: ProductContext | null,
    options: MessageOptions
): string {
    const timeOfDay = getTimeOfDay();
    const greeting = getRandom(GREETINGS[timeOfDay as keyof typeof GREETINGS]);
    const urgency = URGENCY_PHRASES[options.urgencyLevel];
    
    let message = '';

    // Message Templates
    if (options.type === 'abandoned_cart' && product) {
        if (options.language === 'hinglish') {
            message = `
👋 ${greeting} ${user.name || 'Ji'}!

Aapne *${product.name}* cart me chhod diya hai. 🛒
Ye item bohot jaldi bik raha hai! 🔥

💰 Price: ₹${product.price}
⚠️ ${urgency}

👇 Abhi complete karein:
`;
        } else {
            message = `
👋 ${greeting} ${user.name || 'there'}!

You left *${product.name}* in your cart. 🛒
items are selling out fast! 🔥

💰 Price: ₹${product.price}
⚠️ ${urgency}

👇 Complete your order now:
`;
        }
    } else if (options.type === 'cod_verification') {
        message = `
नमस्ते ${user.name || 'Ji'}! 🙏

ShopWave se aapka order confirm karne ke liye call/message kar rahe hain.
📦 Item: *${product?.name || 'Your Order'}*
💰 Amount: ₹${product?.price || 0}
🚚 Delivery: 3-5 Days

Kya hum ye order dispatch kar dein? (Yes/No reply karein)
`;
    } else if (options.type === 'wishlist_reminder') {
        if (options.language === 'hinglish') {
            message = `
👋 ${greeting} ${user.name || 'Ji'}!

Are! Aapka pasandida item *${product?.name}* abhi bhi wishlist me hai. 😍
Isse pehle ki *Out of Stock* ho jaye, abhi apna order place karein!

💰 Price: ₹${product?.price || 'Best Price'}
🚚 Free Delivery Available!

👇 Yahan click karke kharidein:
`;
        } else {
            message = `
👋 ${greeting} ${user.name || 'there'}!

Your favorite item *${product?.name}* is still waiting in your wishlist. 😍
Don't let it go *Out of Stock*!

💰 Price: ₹${product?.price || 'Best Price'}
🚚 Free Delivery Available!

👇 Grab it now:
`;
        }
    }

    return message.trim();
}

/**
 * Logs event data to Google Sheets via the Apps Script Web App.
 * NOTE: You must deploy the Google Apps Script and provide the URL.
 */
export async function logToGoogleSheets(
    scriptUrl: string,
    data: any
): Promise<boolean> {
    if (!scriptUrl) {
        console.warn('Antigravity AI: No Google Script URL provided for logging.');
        return false;
    }

    try {
        // Use 'no-cors' mode with text/plain to avoid CORS preflight
        // Google Apps Script `e.postData.contents` will still receive the JSON string
        console.log('Antigravity AI: Sending data to Sheets...', data);
        
        await fetch(scriptUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'text/plain', 
            },
            body: JSON.stringify({
                timestamp: new Date().toISOString(),
                ...data
            })
        });
        console.log('Antigravity AI: Data sent (no-cors mode - success assumed)');
        return true;
    } catch (error) {
        console.error('Antigravity AI: Logging failed', error);
        return false;
    }
}

/**
 * Generates a WhatsApp redirect URL.
 */
export function generateWaLink(phone: string, message: string): string {
    const cleanPhone = phone.replace(/\D/g, '');
    const validPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    return `https://wa.me/${validPhone}?text=${encodeURIComponent(message)}`;
}

// --- Helpers ---

function getTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
}

function getRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}
