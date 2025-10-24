export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ?? '660024403196500';

const isFbqAvailable = () => typeof window !== 'undefined' && typeof window.fbq === 'function';

export const viewPage = () => {
  if (isFbqAvailable()) window.fbq('track', 'PageView');
};

export const addToWishlist = (content_ids) => {
  if (isFbqAvailable()) window.fbq('track', 'AddToWishlist', { content_ids });
};

export const register = () => {
  if (isFbqAvailable()) window.fbq('track', 'CompleteRegistration');
};

export const contact = () => {
  if (isFbqAvailable()) window.fbq('track', 'Contact');
};

export const search = (search_string) => {
  if (isFbqAvailable()) window.fbq('track', 'Search', { search_string });
};

export const viewContent = () => {
  if (isFbqAvailable()) window.fbq('track', 'ViewContent');
};
