import type { Dictionary } from '@/lib/i18n/dictionaries';
import TrainingProjectCard from './TrainingProjectCard';
import { TRAINING_PROJECTS } from '@/lib/links';

export default function Experience({ dict }: { dict: Dictionary['experience'] }) {
  return (
    <section id="experience" className="w-full bg-[#0b1220] text-white py-30 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header-Bereich */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            {dict.title}
          </h2>
          <div className="w-12 h-1 bg-cyan-500 mx-auto rounded-full mt-2"></div>
          <p className="text-gray-300 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            {dict.intro}
          </p>
        </div>

        {/* Projekt-Liste mit Zeitleisten-Effekt */}
        <div className="relative border-l border-gray-700/60 pl-6 md:pl-8 space-y-12">

          {/* Weiterbildung AI Engineer (neuester Eintrag zuerst) */}
          <div className="relative">
            <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#0b1220] border-2 border-cyan-400" />

            <div className="w-full bg-[#141e32]/50 border border-gray-700/40 rounded-xl p-6 md:p-8 backdrop-blur-sm mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-700/60 pb-4 mb-5">
                <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 px-2.5 py-1 rounded">
                  {dict.training.period}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  {dict.training.badge}
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-100 mb-3">
                {dict.training.title}
              </h3>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                {dict.training.description}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {dict.training.projects.map((project, i) => (
                <TrainingProjectCard
                  key={project.title}
                  project={project}
                  highlightsLabel={dict.training.highlightsLabel}
                  {...TRAINING_PROJECTS[i]}
                />
              ))}
            </div>
          </div>

          {dict.projects.map((project) => (
            <div key={project.title} className="relative group">

              {/* Der blau leuchtende Timeline-Punkt */}
              <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#0b1220] border-2 border-cyan-400" />

              {/* Projekt-Karte */}
              <div className="w-full bg-[#141e32]/50 border border-gray-700/40 rounded-xl p-6 md:p-8 backdrop-blur-sm">

                {/* Meta-Zeile (Datum & Rolle) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-700/60 pb-4 mb-5">
                  <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 px-2.5 py-1 rounded">
                    {project.period}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    {project.role}
                  </span>
                </div>

                {/* Titel & Beschreibung */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-100 mb-3">
                  {project.title}
                </h3>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* Aufgaben / Ergebnisse */}
                <div className="space-y-3 mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                    {dict.resultsLabel}
                  </h4>
                  <ul className="space-y-2 text-xs md:text-sm text-gray-300/90 list-none pl-0">
                    {project.tasks.map((task) => (
                      <li key={task} className="relative pl-5 before:content-['-'] before:absolute before:left-0 before:text-cyan-500 before:font-bold">
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech-Tags */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-700/40">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs font-medium text-gray-300 bg-gray-900/80 border border-gray-700/60 rounded transition-colors hover:border-gray-700 hover:text-gray-300"
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
