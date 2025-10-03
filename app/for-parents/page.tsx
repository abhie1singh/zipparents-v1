import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Shield, Users, Calendar, Heart, MessageCircle, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'For Parents | ZipParents - Connect with Your Local Parenting Community',
  description: 'Join ZipParents to connect with local parents, find support, organize playdates, and build lasting friendships in your neighborhood.',
  openGraph: {
    title: 'For Parents | ZipParents',
    description: 'Connect with local parents and build your support network.',
    type: 'website',
  },
};

const benefits = [
  {
    icon: MapPin,
    title: 'Connect Locally',
    description: 'Find parents in your exact ZIP code. Meet families who live nearby and share your daily experiences.',
  },
  {
    icon: Shield,
    title: 'Safe Environment',
    description: 'Verified parents only. Our rigorous safety measures ensure you connect with real families in a secure space.',
  },
  {
    icon: Users,
    title: 'Support Network',
    description: 'Get advice, share experiences, and find support from parents who understand your journey.',
  },
  {
    icon: Calendar,
    title: 'Events & Activities',
    description: 'Organize playdates, join local events, and create memorable experiences for your children.',
  },
];

const features = [
  {
    icon: MessageCircle,
    title: 'Community Feed',
    description: 'Share updates, ask questions, and engage with your local parenting community.',
  },
  {
    icon: Calendar,
    title: 'Event Organization',
    description: 'Create and RSVP to local events, playdates, and parent meetups.',
  },
  {
    icon: Users,
    title: 'Parent Matching',
    description: 'Find parents with children of similar ages and shared interests.',
  },
  {
    icon: Heart,
    title: 'Support Groups',
    description: 'Join or create support groups for specific parenting topics and challenges.',
  },
];

const testimonials = [
  {
    name: 'Sarah M.',
    location: 'Brooklyn, NY',
    text: 'ZipParents helped me find my mom tribe. I\'ve made lifelong friends just blocks away from my home!',
    rating: 5,
  },
  {
    name: 'Michael T.',
    location: 'Austin, TX',
    text: 'As a stay-at-home dad, finding other parents was tough. ZipParents changed that completely.',
    rating: 5,
  },
  {
    name: 'Jennifer L.',
    location: 'Seattle, WA',
    text: 'The events feature is amazing. My kids have regular playdates now, and I have a support system.',
    rating: 5,
  },
];

export default function ForParentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Parenting is Better
              <span className="text-blue-600"> Together</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
              Connect with local parents, build your support network, and create lasting friendships in your neighborhood.
            </p>
            <Link
              href="/signup"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg"
            >
              Join Free Today
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Parents Love ZipParents
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            What Parents Are Saying
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Everything You Need to Connect
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Build Your Village?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of parents who have found their community through ZipParents. It's free to join and takes less than 2 minutes.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-blue-600 text-white px-10 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg"
          >
            Get Started Now
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            No credit card required. Cancel anytime.
          </p>
        </div>
      </section>
    </div>
  );
}
