import Link from 'next/link';
import Logo from "./LogoSmall";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#060b13] border-t border-gray-900 py-8 px-6 text-xs text-gray-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Logo-Branding links */}
        <Logo />

        {/* Copyright Mitte */}
        <div>
          &copy; {currentYear} Xento IT-Services. Alle Rechte vorbehalten.
        </div>

        {/* Rechtliches rechts */}
        <div className="flex items-center gap-6">
          <Link href="/impressum" className="hover:text-gray-300 transition-colors">Impressum</Link>
          <Link href="/datenschutz" className="hover:text-gray-300 transition-colors">Datenschutz</Link>
        </div>

      </div>
    </footer>
  );
}