export type AtendimentoStatus = 'pendente' | 'em_andamento' | 'concluido' | 'cancelado';

export interface NotaInterna {
  id: string;
  texto: string;
  data: string;
  autor: string;
}

export interface Atendimento {
  id: string;
  protocolo: string;
  nome: string;
  telefone: string;
  placa: string;
  crlv: string;
  servico: string;
  observacoes: string;
  status: AtendimentoStatus;
  criadoEm: string;
  atualizadoEm: string;
  whatsappDestino?: 'numero1' | 'numero2' | 'ambos';
  notasInternas: NotaInterna[];
  valorEstimado?: number | null;
  anoModelo?: string;
  marcaModelo?: string;
  chassi?: string;
  cpfCnpj?: string;
  impresso?: boolean;
  dataImpressao?: string;
}

export interface CompanySettings {
  nomeEmpresa: string;
  slogan: string;
  telefone1: string;
  whatsapp1: string;
  rotuloNumero1: string;
  telefone2: string;
  whatsapp2: string;
  rotuloNumero2: string;
  endereco: string;
  bairro: string;
  cidadeUf: string;
  chavePix?: string;
  horarioFuncionamento: string;
  parcelamento: string;
  pinAdmin: string;
  googleMapsUrl: string;
}

export interface ServicoItem {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  destaque?: boolean;
}
