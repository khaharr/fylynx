'use client';

const BRANDS = [
  'CENTURY 21',
  'FONCIA',
  'ORPI IMMO',
  'DELOITTE',
  'KPMG AUDIT',
  'NEXITY',
  'CABINET MARTIN',
  'BRED BANQUE',
  'INEXTENSO',
  'ELEOM-AVOCATS',
  'K&C CARS'
];

export default function BrandsMarquee() {
  return (
    <section className="py-12 border-y border-slate-900 bg-slate-950/90 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Adopté par plus de 500 agences, cabinets comptables et professionnels de santé
        </p>
      </div>

      <div className="relative w-full overflow-hidden flex items-center gap-6 py-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="animate-marquee flex flex-row flex-nowrap shrink-0 items-center gap-6">
          {[...BRANDS, ...BRANDS].map((brand, i) => (
            <div
              key={`b1-${i}`}
              className="px-5 py-3 bg-slate-900/80 border border-slate-800 hover:border-brand-500/50 rounded-2xl font-extrabold text-xs text-slate-300 tracking-wider whitespace-nowrap shadow-sm hover:text-white transition-colors duration-300 flex items-center gap-2 shrink-0"
            >
              <span className="h-2 w-2 rounded-full bg-brand-400 animate-pulse" />
              {brand}
            </div>
          ))}
        </div>
        <div className="animate-marquee flex flex-row flex-nowrap shrink-0 items-center gap-6" aria-hidden="true">
          {[...BRANDS, ...BRANDS].map((brand, i) => (
            <div
              key={`b2-${i}`}
              className="px-5 py-3 bg-slate-900/80 border border-slate-800 hover:border-brand-500/50 rounded-2xl font-extrabold text-xs text-slate-300 tracking-wider whitespace-nowrap shadow-sm hover:text-white transition-colors duration-300 flex items-center gap-2 shrink-0"
            >
              <span className="h-2 w-2 rounded-full bg-brand-400 animate-pulse" />
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
