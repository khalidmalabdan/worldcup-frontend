const { getRequestConfig } = require('next-intl/server');

module.exports = getRequestConfig(async ({ locale }) => {
  const safeLocale = locale ?? 'en';
  
  try {
    const messages = (await import(`./messages/${safeLocale}.json`)).default;
    return {
      locale: safeLocale,
      messages
    };
  } catch (err) {
    console.error(`Failed to load messages for locale ${safeLocale}:`, err);
    // Fallback to empty messages to prevent crashes
    return {
      locale: safeLocale,
      messages: {}
    };
  }
});
