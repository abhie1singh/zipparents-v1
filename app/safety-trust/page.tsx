import { Metadata } from 'next';
import Link from 'next/link';
import { Shield, CheckCircle, Lock, Eye, Flag, UserX } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Safety & Trust | ZipParents - Your Security is Our Priority',
  description: 'Learn how ZipParents keeps your family safe with age verification, privacy protection, content moderation, and community guidelines.',
  openGraph: {
    title: 'Safety & Trust | ZipParents',
    description: 'Your security is our priority. Learn about our safety features and community guidelines.',
    type: 'website',
  },
};

const safetyFeatures = [
  {
    icon: CheckCircle,
    title: 'Age Verification',
    description: 'All users must verify they are 18+ before joining our community. We use secure verification methods to ensure only parents and caregivers can access the platform.',
    features: [
      'ID verification process',
      'Automated age checks',
      'Manual review when needed',
      'Continuous monitoring',
    ],
  },
  {
    icon: Lock,
    title: 'Privacy Protection',
    description: 'Your personal information is encrypted and protected. We never share your data with third parties without your explicit consent.',
    features: [
      'End-to-end encryption',
      'Secure data storage',
      'GDPR compliant',
      'Control your visibility',
    ],
  },
  {
    icon: Eye,
    title: 'Content Moderation',
    description: 'Our team actively monitors all content to ensure community guidelines are followed and inappropriate content is removed.',
    features: [
      '24/7 monitoring',
      'AI-powered detection',
      'Human review team',
      'Quick response times',
    ],
  },
  {
    icon: Shield,
    title: 'Community Guidelines',
    description: 'We maintain a safe and supportive environment through clear community guidelines that all members must follow.',
    features: [
      'Respectful interactions',
      'No harassment or bullying',
      'Age-appropriate content',
      'Transparent policies',
    ],
  },
  {
    icon: Flag,
    title: 'Report System',
    description: 'Easily report any concerning behavior, content, or safety issues. Our team reviews all reports promptly.',
    features: [
      'One-click reporting',
      'Anonymous submissions',
      'Fast investigation',
      'Action updates',
    ],
  },
  {
    icon: UserX,
    title: 'Block & Control',
    description: 'You have full control over your experience. Block users, control who can contact you, and manage your privacy settings.',
    features: [
      'Block any user',
      'Control message requests',
      'Adjust privacy settings',
      'Safe browsing mode',
    ],
  },
];

export default function SafetyTrustPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="w-20 h-20 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Safety & Trust
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Your family's safety is our top priority. Learn how we protect our community and ensure a secure environment for all parents.
          </p>
        </div>
      </section>

      {/* Safety Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {safetyFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community Guidelines Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Our Community Standards
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            We expect all members to treat each other with respect and kindness. Our community guidelines ensure ZipParents remains a safe and welcoming space for all families.
          </p>
          <Link
            href="/guidelines"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Read Full Guidelines
          </Link>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Questions About Safety?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Our safety team is here to help. If you have questions or concerns about safety and privacy, we're always here to listen.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Contact Safety Team
          </Link>
        </div>
      </section>
    </div>
  );
}
