import Link from "next/link";
import Logo from "./Logo";

export default function Navbar() {
  return (
     <header className="fixed top-0 left-0 w-full z-50 bg-[#060b13]/40 backdrop-blur-md border-b border-gray-800/20">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO-BEREICH: XENTO mit dem permanenten, flachen Doppler-Effekt nach links */}
      <Logo />

        {/* RECHTER BEREICH: Menügliederung & Pillen-Button wie im Screenshot */}
        <div className="hidden md:flex items-center gap-10">
          <nav className="flex items-center gap-6">
            <Link href="#home" className="text-sm font-normal text-gray-400 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="#services" className="text-sm font-normal text-gray-400 hover:text-white transition-colors">
              Dienstleistungen
            </Link>
            <Link href="#projects" className="text-sm font-normal text-gray-400 hover:text-white transition-colors">
              Projekte
            </Link>
            <Link href="#techstack" className="text-sm font-normal text-gray-400 hover:text-white transition-colors">
              Tech-Stack
            </Link>
            <Link href="#about" className="text-sm font-normal text-gray-400 hover:text-white transition-colors">
              Über uns
            </Link>
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
        <button className="md:hidden p-2 text-gray-400 hover:text-white focus:outline-none">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

      </div>
    </header>
  );
}

