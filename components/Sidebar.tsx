
import React from 'react';
import { PawPrint, LayoutDashboard, List, UserPlus, LogOut, SettingsIcon } from './Icons';
import { View } from '../App';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  onLogout: () => void;
  companyName: string;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-colors duration-200 ease-in-out ${
        isActive
          ? 'bg-indigo-600 text-white'
          : 'text-gray-300 hover:bg-indigo-800 hover:text-white'
      }`}
    >
      {icon}
      <span className="ml-4 hidden md:inline">{label}</span>
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onLogout, companyName }) => {
  return (
    <div className="flex flex-col bg-indigo-900 text-white w-16 md:w-64 space-y-2 py-4 transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-center md:justify-start px-4 h-16 mb-4">
        <PawPrint className="w-10 h-10 text-white" />
        <span className="ml-3 text-xl font-bold hidden md:inline">{companyName}</span>
      </div>
      <nav className="flex-1">
        <NavItem
          icon={<LayoutDashboard className="w-6 h-6" />}
          label="Painel"
          isActive={currentView === 'dashboard'}
          onClick={() => setView('dashboard')}
        />
        <NavItem
          icon={<List className="w-6 h-6" />}
          label="Lista de Pets"
          isActive={currentView === 'pet-list'}
          onClick={() => setView('pet-list')}
        />
        <NavItem
          icon={<UserPlus className="w-6 h-6" />}
          label="Adicionar Pet"
          isActive={currentView === 'add-pet'}
          onClick={() => setView('add-pet')}
        />
      </nav>
      <div>
        <NavItem
            icon={<SettingsIcon className="w-6 h-6" />}
            label="Configurações"
            isActive={currentView === 'settings'}
            onClick={() => setView('settings')}
        />
        <button
          onClick={onLogout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-300 hover:bg-indigo-800 hover:text-white transition-colors duration-200 ease-in-out"
        >
          <LogOut className="w-6 h-6" />
          <span className="ml-4 hidden md:inline">Sair</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
