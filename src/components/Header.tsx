import React from 'react';
import { Phone, ShieldCheck, MapPin, LayoutDashboard, Home, CreditCard } from 'lucide-react';
import { CompanySettings } from '../types';

interface HeaderProps {
  settings: CompanySettings;
  activeView: 'client' | 'admin';
  onNavigate: (view: 'client' | 'admin') => void;
  pendingCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  activeView,
  onNavigate,
  pendingCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#070d19]/90 backdrop-blur-md border-b border-cyan-900/30">
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Left Side: Brand Mini & Location */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('client')}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-sky-400 p-[1px] shadow-sm">
              <div className="w-full h-full bg-[#070d19] rounded-[7px] flex items-center justify-center text-cyan-400 font-black text-sm group-hover:bg-cyan-950 transition-colors">
                ✝
              </div>
            </div>
            <div>
              <span className="font-extrabold text-xs sm:text-sm tracking-wider text-white block group-hover:text-cyan-300 transition-colors">
                SANTA MARIA
              </span>
              <span className="text-[10px] text-cyan-300/80 flex items-center gap-1 font-medium">
                <MapPin className="w-2.5 h-2.5 text-cyan-400" />
                SBC • SP
              </span>
            </div>
          </button>

          {/* 21x badge in header */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[11px] font-semibold text-cyan-300">
            <CreditCard className="w-3 h-3 text-cyan-400" />
            <span>Até 21x no Cartão</span>
          </div>
        </div>

        {/* Right Side: Direct Phone & Admin Toggle */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1.5 text-xs">
            <a
              href={`https://api.whatsapp.com/send?phone=${settings.whatsapp1}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-sky-200 border border-cyan-800/40 font-semibold transition-colors"
              title="WhatsApp 1"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>{settings.telefone1}</span>
            </a>
            <a
              href={`https://api.whatsapp.com/send?phone=${settings.whatsapp2}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-sky-200 border border-cyan-800/40 font-semibold transition-colors"
              title="WhatsApp 2"
            >
              <Phone className="w-3 h-3 text-cyan-400" />
              <span>{settings.telefone2}</span>
            </a>
          </div>

          <a
            href={`tel:${settings.telefone1.replace(/\D/g, '')}`}
            className="inline-flex lg:hidden items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-sky-200 border border-cyan-800/40 text-xs font-semibold transition-colors"
          >
            <Phone className="w-3 h-3 text-emerald-400" />
            <span>{settings.telefone1}</span>
          </a>

          {/* Navigation Toggle Button */}
          {activeView === 'client' ? (
            <button
              onClick={() => onNavigate('admin')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-white border border-cyan-500/40 text-xs font-semibold transition-all shadow-sm active:scale-95"
              title="Acessar Gestão de Atendimentos do Despachante"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
              <span>Painel Gestão</span>
              {pendingCount > 0 && (
                <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
          ) : (
            <button
              onClick={() => onNavigate('client')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 text-xs font-semibold transition-all active:scale-95"
            >
              <Home className="w-3.5 h-3.5 text-sky-400" />
              <span>Ver Site / Formulário</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
