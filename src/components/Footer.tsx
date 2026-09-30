import React from 'react';
import { MapPin, Phone, ShieldCheck, Lock } from 'lucide-react';
import { CompanySettings } from '../types';

interface FooterProps {
  settings: CompanySettings;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenAdmin }) => {
  return (
    <footer className="mt-16 border-t border-cyan-900/30 bg-[#050a14] pt-10 pb-8 text-slate-400 text-xs">
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          {/* Brand Info */}
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-cyan-400 font-black text-lg">✝</span>
              <span className="font-extrabold text-white text-base tracking-wider uppercase">
                {settings.nomeEmpresa}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {settings.slogan} • Soluções automotivas e documentais em SBC
            </p>
          </div>

          {/* Quick Contacts */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a
              href={`https://api.whatsapp.com/send?phone=${settings.whatsapp1}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp 1: {settings.telefone1}</span>
            </a>

            <span className="hidden sm:inline text-slate-700">•</span>

            <a
              href={`https://api.whatsapp.com/send?phone=${settings.whatsapp2}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              <span>WhatsApp 2: {settings.telefone2}</span>
            </a>

            <span className="hidden sm:inline text-slate-700">•</span>

            <div className="flex items-center gap-1.5 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{settings.endereco}, {settings.bairro} - SBC</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-900 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} {settings.nomeEmpresa}. Todos os direitos reservados.
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Credenciado Detran.SP
            </span>

            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-cyan-300 transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Acesso Restrito / Gestão</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
