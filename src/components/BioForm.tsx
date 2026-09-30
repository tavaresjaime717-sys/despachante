import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Send,
  MessageSquare,
  CheckCircle,
  Copy,
  Info,
  Car,
  FileText,
  User,
  Phone,
  HelpCircle,
  Sparkles,
  ExternalLink,
  Shield,
  CreditCard,
} from 'lucide-react';
import { CompanySettings, Atendimento } from '../types';
import { formatPlaca, formatPhone, saveNovoAtendimento, SERVICOS_LIST } from '../utils/storage';
import { buildClientWhatsAppMessage, openWhatsAppChat } from '../utils/whatsapp';
import { MercosulPlatePreview } from './MercosulPlatePreview';

interface BioFormProps {
  settings: CompanySettings;
  selectedService: string;
  onServiceChange: (service: string) => void;
  onSuccessSubmit?: (atendimento: Atendimento) => void;
}

export const BioForm: React.FC<BioFormProps> = ({
  settings,
  selectedService,
  onServiceChange,
  onSuccessSubmit,
}) => {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [placa, setPlaca] = useState('');
  const [crlv, setCrlv] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [showCrlvHelp, setShowCrlvHelp] = useState(false);
  const [copied, setCopied] = useState(false);
  const [submittedAtendimento, setSubmittedAtendimento] = useState<Atendimento | null>(null);
  const [lastTargetNumber, setLastTargetNumber] = useState<'1' | '2'>('1');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePlacaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlaca(formatPlaca(e.target.value));
    if (errorMessage) setErrorMessage('');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTelefone(formatPhone(e.target.value));
    if (errorMessage) setErrorMessage('');
  };

  const validate = (): boolean => {
    if (!nome.trim()) {
      setErrorMessage('Por favor, informe seu nome completo.');
      return false;
    }
    const cleanPhone = telefone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Por favor, informe um telefone/WhatsApp válido com DDD.');
      return false;
    }
    const cleanPlaca = placa.replace(/[^A-Za-z0-9]/g, '');
    if (cleanPlaca.length < 7) {
      setErrorMessage('Por favor, informe uma placa válida (7 caracteres).');
      return false;
    }
    if (!crlv.trim()) {
      setErrorMessage('Por favor, informe o número do CRLV ou Renavam do veículo.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleSendWhatsApp = (target: '1' | '2') => {
    if (!validate()) return;

    setLastTargetNumber(target);

    // Save in storage / admin panel
    const novo = saveNovoAtendimento({
      nome: nome.trim(),
      telefone: telefone.trim(),
      placa: placa.trim().toUpperCase(),
      crlv: crlv.trim(),
      servico: selectedService || 'Serviço Geral de Despachante',
      observacoes: observacoes.trim(),
      status: 'pendente',
      whatsappDestino: target === '1' ? 'numero1' : 'numero2',
    });

    // Prepare message
    const message = buildClientWhatsAppMessage(
      {
        nome,
        telefone,
        placa,
        crlv,
        servico: selectedService || 'Serviço Geral',
        observacoes,
        protocolo: novo.protocolo,
      },
      settings
    );

    const targetPhone = target === '1' ? settings.whatsapp1 : settings.whatsapp2;

    // Launch confetti celebration
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#00b4d8', '#10b981', '#ffffff'],
      });
    } catch {
      // ignore if fails
    }

    // Open WhatsApp
    openWhatsAppChat(targetPhone, message);

    setSubmittedAtendimento(novo);
    if (onSuccessSubmit) {
      onSuccessSubmit(novo);
    }
  };

  const handleCopyMessage = () => {
    const message = buildClientWhatsAppMessage(
      {
        nome: nome || 'Cliente',
        telefone: telefone || '(11) 99999-9999',
        placa: placa || 'ABC-1234',
        crlv: crlv || '1234567890',
        servico: selectedService || 'Serviços de Despachante',
        observacoes,
        protocolo: submittedAtendimento ? submittedAtendimento.protocolo : '#SM-ORCAMENTO',
      },
      settings
    );

    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const resetForm = () => {
    setNome('');
    setTelefone('');
    setPlaca('');
    setCrlv('');
    setObservacoes('');
    setSubmittedAtendimento(null);
    setErrorMessage('');
  };

  return (
    <div className="w-full relative" id="formulario-atendimento">
      {/* Container with glowing border */}
      <div className="relative rounded-2xl bg-gradient-to-b from-[#0c1830] via-[#091325] to-[#060c18] border border-cyan-500/40 p-4 sm:p-7 shadow-2xl shadow-cyan-950/60 overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-cyan-500/10 blur-3xl pointer-events-none rounded-full"></div>

        {/* Form Title & Badge */}
        <div className="relative z-10 mb-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-cyan-900/40 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Solicitação Rápida e Segura
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Preencha os dados do veículo
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Enviaremos a resposta com valores e prazos diretamente no seu WhatsApp oficial.
            </p>
          </div>

          {/* Mercosul Plate Preview Box */}
          <div className="shrink-0 flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400/80 mb-1">
              Visualização da Placa
            </span>
            <MercosulPlatePreview placa={placa} />
          </div>
        </div>

        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-rose-950/70 border border-rose-500/60 text-rose-200 text-xs sm:text-sm flex items-center gap-2">
            <Info className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
          {/* Nome */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              Nome Completo <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => {
                setNome(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="Ex: João da Silva Santos"
              className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-white placeholder-slate-500 text-sm rounded-xl px-3.5 py-3 transition-all outline-none"
            />
          </div>

          {/* Telefone / WhatsApp */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              Seu Telefone / WhatsApp <span className="text-cyan-400">*</span>
            </label>
            <input
              type="tel"
              required
              value={telefone}
              onChange={handlePhoneChange}
              placeholder="(11) 98765-4321"
              maxLength={15}
              className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-white placeholder-slate-500 text-sm rounded-xl px-3.5 py-3 transition-all outline-none font-mono"
            />
          </div>

          {/* Placa do Carro */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-cyan-400" />
              Placa do Veículo <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              required
              value={placa}
              onChange={handlePlacaChange}
              placeholder="Ex: BRA2E19 ou ABC-1234"
              maxLength={8}
              className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-white placeholder-slate-500 text-sm rounded-xl px-3.5 py-3 transition-all outline-none uppercase font-mono tracking-wider font-bold"
            />
            <span className="text-[11px] text-slate-400 block">
              Padrão Mercosul ou placa cinza antiga
            </span>
          </div>

          {/* CRLV */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                CRLV / Renavam <span className="text-cyan-400">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowCrlvHelp(!showCrlvHelp)}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
              >
                <HelpCircle className="w-3 h-3" />
                Onde acho?
              </button>
            </div>
            <input
              type="text"
              required
              value={crlv}
              onChange={(e) => {
                setCrlv(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="Número do CRLV-e ou Renavam"
              className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-white placeholder-slate-500 text-sm rounded-xl px-3.5 py-3 transition-all outline-none font-mono"
            />

            {showCrlvHelp && (
              <div className="p-3 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-[11px] text-cyan-100 space-y-1 animate-fadeIn">
                <p className="font-semibold text-cyan-300">💡 Onde encontrar:</p>
                <p>
                  • No <strong>CRLV Digital (App Carteira Digital de Trânsito)</strong>: campo &quot;Número do CRLV&quot; ou &quot;Código de Segurança do CLA&quot;.
                </p>
                <p>
                  • No documento impresso em papel A4 ou verdinho: número no topo ou campo RENAVAM com 11 dígitos.
                </p>
              </div>
            )}
          </div>

          {/* Seleção do Serviço */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Serviço Desejado
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                (Selecione abaixo ou na lista)
              </span>
            </label>
            <select
              value={selectedService}
              onChange={(e) => onServiceChange(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-white text-sm rounded-xl px-3.5 py-3 transition-all outline-none cursor-pointer"
            >
              {SERVICOS_LIST.map((s) => (
                <option key={s.id} value={s.nome} className="bg-slate-900 text-white">
                  {s.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Observações / Detalhes */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              Observações ou Detalhes (Opcional)
            </label>
            <textarea
              rows={2}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: Ano e modelo do carro, se tem multas pendentes ou urgência..."
              className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-white placeholder-slate-500 text-sm rounded-xl px-3.5 py-2.5 transition-all outline-none resize-none"
            />
          </div>
        </div>

        {/* WhatsApp Dispatch Section with BOTH Numbers from Cartaz */}
        <div className="mt-6 pt-5 border-t border-cyan-900/40 relative z-10">
          <div className="text-center sm:text-left mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center justify-center sm:justify-start gap-1.5">
              <Send className="w-3.5 h-3.5" />
              Enviar para o WhatsApp do Despachante Santa Maria
            </span>
            <p className="text-xs text-slate-400 mt-0.5">
              Escolha para qual linha oficial do cartaz deseja disparar a mensagem pronta com todos os seus dados:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Botão Número 1 */}
            <button
              type="button"
              onClick={() => handleSendWhatsApp('1')}
              className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/40 active:scale-[0.99] transition-all group border border-emerald-400/30"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <div className="text-xs font-medium text-emerald-100 uppercase tracking-wider">
                    {settings.rotuloNumero1}
                  </div>
                  <div className="text-base font-extrabold text-white">
                    {settings.telefone1}
                  </div>
                </div>
              </div>
              <span className="text-xs bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-400/30 font-semibold group-hover:bg-white group-hover:text-emerald-800 transition-colors">
                Enviar Agora ➔
              </span>
            </button>

            {/* Botão Número 2 */}
            <button
              type="button"
              onClick={() => handleSendWhatsApp('2')}
              className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-950/40 active:scale-[0.99] transition-all group border border-cyan-400/30"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-medium text-sky-100 uppercase tracking-wider">
                    {settings.rotuloNumero2}
                  </div>
                  <div className="text-base font-extrabold text-white">
                    {settings.telefone2}
                  </div>
                </div>
              </div>
              <span className="text-xs bg-cyan-950/50 px-2.5 py-1 rounded-full border border-cyan-400/30 font-semibold group-hover:bg-white group-hover:text-sky-900 transition-colors">
                Enviar Linha 2 ➔
              </span>
            </button>
          </div>

          {/* Copy Message / Secondary tools */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-slate-400">
            <button
              type="button"
              onClick={handleCopyMessage}
              className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors py-1"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? 'Mensagem copiada para a área de transferência!' : 'Copiar texto da mensagem pronta'}
            </button>

            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400" />
              Dados protegidos com sigilo profissional
            </span>
          </div>
        </div>
      </div>

      {/* Confirmation Modal / Banner if just submitted */}
      {submittedAtendimento && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0b172d] border border-cyan-500/50 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl relative">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-400/40">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-white">
              Solicitação Enviada com Sucesso!
            </h3>

            <div className="my-3 px-3 py-2 bg-cyan-950/70 border border-cyan-500/30 rounded-lg inline-block">
              <span className="text-xs text-slate-400">Protocolo do Atendimento: </span>
              <span className="font-mono font-bold text-cyan-300 text-sm">
                {submittedAtendimento.protocolo}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Seu pedido já foi cadastrado em nosso sistema! Se o WhatsApp não abriu automaticamente no seu aparelho, clique no botão verde abaixo para continuar a conversa:
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  const targetPhone =
                    lastTargetNumber === '1' ? settings.whatsapp1 : settings.whatsapp2;
                  const message = buildClientWhatsAppMessage(
                    {
                      nome: submittedAtendimento.nome,
                      telefone: submittedAtendimento.telefone,
                      placa: submittedAtendimento.placa,
                      crlv: submittedAtendimento.crlv,
                      servico: submittedAtendimento.servico,
                      observacoes: submittedAtendimento.observacoes,
                      protocolo: submittedAtendimento.protocolo,
                    },
                    settings
                  );
                  openWhatsAppChat(targetPhone, message);
                }}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                Abrir WhatsApp Agora
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Fazer Outra Solicitação / Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
