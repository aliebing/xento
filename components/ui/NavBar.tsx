"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";

interface NavbarProps {
  minimal?: boolean;
}

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#services", label: "Dienstleistungen" },
  { href: "#projects", label: "Projekte" },
  { href: "#techstack", label: "Tech-Stack" },
  { href: "#references", label: "Referenzen" },
  { href: "#about", label: "Über uns" },
];

export default function Navbar({ minimal }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#060b13]/40 backdrop-blur-md border-b border-gray-800/20">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* LOGO-BEREICH: XENTO mit dem permanenten, flachen Doppler-Effekt nach links */}
        <Logo />

        {!minimal ? (
          <>
            {/* RECHTER BEREICH: Menügliederung & Pillen-Button wie im Screenshot */}
            <div className="hidden md:flex items-center gap-10">
              <nav className="flex items-center gap-6">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-normal text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Der auffällige Pillen-Button für den Kontakt */}
              <Link
                href="#contact"
                className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-full shadow-lg shadow-cyan-500/20 transition-all duration-200"
              >
                Kontakt
              </Link>
            </div>

            {/* Mobile Menu Button (Hamburger) für Smartphones */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
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
          </>
        ) : null}
      </div>

      {!minimal && isMobileMenuOpen ? (
        <nav
          id="mobile-menu"
          className="md:hidden border-t border-gray-800/40 bg-[#060b13]/95 backdrop-blur-md px-6 py-4 flex flex-col gap-4"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-normal text-gray-400 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-2 inline-block w-fit px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-lg shadow-cyan-500/20 transition-all duration-200"
          >
            Kontakt
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
