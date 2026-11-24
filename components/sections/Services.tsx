import type { Dictionary } from '@/lib/i18n/dictionaries';

// Reihenfolge entspricht dictionary.services.items: Entwicklung, Architektur, Betreuung.
const serviceStyles = [
  {
    iconColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    iconColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    iconColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function Services({ dict }: { dict: Dictionary['services'] }) {
  return (
    <section id="services" className="w-full bg-[#101a2b] text-white py-30 px-6 relative overflow-hidden border-t border-b border-gray-700/70">
      <div className="max-w-7xl mx-auto relative z-10 w-full">

        {/* Sektions-Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            {dict.title}
          </h2>
          <div className="w-12 h-1 bg-cyan-500 mx-auto rounded-full mt-2"></div>
          <p className="text-gray-300 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            {dict.intro}
          </p>
        </div>

        {/* 3-Spalten-Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dict.items.map((service, index) => {
            const style = serviceStyles[index];
            return (
              <div
                key={service.title}
                className="bg-[#141e32]/40 border border-gray-700/40 rounded-2xl p-8 md:p-10 flex flex-col backdrop-blur-sm transition-all duration-300 hover:border-gray-700/60"
              >
                {/* Farb-Icon-Badge oben links */}
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-6 ${style.iconColor}`}>
                  {style.icon}
                </div>

                {/* Titel & Untertitel */}
                <h3 className="text-xl font-bold text-gray-100 mb-2">{service.title}</h3>
                <p className="text-xs text-gray-300/80 leading-relaxed font-medium mb-8">{service.subtitle}</p>

                {/* Aufzählungspunkte */}
                <ul className="space-y-4 mt-auto">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm text-gray-300/90 leading-relaxed">
                      <span className="text-cyan-400 font-semibold select-none flex-shrink-0 mt-0.5">✓</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
