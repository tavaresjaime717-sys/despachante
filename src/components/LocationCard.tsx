import React from 'react';
import { MapPin, Clock, CreditCard, Navigation, Phone, ExternalLink } from 'lucide-react';
import { CompanySettings } from '../types';

interface LocationCardProps {
  settings: CompanySettings;
}

export const LocationCard: React.FC<LocationCardProps> = ({ settings }) => {
  return (
    <div className="w-full rounded-2xl bg-gradient-to-br from-slate-900 via-[#0a162b] to-[#070f1e] border border-cyan-800/40 p-5 sm:p-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Address and Map Info */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase">
                Endereço de Atendimento Presencial
              </span>
              <h4 className="text-base sm:text-lg font-bold text-white">
                {settings.endereco}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300">
                {settings.bairro} • {settings.cidadeUf}
              </p>
            </div>
          </div>

          {/* Operating hours */}
          <div className="flex items-center gap-2.5 text-xs text-slate-400 pl-1">
            <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{settings.horarioFuncionamento}</span>
          </div>

          {/* Installment Badge from Poster */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold">
            <CreditCard className="w-4 h-4 text-cyan-400" />
            <span>Facilitamos débitos e serviços {settings.parcelamento}</span>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
          <a
            href={settings.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <Navigation className="w-4 h-4" />
            <span>Abrir no Google Maps</span>
            <ExternalLink className="w-3 h-3 text-cyan-200" />
          </a>

          <a
            href={`https://api.whatsapp.com/send?phone=${settings.whatsapp1}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow active:scale-95"
          >
            <Phone className="w-4 h-4 fill-current" />
            <span>WhatsApp 1: {settings.telefone1}</span>
          </a>

          <a
            href={`https://api.whatsapp.com/send?phone=${settings.whatsapp2}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700 active:scale-95"
          >
            <Phone className="w-4 h-4 text-cyan-400" />
            <span>WhatsApp 2: {settings.telefone2}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
