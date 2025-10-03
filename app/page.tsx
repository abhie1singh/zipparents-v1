import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, StructuredData, generateOrganizationSchema, generateWebSiteSchema, generateFAQSchema } from '@/lib/seo/metadata';
import HomeClient from './HomeClient';

export const metadata: Metadata = generateSEOMetadata({
  title: 'ZipParents - Connect with Local Parents in Your Community',
  description: 'A safe and supportive community where parents connect, share experiences, and find local support. Join ZipParents to meet nearby parents, arrange playdates, and build lasting friendships.',
  keywords: ['parents community', 'local parents', 'parenting support', 'playdates', 'parent groups', 'family community', 'parenting network'],
  canonical: process.env.NEXT_PUBLIC_BASE_URL || 'https://zipparents.com',
  ogType: 'website',
});

// FAQ data
const faqs = [
  {
    question: 'What is ZipParents?',
    answer: 'ZipParents is a social networking platform designed specifically for parents to connect with other parents in their local area. Share experiences, arrange playdates, ask questions, and build a supportive community based on your zip code.',
  },
  {
    question: 'How does ZipParents ensure safety?',
    answer: 'We require age verification (18+ only), implement comprehensive content moderation, and are COPPA compliant. We never share information about children publicly and have strict privacy controls to protect our community.',
  },
  {
    question: 'Is ZipParents free to use?',
    answer: 'Yes! ZipParents is completely free to join and use. Create your profile, connect with local parents, share posts, and participate in community discussions at no cost.',
  },
  {
    question: 'How do I find parents near me?',
    answer: 'When you sign up, you\'ll add your zip code to your profile. ZipParents uses this to show you posts and profiles from parents in your local area, making it easy to connect with nearby families.',
  },
  {
    question: 'Can I control who sees my information?',
    answer: 'Yes! ZipParents has comprehensive privacy settings. You can control what information is visible to others, who can contact you, and manage all aspects of your profile visibility.',
  },
];

export default function Home() {
  return (
    <>
      <StructuredData data={generateOrganizationSchema()} />
      <StructuredData data={generateWebSiteSchema()} />
      <StructuredData data={generateFAQSchema(faqs)} />
      <HomeClient faqs={faqs} />
    </>
  );
}
