import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export default function About({ dict }: { dict: Dictionary["about"] }) {
  return (
    <section id="about" className="w-full bg-[#060b13] text-white py-20 px-6 relative overflow-hidden">
      {/* Subtiler Glow-Effekt im Hintergrund */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen" />

      <div className="max-w-7xl mx-auto relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Linke Spalte: Profilbild mit dem doppelten Rahmen-Effekt */}
        <div className="lg:col-span-4 flex justify-center lg:justify-start">
          <div className="relative p-3 bg-[#0b111e]/40 border border-gray-800/60 rounded-2xl backdrop-blur-sm">
            <div className="relative w-[280px] h-[340px] md:w-[320px] md:h-[380px] overflow-hidden rounded-xl border border-gray-700/40">
                <Image 
                  src="/images/profile_casual.jpg" 
                  alt={dict.imageAlt}
                  fill
                  className="object-cover"
                  priority
                />
            </div>
          </div>
        </div>

        {/* Rechte Spalte: Inhalt */}
        <div className="lg:col-span-8 space-y-6">
          <span className="inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold rounded-md uppercase tracking-wider">
            {dict.badge}
          </span>
          
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-100">
            {dict.title}
          </h2>

          <div className="space-y-4 text-gray-400 text-sm md:text-base leading-relaxed max-w-3xl">
            <p className="text-gray-200 font-medium">{dict.lead}</p>
            {dict.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {/* Feature-Boxen unten (2x2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
            {dict.features.map((feat) => (
              <div key={feat.title} className="bg-[#0b111e]/30 border border-gray-800/40 rounded-xl p-5 backdrop-blur-sm">
                <h4 className="text-cyan-400 text-sm font-bold mb-1">{feat.title}</h4>
                <p className="text-gray-400 text-xs leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}