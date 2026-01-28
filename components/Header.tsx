import React from 'react';
import { PlusIcon, DashboardIcon, BoardIcon } from './icons';
import { View } from '../App';

interface HeaderProps {
  
  onAddCompany: () => void;
  currentView: View;
  onSetView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ onAddCompany, currentView, onSetView }) => {
  const navButtonClasses = (view: View) => 
    `flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      currentView === view 
        ? 'bg-brand-primary text-white' 
        : 'text-text-secondary hover:bg-surface-modal hover:text-text-primary'
    }`;

  return (
    <header className="bg-surface-card shadow-md sticky top-0 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
              CRM
            </h1>
            <nav className="flex items-center gap-2 bg-surface-main p-1 rounded-lg">
              <button onClick={() => onSetView('dashboard')} className={navButtonClasses('dashboard')}>
                <DashboardIcon className="w-5 h-5"/>
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              <button onClick={() => onSetView('board')} className={navButtonClasses('board')}>
                <BoardIcon className="w-5 h-5"/>
                <span className="hidden sm:inline">Quadro</span>
              </button>
            </nav>
          </div>
          <button
            onClick={onAddCompany}
            className="flex items-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-light focus:ring-offset-surface-main"
          >
            <PlusIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Nova Empresa</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;