"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

interface NavbarProps {
  lang: Locale;
  dict: Dictionary["nav"];
  /** Nur Logo (und Umschalter), ohne Menü – z. B. für Impressum und Datenschutz. */
  minimal?: boolean;
  /** Umschalter ausblenden, z. B. im deutschsprachigen Admin-Bereich. */
  hideSwitcher?: boolean;
}

const NAV_ANCHORS = [
  { href: "#services", key: "services" },
  { href: "#experience", key: "experience" },
  { href: "#techstack", key: "technologies" },
  { href: "#about", key: "about" },
] as const;

export default function Navbar({ lang, dict, minimal, hideSwitcher }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#060b13]/40 backdrop-blur-md border-b border-gray-800/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        <Logo lang={lang} />

        <div className="flex shrink-0 items-center gap-2 md:gap-8">
          {!minimal ? (
            <div className="hidden md:flex items-center gap-10">
              <nav className="flex items-center gap-6">
                {NAV_ANCHORS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-normal text-gray-400 hover:text-white transition-colors"
                  >
                    {dict[link.key]}
                  </Link>
                ))}
              </nav>

              <Link
                href="#contact"
                className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-full shadow-lg shadow-cyan-500/20 transition-all duration-200"
              >
                {dict.contact}
              </Link>
            </div>
          ) : null}

          {/* Ganz rechts oben: Sprachumschalter */}
          {!hideSwitcher ? <LanguageSwitcher lang={lang} label={dict.languageLabel} /> : null}

          {!minimal ? (
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? dict.closeMenu : dict.openMenu}
              className="md:hidden p-2 text-gray-400 hover:text-white focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          ) : null}
        </div>
      </div>

      {!minimal && isMobileMenuOpen ? (
        <nav
          id="mobile-menu"
          className="md:hidden border-t border-gray-800/40 bg-[#060b13]/95 backdrop-blur-md px-6 py-4 flex flex-col gap-4"
        >
          {NAV_ANCHORS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-normal text-gray-400 hover:text-white transition-colors"
            >
              {dict[link.key]}
            </Link>
          ))}
          <Link
            href="#contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-2 inline-block w-fit px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-lg shadow-cyan-500/20 transition-all duration-200"
          >
            {dict.contact}
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
