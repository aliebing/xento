import type { Dictionary } from '@/lib/i18n/dictionaries';

export default function Technologies({ dict }: { dict: Dictionary['technologies'] }) {
  return (
    <section id="techstack" className="w-full bg-[#0c1016] text-white py-30 px-6 relative overflow-hidden border-t border-b border-gray-700/70">
      <div className="max-w-7xl mx-auto relative z-10 w-full">

        {/* Hintergrund-Glows */}
        <div className="absolute top-[35%] left-[0%] w-[400px] h-[400px] bg-cyan-500/12 rounded-full blur-[100px] pointer-events-none z-0 mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[12%] w-[300px] h-[300px] bg-blue-500/15 rounded-full blur-[90px] pointer-events-none z-0 mix-blend-screen" />

        {/* Sektions-Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            {dict.title}
          </h2>
          <div className="w-12 h-1 bg-blue-500 mx-auto rounded-full mt-2"></div>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed pt-2">
            {dict.intro}
          </p>
        </div>

        {/* Zwei Gruppen: Schwerpunkt und weitere Erfahrung */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#0b111e]/40 border border-gray-800/60 rounded-2xl p-8 md:p-10 backdrop-blur-sm shadow-2xl">
            <h3 className="text-lg font-bold text-cyan-400 mb-6">{dict.focusLabel}</h3>
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

          <div className="bg-[#0b111e]/40 border border-gray-800/60 rounded-2xl p-8 md:p-10 backdrop-blur-sm shadow-2xl">
            <h3 className="text-lg font-bold text-gray-300 mb-6">{dict.furtherLabel}</h3>
            <ul className="flex flex-wrap gap-3">
              {dict.furtherItems.map((item) => (
                <li
                  key={item}
                  className="px-3 py-1.5 text-sm font-medium text-gray-400 bg-gray-900/80 border border-gray-800/60 rounded-lg"
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
