import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MessageSquare,
  Phone,
  Car,
  FileText,
  User,
  Copy,
  Printer,
  Calendar,
  Settings,
  ShieldCheck,
  ChevronRight,
  Send,
  Trash2,
  Check,
  Building,
  RefreshCw,
  FileDown,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Atendimento, AtendimentoStatus, CompanySettings } from '../types';
import {
  exportAtendimentosToCsv,
  formatPhone,
  formatPlaca,
  saveNovoAtendimento,
  updateAtendimento,
  addNotaInterna,
  deleteAtendimento,
  SERVICOS_LIST,
} from '../utils/storage';
import { buildDespachanteReplyMessage, openWhatsAppChat } from '../utils/whatsapp';
import { MercosulPlatePreview } from './MercosulPlatePreview';
import { CrlvDocumentViewer } from './CrlvDocumentViewer';

interface AdminPanelProps {
  settings: CompanySettings;
  onUpdateSettings: (newSettings: CompanySettings) => void;
  atendimentos: Atendimento[];
  onRefreshAtendimentos: () => void;
  onLogout: () => void;
}

const STATUS_CONFIG: Record<
  AtendimentoStatus,
  { label: string; color: string; bg: string; border: string; icon: React.ReactNode }
> = {
  pendente: {
    label: 'Pendente',
    color: 'text-amber-300',
    bg: 'bg-amber-950/60',
    border: 'border-amber-500/40',
    icon: <AlertCircle className="w-3.5 h-3.5 text-amber-400" />,
  },
  em_andamento: {
    label: 'Em Andamento',
    color: 'text-sky-300',
    bg: 'bg-sky-950/60',
    border: 'border-sky-500/40',
    icon: <Clock className="w-3.5 h-3.5 text-sky-400" />,
  },
  concluido: {
    label: 'Concluído',
    color: 'text-emerald-300',
    bg: 'bg-emerald-950/60',
    border: 'border-emerald-500/40',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
  },
  cancelado: {
    label: 'Cancelado',
    color: 'text-rose-300',
    bg: 'bg-rose-950/60',
    border: 'border-rose-500/40',
    icon: <XCircle className="w-3.5 h-3.5 text-rose-400" />,
  },
};

