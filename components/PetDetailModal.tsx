
import React from 'react';
import { Pet, Vaccines } from '../types';
import { Edit, DollarSign } from './Icons';

interface PetDetailModalProps {
  pet: Pet;
  onClose: () => void;
  onEdit: (pet: Pet) => void;
  onShowHistory: (pet: Pet) => void;
  onRegisterPayment: (petId: string) => void;
}

const vaccineLabels: Record<keyof Vaccines, string> = {
  raiva: 'Raiva',
  v10: 'V10/V8',
  gripe: 'Gripe',
  v5: 'V5/V4',
  leishmaniose: 'Leishmaniose',
};

const InfoRow: React.FC<{ label: string; value: string | number | React.ReactNode }> = ({ label, value }) => (
    <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value}</dd>
    </div>
);


const PetDetailModal: React.FC<PetDetailModalProps> = ({ pet, onClose, onEdit, onShowHistory, onRegisterPayment }) => {
  const activeVaccines = Object.entries(pet.healthInfo.vaccinations)
    .filter(([, status]) => status)
    .map(([vaccine]) => vaccine as keyof Vaccines);

  const today = new Date().toISOString().split('T')[0];
  const isOverdue = pet.paymentType === 'mensal' && pet.dueDate && pet.dueDate < today;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold text-indigo-800">Ficha Cadastral de {pet.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <img src={pet.photoUrl} alt={pet.name} className="w-40 h-40 rounded-full object-cover border-4 border-indigo-200" />
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Informações do Pet</h3>
                     <dl>
                        <InfoRow label="Nome" value={pet.name} />
                        <InfoRow label="Espécie" value={pet.species} />
                        <InfoRow label="Raça" value={pet.breed} />
                        <InfoRow label="Idade" value={`${pet.age} anos`} />
                        <InfoRow label="Sexo" value={pet.gender} />
                     </dl>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Informações do Dono</h3>
                <dl>
                    <InfoRow label="Nome" value={pet.owner.name} />
                    <InfoRow label="Telefone" value={pet.owner.phone} />
                    <InfoRow label="Email" value={pet.owner.email} />
                    <InfoRow label="Endereço" value={pet.owner.address} />
                </dl>
            </div>
            
             <div>
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Informações de Pagamento</h3>
                <dl>
                    <InfoRow label="Tipo de Plano" value={pet.paymentType === 'mensal' ? 'Mensal' : 'Diária'} />
                    {pet.paymentType === 'mensal' ? (
                        <>
                            <InfoRow label="Valor Mensal" value={`R$ ${pet.monthlyFee?.toFixed(2)}`} />
                            <InfoRow 
                                label="Próximo Vencimento" 
                                value={
                                    <span className={isOverdue ? 'font-bold text-red-600' : ''}>
                                        {pet.dueDate ? new Date(pet.dueDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'N/A'}
                                        {isOverdue && ' (Vencido)'}
                                    </span>
                                } 
                            />
                        </>
                    ) : (
                        <InfoRow label="Valor da Diária" value={`R$ ${pet.dailyRate?.toFixed(2)}`} />
                    )}
                </dl>
            </div>

            <div>
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Saúde e Cuidados</h3>
                <dl>
                    <InfoRow 
                      label="Vacinas em Dia" 
                      value={
                        activeVaccines.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {activeVaccines.map(vaccine => (
                              <span key={vaccine} className="px-2.5 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                                {vaccineLabels[vaccine]}
                              </span>
                            ))}
                          </div>
                        ) : (
                          'Nenhuma vacina registrada.'
                        )
                      } 
                    />
                    <InfoRow label="Alergias" value={pet.healthInfo.allergies || 'Nenhuma'} />
                    <InfoRow label="Medicamentos" value={pet.healthInfo.medications || 'Nenhum'} />
                    <InfoRow label="Veterinário" value={pet.healthInfo.vetName ? `${pet.healthInfo.vetName} (${pet.healthInfo.vetPhone})` : 'Não informado'} />
                    <InfoRow label="Instruções de Alimentação" value={pet.feedingInstructions} />
                    <InfoRow label="Notas de Comportamento" value={pet.behaviorNotes} />
                </dl>
            </div>
        </div>
        
        <div className="flex justify-between items-center p-4 border-t bg-gray-50 rounded-b-lg space-x-3">
          <div>
            {pet.paymentType === 'mensal' && (
                <button
                    onClick={() => {
                        onRegisterPayment(pet.id);
                        onClose();
                    }}
                    className="flex items-center px-6 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 transition"
                >
                    <DollarSign className="w-4 h-4 mr-2" /> Registrar Pagamento
                </button>
            )}
          </div>
          <div className="flex space-x-3">
             <button
                onClick={() => {
                    onShowHistory(pet);
                    onClose();
                }}
                className="px-6 py-2 rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 transition"
              >
                Histórico de Presença
              </button>
               <button
                onClick={() => {
                    onEdit(pet);
                    onClose();
                }}
                className="flex items-center px-6 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition"
              >
                <Edit className="w-4 h-4 mr-2" /> Editar
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetailModal;
