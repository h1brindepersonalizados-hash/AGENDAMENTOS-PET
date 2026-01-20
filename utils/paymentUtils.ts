
import { Pet } from '../types';

export interface PaymentStatus {
  text: string;
  color: string;
  isOverdue?: boolean;
  isDailyPending?: boolean;
}

export const getPaymentStatus = (pet: Pet): PaymentStatus => {
    const today = new Date().toISOString().split('T')[0];

    if (pet.paymentType === 'mensal') {
        if (pet.dueDate && pet.dueDate < today) {
            return { text: 'Em Atraso', color: 'bg-red-200 text-red-800', isOverdue: true };
        }
        return { text: 'Em Dia', color: 'bg-green-200 text-green-800', isOverdue: false };
    }

    // Daily payment logic
    if (pet.isCheckedIn) {
        const hasPaidToday = pet.paymentHistory?.some(p => p.date === today && p.type === 'diaria');
        if (hasPaidToday) {
            return { text: 'Diária Paga', color: 'bg-green-200 text-green-800' };
        }
        return { text: 'Diária Pendente', color: 'bg-yellow-200 text-yellow-800', isDailyPending: true };
    }

    return { text: 'Diária', color: 'bg-blue-200 text-blue-800' };
};
