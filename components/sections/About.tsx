import Image from "next/image";

const features = [
  {
    title: 'IHK-Zertifiziert',
    desc: 'Softwareentwicklung 2001 / 2003'
  },
  {
    title: 'Architekturfokus',
    desc: 'DDD, OOP, State-Machines, Workflows'
  },
  {
    title: 'Flexibler Einsatz',
    desc: 'Remote oder vor Ort im Raum Karlsruhe'
  }
];

export default function About() {
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
                  alt="Alexander Liebing"
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
            Das Gesicht hinter der Firma
          </span>
          
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-100">
            Über Alexander Liebing
          </h2>

          <div className="space-y-4 text-gray-400 text-sm md:text-base leading-relaxed max-w-3xl">
            <p className="text-gray-200 font-medium">
              Ich verstehe mich immer als leidenschaftlicher Softwarearchitekt und Fullstack-Entwickler mit starkem Fokus auf Robustheit, sauberen Code (Clean Code) und pragmatische Lösungen.
            </p>
            <p>
              Seit meiner Ausbildung zum Fachinformatiker im Jahr 2003 und IHK-Zertifizierung als Softwareentwickler im Internet (2001) habe ich Systeme für namhafte Konzerne wie die EnBW (Powercloud) und die Lürssenwerft konzipiert und betreut.
            </p>
            <p>
              Mit der Firmengründung verfolge ich das Ziel, mein Wissen und meine mehr als 20-jährige Erfahrung flexibel für Ihre anspruchsvollen Softwareprojekte einzubringen. Ob Sie zusätzliche Entwicklungspower (Symfony / Laravel), eine architektonische Beratung bei Legacy-Migrationen oder professionellen Support für den Systembetrieb suchen: Wir stehen an Ihrer Seite.
            </p>
          </div>

          {/* Die 3 Feature-Boxen unten */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            {features.map((feat, idx) => (
              <div key={idx} className="bg-[#0b111e]/30 border border-gray-800/40 rounded-xl p-5 backdrop-blur-sm">
                <h4 className="text-cyan-400 text-sm font-bold mb-1">{feat.title}</h4>
                <p className="text-gray-400 text-xs leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}