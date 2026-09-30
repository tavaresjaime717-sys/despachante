import React from 'react';

interface MercosulPlatePreviewProps {
  placa: string;
}

export const MercosulPlatePreview: React.FC<MercosulPlatePreviewProps> = ({ placa }) => {
  const displayPlaca = placa.trim() ? placa.toUpperCase() : 'PLACA';

  return (
    <div className="relative inline-flex flex-col items-center justify-between w-48 sm:w-56 h-18 sm:h-20 bg-slate-100 border-[3px] border-slate-900 rounded-lg shadow-lg overflow-hidden select-none">
      {/* Top Blue Bar */}
      <div className="w-full bg-[#003399] px-2 py-0.5 flex items-center justify-between text-white text-[9px] sm:text-[10px] font-bold tracking-widest uppercase">
        <div className="flex items-center gap-1">
          {/* Mercosul 4 stars emblem */}
          <span className="text-[10px] text-amber-300">★</span>
          <span>MERCOSUL</span>
        </div>
        <span className="font-extrabold tracking-wider">BRASIL</span>
        {/* Brazilian Flag Miniature */}
        <div className="w-4 h-2.5 bg-[#009c3b] relative flex items-center justify-center rounded-[1px] overflow-hidden">
          <div className="w-2.5 h-1.5 bg-[#ffdf00] rotate-45 transform"></div>
          <div className="w-1 h-1 bg-[#002776] rounded-full absolute"></div>
        </div>
      </div>

      {/* Main Plate Body */}
      <div className="flex-1 w-full flex items-center justify-center bg-white px-2">
        <span
          className="font-mono font-black text-2xl sm:text-3xl tracking-widest text-slate-900"
          style={{ letterSpacing: '0.18em', fontFamily: 'monospace' }}
        >
          {displayPlaca}
        </span>
      </div>

      {/* Watermark / Hologram subtle strip */}
      <div className="absolute bottom-1 right-2 text-[7px] text-slate-400 font-bold uppercase tracking-wider">
        BR • DETRAN
      </div>
    </div>
  );
};
