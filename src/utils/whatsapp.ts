import { Atendimento, CompanySettings } from '../types';

export function buildClientWhatsAppMessage(
  data: {
    nome: string;
    telefone: string;
    placa: string;
    crlv: string;
    servico: string;
    observacoes?: string;
    protocolo?: string;
  },
  settings: CompanySettings
): string {
  const lines = [
    `🚗 *SOLICITAÇÃO DE ATENDIMENTO* 📋`,
    `*${settings.nomeEmpresa.toUpperCase()}*`,
    `_${settings.slogan}_`,
    '',
    `Olá, equipe do Despachante Santa Maria! Gostaria de uma cotação/atendimento para o meu veículo:`,
    '',
    `👤 *Cliente:* ${data.nome.trim()}`,
    `📞 *Telefone:* ${data.telefone.trim()}`,
    `🚘 *Placa do Veículo:* ${data.placa.trim().toUpperCase()}`,
    `📄 *CRLV / Doc:* ${data.crlv.trim()}`,
    `🛠️ *Serviço:* ${data.servico.trim()}`,
  ];

  if (data.observacoes && data.observacoes.trim()) {
    lines.push(`💬 *Detalhes:* ${data.observacoes.trim()}`);
  }

  if (data.protocolo) {
    lines.push(`🔖 *Protocolo Gerado:* ${data.protocolo}`);
  }

  lines.push('');
  lines.push(`📍 Unidade: ${settings.endereco}, ${settings.bairro} - SBC`);
  lines.push(`💳 Facilitado ${settings.parcelamento}`);
  lines.push('');
  lines.push(`Aguardo o contato com as orientações e valores! Obrigado.`);

  return lines.join('\n');
}

export function buildDespachanteReplyMessage(
  atendimento: Atendimento,
  settings: CompanySettings
): string {
  const lines = [
    `Olá, *${atendimento.nome}*! 👋`,
    `Aqui é da equipe do *${settings.nomeEmpresa}* (SBC - SP).`,
    '',
    `Recebemos sua solicitação referente ao veículo placa *${atendimento.placa}* para o serviço de *${atendimento.servico}* (Protocolo: ${atendimento.protocolo}).`,
    '',
    `Já estamos analisando a situação junto ao sistema do DETRAN.SP. Como podemos te auxiliar no momento?`,
    '',
    `📍 Nosso endereço: ${settings.endereco} - ${settings.bairro} - SBC`,
    `💳 Facilitamos tudo em ${settings.parcelamento}!`,
  ];
  return lines.join('\n');
}

export function openWhatsAppChat(phoneE164: string, message: string): void {
  // Clean phone number
  const cleanPhone = phoneE164.replace(/\D/g, '');
  const encodedText = encodeURIComponent(message);
  const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
