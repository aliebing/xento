import type { Dictionary } from '@/lib/i18n/dictionaries';

export default function Technologies({ dict }: { dict: Dictionary['technologies'] }) {
  return (
    <section id="techstack" className="w-full bg-[#0c111a] text-white py-30 px-6 relative overflow-hidden border-t border-b border-zinc-700/70">
      <div className="max-w-7xl mx-auto relative z-10 w-full">

        {/* Hintergrund-Glows */}

        {/* Sektions-Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            {dict.title}
          </h2>
          <div className="w-12 h-1 bg-amber-300 mx-auto rounded-full mt-2"></div>
          <p className="text-zinc-300 text-sm md:text-base max-w-xl mx-auto leading-relaxed pt-2">
            {dict.intro}
          </p>
        </div>

        {/* Zwei Gruppen: Schwerpunkt und weitere Erfahrung */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#101622]/40 border border-zinc-800/40 rounded-2xl p-8 md:p-10 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-cyan-400/80 mb-6">{dict.focusLabel}</h3>
            <ul className="flex flex-wrap gap-3">
              {dict.focusItems.map((item) => (
                <li
                  key={item}
                  className="px-3 py-1.5 text-sm font-medium text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 rounded-lg"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#101622]/40 border border-zinc-800/40 rounded-2xl p-8 md:p-10 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-zinc-300 mb-6">{dict.furtherLabel}</h3>
            <ul className="flex flex-wrap gap-3">
              {dict.furtherItems.map((item) => (
                <li
                  key={item}
                  className="px-3 py-1.5 text-sm font-medium text-zinc-300 bg-zinc-900/80 border border-zinc-700/60 rounded-lg"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}
