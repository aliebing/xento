import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-4 group select-none">
      {/* Icon-Container (Kompakter: w-12 h-12 statt w-16 h-16) */}
      <div className="relative w-12 h-12 flex items-center justify-center">
        
        {/* Ebene 3 (Ganz hinten): Extrem transparent, Versatz von -6 auf -3 reduziert */}
        <div className="absolute w-8 h-8 rounded bg-cyan-400/[0.02] border border-cyan-400/10 -translate-x-3" />
        
        {/* Ebene 2 (Mitte): Deckkraft halbiert, Versatz von -3 auf -1.5 reduziert */}
        <div className="absolute w-8 h-8 rounded bg-cyan-400/[0.02] border border-cyan-400/15 -translate-x-1.5" />
        
        {/* Ebene 1 (Ganz vorne): Fläche transparenter (5%), Rahmen subtiler (40% Deckkraft), Glow deutlich abgeschwächt */}
       <div className="w-8 h-8 rounded bg-slate-500/[0.02] border border-slate-500/25 backdrop-blur-[2px] transition-all duration-300 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/[0.04]" />
   
        
      </div>
      
      <div className="flex flex-col">
        <span className="text-2xl font-black tracking-wide text-gray-400 leading-none transition-colors duration-300 group-hover:text-gray-200">
          X<span className="text-slate-400 font-extrabold transition-colors duration-300 group-hover:text-cyan-500/80">E</span>NTO
        </span>
        <span className="text-[10px] text-gray-600 font-semibold tracking-[0.2em] uppercase mt-1 transition-colors duration-300 group-hover:text-gray-500">
          it-solutions
        </span>
      </div>
    </Link>

  );
}