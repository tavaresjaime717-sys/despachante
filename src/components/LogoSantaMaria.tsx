import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const LogoSantaMaria: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = true,
  className = '',
}) => {
  const isLg = size === 'lg';
  const isSm = size === 'sm';

  return (
    <div className={`flex flex-col items-center text-center select-none ${className}`}>
      {/* Three pillars top badge */}
      <div className="flex items-center gap-2 mb-1.5 px-3 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-[10px] md:text-xs font-semibold tracking-wider text-cyan-300 uppercase shadow-inner">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
        <span>Agilidade</span>
        <span className="text-cyan-600">•</span>
        <span>Confiança</span>
        <span className="text-cyan-600">•</span>
        <span>Segurança</span>
      </div>

      {/* Main Brand Typography */}
      <div className="relative flex flex-col items-center">
        {/* DESPACHANTE */}
        <h2
          className={`font-black tracking-[0.22em] text-white uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] ${
            isLg ? 'text-2xl md:text-4xl' : isSm ? 'text-sm md:text-base' : 'text-lg md:text-2xl'
          }`}
          style={{ letterSpacing: '0.18em' }}
        >
          DESPACHANTE
        </h2>

        {/* SANTA ✝ MARIA with radiant cyan effect and cross */}
        <div className="relative flex items-center justify-center -mt-1 md:-mt-1.5">
          <div
            className={`font-black tracking-tight flex items-center justify-center text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-sky-400 drop-shadow-[0_0_20px_rgba(56,189,248,0.7)] ${
              isLg ? 'text-3xl md:text-5xl' : isSm ? 'text-xl md:text-2xl' : 'text-2xl md:text-4xl'
            }`}
          >
            <span>SANTA</span>

            {/* Stylized Cross as seen in the poster */}
            <div className="inline-flex flex-col items-center justify-center mx-1.5 md:mx-2 text-cyan-300 drop-shadow-[0_0_12px_rgba(56,189,248,0.9)]">
              <svg
                viewBox="0 0 24 32"
                fill="currentColor"
                className={`inline-block ${isLg ? 'w-6 h-9 md:w-8 md:h-11' : isSm ? 'w-4 h-6' : 'w-5 h-7 md:w-6 md:h-9'}`}
              >
                {/* Decorative Cross with fleur-de-lis inspired ends */}
                <path d="M11 2 C11 1.2 11.5 0.5 12 0 C12.5 0.5 13 1.2 13 2 L13 8 L18 8 C18.8 8 19.5 7.5 20 7 C19.5 7.5 20 8.5 20 9 C20 9.5 19.5 10.5 20 11 C19.5 10.5 18.8 10 18 10 L13 10 L13 26 C13 27 13.5 28 14 29 C13 28.5 12.5 28.5 12 30 C11.5 28.5 11 28.5 10 29 C10.5 28 11 27 11 26 L11 10 L6 10 C5.2 10 4.5 10.5 4 11 C4.5 10.5 4 9.5 4 9 C4 8.5 4.5 7.5 4 7 C4.5 7.5 5.2 8 6 8 L11 8 Z" />
                <circle cx="12" cy="9" r="1.5" fill="#38bdf8" />
              </svg>
            </div>

            <span>MARIA</span>
          </div>
        </div>

        {/* Decorative flourish line under Santa Maria */}
        <div className="w-full flex items-center justify-center my-0.5 max-w-[280px] md:max-w-[340px]">
          <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80"></div>
          <div className="w-2 h-2 rotate-45 border border-cyan-300 bg-sky-500 shadow-[0_0_8px_#38bdf8] mx-1"></div>
          <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80"></div>
        </div>
      </div>

      {showTagline && (
        <p className="mt-1 text-[11px] md:text-xs text-sky-200/80 font-medium tracking-wide">
          Soluções completas para você e seu veículo com rapidez e responsabilidade!
        </p>
      )}
    </div>
  );
};
