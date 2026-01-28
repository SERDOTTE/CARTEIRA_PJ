import React, { useState } from 'react';
import { Company, CompanyCategory, CompanyStatus } from '../types';
import CompanyCard from './CompanyCard';

interface CompanyBoardProps {
  companies: Company[];
  onViewInteractions: (company: Company) => void;
  onEditCompany: (company: Company) => void;
  onCompanyMove: (companyId: string, newCategory: CompanyCategory, newStatus: CompanyStatus) => void;
}

const categoryOrder: CompanyCategory[] = [
  CompanyCategory.CAPTACAO,
  CompanyCategory.CREDITO,
  CompanyCategory.SERVICOS,
  CompanyCategory.ADIMPLENCIA,
];

const statusOrder: CompanyStatus[] = [
  CompanyStatus.PROSPECCAO,
  CompanyStatus.FECHAMENTO,
  CompanyStatus.CONCLUIDO,
];

const categoryColors: { [key in CompanyCategory]: { header: string, gradients: { [key in CompanyStatus]: string } } } = {
    [CompanyCategory.CAPTACAO]: {
        header: 'bg-blue-600',
        gradients: {
            [CompanyStatus.PROSPECCAO]: 'from-blue-900/40 to-surface-card/0',
            [CompanyStatus.FECHAMENTO]: 'from-blue-800/40 to-surface-card/0',
            [CompanyStatus.CONCLUIDO]: 'from-blue-700/40 to-surface-card/0',
        }
    },
    [CompanyCategory.CREDITO]: {
        header: 'bg-yellow-600',
        gradients: {
            [CompanyStatus.PROSPECCAO]: 'from-yellow-900/40 to-surface-card/0',
            [CompanyStatus.FECHAMENTO]: 'from-yellow-800/40 to-surface-card/0',
            [CompanyStatus.CONCLUIDO]: 'from-yellow-700/40 to-surface-card/0',
        }
    },
    [CompanyCategory.SERVICOS]: {
        header: 'bg-green-600',
        gradients: {
            [CompanyStatus.PROSPECCAO]: 'from-green-900/40 to-surface-card/0',
            [CompanyStatus.FECHAMENTO]: 'from-green-800/40 to-surface-card/0',
            [CompanyStatus.CONCLUIDO]: 'from-green-700/40 to-surface-card/0',
        }
    },
    [CompanyCategory.ADIMPLENCIA]: {
        header: 'bg-red-600',
        gradients: {
            [CompanyStatus.PROSPECCAO]: 'from-red-900/40 to-surface-card/0',
            [CompanyStatus.FECHAMENTO]: 'from-red-800/40 to-surface-card/0',
            [CompanyStatus.CONCLUIDO]: 'from-red-700/40 to-surface-card/0',
        }
    },
};

const CompanyBoard: React.FC<CompanyBoardProps> = ({ companies, onViewInteractions, onEditCompany, onCompanyMove }) => {
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverInfo, setDragOverInfo] = useState<{category: CompanyCategory, status: CompanyStatus} | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, companyId: string) => {
    e.dataTransfer.setData('companyId', companyId);
    setDraggedItemId(companyId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, category: CompanyCategory, status: CompanyStatus) => {
    e.preventDefault();
    setDragOverInfo({ category, status });
  };
    
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverInfo(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, category: CompanyCategory, status: CompanyStatus) => {
    e.preventDefault();
    const companyId = e.dataTransfer.getData('companyId');
    if (companyId) {
      onCompanyMove(companyId, category, status);
    }
    setDraggedItemId(null);
    setDragOverInfo(null);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {categoryOrder.map(category => {
        const companiesInCategory = companies.filter(c => c.category.includes(category));
        return (
          <div key={category} className="bg-surface-card rounded-xl shadow-lg flex flex-col">
            <div className={`flex items-center justify-between p-4 rounded-t-xl ${categoryColors[category].header}`}>
              <h2 className="font-bold text-lg text-white">{category}</h2>
              <span className="bg-white/20 text-white text-sm font-bold px-2 py-1 rounded-full">
                {companiesInCategory.length}
              </span>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto h-[calc(100vh-15rem)]">
              {statusOrder.map(status => {
                const filteredCompanies = companiesInCategory.filter(c => c.categoryDetails[category]?.status === status);
                const isDragOver = dragOverInfo?.category === category && dragOverInfo?.status === status;
                return (
                  <div 
                    key={status}
                    onDragOver={(e) => handleDragOver(e, category, status)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, category, status)}
                    className={`p-1 rounded-lg transition-all duration-300 ${isDragOver ? 'bg-brand-primary/20' : ''}`}
                  >
                    <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider px-1 mb-2">{status} ({filteredCompanies.length})</h3>
                    <div className={`space-y-3 p-2 rounded-md bg-gradient-to-b min-h-[120px] ${categoryColors[category].gradients[status]}`}>
                      {filteredCompanies.length > 0 ? (
                        filteredCompanies.map(company => (
                          <CompanyCard 
                            key={company.id} 
                            company={company}
                            category={category}
                            isDragging={draggedItemId === company.id}
                            onDragStart={(e) => handleDragStart(e, company.id)}
                            onViewInteractions={() => onViewInteractions(company)}
                            onEditCompany={() => onEditCompany(company)}
                          />
                        ))
                      ) : (
                         <div className="text-center py-4 border-2 border-dashed border-gray-700/50 rounded-lg flex items-center justify-center h-full">
                            <p className="text-text-secondary text-sm">Arraste aqui</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CompanyBoard;
