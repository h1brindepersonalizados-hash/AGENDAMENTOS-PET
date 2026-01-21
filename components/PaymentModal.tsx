
import React, { useState } from 'react';
import { Pet } from '../types';
import { DollarSign } from './Icons';

interface PaymentModalProps {
    pet: Pet;
    onClose: () => void;
    onConfirm: (petId: string, paymentDate: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ pet, onClose, onConfirm }) => {
    const today = new Date().toISOString().split('T')[0];
    const [paymentDate, setPaymentDate] = useState(today);

    const paymentType = pet.paymentType === 'mensal' ? 'Mensalidade' : 'Diária';
    const amount = pet.paymentType === 'mensal' ? pet.monthlyFee : pet.dailyRate;

    const handleSubmit = () => {
        if (!paymentDate) {
            alert('Por favor, selecione uma data para o pagamento.');
            return;
        }
        onConfirm(pet.id, paymentDate);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-indigo-800">Registrar Pagamento</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-gray-700">Você está registrando o pagamento para <strong className="font-semibold text-indigo-800">{pet.name}</strong>.</p>
                    <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-500">Tipo: {paymentType}</p>
                        <p className="text-lg font-bold text-gray-800">Valor: R$ {amount?.toFixed(2)}</p>
                    </div>
                    <div>
                        <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Data do Pagamento
                        </label>
                        <input
                            type="date"
                            id="paymentDate"
                            value={paymentDate}
                            onChange={(e) => setPaymentDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>
                <div className="flex justify-end p-4 border-t bg-gray-50 rounded-b-lg space-x-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition">
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex items-center px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 transition"
                    >
                        <DollarSign className="w-4 h-4 mr-2" /> Confirmar Pagamento
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
