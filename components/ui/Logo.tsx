import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';

interface LogoProps {
  lang: Locale;
  /** 'default' für die Hauptnavigation, 'small' für z. B. den Footer. */
  size?: 'default' | 'small';
}

export default function Logo({ lang, size = 'default' }: LogoProps) {
  const isSmall = size === 'small';

  return (
    <Link href={`/${lang}`} className={`flex items-center ${isSmall ? 'gap-4' : 'gap-3 sm:gap-6'} group select-none`}>
      <div className={`relative ${isSmall ? 'w-12 h-12' : 'w-12 h-12 sm:w-16 sm:h-16'} flex items-center justify-center`}>
        {isSmall ? (
          <>
            <div className="absolute w-8 h-8 rounded bg-cyan-400/2 border border-cyan-400/10 -translate-x-3" />
            <div className="absolute w-8 h-8 rounded bg-cyan-400/2 border border-cyan-400/15 -translate-x-1.5" />
            <div className="w-8 h-8 rounded bg-slate-500/2 border border-slate-500/25 backdrop-blur-[2px] transition-all duration-300 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/4" />
          </>
        ) : (
          <>
            <div className="absolute w-12 h-12 rounded bg-cyan-400/6 border border-cyan-400/10 -translate-x-6" />
            <div className="absolute w-12 h-12 rounded bg-cyan-400/4 border border-cyan-400/30 -translate-x-3" />
            <div className="absolute w-12 h-12 rounded bg-cyan-500/20 border border-cyan-400 backdrop-blur-[5px] translate-x-1 shadow-[0_0_25px_rgba(34,211,238,0.35)]" />
          </>
        )}
      </div>

      <div className="flex flex-col">
        <span
          className={`${isSmall ? 'text-2xl text-gray-400 group-hover:text-gray-200' : 'text-3xl text-white'} font-black tracking-wide leading-none transition-colors duration-300`}
        >
          X
          <span className={isSmall ? 'text-slate-400 font-extrabold transition-colors duration-300 group-hover:text-cyan-500/80' : 'text-cyan-400'}>
            E
          </span>
          NTO
        </span>
        <span
          className={`${isSmall ? 'text-[10px] text-gray-600 group-hover:text-gray-500' : 'text-[12px] text-gray-400'} font-semibold tracking-[0.2em] uppercase whitespace-nowrap mt-1.5 transition-colors duration-300`}
        >
          it-solutions
        </span>
      </div>
    </Link>
  );
}
