import type { Dictionary } from '@/lib/i18n/dictionaries';

const PROJECT_URL = 'https://aliebing-moviefinder-app-cj75ca.streamlit.app/';

export default function OwnProjectCard({ dict }: { dict: Dictionary['experience']['ownProject'] }) {
  return (
    <div className="relative group">
      <div className="w-full bg-[#0b111e]/50 border border-gray-800/40 rounded-xl p-6 md:p-8 backdrop-blur-sm shadow-xl relative overflow-hidden">

        {/* Glow-Effekte innerhalb der Karte */}
        <div className="absolute top-[15%] left-[-10%] w-[350px] h-[350px] bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none z-0 mix-blend-screen" />
        <div className="absolute bottom-[5%] right-[-15%] w-[300px] h-[300px] bg-blue-500/15 rounded-full blur-[90px] pointer-events-none z-0 mix-blend-screen" />

        <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">

          {/* Linke Seite: Titel & Beschreibung */}
          <div className="flex-1">
            <span className="inline-block mb-3 text-xs font-semibold text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 px-2.5 py-1 rounded uppercase tracking-wider">
              {dict.badge}
            </span>

            <h3 className="text-lg md:text-xl font-bold text-gray-100 mb-2">{dict.title}</h3>

            <p className="text-xs md:text-sm text-gray-400 leading-relaxed mb-4">
              {dict.descriptionBefore}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {dict.descriptionHighlight}
              </span>
              {dict.descriptionAfter}
            </p>

            {/* Tech-Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {dict.tags.map((tag) => (
                <span key={tag} className="text-xs text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>

            <a
              href={PROJECT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-5 rounded-lg transition-colors"
            >
              {dict.cta}
            </a>
          </div>

          {/* Rechte Seite: Bild */}
          <div className="w-full md:w-100 flex-shrink-0">
            <a href={PROJECT_URL} target="_blank" rel="noopener noreferrer">
              <img
                src="/images/moviefinder-screenshot.png"
                alt={dict.title}
                className="w-full h-auto rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
