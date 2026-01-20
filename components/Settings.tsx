
import React, { useState } from 'react';

interface SettingsProps {
  companyName: string;
  setCompanyName: (name: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ companyName, setCompanyName }) => {
  const [name, setName] = useState(companyName);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCompanyName(name);
    setIsSaved(true);
    setTimeout(() => {
        setIsSaved(false);
    }, 2000); // Hide message after 2 seconds
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-3 mb-4">
          Personalizar Aplicativo
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-600 mb-1">
              Nome da Empresa
            </label>
            <input
              type="text"
              id="companyName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ex: Meu Pet Hotel Feliz"
            />
          </div>
          <div className="flex items-center justify-end space-x-4">
            {isSaved && (
              <p className="text-sm font-semibold text-green-600">
                Salvo com sucesso!
              </p>
            )}
            <button
              type="submit"
              className="px-6 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
