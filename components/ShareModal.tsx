
import React, { useState } from 'react';
import { Pet } from '../types';
import { Share } from './Icons';

interface ShareModalProps {
    pet: Pet;
    onClose: () => void;
    onUpdateNotes: (petId: string, notes: string) => void;
    companyName: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ pet, onClose, onUpdateNotes, companyName }) => {
    const [notes, setNotes] = useState(pet.dailySummaryNotes || '');
    const [isShared, setIsShared] = useState(false);

    const handleShare = async () => {
        onUpdateNotes(pet.id, notes); // Save notes before sharing

        const summaryText = `
Resumo do dia de ${pet.name} no ${companyName}! 🐾

${notes}

---
Ficha Rápida:
- Alimentação: ${pet.feedingInstructions}
- Comportamento Geral: ${pet.behaviorNotes}

Qualquer dúvida, estamos à disposição!
Equipe ${companyName}.
        `.trim();

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Resumo do dia de ${pet.name}`,
                    text: summaryText,
                });
                setIsShared(true);
                setTimeout(() => {
                    onClose();
                }, 1500); // Close modal after a delay
            } catch (error) {
                console.error('Erro ao compartilhar:', error);
                alert('O compartilhamento foi cancelado ou falhou.');
            }
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(summaryText);
            alert('Resumo copiado para a área de transferência! O compartilhamento nativo não é suportado neste navegador.');
        }
    };
    
    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-indigo-800">Resumo de {pet.name}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
                </div>
                <div className="p-6 space-y-4">
                    <label htmlFor="summary-notes" className="block text-sm font-medium text-gray-700">
                        Escreva aqui as observações do dia:
                    </label>
                    <textarea
                        id="summary-notes"
                        rows={5}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder={`Ex: Comeu toda a ração, brincou bastante com os outros cães, etc.`}
                    />
                </div>
                <div className="flex justify-end p-4 border-t bg-gray-50 rounded-b-lg">
                    {isShared ? (
                         <p className="text-green-600 font-semibold">Resumo compartilhado com sucesso!</p>
                    ) : (
                        <button
                            onClick={handleShare}
                            className="flex items-center px-6 py-2 rounded-md text-white bg-green-500 hover:bg-green-600 transition"
                        >
                            <Share className="w-4 h-4 mr-2" /> Compartilhar Resumo
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
};

export default ShareModal;
