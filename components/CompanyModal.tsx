import React, { useState, useEffect } from 'react';
import { Company, CompanyCategory, CompanyStatus, CategoryDetail } from '../types';
import { CloseIcon } from './icons';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (companyData: Omit<Company, 'id' | 'interactions'>, id?: string) => void;
  companyToEdit: Company | null;
}

interface FormData {
  name: string;
  address: string;
  email: string;
  phone: string;
  industry: string;
  description: string;
  category: CompanyCategory[];
  categoryDetails: {
    [key in CompanyCategory]?: CategoryDetail;
  };
}

const CompanyModal: React.FC<CompanyModalProps> = ({ isOpen, onClose, onSave, companyToEdit }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    address: '',
    email: '',
    phone: '',
    industry: '',
    description: '',
    category: [] as CompanyCategory[],
    categoryDetails: {},
  });

  useEffect(() => {
    if (companyToEdit) {
      setFormData({
        name: companyToEdit.name,
        address: companyToEdit.address,
        email: companyToEdit.email,
        phone: companyToEdit.phone,
        industry: companyToEdit.industry,
        description: companyToEdit.description,
        category: companyToEdit.category,
        categoryDetails: companyToEdit.categoryDetails,
      });
    } else {
      setFormData({
        name: '', address: '', email: '', phone: '', industry: '', description: '',
        category: [],
        categoryDetails: {},
      });
    }
  }, [companyToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setFormData(prev => ({ ...prev, [name]: isNumber ? parseFloat(value) : value }));
  };

  const handleCategoryChange = (category: CompanyCategory) => {
    setFormData(prev => {
      const currentCategories = prev.category;
      if (currentCategories.includes(category)) {
        const newCategories = currentCategories.filter(c => c !== category);
        const newDetails = { ...prev.categoryDetails };
        delete newDetails[category];
        return {
          ...prev,
          category: newCategories,
          categoryDetails: newDetails
        };
      } else {
        const newDetails = { ...prev.categoryDetails };
        newDetails[category] = {
          status: CompanyStatus.PROSPECCAO,
          operationValue: 0,
        };
        return {
          ...prev,
          category: [...currentCategories, category],
          categoryDetails: newDetails
        };
      }
    });
  };

  const handleCategoryDetailChange = (category: CompanyCategory, field: 'status' | 'operationValue', value: string | number) => {
    setFormData(prev => ({
      ...prev,
      categoryDetails: {
        ...prev.categoryDetails,
        [category]: {
          ...prev.categoryDetails[category]!,
          [field]: field === 'operationValue' ? parseFloat(value as string) : value
        }
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, companyToEdit?.id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-surface-modal rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-600">
          <h2 className="text-xl font-bold">{companyToEdit ? 'Editar Empresa' : 'Adicionar Nova Empresa'}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-500/50">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Nome</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full bg-surface-card border-gray-600 rounded-md shadow-sm focus:ring-brand-light focus:border-brand-light sm:text-sm p-2" />
            </div>
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-text-secondary">CNPJ:</label>
              <input type="text" name="industry" id="industry" value={formData.industry} onChange={handleChange} required className="mt-1 block w-full bg-surface-card border-gray-600 rounded-md shadow-sm focus:ring-brand-light focus:border-brand-light sm:text-sm p-2" />
            </div>
          </div>
           <div>
              <label htmlFor="address" className="block text-sm font-medium text-text-secondary">Ramo de Atividade</label>
              <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} required className="mt-1 block w-full bg-surface-card border-gray-600 rounded-md shadow-sm focus:ring-brand-light focus:border-brand-light sm:text-sm p-2" />
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-text-secondary">Telefone</label>
              <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} required className="mt-1 block w-full bg-surface-card border-gray-600 rounded-md shadow-sm focus:ring-brand-light focus:border-brand-light sm:text-sm p-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-3">Áreas de Atuação</label>
            <div className="space-y-4 bg-surface-card rounded-md p-4">
              {Object.values(CompanyCategory).map(cat => (
                <div key={cat}>
                  <div className="flex items-center mb-3">
                    <input 
                      type="checkbox" 
                      id={`category-${cat}`}
                      checked={formData.category.includes(cat)}
                      onChange={() => handleCategoryChange(cat)}
                      className="w-4 h-4 rounded border-gray-500 text-brand-primary focus:ring-brand-light cursor-pointer"
                    />
                    <label htmlFor={`category-${cat}`} className="ml-2 text-sm font-medium text-text-primary cursor-pointer">
                      {cat}
                    </label>
                  </div>
                  {formData.category.includes(cat) && (
                    <div className="ml-6 space-y-3 mb-3 p-3 bg-surface-main/50 rounded border border-gray-700">
                      <div>
                        <label htmlFor={`status-${cat}`} className="block text-sm font-medium text-text-secondary">Status para {cat}</label>
                        <select 
                          id={`status-${cat}`}
                          value={formData.categoryDetails[cat]?.status || CompanyStatus.PROSPECCAO}
                          onChange={(e) => handleCategoryDetailChange(cat, 'status', e.target.value)}
                          className="mt-1 block w-full bg-surface-card border-gray-600 rounded-md shadow-sm focus:ring-brand-light focus:border-brand-light sm:text-sm p-2"
                        >
                          {Object.values(CompanyStatus).map(stat => (
                            <option key={stat} value={stat}>{stat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor={`value-${cat}`} className="block text-sm font-medium text-text-secondary">Valor da Operação em {cat} (R$)</label>
                        <input 
                          type="number" 
                          id={`value-${cat}`}
                          value={formData.categoryDetails[cat]?.operationValue || 0}
                          onChange={(e) => handleCategoryDetailChange(cat, 'operationValue', e.target.value)}
                          className="mt-1 block w-full bg-surface-card border-gray-600 rounded-md shadow-sm focus:ring-brand-light focus:border-brand-light sm:text-sm p-2"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text-secondary">Breve Descrição</label>
            <textarea name="description" id="description" rows={3} value={formData.description} onChange={handleChange} required className="mt-1 block w-full bg-surface-card border-gray-600 rounded-md shadow-sm focus:ring-brand-light focus:border-brand-light sm:text-sm p-2"></textarea>
          </div>
          <div className="pt-4 flex justify-end">
            <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg mr-2">Cancelar</button>
            <button type="submit" className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg">{companyToEdit ? 'Salvar Alterações' : 'Adicionar Empresa'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyModal;
