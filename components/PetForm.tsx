
import React, { useState, useRef } from 'react';
import { Pet, Vaccines } from '../types';
import { PawPrint } from './Icons';

interface PetFormProps {
  petToEdit?: Pet;
  onSubmit: (pet: Pet | Omit<Pet, 'id'>) => void;
  onCancel: () => void;
}

const initialFormData: Omit<Pet, 'id'> = {
  name: '',
  species: 'Cachorro',
  breed: '',
  age: 0,
  gender: 'Macho',
  photoUrl: '',
  owner: { name: '', phone: '', email: '', address: '' },
  healthInfo: { 
    vaccinations: { raiva: false, v10: false, gripe: false, v5: false, leishmaniose: false },
    allergies: '', 
    medications: '', 
    vetName: '', 
    vetPhone: '' 
  },
  behaviorNotes: '',
  feedingInstructions: '',
  isCheckedIn: false,
  dailySummaryNotes: '',
};

const vaccineOptions: { [key in keyof Vaccines]: { label: string; species: ('Cachorro' | 'Gato')[] } } = {
  raiva: { label: 'Raiva', species: ['Cachorro', 'Gato'] },
  v10: { label: 'V10/V8', species: ['Cachorro'] },
  gripe: { label: 'Gripe', species: ['Cachorro'] },
  leishmaniose: { label: 'Leishmaniose', species: ['Cachorro'] },
  v5: { label: 'V5/V4', species: ['Gato'] },
};


const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h3 className="text-lg font-semibold text-gray-700 border-b pb-3 mb-4">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {children}
    </div>
  </div>
);

const InputField: React.FC<{ label: string; name: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void; type?: string; required?: boolean; as?: 'textarea' | 'select'; children?: React.ReactNode; className?: string }> = ({ label, name, value, onChange, type = 'text', required = false, as, children, className }) => (
  <div className={className}>
    <label htmlFor={name} className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    {as === 'textarea' ? (
      <textarea id={name} name={name} value={value} onChange={onChange} required={required} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
    ) : as === 'select' ? (
       <select id={name} name={name} value={value} onChange={onChange} required={required} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white">
        {children}
      </select>
    ) : (
      <input type={type} id={name} name={name} value={value} onChange={onChange} required={required} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
    )}
  </div>
);

const PetForm: React.FC<PetFormProps> = ({ petToEdit, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(petToEdit || initialFormData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');

    if (field) { // Nested object
      setFormData(prev => ({
        ...prev,
        [section]: {
          // @ts-ignore
          ...prev[section],
          [field]: value,
        },
      }));
    } else { // Top-level field
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({...prev, photoUrl: reader.result as string}));
      }
      reader.readAsDataURL(file);
    }
  }

  const handleVaccineChange = (vaccine: keyof Vaccines) => {
    setFormData(prev => ({
      ...prev,
      healthInfo: {
        ...prev.healthInfo,
        vaccinations: {
          ...prev.healthInfo.vaccinations,
          [vaccine]: !prev.healthInfo.vaccinations[vaccine]
        }
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  const currentVaccineOptions = Object.entries(vaccineOptions).filter(([, options]) => options.species.includes(formData.species));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormSection title="Informações do Pet">
        <InputField label="Nome do Pet" name="name" value={formData.name} onChange={handleChange} required />
        <div className="flex items-center space-x-4">
          {formData.photoUrl ? (
            <img src={formData.photoUrl} alt="Pré-visualização do pet" className="w-24 h-24 rounded-full object-cover"/>
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
              <PawPrint className="w-10 h-10 text-gray-400"/>
            </div>
          )}
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 font-semibold">
            Carregar Foto
          </button>
        </div>
        <InputField label="Espécie" name="species" value={formData.species} onChange={handleChange} as="select">
            <option>Cachorro</option>
            <option>Gato</option>
        </InputField>
        <InputField label="Raça" name="breed" value={formData.breed} onChange={handleChange} required />
        <InputField label="Idade (anos)" name="age" value={formData.age} onChange={handleChange} type="number" required />
         <InputField label="Sexo" name="gender" value={formData.gender} onChange={handleChange} as="select">
            <option>Macho</option>
            <option>Fêmea</option>
        </InputField>
      </FormSection>

      <FormSection title="Informações do Dono">
        <InputField label="Nome do Dono" name="owner.name" value={formData.owner.name} onChange={handleChange} required />
        <InputField label="Telefone" name="owner.phone" value={formData.owner.phone} onChange={handleChange} required />
        <InputField label="Email" name="owner.email" value={formData.owner.email} onChange={handleChange} type="email" />
        <InputField label="Endereço" name="owner.address" value={formData.owner.address} onChange={handleChange} />
      </FormSection>

      <FormSection title="Saúde e Cuidados">
         <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-2">Vacinas em dia</label>
            <div className="flex flex-wrap gap-2">
              {currentVaccineOptions.map(([key, {label}]) => (
                <button 
                  key={key} 
                  type="button"
                  onClick={() => handleVaccineChange(key as keyof Vaccines)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    formData.healthInfo.vaccinations[key as keyof Vaccines]
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
         </div>
        <InputField label="Alergias" name="healthInfo.allergies" value={formData.healthInfo.allergies} onChange={handleChange} as="textarea" className="md:col-span-2" />
        <InputField label="Medicamentos" name="healthInfo.medications" value={formData.healthInfo.medications} onChange={handleChange} as="textarea" className="md:col-span-2" />
        <InputField label="Nome do Veterinário" name="healthInfo.vetName" value={formData.healthInfo.vetName} onChange={handleChange} />
        <InputField label="Telefone do Veterinário" name="healthInfo.vetPhone" value={formData.healthInfo.vetPhone} onChange={handleChange} />
      </FormSection>

      <FormSection title="Instruções Adicionais">
        <InputField label="Instruções de Alimentação" name="feedingInstructions" value={formData.feedingInstructions} onChange={handleChange} as="textarea" className="md:col-span-2" />
        <InputField label="Notas de Comportamento" name="behaviorNotes" value={formData.behaviorNotes} onChange={handleChange} as="textarea" className="md:col-span-2" />
      </FormSection>

      <div className="flex justify-end space-x-4 pt-4">
        <button type="button" onClick={onCancel} className="px-6 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition">
          Cancelar
        </button>
        <button type="submit" className="px-6 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition">
          {petToEdit ? 'Salvar Alterações' : 'Cadastrar Pet'}
        </button>
      </div>
    </form>
  );
};

export default PetForm;
