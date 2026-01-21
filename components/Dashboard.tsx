
import React from 'react';
import { Pet } from '../types';
import { Edit, Share, DollarSign, AlertCircle } from './Icons';
import { getPaymentStatus } from '../utils/paymentUtils';

interface DashboardProps {
  pets: Pet[];
  onToggleCheckIn: (petId: string) => void;
  onEditPet: (pet: Pet) => void;
  onShare: (pet: Pet) => void;
  onShowPaymentModal: (pet: Pet) => void;
  totalSlots: number;
  setTotalSlots: (slots: number) => void;
}

const PetCard: React.FC<{ pet: Pet; onToggleCheckIn: (petId: string) => void; onEditPet: (pet: Pet) => void; onShare: (pet: Pet) => void; onShowPaymentModal: (pet: Pet) => void; }> = ({ pet, onToggleCheckIn, onEditPet, onShare, onShowPaymentModal }) => {
  const paymentStatus = getPaymentStatus(pet);
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col">
      <div className="flex items-start p-4">
        <img
          className="w-24 h-24 rounded-full object-cover mr-4 border-4 border-slate-200"
          src={pet.photoUrl}
          alt={pet.name}
        />
        <div className="flex-1">
          <h3 className="text-xl font-bold text-indigo-800">{pet.name}</h3>
          <p className="text-gray-600">{pet.breed}</p>
          <p className="text-sm text-gray-500">Dono(a): {pet.owner.name}</p>
          <div className="mt-2">
            <span className={`py-1 px-2.5 rounded-full text-xs font-semibold ${paymentStatus.color}`}>
              {paymentStatus.text}
            </span>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
            <button onClick={() => onEditPet(pet)} className="text-gray-400 hover:text-indigo-600 p-2" aria-label="Editar Pet">
                <Edit className="w-5 h-5"/>
            </button>
            {pet.isCheckedIn && (
                 <button onClick={() => onShare(pet)} className="text-gray-400 hover:text-green-600 p-2" aria-label="Compartilhar Resumo">
                    <Share className="w-5 h-5"/>
                </button>
            )}
        </div>
      </div>
      <div className="px-4 pb-4 mt-auto space-y-2">
        {paymentStatus.isDailyPending && (
           <button
             onClick={() => onShowPaymentModal(pet)}
             className="w-full flex items-center justify-center py-2 px-4 rounded-lg font-semibold text-white transition-colors duration-200 bg-green-500 hover:bg-green-600"
            >
              <DollarSign className="w-4 h-4 mr-2" /> Registrar Diária
            </button>
        )}
        <button
          onClick={() => onToggleCheckIn(pet.id)}
          className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition-colors duration-200 ${
            pet.isCheckedIn ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {pet.isCheckedIn ? 'Realizar Check-out' : 'Realizar Check-in'}
        </button>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ pets, onToggleCheckIn, onEditPet, onShare, onShowPaymentModal, totalSlots, setTotalSlots }) => {
  const checkedInPets = pets.filter(pet => pet.isCheckedIn);
  const checkedOutPets = pets.filter(pet => !pet.isCheckedIn);
  const overduePayments = pets.filter(pet => getPaymentStatus(pet).isOverdue).length;

  const stats = [
    { label: 'Total de Pets', value: pets.length, color: 'bg-blue-500', icon: null },
    { label: 'Presentes Hoje', value: checkedInPets.length, color: 'bg-green-500', icon: null },
    { label: 'Pagamentos em Atraso', value: overduePayments, color: 'bg-red-500', icon: <AlertCircle className="w-8 h-8 opacity-75" /> },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => (
          <div key={stat.label} className={`p-6 rounded-xl text-white shadow-lg ${stat.color}`}>
             <div className="flex justify-between items-center">
                <div>
                    <p className="text-lg font-medium">{stat.label}</p>
                    <p className="text-4xl font-bold">{stat.value}</p>
                </div>
                {stat.icon}
            </div>
          </div>
        ))}
        <div className="p-6 rounded-xl text-white shadow-lg bg-yellow-500">
            <label htmlFor="total-slots" className="text-lg font-medium">Vagas Disponíveis</label>
            <p className="text-4xl font-bold">{Math.max(0, totalSlots - checkedInPets.length)}</p>
             <div className="mt-2">
                <label htmlFor="total-slots-input" className="text-sm">Total de Vagas:</label>
                <input
                    id="total-slots-input"
                    type="number"
                    value={totalSlots}
                    onChange={(e) => setTotalSlots(Number(e.target.value))}
                    className="w-20 ml-2 p-1 rounded bg-yellow-400 text-white text-center font-bold"
                />
            </div>
        </div>
      </div>
      
      {/* Checked-in Pets */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Pets Presentes no Hotel</h2>
        {checkedInPets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {checkedInPets.map(pet => (
              <PetCard key={pet.id} pet={pet} onToggleCheckIn={onToggleCheckIn} onEditPet={onEditPet} onShare={onShare} onShowPaymentModal={onShowPaymentModal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">Nenhum pet fez check-in hoje.</p>
          </div>
        )}
      </div>

      {/* Checked-out Pets */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Pets com Check-out (Aguardando Check-in)</h2>
        {checkedOutPets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {checkedOutPets.map(pet => (
              <PetCard key={pet.id} pet={pet} onToggleCheckIn={onToggleCheckIn} onEditPet={onEditPet} onShare={onShare} onShowPaymentModal={onShowPaymentModal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">Todos os pets cadastrados estão presentes.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
