'use client';

import { useState } from 'react';
import { BookOpen, Mail, Bell } from 'lucide-react';

export default function BlogPage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    setSubscribed(true);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <BookOpen className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            ZipParents Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Parenting tips, community stories, and resources for modern families.
          </p>
        </div>
      </section>

      {/* Empty State */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Coming Soon!
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
              We're working on creating valuable content for parents. Subscribe to our newsletter to be notified when we publish our first posts.
            </p>

            {/* Newsletter Signup */}
            <div className="max-w-md mx-auto">
              {!subscribed ? (
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                      Subscribe
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Get notified about new blog posts and parenting resources
                  </p>
                </form>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-center gap-2 text-green-700 mb-2">
                    <Mail className="w-5 h-5" />
                    <span className="font-semibold">Thanks for subscribing!</span>
                  </div>
                  <p className="text-sm text-green-600">
                    We'll send you an email when we publish new content.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What to Expect
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Parenting Tips
              </h3>
              <p className="text-gray-600">
                Practical advice for raising happy, healthy kids
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Community Stories
              </h3>
              <p className="text-gray-600">
                Real stories from parents in your community
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Local Resources
              </h3>
              <p className="text-gray-600">
                Guides to family-friendly activities and services
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
