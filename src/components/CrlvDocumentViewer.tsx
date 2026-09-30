import React from 'react';
import { Printer, Download, X, CheckCircle, ShieldCheck, Share2, MessageSquare } from 'lucide-react';
import { Atendimento, CompanySettings } from '../types';
import { openWhatsAppChat } from '../utils/whatsapp';

interface CrlvDocumentViewerProps {
  atendimento: Atendimento;
  settings: CompanySettings;
  onClose: () => void;
  onMarkPrinted?: (id: string) => void;
}

export const CrlvDocumentViewer: React.FC<CrlvDocumentViewerProps> = ({
  atendimento,
  settings,
  onClose,
  onMarkPrinted,
}) => {
  const currentYear = '2026';
  const simulatedChassi =
    atendimento.chassi ||
    `9BWZZZ${atendimento.placa.replace(/[^A-Z0-9]/g, '')}ZFP${Math.floor(100000 + Math.random() * 900000)}`;
  const simulatedRenavam = atendimento.crlv || '01294857201';
  const simulatedCodSeguranca = '88492019482';
  const simulatedMarcaModelo =
    atendimento.marcaModelo || atendimento.anoModelo || 'AUTOMÓVEL / PAS';

  const handlePrint = () => {
    if (onMarkPrinted) {
      onMarkPrinted(atendimento.id);
    }
    window.print();
  };

  const handleSendReadyWhatsApp = () => {
    const text = [
      `Olá, *${atendimento.nome}*! 👋`,
      `Aqui é do *${settings.nomeEmpresa}* de São Bernardo do Campo.`,
      '',
      `🎉 Seu documento *CRLV-e ${currentYear}* do veículo placa *${atendimento.placa}* já foi emitido e licenciado com sucesso no DETRAN.SP!`,
      '',
      `📄 *Dados do Documento:*`,
      `• Placa: ${atendimento.placa}`,
      `• CRLV / Renavam: ${simulatedRenavam}`,
      `• Exercício: ${currentYear} (Quitado e Válido)`,
      '',
      `Você já pode retirar a via impressa no nosso escritório (${settings.endereco} - SBC) ou solicitar o arquivo PDF digital!`,
      '',
      `Obrigado pela confiança no Despachante Santa Maria!`,
    ].join('\n');

    openWhatsAppChat(atendimento.telefone, text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-4xl w-full max-h-[96vh] flex flex-col shadow-2xl overflow-hidden my-auto text-slate-100">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print p-4 bg-[#0a162c] border-b border-cyan-900/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                CRLV-e Digital • Documento Oficial de Licenciamento
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono">
                  Exercício {currentYear}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Placa: <strong className="text-cyan-300">{atendimento.placa}</strong> | Cliente:{' '}
                <strong className="text-white">{atendimento.nome}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSendReadyWhatsApp}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow"
              title="Avisar cliente pelo WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Avisar no WhatsApp</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Salvar PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950 flex justify-center">
          {/* Authentic Brazilian CRLV-e Sheet Styling */}
          <div
            id="crlv-printable-sheet"
            className="w-full max-w-[760px] bg-white text-slate-900 border-2 border-slate-900 shadow-2xl p-5 sm:p-7 text-xs font-sans select-text relative"
            style={{
              minHeight: '850px',
              fontFamily: 'Arial, Helvetica, sans-serif',
            }}
          >
            {/* National Header */}
            <div className="border-b-2 border-black pb-3 text-center flex flex-col items-center">
              {/* Brazilian Coat of Arms Miniature / National Seal */}
              <div className="flex items-center justify-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center font-bold text-xs bg-amber-50">
                  🇧🇷
                </div>
                <div>
                  <h1 className="text-xs sm:text-sm font-black uppercase tracking-wider text-black">
                    REPÚBLICA FEDERATIVA DO BRASIL
                  </h1>
                  <h2 className="text-[11px] font-bold text-slate-800 uppercase">
                    MINISTÉRIO DOS TRANSPORTES • SENATRAN
                  </h2>
                  <h3 className="text-[10px] font-bold text-slate-700 uppercase">
                    DEPARTAMENTO ESTADUAL DE TRÂNSITO DE SÃO PAULO - DETRAN-SP
                  </h3>
                </div>
              </div>

              <div className="mt-1 py-1 px-4 bg-slate-900 text-white font-black text-xs sm:text-sm tracking-wide uppercase rounded-sm inline-block">
                CERTIFICADO DE REGISTRO E LICENCIAMENTO DE VEÍCULO - DIGITAL (CRLV-e)
              </div>
            </div>

            {/* Document Barcode & Safety Strip */}
            <div className="flex items-center justify-between border-b border-black py-1.5 px-2 bg-slate-100 text-[10px] font-mono font-bold">
              <div>
                <span>CÓD. SEGURANÇA CLA: </span>
                <span className="text-black font-extrabold">{simulatedCodSeguranca}</span>
              </div>
              <div>
                <span>Nº DO DOCUMENTO: </span>
                <span className="text-black font-extrabold">{atendimento.protocolo}</span>
              </div>
              <div>
                <span>EXERCÍCIO: </span>
                <span className="text-base text-black font-black">{currentYear}</span>
              </div>
            </div>

            {/* Vehicle Main Grid */}
            <div className="border border-black mt-3">
              <div className="grid grid-cols-3 border-b border-black bg-slate-50 text-[10px] font-bold p-1">
                <div className="border-r border-black pr-2">
                  <span className="text-[8px] uppercase text-slate-500 block">CÓDIGO RENAVAM</span>
                  <span className="font-mono text-xs text-black font-bold">
                    {simulatedRenavam}
                  </span>
                </div>
                <div className="border-r border-black px-2">
                  <span className="text-[8px] uppercase text-slate-500 block">PLACA</span>
                  <span className="font-mono text-sm text-black font-black tracking-wider">
                    {atendimento.placa}
                  </span>
                </div>
                <div className="pl-2">
                  <span className="text-[8px] uppercase text-slate-500 block">ANO FAB/MOD</span>
                  <span className="font-mono text-xs text-black font-bold">2021 / 2021</span>
                </div>
              </div>

              <div className="grid grid-cols-2 border-b border-black text-[10px] font-bold p-1.5">
                <div className="border-r border-black pr-2">
                  <span className="text-[8px] uppercase text-slate-500 block">
                    NÚMERO DE IDENTIFICAÇÃO DO VEÍCULO (CHASSI)
                  </span>
                  <span className="font-mono text-xs text-black">{simulatedChassi}</span>
                </div>
                <div className="pl-2">
                  <span className="text-[8px] uppercase text-slate-500 block">
                    MARCA / MODELO / VERSÃO
                  </span>
                  <span className="font-bold text-xs text-black uppercase">
                    {simulatedMarcaModelo}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 border-b border-black text-[9px] p-1 bg-slate-50">
                <div className="border-r border-black pr-1">
                  <span className="text-[7px] uppercase text-slate-500 block">ESPÉCIE / TIPO</span>
                  <span className="font-bold text-black uppercase">PASSAGEIRO / AUTOMÓVEL</span>
                </div>
                <div className="border-r border-black px-1">
                  <span className="text-[7px] uppercase text-slate-500 block">COMBUSTÍVEL</span>
                  <span className="font-bold text-black uppercase">ÁLCOOL / GASOLINA</span>
                </div>
                <div className="border-r border-black px-1">
                  <span className="text-[7px] uppercase text-slate-500 block">COR PREDOMINANTE</span>
                  <span className="font-bold text-black uppercase">PRATA / CINZA</span>
                </div>
                <div className="pl-1">
                  <span className="text-[7px] uppercase text-slate-500 block">CATEGORIA</span>
                  <span className="font-bold text-black uppercase">PARTICULAR</span>
                </div>
              </div>

              {/* Owner Info */}
              <div className="p-2 border-b border-black bg-white">
                <span className="text-[8px] uppercase font-bold text-slate-500 block">
                  NOME DO PROPRIETÁRIO
                </span>
                <span className="font-black text-xs text-black uppercase">
                  {atendimento.nome}
                </span>

                <div className="grid grid-cols-2 mt-1 pt-1 border-t border-slate-200 text-[9px]">
                  <div>
                    <span className="text-slate-500">MUNICÍPIO / UF: </span>
                    <span className="font-bold text-black">
                      SÃO BERNARDO DO CAMPO - SP (SBC)
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">TELEFONE CONTATO: </span>
                    <span className="font-mono font-bold text-black">
                      {atendimento.telefone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tributos e Quitações */}
              <div className="p-2 bg-emerald-50/60 border-b border-black text-[9px]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-emerald-900 uppercase">
                    SITUAÇÃO DE QUITAÇÃO DE TRIBUTOS E SEGURO OBRIGATÓRIO (SPVAT)
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-600 text-white font-bold rounded text-[8px] uppercase">
                    Regularizado
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 font-mono text-[9px] text-slate-800">
                  <div>
                    <strong>IPVA:</strong> QUITADO
                  </div>
                  <div>
                    <strong>LICENCIAMENTO ANUAL:</strong> QUITADO
                  </div>
                  <div>
                    <strong>MULTAS RENAINF/SP:</strong> NADA CONSTA
                  </div>
                </div>
              </div>

              {/* Mensagens do DETRAN e QR Code Authenticator */}
              <div className="p-3 grid grid-cols-3 gap-3 items-center">
                <div className="col-span-2 text-[8px] text-slate-700 space-y-1">
                  <p className="font-bold text-slate-900 uppercase">
                    MENSAGENS DO ÓRGÃO DE TRÂNSITO (DETRAN-SP):
                  </p>
                  <p>
                    • VEÍCULO LICENCIADO ELETRONICAMENTE EM CONFORMIDADE COM A RESOLUÇÃO
                    CONTRAN Nº 809/2020.
                  </p>
                  <p>
                    • DOCUMENTO VÁLIDO EM TODO O TERRITÓRIO NACIONAL MEDIANTE APRESENTAÇÃO EM
                    FORMATO IMPRESSO OU DIGITAL NO APP CARTEIRA DIGITAL DE TRÂNSITO.
                  </p>
                  <p className="text-[7px] text-slate-500 mt-2">
                    Emitido por: {settings.nomeEmpresa} • {settings.endereco} - {settings.bairro} - SBC
                    • Tel: {settings.telefone1} / {settings.telefone2}
                  </p>
                </div>

                {/* Simulated Official SENATRAN / VIO QR Code */}
                <div className="flex flex-col items-center justify-center p-2 border border-slate-300 rounded bg-slate-50">
                  <div className="w-24 h-24 bg-white p-1 border border-black flex items-center justify-center relative">
                    {/* QR Code graphic mockup */}
                    <div className="grid grid-cols-6 gap-0.5 w-full h-full p-0.5">
                      {Array.from({ length: 36 }).map((_, i) => (
                        <div
                          key={i}
                          className={`${
                            (i % 2 === 0 && i % 3 !== 1) || i === 0 || i === 5 || i === 30
                              ? 'bg-black'
                              : 'bg-transparent'
                          } rounded-[0.5px]`}
                        />
                      ))}
                    </div>
                    {/* Small center logo */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[8px] font-black bg-white px-1 border border-black text-black">
                        VIO
                      </span>
                    </div>
                  </div>
                  <span className="text-[7px] font-mono mt-1 text-slate-600 font-bold uppercase">
                    Autenticidade SENATRAN
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Barcode Line */}
            <div className="mt-4 pt-2 border-t border-dashed border-slate-400 text-center">
              <div className="h-6 flex items-center justify-center gap-0.5 opacity-80 my-1">
                {Array.from({ length: 55 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-black h-5"
                    style={{
                      width: idx % 3 === 0 ? '3px' : idx % 5 === 0 ? '1px' : '2px',
                    }}
                  />
                ))}
              </div>
              <p className="text-[7px] font-mono text-slate-600">
                BR.SP.SBC.{simulatedRenavam}.{atendimento.placa}.{currentYear}.DESPACHANTE-SANTA-MARIA
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="no-print p-3 sm:p-4 bg-[#0a162c] border-t border-cyan-900/40 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Dica: Para salvar em PDF, clique em &quot;Imprimir&quot; e selecione o destino &quot;Salvar como PDF&quot;.
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Gerar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
