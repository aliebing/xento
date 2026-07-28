import Image from "next/image";

export default function Teaser() {
  return (
   <section className="relative w-full bg-[#060b13] text-white flex items-center justify-center overflow-hidden px-6 py-10 md:py-10">

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10 overflow-hidden p-8 rounded-3xl border border-gray-900/30 bg-[#070c16]/20 backdrop-blur-sm">
        {/* STARKER INNERER GLOW 1: Exakt bei top: 15% und left: 10% innerhalb dieser Box */}
        <div className="absolute top-[15%] left-[12%] w-[300px] h-[300px] bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none z-0 mix-blend-screen" />
        {/* STARKER INNERER GLOW 2: Auf der rechten Seite balanciert */}
        <div className="absolute bottom-[13%] right-[5%] w-[350px] h-[350px] bg-blue-500/20 rounded-full blur-[90px] pointer-events-none z-0 mix-blend-screen" />

        {/* Linke Spalte: Text & Buttons */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-cyan-400 uppercase bg-cyan-950/40 border border-cyan-800/30 rounded-md">
            Professional IT Services
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tigsht">
            Ihr Partner für <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Entwicklung & Beratung
            </span>
          </h1>
          
          <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-xl">
            Wir konzipieren, programmieren und betreiben geschäftskritische Webanwendungen. 
            Als inhabergeführte IT-Agentur bieten wir Ihnen erfahrene Senior-Expertise in 
            PHP (Symfony, Laravel), Vue.js und Cloud-Infrastrukturen.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <button className="px-6 py-3 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-lg shadow-blue-600/20 transition-all duration-200">
              Unsere Dienstleistungen
            </button>
            <button className="px-6 py-3 font-semibold text-gray-300 bg-gray-900/60 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 rounded-lg transition-all duration-200">
              Projekt anfragen
            </button>
          </div>
        </div>

        {/* Rechte Spalte: Profil-Karte */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="w-full max-w-sm bg-gradient-to-b from-[#2328339c] to-[#0a1125bd] border border-gray-800/60 rounded-2xl p-8 flex flex-col items-center text-center srelative backdrop-blur-sm">
            
            {/* Profilbild-Container */}
            <div className="relative w-45 h-45 rounded-full overflow-hidden border-2 border-cyan-500/30 p-1 mb-4">
              <div className="w-full h-full rounded-full overflow-hidden bg-gray-800 relative">
                <Image 
                  src="/images/profile_business.jpg" 
                  alt="Alexander Liebing"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-100">Alexander Liebing</h3>
            <p className="text-xs font-semibold text-cyan-400 tracking-wider uppercase mt-1">
              Founder & Lead Engineer
            </p>

            {/* Statistiken */}
            <div className="grid grid-cols-2 gap-4 w-full my-6 border-t border-b border-gray-800/80 py-4">
              <div>
                <p className="text-2xl font-extrabold text-blue-400">20+</p>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mt-1">Jahre Erfahrung</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-blue-400">15+</p>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mt-1">Großprojekte</p>
              </div>
            </div>

            {/* Tech Stack Badges */}
            <div className="flex flex-wrap justify-center gap-2 max-w-xs">
              {['PHP 8', 'Symfony', 'Laravel', 'Vue.js', 'Docker'].map((tech) => (
                <span 
                  key={tech} 
                  className="px-2.5 py-1 text-xs font-medium text-gray-400 bg-gray-900/80 border border-gray-800/60 rounded"
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

