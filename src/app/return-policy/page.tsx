import React from 'react';
import { ShieldCheck, Video, PackageX, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Replacement Policy | ShopWave',
  description: 'Our replacement and refund policy for shopping on ShopWave.',
};

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-brand px-6 py-10 sm:px-10 text-white text-center">
          <ShieldCheck className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h1 className="text-3xl sm:text-4xl font-black mb-2">
            Replacement & Refund Policy
          </h1>
          <p className="text-blue-100 text-lg">
            Shop with confidence. We ensure product quality and reliable shipping.
          </p>
        </div>

        <div className="px-6 py-8 sm:px-10 space-y-10 text-gray-700 leading-relaxed">
          {/* Important Highlight */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-amber-600 mr-3 shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-amber-900 mb-1">Mandatory Unboxing Video</h3>
                <p className="text-amber-800">
                  To be eligible for a replacement, customers <strong>MUST record a clear, continuous unboxing video</strong> starting from before the seal is broken. Without proof of unboxing, no replacement requests will be entertained.
                </p>
              </div>
            </div>
          </div>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <PackageX className="w-6 h-6 text-brand mr-3" />
              Replacement Only (No Returns)
            </h2>
            <div className="space-y-4 ml-9">
              <p>
                At ShopWave, we follow a <strong>Replacement-Only Policy</strong>. We do not provide returns or cash refunds once an order is successfully delivered unless the product is found to be damaged or defective upon arrival.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Replacement is only applicable for <strong>damaged, defective, or incorrect products</strong>.</li>
                <li>Requests for replacement must be raised within <strong>24 hours</strong> of delivery.</li>
                <li>The original packaging and all accessories must be preserved.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Video className="w-6 h-6 text-brand mr-3" />
              Proof of Damage
            </h2>
            <div className="ml-9">
              <p className="mb-4">
                Since we provide the cheapest prices by working directly with verified sellers, we require strict proof to process replacements:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-2">✅ Valid Proof</h4>
                  <p className="text-sm">Continuous video showing the shipping label, all sides of the box, and the actual unboxing process.</p>
                </div>
                <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                  <h4 className="font-bold text-red-900 mb-2">❌ Invalid Proof</h4>
                  <p className="text-sm text-red-800">Photos alone, edited videos, or videos recorded after the package was already opened.</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <CheckCircle2 className="w-6 h-6 text-brand mr-3" />
              Non-Refundable Payments
            </h2>
            <div className="ml-9">
              <p>
                All prepaid payments made via <strong>Razorpay, UPI, or Cards are non-refundable</strong>. In case of a successful replacement request where the item is out of stock, we will provide a wallet credit or a coupon of the same value for your next purchase.
              </p>
            </div>
          </section>

          <section className="bg-gray-900 text-white p-6 sm:p-8 rounded-2xl">
            <h2 className="text-xl font-bold mb-4">GST Verified Seller</h2>
            <p className="text-gray-400 mb-4">
              ShopWave is a platform for GST verified sellers only. We maintain total transparency in our operations.
            </p>
            <div className="inline-block bg-white/10 px-4 py-2 rounded-lg font-mono text-brand-light">
              GSTIN: 10ELHPD1779R1ZQ
            </div>
          </section>

          <div className="pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              By placing an order on ShopWave, you acknowledge that you have read and agreed to this Replacement Policy.
            </p>
            <p className="mt-2 text-sm font-medium text-brand">
              Contact Support: support@shopwave.social
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
