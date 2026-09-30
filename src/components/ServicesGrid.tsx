import React, { useState } from 'react';
import {
  FileText,
  CreditCard,
  UserCheck,
  Car,
  FlaskConical,
  RefreshCw,
  ShieldAlert,
  Scale,
  Clock,
  ThumbsUp,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
  Phone,
  X,
  ExternalLink,
  Printer,
  Sparkles,
} from 'lucide-react';
import { SERVICOS_LIST } from '../utils/storage';
import { CompanySettings } from '../types';
import { openWhatsAppChat } from '../utils/whatsapp';

interface ServicesGridProps {
  selectedService: string;
  onSelectService: (serviceName: string) => void;
  settings: CompanySettings;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  FileText: <FileText className="w-6 h-6" />,
  CreditCard: <CreditCard className="w-6 h-6" />,
  UserCheck: <UserCheck className="w-6 h-6" />,
  Car: <Car className="w-6 h-6" />,
  FlaskConical: <FlaskConical className="w-6 h-6" />,
  RefreshCw: <RefreshCw className="w-6 h-6" />,
  ShieldAlert: <ShieldAlert className="w-6 h-6" />,
  Scale: <Scale className="w-6 h-6" />,
};

export const ServicesGrid: React.FC<ServicesGridProps> = ({
  selectedService,
  onSelectService,
  settings,
}) => {
  const [activeModalService, setActiveModalService] = useState<string | null>(null);

  const handleCardClick = (servName: string, isLicenciamento: boolean) => {
    if (isLicenciamento) {
      onSelectService(servName);
      const formElement = document.getElementById('formulario-atendimento');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // For other services, open the WhatsApp contact modal as requested
      setActiveModalService(servName);
    }
  };

  const handleOpenWhatsAppForService = (targetNumber: '1' | '2', serviceName: string) => {
    const targetPhone = targetNumber === '1' ? settings.whatsapp1 : settings.whatsapp2;
    const message = [
      `Olá! Gostaria de mais informações e cotação para o serviço de *${serviceName}* no *${settings.nomeEmpresa}*.`,
      '',
      `Quais são os documentos necessários, taxas e prazos?`,
      '',
      `📍 Vi no site oficial (Unidade ${settings.bairro} - SBC). Aguardo orientações!`,
    ].join('\n');

    openWhatsAppChat(targetPhone, message);
    setActiveModalService(null);
  };

  return (
    <section className="w-full space-y-6">
      {/* Services Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-900/30 pb-3">
        <div>
          <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider block">
            Detran.SP e Poupatempo • SBC
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            Serviços do Despachante
          </h3>
        </div>
        <div className="text-xs text-slate-300 bg-cyan-950/80 border border-cyan-500/30 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Para mais informações de outros serviços, consulte no WhatsApp!</span>
        </div>
      </div>

      {/* Services Grid (8 primary services from the poster) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {SERVICOS_LIST.slice(0, 8).map((serv) => {
          const isLicenciamento =
            serv.id === 'licenciamento' || serv.nome.includes('Licenciamento');
          const isSelected = selectedService === serv.nome;

          return (
            <div
              key={serv.id}
              className={`p-4 rounded-xl text-left transition-all duration-200 relative group flex flex-col justify-between border ${
                isLicenciamento
                  ? 'bg-gradient-to-b from-cyan-950/90 to-sky-950/80 border-cyan-400 shadow-[0_0_20px_rgba(0,180,216,0.25)] ring-1 ring-cyan-400'
                  : 'bg-slate-900/60 hover:bg-slate-850/80 border-slate-800 hover:border-cyan-600/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      isLicenciamento
                        ? 'bg-cyan-500 text-slate-950 shadow-md'
                        : 'bg-cyan-950/80 text-cyan-400 group-hover:bg-cyan-900 group-hover:text-cyan-200'
                    }`}
                  >
                    {ICON_MAP[serv.icone] || <FileText className="w-5 h-5" />}
                  </div>

                  {isLicenciamento ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-500/40">
                      <Printer className="w-3 h-3 text-cyan-400" />
                      Emissão & Impressão Online
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300 bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      <MessageSquare className="w-3 h-3" />
                      Falar no WhatsApp
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors uppercase leading-tight">
                  {serv.nome}
                </h4>

                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {serv.descricao}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                {isLicenciamento ? (
                  <button
                    type="button"
                    onClick={() => handleCardClick(serv.nome, true)}
                    className="w-full py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-colors active:scale-95"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Informar Placa e CRLV</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleCardClick(serv.nome, false)}
                    className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-emerald-950 hover:text-emerald-300 hover:border-emerald-500/50 text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all active:scale-95"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Consultar no WhatsApp ➔</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Prominent Banner for Other Services & WhatsApp */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0d1d3a] via-[#09172e] to-[#0a1b35] border border-cyan-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
            <MessageSquare className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-extrabold text-white">
              Precisa de informações sobre outros serviços do DETRAN?
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Fale diretamente com os despachantes pelos dois WhatsApps cadastrados para orçamentos e dúvidas:
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => handleOpenWhatsAppForService('1', 'Outros Serviços')}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>WhatsApp 1: {settings.telefone1}</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenWhatsAppForService('2', 'Outros Serviços')}
            className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>WhatsApp 2: {settings.telefone2}</span>
          </button>
        </div>
      </div>

      {/* Modal for Service WhatsApp Inquiry */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0b172d] border border-cyan-500/50 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl relative text-slate-100">
            <button
              onClick={() => setActiveModalService(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-400/40 flex items-center justify-center text-cyan-300 mx-auto mb-3">
              <MessageSquare className="w-6 h-6 fill-current" />
            </div>

            <h3 className="text-lg font-black text-white">
              Mais Informações: {activeModalService}
            </h3>

            <p className="text-xs text-slate-300 mt-2 mb-5 leading-relaxed">
              Para orientações de documentos, certidões, taxas estaduais ou agendamento de{' '}
              <strong className="text-cyan-300">{activeModalService}</strong>, selecione em qual
              WhatsApp deseja ser atendido:
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => handleOpenWhatsAppForService('1', activeModalService)}
                className="w-full p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-between shadow transition-colors"
              >
                <div className="flex items-center gap-2 text-left">
                  <Phone className="w-4 h-4" />
                  <div>
                    <div className="text-[10px] text-emerald-200 uppercase">
                      {settings.rotuloNumero1}
                    </div>
                    <div className="text-sm font-extrabold">{settings.telefone1}</div>
                  </div>
                </div>
                <span className="text-[10px] bg-white text-emerald-800 px-2 py-0.5 rounded font-bold">
                  Chamar ➔
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenWhatsAppForService('2', activeModalService)}
                className="w-full p-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-between shadow transition-colors"
              >
                <div className="flex items-center gap-2 text-left">
                  <Phone className="w-4 h-4" />
                  <div>
                    <div className="text-[10px] text-cyan-200 uppercase">
                      {settings.rotuloNumero2}
                    </div>
                    <div className="text-sm font-extrabold">{settings.telefone2}</div>
                  </div>
                </div>
                <span className="text-[10px] bg-white text-cyan-900 px-2 py-0.5 rounded font-bold">
                  Chamar ➔
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trust Pillars from Bottom of Poster */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80">
          <div className="w-9 h-9 rounded-lg bg-cyan-950 flex items-center justify-center text-cyan-400 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Atendimento Rápido
            </div>
            <div className="text-[11px] text-slate-400">
              Resposta ágil direto no WhatsApp
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80">
          <div className="w-9 h-9 rounded-lg bg-sky-950 flex items-center justify-center text-sky-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Compromisso com Você
            </div>
            <div className="text-[11px] text-slate-400">
              Transparência em cada etapa
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80">
          <div className="w-9 h-9 rounded-lg bg-indigo-950 flex items-center justify-center text-indigo-400 shrink-0">
            <ThumbsUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Experiência & Confiança
            </div>
            <div className="text-[11px] text-slate-400">
              Tradição em São Bernardo do Campo
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
