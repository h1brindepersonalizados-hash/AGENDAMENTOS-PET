
import React, { useState, useCallback, useEffect } from 'react';
import { Pet, ReminderSettings, PaymentRecord } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PetList from './components/PetList';
import PetForm from './components/PetForm';
import { petData } from './data/mockData';
import Header from './components/Header';
import usePersistentState from './hooks/usePersistentState';
import ShareModal from './components/ShareModal';
import Settings from './components/Settings';
import AttendanceHistoryModal from './components/AttendanceHistoryModal';
import PetDetailModal from './components/PetDetailModal';


export type View = 'dashboard' | 'pet-list' | 'add-pet' | 'edit-pet' | 'settings';

interface AppProps {
  currentUser: string;
  onLogout: () => void;
}

const App: React.FC<AppProps> = ({ currentUser, onLogout }) => {
  // User-specific data using dynamic keys for localStorage
  const [pets, setPets] = usePersistentState<Pet[]>(`pets_${currentUser}`, petData);
  const [totalSlots, setTotalSlots] = usePersistentState<number>(`totalSlots_${currentUser}`, 20);
  const [companyName, setCompanyName] = usePersistentState<string>(`companyName_${currentUser}`, 'Pet Hotel');
  const [reminderSettings, setReminderSettings] = usePersistentState<ReminderSettings>(`reminderSettings_${currentUser}`, { enabled: false, time: '17:00' });
  const [lastNotificationDate, setLastNotificationDate] = usePersistentState<string | null>(`lastNotificationDate_${currentUser}`, null);

  
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [petToEdit, setPetToEdit] = useState<Pet | null>(null);
  const [petToShare, setPetToShare] = useState<Pet | null>(null);
  const [petForHistory, setPetForHistory] = useState<Pet | null>(null);
  const [petForDetails, setPetForDetails] = useState<Pet | null>(null);


  // Reminder logic
  useEffect(() => {
    if (!reminderSettings.enabled || Notification.permission !== 'granted') {
      return;
    }

    const intervalId = setInterval(() => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const today = now.toISOString().split('T')[0];

      // Reset notification status for a new day
      if (lastNotificationDate && lastNotificationDate !== today) {
        setLastNotificationDate(null);
      }
      
      // Check if it's reminder time and notification hasn't been sent today
      if (currentTime === reminderSettings.time && lastNotificationDate !== today) {
        const petsToUpdate = pets.filter(p => p.isCheckedIn && !p.dailySummaryNotes);

        if (petsToUpdate.length > 0) {
          new Notification('Lembrete do Pet Hotel!', {
            body: `Você tem ${petsToUpdate.length} pet(s) precisando de uma atualização no resumo diário. 🐾`,
            icon: '/favicon.svg'
          });
          setLastNotificationDate(today); // Mark as sent for today
        }
      }

    }, 60000); // Check every 60 seconds

    return () => clearInterval(intervalId);
  }, [reminderSettings, pets, lastNotificationDate, setLastNotificationDate]);


  const handleSetView = useCallback((view: View) => {
    setPetToEdit(null);
    setCurrentView(view);
  }, []);

  const handleAddPet = (pet: Omit<Pet, 'id'>) => {
    const newPet: Pet = {
      ...pet,
      id: `pet-${Date.now()}`,
      dailySummaryNotes: '',
      attendance: [],
      paymentHistory: [],
    };
    setPets(prevPets => [newPet, ...prevPets]);
    setCurrentView('pet-list');
  };

  const handleUpdatePet = (updatedPet: Pet) => {
    setPets(prevPets =>
      prevPets.map(pet => (pet.id === updatedPet.id ? updatedPet : pet))
    );
    setCurrentView('pet-list');
    setPetToEdit(null);
  };
  
  const handleEditPet = (pet: Pet) => {
    setPetToEdit(pet);
    setCurrentView('edit-pet');
  };

  const handleToggleCheckIn = (petId: string) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    setPets(prevPets =>
      prevPets.map(pet => {
        if (pet.id !== petId) return pet;

        const isCheckingIn = !pet.isCheckedIn;
        const newStatus = isCheckingIn ? 'present' : 'absent';
        
        // Update attendance record for today
        const otherDaysAttendance = pet.attendance.filter(a => a.date !== today);
        const updatedAttendance = [...otherDaysAttendance, { date: today, status: newStatus }];

        return { 
          ...pet, 
          isCheckedIn: isCheckingIn, 
          dailySummaryNotes: '',
          attendance: updatedAttendance,
        };
      })
    );
  };
  
  const handleUpdateDailyNotes = (petId: string, notes: string) => {
    setPets(prevPets =>
      prevPets.map(pet => (pet.id === petId ? { ...pet, dailySummaryNotes: notes } : pet))
    );
  };

  const handleRegisterPayment = (petId: string) => {
    setPets(prevPets =>
        prevPets.map(pet => {
            if (pet.id === petId && pet.paymentType === 'mensal' && pet.dueDate) {
                const today = new Date().toISOString().split('T')[0];
                const paymentRecord: PaymentRecord = {
                  date: today,
                  amount: pet.monthlyFee || 0,
                  type: 'mensal',
                };

                const currentDueDate = new Date(pet.dueDate + 'T00:00:00'); 
                const newDueDate = new Date(currentDueDate.setMonth(currentDueDate.getMonth() + 1));
                
                return {
                    ...pet,
                    dueDate: newDueDate.toISOString().split('T')[0],
                    paymentHistory: [...pet.paymentHistory, paymentRecord],
                };
            }
            return pet;
        })
    );
  };

  const handleRegisterDailyPayment = (petId: string) => {
    setPets(prevPets => 
      prevPets.map(pet => {
        if (pet.id === petId && pet.paymentType === 'diaria') {
            const today = new Date().toISOString().split('T')[0];

            // Avoid duplicate payment for the same day
            const hasPaidToday = pet.paymentHistory.some(p => p.date === today && p.type === 'diaria');
            if (hasPaidToday) return pet;
            
            const paymentRecord: PaymentRecord = {
              date: today,
              amount: pet.dailyRate || 0,
              type: 'diaria',
            };

            return {
              ...pet,
              paymentHistory: [...pet.paymentHistory, paymentRecord],
            };
        }
        return pet;
      })
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard pets={pets} onToggleCheckIn={handleToggleCheckIn} onEditPet={handleEditPet} totalSlots={totalSlots} setTotalSlots={setTotalSlots} onShare={setPetToShare} onRegisterDailyPayment={handleRegisterDailyPayment} />;
      case 'pet-list':
        return <PetList pets={pets} onEditPet={handleEditPet} onShowHistory={setPetForHistory} onViewDetails={setPetForDetails} />;
      case 'add-pet':
        return <PetForm onSubmit={handleAddPet} onCancel={() => handleSetView('pet-list')} />;
      case 'edit-pet':
        return petToEdit ? <PetForm petToEdit={petToEdit} onSubmit={handleUpdatePet} onCancel={() => handleSetView('pet-list')} /> : <PetList pets={pets} onEditPet={handleEditPet} onShowHistory={setPetForHistory} onViewDetails={setPetForDetails}/>;
      case 'settings':
        return <Settings companyName={companyName} setCompanyName={setCompanyName} reminderSettings={reminderSettings} setReminderSettings={setReminderSettings} />;
      default:
        return <Dashboard pets={pets} onToggleCheckIn={handleToggleCheckIn} onEditPet={handleEditPet} totalSlots={totalSlots} setTotalSlots={setTotalSlots} onShare={setPetToShare} onRegisterDailyPayment={handleRegisterDailyPayment} />;
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
      {petForHistory && <AttendanceHistoryModal pet={petForHistory} onClose={() => setPetForHistory(null)} />}
      {petForDetails && <PetDetailModal pet={petForDetails} onClose={() => setPetForDetails(null)} onEdit={handleEditPet} onShowHistory={setPetForHistory} onRegisterPayment={handleRegisterPayment} onRegisterDailyPayment={handleRegisterDailyPayment} />}
    </div>
  );
};

export default App;
