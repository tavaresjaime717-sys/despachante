import { Atendimento, CompanySettings } from '../types';

export const DEFAULT_SETTINGS: CompanySettings = {
  nomeEmpresa: 'Despachante Santa Maria',
  slogan: 'Agilidade • Confiança • Segurança',
  telefone1: '(11) 94886-4848',
  whatsapp1: '5511948864848',
  rotuloNumero1: 'WhatsApp 1 - Atendimento Principal',
  telefone2: '(11) 9707-7322',
  whatsapp2: '551197077322',
  rotuloNumero2: 'WhatsApp 2 - Licenciamento & Plantão',
  endereco: 'Rua Maria Cardoso da Costa, 70',
  bairro: 'Jardim Nazaré',
  cidadeUf: 'São Bernardo do Campo - SP',
  horarioFuncionamento: 'Segunda a Sexta: 08:30 às 18:00 | Sábado: 08:30 às 12:30',
  parcelamento: 'Em até 21x no Cartão',
  pinAdmin: '1234',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Rua+Maria+Cardoso+da+Costa+70+Jardim+Nazare+Sao+Bernardo+do+Campo+SP',
};

export const SERVICOS_LIST = [
  {
    id: 'transferencia',
    nome: 'Transferência de Veículo',
    descricao: 'Mudança de proprietário ou município com rapidez e sem burocracia.',
    icone: 'FileText',
    popular: true,
  },
  {
    id: 'licenciamento',
    nome: 'Licenciamento Anual (CRLV-e)',
    descricao: 'Emissão digital imediata de CRLV-e e quitação de IPVA/Taxas.',
    icone: 'CreditCard',
    popular: true,
  },
  {
    id: 'renovacao_cnh',
    nome: 'Renovação de CNH',
    descricao: 'Agendamento e acompanhamento completo do processo de renovação.',
    icone: 'UserCheck',
    popular: false,
  },
  {
    id: 'emplacamento',
    nome: '1º Emplacamento (0km)',
    descricao: 'Emplacamento Mercosul para veículos novos, motos e utilitários.',
    icone: 'Car',
    popular: true,
  },
  {
    id: 'toxicologico',
    nome: 'Exame Toxicológico',
    descricao: 'Orientação e encaminhamento rápido para motoristas categorias C, D e E.',
    icone: 'FlaskConical',
    popular: false,
  },
  {
    id: 'reciclagem',
    nome: 'Curso de Reciclagem Veicular',
    descricao: 'Curso para condutores infratores ou com CNH suspensa.',
    icone: 'RefreshCw',
    popular: false,
  },
  {
    id: 'apreendido',
    nome: 'Liberação de Veículo Apreendido',
    descricao: 'Desbloqueio e liberação ágil no pátio do DETRAN/Polícia.',
    icone: 'ShieldAlert',
    popular: true,
  },
  {
    id: 'recurso_cnh',
    nome: 'Recurso p/ Pontuação da sua CNH',
    descricao: 'Defesa de multas, suspensão e cassação da Carteira de Habilitação.',
    icone: 'Scale',
    popular: false,
  },
  {
    id: 'outros',
    nome: 'Outros Serviços DETRAN.SP',
    descricao: 'Alteração de características, 2ª via de placa, comunicado de venda.',
    icone: 'HelpCircle',
    popular: false,
  },
];

const STORAGE_KEYS = {
  ATENDIMENTOS: 'sm_atendimentos_v1',
  SETTINGS: 'sm_settings_v1',
  ADMIN_AUTH: 'sm_admin_auth_v1',
};

