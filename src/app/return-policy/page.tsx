import React from 'react';

export const metadata = {
  title: 'Return & Refund Policy | Wukusy',
  description: 'Read our return and refund policy to understand the terms and conditions for returns and refunds on Wukusy.',
};

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 px-6 py-8 sm:px-10">
          <h1 className="text-3xl font-bold text-white text-center">
            Return & Refund Policy
          </h1>
          <p className="mt-2 text-blue-100 text-center text-lg">
            Committed to providing a smooth and fair process for our partners and customers.
          </p>
        </div>

        <div className="px-6 py-8 sm:px-10 space-y-8 text-gray-700 leading-relaxed">
          <section>
            <p className="mb-4">
              At Wukusy, we are committed to providing high-quality products through our dropshipping platform. We understand that issues may arise with products, and we strive to ensure a smooth and fair return and refund process for both our dropshipping partners and their end customers. Please carefully review the refund and return policy below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
              Returns and Refunds for End Customers
            </h2>
            <p className="ml-11 mb-4">
              We want our customers to be fully satisfied with their purchases. Our return and refund process is designed to handle specific situations.
            </p>
            
            <div className="ml-11 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">Return Request Period</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>48-Hour Notification:</strong> To ensure we can properly assess any issues with the product, you must notify us within 48 hours of receiving the product.</li>
                  <li>Requests submitted after 48 hours may not be accepted.</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">Return Eligibility</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li><strong>Damaged or Defective Products:</strong> If the product is damaged or defective upon arrival, the customer must provide an <strong>unboxing video</strong> showing the damage. This video is required to assess the situation and determine the appropriate action. The complaint must be submitted within 48 hours of receiving the product.</li>
                  <li><strong>Missing Items:</strong> If any items are missing from the order, an <strong>unboxing video</strong> must be provided showing the contents of the package clearly. Notify us within 48 hours of receiving the order so we can investigate the situation and, if confirmed, we will issue a refund for the missing item(s) after our investigation.</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">Refund Eligibility</h3>
                <p className="text-sm mb-2">Refunds will be processed for eligible returns based on the following criteria:</p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li><strong>Damaged or Defective Products:</strong> Upon confirmation of the damage or defect through the unboxing video, a full or partial refund will be processed based on our approval. <strong>No return or refund can be processed for defective electronics items.</strong></li>
                  <li><strong>Missing Items:</strong> If we are unable to fulfill the missing item(s), we will issue a refund for the missing items.</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">Return Shipping</h3>
                <p className="text-sm">
                  <strong>Customer’s Responsibility:</strong> The customer will be responsible for the cost of return shipping. We recommend using a reliable shipping service with tracking to ensure the safe return of the product.
                </p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <h3 className="font-semibold text-red-800 mb-2">Rejection/Denial of Parcel</h3>
                <p className="text-sm mb-2">If the customer rejects or denies acceptance of a parcel after it has been dispatched, the following deductions will apply:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                  <li><strong>Shipping Charge:</strong> 2 times the original shipping charge will be deducted (this includes both forward and reverse shipping costs).</li>
                  <li>These deductions will be made before issuing any refunds.</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h3 className="font-semibold text-green-800 mb-2">Refund Process</h3>
                <p className="text-sm mb-2">
                  Once the return is received and inspected, we will notify you (the dropshipping partner) about the approval or rejection of the refund. If approved, the refund will be processed and applied to the original method of payment within <strong>7 days</strong> of approval.
                </p>
                <p className="text-sm italic">
                  Note: The refund will be issued only if the product is unused, undamaged, and in its original condition with the original packaging.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
              Refunds and Returns for Dropshipping Partners
            </h2>
            <p className="ml-11 mb-4">
              As a dropshipping partner, you are responsible for handling any customer inquiries, returns, and refunds. However, we will assist you in resolving any product-related issues that arise due to manufacturing or shipping errors.
            </p>
            
            <div className="ml-11 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">Defective or Damaged Products</h3>
                <p className="text-sm mb-2">If a product is defective or damaged, you must notify us within 48 hours of delivery. After we confirm the defect or damage, we will:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Replace the product at no additional charge, or</li>
                  <li>Issue a full refund for the product.</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">Incorrect Items</h3>
                <p className="text-sm mb-2">If an order is shipped incorrectly due to our error, we will:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Replace the item, or</li>
                  <li>Offer a full refund.</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">Missing Items</h3>
                <p className="text-sm">
                  If any items are missing from the order, you must notify us within 48 hours of receiving the order. If confirmed, we will issue a refund for the missing items.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-semibold text-blue-800 mb-2">Quality Assurance</h3>
                <p className="text-sm">
                  We perform strict quality control before shipment. If there are any issues post-shipment (e.g., defect, damage), please provide us with the required clear unboxing video and supporting documentation. We will resolve the issue promptly by offering a replacement or a refund, depending on the situation.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">3</span>
              Non-Returnable Items
            </h2>
            <p className="ml-11 mb-2">Certain items may not be eligible for return or refund, including but not limited to:</p>
            <ul className="ml-11 list-disc list-outside space-y-2 pl-4 text-gray-700">
              <li>Products that have been used, opened, or damaged by the customer.</li>
              <li>Products marked as non-returnable in the product description.</li>
              <li><strong>Electronic Products.</strong></li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">4</span>
              How to Process a Return/Refund
            </h2>
            <div className="ml-11 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">For Dropshipping Partners:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>When an end customer requests a return or refund due to a defect, damage, or incorrect item, you must notify us within <strong>48 hours</strong> of receiving the order.</li>
                <li>Submit the <strong>unboxing video</strong> and any relevant supporting documentation for us to assess the return request.</li>
                <li>Once the return is approved, follow the return process and ensure that the customer is informed. The customer will have to ship the item back to us, and after receiving the product, we will issue the refund or replacement, whichever is communicated earlier during the confirmation.</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">5</span>
              Shipping Costs
            </h2>
            <p className="ml-11">
              Shipping charges are <strong>non-refundable under all circumstances</strong>, regardless of the reason for the return. This includes both the initial shipping fees and any costs incurred for returning the product. The dropshipper will be responsible for covering the return shipping fees. We recommend using a reliable shipping service with tracking to ensure the safe return of the product.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>
              By using Wukusy's dropshipping platform, you agree to abide by the terms and conditions outlined in this policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}