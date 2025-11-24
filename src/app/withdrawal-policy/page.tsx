import React from 'react';

export const metadata = {
  title: 'Withdrawal Policy | Wukusy',
  description: 'Read our withdrawal policy to understand the terms and conditions for withdrawing funds from your Wukusy wallet.',
};

export default function WithdrawalPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 px-6 py-8 sm:px-10">
          <h1 className="text-3xl font-bold text-white text-center">
            Wukusy Dropshipping Platform Withdrawal Policy
          </h1>
          <p className="mt-2 text-blue-100 text-center text-lg">
            Please read carefully to understand our withdrawal terms and conditions.
          </p>
        </div>

        <div className="px-6 py-8 sm:px-10 space-y-8 text-gray-700 leading-relaxed">
          <section>
            <p className="mb-4">
              At Wukusy, we strive to provide a seamless experience for our users. Please read the following withdrawal policy carefully to understand the terms and conditions for withdrawing funds from your wallet to your bank account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
              Bank Details Requirement
            </h2>
            <p className="ml-11">
              To initiate a withdrawal from your wallet, you must ensure that your bank details are correctly entered in the profile section of your account. This is a mandatory step for processing any bank transfers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
              Minimum Withdrawal Amount
            </h2>
            <p className="ml-11">
              The minimum withdrawal amount is <strong>₹1000 INR</strong>. Any balance below this amount is not eligible for withdrawal.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">3</span>
              Bank Transfer Processing Time
            </h2>
            <div className="ml-11 space-y-4">
              <p>
                Once the withdrawal request is made, the bank transfer will typically be processed within <strong>7 working days</strong>. Please allow sufficient time for the transfer to reflect in your bank account.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-semibold text-blue-800 mb-2">Wallet Funding and Payout Policy</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li><strong>Single Active Withdrawal Rule:</strong> Only one withdrawal request can be processed at a time. If a user initiates a second withdrawal request before the first one is fully processed, the second request will be automatically held in queue until the first is completed.</li>
                  <li>Each payout request is subject to a processing window of up to 7 working days, and subsequent requests will begin processing only after the previous request is fully cleared.</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h3 className="font-semibold text-green-800 mb-2">Request Consolidation Recommendation</h3>
                <p className="text-sm mb-2">To streamline payout timelines, users are strongly encouraged to consolidate smaller amounts into a single, larger withdrawal request.</p>
                <p className="text-sm">For example, instead of submitting multiple ₹100–₹200 requests, users should aim to request payouts in consolidated amounts (e.g., ₹2,000 or ₹3,000). This minimizes delays and helps us process the entire payout more efficiently.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">4</span>
              Cancelled Bank Transfers
            </h2>
            <p className="ml-11">
              In the event that a bank transfer is cancelled due to any reason (e.g., incorrect bank details, bank refusal, or technical issues), you will be able to initiate another withdrawal request only after <strong>7 working days</strong> from the date of the cancelled transfer.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">5</span>
              Incorrect Bank Details
            </h2>
            <p className="ml-11">
              It is your responsibility to provide accurate and up-to-date bank details. Wukusy is not liable for any issues or delays caused by incorrect bank information. If the withdrawal fails due to incorrect details provided by you, we will not be responsible for any loss or inconvenience caused.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">6</span>
              Insufficient Wallet Information
            </h2>
            <p className="ml-11">
              For us to process your withdrawal, we require complete and accurate Bank Details. If your withdrawal is delayed due to insufficient or incorrect Bank Details, Wukusy will not be held responsible for any delays or issues.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">7</span>
              Handling of COD Amount Discrepancies
            </h2>
            <p className="ml-11">
              In the unlikely event that any but not limited to technical bugs or glitches result in Wukusy receiving a Cash on Delivery (COD) amount from the courier company that is less than the COD selling price specified by the Seller, Wukusy will promptly transfer to the Seller the full amount received from the courier partner against every order shipped successfully. We are dedicated to ensuring smooth transactions and will work closely with the Seller to address and resolve any discrepancies caused by such issues. The Seller acknowledges that in these rare instances, the amount transferred will reflect the actual funds received from the courier company due to the unforeseen bug or glitch.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">8</span>
              Important Notes
            </h2>
            <ul className="ml-11 list-disc list-outside space-y-2 pl-4">
              <li>You can only withdraw funds from your wallet to a bank account that you have registered in your profile section.</li>
              <li>Please ensure that the bank details provided are correct and up-to-date to avoid any delays in processing your withdrawal.</li>
              <li>Any requests for withdrawal processing that do not meet the requirements outlined in this policy will not be entertained.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">9</span>
              COD Remittance Cycle
            </h2>
            <div className="ml-11 space-y-3">
              <p>
                For all COD orders, we receive the payment from our courier partners <strong>10 days after the order is marked as delivered</strong>. This is a standard process followed by logistics companies to verify payments and reconcile transactions.
              </p>
              <p>
                Please ensure that after the COD Remittance remitted into our accounts, it will be reflected in your wallet into 24 hour, Whichever the amount will be reflected into wallet that has been paid by courier.
              </p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>
              By using Wukusy's dropshipping platform and requesting a withdrawal, you agree to abide by the terms and conditions outlined in this policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