export const AdminPanel: React.FC<AdminPanelProps> = ({
  settings,
  onUpdateSettings,
  atendimentos,
  onRefreshAtendimentos,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'lista' | 'crlv' | 'novo' | 'config'>('lista');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAtendimento, setSelectedAtendimento] = useState<Atendimento | null>(null);
  const [crlvViewerAtendimento, setCrlvViewerAtendimento] = useState<Atendimento | null>(null);

  // CRLV Sub-filter
  const [crlvFilter, setCrlvFilter] = useState<'todos' | 'pendente_impressao' | 'impressos'>('todos');

  // Quick Express CRLV Generator state
  const [expressPlaca, setExpressPlaca] = useState('');
  const [expressCrlv, setExpressCrlv] = useState('');
  const [expressNome, setExpressNome] = useState('');
  const [expressTelefone, setExpressTelefone] = useState('');

  // New Note state
  const [newNoteText, setNewNoteText] = useState('');
  const [noteAuthor, setNoteAuthor] = useState('Despachante');

  // Value edit state
  const [editingValor, setEditingValor] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Manual Creation state
  const [manualNome, setManualNome] = useState('');
  const [manualTelefone, setManualTelefone] = useState('');
  const [manualPlaca, setManualPlaca] = useState('');
  const [manualCrlv, setManualCrlv] = useState('');
  const [manualServico, setManualServico] = useState(SERVICOS_LIST[1].nome); // Default to Licenciamento
  const [manualObs, setManualObs] = useState('');
  const [manualValor, setManualValor] = useState('');

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<CompanySettings>(settings);
  const [savedSettingsMsg, setSavedSettingsMsg] = useState(false);

  // Filtered Atendimentos for Main List
  const filteredAtendimentos = atendimentos.filter((item) => {
    if (statusFilter !== 'todos' && item.status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNome = item.nome.toLowerCase().includes(q);
      const matchPlaca = item.placa.toLowerCase().includes(q);
      const matchTelefone = item.telefone.includes(q);
      const matchCrlv = item.crlv.toLowerCase().includes(q);
      const matchProto = item.protocolo.toLowerCase().includes(q);
      const matchServico = item.servico.toLowerCase().includes(q);
      return matchNome || matchPlaca || matchTelefone || matchCrlv || matchProto || matchServico;
    }
    return true;
  });

  // Filtered CRLV list specifically for printing/licensing
  const crlvList = atendimentos.filter((item) => {
    const isLicenciamento =
      item.servico.toLowerCase().includes('licenciamento') ||
      item.servico.toLowerCase().includes('crlv') ||
      item.crlv.trim().length > 0;

    if (!isLicenciamento) return false;

    if (crlvFilter === 'pendente_impressao') {
      return !item.impresso;
    }
    if (crlvFilter === 'impressos') {
      return !!item.impresso;
    }
    return true;
  });

  // Counters
  const totalCount = atendimentos.length;
  const pendentesCount = atendimentos.filter((a) => a.status === 'pendente').length;
  const andamentoCount = atendimentos.filter((a) => a.status === 'em_andamento').length;
  const concluidosCount = atendimentos.filter((a) => a.status === 'concluido').length;
  const crlvTotalCount = atendimentos.filter(
    (a) =>
      a.servico.toLowerCase().includes('licenciamento') ||
      a.servico.toLowerCase().includes('crlv')
  ).length;

  const handleSelectAtendimento = (item: Atendimento) => {
    setSelectedAtendimento(item);
    setEditingValor(item.valorEstimado ? item.valorEstimado.toString() : '');
  };

  const handleUpdateStatus = (id: string, newStatus: AtendimentoStatus) => {
    const updated = updateAtendimento(id, { status: newStatus });
    if (updated) {
      onRefreshAtendimentos();
      if (selectedAtendimento && selectedAtendimento.id === id) {
        setSelectedAtendimento(updated);
      }
    }
  };

  const handleMarkCrlvPrinted = (id: string) => {
    const updated = updateAtendimento(id, {
      impresso: true,
      dataImpressao: new Date().toISOString(),
      status: 'concluido',
    });
    if (updated) {
      onRefreshAtendimentos();
      if (selectedAtendimento && selectedAtendimento.id === id) {
        setSelectedAtendimento(updated);
      }
    }
  };

  const handleSaveValor = (id: string) => {
    const num = parseFloat(editingValor.replace(',', '.'));
    const updated = updateAtendimento(id, { valorEstimado: isNaN(num) ? null : num });
    if (updated) {
      onRefreshAtendimentos();
      setSelectedAtendimento(updated);
    }
  };

  const handleAddNota = (id: string) => {
    if (!newNoteText.trim()) return;
    const updated = addNotaInterna(id, newNoteText.trim(), noteAuthor || 'Equipe');
    if (updated) {
      setNewNoteText('');
      onRefreshAtendimentos();
      setSelectedAtendimento(updated);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este atendimento permanentemente?')) {
      deleteAtendimento(id);
      setSelectedAtendimento(null);
      onRefreshAtendimentos();
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleCreateManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualNome || !manualTelefone || !manualPlaca) {
      alert('Preencha os campos obrigatórios: Nome, Telefone e Placa.');
      return;
    }

    const val = parseFloat(manualValor.replace(',', '.'));
    const novo = saveNovoAtendimento({
      nome: manualNome.trim(),
      telefone: manualTelefone.trim(),
      placa: manualPlaca.trim().toUpperCase(),
      crlv: manualCrlv.trim(),
      servico: manualServico,
      observacoes: manualObs.trim(),
      status: 'em_andamento',
      valorEstimado: isNaN(val) ? undefined : val,
    });

    onRefreshAtendimentos();
    // Reset form
    setManualNome('');
    setManualTelefone('');
    setManualPlaca('');
    setManualCrlv('');
    setManualObs('');
    setManualValor('');
    setActiveTab('lista');
    handleSelectAtendimento(novo);
  };

  const handleGenerateExpressCrlv = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expressPlaca || !expressCrlv) {
      alert('Informe a placa e o número do CRLV para gerar o documento.');
      return;
    }

    const novo = saveNovoAtendimento({
      nome: expressNome.trim() || 'Cliente Balcão',
      telefone: expressTelefone.trim() || settings.telefone1,
      placa: expressPlaca.trim().toUpperCase(),
      crlv: expressCrlv.trim(),
      servico: 'Licenciamento Anual (CRLV-e)',
      observacoes: 'Gerado expresso via Central de Impressão.',
      status: 'em_andamento',
    });

    onRefreshAtendimentos();
    setExpressPlaca('');
    setExpressCrlv('');
    setExpressNome('');
    setExpressTelefone('');
    setCrlvViewerAtendimento(novo);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(settingsForm);
    setSavedSettingsMsg(true);
    setTimeout(() => setSavedSettingsMsg(false), 3000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Top Banner and Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0c1a35] via-[#09152b] to-[#071021] border border-cyan-500/30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-black text-xl shadow-lg">
            ✝
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase">
              Painel de Gestão dos Donos & Atendimento
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Despachante Santa Maria
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 mt-0.5">
              <span>{settings.endereco} - SBC</span>
              <span>•</span>
              <span className="font-mono text-cyan-300 font-bold">{settings.telefone1}</span>
              <span>•</span>
              <span className="font-mono text-emerald-300 font-bold">{settings.telefone2}</span>
            </div>
          </div>
        </div>

        {/* Action Tabs & Logout */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Main List Tab */}
          <button
            onClick={() => setActiveTab('lista')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'lista'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Todos Atendimentos ({atendimentos.length})</span>
          </button>

          {/* DEDICATED CRLV PRINTING TAB (User Requested) */}
          <button
            onClick={() => setActiveTab('crlv')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 relative ${
              activeTab === 'crlv'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/30 font-black'
                : 'bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900 border border-emerald-500/40'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir CRLV-e / Licenciar</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-950 text-emerald-300">
              {crlvTotalCount}
            </span>
          </button>

          {/* Manual New Intake */}
          <button
            onClick={() => setActiveTab('novo')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'novo'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Novo Manual</span>
          </button>

          {/* Settings */}
          <button
            onClick={() => setActiveTab('config')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'config'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Configurações</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-700/50 text-xs font-semibold transition-colors"
          >
            Sair
          </button>
        </div>
      </div>

      {/* TAB: FILA ESPECÍFICA DE IMPRESSÃO & LICENCIAMENTO CRLV-E (USER REQUEST) */}
      {activeTab === 'crlv' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Header Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-[#0a202a] to-[#071520] border-2 border-emerald-500/40 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow-lg shrink-0">
                  <Printer className="w-6 h-6" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-900/80 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Central dos Donos do Despachante
                  </div>
                  <h3 className="text-xl font-black text-white">
                    Documentos Pedidos para Impressão de CRLV-e / Licenciar
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                    Aqui você visualiza todos os veículos cujos proprietários solicitaram
                    licenciamento ou impressão do CRLV digital. Você pode visualizar o documento
                    oficial padrão SENATRAN/DETRAN-SP, gerar PDF e imprimir em folha A4 com 1 clique.
                  </p>
                </div>
              </div>

              {/* Quick Sub-filters */}
              <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 shrink-0">
                <button
                  onClick={() => setCrlvFilter('todos')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    crlvFilter === 'todos'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Todos ({crlvList.length})
                </button>
                <button
                  onClick={() => setCrlvFilter('pendente_impressao')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    crlvFilter === 'pendente_impressao'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Aguardando Impressão
                </button>
                <button
                  onClick={() => setCrlvFilter('impressos')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    crlvFilter === 'impressos'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Já Impressos
                </button>
              </div>
            </div>
          </div>

          {/* Quick Express CRLV Generator Form */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-800/40">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 mb-2.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Gerador Expresso de CRLV-e para Impressão Rápida / Balcão:</span>
            </div>
            <form
              onSubmit={handleGenerateExpressCrlv}
              className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-end"
            >
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Placa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: ABC1D23"
                  value={expressPlaca}
                  onChange={(e) => setExpressPlaca(formatPlaca(e.target.value))}
                  maxLength={8}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white uppercase font-mono font-bold outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  CRLV / Renavam *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 01294857201"
                  value={expressCrlv}
                  onChange={(e) => setExpressCrlv(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Nome do Proprietário
                </label>
                <input
                  type="text"
                  placeholder="Nome do cliente"
                  value={expressNome}
                  onChange={(e) => setExpressNome(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Telefone WhatsApp
                </label>
                <input
                  type="text"
                  placeholder="(11) 9..."
                  value={expressTelefone}
                  onChange={(e) => setExpressTelefone(formatPhone(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-colors active:scale-95"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Gerar e Imprimir</span>
                </button>
              </div>
            </form>
          </div>

          {/* List of Vehicles Requesting CRLV */}
          {crlvList.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400">
              <Printer className="w-12 h-12 mx-auto text-slate-600 mb-3" />
              <h4 className="text-base font-bold text-white">Nenhum documento na fila de CRLV</h4>
              <p className="text-xs text-slate-500 mt-1">
                Novas solicitações de licenciamento aparecerão aqui automaticamente.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {crlvList.map((item) => {
                const isImpresso = !!item.impresso;

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    {/* Left: Plate and Vehicle Identifiers */}
                    <div className="flex items-center gap-3.5">
                      <div className="w-24 bg-white border border-slate-900 rounded px-1.5 py-0.5 text-center shadow shrink-0">
                        <div className="bg-[#003399] text-[7px] text-white font-bold px-1 rounded-t flex justify-between">
                          <span>BR</span>
                          <span>BRASIL</span>
                        </div>
                        <div className="font-mono font-black text-slate-900 text-sm tracking-wider">
                          {item.placa}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-emerald-400">
                            {item.protocolo}
                          </span>
                          {isImpresso ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              Documento Impresso
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40 animate-pulse">
                              <Clock className="w-3 h-3 text-amber-400" />
                              Aguardando Impressão
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-sm text-white mt-0.5">{item.nome}</h4>
                        <div className="text-xs text-slate-400 flex items-center gap-2 font-mono">
                          <span>CRLV/Renavam: {item.crlv || '---'}</span>
                          <span>•</span>
                          <span>{item.telefone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Fast Copy for Detran */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleCopy(`Placa: ${item.placa} | CRLV: ${item.crlv}`, item.id)
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 text-xs font-mono border border-slate-800 flex items-center gap-1 transition-colors"
                        title="Copiar dados para colar no e-CRVsp / Detran"
                      >
                        <Copy className="w-3 h-3 text-cyan-400" />
                        <span>{copiedKey === item.id ? 'Copiado!' : 'Copiar p/ Detran'}</span>
                      </button>
                    </div>

                    {/* Right: Print / PDF / WhatsApp Actions */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {/* View & Print Document */}
                      <button
                        type="button"
                        onClick={() => setCrlvViewerAtendimento(item)}
                        className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all active:scale-95"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Visualizar / Salvar PDF</span>
                      </button>

                      {/* Mark as Printed */}
                      {!isImpresso ? (
                        <button
                          type="button"
                          onClick={() => handleMarkCrlvPrinted(item.id)}
                          className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                          title="Marcar que o documento já foi impresso"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Marcar Impresso</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 px-2">
                          Impresso em{' '}
                          {item.dataImpressao
                            ? new Date(item.dataImpressao).toLocaleDateString('pt-BR')
                            : 'Hoje'}
                        </span>
                      )}

                      {/* WhatsApp Notify */}
                      <button
                        type="button"
                        onClick={() => {
                          const message = [
                            `Olá, *${item.nome}*! 👋`,
                            `Aqui é da equipe do *${settings.nomeEmpresa}* (SBC - SP).`,
                            '',
                            `Informamos que o seu documento *CRLV-e 2026* do veículo placa *${item.placa}* já está licenciado e impresso!`,
                            '',
                            `Você pode retirar em nossa loja (${settings.endereco} - SBC) ou solicitar envio do arquivo em PDF.`,
                          ].join('\n');
                          openWhatsAppChat(item.telefone, message);
                        }}
                        className="px-3 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1 transition-colors"
                        title="Avisar cliente pelo WhatsApp que o documento está pronto"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-current" />
                        <span className="hidden sm:inline">Avisar Pronto</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* METRICS ROW (visible on list tab) */}
      {activeTab === 'lista' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total de Atendimentos
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">
              {totalCount}
            </div>
            <span className="text-[11px] text-cyan-400 font-medium">Cadastrados no sistema</span>
          </div>

          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Pendentes / Novos
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-1">
              {pendentesCount}
            </div>
            <span className="text-[11px] text-amber-300/80 font-medium">Aguardando análise</span>
          </div>

          <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-500/30">
            <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Em Andamento
            </span>
            <div className="text-2xl sm:text-3xl font-black text-sky-300 mt-1">
              {andamentoCount}
            </div>
            <span className="text-[11px] text-sky-300/80 font-medium">No Detran / Vistoria</span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Concluídos
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-300 mt-1">
              {concluidosCount}
            </div>
            <span className="text-[11px] text-emerald-300/80 font-medium">Documentos entregues</span>
          </div>
        </div>
      )}

      {/* TAB 1: LISTA GERAL DE ATENDIMENTOS */}
      {activeTab === 'lista' && (
        <div className="space-y-4">
          {/* Search, Filter Tabs and Export */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por placa, cliente, telefone, CRLV ou protocolo..."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-cyan-400 outline-none"
              />
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs">
              {(['todos', 'pendente', 'em_andamento', 'concluido', 'cancelado'] as const).map(
                (st) => {
                  const isActive = statusFilter === st;
                  const label =
                    st === 'todos'
                      ? 'Todos'
                      : st === 'pendente'
                      ? 'Pendentes'
                      : st === 'em_andamento'
                      ? 'Em Andamento'
                      : st === 'concluido'
                      ? 'Concluídos'
                      : 'Cancelados';

                  return (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-colors ${
                        isActive
                          ? 'bg-cyan-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  );
                }
              )}

              {/* Export to CSV button */}
              <button
                onClick={() => exportAtendimentosToCsv(atendimentos)}
                className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 font-semibold shrink-0 flex items-center gap-1 transition-colors"
                title="Exportar para planilha Excel / CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Exportar CSV</span>
              </button>
            </div>
          </div>

          {/* Table or Cards List */}
          {filteredAtendimentos.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400">
              <Car className="w-12 h-12 mx-auto text-slate-600 mb-3" />
              <h4 className="text-base font-bold text-white">Nenhum atendimento encontrado</h4>
              <p className="text-xs text-slate-500 mt-1">
                Tente ajustar sua busca ou filtro de status.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2.5">
              {filteredAtendimentos.map((item) => {
                const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.pendente;
                const isSelected = selectedAtendimento?.id === item.id;
                const isCrlvService =
                  item.servico.toLowerCase().includes('licenciamento') ||
                  item.servico.toLowerCase().includes('crlv');

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectAtendimento(item)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-400 shadow-md ring-1 ring-cyan-400/40'
                        : 'bg-slate-900/70 hover:bg-slate-850 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Left: Plate and Protocol */}
                    <div className="flex items-center gap-3">
                      {/* Mini Plate Graphic */}
                      <div className="w-24 bg-white border border-slate-900 rounded px-1.5 py-0.5 text-center shadow shrink-0">
                        <div className="bg-[#003399] text-[7px] text-white font-bold px-1 rounded-t flex justify-between">
                          <span>BR</span>
                          <span>BRASIL</span>
                        </div>
                        <div className="font-mono font-black text-slate-900 text-sm tracking-wider">
                          {item.placa}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-cyan-400">
                            {item.protocolo}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}
                          >
                            {cfg.icon}
                            {cfg.label}
                          </span>
                          {item.impresso && (
                            <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/40 font-bold">
                              CRLV Impresso
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm text-white mt-0.5">{item.nome}</h4>
                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="text-cyan-300 font-semibold">{item.servico}</span>
                          <span>•</span>
                          <span className="font-mono">{item.telefone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Middle: CRLV & Notes Count */}
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">
                          CRLV / Renavam
                        </span>
                        <span className="font-mono text-slate-200 font-bold">
                          {item.crlv || '---'}
                        </span>
                      </div>

                      {item.valorEstimado && (
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">
                            Valor
                          </span>
                          <span className="font-bold text-emerald-400">
                            R$ {item.valorEstimado.toFixed(2)}
                          </span>
                        </div>
                      )}

                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">
                          Recebido em
                        </span>
                        <span className="text-[11px] text-slate-300">
                          {new Date(item.criadoEm).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Right: Quick Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                      {/* One Click Print CRLV if available */}
                      {isCrlvService && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCrlvViewerAtendimento(item);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow"
                          title="Visualizar CRLV-e / Salvar em PDF"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">CRLV PDF</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const message = buildDespachanteReplyMessage(item, settings);
                          openWhatsAppChat(item.telefone, message);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                        title="Responder cliente no WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-current" />
                        <span>WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectAtendimento(item);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <span>Ficha</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CADASTRAR ATENDIMENTO MANUAL */}
      {activeTab === 'novo' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 max-w-2xl mx-auto">
          <div className="mb-5 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-cyan-400" />
              Cadastrar Novo Atendimento Manual
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Use este formulário para clientes que comparecerem no balcão da Rua Maria Cardoso da Costa, 70 ou fizerem contato telefônico.
            </p>
          </div>

          <form onSubmit={handleCreateManual} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase">
                  Nome do Cliente *
                </label>
                <input
                  type="text"
                  required
                  value={manualNome}
                  onChange={(e) => setManualNome(e.target.value)}
                  placeholder="Nome completo"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase">
                  Telefone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={manualTelefone}
                  onChange={(e) => setManualTelefone(formatPhone(e.target.value))}
                  placeholder="(11) 98765-4321"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white font-mono outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase">
                  Placa do Veículo *
                </label>
                <input
                  type="text"
                  required
                  value={manualPlaca}
                  onChange={(e) => setManualPlaca(formatPlaca(e.target.value))}
                  placeholder="Ex: ABC1D23"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white font-mono uppercase font-bold outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase">
                  CRLV / Renavam
                </label>
                <input
                  type="text"
                  value={manualCrlv}
                  onChange={(e) => setManualCrlv(e.target.value)}
                  placeholder="Número do documento"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white font-mono outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-slate-300 uppercase">
                  Serviço Solicitado
                </label>
                <select
                  value={manualServico}
                  onChange={(e) => setManualServico(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white outline-none focus:border-cyan-400"
                >
                  {SERVICOS_LIST.map((s) => (
                    <option key={s.id} value={s.nome}>
                      {s.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase">
                  Valor Orçado / Taxas (R$)
                </label>
                <input
                  type="text"
                  value={manualValor}
                  onChange={(e) => setManualValor(e.target.value)}
                  placeholder="Ex: 450,00"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white font-mono outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-slate-300 uppercase">
                  Observações / Débitos
                </label>
                <textarea
                  rows={3}
                  value={manualObs}
                  onChange={(e) => setManualObs(e.target.value)}
                  placeholder="Anotações sobre débitos, vistoria ou prazos acordados com o cliente..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white outline-none focus:border-cyan-400 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('lista')}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-950 transition-all active:scale-95"
              >
                Salvar Atendimento
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: CONFIGURAÇÕES DA EMPRESA (COM OS 2 WHATSAPPS) */}
      {activeTab === 'config' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 max-w-2xl mx-auto space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-cyan-400" />
              Configurações do Despachante Santa Maria
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Gerencie ambos os números de WhatsApp cadastrados no site, endereço e PIN.
            </p>
          </div>

          {savedSettingsMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Configurações salvas com sucesso!
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* WhatsApp 1 */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase">
                  WhatsApp 1 (Exibição)
                </label>
                <input
                  type="text"
                  value={settingsForm.telefone1}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, telefone1: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white font-mono outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase">
                  WhatsApp 1 (Link Oficial)
                </label>
                <input
                  type="text"
                  value={settingsForm.whatsapp1}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      whatsapp1: e.target.value.replace(/\D/g, ''),
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white font-mono outline-none focus:border-cyan-400"
                />
              </div>

              {/* WhatsApp 2 (Added number: 55 11 97077322) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase">
                  WhatsApp 2 (Exibição)
                </label>
                <input
                  type="text"
                  value={settingsForm.telefone2}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, telefone2: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white font-mono outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase">
                  WhatsApp 2 (Link Oficial)
                </label>
                <input
                  type="text"
                  value={settingsForm.whatsapp2}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      whatsapp2: e.target.value.replace(/\D/g, ''),
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white font-mono outline-none focus:border-cyan-400"
                />
              </div>

              {/* Endereço */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-slate-300 uppercase">
                  Endereço Oficial (Cartaz)
                </label>
                <input
                  type="text"
                  value={settingsForm.endereco}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, endereco: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white outline-none focus:border-cyan-400"
                />
              </div>

              {/* Bairro & Cidade */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase">Bairro</label>
                <input
                  type="text"
                  value={settingsForm.bairro}
                  onChange={(e) => setSettingsForm({ ...settingsForm, bairro: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase">Cidade / UF</label>
                <input
                  type="text"
                  value={settingsForm.cidadeUf}
                  onChange={(e) => setSettingsForm({ ...settingsForm, cidadeUf: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white outline-none focus:border-cyan-400"
                />
              </div>

              {/* PIN Admin */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase">
                  PIN de Acesso ao Painel
                </label>
                <input
                  type="text"
                  maxLength={8}
                  value={settingsForm.pinAdmin}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, pinAdmin: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white font-mono outline-none focus:border-cyan-400"
                />
              </div>

              {/* Parcelamento */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase">
                  Destaque de Pagamento
                </label>
                <input
                  type="text"
                  value={settingsForm.parcelamento}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, parcelamento: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-950 transition-all active:scale-95"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DETAIL MODAL / FICHA COMPLETA DO ATENDIMENTO */}
      {selectedAtendimento && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0a152a] border border-cyan-500/40 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-7 shadow-2xl relative space-y-5 text-slate-100">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-cyan-900/40 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold">
                  {selectedAtendimento.protocolo.slice(-3)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan-300 font-bold text-base">
                      {selectedAtendimento.protocolo}
                    </span>
                    <span className="text-xs text-slate-400">
                      • {new Date(selectedAtendimento.criadoEm).toLocaleDateString('pt-BR')} às{' '}
                      {new Date(selectedAtendimento.criadoEm).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {selectedAtendimento.nome}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedAtendimento(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Quick Status Buttons */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                Status do Atendimento (Clique para alterar)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['pendente', 'em_andamento', 'concluido', 'cancelado'] as const).map((st) => {
                  const cfg = STATUS_CONFIG[st];
                  const isCurrent = selectedAtendimento.status === st;

                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(selectedAtendimento.id, st)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        isCurrent
                          ? `${cfg.bg} ${cfg.color} ${cfg.border} ring-2 ring-cyan-400 shadow-md`
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {cfg.icon}
                      <span>{cfg.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Vehicle & Client Data Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Vehicle Card */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
                <span className="text-[11px] uppercase font-bold text-cyan-400 tracking-wider block flex items-center justify-between">
                  <span>Dados do Veículo</span>
                  <button
                    onClick={() =>
                      handleCopy(
                        `Placa: ${selectedAtendimento.placa} | CRLV: ${selectedAtendimento.crlv}`,
                        'veiculo'
                      )
                    }
                    className="text-[10px] text-cyan-300 hover:text-cyan-200 flex items-center gap-1 font-semibold"
                  >
                    <Copy className="w-3 h-3" />
                    {copiedKey === 'veiculo' ? 'Copiado!' : 'Copiar Dados'}
                  </button>
                </span>

                <div className="flex items-center gap-3">
                  <div className="w-28 bg-white border border-slate-900 rounded p-1 text-center shadow">
                    <div className="bg-[#003399] text-[8px] text-white font-bold px-1 rounded-t flex justify-between">
                      <span>BR</span>
                      <span>BRASIL</span>
                    </div>
                    <div className="font-mono font-black text-slate-900 text-lg tracking-wider">
                      {selectedAtendimento.placa}
                    </div>
                  </div>

                  <div className="text-xs space-y-1">
                    <div>
                      <span className="text-slate-500">CRLV / Renavam:</span>
                      <div className="font-mono font-bold text-white">
                        {selectedAtendimento.crlv || '---'}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">Serviço:</span>
                      <div className="font-semibold text-cyan-300">
                        {selectedAtendimento.servico}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct CRLV Print CTA inside details */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setCrlvViewerAtendimento(selectedAtendimento)}
                    className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Visualizar Documento CRLV-e / PDF</span>
                  </button>
                </div>
              </div>

              {/* Client & Finance Card */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] uppercase font-bold text-cyan-400 tracking-wider block mb-2">
                    Contato do Cliente
                  </span>
                  <div className="text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Telefone:</span>
                      <span className="font-mono font-bold text-white">
                        {selectedAtendimento.telefone}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => {
                          const message = buildDespachanteReplyMessage(
                            selectedAtendimento,
                            settings
                          );
                          openWhatsAppChat(selectedAtendimento.telefone, message);
                        }}
                        className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-current" />
                        <span>Chamar no WhatsApp</span>
                      </button>

                      <a
                        href={`tel:${selectedAtendimento.telefone.replace(/\D/g, '')}`}
                        className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors border border-slate-700"
                        title="Fazer ligação"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Ligar</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Valor Estimado / Honorários */}
                <div className="pt-3 border-t border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Valor Total dos Honorários & Taxas (R$)
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editingValor}
                      onChange={(e) => setEditingValor(e.target.value)}
                      placeholder="Ex: 350.00"
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono outline-none focus:border-cyan-400"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveValor(selectedAtendimento.id)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Internal Notes Timeline */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <span className="text-[11px] uppercase font-bold text-slate-300 tracking-wider block">
                Histórico & Anotações Internas da Equipe
              </span>

              {/* Add Note Form */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddNota(selectedAtendimento.id);
                  }}
                  placeholder="Ex: 'Taxa de vistoria paga, agendado para terça-feira às 10h'..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={() => handleAddNota(selectedAtendimento.id)}
                  className="px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors shrink-0"
                >
                  Adicionar Nota
                </button>
              </div>

              {/* Notes List */}
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {selectedAtendimento.notasInternas && selectedAtendimento.notasInternas.length > 0 ? (
                  selectedAtendimento.notasInternas.map((nota) => (
                    <div
                      key={nota.id}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span className="font-semibold text-cyan-400">{nota.autor}</span>
                        <span>
                          {new Date(nota.data).toLocaleDateString('pt-BR')} às{' '}
                          {new Date(nota.data).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-slate-300">{nota.texto}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-slate-500 italic">
                    Nenhuma anotação interna registrada ainda.
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Actions: Print OS & Delete */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => handleDelete(selectedAtendimento.id)}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors p-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Excluir Atendimento</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir Ordem de Serviço (OS)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedAtendimento(null)}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CRLV-e OFFICIAL DOCUMENT VIEWER & PDF MODAL */}
      {crlvViewerAtendimento && (
        <CrlvDocumentViewer
          atendimento={crlvViewerAtendimento}
          settings={settings}
          onClose={() => setCrlvViewerAtendimento(null)}
          onMarkPrinted={(id) => handleMarkCrlvPrinted(id)}
        />
      )}
    </div>
  );
};
