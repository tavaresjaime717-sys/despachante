import React, { useState } from 'react';
import { Lock, KeyRound, ShieldAlert, X } from 'lucide-react';

interface AdminLoginModalProps {
  correctPin: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  correctPin,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === correctPin || pin.trim() === '1234') {
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0b162c] border border-cyan-500/40 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-3">
          <Lock className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-black text-center text-white">
          Acesso ao Painel do Despachante
        </h3>
        <p className="text-xs text-center text-slate-300 mt-1 mb-4">
          Digite a senha PIN de acesso para gerenciar os atendimentos. (Padrão: <span className="text-cyan-300 font-mono font-bold">1234</span>)
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <input
                type="password"
                maxLength={8}
                autoFocus
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Digite o PIN (ex: 1234)"
                className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 text-center text-xl tracking-widest text-white font-mono rounded-xl py-3 px-4 outline-none"
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {error && (
              <p className="text-xs text-rose-400 mt-1.5 flex items-center justify-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                PIN incorreto. Tente novamente ou use 1234.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition-all shadow-lg active:scale-95"
          >
            Entrar no Painel
          </button>
        </form>
      </div>
    </div>
  );
};
