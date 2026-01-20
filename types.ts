
export interface Owner {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface Vaccines {
  raiva: boolean;
  v10: boolean; // Para cães
  gripe: boolean; // Para cães
  v5: boolean; // Para gatos
  leishmaniose: boolean;
}

export interface HealthInfo {
  vaccinations: Vaccines;
  allergies: string;
  medications: string;
  vetName: string;
  vetPhone: string;
}

export interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  status: 'present' | 'absent';
}

export interface ReminderSettings {
  enabled: boolean;
  time: string; // HH:MM format
}

export interface Pet {
  id: string;
  name: string;
  species: 'Cachorro' | 'Gato';
  breed: string;
  age: number;
  gender: 'Macho' | 'Fêmea';
  photoUrl: string; // Can be a URL or a base64 data URI
  owner: Owner;
  healthInfo: HealthInfo;
  behaviorNotes: string;
  feedingInstructions: string;
  isCheckedIn: boolean;
  dailySummaryNotes: string;
  attendance: AttendanceRecord[];

  // Payment Information
  paymentType: 'mensal' | 'diaria';
  monthlyFee?: number;
  dailyRate?: number;
  dueDate?: string | null; // YYYY-MM-DD, only for 'mensal'
}
