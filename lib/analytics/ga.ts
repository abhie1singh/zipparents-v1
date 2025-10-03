// Google Analytics 4 integration

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Event types
export type GAEvent = {
  action: string;
  category: string;
  label?: string;
  value?: number;
};

// Initialize GA
export const initGA = () => {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: window.location.pathname,
    });
  }
};

// Track page view
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Track custom event
export const trackEvent = ({ action, category, label, value }: GAEvent) => {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track conversion
export const trackConversion = (conversionId: string, value?: number) => {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID) {
    window.gtag('event', 'conversion', {
      send_to: `${GA_MEASUREMENT_ID}/${conversionId}`,
      value: value,
    });
  }
};

// Specific event tracking functions
export const trackSignup = (method: string) => {
  trackEvent({
    action: 'sign_up',
    category: 'engagement',
    label: method,
  });
};

export const trackLogin = (method: string) => {
  trackEvent({
    action: 'login',
    category: 'engagement',
    label: method,
  });
};

export const trackPostCreation = (postType: string) => {
  trackEvent({
    action: 'create_post',
    category: 'content',
    label: postType,
  });
};

export const trackEventRSVP = (eventId: string) => {
  trackEvent({
    action: 'event_rsvp',
    category: 'engagement',
    label: eventId,
  });
};

export const trackProfileComplete = () => {
  trackEvent({
    action: 'complete_profile',
    category: 'engagement',
  });
};

export const trackSearch = (searchTerm: string) => {
  trackEvent({
    action: 'search',
    category: 'engagement',
    label: searchTerm,
  });
};

export const trackShare = (contentType: string) => {
  trackEvent({
    action: 'share',
    category: 'engagement',
    label: contentType,
  });
};

// Type declaration for gtag
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}
