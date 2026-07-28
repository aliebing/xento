const projectsData = [
  {
    id: 1,
    category: 'entwicklung',
    period: '07/2019 - 03/2026 (6 Jahre)',
    role: 'Lead Backend Developer (Freelance)',
    title: 'Kundenportal & ERP-Architektur (Energieversorger)',
    description: 'Modernisierung und Betreuung des Kunden- und Vertragsportals für einen führenden Energiewirtschafts-Dienstleister. Fokussiert auf Skalierbarkeit, Performance und moderne REST-APIs.',
    tasks: [
      'Refactoring veralteter SOAP-Schnittstellen zu hochperformanten REST-APIs.',
      'Konzeption und Implementierung eines flexiblen Mahnverfahren-Moduls.',
      'Performance-Tuning von Datenbankabfragen und Massenverarbeitung (CSV/Cron-Jobs).',
      'Sicherstellung der DSGVO-Konformität (automatisierte Fristenprüfung und Datenlöschung).',
      'Etablierung eines Monitorings und Log-Analysen über Graylog zur Fehlererkennung.'
    ],
    tags: ['PHP 8.x', 'Slim', 'Idiorm', 'REST API', 'Docker', 'Graylog', 'SQL', 'Scrum']
  },
  {
    id: 2,
    category: 'entwicklung',
    period: '01/2017 - 12/2017 (1 Jahr)',
    role: 'Symfony Core Developer (Freelance)',
    title: 'Workflow-Modul für Mehrmandantenfähigkeit (Schiffswerft)',
    description: 'Überführung eines komplexen Bauabwicklungsmoduls aus einem Monolithen in ein eigenständiges, mandantenfähiges Symfony-Workflow-Modul.',
    tasks: [
      'Erweiterung der Symfony Workflow-Kernkomponenten für mandantenspezifische Logik.',
      'Implementierung komplexer Prozessketten mittels Pipeline-Patterns (Event-Dispatcher/Subscriber).',
      'Erstellung von Twig-Extensions für dynamische Sub-Templates (Rechte- und Rollensteuerung).',
      'Verfassen der technischen Spezifikationen und Systemdokumentation in Markdown.'
    ],
    tags: ['Symfony 3/4', 'Workflow Engine', 'Doctrine', 'Pipeline Pattern', 'Event-Dispatcher']
  },
  {
    id: 3,
    category: 'entwicklung',
    period: '2016 - 2017',
    role: 'Symfony Core Developer (Freelance)',
    title: 'E-Commerce-Automatisierung & Subscription (Security Software)',
    description: 'Entwicklung und Automatisierung von Abo- und Vertragsänderungsprozessen innerhalb des globalen E-Commerce-Kundenportals.',
    tasks: [
      'Erweiterung der Sonata-Admin Backend-Schnittstellen.',
      'Implementierung automatisierter Validierungen bei Vertragsänderungen.',
      'Erstellung von Twig-Extensions für dynamische Sub-Templates (Rechte- und Rollensteuerung).',
      'Qualitätssicherung durch End-to-End-Testing mit Selenium und Cucumber-Gherkin.'
    ],
    tags: ['Symfony 3/4', 'Sonata Admin', 'Doctrine', 'Selenium', 'Cucumber', 'E-Commerce', 'Subscription Management']
  },
  {
    id: 4,
    category: 'entwicklung',
    period: '2015 - 2016',
    role: 'Symfony Core Developer (Freelance)',
    title: 'Migration Buchungsstrecke (Internetagentur)',
    description: 'Entwicklung und Migration einer geschäftskritischen Buchungsstrecke von Typo3 in eine performante, eigenständige Symfony-Anwendung.',
    tasks: [
      'Kopplung von Legacy-Content-Systemen mit dem neuen Buchungskern.',
      'Entwicklung dynamischer Pricing- und Buchungs-Schnittstellen.'
    ],
    tags: ['Symfony 3', 'Typo3API', 'REST', 'Bootstrap', 'MySQL', 'Booking Engine']
  },
  {
    id: 5,
    category: 'entwicklung',
    period: '2009 - 2014',
    role: 'Magento (Freelance)',
    title: 'Entwicklung White-Label Reisesysteme (Reiseportale)',
    description: 'Entwicklung von flexiblen White-Label-Lösungen für namhafte Reiseportale zur dynamischen Auslieferung von Urlaubsangeboten.',
    tasks: [
      'Erstellung von jQuery-basierten Plugins für interaktive Buchungselemente.',
      'Entwicklung von individuellen Versand- und Preis-Update-Modulen für Magento-Shops.',
      'Durchführung komplexer Plattform-Upgrades (Magento 1.5 auf 1.7).'
    ],
    tags: ['Magento', 'jQuery', 'PHP', 'Frontend-Widgets']
  }
];

export default function Projects() {
  return (
    <section id="projects" className="w-full bg-[#060b13] text-white py-30 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header-Bereich */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Erfolgsgeschichten & Projekthistorie
          </h2>
          <div className="w-12 h-1 bg-blue-500 mx-auto rounded-full mt-2"></div>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Ein Auszug aus über 20 Jahren erfolgreicher Projektrealisierung im Enterprise- und KMU-Bereich.
          </p>
        </div>

        {/* Projekt-Liste mit Zeitleisten-Effekt */}
        <div className="relative border-l border-gray-800/60 pl-6 md:pl-8 space-y-12">
          
          {projectsData.map((project) => (
            <div key={project.id} className="relative group">
              
              {/* Der blau leuchtende Timeline-Punkt */}
              <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#060b13] border-2 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]" />

              {/* Projekt-Karte */}
              <div className="w-full bg-[#0b111e]/50 border border-gray-800/40 rounded-xl p-6 md:p-8 backdrop-blur-sm shadow-xl">
                
                {/* Meta-Zeile (Datum & Rolle) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800/60 pb-4 mb-5">
                  <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 px-2.5 py-1 rounded">
                    {project.period}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {project.role}
                  </span>
                </div>

                {/* Titel & Beschreibung */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-100 mb-3">
                  {project.title}
                </h3>
                <p className="text-sm md:text-base text-gray-400 leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* Aufgaben / Ergebnisse */}
                <div className="space-y-3 mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Ergebnisse & Tätigkeiten:
                  </h4>
                  <ul className="space-y-2 text-xs md:text-sm text-gray-400/90 list-none pl-0">
                    {project.tasks.map((task, idx) => (
                      <li key={idx} className="relative pl-5 before:content-['-'] before:absolute before:left-0 before:text-cyan-500 before:font-bold">
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech-Tags */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-800/40">
                  {project.tags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-1 text-xs font-medium text-gray-400 bg-gray-900/80 border border-gray-800/60 rounded transition-colors hover:border-gray-700 hover:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}