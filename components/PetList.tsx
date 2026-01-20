
import React, { useState } from 'react';
import { Pet } from '../types';
import PetDetailModal from './PetDetailModal';
import { Edit } from './Icons';

interface PetListProps {
  pets: Pet[];
  onEditPet: (pet: Pet) => void;
}

const PetList: React.FC<PetListProps> = ({ pets, onEditPet }) => {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  const handleViewDetails = (pet: Pet) => {
    setSelectedPet(pet);
  };

  const handleCloseModal = () => {
    setSelectedPet(null);
  };

  return (
    <>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <tr>
                <th className="py-3 px-6 text-left">Pet</th>
                <th className="py-3 px-6 text-left">Dono(a)</th>
                <th className="py-3 px-6 text-center">Espécie / Raça</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm font-light">
              {pets.map(pet => (
                <tr key={pet.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="w-10 h-10 rounded-full object-cover mr-4" src={pet.photoUrl} alt={pet.name} />
                      <span className="font-medium">{pet.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span>{pet.owner.name}</span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span>{pet.species} / {pet.breed}</span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span className={`py-1 px-3 rounded-full text-xs font-semibold ${
                      pet.isCheckedIn
                        ? 'bg-green-200 text-green-700'
                        : 'bg-yellow-200 text-yellow-700'
                    }`}>
                      {pet.isCheckedIn ? 'Presente' : 'Ausente'}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center space-x-4">
                      <button
                        onClick={() => handleViewDetails(pet)}
                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                      >
                        Ver Ficha
                      </button>
                      <button
                        onClick={() => onEditPet(pet)}
                        className="text-gray-400 hover:text-gray-700"
                      >
                       <Edit className="w-5 h-5"/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedPet && (
        <PetDetailModal pet={selectedPet} onClose={handleCloseModal} onEdit={onEditPet} />
      )}
    </>
  );
};

export default PetList;
