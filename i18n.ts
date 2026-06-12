import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  const safeLocale = (locale ?? 'en') as 'en' | 'ar';
  
  try {
    const messages = (await import(`./messages/${safeLocale}.json`)).default;
    return {
      locale: safeLocale,
      messages,
    };
  } catch (err) {
    console.error(`Failed to load messages for locale ${safeLocale}:`, err);
    // Fallback: try to load English
    if (safeLocale !== 'en') {
      try {
        const fallbackMessages = (await import('./messages/en.json')).default;
        return {
          locale: safeLocale,
          messages: fallbackMessages,
        };
      } catch (fallbackErr) {
        console.error('Failed to load fallback messages:', fallbackErr);
      }
    }
    return {
      locale: safeLocale,
      messages: {},
    };
  }
});
