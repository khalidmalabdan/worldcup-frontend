"use client";

import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('nav');

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold">{t('matches')}</h1>
    </div>
  );
}
