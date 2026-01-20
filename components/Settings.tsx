
import React, { useState } from 'react';
import { ReminderSettings } from '../types';

interface SettingsProps {
  companyName: string;
  setCompanyName: (name: string) => void;
  reminderSettings: ReminderSettings;
  setReminderSettings: (settings: ReminderSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ companyName, setCompanyName, reminderSettings, setReminderSettings }) => {
  const [name, setName] = useState(companyName);
  const [localReminderSettings, setLocalReminderSettings] = useState(reminderSettings);
  const [isSaved, setIsSaved] = useState(false);

  const handleToggleReminders = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const isEnabled = e.target.checked;
    
    if (isEnabled) {
      if (Notification.permission === 'granted') {
        setLocalReminderSettings(prev => ({ ...prev, enabled: true }));
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setLocalReminderSettings(prev => ({ ...prev, enabled: true }));
        } else {
          alert('Permissão para notificações negada. Você não receberá lembretes.');
        }
      } else {
        alert('As notificações estão bloqueadas no seu navegador. Para habilitar, por favor, altere as configurações do site nas configurações do seu navegador.');
      }
    } else {
      setLocalReminderSettings(prev => ({ ...prev, enabled: false }));
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalReminderSettings(prev => ({ ...prev, time: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCompanyName(name);
    setReminderSettings(localReminderSettings);
    setIsSaved(true);
    setTimeout(() => {
        setIsSaved(false);
    }, 2000); // Hide message after 2 seconds
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <form onSubmit={handleSubmit}>
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-3 mb-4">
              Personalizar Aplicativo
            </h3>
            <div className="space-y-6">
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
            </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-3 mb-4">
              Lembretes Diários
            </h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <label htmlFor="enableReminders" className="font-medium text-gray-700">
                            Ativar lembretes
                        </label>
                        <p className="text-sm text-gray-500">Receba uma notificação para preencher resumos diários.</p>
                    </div>
                    <label htmlFor="enableReminders" className="flex items-center cursor-pointer">
                        <div className="relative">
                            <input
                                type="checkbox"
                                id="enableReminders"
                                className="sr-only"
                                checked={localReminderSettings.enabled}
                                onChange={handleToggleReminders}
                            />
                            <div className="block bg-gray-200 w-14 h-8 rounded-full"></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${localReminderSettings.enabled ? 'transform translate-x-full bg-indigo-600' : ''}`}></div>
                        </div>
                    </label>
                </div>
                {localReminderSettings.enabled && (
                    <div>
                        <label htmlFor="reminderTime" className="block text-sm font-medium text-gray-600 mb-1">
                            Horário do lembrete
                        </label>
                        <input
                            type="time"
                            id="reminderTime"
                            value={localReminderSettings.time}
                            onChange={handleTimeChange}
                            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                )}
            </div>
        </div>
        
        <div className="flex items-center justify-end space-x-4 mt-6">
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
  );
};

export default Settings;