const INITIAL_ATENDIMENTOS: Atendimento[] = [
  {
    id: 'SM-1001',
    protocolo: '#SM-1001',
    nome: 'Carlos Eduardo Silveira',
    telefone: '(11) 98452-1920',
    placa: 'BRA2E19',
    crlv: '01294857201',
    servico: 'Transferência de Veículo',
    observacoes: 'Comprei um Onix 2021 em SBC e preciso fazer a transferência para o meu nome o quanto antes.',
    status: 'pendente',
    criadoEm: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    atualizadoEm: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    whatsappDestino: 'numero1',
    notasInternas: [
      {
        id: 'n1',
        texto: 'Cliente solicitou orçamento de transferência com taxa de vistoria inclusa.',
        data: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        autor: 'Atendente',
      },
    ],
    valorEstimado: 480,
    anoModelo: 'Chevrolet Onix 2021',
  },
  {
    id: 'SM-1002',
    protocolo: '#SM-1002',
    nome: 'Fernanda Martins de Oliveira',
    telefone: '(11) 97134-8821',
    placa: 'FXP-4820',
    crlv: '99841203941',
    servico: 'Licenciamento Anual (CRLV-e)',
    observacoes: 'Preciso licenciar 2026 urgente para viajar no final de semana.',
    status: 'em_andamento',
    criadoEm: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    atualizadoEm: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    whatsappDestino: 'numero2',
    notasInternas: [
      {
        id: 'n2',
        texto: 'Débitos de IPVA verificados no portal. Boleto de taxa gerado.',
        data: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        autor: 'Despachante',
      },
    ],
    valorEstimado: 210,
    anoModelo: 'Hyundai HB20 2019',
  },
  {
    id: 'SM-1003',
    protocolo: '#SM-1003',
    nome: 'Marcos Vinicius Rezende',
    telefone: '(11) 99120-4493',
    placa: 'GHJ3A88',
    crlv: '84019283749',
    servico: '1º Emplacamento (0km)',
    observacoes: 'Carro zero km retirado na concessionária em Santo André, tenho a nota fiscal em mãos.',
    status: 'concluido',
    criadoEm: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    atualizadoEm: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    whatsappDestino: 'numero1',
    notasInternas: [
      {
        id: 'n3',
        texto: 'Placas estampadas e CRLV-e emitido. Cliente já retirou os documentos.',
        data: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        autor: 'Despachante',
      },
    ],
    valorEstimado: 650,
    anoModelo: 'VW Polo 2026',
  },
  {
    id: 'SM-1004',
    protocolo: '#SM-1004',
    nome: 'Juliana Aparecida Costa',
    telefone: '(11) 96321-7754',
    placa: 'EWR-9142',
    crlv: '39481029384',
    servico: 'Liberação de Veículo Apreendido',
    observacoes: 'Veículo recolhido no pátio de SBC por causa de licenciamento atrasado. Preciso de ajuda para liberação.',
    status: 'em_andamento',
    criadoEm: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    atualizadoEm: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    whatsappDestino: 'numero1',
    notasInternas: [
      {
        id: 'n4',
        texto: 'Calculando diárias do pátio e taxas de guincho.',
        data: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        autor: 'Atendente',
      },
    ],
    valorEstimado: 890,
  },
];

export function getCompanySettings(): CompanySettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    // If whatsapp2 is old default or missing, update to requested 55 11 97077322
    if (!parsed.whatsapp2 || parsed.whatsapp2 === '5511948864848') {
      parsed.whatsapp2 = DEFAULT_SETTINGS.whatsapp2;
      parsed.telefone2 = DEFAULT_SETTINGS.telefone2;
      parsed.rotuloNumero2 = DEFAULT_SETTINGS.rotuloNumero2;
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed));
    }
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveCompanySettings(settings: CompanySettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Erro ao salvar configurações:', e);
  }
}

export function getAtendimentos(): Atendimento[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ATENDIMENTOS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ATENDIMENTOS, JSON.stringify(INITIAL_ATENDIMENTOS));
      return INITIAL_ATENDIMENTOS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ATENDIMENTOS;
  }
}

