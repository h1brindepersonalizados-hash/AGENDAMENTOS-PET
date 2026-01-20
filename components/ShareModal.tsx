
import React, { useState } from 'react';
import { Pet } from '../types';
import { Share } from './Icons';

interface ShareModalProps {
    pet: Pet;
    onClose: () => void;
    onUpdateNotes: (petId: string, notes: string) => void;
    companyName: string;
}

const WhatsAppIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.75 13.96c.25.13.42.2.52.32.1.13.15.25.15.42 0 .2-.05.38-.15.52-.1.15-.22.28-.37.4-.15.13-.3.2-.45.25-.15.05-.32.07-.5.07-.23 0-.48-.05-.73-.15-.25-.1-.5-.25-.75-.42s-.5-.38-.75-.6-.48-.5-.7-.78-.4-.6-.58-.95c-.18-.35-.27-.7-.27-1.05 0-.2.03-.38.1-.53s.15-.28.25-.42c.1-.13.2-.23.3-.3.1-.08.2-.13.3-.15.1-.03.2-.03.27-.03.1 0 .2.02.3.05s.2.08.3.15l.4.65c.1.15.18.3.23.45.05.15.07.3.07.45 0 .15-.03.3-.08.45s-.13.28-.23.4-.2.2-.3.25c-.1.05-.18.08-.25.08-.07 0-.15-.02-.23-.05-.08-.03-.15-.08-.2-.13l-.1-.08c-.25-.2-.48-.4-.7-.6s-.4-.4-.53-.6c-.13-.2-.2-.4-.2-.6 0-.15.03-.3.08-.42.05-.12.13-.23.23-.32l.18-.15c.05-.05.1-.08.15-.1.05-.02.1-.03.15-.03h.1c.07 0 .13.02.2.05.07.03.13.08.2.13l1.12 1.9c.07.1.12.23.15.35s.05.25.05.4zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
    </svg>
);


const ShareModal: React.FC<ShareModalProps> = ({ pet, onClose, onUpdateNotes, companyName }) => {
    const [notes, setNotes] = useState(pet.dailySummaryNotes || '');
    const [isShared, setIsShared] = useState(false);

    const getSummaryText = () => `
Resumo do dia de ${pet.name} no ${companyName}! 🐾

${notes}

---
Ficha Rápida:
- Alimentação: ${pet.feedingInstructions}
- Comportamento Geral: ${pet.behaviorNotes}

Qualquer dúvida, estamos à disposição!
Equipe ${companyName}.
    `.trim();

    const handleShare = async () => {
        onUpdateNotes(pet.id, notes); // Save notes before sharing
        const summaryText = getSummaryText();

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Resumo do dia de ${pet.name}`,
                    text: summaryText,
                });
                setIsShared(true);
                setTimeout(() => onClose(), 1500);
            } catch (error) {
                console.error('Erro ao compartilhar:', error);
                alert('O compartilhamento foi cancelado ou falhou.');
            }
        } else {
            navigator.clipboard.writeText(summaryText);
            alert('Resumo copiado para a área de transferência! Use o botão do WhatsApp ou cole manualmente.');
        }
    };

    const handleWhatsAppShare = () => {
        onUpdateNotes(pet.id, notes); // Save notes before sharing
        const summaryText = getSummaryText();
        const phoneNumber = pet.owner.phone.replace(/\D/g, ''); // Remove non-digits
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(summaryText)}`;
        window.open(whatsappUrl, '_blank');
        setIsShared(true);
        setTimeout(() => onClose(), 1500);
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
                <div className="flex flex-col sm:flex-row justify-end p-4 border-t bg-gray-50 rounded-b-lg space-y-2 sm:space-y-0 sm:space-x-3">
                    {isShared ? (
                         <p className="text-green-600 font-semibold text-center w-full">Resumo compartilhado com sucesso!</p>
                    ) : (
                        <>
                            <button
                                onClick={handleShare}
                                className="flex w-full sm:w-auto items-center justify-center px-4 py-2 rounded-md text-white bg-indigo-500 hover:bg-indigo-600 transition"
                            >
                                <Share className="w-4 h-4 mr-2" /> Compartilhamento Padrão
                            </button>
                             <button
                                onClick={handleWhatsAppShare}
                                className="flex w-full sm:w-auto items-center justify-center px-4 py-2 rounded-md text-white bg-green-500 hover:bg-green-600 transition"
                            >
                                <WhatsAppIcon className="w-5 h-5 mr-2" /> Via WhatsApp
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
};

export default ShareModal;
