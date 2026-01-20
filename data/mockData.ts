
import { Pet } from '../types';

// Helper to get a due date for mock data
const getDueDate = (daysToAdd: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split('T')[0];
};

export const petData: Pet[] = [
  {
    id: 'pet-1',
    name: 'Bolinha',
    species: 'Cachorro',
    breed: 'Golden Retriever',
    age: 3,
    gender: 'Macho',
    photoUrl: 'https://picsum.photos/id/237/300/300',
    owner: {
      name: 'Ana Silva',
      phone: '(11) 98765-4321',
      email: 'ana.silva@example.com',
      address: 'Rua das Flores, 123, São Paulo, SP'
    },
    healthInfo: {
      vaccinations: { raiva: true, v10: true, gripe: true, v5: false, leishmaniose: false },
      allergies: 'Nenhuma conhecida',
      medications: 'Nenhum',
      vetName: 'Dr. Carlos Pereira',
      vetPhone: '(11) 5555-1234'
    },
    behaviorNotes: 'Amigável com outros cães e pessoas. Adora buscar a bolinha.',
    feedingInstructions: 'Ração seca, 2 vezes ao dia.',
    isCheckedIn: true,
    dailySummaryNotes: 'Comeu bem e brincou bastante com o Thor. Fez bastante xixi e cocô normais.',
    attendance: [],
    paymentType: 'mensal',
    monthlyFee: 500,
    dueDate: getDueDate(10), // Due in 10 days
  },
  {
    id: 'pet-2',
    name: 'Mimi',
    species: 'Gato',
    breed: 'Siamês',
    age: 5,
    gender: 'Fêmea',
    photoUrl: 'https://picsum.photos/id/1074/300/300',
    owner: {
      name: 'João Costa',
      phone: '(21) 91234-5678',
      email: 'joao.costa@example.com',
      address: 'Avenida Copacabana, 456, Rio de Janeiro, RJ'
    },
    healthInfo: {
      vaccinations: { raiva: true, v10: false, gripe: false, v5: true, leishmaniose: false },
      allergies: 'Poeira',
      medications: 'Anti-alérgico ocasionalmente',
      vetName: 'Dra. Beatriz Lima',
      vetPhone: '(21) 5555-5678'
    },
    behaviorNotes: 'Tímida no início, mas muito carinhosa depois que se acostuma.',
    feedingInstructions: 'Ração para gatos castrados, à vontade.',
    isCheckedIn: true,
    dailySummaryNotes: 'Passou a maior parte do dia na prateleira mais alta, mas desceu para receber carinho à tarde.',
    attendance: [],
    paymentType: 'diaria',
    dailyRate: 70,
    dueDate: null,
  },
  {
    id: 'pet-3',
    name: 'Thor',
    species: 'Cachorro',
    breed: 'Bulldog Francês',
    age: 2,
    gender: 'Macho',
    photoUrl: 'https://picsum.photos/id/1025/300/300',
    owner: {
      name: 'Mariana Oliveira',
      phone: '(31) 99988-7766',
      email: 'mari.oliveira@example.com',
      address: 'Rua da Bahia, 789, Belo Horizonte, MG'
    },
    healthInfo: {
      vaccinations: { raiva: true, v10: true, gripe: false, v5: false, leishmaniose: true },
      allergies: 'Grama',
      medications: 'Nenhum',
      vetName: 'Dr. Carlos Pereira',
      vetPhone: '(11) 5555-1234'
    },
    behaviorNotes: 'Muito brincalhão e enérgico. Ronca bastante.',
    feedingInstructions: 'Ração hipoalergênica, 2 vezes ao dia.',
    isCheckedIn: false,
    dailySummaryNotes: '',
    attendance: [],
    paymentType: 'mensal',
    monthlyFee: 550,
    dueDate: getDueDate(-5), // 5 days overdue
  },
  {
    id: 'pet-4',
    name: 'Luna',
    species: 'Gato',
    breed: 'Persa',
    age: 7,
    gender: 'Fêmea',
    photoUrl: 'https://picsum.photos/id/593/300/300',
    owner: {
      name: 'Pedro Martins',
      phone: '(41) 98877-6655',
      email: 'pedro.martins@example.com',
      address: 'Rua XV de Novembro, 101, Curitiba, PR'
    },
    healthInfo: {
      vaccinations: { raiva: false, v10: false, gripe: false, v5: true, leishmaniose: false },
      allergies: 'Nenhuma',
      medications: 'Remédio para os rins',
      vetName: 'Dra. Beatriz Lima',
      vetPhone: '(21) 5555-5678'
    },
    behaviorNotes: 'Calma e quieta. Gosta de dormir em locais altos.',
    feedingInstructions: 'Ração úmida especial para rins, 3 vezes ao dia.',
    isCheckedIn: true,
    dailySummaryNotes: 'Comeu a ração úmida sem problemas. Tomou o remédio.',
    attendance: [],
    paymentType: 'mensal',
    monthlyFee: 480,
    dueDate: getDueDate(25), // Due in 25 days
  },
    {
    id: 'pet-5',
    name: 'Max',
    species: 'Cachorro',
    breed: 'Labrador',
    age: 4,
    gender: 'Macho',
    photoUrl: 'https://picsum.photos/id/1020/300/300',
    owner: {
      name: 'Fernanda Souza',
      phone: '(51) 98765-1122',
      email: 'fe.souza@example.com',
      address: 'Avenida Ipiranga, 202, Porto Alegre, RS'
    },
    healthInfo: {
      vaccinations: { raiva: true, v10: true, gripe: true, v5: false, leishmaniose: true },
      allergies: 'Frango',
      medications: 'Nenhum',
      vetName: 'Dr. Ricardo Alves',
      vetPhone: '(51) 5555-9876'
    },
    behaviorNotes: 'Muito ativo, adora água e longas caminhadas.',
    feedingInstructions: 'Ração à base de cordeiro, 2 vezes ao dia.',
    isCheckedIn: false,
    dailySummaryNotes: '',
    attendance: [],
    paymentType: 'diaria',
    dailyRate: 80,
    dueDate: null,
  }
];
