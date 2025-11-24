import React from 'react';

export const metadata = {
  title: 'Frequently Asked Questions | ShopWave',
  description: 'Find answers to common questions about ShopWave dropshipping, payments, and orders.',
};

export default function FAQPage() {
  const faqs = [
    {
      question: "How much are the charges to list products from ShopWave to my online store?",
      answer: "Listing any product from ShopWave to your online store is absolutely free. You can just click on the 'Push To Store' button under any product and that product will be listed in your store without any charges. You will have to only pay in case of you want to get any order dispatched from ShopWave."
    },
    {
      question: "Do you need to make any payment in the app to get the order dispatched?",
      answer: "Yes, there is a wallet system in the app. First you will have to add the balance in the wallet amount equivalent of the total cost price of the product you want to send as dropship order including the product cost, shipping charges, (COD collection fees-in case of COD order) and the tax."
    },
    {
      question: "How do I get payment in case of a prepaid order?",
      answer: "For a prepaid order, since the prepaid payment is already received from the buyer to you, in your preferred payment method, you will need to only pay the product cost price, shipping charges and tax to ShopWave. There will be no additional transaction needed."
    },
    {
      question: "How do I get payment in case of a COD order?",
      answer: "For a COD order, the payment collection will be done by the courier partner who will be delivering the order at the time of delivery. That COD amount will be then added to your wallet balance in ShopWave once the delivery of the COD order is successful. You can use that balance then to process another order in ShopWave or submit a withdraw request (minimum request amount ₹100) from your wallet & we will transfer your wallet balance to your bank account."
    },
    {
      question: "Do I need to confirm the order to get it processed?",
      answer: "Yes, you need to confirm the order to get the order process started."
    },
    {
      question: "Why are my orders showing as Failed to Sync?",
      answer: "Failed to Sync orders are those product orders that have not been pushed to your online store by ShopWave. That’s why the orders for those products are showing as Failed to Sync."
    },
    {
      question: "How can I track my order?",
      answer: "You can track your order using the tracking ID provided in your order section."
    },
    {
      question: "How many days does it take to deliver my order?",
      answer: "Delivery time depends on the various pincodes, but usually, it takes 7-10 working days to deliver an order."
    },
    {
      question: "How many days does it take to transfer my wallet amount to my bank account?",
      answer: "It usually takes 6-7 working days to transfer the amount to your bank account after you request a wallet withdrawal."
    },
    {
      question: "Is there a minimum withdrawal amount for the wallet?",
      answer: "Yes, the minimum amount required for a wallet withdrawal is ₹100."
    },
    {
      question: "What to do if your order is in NDR?",
      answer: (
        <>
          You can take action on those NDR (Non-Delivery Report) orders from the NDR section in your ShopWave panel, as mentioned below:
          <ol className="list-decimal list-inside mt-2 ml-2 space-y-1">
            <li><strong>Reattempt Delivery:</strong> Request a new delivery attempt if the issue was things like unavailability or incorrect details.</li>
            <li><strong>Return to Origin (RTO):</strong> Opt to return the order if you no longer want it.</li>
            <li><strong>Update Delivery Details:</strong> If needed, you can change the delivery address or phone number to resolve any issues.</li>
          </ol>
        </>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-purple-600 px-6 py-8 sm:px-10">
          <h1 className="text-3xl font-bold text-white text-center">
            Frequently Asked Questions
          </h1>
          <p className="mt-2 text-purple-100 text-center text-lg">
            Common questions about using ShopWave.
          </p>
        </div>

        <div className="px-6 py-8 sm:px-10 space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-start">
                <span className="text-purple-600 mr-2">Q:</span>
                {faq.question}
              </h3>
              <div className="text-gray-700 leading-relaxed pl-6">
                <span className="font-semibold text-gray-900 mr-1">Ans:</span>
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
