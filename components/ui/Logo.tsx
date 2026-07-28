import Link from 'next/link';

export default function Logo() {
  return (
        <Link href="/" className="flex items-center gap-6 group select-none">
          {/* Icon-Container (w-16 h-16) */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            
            {/* Ebene 3 (Ganz hinten): Fast transparentes Hellblau, nach links versetzt, ungedreht */}
            <div className="absolute w-12 h-12 rounded bg-cyan-400/[0.06] border border-cyan-400/10 -translate-x-6" />
            
            {/* Ebene 2 (Mitte): Leicht sichtbares Hellblau, mittlerer Versatz, ungedreht */}
            <div className="absolute w-12 h-12 rounded bg-cyan-400/[0.04] border border-cyan-400/30 -translate-x-3" />
            
            {/* Ebene 1 (Ganz vorne): Strahlendes Hellblau (Glass-Blur) mit solidem Rahmen, ungedreht & permanenter Glow */}
            <div className="absolute w-12 h-12 rounded bg-cyan-500/20 border border-cyan-400 backdrop-blur-[5px] translate-x-1 shadow-[0_0_25px_rgba(34,211,238,0.35)]" />
            
          </div>
          
          {/* Text-Bereich mit cyanblauem "E" */}
          <div className="flex flex-col">
            <span className="text-3xl font-black tracking-wide text-white leading-none">
              X<span className="text-cyan-400">E</span>NTO
            </span>
            <span className="text-[12px] text-gray-400 font-semibold tracking-[0.2em] uppercase mt-1.5">
              it-solutions
            </span>
          </div>
        </Link>

  );
}