import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Community Guidelines - ZipParents',
  description: 'Community Guidelines for ZipParents',
};

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Community Guidelines</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-blue max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700 mb-4">
                ZipParents is a safe, supportive community where parents can connect, share experiences, ask questions, and find local support. These guidelines help us maintain a positive environment for everyone.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Core Values</h2>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li><strong>Respect:</strong> Treat all members with kindness and consideration</li>
                <li><strong>Support:</strong> Offer help and encouragement to fellow parents</li>
                <li><strong>Safety:</strong> Protect the privacy and wellbeing of all members</li>
                <li><strong>Authenticity:</strong> Be genuine and honest in your interactions</li>
                <li><strong>Inclusivity:</strong> Welcome parents from all backgrounds</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What We Encourage</h2>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Sharing parenting experiences, tips, and advice</li>
                <li>Asking questions and seeking support</li>
                <li>Offering constructive feedback and encouragement</li>
                <li>Connecting with local parents for playdates and activities</li>
                <li>Sharing local resources and recommendations</li>
                <li>Celebrating parenting wins and milestones</li>
                <li>Being understanding that every parent's journey is different</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What We Don't Allow</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Harassment and Bullying</h3>
              <p className="text-gray-700 mb-4">
                Do not harass, bully, intimidate, or attack other members. This includes personal attacks, name-calling, and targeted harassment.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Hate Speech and Discrimination</h3>
              <p className="text-gray-700 mb-4">
                Content that promotes hate or discrimination based on race, ethnicity, religion, gender, sexual orientation, disability, or any other protected characteristic is strictly prohibited.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Inappropriate Content</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Sexually explicit content</li>
                <li>Graphic violence or gore</li>
                <li>Content that exploits or endangers children</li>
                <li>Illegal content or activities</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Spam and Self-Promotion</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Unsolicited advertising or promotional content</li>
                <li>Repetitive or irrelevant posts</li>
                <li>Multi-level marketing schemes</li>
                <li>Links to external sites without context</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Misinformation</h3>
              <p className="text-gray-700 mb-4">
                Do not share false or misleading information, especially regarding health, safety, or medical advice. Always encourage members to consult professionals for medical concerns.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Privacy Violations</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Sharing others' personal information without consent</li>
                <li>Posting identifiable photos of others' children</li>
                <li>Revealing private conversations publicly</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Impersonation</h3>
              <p className="text-gray-700 mb-4">
                Do not impersonate other users, public figures, or organizations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Safety Guidelines</h2>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Never share your full address publicly - use general area/zip code</li>
                <li>Be cautious when meeting other parents in person for the first time</li>
                <li>Meet in public places for initial meetups</li>
                <li>Trust your instincts - if something feels wrong, report it</li>
                <li>Keep financial transactions off the platform</li>
                <li>Do not share account passwords or login credentials</li>
              </ul>
              <p className="text-gray-700 mb-4">
                For more safety tips, visit our{' '}
                <Link href="/safety" className="text-primary-600 hover:text-primary-700 underline">
                  Safety Tips page
                </Link>
                .
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Reporting and Enforcement</h2>
              <p className="text-gray-700 mb-4">
                If you see content or behavior that violates these guidelines:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Use the "Report" button on posts or profiles</li>
                <li>Block users who make you uncomfortable</li>
                <li><Link href="/contact" className="text-primary-600 hover:text-primary-700 underline">Contact us</Link> for serious concerns</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Consequences of Violations</h3>
              <p className="text-gray-700 mb-4">
                Depending on the severity and frequency of violations, we may:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Remove offending content</li>
                <li>Issue a warning</li>
                <li>Temporarily suspend your account</li>
                <li>Permanently ban your account</li>
                <li>Report illegal activity to authorities</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Parenting Philosophy Diversity</h2>
              <p className="text-gray-700 mb-4">
                We recognize that parents have different approaches, beliefs, and methods. While healthy discussion is welcome, please:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Respect that different families make different choices</li>
                <li>Share your experiences without judging others</li>
                <li>Avoid "mom-shaming" or "dad-shaming"</li>
                <li>Focus on supporting rather than criticizing</li>
                <li>Agree to disagree respectfully when viewpoints differ</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Updates to Guidelines</h2>
              <p className="text-gray-700 mb-4">
                We may update these guidelines as our community grows and evolves. Significant changes will be communicated to members.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Questions?</h2>
              <p className="text-gray-700 mb-4">
                If you have questions about these guidelines,{' '}
                <Link href="/contact" className="text-primary-600 hover:text-primary-700 underline">
                  contact us
                </Link>
                .
              </p>
            </section>

            <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mt-8">
              <p className="text-primary-900 font-semibold mb-2">
                Thank you for being part of ZipParents!
              </p>
              <p className="text-primary-800">
                Together, we can create a supportive, respectful community where all parents feel welcome and valued.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
