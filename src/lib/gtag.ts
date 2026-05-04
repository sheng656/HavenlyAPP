/**
 * Google Analytics 4 (GA4) Utility
 * Measurement ID: G-0L78LPK5DK
 */

export const GA_MEASUREMENT_ID = "G-0L78LPK5DK";

// Global project identifier for this site
const PROJECT_ID = "havenly";

/**
 * Log a custom event to GA4
 * @param action - Event name
 * @param params - Additional event parameters
 */
export const trackEvent = (action: string, params: Record<string, any> = {}) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", action, {
      project_id: PROJECT_ID,
      ...params,
    });
  }
};

/**
 * Log booking interaction
 */
export const trackBookingStarted = (listingName: string) => {
  trackEvent("booking_started", {
    item_name: listingName,
  });
};

/**
 * Log search interaction
 */
export const trackSearch = (query: string) => {
  trackEvent("search", {
    search_term: query,
  });
};
