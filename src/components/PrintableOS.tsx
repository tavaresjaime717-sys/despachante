import React from 'react';
import { Atendimento, CompanySettings } from '../types';

interface PrintableOSProps {
  atendimento: Atendimento | null;
  settings: CompanySettings;
}

export const PrintableOS: React.FC<PrintableOSProps> = ({ atendimento, settings }) => {
  if (!atendimento) return null;

  return (
    <div className="hidden print:block p-8 bg-white text-black font-sans text-sm">
      {/* Header */}
      <div className="border-b-2 border-black pb-4 mb-4 text-center">
        <h1 className="text-2xl font-black uppercase tracking-wider">
          {settings.nomeEmpresa}
        </h1>
        <p className="text-xs font-bold tracking-widest text-gray-700">
          {settings.slogan}
        </p>
        <p className="text-xs text-gray-600 mt-1">
          {settings.endereco} - {settings.bairro} - {settings.cidadeUf}
        </p>
        <p className="text-xs text-gray-600">
          Telefones: {settings.telefone1} • {settings.telefone2}
        </p>
      </div>

      {/* Protocol & Date Bar */}
      <div className="flex justify-between items-center bg-gray-100 p-3 rounded mb-4 font-mono font-bold border border-gray-300">
        <div>
          <span>ORDEM DE SERVIÇO: </span>
          <span className="text-lg">{atendimento.protocolo}</span>
        </div>
        <div>
          <span>DATA: </span>
          <span>{new Date(atendimento.criadoEm).toLocaleDateString('pt-BR')}</span>
        </div>
        <div>
          <span>STATUS: </span>
          <span className="uppercase">{atendimento.status}</span>
        </div>
      </div>

      {/* Client and Vehicle Info Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Client */}
        <div className="border border-gray-300 p-3 rounded">
          <h2 className="font-bold text-xs uppercase tracking-wider text-gray-700 border-b pb-1 mb-2">
            Dados do Cliente
          </h2>
          <p>
            <strong>Nome:</strong> {atendimento.nome}
          </p>
          <p>
            <strong>Telefone:</strong> {atendimento.telefone}
          </p>
        </div>

        {/* Vehicle */}
        <div className="border border-gray-300 p-3 rounded">
          <h2 className="font-bold text-xs uppercase tracking-wider text-gray-700 border-b pb-1 mb-2">
            Dados do Veículo
          </h2>
          <p>
            <strong>Placa:</strong> {atendimento.placa}
          </p>
          <p>
            <strong>CRLV / Renavam:</strong> {atendimento.crlv}
          </p>
        </div>
      </div>

      {/* Service Details */}
      <div className="border border-gray-300 p-3 rounded mb-6">
        <h2 className="font-bold text-xs uppercase tracking-wider text-gray-700 border-b pb-1 mb-2">
          Serviço Contratado
        </h2>
        <p className="text-base font-bold mb-1">{atendimento.servico}</p>
        {atendimento.observacoes && (
          <p className="text-gray-700 mt-2">
            <strong>Observações:</strong> {atendimento.observacoes}
          </p>
        )}
        {atendimento.valorEstimado && (
          <p className="text-base font-bold text-gray-900 mt-3">
            <strong>Valor Total Estimado / Taxas:</strong> R${' '}
            {atendimento.valorEstimado.toFixed(2)}
          </p>
        )}
      </div>

      {/* Internal Notes if any */}
      {atendimento.notasInternas && atendimento.notasInternas.length > 0 && (
        <div className="border border-gray-300 p-3 rounded mb-6">
          <h2 className="font-bold text-xs uppercase tracking-wider text-gray-700 border-b pb-1 mb-2">
            Acompanhamento e Histórico
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-xs text-gray-700">
            {atendimento.notasInternas.map((n) => (
              <li key={n.id}>
                <strong>{new Date(n.data).toLocaleDateString('pt-BR')}:</strong> {n.texto}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Terms & Signatures */}
      <div className="mt-12 pt-6 border-t border-gray-400">
        <div className="grid grid-cols-2 gap-12 text-center text-xs">
          <div>
            <div className="border-b border-black mb-2 pb-8"></div>
            <p className="font-bold">{atendimento.nome}</p>
            <p className="text-gray-500">Assinatura do Cliente</p>
          </div>
          <div>
            <div className="border-b border-black mb-2 pb-8"></div>
            <p className="font-bold">{settings.nomeEmpresa}</p>
            <p className="text-gray-500">Responsável pelo Atendimento</p>
          </div>
        </div>
      </div>
    </div>
  );
};
