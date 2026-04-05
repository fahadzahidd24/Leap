export const LEGAL_DOCUMENT_KEYS = {
  PRIVACY_POLICY: "privacy-policy",
  TERMS_OF_USE: "terms-of-use",
};

export const LEGAL_DOCUMENTS = {
  [LEGAL_DOCUMENT_KEYS.PRIVACY_POLICY]: {
    title: "Privacy Policy",
    sourcePath: "docs/GITSA_Privacy_Policy.docx",
    updatedAt: "Last Updated: January 15, 2026",
    intro: [
      'GITSA ("GITSA," "we," or "us") values your privacy. This Privacy Policy explains how we collect, use, and disclose information in connection with the GITSA website, GITSA mobile applications ("Apps"), and related sales activity management services (collectively, the "Services").',
    ],
    sections: [
      {
        heading: "1. Privacy Policy Updates",
        paragraphs: [
          "We may update this Privacy Policy from time to time. Any updates will be posted on our website with the revised effective date. Continued use of the Services after any update constitutes acceptance of the updated Privacy Policy.",
        ],
      },
      {
        heading: "2. Information Collection",
        paragraphs: [
          "Personally Identifiable Information",
          "You may browse portions of our website without providing information that identifies you. However, when you register for an account or use the Services, we may collect Personally Identifiable Information, including:",
          "- Account Registration Data such as name, email address, contact information, and login credentials;",
          "- Sales Activity Data entered by users, including logged activities, schedules, targets, performance indicators, progress records, and execution outcomes;",
          "- User-Generated Content you submit through the App, including notes, comments, uploads, and structured inputs;",
          "- Device and App Permissions information where you grant access to device features such as camera, notifications, or storage;",
          "- System-Generated Data created through use of the Services, including activity summaries, performance metrics, and usage insights.",
          "- Payment transactions, if applicable, are processed by third-party payment providers. We do not store payment card information on our servers.",
          "Third-party service providers may collect technical data such as device type, IP address, and usage patterns to support analytics and system performance.",
        ],
      },
      {
        heading: "3. Automatically Collected Information",
        paragraphs: [
          'We automatically collect certain information about how users interact with the Services ("Log Data"), including IP address, browser or device type, operating system, timestamps, and feature usage. Log Data is used to operate, maintain, analyze, and improve the Services and may be aggregated into non-identifiable statistical insights.',
          "Cookies, web beacons, and similar technologies may be used to support functionality, analytics, and preferences, as described below.",
        ],
      },
      {
        heading: "4. Use of Information",
        paragraphs: [
          "We use Personally Identifiable Information to:",
          "- Provide, operate, and maintain the Services;",
          "- Enable sales activity tracking, reporting, and performance visibility;",
          "- Support manager review, monitoring, and execution discipline;",
          "- Communicate service updates, system notifications, and support responses;",
          "- Improve functionality, usability, and system reliability;",
          "- Comply with legal obligations.",
          "- Users may choose to share certain information with designated individuals or teams within the App. Shared information is disclosed only according to user-selected settings.",
          "For users in the European Union, processing is based on contractual necessity, legitimate business interests, or user consent, as applicable.",
        ],
      },
      {
        heading: "5. Children's Privacy",
        paragraphs: [
          "The Services are not intended for children under the age of 16. GITSA does not knowingly collect Personally Identifiable Information from children under 16.",
        ],
      },
      {
        heading: "6. Cookies",
        paragraphs: [
          "We use cookies to support system functionality, analyze usage, and remember user preferences. Cookies do not generally identify individuals personally.",
          "Types of cookies used include:",
          "- Necessary Cookies required for core system operation;",
          "- Analytics Cookies used to understand usage patterns and improve Services;",
          "- Preference Cookies that remember user selections and settings.",
          "Users may manage cookie preferences through browser settings. Disabling cookies may limit functionality.",
        ],
      },
      {
        heading: "7. Aggregate Information",
        paragraphs: [
          "We may collect and use information in an aggregate, anonymized form to analyze trends, usage patterns, and system performance. Aggregate data does not identify individual users.",
        ],
      },
      {
        heading: "8. Disclosure of Information",
        paragraphs: [
          "We may disclose information:",
          "- To service providers assisting in operating the Services;",
          "- When required by law or legal process;",
          "- To enforce our Terms of Use or protect system integrity;",
          "- In connection with a merger, acquisition, or asset transfer.",
          "We do not sell Personally Identifiable Information.",
        ],
      },
      {
        heading: "9. Data Retention",
        paragraphs: [
          "Personally Identifiable Information is retained only as long as necessary to support the Services, comply with legal requirements, or resolve disputes. Certain information may remain in backups or archives as required by law.",
        ],
      },
      {
        heading: "10. Account Deletion",
        paragraphs: [
          "You may request deletion of your GITSA account at any time.",
          "- In-App Deletion: Where available, you may initiate account deletion directly within the App settings.",
          "- Email Request: Alternatively, you may request account deletion by contacting us at info@gitsagroup.com using the email address associated with your account.",
          "Upon verification of your request, we will delete your account and associated Personally Identifiable Information, except where retention is required by law, regulatory obligations, dispute resolution, or legitimate business purposes. Some anonymized or aggregated data may be retained.",
        ],
      },
      {
        heading: "11. Third-Party Links",
        paragraphs: [
          "The Services may contain links to third-party websites or services not controlled by GITSA. We are not responsible for their content or privacy practices.",
        ],
      },
      {
        heading: "12. Security",
        paragraphs: [
          "We use reasonable administrative, technical, and organizational safeguards to protect data. However, no system can guarantee absolute security, and users acknowledge and accept this risk.",
        ],
      },
      {
        heading: "13. International Data Transfers",
        paragraphs: [
          "Information may be processed and stored in countries where data protection laws may differ from those in your jurisdiction. By using the Services, you consent to such transfers.",
        ],
      },
      {
        heading: "14. Your Rights and Choices",
        paragraphs: [
          "Users may have rights to:",
          "- Access, correct, or delete their information;",
          "- Request data portability;",
          "- Withdraw consent where applicable;",
          "- Object to certain processing activities.",
          "Requests may be submitted by contacting us using the details below. Identity verification may be required.",
        ],
      },
      {
        heading: "15. Contact Information",
        paragraphs: [
          "For questions or requests regarding this Privacy Policy, please contact:",
          "Email: info@gitsagroup.com",
        ],
      },
    ],
  },
  [LEGAL_DOCUMENT_KEYS.TERMS_OF_USE]: {
    title: "Terms of Use",
    sourcePath: "docs/GITSA_Terms_of_Use.docx",
    updatedAt: "Last Updated: January 15, 2026",
    intro: [
      'These Terms of Use ("Terms") govern your access to and use of the GITSA App, its related mobile applications, and associated services (collectively, the "Services"). By downloading, installing, or using the App, you agree to these Terms.',
      "If you do not agree to these Terms, do not download or use the App.",
    ],
    sections: [
      {
        heading: "1. Relationship to Apple",
        paragraphs: [
          "These Terms are between you and GITSA, not Apple Inc. Apple is not responsible for the App, its content, maintenance, or support services.",
          "Apple has no obligation to provide maintenance or support for the App. Any claims relating to the App must be directed to GITSA, not Apple.",
        ],
      },
      {
        heading: "2. License Grant",
        paragraphs: [
          "Subject to your compliance with these Terms, GITSA grants you a limited, non-exclusive, non-transferable, revocable license to download and use the App on Apple-branded devices that you own or control, as permitted by the Apple Media Services Terms and Conditions.",
          "You may not:",
          "- Distribute or make the App available over a network;",
          "- Copy, reverse engineer, decompile, or modify the App;",
          "- Use the App for unlawful purposes.",
        ],
      },
      {
        heading: "3. Eligibility",
        paragraphs: [
          "You must be at least 18 years old (or the age of majority in your jurisdiction) to use the App.",
        ],
      },
      {
        heading: "4. Account Responsibility",
        paragraphs: [
          "You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. Notify GITSA immediately of any unauthorized use.",
        ],
      },
      {
        heading: "5. Data Usage and Privacy",
        paragraphs: [
          "Your use of the App is subject to the GITSA Privacy Policy, which explains how data is collected, used, and protected. The App collects only data necessary to deliver its sales activity management functionality.",
          "GITSA does not sell personal data.",
        ],
      },
      {
        heading: "6. User-Generated Content",
        paragraphs: [
          'You retain ownership of content you submit ("User Content"). You grant GITSA a limited license to use User Content solely to operate and improve the Services.',
          "You are responsible for ensuring your User Content complies with applicable laws and does not violate third-party rights.",
        ],
      },
      {
        heading: "7. No Guaranteed Outcomes",
        paragraphs: [
          "The App is designed to support sales activity tracking and execution visibility. GITSA does not guarantee sales results, revenue outcomes, or performance improvements.",
        ],
      },
      {
        heading: "8. Third-Party Services",
        paragraphs: [
          "The App may integrate with third-party services. GITSA is not responsible for third-party content, services, or practices.",
        ],
      },
      {
        heading: "9. Disclaimer of Warranties",
        paragraphs: [
          'To the maximum extent permitted by law, the App is provided "as is" and "as available," without warranties of any kind.',
          "If the App fails to conform to any applicable warranty, you may notify Apple, and Apple may refund the purchase price (if any). Apple has no further warranty obligation whatsoever.",
        ],
      },
      {
        heading: "10. Limitation of Liability",
        paragraphs: [
          "To the maximum extent permitted by law, GITSA shall not be liable for indirect, incidental, special, or consequential damages arising from use of the App.",
        ],
      },
      {
        heading: "11. Termination",
        paragraphs: [
          "GITSA may suspend or terminate access to the App for violation of these Terms. Upon termination, access to App features may be restricted.",
        ],
      },
      {
        heading: "12. Governing Law",
        paragraphs: [
          "These Terms are governed by applicable law, without regard to conflict-of-law principles.",
        ],
      },
      {
        heading: "13. Contact Information",
        paragraphs: [
          "For support or legal inquiries related to the App, contact:",
          "Email: info@gitsagroup.com",
        ],
      },
    ],
  },
};

export const getLegalDocument = (documentKey) => LEGAL_DOCUMENTS[documentKey] || null;
