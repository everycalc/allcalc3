import React from 'react';

export const PrivacyPolicyContent = () => (
    <div className="prose prose-sm prose-invert text-theme-secondary max-w-none">
        <p><strong>Effective Date:</strong> {new Date().toLocaleDateString()}</p>

        <h4>1. Introduction</h4>
        <p>
            Welcome to All Calculation. We are committed to protecting your privacy. This Privacy Policy explains how we handle information in connection with our web application. Since our application operates entirely on your device, we do not collect, store, or transmit any of your personal data.
        </p>

        <h4>2. Information We Handle</h4>
        <p>
            We do not collect any personal information. All data you input into the calculators, your calculation history, and your theme/layout preferences are stored locally on your device using your browser's localStorage. This data is not sent to any server and is accessible only by you.
        </p>

        <h4>3. Advertising and Cookies</h4>
        <p>
            We use Google AdSense to display advertisements on our site. Google and other third-party vendors use cookies to serve ads based on a user's prior visits to our website or other websites on the internet.
        </p>
        <ul>
            <li>Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our site and/or other sites on the Internet.</li>
            <li>You may opt out of personalized advertising by visiting Google's <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Ads Settings</a>.</li>
            <li>Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.aboutads.info/choices</a>.</li>
        </ul>
        <p>
            Because we do not control the data collection practices of these third parties, we encourage you to review their privacy policies.
        </p>
        
        <h4>4. Data Storage and Security</h4>
        <p>
            Your calculation history and customization settings are stored in your browser's localStorage. This means the data remains on your computer and is not transferred to us. Clearing your browser's cache or data will permanently delete this information.
        </p>

        <h4>5. Changes to This Privacy Policy</h4>
        <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
        </p>

        <h4>6. Contact Us</h4>
        <p>
            If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:everycalculation@gmail.com" className="text-primary hover:underline">everycalculation@gmail.com</a>
        </p>
    </div>
);


export const TermsOfServiceContent = () => (
    <div className="prose prose-sm prose-invert text-theme-secondary max-w-none">
        <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
        
        <h4>1. Acceptance of Terms</h4>
        <p>By accessing and using the All Calculation web application ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use the Service.</p>
        
        <h4>2. Use of the Service</h4>
        <p>The Service is provided for your personal and non-commercial use. The calculations provided are for informational purposes only and should not be considered professional financial, medical, or legal advice. You agree to use the Service at your own risk.</p>
        
        <h4>3. Disclaimer of Warranties</h4>
        <p>The Service is provided on an "as is" and "as available" basis. All Calculation makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights. Further, All Calculation does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.</p>
        
        <h4>4. Limitation of Liability</h4>
        <p>In no event shall All Calculation or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on All Calculation's website, even if All Calculation or an authorized representative has been notified orally or in writing of the possibility of such damage.</p>
        
        <h4>5. Revisions and Errata</h4>
        <p>The materials appearing on the Service could include technical, typographical, or photographic errors. We do not warrant that any of the materials on its website are accurate, complete, or current. We may make changes to the materials contained on its website at any time without notice.</p>

        <h4>6. Governing Law</h4>
        <p>Any claim relating to the Service shall be governed by the laws of our jurisdiction without regard to its conflict of law provisions.</p>
    </div>
);


export const AboutUsContent = () => (
    <div className="prose prose-sm prose-invert text-theme-secondary max-w-none">
        <h4>Our Mission</h4>
        <p>
            At "All Calculation", our mission is to provide a comprehensive, free, and easy-to-use suite of calculators for a wide range of needs. Whether you're a business owner optimizing your e-commerce store, a student working on a math problem, an investor planning your financial future, or just someone trying to split a dinner bill, we aim to have the right tool for you.
        </p>

        <h4>Why We Built This</h4>
        <p>
            We believe that access to powerful tools shouldn't be complicated or expensive. We noticed that many people need to perform various calculations daily but often have to jump between different websites or apps, each with its own interface and often cluttered with intrusive ads. We wanted to create a single, unified platform that is clean, fast, customizable, and works seamlessly offline. We focus on providing not just tools, but also clear explanations and context to help you understand the calculations you perform, creating a high-quality resource for everyone.
        </p>

        <h4>Our Features</h4>
        <ul>
            <li><strong>Wide Range of Calculators:</strong> From basic math and science to complex finance and business metrics.</li>
            <li><strong>User-Focused Design:</strong> A clean, intuitive interface that's easy to navigate.</li>
            <li><strong>Customization:</strong> Personalize your experience with different themes, colors, and layouts.</li>
            <li><strong>Offline Functionality:</strong> Most of our calculators work even without an internet connection.</li>
            <li><strong>Privacy First:</strong> Your calculation history and preferences are stored on your device, not on our servers.</li>
        </ul>
        
        <h4>Feedback Welcome</h4>
        <p>
            This app is built for you. If you have any feedback, suggestions, or ideas for a new calculator you'd like to see, please don't hesitate to reach out via the "Feedback & Request" option in the menu.
        </p>
    </div>
);

export const DisclaimerContent = () => (
    <div className="prose prose-sm prose-invert text-theme-secondary max-w-none">
        <h4>Disclaimer</h4>
        <p>
            The information and calculations provided by the "All Calculation" web application are for general informational purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information or calculations on the site.
        </p>
        <p>
            The calculators are not a substitute for professional advice. Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site. Your use of the site and your reliance on any information on the site is solely at your own risk.
        </p>
        <p>
            We strongly recommend that you consult with a qualified professional (such as a financial advisor, medical professional, or engineer) before making any decisions based on the calculations from this application.
        </p>
    </div>
);