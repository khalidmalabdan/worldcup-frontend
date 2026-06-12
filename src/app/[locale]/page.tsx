"use client";

import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('nav');
  
  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold">{t('matches')}</h1>
      <p className="text-gray-600 mt-4">Welcome to World Cup App</p>
    </div>
  );
}
