import React, { useState, useEffect } from 'react';
import {
  getCompanySettings,
  saveCompanySettings,
  getAtendimentos,
  isAdminAuthenticated,
  setAdminAuthenticated,
  SERVICOS_LIST,
} from './utils/storage';
import { Atendimento, CompanySettings } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BioForm } from './components/BioForm';
import { ServicesGrid } from './components/ServicesGrid';
import { LocationCard } from './components/LocationCard';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel';
import { AdminLoginModal } from './components/AdminLoginModal';
import { PrintableOS } from './components/PrintableOS';

export default function App() {
  const [settings, setSettings] = useState<CompanySettings>(getCompanySettings());
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [activeView, setActiveView] = useState<'client' | 'admin'>('client');
  const [isAdminAuth, setIsAdminAuth] = useState<boolean>(isAdminAuthenticated());
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<string>(SERVICOS_LIST[0].nome);
  const [printingAtendimento, setPrintingAtendimento] = useState<Atendimento | null>(null);

  // Load initial atendimentos
  useEffect(() => {
    setAtendimentos(getAtendimentos());
  }, []);

  const refreshAtendimentos = () => {
    setAtendimentos(getAtendimentos());
  };

  const handleUpdateSettings = (newSettings: CompanySettings) => {
    setSettings(newSettings);
    saveCompanySettings(newSettings);
  };

  const handleNavigate = (view: 'client' | 'admin') => {
    if (view === 'admin') {
      if (isAdminAuth) {
        setActiveView('admin');
      } else {
        setShowLoginModal(true);
      }
    } else {
      setActiveView('client');
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminAuth(true);
    setAdminAuthenticated(true);
    setShowLoginModal(false);
    setActiveView('admin');
  };

  const handleLogout = () => {
    setIsAdminAuth(false);
    setAdminAuthenticated(false);
    setActiveView('client');
  };

  const handleSelectServiceFromGrid = (serviceName: string) => {
    setSelectedService(serviceName);
    // Smooth scroll down to the form
    const formElement = document.getElementById('formulario-atendimento');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const scrollToForm = () => {
    const formElement = document.getElementById('formulario-atendimento');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const pendingCount = atendimentos.filter((a) => a.status === 'pendente').length;

  return (
    <div className="min-h-screen bg-[#070d19] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Header */}
      <Header
        settings={settings}
        activeView={activeView}
        onNavigate={handleNavigate}
        pendingCount={pendingCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-4 md:py-6">
        {activeView === 'client' ? (
          <div className="space-y-10 md:space-y-12">
            {/* Hero Section */}
            <Hero settings={settings} onCtaClick={scrollToForm} />

            {/* Main Intake Form */}
            <BioForm
              settings={settings}
              selectedService={selectedService}
              onServiceChange={setSelectedService}
              onSuccessSubmit={() => {
                refreshAtendimentos();
              }}
            />

            {/* Official Services Grid (from Poster) */}
            <ServicesGrid
              selectedService={selectedService}
              onSelectService={handleSelectServiceFromGrid}
              settings={settings}
            />

            {/* Physical Location Card */}
            <LocationCard settings={settings} />
          </div>
        ) : (
          /* Admin / Management Panel */
          <AdminPanel
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            atendimentos={atendimentos}
            onRefreshAtendimentos={refreshAtendimentos}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Footer */}
      <Footer settings={settings} onOpenAdmin={() => handleNavigate('admin')} />

      {/* Admin Login Modal */}
      <AdminLoginModal
        correctPin={settings.pinAdmin}
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* Printable Order of Service (hidden on screen, visible during browser printing) */}
      <PrintableOS
        atendimento={
          printingAtendimento || (atendimentos.length > 0 ? atendimentos[0] : null)
        }
        settings={settings}
      />
    </div>
  );
}
