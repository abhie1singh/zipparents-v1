import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Safety Tips - ZipParents',
  description: 'Safety tips for using ZipParents safely',
};

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Safety Tips</h1>
          <p className="text-gray-600 mb-8">
            Your safety and the safety of your family is our top priority. Follow these guidelines to stay safe while using ZipParents.
          </p>

          <div className="prose prose-blue max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Protecting Your Privacy</h2>

              <div className="bg-primary-50 border-l-4 border-primary-500 p-4 mb-4">
                <p className="text-primary-900 font-semibold">Rule #1: Never share your full address publicly</p>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">What to Share</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Your zip code or general neighborhood</li>
                <li>Public places you frequent (parks, libraries)</li>
                <li>General availability for playdates</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">What NOT to Share Publicly</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Your full home address</li>
                <li>Your children's school names or locations</li>
                <li>Your children's full names</li>
                <li>Your phone number (until you trust someone)</li>
                <li>Your daily routine or schedule</li>
                <li>Vacation plans or dates you'll be away</li>
                <li>Financial information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Meeting Other Parents</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Before Meeting in Person</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Chat online for a while to get to know the person</li>
                <li>Check their profile history and activity</li>
                <li>Trust your instincts - if something feels off, don't meet</li>
                <li>Tell a friend or family member about your plans</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">First Meeting Guidelines</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li><strong>Always meet in public places</strong> like parks, coffee shops, or libraries</li>
                <li>Meet during daytime hours</li>
                <li>Bring your child with you (never leave children unsupervised with new acquaintances)</li>
                <li>Drive yourself (don't accept rides)</li>
                <li>Keep your car keys and phone accessible</li>
                <li>Let someone know where you'll be and check in with them</li>
                <li>Have an exit plan if you feel uncomfortable</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Protecting Your Children</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sharing Photos</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Avoid sharing photos with identifiable locations (school uniforms, house numbers, car plates)</li>
                <li>Consider privacy settings and who can see your posts</li>
                <li>Never share photos of other people's children without permission</li>
                <li>Be mindful of metadata that might reveal location</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Supervising Interactions</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Always supervise your children during playdates with new friends</li>
                <li>Don't leave children alone with someone you've just met online</li>
                <li>Get to know other parents before arranging unsupervised playdates</li>
                <li>Check references and mutual connections when possible</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Account Security</h2>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Use a strong, unique password</li>
                <li>Never share your password with anyone</li>
                <li>Log out when using shared devices</li>
                <li>Enable two-factor authentication if available</li>
                <li>Be wary of suspicious messages or links</li>
                <li>Report any unauthorized access immediately</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recognizing Red Flags</h2>

              <div className="bg-warning-50 border-l-4 border-warning-500 p-4 mb-4">
                <p className="text-warning-900 font-semibold mb-2">Be cautious if someone:</p>
                <ul className="list-disc pl-6 text-warning-800 space-y-1">
                  <li>Asks for personal information too quickly</li>
                  <li>Pressures you to meet in person right away</li>
                  <li>Wants to meet in private or isolated locations</li>
                  <li>Asks for money or financial help</li>
                  <li>Makes you feel uncomfortable or unsafe</li>
                  <li>Asks you to keep your interactions secret</li>
                  <li>Shows excessive interest in your children</li>
                  <li>Has inconsistent stories or information</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Financial Safety</h2>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Never send money to someone you've only met online</li>
                <li>Be wary of sob stories or urgent requests for financial help</li>
                <li>Don't provide banking or credit card information</li>
                <li>Keep all financial transactions off the platform</li>
                <li>Report any requests for money to our team</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Reporting Concerns</h2>
              <p className="text-gray-700 mb-4">
                If you experience or witness any concerning behavior:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Use the "Report" button on posts or profiles</li>
                <li>Block users who make you uncomfortable</li>
                <li><Link href="/contact" className="text-primary-600 hover:text-primary-700 underline">Contact our support team</Link> for immediate assistance</li>
                <li>For emergencies, contact local law enforcement</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Trust Your Instincts</h2>
              <p className="text-gray-700 mb-4">
                Your intuition is a powerful safety tool. If something doesn't feel right, it probably isn't. It's always okay to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Decline a meetup</li>
                <li>Leave a situation that makes you uncomfortable</li>
                <li>End a conversation</li>
                <li>Block someone</li>
                <li>Report suspicious behavior</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Additional Resources</h2>
              <p className="text-gray-700 mb-4">
                For more information about online safety:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Read our <Link href="/guidelines" className="text-primary-600 hover:text-primary-700 underline">Community Guidelines</Link></li>
                <li>Review our <Link href="/privacy" className="text-primary-600 hover:text-primary-700 underline">Privacy Policy</Link></li>
                <li><Link href="/contact" className="text-primary-600 hover:text-primary-700 underline">Contact us</Link> with safety questions</li>
              </ul>
            </section>

            <div className="bg-success-50 border border-success-200 rounded-lg p-6 mt-8">
              <p className="text-success-900 font-semibold mb-2">
                Remember: The vast majority of parents on ZipParents are genuine people looking for connection and support.
              </p>
              <p className="text-success-800">
                By following these safety guidelines, you can enjoy the benefits of our community while keeping yourself and your family safe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
