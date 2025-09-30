import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export const metadata = {
  title: 'About - ZipParents',
  description: 'Learn about ZipParents and our mission',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">About ZipParents</h1>

          <div className="prose prose-blue max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700 mb-4">
                ZipParents is dedicated to creating a safe, supportive community where parents can connect with others in their local area, share experiences, ask questions, and find the support they need during their parenting journey.
              </p>
              <p className="text-gray-700 mb-4">
                Parenting can be challenging, and having a community of people who understand makes all the difference. Whether you're looking for playdate buddies, local recommendations, parenting advice, or just someone to talk to who gets it - ZipParents is here for you.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Makes Us Different</h2>

              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div className="bg-primary-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-primary-900 mb-2">Local Focus</h3>
                  <p className="text-primary-800 text-sm">
                    Connect with parents in your zip code. Find local playdates, recommendations, and real-life friendships.
                  </p>
                </div>

                <div className="bg-secondary-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">Safety First</h3>
                  <p className="text-secondary-800 text-sm">
                    18+ only platform with age verification. COPPA compliant. Comprehensive safety features and moderation.
                  </p>
                </div>

                <div className="bg-accent-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-accent-900 mb-2">Supportive Community</h3>
                  <p className="text-accent-800 text-sm">
                    No judgment zone. Diverse parenting styles welcome. Focus on support, not criticism.
                  </p>
                </div>

                <div className="bg-success-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-success-900 mb-2">Privacy Focused</h3>
                  <p className="text-success-800 text-sm">
                    Your data is protected. We never sell your information. Control what you share and with whom.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What You Can Do</h2>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li><strong>Connect Locally:</strong> Find parents in your zip code for playdates and meetups</li>
                <li><strong>Share & Learn:</strong> Post questions, share experiences, and learn from others</li>
                <li><strong>Get Recommendations:</strong> Find local pediatricians, schools, activities, and more</li>
                <li><strong>Find Support:</strong> Connect with parents who understand what you're going through</li>
                <li><strong>Build Friendships:</strong> Form real, lasting friendships with local families</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Commitment</h2>
              <p className="text-gray-700 mb-4">
                We are committed to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li><strong>Safety:</strong> Maintaining a safe environment through active moderation and safety features</li>
                <li><strong>Privacy:</strong> Protecting your personal information and giving you control over your data</li>
                <li><strong>Inclusivity:</strong> Welcoming parents from all backgrounds, family structures, and parenting styles</li>
                <li><strong>Support:</strong> Providing resources, guidelines, and tools to help you connect safely</li>
                <li><strong>Respect:</strong> Fostering a culture of kindness, understanding, and mutual support</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Community Standards</h2>
              <p className="text-gray-700 mb-4">
                We maintain high standards for our community. All members must:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Be 18 years of age or older (verified during signup)</li>
                <li>Agree to our <Link href="/terms" className="text-primary-600 hover:text-primary-700 underline">Terms of Service</Link></li>
                <li>Follow our <Link href="/guidelines" className="text-primary-600 hover:text-primary-700 underline">Community Guidelines</Link></li>
                <li>Respect other members and their choices</li>
                <li>Prioritize safety and privacy</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get Started</h2>
              <p className="text-gray-700 mb-4">
                Ready to join our community? It's free and takes just a few minutes to sign up.
              </p>
              <div className="flex gap-4">
                <Link href="/signup">
                  <Button variant="primary" size="lg">
                    Sign Up Now
                  </Button>
                </Link>
                <Link href="/safety">
                  <Button variant="outline" size="lg">
                    Safety Tips
                  </Button>
                </Link>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-4">
                Have questions or feedback? We'd love to hear from you.{' '}
                <Link href="/contact" className="text-primary-600 hover:text-primary-700 underline">
                  Get in touch
                </Link>
                .
              </p>
            </section>

            <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mt-8">
              <p className="text-primary-900 font-semibold mb-2">
                Welcome to ZipParents!
              </p>
              <p className="text-primary-800">
                We're excited to have you as part of our community. Together, we can create a supportive network where every parent feels connected, supported, and valued.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
