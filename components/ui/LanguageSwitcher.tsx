"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, switchLocalePath, type Locale } from "@/lib/i18n/config";

const LANGUAGES: Record<Locale, { code: string; name: string }> = {
  en: { code: "EN", name: "English" },
  de: { code: "DE", name: "Deutsch" },
};

function Flag({ locale }: { locale: Locale }) {
  if (locale === "de") {
    return (
      <svg viewBox="0 0 5 3" className="h-3.5 w-5 rounded-[2px]" aria-hidden="true">
        <rect width="5" height="3" fill="#FFCE00" />
        <rect width="5" height="2" fill="#DD0000" />
        <rect width="5" height="1" fill="#000000" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 60 30" className="h-3.5 w-5 rounded-[2px]" aria-hidden="true">
      <clipPath id="flag-gb-s">
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id="flag-gb-t">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath="url(#flag-gb-s)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#ffffff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#flag-gb-t)" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#ffffff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}

interface LanguageSwitcherProps {
  lang: Locale;
  label: string;
}

export default function LanguageSwitcher({ lang, label }: LanguageSwitcherProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label={label}
      className="flex items-center rounded-full border border-zinc-700/60 bg-[#101622]/60 p-0.5 text-xs font-semibold"
    >
      {locales.map((locale) => {
        const active = locale === lang;
        const { code, name } = LANGUAGES[locale];
        return (
          <Link
            key={locale}
            href={switchLocalePath(pathname, locale)}
            hrefLang={locale}
            lang={locale}
            title={name}
            aria-current={active ? "true" : undefined}
            className={`flex items-center gap-1.5 rounded-full px-2 py-1.5 transition-colors sm:px-2.5 ${
              active ? "bg-cyan-500/20 text-white" : "text-zinc-300 hover:text-white"
            }`}
          >
            <Flag locale={locale} />
            <span className="hidden sm:inline">{code}</span>
            <span className="sr-only sm:hidden">{name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
