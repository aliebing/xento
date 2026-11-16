import Link from 'next/link';
import Logo from './Logo';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import { LINKEDIN_URL } from '@/lib/links';

interface FooterProps {
  lang: Locale;
  dict: Dictionary['footer'];
}

export default function Footer({ lang, dict }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#060b13] border-t border-gray-900 py-8 px-6 text-xs text-gray-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Logo-Branding links */}
        <Logo lang={lang} size="small" />

        {/* Copyright Mitte */}
        <div>{dict.copyright.replace('{year}', String(currentYear))}</div>

        {/* Rechtliches rechts */}
        <div className="flex items-center gap-6">
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">{dict.linkedin}</a>
          <Link href={`/${lang}/impressum`} className="hover:text-gray-300 transition-colors">{dict.impressum}</Link>
          <Link href={`/${lang}/datenschutz`} className="hover:text-gray-300 transition-colors">{dict.privacy}</Link>
        </div>

      </div>
    </footer>
  );
}
