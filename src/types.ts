export type PlanStatus = 'ativo' | 'pausado' | 'renovacao_pendente' | 'cancelado';
export type PaymentStatus = 'pago' | 'pendente' | 'a_vencer';

export interface StudentPlan {
  id: string;
  name: string; // e.g. "Plano VIP Performance", "Semestral 3x/sem"
  weeklyFrequency: number; // e.g. 3, 4, 5
  durationMonths: number; // e.g. 6
  startDate: string;
  endDate: string;
  priceMonthly: number;
  status: PlanStatus;
  paymentStatus?: PaymentStatus;
  nextDueDate?: string; // YYYY-MM-DD
  notes?: string;
}

export type ClassStatus = 'agendada' | 'concluida' | 'cancelada' | 'ausente';

export interface ClassSession {
  id: string;
  studentId: string;
  studentName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  status: ClassStatus;
  focus: string; // e.g. "Hipertrofia - Superiores", "Membros Inferiores & Glúteos"
  location: string;
  trainerNotes?: string;
  emotionalScore?: number; // 0 to 15
  loadRecordsCount?: number;
}

export interface LoadProgressionRecord {
  id: string;
  studentId: string;
  exerciseName: string;
  category: 'Peito' | 'Costas' | 'Pernas' | 'Ombros' | 'Braços' | 'Core' | 'Outros';
  date: string; // YYYY-MM-DD
  weekLabel: string; // e.g. "Semana 1", "Semana 4"
  weightKg: number;
  reps: number;
  sets: number;
  rpe?: number; // 1-10 esforço percebido
  trainerNotes: string;
  isPersonalRecord?: boolean;
}

export interface EmotionalCheckin {
  id: string;
  studentId: string;
  classSessionId?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  score: number; // 0 a 15
  tag?: string; // e.g. "Muito focado", "Cansado do trabalho", "Dormiu pouco"
  note?: string;
  trainerAction?: string; // Como o personal adaptou a aula
}

export interface BodyMeasurements {
  chestCm: number;
  rightArmCm: number;
  leftArmCm: number;
  waistCm: number;
  abdomenCm: number;
  hipsCm: number;
  rightThighCm: number;
  leftThighCm: number;
  rightCalfCm: number;
  leftCalfCm: number;
}

export interface PhysicalAssessment {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  title: string; // e.g. "Avaliação Inicial", "Reavaliação 90 Dias"
  photos: {
    front?: string;
    side?: string;
    back?: string;
  };
  weightKg: number;
  heightCm: number;
  bodyFatPercentage?: number;
  muscleMassKg?: number;
  visceralFat?: number;
  measurements: BodyMeasurements;
  postureNotes?: string;
  examsDocuments: Array<{
    id: string;
    name: string;
    type: 'pdf' | 'img' | 'doc';
    date: string;
    sizeKb: number;
  }>;
  trainerObservations: string;
  nextAssessmentDate?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  age: number;
  gender: 'M' | 'F' | 'Outro';
  goal: string;
  plan: StudentPlan;
  activeDays: string[]; // ['Seg', 'Qua', 'Sex']
  preferredTime: string;
  emergencyContact: string;
  healthConditions?: string[];
  trainerNotes: string;
  streakCount: number;
  attendedClassesCount: number;
  totalClassesCount: number;
  latestEmotionalScore?: number;
}
