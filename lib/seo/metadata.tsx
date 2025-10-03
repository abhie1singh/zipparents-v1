/**
 * SEO Metadata Utilities - Sprint 6
 * Generates meta tags, Open Graph, Twitter Cards, and JSON-LD structured data
 */

import { Metadata } from 'next';
import React from 'react';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogType?: 'website' | 'article' | 'profile';
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  noindex?: boolean;
  nofollow?: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://zipparents.com';
const SITE_NAME = 'ZipParents';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

/**
 * Generate complete metadata for a page
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    canonical,
    ogType = 'website',
    ogImage = DEFAULT_OG_IMAGE,
    twitterCard = 'summary_large_image',
    noindex = false,
    nofollow = false,
  } = config;

  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const canonicalUrl = canonical || BASE_URL;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
      },
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: ogType,
    },
    twitter: {
      card: twitterCard,
      title: fullTitle,
      description,
      images: [ogImage],
      creator: '@zipparents',
      site: '@zipparents',
    },
  };
}

/**
 * Generate JSON-LD structured data for Organization
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: 'A safe and supportive community for parents to connect, share experiences, and find local support',
    sameAs: [
      'https://facebook.com/zipparents',
      'https://twitter.com/zipparents',
      'https://instagram.com/zipparents',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@zipparents.com',
      availableLanguage: 'English',
    },
  };
}

/**
 * Generate JSON-LD structured data for WebSite
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: BASE_URL,
    description: 'A safe and supportive community for parents to connect, share experiences, and find local support',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate JSON-LD structured data for FAQPage
 */
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate JSON-LD structured data for Article/BlogPosting
 */
export function generateArticleSchema(article: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
  };
}

/**
 * Generate JSON-LD structured data for BreadcrumbList
 */
export function generateBreadcrumbSchema(breadcrumbs: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate JSON-LD structured data for LocalBusiness (for city pages)
 */
export function generateLocalBusinessSchema(city: string, state: string, zipCode: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `${SITE_NAME} - ${city}, ${state}`,
    description: `Connect with parents in ${city}, ${state}. Join local playgroups, events, and support groups.`,
    url: `${BASE_URL}/${city.toLowerCase().replace(/\s+/g, '-')}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: city,
      addressRegion: state,
      postalCode: zipCode,
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      // These would be fetched from a geocoding service in production
    },
    areaServed: {
      '@type': 'City',
      name: city,
    },
  };
}

/**
 * Component to render JSON-LD script tags
 */
export function StructuredData({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
