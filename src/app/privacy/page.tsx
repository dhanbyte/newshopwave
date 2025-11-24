import React from 'react';

export const metadata = {
  title: 'Privacy Policy | ShopWave',
  description: 'Read our Privacy Policy to understand how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-green-600 px-6 py-8 sm:px-10">
          <h1 className="text-3xl font-bold text-white text-center">
            Privacy Policy
          </h1>
          <p className="mt-2 text-green-100 text-center text-lg">
            We value your privacy and are committed to protecting your personal data.
          </p>
        </div>

        <div className="px-6 py-8 sm:px-10 space-y-8 text-gray-700 leading-relaxed">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="mb-4">
              Welcome to <strong>ShopWave</strong>.
            </p>
            <p className="mb-4">
              <strong>ShopWave</strong> (“us”, “we”, “our”) operates <strong>shopwave.com</strong> (hereinafter referred to as “Service”).
            </p>
            <p className="mb-4">
              Our Privacy Policy governs your visit to <strong>shopwave.com</strong>, and explains how we collect, safeguard and disclose information that results from your use of our Service.
            </p>
            <p>
              We use your data to provide and improve Service. By using Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, the terms used in this Privacy Policy have the same meanings as in our Terms and Conditions.
            </p>
          </section>

          {/* Information Collection and Use */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Collection and Use</h2>
            <p>
              We collect several different types of information for various purposes to provide and improve our Service to you.
            </p>
          </section>

          {/* Types of Data Collected */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Types of Data Collected</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Personal Data</h3>
            <p className="mb-4">
              While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you (“Personal Data”). Personally identifiable information may include, but is not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Email address</li>
              <li>First name and last name</li>
              <li>Phone number</li>
              <li>Address, Country, State, Province, ZIP/Postal code, City</li>
              <li>Cookies and Usage Data</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">Usage Data</h3>
            <p className="mb-4">
              We may also collect information that your browser sends whenever you visit our Service or when you access Service by or through any device (“Usage Data”).
            </p>
          </section>

          {/* Use of Data */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Use of Data</h2>
            <p className="mb-4"><strong>ShopWave</strong> uses the collected data for various purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and maintain our Service;</li>
              <li>To notify you about changes to our Service;</li>
              <li>To allow you to participate in interactive features of our Service when you choose to do so;</li>
              <li>To provide customer support;</li>
              <li>To gather analysis or valuable information so that we can improve our Service;</li>
              <li>To monitor the usage of our Service;</li>
              <li>To detect, prevent and address technical issues;</li>
            </ul>
          </section>

          {/* Retention of Data */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Retention of Data</h2>
            <p>
              We will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.
            </p>
          </section>

          {/* Transfer of Data */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Transfer of Data</h2>
            <p className="mb-4">
              Your information, including Personal Data, may be transferred to – and maintained on – computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction.
            </p>
            <p className="mb-4">
              If you are located outside INDIA and choose to provide information to us, please note that we transfer the data, including Personal Data, to INDIA and process it there.
            </p>
            <p>
              <strong>ShopWave</strong> will take all the steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy.
            </p>
          </section>

          {/* Security of Data */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Security of Data</h2>
            <p>
              The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>
          </section>

          {/* Contact Us */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us by email: <strong>support@shopwave.com</strong>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}