
import React from 'react';
import { View } from '../App';

interface HeaderProps {
    currentView: View;
}

const viewTitles: Record<View, string> = {
    'dashboard': 'Painel de Controle',
    'pet-list': 'Lista de Pets Cadastrados',
    'add-pet': 'Adicionar Novo Pet',
    'edit-pet': 'Editar Ficha do Pet',
    'settings': 'Configurações da Empresa',
};

const Header: React.FC<HeaderProps> = ({ currentView }) => {
    return (
        <header className="bg-white shadow-sm p-4">
            <h1 className="text-2xl font-semibold text-gray-800">{viewTitles[currentView]}</h1>
        </header>
    );
};

export default Header;