export function saveNovoAtendimento(data: Omit<Atendimento, 'id' | 'protocolo' | 'criadoEm' | 'atualizadoEm' | 'notasInternas'>): Atendimento {
  const atendimentos = getAtendimentos();
  const numId = Math.floor(1000 + Math.random() * 9000);
  const novoId = `SM-${numId}`;
  const now = new Date().toISOString();

  const novo: Atendimento = {
    ...data,
    id: novoId,
    protocolo: `#${novoId}`,
    criadoEm: now,
    atualizadoEm: now,
    notasInternas: [],
  };

  const listaAtualizada = [novo, ...atendimentos];
  try {
    localStorage.setItem(STORAGE_KEYS.ATENDIMENTOS, JSON.stringify(listaAtualizada));
  } catch (e) {
    console.error('Erro ao salvar novo atendimento:', e);
  }

  return novo;
}

export function updateAtendimento(id: string, updates: Partial<Atendimento>): Atendimento | null {
  const atendimentos = getAtendimentos();
  const index = atendimentos.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const atualizado: Atendimento = {
    ...atendimentos[index],
    ...updates,
    atualizadoEm: new Date().toISOString(),
  };

  atendimentos[index] = atualizado;
  try {
    localStorage.setItem(STORAGE_KEYS.ATENDIMENTOS, JSON.stringify(atendimentos));
  } catch (e) {
    console.error('Erro ao atualizar atendimento:', e);
  }
  return atualizado;
}

export function addNotaInterna(atendimentoId: string, texto: string, autor = 'Equipe'): Atendimento | null {
  const atendimentos = getAtendimentos();
  const index = atendimentos.findIndex((item) => item.id === atendimentoId);
  if (index === -1) return null;

  const novaNota = {
    id: 'n_' + Date.now(),
    texto,
    data: new Date().toISOString(),
    autor,
  };

  const item = atendimentos[index];
  item.notasInternas = [novaNota, ...(item.notasInternas || [])];
  item.atualizadoEm = new Date().toISOString();

  try {
    localStorage.setItem(STORAGE_KEYS.ATENDIMENTOS, JSON.stringify(atendimentos));
  } catch (e) {
    console.error('Erro ao adicionar nota:', e);
  }
  return item;
}

export function deleteAtendimento(id: string): boolean {
  const atendimentos = getAtendimentos();
  const filtrados = atendimentos.filter((item) => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEYS.ATENDIMENTOS, JSON.stringify(filtrados));
    return true;
  } catch {
    return false;
  }
}

export function isAdminAuthenticated(): boolean {
  return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
}

export function setAdminAuthenticated(auth: boolean): void {
  if (auth) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
  } else {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  }
}

// Formatters
export function formatPlaca(input: string): string {
  const clean = input.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
  if (clean.length <= 3) return clean;
  // If old pattern like ABC1234, format as ABC-1234
  if (clean.length === 7 && /^[A-Z]{3}[0-9]{4}$/.test(clean)) {
    return `${clean.slice(0, 3)}-${clean.slice(3)}`;
  }
  // Mercosul ABC1D23 or in-progress
  return clean;
}

export function formatPhone(input: string): string {
  const numbers = input.replace(/\D/g, '').slice(0, 11);
  if (numbers.length <= 2) return numbers ? `(${numbers}` : '';
  if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
}

export function exportAtendimentosToCsv(atendimentos: Atendimento[]): void {
  const headers = ['Protocolo', 'Data', 'Status', 'Cliente', 'Telefone', 'Placa', 'CRLV', 'Serviço', 'Observações', 'Valor Estimado'];
  const rows = atendimentos.map((a) => [
    `"${a.protocolo}"`,
    `"${new Date(a.criadoEm).toLocaleString('pt-BR')}"`,
    `"${a.status}"`,
    `"${a.nome.replace(/"/g, '""')}"`,
    `"${a.telefone}"`,
    `"${a.placa}"`,
    `"${a.crlv}"`,
    `"${a.servico.replace(/"/g, '""')}"`,
    `"${(a.observacoes || '').replace(/"/g, '""')}"`,
    `"${a.valorEstimado ? 'R$ ' + a.valorEstimado.toFixed(2) : ''}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `despachante-santa-maria-atendimentos-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
