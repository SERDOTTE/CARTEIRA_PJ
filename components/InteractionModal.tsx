
import React, { useState } from 'react';
import { Company, Interaction } from '../types';
import { CloseIcon, SparklesIcon } from './icons';
import { summarizeInteractions } from '../services/geminiService';

interface InteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company;
  onAddInteraction: (companyId: string, interaction: Omit<Interaction, 'id'>) => void;
}

const InteractionModal: React.FC<InteractionModalProps> = ({ isOpen, onClose, company, onAddInteraction }) => {
  const [newInteraction, setNewInteraction] = useState({ contactDate: '', notes: '', followUpDate: '' });
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewInteraction(prev => ({ ...prev, [name]: value }));
  };

  const handleAddInteraction = (e: React.FormEvent) => {
    e.preventDefault();
    if (newInteraction.contactDate && newInteraction.notes && newInteraction.followUpDate) {
      onAddInteraction(company.id, newInteraction);
      setNewInteraction({ contactDate: '', notes: '', followUpDate: '' });
    }
  };
  
  const handleSummarize = async () => {
    setIsSummarizing(true);
    setSummary('');
    const result = await summarizeInteractions(company.interactions);
    setSummary(result);
    setIsSummarizing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-surface-modal rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-600">
          <h2 className="text-xl font-bold">Histórico de Interação: {company.name}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-500/50">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Summary Section */}
          <div>
            <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold text-text-primary">Resumo com IA</h3>
                <button 
                  onClick={handleSummarize} 
                  disabled={isSummarizing || company.interactions.length === 0}
                  className="flex items-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white font-semibold py-1 px-3 rounded-lg shadow-sm transition-all disabled:bg-gray-500 disabled:cursor-not-allowed">
                  <SparklesIcon className="w-5 h-5"/>
                  {isSummarizing ? 'Gerando...' : 'Gerar Resumo'}
                </button>
            </div>
            {isSummarizing && <div className="mt-2 text-text-secondary">Analisando interações...</div>}
            {summary && <div className="mt-2 p-3 bg-surface-card rounded-lg whitespace-pre-wrap font-mono text-sm">{summary}</div>}
          </div>

          {/* Interaction History */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">Histórico</h3>
            {company.interactions.length > 0 ? (
              <div className="space-y-3">
                {[...company.interactions].reverse().map(interaction => (
                  <div key={interaction.id} className="bg-surface-card p-3 rounded-lg">
                    <p className="text-sm text-text-secondary">
                      <strong>Contato:</strong> {interaction.contactDate} | <strong>Acompanhamento:</strong> {interaction.followUpDate}
                    </p>
                    <p className="mt-1">{interaction.notes}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-secondary">Nenhuma interação registrada.</p>
            )}
          </div>
          
          {/* Add New Interaction Form */}
          <form onSubmit={handleAddInteraction} className="p-4 border-t border-gray-600 space-y-3">
            <h3 className="text-lg font-semibold">Adicionar Nova Interação</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-text-secondary">Data do Contato</label>
                    <input type="date" name="contactDate" value={newInteraction.contactDate} onChange={handleInputChange} required className="mt-1 w-full bg-surface-card p-2 rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary">Data de Acompanhamento</label>
                    <input type="date" name="followUpDate" value={newInteraction.followUpDate} onChange={handleInputChange} required className="mt-1 w-full bg-surface-card p-2 rounded-md" />
                </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary">O que foi falado?</label>
              <textarea name="notes" value={newInteraction.notes} onChange={handleInputChange} rows={3} required className="mt-1 w-full bg-surface-card p-2 rounded-md"></textarea>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="bg-brand-light hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg">Adicionar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InteractionModal;
