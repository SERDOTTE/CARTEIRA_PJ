import React, { useState, useCallback } from 'react';
import { Company, CompanyCategory, Interaction, CompanyStatus } from './types';
import Header from './components/Header';
import CompanyBoard from './components/CompanyBoard';
import CompanyModal from './components/CompanyModal';
import InteractionModal from './components/InteractionModal';
import Dashboard from './components/Dashboard';

export type View = 'board' | 'dashboard';

const initialCompanies: Company[] = [
  {
    id: '1',
    name: 'InovaTech Soluções',
    address: 'Rua das Inovações, 123, São Paulo, SP',
    email: 'contato@inovatech.com',
    phone: '(11) 98765-4321',
    industry: 'Tecnologia',
    description: 'Desenvolvimento de software e soluções em nuvem.',
    category: [CompanyCategory.CAPTACAO],
    categoryDetails: {
      [CompanyCategory.CAPTACAO]: {
        status: CompanyStatus.PROSPECCAO,
        operationValue: 50000,
      }
    },
    interactions: [
      { id: 'i1', contactDate: '2024-07-10', notes: 'Primeiro contato, apresentamos a proposta.', followUpDate: '2024-07-17' },
    ],
  },
  {
    id: '2',
    name: 'ConstruBem',
    address: 'Avenida das Obras, 456, Rio de Janeiro, RJ',
    email: 'orcamento@construbem.com',
    phone: '(21) 91234-5678',
    industry: 'Construção Civil',
    description: 'Construções e reformas residenciais e comerciais.',
    category: [CompanyCategory.CREDITO],
    categoryDetails: {
      [CompanyCategory.CREDITO]: {
        status: CompanyStatus.FECHAMENTO,
        operationValue: 250000,
      }
    },
    interactions: [],
  },
    {
    id: '3',
    name: 'AgroForte',
    address: 'Rodovia dos Grãos, 789, Cuiabá, MT',
    email: 'vendas@agroforte.com.br',
    phone: '(65) 99988-7766',
    industry: 'Agronegócio',
    description: 'Distribuidor de insumos agrícolas e sementes.',
    category: [CompanyCategory.SERVICOS],
    categoryDetails: {
      [CompanyCategory.SERVICOS]: {
        status: CompanyStatus.CONCLUIDO,
        operationValue: 120000,
      }
    },
    interactions: [
      { id: 'i2', contactDate: '2024-06-20', notes: 'Fechamento do contrato de fornecimento.', followUpDate: '2024-08-20' },
      { id: 'i3', contactDate: '2024-07-15', notes: 'Acompanhamento da primeira entrega.', followUpDate: '2024-07-22' },
    ],
  },
];

const App: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [isCompanyModalOpen, setCompanyModalOpen] = useState(false);
  const [isInteractionModalOpen, setInteractionModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [currentView, setCurrentView] = useState<View>('board');

  const handleOpenAddCompanyModal = useCallback(() => {
    setEditingCompany(null);
    setCompanyModalOpen(true);
  }, []);
  
  const handleOpenEditCompanyModal = useCallback((company: Company) => {
    setEditingCompany(company);
    setCompanyModalOpen(true);
  }, []);

  const handleOpenInteractionModal = useCallback((company: Company) => {
    setSelectedCompany(company);
    setInteractionModalOpen(true);
  }, []);

  const handleCloseModals = useCallback(() => {
    setCompanyModalOpen(false);
    setInteractionModalOpen(false);
    setSelectedCompany(null);
    setEditingCompany(null);
  }, []);
  
  const handleSaveCompany = useCallback((companyData: Omit<Company, 'id' | 'interactions'>, id?: string) => {
    if (id) {
      setCompanies(prev => prev.map(c => c.id === id ? { ...c, ...companyData } : c));
    } else {
      const newCompany: Company = {
        ...companyData,
        id: new Date().toISOString(),
        interactions: [],
      };
      setCompanies(prev => [...prev, newCompany]);
    }
    handleCloseModals();
  }, [handleCloseModals]);
  
  const handleAddInteraction = useCallback((companyId: string, interactionData: Omit<Interaction, 'id'>) => {
    const newInteraction: Interaction = {
      ...interactionData,
      id: new Date().toISOString(),
    };
    setCompanies(prev => prev.map(c => {
      if (c.id === companyId) {
        const updatedCompany = { ...c, interactions: [...c.interactions, newInteraction] };
        setSelectedCompany(updatedCompany); // Update selected company to reflect new interaction
        return updatedCompany;
      }
      return c;
    }));
  }, []);

  const handleCompanyMove = useCallback((companyId: string, newCategory: CompanyCategory, newStatus: CompanyStatus) => {
    setCompanies(prev => prev.map(c => {
      if (c.id === companyId) {
        const detail = c.categoryDetails[newCategory];
        if (detail) {
          // Se a categoria já existe, apenas atualiza o status
          return {
            ...c,
            categoryDetails: {
              ...c.categoryDetails,
              [newCategory]: {
                ...detail,
                status: newStatus
              }
            }
          };
        } else if (c.category.includes(newCategory)) {
          // Se a categoria está selecionada mas não tem detalhes, cria os detalhes
          return {
            ...c,
            categoryDetails: {
              ...c.categoryDetails,
              [newCategory]: {
                status: newStatus,
                operationValue: 0
              }
            }
          };
        }
      }
      return c;
    }));
  }, []);

  return (
    <div className="min-h-screen bg-surface-main font-sans">
      <Header 
        onAddCompany={handleOpenAddCompanyModal} 
        currentView={currentView}
        onSetView={setCurrentView}
      />
      <main className="p-4 sm:p-6 lg:p-8">
        {currentView === 'board' ? (
          <CompanyBoard 
            companies={companies}
            onViewInteractions={handleOpenInteractionModal}
            onEditCompany={handleOpenEditCompanyModal}
            onCompanyMove={handleCompanyMove}
          />
        ) : (
          <Dashboard companies={companies} />
        )}
      </main>
      
      {isCompanyModalOpen && (
        <CompanyModal 
          isOpen={isCompanyModalOpen}
          onClose={handleCloseModals}
          onSave={handleSaveCompany}
          companyToEdit={editingCompany}
        />
      )}

      {isInteractionModalOpen && selectedCompany && (
        <InteractionModal
          isOpen={isInteractionModalOpen}
          onClose={handleCloseModals}
          company={selectedCompany}
          onAddInteraction={handleAddInteraction}
        />
      )}
    </div>
  );
};

export default App;
