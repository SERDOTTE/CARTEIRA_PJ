import React, { useMemo, useState } from 'react';
import { Company, CompanyCategory, CompanyStatus } from '../types';
import { BuildingOfficeIcon, UsersIcon, ChatBubbleLeftRightIcon } from './icons';

interface DashboardProps {
  companies: Company[];
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  statusCounts?: {
    [CompanyStatus.PROSPECCAO]: number;
    [CompanyStatus.FECHAMENTO]: number;
    [CompanyStatus.CONCLUIDO]: number;
  };
  onStatusClick?: (status: CompanyStatus) => void;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, statusCounts, onStatusClick }) => (
  <div className="bg-surface-card rounded-xl shadow-lg p-5 flex flex-col justify-between min-h-[140px]">
    <div className="flex items-center space-x-4">
      <div className={`flex-shrink-0 rounded-full p-3 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-text-secondary font-medium">{title}</p>
        <p className="text-2xl font-bold text-text-primary">{value}</p>
      </div>
    </div>
    {statusCounts && (
      <div className="mt-3 pt-3 border-t border-gray-700/50 flex justify-around text-center">
        <button
          onClick={() => onStatusClick?.(CompanyStatus.PROSPECCAO)}
          className="flex-1 hover:bg-white/10 rounded px-2 py-1 transition-colors cursor-pointer"
        >
          <p className="text-xs text-text-secondary leading-tight" title={CompanyStatus.PROSPECCAO}>Prosp.</p>
          <p className="font-bold text-sm text-text-primary">{statusCounts[CompanyStatus.PROSPECCAO]}</p>
        </button>
        <button
          onClick={() => onStatusClick?.(CompanyStatus.FECHAMENTO)}
          className="flex-1 hover:bg-white/10 rounded px-2 py-1 transition-colors cursor-pointer"
        >
          <p className="text-xs text-text-secondary leading-tight" title={CompanyStatus.FECHAMENTO}>Fech.</p>
          <p className="font-bold text-sm text-text-primary">{statusCounts[CompanyStatus.FECHAMENTO]}</p>
        </button>
        <button
          onClick={() => onStatusClick?.(CompanyStatus.CONCLUIDO)}
          className="flex-1 hover:bg-white/10 rounded px-2 py-1 transition-colors cursor-pointer"
        >
          <p className="text-xs text-text-secondary leading-tight" title={CompanyStatus.CONCLUIDO}>Conc.</p>
          <p className="font-bold text-sm text-text-primary">{statusCounts[CompanyStatus.CONCLUIDO]}</p>
        </button>
      </div>
    )}
  </div>
);


const Dashboard: React.FC<DashboardProps> = ({ companies }) => {
  const [selectedFilter, setSelectedFilter] = useState<{ category: CompanyCategory; status: CompanyStatus } | null>(null);
  const stats = useMemo(() => {
    const initialCategoryStats = {
      totalValue: 0,
      [CompanyStatus.PROSPECCAO]: 0,
      [CompanyStatus.FECHAMENTO]: 0,
      [CompanyStatus.CONCLUIDO]: 0,
    };

    const counts = {
      totalValue: 0,
      [CompanyCategory.CAPTACAO]: { ...initialCategoryStats },
      [CompanyCategory.CREDITO]: { ...initialCategoryStats },
      [CompanyCategory.SERVICOS]: { ...initialCategoryStats },
      [CompanyCategory.ADIMPLENCIA]: { ...initialCategoryStats },
    };

    companies.forEach(company => {
      // Para cada categoria selecionada na empresa
      company.category.forEach(cat => {
        const detail = company.categoryDetails[cat];
        if (detail && counts[cat]) {
          counts.totalValue += detail.operationValue;
          counts[cat].totalValue += detail.operationValue;
          counts[cat][detail.status]++;
        }
      });
    });
    
    return counts;
  }, [companies]);

  const recentInteractions = useMemo(() => {
    return companies
      .flatMap(company => 
        company.interactions.map(interaction => ({
          ...interaction,
          companyName: company.name,
        }))
      )
      .sort((a, b) => new Date(b.contactDate).getTime() - new Date(a.contactDate).getTime())
      .slice(0, 5);
  }, [companies]);

  const filteredCompanies = useMemo(() => {
    if (!selectedFilter) return [];
    
    return companies.filter(company => {
      const detail = company.categoryDetails[selectedFilter.category];
      return detail && detail.status === selectedFilter.status;
    });
  }, [companies, selectedFilter]);

  const handleStatusClick = (category: CompanyCategory, status: CompanyStatus) => {
    setSelectedFilter({ category, status });
  };

  const handleCloseModal = () => {
    setSelectedFilter(null);
  };
  
  const categoryCards = [
    {
      category: CompanyCategory.CAPTACAO,
      icon: <UsersIcon className="w-6 h-6 text-white" />,
      color: 'bg-blue-600'
    },
    {
      category: CompanyCategory.CREDITO,
      icon: <BuildingOfficeIcon className="w-6 h-6 text-white" />,
      color: 'bg-yellow-600'
    },
    {
      category: CompanyCategory.SERVICOS,
      icon: <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />,
      color: 'bg-green-600'
    },
    {
      category: CompanyCategory.ADIMPLENCIA,
      icon: <BuildingOfficeIcon className="w-6 h-6 text-white" />,
      color: 'bg-red-600'
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-4">Dashboard Geral</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          <StatCard 
            title="Valor Total das Operações"
            value={formatCurrency(stats.totalValue)}
            icon={<BuildingOfficeIcon className="w-6 h-6 text-white" />}
            color="bg-purple-600"
          />
          {categoryCards.map(card => (
             <StatCard 
                key={card.category}
                title={card.category}
                value={formatCurrency(stats[card.category].totalValue)}
                icon={card.icon}
                color={card.color}
                statusCounts={{
                  [CompanyStatus.PROSPECCAO]: stats[card.category][CompanyStatus.PROSPECCAO],
                  [CompanyStatus.FECHAMENTO]: stats[card.category][CompanyStatus.FECHAMENTO],
                  [CompanyStatus.CONCLUIDO]: stats[card.category][CompanyStatus.CONCLUIDO],
                }}
                onStatusClick={(status) => handleStatusClick(card.category, status)}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-text-primary mb-4">Interações Recentes</h2>
        <div className="bg-surface-card rounded-xl shadow-lg">
          <ul className="divide-y divide-gray-700/50">
            {recentInteractions.length > 0 ? (
              recentInteractions.map(interaction => (
                <li key={interaction.id} className="p-4 hover:bg-white/5 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-text-primary">{interaction.companyName}</p>
                      <p className="text-sm text-text-secondary mt-1">{interaction.notes}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                        <p className="text-xs text-text-secondary">{new Date(interaction.contactDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</p>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="p-4 text-center text-text-secondary">Nenhuma interação recente encontrada.</li>
            )}
          </ul>
        </div>
      </div>

      {selectedFilter && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface-modal rounded-xl shadow-2xl p-6 w-11/12 md:w-1/2 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-text-primary">
                {selectedFilter.category} - {selectedFilter.status}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-text-secondary hover:text-text-primary text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {filteredCompanies.length > 0 ? (
              <div className="space-y-4">
                {filteredCompanies.map(company => {
                  const value = company.categoryDetails[selectedFilter.category]?.operationValue ?? 0;
                  return (
                    <div key={company.id} className="flex justify-between items-center p-3 bg-surface-card rounded-lg hover:bg-white/10 transition-colors">
                      <div>
                        <p className="font-semibold text-text-primary">{company.name}</p>
                        <p className="text-sm text-text-secondary">{company.industry}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-text-primary">{formatCurrency(value)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-text-secondary">Nenhuma empresa encontrada.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;