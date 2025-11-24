import React from 'react';

export const metadata = {
  title: 'Terms & Conditions | ShopWave',
  description: 'Read our Terms and Conditions to understand the rules and regulations for using ShopWave.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-blue-900 px-6 py-8 sm:px-10">
          <h1 className="text-3xl font-bold text-white text-center">
            Terms & Conditions
          </h1>
          <p className="mt-2 text-blue-100 text-center text-lg">
            Please read these terms carefully before using our service.
          </p>
        </div>

        <div className="px-6 py-8 sm:px-10 space-y-8 text-gray-700 leading-relaxed">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="mb-4">
              Welcome to <strong>ShopWave</strong> (“Company”, “we”, “our”, “us”)!
            </p>
            <p className="mb-4">
              These Terms of Service (“Terms”, “Terms of Service”) govern your use of our website located at <strong>shopwave.com</strong> (together or individually “Service”) operated by <strong>ShopWave</strong>.
            </p>
            <p className="mb-4">
              Our Privacy Policy also governs your use of our Service and explains how we collect, safeguard and disclose information that results from your use of our web pages.
            </p>
            <p className="mb-4">
              Your agreement with us includes these Terms and our Privacy Policy (“Agreements”). You acknowledge that you have read and understood Agreements, and agree to be bound of them.
            </p>
            <p>
              If you do not agree with (or cannot comply with) Agreements, then you may not use the Service. These Terms apply to all visitors, users and others who wish to access or use Service.
            </p>
          </section>

          {/* Communications */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Communications</h2>
            <p>
              By using our Service, you agree to subscribe to newsletters, marketing or promotional materials and other information we may send.
            </p>
          </section>

          {/* Purchases */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Purchases</h2>
            <p className="mb-4">
              If you wish to purchase any product or service made available through Service (“Purchase”), you may be asked to supply certain information relevant to your Purchase including but not limited to, your credit or debit card number, the expiration date of your card, your billing address, and your shipping information.
            </p>
            <p className="mb-4">
              You represent and warrant that: (i) you have the legal right to use any card(s) or other payment method(s) in connection with any Purchase; and that (ii) the information you supply to us is true, correct and complete.
            </p>
            <p className="mb-4">
              We may employ the use of third party services for the purpose of facilitating payment and the completion of Purchases. By submitting your information, you grant us the right to provide the information to these third parties subject to our Privacy Policy.
            </p>
            <p>
              We reserve the right to refuse or cancel your order at any time for reasons including but not limited to: product or service availability, errors in the description or price of the product or service, error in your order or other reasons.
            </p>
          </section>

          {/* Contests, Sweepstakes and Promotions */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contests, Sweepstakes and Promotions</h2>
            <p>
              Any contests, sweepstakes or other promotions (collectively, “Promotions”) made available through Service may be governed by rules that are separate from these Terms of Service. If you participate in any Promotions, please review the applicable rules as well as our Privacy Policy. If the rules for a Promotion conflict with these Terms of Service, Promotion rules will apply.
            </p>
          </section>

          {/* Content */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Content</h2>
            <p>
              Content found on or through this Service are the property of <strong>ShopWave</strong> or used with permission. You may not distribute, modify, transmit, reuse, download, repost, copy, or use said Content, whether in whole or in part, for commercial purposes or for personal gain, without express advance written permission from us.
            </p>
          </section>

          {/* Prohibited Uses */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Prohibited Uses</h2>
            <p className="mb-4">You may use Service only for lawful purposes and in accordance with Terms. You agree not to use Service:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>In any way that violates any applicable national or international law or regulation.</li>
              <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way by exposing them to inappropriate content or otherwise.</li>
              <li>To transmit, or procure the sending of, any advertising or promotional material, including any “junk mail”, “chain letter,” “spam,” or any other similar solicitation.</li>
              <li>To impersonate or attempt to impersonate Company, a Company employee, another user, or any other person or entity.</li>
              <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful, or in connection with any unlawful, illegal, fraudulent, or harmful purpose or activity.</li>
            </ul>
          </section>

          {/* Accounts */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Accounts</h2>
            <p className="mb-4">
              When you create an account with us, you guarantee that you are above the age of 18, and that the information you provide us is accurate, complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account on Service.
            </p>
            <p>
              You are responsible for maintaining the confidentiality of your account and password, including but not limited to the restriction of access to your computer and/or account.
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
            <p>
              Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of <strong>ShopWave</strong> and its licensors. Service is protected by copyright, trademark, and other laws of and foreign countries. Our trademarks may not be used in connection with any product or service without the prior written consent of <strong>ShopWave</strong>.
            </p>
          </section>

          {/* Copyright Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Copyright Policy</h2>
            <p className="mb-4">
              We respect the intellectual property rights of others. It is our policy to respond to any claim that Content posted on Service infringes on the copyright or other intellectual property rights (“Infringement”) of any person or entity.
            </p>
            <p>
              If you are a copyright owner, or authorized on behalf of one, and you believe that the copyrighted work has been copied in a way that constitutes copyright infringement, please submit your claim via email to <strong>support@shopwave.com</strong>, with the subject line: “Copyright Infringement”.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
            <p className="mb-4">
              These Terms shall be governed and construed in accordance with the laws of <strong>INDIA</strong>, specifically under the jurisdiction of <strong>Udakishunganj, Madhepura, Bihar</strong>, without regard to its conflict of law provisions.
            </p>
            <p>
              Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
            </p>
          </section>

          {/* Changes To Service */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes To Service</h2>
            <p>
              We reserve the right to withdraw or amend our Service, and any service or material we provide via Service, in our sole discretion without notice. We will not be liable if for any reason all or any part of Service is unavailable at any time or for any period.
            </p>
          </section>

          {/* Amendments To Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Amendments To Terms</h2>
            <p>
              We may amend Terms at any time by posting the amended terms on this site. It is your responsibility to review these Terms periodically. Your continued use of the Platform following the posting of revised Terms means that you accept and agree to the changes.
            </p>
          </section>

          {/* Acknowledgement */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acknowledgement</h2>
            <p>
              By using the service or other services provided by us, you acknowledge that you have read these terms of service and agree to be bound by them.
            </p>
          </section>

          {/* Legal Details */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Legal Details</h2>
            <p className="mb-4">
              If incorrect GST or any other Legal details are provided by the customer, the company will not be held responsible for any discrepancies in accounting data resulting from the same. Upload the GST Document and add the GST Number, Bank Account Details is Mandatory, If you want to get the GST benefits.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg mt-4">
              <h3 className="font-semibold mb-2">Legal Jurisdiction:</h3>
              <p>
                All legal disputes are subject to the jurisdiction of courts in <strong>Udakishunganj, Madhepura, Bihar, India</strong>.
              </p>
            </div>
          </section>

          {/* Contact Us */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p>
              Please send your feedback, comments, requests for technical support by email: <strong>support@shopwave.com</strong>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}