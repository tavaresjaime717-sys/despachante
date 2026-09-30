import React from 'react';
import { Phone, ShieldCheck, CreditCard, ChevronDown, CheckCircle, ArrowRight } from 'lucide-react';
import { CompanySettings } from '../types';
import { LogoSantaMaria } from './LogoSantaMaria';

interface HeroProps {
  settings: CompanySettings;
  onCtaClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ settings, onCtaClick }) => {
  return (
    <div className="relative pt-6 pb-8 md:pt-10 md:pb-12 text-center flex flex-col items-center">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* DETRAN.SP Partner Pill */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-xs font-semibold text-cyan-200 mb-5 shadow-lg backdrop-blur-sm">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="font-extrabold text-cyan-300">DETRAN.SP</span>
        <span className="text-cyan-600">|</span>
        <span>Atendimento Credenciado em SBC</span>
      </div>

      {/* Main Logo & Typography */}
      <div className="mb-4">
        <LogoSantaMaria size="lg" showTagline={true} />
      </div>

      {/* Payment Highlight Pill from Poster */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-900/90 via-cyan-900/80 to-blue-900/90 border-2 border-cyan-400 text-white font-black text-sm sm:text-base shadow-[0_0_25px_rgba(56,189,248,0.4)] my-3 tracking-wide transform hover:scale-105 transition-transform">
        <CreditCard className="w-5 h-5 text-cyan-300" />
        <span>EM ATÉ 21X NO CARTÃO</span>
      </div>

      {/* Primary Phone Bar with Both WhatsApps */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <a
          href={`https://api.whatsapp.com/send?phone=${settings.whatsapp1}&text=${encodeURIComponent(
            'Olá, gostaria de informações sobre serviços com o Despachante Santa Maria!'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-950/60 border border-emerald-400/40 group active:scale-95 transition-all"
        >
          <div className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center">
            <Phone className="w-3.5 h-3.5 fill-current" />
          </div>
          <span>WhatsApp 1: {settings.telefone1}</span>
        </a>

        <a
          href={`https://api.whatsapp.com/send?phone=${settings.whatsapp2}&text=${encodeURIComponent(
            'Olá! Gostaria de atendimento com o Despachante Santa Maria.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-cyan-950/60 border border-cyan-400/40 group active:scale-95 transition-all"
        >
          <div className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center">
            <Phone className="w-3.5 h-3.5" />
          </div>
          <span>WhatsApp 2: {settings.telefone2}</span>
        </a>

        <button
          type="button"
          onClick={onCtaClick}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold text-sm sm:text-base transition-all active:scale-95"
        >
          <span>Consultar Placa e CRLV</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Quick reassurance ticks */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300">
        <span className="flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          Sem Filas
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          CRLV-e na Hora
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          Orçamento Grátis
        </span>
      </div>
    </div>
  );
};
