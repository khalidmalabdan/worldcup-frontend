import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  const safeLocale = (locale ?? 'en') as 'en' | 'ar';
  
  let messages = {};
  try {
    messages = (await import(`./messages/${safeLocale}.json`)).default;
  } catch (err) {
    console.warn(`Failed to load messages for locale ${safeLocale}:`, err);
    // Fallback to English
    try {
      messages = (await import('./messages/en.json')).default;
    } catch (fallbackErr) {
      console.error('Failed to load fallback messages:', fallbackErr);
    }
  }

  return {
    locale: safeLocale,
    messages,
  };
});
