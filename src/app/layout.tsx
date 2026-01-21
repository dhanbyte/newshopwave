import './globals.css';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import RootContent from './RootContent';
import { ClerkProvider } from '@clerk/nextjs';
import { ClerkAuthProvider } from '../context/ClerkAuthContext';
import { FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';
import { Analytics } from '@vercel/analytics/next';
import SimpleGoogleAuth from '../components/SimpleGoogleAuth';
import Script from 'next/script';
import PushNotificationManager from '../components/PushNotificationManager';
const WhatsAppAutomationData = dynamic(() => import('../components/WhatsAppAutomationData'), { 
  ssr: false,
  loading: () => null 
});

const PhoneCollectionModal = dynamic(() => import('../components/PhoneCollectionModal'), {
  ssr: false,
  loading: () => null
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  if (!clerkPublishableKey) {
    throw new Error('Missing Clerk Publishable Key');
  }
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to critical domains for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://ik.imagekit.io" />
        <link rel="preconnect" href="https://checkout.razorpay.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://shopwave.b-cdn.net" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* Optimized font loading with display=swap */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet" />
        
        <link rel="canonical" href="/" />
        <meta name="google-site-verification" content="shopwave-best-online-shopping-india" />
        <meta name="msvalidate.01" content="shopwave-online-shopping" />
        <meta name="yandex-verification" content="shopwave-india" />
        
        {/* Razorpay - Load asynchronously */}
        <script async src="https://checkout.razorpay.com/v1/checkout.js"></script>
        
        {/* Meta Pixel Code - Deferred for better performance */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '859363506780652');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img height="1" width="1" style={{display:'none'}}
            src="https://www.facebook.com/tr?id=859363506780652&ev=PageView&noscript=1"
          />
        </noscript>
        {/* End Meta Pixel Code */}
        
        {/* Google Analytics - Deferred for better performance */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1S9CD9GPJS"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-1S9CD9GPJS');
            `,
          }}
        />

        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "ubpn594hsu");
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "ShopWave India",
              "alternateName": ["ShopWave", "Shop Wave", "Shop Wave India", "ShopWave Online Shopping"],
              "url": "https://www.shopwave.social",
              "description": "ShopWave - India's favorite online shopping destination. Discover latest gadgets, home essentials, fashion and more at unbelievable prices.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.shopwave.social/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "ShopWave",
              "legalName": "ShopWave Online Shopping India",
              "brand": "ShopWave",
              "url": "https://www.shopwave.social",
              "logo": "https://www.shopwave.social/logo.png",
              "image": "https://www.shopwave.social/logo.png",
              "description": "ShopWave - India's #1 online shopping platform. Explore a wide range of products with 50-70% discounts. Join millions of happy shoppers.",
              "slogan": "ShopWave - Quality Products, Unbeatable Prices",
              "foundingDate": "2024",
              "priceRange": "₹",
              "hasOfferCatalog": true,
              "makesOffer": {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Online Retail Shopping",
                  "description": "Wide range of electronics, home decor, and fashion items at wholesale prices"
                }
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN",
                "addressRegion": "India"
              },
              "areaServed": {
                "@type": "Country",
                "name": "India"
              },
              "currenciesAccepted": "INR",
              "paymentAccepted": ["Cash on Delivery", "Credit Card", "Debit Card", "UPI", "Net Banking", "Razorpay"],
              "contactPoint": [
                {
                  "@type": "ContactPoint",
                  "telephone": "+91-91574-99884",
                  "contactType": "customer service",
                  "availableLanguage": ["Hindi", "English"],
                  "areaServed": "IN",
                  "contactOption": "TollFree"
                },
                {
                  "@type": "ContactPoint",
                  "telephone": "+91-91574-99884",
                  "contactType": "sales",
                  "availableLanguage": ["Hindi", "English"],
                  "areaServed": "IN"
                },
                {
                  "@type": "ContactPoint",
                  "telephone": "+91-91574-99884",
                  "contactType": "technical support",
                  "availableLanguage": ["Hindi", "English"],
                  "areaServed": "IN"
                }
              ],
              "sameAs": [
                "https://www.youtube.com/@shopwave",
                "https://www.instagram.com/shopwave.in",
                "https://wa.me/919157499884",
                "https://www.facebook.com/shopwave",
                "https://twitter.com/shopwave",
                "https://www.shopwave.social"
              ],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "10000",
                "bestRating": "5",
                "worstRating": "1"
              },
              "numberOfEmployees": {
                "@type": "QuantitativeValue",
                "value": "50"
              },
              "knowsAbout": [
                "Dropshipping",
                "E-commerce",
                "Wholesale",
                "Online Business",
                "Digital Marketing",
                "Product Sourcing",
                "Inventory Management"
              ]
            })
          }}
        />
      </head>
      <body className="font-body antialiased bg-white">
        <Script id="clerk-error-handler" strategy="beforeInteractive">
          {`
            // Handle Clerk chunk loading errors
            window.addEventListener('error', function(e) {
              if (e.message && e.message.includes('Loading chunk') && e.message.includes('clerk')) {
                console.warn('Clerk chunk loading error detected, reloading...');
                // Clear Clerk cache and reload
                if (window.localStorage) {
                  Object.keys(window.localStorage).forEach(key => {
                    if (key.includes('clerk')) {
                      window.localStorage.removeItem(key);
                    }
                  });
                }
                // Reload page once
                if (!sessionStorage.getItem('clerk_reload_attempted')) {
                  sessionStorage.setItem('clerk_reload_attempted', 'true');
                  setTimeout(() => window.location.reload(), 1000);
                }
              }
            }, true);
            
            // Clear reload flag after successful load
            window.addEventListener('load', function() {
              setTimeout(() => {
                sessionStorage.removeItem('clerk_reload_attempted');
              }, 2000);
            });
          `}
        </Script>
        <ClerkProvider 
          publishableKey={clerkPublishableKey}
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-none"
            }
          }}
        >
          <ClerkAuthProvider>
            <RootContent>{children}</RootContent>
            <SimpleGoogleAuth />
            <WhatsAppAutomationData />
            <PhoneCollectionModal />
            {process.env.NODE_ENV === 'development' && (
              <div className="fixed bottom-4 left-4 bg-black text-white p-2 rounded text-xs z-50">
                <div>🔧 Debug Mode</div>
              </div>
            )}
          </ClerkAuthProvider>
        </ClerkProvider>
        
        <PushNotificationManager />
        <Analytics />
      </body>
    </html>
  );
}