const skillsData = [
  {
    category: 'Programmierung & Backend',
    skills: [
      { name: 'PHP 7.4 / 8.x', percentage: 95 },
      { name: 'Symfony Framework', percentage: 90 },
      { name: 'Slim & Zend Framework', percentage: 85 },
      { name: 'Laravel', percentage: 80 },
      { name: 'RESTful & SOAP APIs', percentage: 95 }
    ]
  },
  {
    category: 'Frontend',
    skills: [
      { name: 'Vue.js', percentage: 80 },
      { name: 'JavaScript (ES6+)', percentage: 85 },
      { name: 'HTML5 / Vanilla CSS', percentage: 90 },
      { name: 'Responsive Layouts', percentage: 95 }
    ]
  },
  {
    category: 'Datenspeicher & Middleware',
    skills: [
      { name: 'MySQL / MariaDB', percentage: 90 },
      { name: 'Doctrine ORM / Idiorm', percentage: 90 },
      { name: 'Redis (Caching)', percentage: 80 },
      { name: 'Graylog (Log Management)', percentage: 85 }
    ]
  },
  {
    category: 'DevOps & Toolchain',
    skills: [
      { name: 'Docker', percentage: 85 },
      { name: 'Git (GitLab / GitHub)', percentage: 90 },
      { name: 'CI/CD Pipelines (Azure, GitLab)', percentage: 80 },
      { name: 'AWS & Cloud Services', percentage: 75 },
      { name: 'PHPUnit & TDD', percentage: 85 }
    ]
  }
];

export default function TechnologischesProfil() {
  return (
    <section id="techstack" className="w-full bg-[#0c1016] text-white py-30 px-6 relative overflow-hidden border-t border-b border-gray-700/70">
      <div className="max-w-7xl mx-auto relative z-10 w-full">
        
        {/* STARKER INNERER GLOW 1: Exakt bei top: 15% und left: 10% innerhalb dieser Box */}
        <div className="absolute top-[35%] left-[0%] w-[400px] h-[400px] bg-cyan-500/12 rounded-full blur-[100px] pointer-events-none z-0 mix-blend-screen" />
        {/* STARKER INNERER GLOW 2: Auf der rechten Seite balanciert */}
        <div className="absolute bottom-[20%] right-[12%] w-[300px] h-[300px] bg-blue-500/15 rounded-full blur-[90px] pointer-events-none z-0 mix-blend-screen" />

        {/* Sektions-Header aus dem Bild */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Technologisches Profil
          </h2>
          {/* Kleiner blauer Akzentstrich unter der Überschrift */}
          <div className="w-12 h-1 bg-blue-500 mx-auto rounded-full mt-2"></div>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed pt-2">
            Professionelle Werkzeuge, die wir täglich beherrschen, um Ihre Visionen in performanten Code zu gießen.
          </p>
        </div>

        {/* 2-Spalten-Grid (Mobile 1, ab MD 2 Spalten für das 4er-Raster) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillsData.map((categoryBlock, index) => (
            <div 
              key={index} 
              className="bg-[#0b111e]/40 border border-gray-800/60 rounded-2xl p-8 md:p-10 flex flex-col backdrop-blur-sm shadow-2xl"
            >
              {/* Kategorie-Titel mit Cyanfarbener Schrift */}
              <h3 className="text-lg font-bold text-cyan-400 mb-8">
                {categoryBlock.category}
              </h3>

              {/* Liste der Skill-Balken */}
              <div className="space-y-6">
                {categoryBlock.skills.map((skill, idx) => (
                  <div key={idx} className="space-y-2">
                    
                    {/* Name & Prozentwert */}
                    <div className="flex justify-between text-xs md:text-sm font-medium text-gray-400">
                      <span>{skill.name}</span>
                      <span>{skill.percentage}%</span>
                    </div>

                    {/* Hintergrund-Balken */}
                    <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden">
                      {/* Fortschritts-Balken (Nutzt CSS-Variable für flexible Breite) */}
                      <div 
                        className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
                        style={{ width: `${skill.percentage}%` }}
                      />
                    </div>

                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}