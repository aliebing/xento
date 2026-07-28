const servicesData = [
  {
    title: 'Programmierung',
    subtitle: 'Skalierbare & sichere Backend- & Frontend-Architekturen',
    iconColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    points: [
      'Fullstack-Entwicklung mit PHP (Symfony, Laravel) und Vue.js',
      'Konzeption robuster REST- & SOAP-Schnittstellen',
      'Refactoring & Migration von Legacy-Monolithen zu Microservices',
      'Automatisierte Testverfahren (TDD, E2E mit Selenium/PHPUnit)'
    ]
  },
  {
    title: 'Beratung & Konzeption',
    subtitle: 'Strategische IT-Beratung für zukunftssichere Systeme',
    iconColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    points: [
      'Architekturentwürfe (Domain-Driven Design, State-Machines)',
      'Technologie-Evaluation und Migrationskonzepte',
      'Beratung zu DSGVO- & Sicherheitsstandards im Web',
      'Einführung agiler Entwicklungsprozesse & CI/CD Pipelines'
    ]
  },
  {
    title: 'Support & Wartung',
    subtitle: 'Zuverlässiger technischer Betrieb Ihrer Applikationen',
    iconColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    points: [
      'Proaktives Monitoring (Graylog, Log-Management)',
      'Laufende Datenbank- und Abfragenoptimierungen',
      'Zeitnaher Bugfixing- & Hotfix-Service',
      'Updates von Symfony/Laravel-Frameworks und PHP-Versionen'
    ]
  }
];

export default function Services() {
  return (
    <section id="services" className="w-full bg-[#0c1016] text-white py-30 px-6 relative overflow-hidden border-t border-b border-gray-700/70">
      <div className="max-w-7xl mx-auto relative z-10 w-full">
        
        {/* Sektions-Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Unsere Dienstleistungen
          </h2>
          <div className="w-12 h-1 bg-blue-500 mx-auto rounded-full mt-2"></div>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Maßgeschneiderte Lösungen für anspruchsvolle IT-Projekte. Wir begleiten Sie von der Idee bis zum produktiven Betrieb.
          </p>
        </div>

        {/* 3-Spalten-Grid (Profitiert jetzt voll von der erweiterten Breite) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {servicesData.map((service, index) => (
            <div 
              key={index} 
              className="bg-[#0b111e]/40 border border-gray-800/40 rounded-2xl p-8 md:p-10 flex flex-col backdrop-blur-sm shadow-xl transition-all duration-300 hover:border-gray-700/60"
            >
              {/* Farb-Icon-Badge oben links */}
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-6 ${service.iconColor}`}>
                {service.icon}
              </div>

              {/* Titel & Untertitel */}
              <h3 className="text-xl font-bold text-gray-100 mb-2">
                {service.title}
              </h3>
              <p className="text-xs text-gray-400/80 leading-relaxed font-medium mb-8">
                {service.subtitle}
              </p>

              {/* Aufzählungspunkte */}
              <ul className="space-y-4 mt-auto">
                {servicesData[index].points.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-gray-400/90 leading-relaxed">
                    <span className="text-cyan-400 font-semibold select-none flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}