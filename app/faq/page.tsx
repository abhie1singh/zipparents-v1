'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const faqCategories = [
  {
    category: 'Getting Started',
    questions: [
      {
        question: 'How do I sign up for ZipParents?',
        answer: 'Click the "Sign Up" button, enter your email and create a password. You\'ll need to verify your email and complete your profile to start connecting with other parents.',
      },
      {
        question: 'Is ZipParents free to use?',
        answer: 'Yes! ZipParents is completely free to join and use. We believe every parent deserves access to a supportive community.',
      },
      {
        question: 'What information do I need to provide?',
        answer: 'You\'ll need to provide basic information like your name, email, ZIP code, and children\'s ages (optional). We also ask for age verification to ensure our community remains safe.',
      },
    ],
  },
  {
    category: 'Safety & Privacy',
    questions: [
      {
        question: 'How do you verify users are real parents?',
        answer: 'We use a multi-step verification process including email verification, age verification, and manual review when necessary. All users must be 18+ to join.',
      },
      {
        question: 'Can I control who sees my profile?',
        answer: 'Yes! You have full control over your privacy settings. You can choose who can see your profile, send you messages, and view your posts.',
      },
      {
        question: 'What if I see inappropriate content?',
        answer: 'You can report any content or user that violates our community guidelines. Our moderation team reviews all reports within 24 hours and takes appropriate action.',
      },
      {
        question: 'Is my personal information shared with others?',
        answer: 'No. We never share your personal information without your consent. Your email, phone number, and other private details remain confidential.',
      },
    ],
  },
  {
    category: 'Features',
    questions: [
      {
        question: 'How do I find parents in my area?',
        answer: 'Once you enter your ZIP code, you\'ll automatically see parents and events in your local area. You can also search and filter by children\'s ages and interests.',
      },
      {
        question: 'Can I organize events and playdates?',
        answer: 'Absolutely! You can create events, set dates and locations, and invite parents to RSVP. It\'s a great way to organize playdates and meetups.',
      },
      {
        question: 'How do I connect with other parents?',
        answer: 'You can send connection requests to other parents, comment on posts, join discussions, and RSVP to events. Once connected, you can message directly.',
      },
    ],
  },
  {
    category: 'Events',
    questions: [
      {
        question: 'What types of events can I create?',
        answer: 'You can create any type of family-friendly event: playdates, park meetups, parent coffee dates, educational workshops, birthday parties, and more.',
      },
      {
        question: 'Can I make events private?',
        answer: 'Yes! When creating an event, you can choose to make it public (visible to all parents in your ZIP) or private (invite-only).',
      },
    ],
  },
  {
    category: 'Technical',
    questions: [
      {
        question: 'Is there a mobile app?',
        answer: 'Our website is fully mobile-responsive and works great on all devices. We\'re currently developing native iOS and Android apps.',
      },
      {
        question: 'I forgot my password. How do I reset it?',
        answer: 'Click "Forgot Password" on the login page. Enter your email and we\'ll send you instructions to reset your password.',
      },
      {
        question: 'How do I delete my account?',
        answer: 'You can delete your account at any time from your account settings. Note that this action is permanent and cannot be undone.',
      },
    ],
  },
];

function FAQAccordion({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 px-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <span className="text-left font-semibold text-gray-900">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0 ml-4" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0 ml-4" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 pb-5">
          <p className="text-gray-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <HelpCircle className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about ZipParents. Can't find what you're looking for? Contact our support team.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {faqCategories.map((category, index) => (
            <div key={index}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                {category.category}
              </h2>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {category.questions.map((faq, faqIndex) => (
                  <FAQAccordion
                    key={faqIndex}
                    question={faq.question}
                    answer={faq.answer}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-blue-50 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Still Have Questions?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Our support team is here to help you with any questions or concerns.
            </p>
            <a
              href="/contact"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
