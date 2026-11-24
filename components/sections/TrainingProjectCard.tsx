import Image from 'next/image';
import type { Dictionary } from '@/lib/i18n/dictionaries';

type Project = Dictionary['experience']['training']['projects'][number];

interface TrainingProjectCardProps {
  project: Project;
  highlightsLabel: string;
  url: string;
  repoUrl?: string;
  image: string;
}

export default function TrainingProjectCard({ project, highlightsLabel, url, repoUrl, image }: TrainingProjectCardProps) {
  return (
    <div className="w-full bg-[#141e32]/50 border border-gray-700/40 rounded-xl p-6 md:p-8 backdrop-blur-sm relative overflow-hidden">


      <div className="relative z-10 space-y-5">

        {/* Screenshot */}
        <a href={url} target="_blank" rel="noopener noreferrer" className="block">
          <Image
            src={image}
            alt={project.title}
            width={1440}
            height={900}
            sizes="(min-width: 1024px) 420px, 100vw"
            className="w-full h-auto rounded-lg border border-gray-700/60"
          />
        </a>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 px-2.5 py-1 rounded uppercase tracking-wider">
            {project.badge}
          </span>
          <span className="text-xs font-bold text-cyan-400">
            {project.approach}
          </span>
        </div>

        <h4 className="text-lg md:text-xl font-bold text-gray-100">{project.title}</h4>
        <p className="text-sm text-gray-300 leading-relaxed">{project.description}</p>

        {/* Highlights */}
        <div className="space-y-3">
          <h5 className="text-xs font-bold uppercase tracking-wider text-gray-300">{highlightsLabel}</h5>
          <ul className="space-y-2 text-xs md:text-sm text-gray-300/90 list-none pl-0">
            {project.highlights.map((item) => (
              <li key={item} className="relative pl-5 before:content-['-'] before:absolute before:left-0 before:text-cyan-500 before:font-bold">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Tech-Tags */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-700/40">
          {project.tags.map((tag) => (
            <span key={tag} className="text-xs text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-3">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold py-1.5 px-5 rounded-lg transition-colors"
          >
            {project.liveCta}
          </a>
          {repoUrl && (
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-gray-700 hover:border-cyan-500/60 text-gray-300 hover:text-cyan-400 text-sm font-semibold py-1.5 px-5 rounded-lg transition-colors"
            >
              {project.repoCta}
            </a>
          )}
        </div>

      </div>
    </div>
  );
}
