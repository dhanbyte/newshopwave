/**
 * Shopwave WhatsApp Automation Integration
 * 
 * Helper hooks to integrate Antigravity AI with Shopwave components.
 */

import { useEffect } from 'react';
import { useCart } from './cartStore';
import { useWishlist } from './wishlistStore';
import { useAuth } from '../context/ClerkAuthContext';
import { antigravityAI, generateWaLink, logToGoogleSheets } from './antigravity-ai';

// REPLACE THIS WITH YOUR DEPLOYED GOOGLE SCRIPT URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwvpQvuM_BYYmywhb4j6cJ_OEzdcLmatZWLrKcqtYAPC_777PkvRc3lw2kA4csM-a_h/exec';

export const useShopwaveAutomation = () => {
    const { items, total } = useCart();
    const { user } = useAuth();

    // 1. Track Abandoned Carts (Simple Implementation)
    // Triggers when user has items in cart but leaves/closes (simulated here via effect cleanup or timeline)
    // Real "exit intent" is hard in SPA, so we use "Add to Cart" events to log potential leads
    useEffect(() => {
        // Debug logs
        console.log('Shopwave Automation: Checking state...', { 
            hasItems: items.length > 0, 
            hasUser: !!user, 
            itemCount: items.length 
        });

        if (items.length > 0 && user) {
            console.log('Shopwave Automation: Triggering Sheet Log');
            // Log cart activity to Google Sheets
            const payload = {
                type: 'Abandoned_Carts',
                userId: user.id,
                email: user.email,
                phone: user.phone,
                name: user.fullName,
                action: 'cart_update',
                product: items.map(i => i.name).join(', '),
                amount: total,
                itemCount: items.length
            };

            // Debounce or immediate log
            // Check if we already logged this cart state to avoid spamming
            const lastLog = sessionStorage.getItem('last_cart_log');
            const currentLogKey = `${user.id}-${items.length}-${total}`;
            
            if (lastLog !== currentLogKey) {
                // Use a small timeout to allow for rapid cart updates (e.g. quantity changes) to settle
                const timeoutId = setTimeout(() => {
                    logToGoogleSheets(GOOGLE_SCRIPT_URL, payload);
                    sessionStorage.setItem('last_cart_log', currentLogKey);
                }, 2000);

                return () => clearTimeout(timeoutId);
            }
        }
    }, [items, total, user]);

    // 2. Track Wishlist Activity
    const { ids: wishlistIds } = useWishlist();
    useEffect(() => {
        if (wishlistIds.length > 0 && user) {
            // Check if we just added items (simplistic check to avoid spam, really needs prev state comparison)
            // For now, we rely on the debouncing logic or just log periodically
            const logKey = `wishlist-${user.id}-${wishlistIds.length}`;
            const lastLog = sessionStorage.getItem('last_wishlist_log');
            
            if (lastLog !== logKey) {
                const payload = {
                    type: 'Wishlist_Activity',
                    userId: user.id,
                    phone: user.phone,
                    name: user.fullName,
                    action: 'wishlist_update',
                    itemCount: wishlistIds.length,
                    productIds: wishlistIds.join(', ') // In a real app, map IDs to names
                };
                
                logToGoogleSheets(GOOGLE_SCRIPT_URL, payload);
                sessionStorage.setItem('last_wishlist_log', logKey);
            }
        }
    }, [wishlistIds, user]);

    // 3. Generate Wishlist Share Link
    const getWishlistShareLink = (productName?: string, price?: number) => {
        if (!user || !user.phone) return null; 
        
        const targetPhone = user.phone;
        if (!targetPhone) return null;

        const product = {
            name: productName || (wishlistIds.length > 0 ? `${wishlistIds.length} items in Wishlist` : 'My Wishlist'),
            price: price || 0
        };

        const message = antigravityAI(
            { ...user, isReturning: true },
            product,
            { type: 'wishlist_reminder', language: 'hinglish', urgencyLevel: 'medium' }
        );

        return generateWaLink(targetPhone, message);
    };

    // 2. Generate Cart Recovery Link
    // Returns a WhatsApp link to send to the user to recover this cart
    const getCartRecoveryLink = () => {
        if (!user || !user.phone || items.length === 0) return null;

        const product = {
            name: items[0].name + (items.length > 1 ? ` + ${items.length - 1} others` : ''),
            price: total
        };

        const message = antigravityAI(
            { ...user, isReturning: true },
            product,
            { type: 'abandoned_cart', language: 'hinglish', urgencyLevel: 'high' }
        );

        return generateWaLink(user.phone, message);
    };

    return {
        getCartRecoveryLink,
        getWishlistShareLink,
        logEvent: (data: any) => logToGoogleSheets(GOOGLE_SCRIPT_URL, data)
    };
};
