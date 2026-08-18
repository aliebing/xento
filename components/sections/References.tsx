const referencesData = [
  {
    id: 1,
    category: 'AI Movie Recommendation',
    title: 'AI Movie Finder',
    description: 'Ein intelligentes Movie-Recommendation-System mit KI-gestützter Analyse deiner Vorlieben. Das Algorithmus kombiniert gewichtete Genre-Präferenzen mit IMDB-Ratings und Qualitätsmetriken, um personalisierte Filmempfehlungen zu generieren, die perfekt zu deinem Geschmack passen.',
    tags: ['Python', 'streamlit', 'sqlite']
  },
  
];

export default function References() {
  return (
    <section id="references" className="w-full bg-[#0c1016] text-white py-30 px-6 relative overflow-hidden border-t border-b border-gray-700/70">
      
      <div className="max-w-4xl mx-auto">
        
        {/* Header-Bereich */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Referenzen & Projekte  
          </h2>
          <div className="w-12 h-1 bg-blue-500 mx-auto rounded-full mt-2"></div>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Ein Auszug aus den letzten Projekten und Referenzen, die ich erfolgreich umgesetzt habe. Von der Konzeption bis zur Implementierung – hier zeige ich, wie ich komplexe Anforderungen in funktionierende Lösungen verwandelt habe.
          </p>
        </div>

        
          
          {referencesData.map((reference) => (
            <div key={reference.id} className="relative group">
              
              {/* Projekt-Karte */}
              <div className="w-full bg-[#0b111e]/50 border border-gray-800/40 rounded-xl p-6 md:p-8 backdrop-blur-sm shadow-xl relative overflow-hidden">
                
                {/* Glow-Effekte innerhalb der Karte */}
                <div className="absolute top-[15%] left-[-10%] w-[350px] h-[350px] bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none z-0 mix-blend-screen" />
                <div className="absolute bottom-[5%] right-[-15%] w-[300px] h-[300px] bg-blue-500/15 rounded-full blur-[90px] pointer-events-none z-0 mix-blend-screen" />

                <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
                  
                  {/* Linke Seite: Titel & Beschreibung */}
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-gray-100 mb-2">
                      {reference.title}
                    </h3>

                    <p className="text-xs md:text-sm text-gray-400 leading-relaxed mb-4">
                      {reference.description.split('KI-gestützter').length > 1 ? (
                        <>
                          {reference.description.split('KI-gestützter Analyse')[0]}
                          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">KI-gestützter Analyse</span>
                          {reference.description.split('KI-gestützter Analyse')[1]}
                        </>
                      ) : reference.description}
                    </p>

                    {/* Tech-Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {reference.tags.map((tag, idx) => (
                        <span key={idx} className="text-xs text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Button Link */}
                    <a href="https://aliebing-moviefinder-app-cj75ca.streamlit.app/" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-5 rounded-lg transition-colors">
                      Visit Project →
                    </a>
                  </div>

                  {/* Rechte Seite: Bild */}
                  <div className="w-full md:w-100 flex-shrink-0">
                    <a href="https://aliebing-moviefinder-app-cj75ca.streamlit.app/" target="_blank" rel="noopener noreferrer">
                      <img src="/images/moviefinder-screenshot.png" alt={reference.title} className="w-full h-auto rounded-lg shadow-lg hover:shadow-xl transition-shadow" />
                    </a>
                  </div>
                </div>

              </div>
            </div>
          ))}

      </div>
    </section>
  );
}