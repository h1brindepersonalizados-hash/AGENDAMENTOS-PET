
import React, { useState, useCallback } from 'react';
import { Pet } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PetList from './components/PetList';
import PetForm from './components/PetForm';
import { petData } from './data/mockData';
import Header from './components/Header';
import usePersistentState from './hooks/usePersistentState';
import ShareModal from './components/ShareModal';
import Settings from './components/Settings';

export type View = 'dashboard' | 'pet-list' | 'add-pet' | 'edit-pet' | 'settings';

interface AppProps {
  onLogout: () => void;
}

const App: React.FC<AppProps> = ({ onLogout }) => {
  const [pets, setPets] = usePersistentState<Pet[]>('pets', petData);
  const [totalSlots, setTotalSlots] = usePersistentState<number>('totalSlots', 20);
  const [companyName, setCompanyName] = usePersistentState<string>('companyName', 'Pet Hotel');
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [petToShare, setPetToShare] = useState<Pet | null>(null);

  const handleSetView = useCallback((view: View) => {
    setSelectedPet(null);
    setCurrentView(view);
  }, []);

  const handleAddPet = (pet: Omit<Pet, 'id'>) => {
    const newPet: Pet = {
      ...pet,
      id: `pet-${Date.now()}`,
      dailySummaryNotes: '',
    };
    setPets(prevPets => [newPet, ...prevPets]);
    setCurrentView('pet-list');
  };

  const handleUpdatePet = (updatedPet: Pet) => {
    setPets(prevPets =>
      prevPets.map(pet => (pet.id === updatedPet.id ? updatedPet : pet))
    );
    setCurrentView('pet-list');
    setSelectedPet(null);
  };
  
  const handleEditPet = (pet: Pet) => {
    setSelectedPet(pet);
    setCurrentView('edit-pet');
  };

  const handleToggleCheckIn = (petId: string) => {
    setPets(prevPets =>
      prevPets.map(pet =>
        pet.id === petId ? { ...pet, isCheckedIn: !pet.isCheckedIn, dailySummaryNotes: '' } : pet // Reset notes on check-in/out
      )
    );
  };
  
  const handleUpdateDailyNotes = (petId: string, notes: string) => {
    setPets(prevPets =>
      prevPets.map(pet => (pet.id === petId ? { ...pet, dailySummaryNotes: notes } : pet))
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard pets={pets} onToggleCheckIn={handleToggleCheckIn} onEditPet={handleEditPet} totalSlots={totalSlots} setTotalSlots={setTotalSlots} onShare={setPetToShare} />;
      case 'pet-list':
        return <PetList pets={pets} onEditPet={handleEditPet} />;
      case 'add-pet':
        return <PetForm onSubmit={handleAddPet} onCancel={() => handleSetView('pet-list')} />;
      case 'edit-pet':
        return selectedPet ? <PetForm petToEdit={selectedPet} onSubmit={handleUpdatePet} onCancel={() => handleSetView('pet-list')} /> : <PetList pets={pets} onEditPet={handleEditPet} />;
      case 'settings':
        return <Settings companyName={companyName} setCompanyName={setCompanyName} />;
      default:
        return <Dashboard pets={pets} onToggleCheckIn={handleToggleCheckIn} onEditPet={handleEditPet} totalSlots={totalSlots} setTotalSlots={setTotalSlots} onShare={setPetToShare} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      <Sidebar currentView={currentView} setView={handleSetView} onLogout={onLogout} companyName={companyName} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentView={currentView} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
      {petToShare && <ShareModal pet={petToShare} onUpdateNotes={handleUpdateDailyNotes} onClose={() => setPetToShare(null)} companyName={companyName} />}
    </div>
  );
};

export default App;
