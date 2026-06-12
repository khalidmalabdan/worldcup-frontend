"use client";

import { useTranslations } from 'next-intl';

export default function HomePage() {
  try {
    const t = useTranslations('nav');
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold">{t('matches')}</h1>
      </div>
    );
  } catch (error) {
    console.error('HomePage error:', error);
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold">Error loading page</h1>
        <p className="text-red-600">{error instanceof Error ? error.message : String(error)}</p>
      </div>
    );
  }
}
