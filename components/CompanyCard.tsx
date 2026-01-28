import React from 'react';
import { Company, CompanyCategory } from '../types';
import { EditIcon, EyeIcon } from './icons';

interface CompanyCardProps {
  company: Company;
  category: CompanyCategory;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onViewInteractions: () => void;
  onEditCompany: () => void;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

const CompanyCard: React.FC<CompanyCardProps> = ({ company, category, isDragging, onDragStart, onViewInteractions, onEditCompany }) => {
  const operationValue = company.categoryDetails[category]?.operationValue ?? 0;
  
  return (
    <div 
      draggable
      onDragStart={onDragStart}
      className={`bg-surface-modal rounded-lg shadow-md p-4 flex flex-col justify-between transition-all duration-300 cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-40 ring-2 ring-brand-light' : 'hover:shadow-xl'}`}
    >
      <div>
        <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-text-primary truncate pr-2">{company.name}</h3>
            <div className="flex-shrink-0 space-x-1">
                 <button 
                    onClick={onEditCompany}
                    className="p-1 text-text-secondary hover:text-text-primary hover:bg-white/10 rounded-full transition-colors"
                    aria-label="Editar Empresa"
                >
                  <EditIcon className="w-4 h-4" />
                </button>
                <button 
                    onClick={onViewInteractions}
                    className="p-1 text-text-secondary hover:text-text-primary hover:bg-white/10 rounded-full transition-colors"
                    aria-label="Ver Mais"
                >
                  <EyeIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
        <p className="text-sm text-brand-light font-semibold">{company.industry}</p>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-700">
         <p className="text-xs text-text-secondary">Valor da Operação</p>
         <p className="text-lg font-bold text-text-primary">{formatCurrency(operationValue)}</p>
      </div>
    </div>
  );
};

export default CompanyCard;
