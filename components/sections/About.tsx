import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export default function About({ dict }: { dict: Dictionary["about"] }) {
  return (
    <section id="about" className="w-full bg-[#090d15] text-white py-20 px-6 relative overflow-hidden">
      {/* Subtiler Glow-Effekt im Hintergrund */}

      <div className="max-w-7xl mx-auto relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Linke Spalte: Profilbild mit dem doppelten Rahmen-Effekt */}
        <div className="lg:col-span-4 flex justify-center lg:justify-start">
          <div className="relative p-3 bg-[#101622]/40 border border-zinc-800/40 rounded-2xl backdrop-blur-sm">
            <div className="relative w-[280px] h-[340px] md:w-[320px] md:h-[380px] overflow-hidden rounded-xl border border-zinc-700/40">
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
          <span className="inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400/80 text-xs font-semibold rounded-md uppercase tracking-wider">
            {dict.badge}
          </span>
          
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-100">
            {dict.title}
          </h2>

          <div className="space-y-4 text-zinc-300 text-sm md:text-base leading-relaxed max-w-3xl">
            <p className="text-zinc-200 font-medium">{dict.lead}</p>
            {dict.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {/* Feature-Boxen unten (2x2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
            {dict.features.map((feat) => (
              <div key={feat.title} className="bg-[#101622]/30 border border-zinc-700/40 rounded-xl p-5 backdrop-blur-sm">
                <h4 className="text-cyan-400/80 text-sm font-bold mb-1">{feat.title}</h4>
                <p className="text-zinc-300 text-xs leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}