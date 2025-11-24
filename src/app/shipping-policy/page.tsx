import React from 'react';

export const metadata = {
  title: 'Shipping Policy | ShopWave',
  description: 'Read our Shipping Policy to understand delivery timelines and costs.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-orange-600 px-6 py-8 sm:px-10">
          <h1 className="text-3xl font-bold text-white text-center">
            Shipping Policy
          </h1>
          <p className="mt-2 text-orange-100 text-center text-lg">
            Information regarding order processing, delivery times, and shipping costs.
          </p>
        </div>

        <div className="px-6 py-8 sm:px-10 space-y-8 text-gray-700 leading-relaxed">
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="font-bold text-yellow-800">THIS SHIPPING POLICY IS ONLY FOR INDIA ORDERS.</p>
          </div>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Time</h2>
            <p className="mb-4">
              100% of orders are shipped from our warehouse within <strong>1-2 business days</strong>. Orders placed over the weekend are dispatched on Mondays.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Delivery Timelines</h2>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Standard Shipping (Gujarat):</strong> Delivery: 6-7 business days after Dispatch</li>
              <li><strong>Standard Shipping (All Other States):</strong> Delivery: 7-10 business days after Dispatch (except few pincodes where the delivery time given by courier company can be upto 15 business days)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Tracking</h2>
            <p className="mb-4">
              Once your order has been shipped, we will update the tracking details in your order information. Please contact our customer service team if you do not receive the details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Delivery Costs</h2>
            <p className="mb-4">
              Depend Your Delivery location. Please Check Your Order Summary To Understand The Delivery Charges For Individual Products.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Failed Delivery</h2>
            <p className="mb-4">
              If the package cannot be delivered to the given shipping address due to causes ascribable to the absent cooperation of the customer (wrong or incorrect shipping address, absent receiver,) or if the customer refuses to collect the package, the package will be returned to the sender at the customer’s expense. The expense includes shipping costs incurred; this amount will be deducted from the total of the order to be refunded.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Carriers</h2>
            <p className="mb-4">
              We use DTDC, Blue Dart, and Ecom Express for deliveries which can be changed depending upon the servicable pincodes from the courier partners.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Upon Receipt of Your Order</h2>
            <p className="mb-4">
              You are advised to carefully inspect the package and goods to ensure they are intact and complete before signing for receipt of delivery. Should you find the parcel to be damaged or incomplete you must refuse delivery of the goods or sign “Damaged” then contact us on the day of delivery.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Bank Holidays</h2>
            <p className="mb-4">
              We do not deliver on a Bank Holiday so your parcel will be delivered on the next working day.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Delays and Transit Issues Policy</h2>
            <p className="mb-4">
              We are committed to delivering your orders in a timely manner. However, there are instances where shipments may experience delays or be temporarily stuck in transit. While we strive for swift deliveries, there are certain factors that can lead to delays, such as weather conditions, customs processing, and other circumstances beyond our control.
            </p>
            <p className="mb-4">
              In the event that your shipment is delayed or remains in transit for longer than expected, please be aware that it may take up to 45 days for the courier service to resolve the issue and complete the delivery. During this time, the courier company is responsible for managing any transit-related problems, including delays or lost shipments.
            </p>
            <p className="mb-4">
              Please note that we are not responsible for any delays caused by the courier company once the package leaves our facility. As such, any issues that arise after dispatch, including shipping delays, are beyond our direct control.
            </p>
            <p className="mb-4">
              We kindly ask for your patience and understanding during this period. We are doing everything possible to ensure your order is delivered as quickly as possible, but we encourage you to monitor the tracking information provided for updates on your shipment’s status.
            </p>
            <p>
              Thank you for your continued trust in us, and we appreciate your cooperation while we work through these unforeseen challenges.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
