import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const TECH_BADGES = ["PHP 8", "Symfony", "Laravel", "Vue.js", "Docker"];

export default function Teaser({ dict }: { dict: Dictionary["hero"] }) {
  return (
   <section className="relative w-full bg-[#0b1220] text-white flex items-center justify-center overflow-hidden px-6 py-10 md:py-10">

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10 overflow-hidden p-8 rounded-3xl border border-gray-800/30 bg-[#0f182a]/20 backdrop-blur-sm">

        {/* Linke Spalte: Text & Buttons */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-cyan-400 uppercase bg-cyan-950/40 border border-cyan-800/30 rounded-md">
            {dict.eyebrow}
          </span>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            {dict.titleLine1} <br />
            <span className="text-cyan-400">
              {dict.titleHighlight}
            </span>
          </h1>
          
          <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-xl">{dict.text}</p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <a
              href="#contact"
              className="px-6 py-3 font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-all duration-200"
            >
              {dict.ctaPrimary}
            </a>
            <a
              href="#experience"
              className="px-6 py-3 font-semibold text-gray-300 bg-gray-900/60 hover:bg-gray-800 border border-gray-700 hover:border-gray-700 rounded-lg transition-all duration-200"
            >
              {dict.ctaSecondary}
            </a>
          </div>
        </div>

        {/* Rechte Spalte: Profil-Karte */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="w-full max-w-sm bg-[#141e32]/60 border border-gray-700/60 rounded-2xl p-8 flex flex-col items-center text-center relative backdrop-blur-sm">
            
            {/* Profilbild-Container */}
            <div className="relative w-45 h-45 rounded-full overflow-hidden border-2 border-cyan-500/30 p-1 mb-4">
              <div className="w-full h-full rounded-full overflow-hidden bg-gray-800 relative">
                <Image 
                  src="/images/profile_business.jpg" 
                  alt={dict.profile.imageAlt}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-100">{dict.profile.name}</h3>
            <p className="text-xs font-semibold text-cyan-400 tracking-wider uppercase mt-1">
              {dict.profile.role}
            </p>

            {/* Statistiken */}
            <div className="grid grid-cols-2 gap-4 w-full my-6 border-t border-b border-gray-700/80 py-4">
              <div>
                <p className="text-2xl font-extrabold text-cyan-400">20+</p>
                <p className="text-[10px] uppercase tracking-wider text-gray-300 font-medium mt-1">{dict.profile.yearsLabel}</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-cyan-400">15+</p>
                <p className="text-[10px] uppercase tracking-wider text-gray-300 font-medium mt-1">{dict.profile.projectsLabel}</p>
              </div>
            </div>

            {/* Tech Stack Badges */}
            <div className="flex flex-wrap justify-center gap-2 max-w-xs">
              {TECH_BADGES.map((tech) => (
                <span 
                  key={tech} 
                  className="px-2.5 py-1 text-xs font-medium text-gray-300 bg-gray-900/80 border border-gray-700/60 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>

          </div>
        </div>
        </div>

    </section>
  );
}

