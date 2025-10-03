import { Metadata } from 'next';
import Link from 'next/link';
import { UserPlus, Users, MessageCircle, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'How It Works | ZipParents - Connect with Local Parents',
  description: 'Learn how ZipParents helps you connect with local parents in your neighborhood. Simple steps to build your parenting community.',
  openGraph: {
    title: 'How It Works | ZipParents',
    description: 'Learn how ZipParents helps you connect with local parents in your neighborhood.',
    type: 'website',
  },
};

const steps = [
  {
    icon: UserPlus,
    title: 'Sign Up',
    description: 'Create your free account in minutes. We verify all parents to ensure a safe community.',
  },
  {
    icon: Users,
    title: 'Create Profile',
    description: 'Share your interests, children\'s ages, and what you\'re looking for in a parenting community.',
  },
  {
    icon: MessageCircle,
    title: 'Connect',
    description: 'Find and connect with parents in your ZIP code. Share experiences, advice, and support.',
  },
  {
    icon: Calendar,
    title: 'Build Community',
    description: 'Organize playdates, join local events, and build lasting friendships with nearby families.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How ZipParents Works
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with local parents in just a few simple steps. Building your parenting community has never been easier.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <Icon className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="absolute top-4 left-4 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-blue-600 rounded-2xl p-12 shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of parents building meaningful connections in their local communities.
            </p>
            <Link
              href="/signup"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
