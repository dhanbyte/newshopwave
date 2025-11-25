import './globals.css';
import type { Metadata } from 'next';
import RootContent from './RootContent';
import { ClerkProvider } from '@clerk/nextjs';
import { ClerkAuthProvider } from '@/context/ClerkAuthContext';
import { FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';
import { Analytics } from '@vercel/analytics/next';
import SimpleGoogleAuth from '@/components/SimpleGoogleAuth';
import Script from 'next/script';


export const metadata: Metadata = {
  title: 'ShopWave - India\'s #1 Dropshipping Platform | Start Your Online Business | Wholesale Prices',
  description: 'ShopWave - India\'s leading dropshipping platform! Start your online business with 50-70% wholesale discounts. No inventory needed. Free product videos, Meta ads support, profit sharing. Join 10,000+ dropshippers earning daily. Best dropshipping site in India 2024.',
  keywords: 'dropshipping India, dropshipping business India, start dropshipping India, best dropshipping platform India, dropshipping website India, wholesale dropshipping, dropshipping suppliers India, online business India, ecommerce dropshipping, dropshipping products India, dropshipping without investment, dropshipping training India, dropshipping course India, how to start dropshipping, dropshipping for beginners, dropshipping profit, dropshipping wholesale prices, Indian dropshipping, dropshipping marketplace India, reselling business India, online selling India, work from home India, business opportunity India, ShopWave dropshipping, shopwave India, online shopping India, cheapest prices, free delivery, tech accessories, home products, ayurvedic products, best deals India, discount shopping, mobile accessories, kitchen items, buy online India, ecommerce India, shopping website India, best price India, fast delivery shopping',
  authors: [{ name: 'ShopWave' }],
  creator: 'ShopWave',
  publisher: 'ShopWave',
  applicationName: 'ShopWave - Dropshipping Platform',
  generator: 'ShopWave',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    title: 'ShopWave - India\'s #1 Dropshipping Platform | Start Your Business Today',
    description: 'Join India\'s leading dropshipping platform! Get 50-70% wholesale discounts, free product videos, Meta ads support. No inventory needed. Start earning from home. 10,000+ active dropshippers.',
    siteName: 'ShopWave Dropshipping',
    images: [{
      url: '/logo.png',
      width: 1200,
      height: 630,
      alt: 'ShopWave - Dropshipping Platform India',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShopWave - India\'s #1 Dropshipping Platform | Wholesale Prices | Start Business',
    description: 'Start your dropshipping business in India! 50-70% discounts, free videos, Meta ads support. No inventory. Join 10,000+ dropshippers earning daily.',
    creator: '@shopwave',
    site: '@shopwave',
  },

};

const WhatsAppButton = () => {
  const whatsappUrl = `https://wa.me/919157499884?text=${encodeURIComponent("Hello! I have a question about your products.")}`;
  return (
    <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="fixed bottom-10 right-5 py-10 z-50" aria-label="Contact us on WhatsApp">
       <div className="bg-green-500 text-white rounded-full p-3 shadow-lg hover:bg-green-600 transition-transform hover:scale-110">
         <FaWhatsapp size={24} aria-hidden="true" />
       </div>
    </Link>
  );
};


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
        {/* Meta Pixel Code */}
        <script
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
        
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-1S9CD9GPJS"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-1S9CD9GPJS');
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://ik.imagekit.io" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://shopwave.b-cdn.net" />
        <link rel="canonical" href="/" />
        <meta name="google-site-verification" content="shopwave-best-online-shopping-india" />
        <meta name="msvalidate.01" content="shopwave-online-shopping" />
        <meta name="yandex-verification" content="shopwave-india" />
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "ShopWave Dropshipping",
              "alternateName": ["ShopWave India", "Shop Wave", "Shop Wave India", "ShopWave Dropshipping Platform"],
              "url": "/",
              "description": "India's #1 dropshipping platform - Start your online business with wholesale prices, free product videos, Meta ads support. No inventory needed.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "/search?q={search_term_string}",
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
              "legalName": "ShopWave Dropshipping Platform",
              "brand": "ShopWave",
              "url": "/",
              "logo": "/logo.png",
              "description": "ShopWave - India's #1 dropshipping platform. Start your online business with 50-70% wholesale discounts, free product videos, Meta ads support, and profit sharing. Join 10,000+ successful dropshippers.",
              "slogan": "India's #1 Dropshipping Platform - Start Your Business Today",
              "priceRange": "₹",
              "hasOfferCatalog": true,
              "makesOffer": {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Dropshipping Business Platform",
                  "description": "Complete dropshipping solution with wholesale prices, product videos, Meta ads support"
                }
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN"
              },
              "areaServed": "IN",
              "currenciesAccepted": "INR",
              "paymentAccepted": ["Cash", "Credit Card", "Debit Card", "UPI", "Net Banking"],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-91574-99884",
                "contactType": "customer service"
              }
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
            <WhatsAppButton />
            {process.env.NODE_ENV === 'development' && (
              <div className="fixed bottom-4 left-4 bg-black text-white p-2 rounded text-xs z-50">
                <div>🔧 Debug Mode</div>
              </div>
            )}
          </ClerkAuthProvider>
        </ClerkProvider>
        <Analytics />
      </body>
    </html>
  );
}