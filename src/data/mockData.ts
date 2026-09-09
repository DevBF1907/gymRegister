import { Student, ClassSession, LoadProgressionRecord, EmotionalCheckin, PhysicalAssessment } from '../types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'stud-1',
    name: 'Lucas Ferreira',
    email: 'lucas.ferreira@email.com',
    phone: '(11) 98765-4321',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    age: 28,
    gender: 'M',
    goal: 'Hipertrofia Muscular & Ganho de Força',
    plan: {
      id: 'plan-lucas',
      name: 'Plano Semestral VIP Elite',
      weeklyFrequency: 4,
      durationMonths: 6,
      startDate: '2026-06-01',
      endDate: '2026-12-01',
      priceMonthly: 780,
      status: 'ativo',
      paymentStatus: 'pago',
      nextDueDate: '2026-10-01',
      notes: 'Inclui periodização de força, acompanhamento de cargas e suporte nutricional.'
    },
    activeDays: ['Seg', 'Ter', 'Qui', 'Sex'],
    preferredTime: '07:00',
    emergencyContact: 'Renata (Esposa) - (11) 98888-1122',
    healthConditions: ['Leve desconforto no manguito rotador direito em rotação externa máxima'],
    trainerNotes: 'Excelente disciplina. Responde muito bem a treinos de força com carga progressiva e intervalos controlados.',
    streakCount: 14,
    attendedClassesCount: 38,
    totalClassesCount: 40,
    latestEmotionalScore: 13
  },
  {
    id: 'stud-2',
    name: 'Camila Duarte',
    email: 'camila.duarte@email.com',
    phone: '(11) 99123-8899',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    age: 32,
    gender: 'F',
    goal: 'Emagrecimento, Definição & Tônus Muscular',
    plan: {
      id: 'plan-camila',
      name: 'Plano Trimestral Performance',
      weeklyFrequency: 3,
      durationMonths: 3,
      startDate: '2026-07-15',
      endDate: '2026-10-15',
      priceMonthly: 620,
      status: 'ativo',
      paymentStatus: 'a_vencer',
      nextDueDate: '2026-09-12',
      notes: 'Foco em treinos metabólicos e fortalecimento de cadeia posterior.'
    },
    activeDays: ['Seg', 'Qua', 'Sex'],
    preferredTime: '18:30',
    emergencyContact: 'Carlos (Irmão) - (11) 97777-4433',
    healthConditions: [],
    trainerNotes: 'Grande evolução na postura e estabilidade de core. Ótimo índice de motivação nas sextas-feiras.',
    streakCount: 9,
    attendedClassesCount: 22,
    totalClassesCount: 24,
    latestEmotionalScore: 14
  },
  {
    id: 'stud-3',
    name: 'Rodrigo Albuquerque',
    email: 'rodrigo.albuquerque@email.com',
    phone: '(11) 98345-6712',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    age: 41,
    gender: 'M',
    goal: 'Saúde Geral, Alívio de Dores Lombares & Mobilidade',
    plan: {
      id: 'plan-rodrigo',
      name: 'Plano Anual Saúde & Longevidade',
      weeklyFrequency: 2,
      durationMonths: 12,
      startDate: '2026-01-10',
      endDate: '2027-01-10',
      priceMonthly: 490,
      status: 'ativo',
      paymentStatus: 'pendente',
      nextDueDate: '2026-09-05',
      notes: 'Foco em descompressão vertebral, ativação de glúteos e ergonomia postural.'
    },
    activeDays: ['Ter', 'Qui'],
    preferredTime: '19:30',
    emergencyContact: 'Paula (Esposa) - (11) 96666-5544',
    healthConditions: ['Protrusão discal em L5-S1 (assintomático atualmente)'],
    trainerNotes: 'Ajustar volume de treino conforme relato de estresse corporativo para evitar sobrecarga no SNC.',
    streakCount: 6,
    attendedClassesCount: 64,
    totalClassesCount: 68,
    latestEmotionalScore: 9
  },
  {
    id: 'stud-4',
    name: 'Beatriz Mendes',
    email: 'beatriz.mendes@email.com',
    phone: '(11) 99881-2233',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    age: 26,
    gender: 'F',
    goal: 'Condicionamento Físico & Fortalecimento p/ Meia Maratona',
    plan: {
      id: 'plan-beatriz',
      name: 'Plano Semestral Híbrido Atleta',
      weeklyFrequency: 3,
      durationMonths: 6,
      startDate: '2026-05-01',
      endDate: '2026-11-01',
      priceMonthly: 650,
      status: 'ativo',
      paymentStatus: 'pago',
      nextDueDate: '2026-10-05',
      notes: 'Periodização integrada com planilha de corrida (técnica de passada e força unilateral).'
    },
    activeDays: ['Seg', 'Qua', 'Sex'],
    preferredTime: '06:00',
    emergencyContact: 'Marcos (Pai) - (11) 95555-8899',
    healthConditions: [],
    trainerNotes: 'Excelente capacidade cardiorrespiratória. Foco em estabilidade de tornozelo e joelho.',
    streakCount: 18,
    attendedClassesCount: 46,
    totalClassesCount: 48,
    latestEmotionalScore: 15
  }
];

export const INITIAL_CLASSES: ClassSession[] = [
  {
    id: 'class-today-1',
    studentId: 'stud-1',
    studentName: 'Lucas Ferreira',
    date: '2026-09-08',
    time: '07:00',
    durationMinutes: 60,
    status: 'concluida',
    focus: 'Peitoral, Ombros & Tríceps (Carga Progressiva)',
    location: 'Academia BioFit - Sala VIP 1',
    trainerNotes: 'Lucas bateu novo recorde no supino reto (35kg/lado). Ótima estabilidade escapular.',
    emotionalScore: 13,
    loadRecordsCount: 3
  },
  {
    id: 'class-today-2',
    studentId: 'stud-4',
    studentName: 'Beatriz Mendes',
    date: '2026-09-08',
    time: '12:00',
    durationMinutes: 60,
    status: 'concluida',
    focus: 'Força Unilateral & Estabilidade de Core',
    location: 'Studio Personal Fit',
    trainerNotes: 'Sessão focada em ativação de glúteo médio e agachamento búlgaro.',
    emotionalScore: 15,
    loadRecordsCount: 2
  },
  {
    id: 'class-today-3',
    studentId: 'stud-2',
    studentName: 'Camila Duarte',
    date: '2026-09-08',
    time: '18:30',
    durationMinutes: 60,
    status: 'agendada',
    focus: 'Membros Inferiores & Glúteos (Volume Metabólico)',
    location: 'Academia BioFit - Sala 2',
    trainerNotes: 'Testar nova progressão na elevação pélvica.',
    loadRecordsCount: 0
  },
  {
    id: 'class-today-4',
    studentId: 'stud-3',
    studentName: 'Rodrigo Albuquerque',
    date: '2026-09-08',
    time: '19:30',
    durationMinutes: 60,
    status: 'agendada',
    focus: 'Mobilidade Torácica & Fortalecimento de Paravertebrais',
    location: 'Studio Personal Fit',
    trainerNotes: 'Iniciar com 10 min de liberação miofascial suave.',
    loadRecordsCount: 0
  },
  // Upcoming classes
  {
    id: 'class-up-1',
    studentId: 'stud-1',
    studentName: 'Lucas Ferreira',
    date: '2026-09-09',
    time: '07:00',
    durationMinutes: 60,
    status: 'agendada',
    focus: 'Dorsais, Deltoide Posterior & Bíceps',
    location: 'Academia BioFit - Sala VIP 1'
  },
  {
    id: 'class-up-2',
    studentId: 'stud-4',
    studentName: 'Beatriz Mendes',
    date: '2026-09-10',
    time: '06:00',
    durationMinutes: 60,
    status: 'agendada',
    focus: 'Treino de Potência & Saltos Pliométricos',
    location: 'Parque Ibirapuera (Ao Ar Livre)'
  },
  {
    id: 'class-up-3',
    studentId: 'stud-2',
    studentName: 'Camila Duarte',
    date: '2026-09-10',
    time: '18:30',
    durationMinutes: 60,
    status: 'agendada',
    focus: 'Superiores & Condicionamento HIIT',
    location: 'Academia BioFit - Sala 2'
  },
  {
    id: 'class-past-1',
    studentId: 'stud-1',
    studentName: 'Lucas Ferreira',
    date: '2026-09-05',
    time: '07:00',
    durationMinutes: 60,
    status: 'concluida',
    focus: 'Membros Inferiores & Panturrilhas',
    location: 'Academia BioFit - Sala VIP 1',
    trainerNotes: 'Excelente amplitude no agachamento com 80kg.',
    emotionalScore: 14,
    loadRecordsCount: 3
  },
  {
    id: 'class-past-2',
    studentId: 'stud-1',
    studentName: 'Lucas Ferreira',
    date: '2026-09-03',
    time: '07:00',
    durationMinutes: 60,
    status: 'concluida',
    focus: 'Dorsais & Tríceps',
    location: 'Academia BioFit - Sala VIP 1',
    trainerNotes: 'Remada curvada executada com boa postura.',
    emotionalScore: 12,
    loadRecordsCount: 2
  }
];

export const INITIAL_LOAD_RECORDS: LoadProgressionRecord[] = [
  // Lucas Ferreira - Supino Reto (User explicit example: Sem 1: 20kg, Sem 4: 25kg, Sem 8: 30kg, Sem 12: 35kg)
  {
    id: 'load-1',
    studentId: 'stud-1',
    exerciseName: 'Supino Reto com Barra',
    category: 'Peito',
    date: '2026-06-15',
    weekLabel: 'Semana 1',
    weightKg: 20,
    reps: 10,
    sets: 3,
    rpe: 7,
    trainerNotes: 'Ajuste inicial de pegada e ativação de escápulas. Movimento controlado.'
  },
  {
    id: 'load-2',
    studentId: 'stud-1',
    exerciseName: 'Supino Reto com Barra',
    category: 'Peito',
    date: '2026-07-06',
    weekLabel: 'Semana 4',
    weightKg: 25,
    reps: 10,
    sets: 4,
    rpe: 8,
    trainerNotes: 'Boa velocidade concêntrica. Aluno sem dores no ombro.'
  },
  {
    id: 'load-3',
    studentId: 'stud-1',
    exerciseName: 'Supino Reto com Barra',
    category: 'Peito',
    date: '2026-08-03',
    weekLabel: 'Semana 8',
    weightKg: 30,
    reps: 8,
    sets: 4,
    rpe: 8.5,
    trainerNotes: 'Evolução consistente. Mantendo boa cadência e sem descolar os pés do solo.'
  },
  {
    id: 'load-4',
    studentId: 'stud-1',
    exerciseName: 'Supino Reto com Barra',
    category: 'Peito',
    date: '2026-09-08',
    weekLabel: 'Semana 12',
    weightKg: 35,
    reps: 8,
    sets: 4,
    rpe: 9,
    trainerNotes: 'Novo recorde pessoal (PR)! Superou a meta trimestral com excelente técnica.',
    isPersonalRecord: true
  },
  // Lucas Ferreira - Agachamento Livre
  {
    id: 'load-5',
    studentId: 'stud-1',
    exerciseName: 'Agachamento Livre',
    category: 'Pernas',
    date: '2026-06-16',
    weekLabel: 'Semana 1',
    weightKg: 40,
    reps: 12,
    sets: 3,
    rpe: 7,
    trainerNotes: 'Trabalho de mobilidade de tornozelo para quebra de paralelo segura.'
  },
  {
    id: 'load-6',
    studentId: 'stud-1',
    exerciseName: 'Agachamento Livre',
    category: 'Pernas',
    date: '2026-07-07',
    weekLabel: 'Semana 4',
    weightKg: 55,
    reps: 10,
    sets: 4,
    rpe: 8,
    trainerNotes: 'Estabilidade do tronco excelente com bracing bem executado.'
  },
  {
    id: 'load-7',
    studentId: 'stud-1',
    exerciseName: 'Agachamento Livre',
    category: 'Pernas',
    date: '2026-08-04',
    weekLabel: 'Semana 8',
    weightKg: 70,
    reps: 8,
    sets: 4,
    rpe: 8.5,
    trainerNotes: 'Profundidade consistente em todas as repetições.'
  },
  {
    id: 'load-8',
    studentId: 'stud-1',
    exerciseName: 'Agachamento Livre',
    category: 'Pernas',
    date: '2026-09-05',
    weekLabel: 'Semana 12',
    weightKg: 85,
    reps: 6,
    sets: 4,
    rpe: 9,
    trainerNotes: 'Grande ganho de força e densidade nas coxas.',
    isPersonalRecord: true
  },
  // Lucas Ferreira - Levantamento Terra
  {
    id: 'load-9',
    studentId: 'stud-1',
    exerciseName: 'Levantamento Terra',
    category: 'Costas',
    date: '2026-07-10',
    weekLabel: 'Semana 5',
    weightKg: 60,
    reps: 8,
    sets: 3,
    rpe: 7.5,
    trainerNotes: 'Posicionamento da coluna neutra monitorado.'
  },
  {
    id: 'load-10',
    studentId: 'stud-1',
    exerciseName: 'Levantamento Terra',
    category: 'Costas',
    date: '2026-08-14',
    weekLabel: 'Semana 9',
    weightKg: 80,
    reps: 6,
    sets: 4,
    rpe: 8.5,
    trainerNotes: 'Transição suave da primeira para a segunda fase da puxada.'
  },
  {
    id: 'load-11',
    studentId: 'stud-1',
    exerciseName: 'Levantamento Terra',
    category: 'Costas',
    date: '2026-09-04',
    weekLabel: 'Semana 12',
    weightKg: 95,
    reps: 5,
    sets: 3,
    rpe: 9,
    trainerNotes: 'Excelente tração e bloqueio dos quadris no topo.',
    isPersonalRecord: true
  },
  // Camila Duarte
  {
    id: 'load-12',
    studentId: 'stud-2',
    exerciseName: 'Elevação Pélvica com Barra',
    category: 'Pernas',
    date: '2026-07-20',
    weekLabel: 'Semana 1',
    weightKg: 40,
    reps: 12,
    sets: 4,
    rpe: 7,
    trainerNotes: 'Foco na contração de topo com pausa de 2 segundos.'
  },
  {
    id: 'load-13',
    studentId: 'stud-2',
    exerciseName: 'Elevação Pélvica com Barra',
    category: 'Pernas',
    date: '2026-08-18',
    weekLabel: 'Semana 5',
    weightKg: 60,
    reps: 10,
    sets: 4,
    rpe: 8,
    trainerNotes: 'Excelente retenção escapular no banco acolchoado.'
  },
  {
    id: 'load-14',
    studentId: 'stud-2',
    exerciseName: 'Elevação Pélvica com Barra',
    category: 'Pernas',
    date: '2026-09-04',
    weekLabel: 'Semana 8',
    weightKg: 80,
    reps: 10,
    sets: 4,
    rpe: 8.5,
    trainerNotes: 'Muito forte na subida, sem sobrecarga na coluna lombar.',
    isPersonalRecord: true
  }
];

export const INITIAL_EMOTIONAL_CHECKINS: EmotionalCheckin[] = [
  // Lucas Ferreira
  {
    id: 'em-1',
    studentId: 'stud-1',
    date: '2026-08-11',
    time: '07:05',
    score: 11,
    tag: 'Disposto',
    note: 'Dormi razoavelmente bem, motivado para o treino de pernas.',
    trainerAction: 'Treino conduzido normalmente com aquecimento dinâmico.'
  },
  {
    id: 'em-2',
    studentId: 'stud-1',
    date: '2026-08-14',
    time: '07:02',
    score: 13,
    tag: 'Energia Alta',
    note: 'Fim de semana foi descansado, me sentindo ótimo.',
    trainerAction: 'Aproveitamos a alta disposição para progredir 2.5kg na remada.'
  },
  {
    id: 'em-3',
    studentId: 'stud-1',
    date: '2026-08-18',
    time: '07:08',
    score: 6,
    tag: 'Estresse no Trabalho',
    note: 'Semana intensa de fechamento de trimestre na empresa, poucas horas de sono.',
    trainerAction: 'MUDANÇA DE PADRÃO NOTADA: Reduzido o volume de séries em 25% e aumentado intervalo para recuperação nervosa.'
  },
  {
    id: 'em-4',
    studentId: 'stud-1',
    date: '2026-08-21',
    time: '07:04',
    score: 9,
    tag: 'Recuperando',
    note: 'Descansou melhor na noite passada.',
    trainerAction: 'Foco técnico e retorno gradual da intensidade.'
  },
  {
    id: 'em-5',
    studentId: 'stud-1',
    date: '2026-08-25',
    time: '07:03',
    score: 12,
    tag: 'Motivado',
    note: 'Sentindo o corpo mais forte e descansado.',
    trainerAction: 'Treino completo sem restrições.'
  },
  {
    id: 'em-6',
    studentId: 'stud-1',
    date: '2026-08-28',
    time: '07:01',
    score: 14,
    tag: 'Excelente',
    note: 'Alimentação 100% alinhada.',
    trainerAction: 'Sessão de alta intensidade.'
  },
  {
    id: 'em-7',
    studentId: 'stud-1',
    date: '2026-09-01',
    time: '07:05',
    score: 12,
    tag: 'Bem Disposto',
    note: 'Pronto para bater metas.',
    trainerAction: 'Manutenção de cargas e reforço da estabilidade escapular.'
  },
  {
    id: 'em-8',
    studentId: 'stud-1',
    date: '2026-09-05',
    time: '07:03',
    score: 14,
    tag: 'Focado & Forte',
    note: 'Dia muito bom.',
    trainerAction: 'Preparação para teste de carga máxima.'
  },
  {
    id: 'em-9',
    studentId: 'stud-1',
    date: '2026-09-08',
    time: '07:02',
    score: 13,
    tag: 'Muito Bom',
    note: 'Super animado com a evolução nos pesos!',
    trainerAction: 'Lucas bateu PR no Supino (35kg). Elogiado o foco e controle motor.'
  },
  // Camila Duarte
  {
    id: 'em-10',
    studentId: 'stud-2',
    date: '2026-09-01',
    time: '18:32',
    score: 13,
    tag: 'Energia Positiva',
    note: 'Adoro treinar no final da tarde.',
    trainerAction: 'Treino metabólico intenso.'
  },
  {
    id: 'em-11',
    studentId: 'stud-2',
    date: '2026-09-04',
    time: '18:31',
    score: 14,
    tag: 'Super Confiante',
    note: 'Roupas já estão mais folgadas!',
    trainerAction: 'Progressão na elevação pélvica para 80kg.'
  },
  // Rodrigo Albuquerque (Alerta no padrão emocional)
  {
    id: 'em-12',
    studentId: 'stud-3',
    date: '2026-08-20',
    time: '19:35',
    score: 5,
    tag: 'Cansaço Extremo',
    note: 'Muita tensão cervical e dor de cabeça pós reuniões.',
    trainerAction: 'ATENÇÃO: Substituído o treino de força por protocolo de mobilidade, liberação miofascial e respiração diafragmática.'
  },
  {
    id: 'em-13',
    studentId: 'stud-3',
    date: '2026-09-03',
    time: '19:33',
    score: 9,
    tag: 'Mais Relaxado',
    note: 'A massagem e exercícios de respiração da aula anterior ajudaram muito.',
    trainerAction: 'Retorno seguro com exercícios leves de estabilização isométrica.'
  },
  // Beatriz Mendes
  {
    id: 'em-14',
    studentId: 'stud-4',
    date: '2026-09-08',
    time: '12:05',
    score: 15,
    tag: 'Imparável',
    note: 'Bati meu tempo nos 10km no fim de semana!',
    trainerAction: 'Treino de core e membros inferiores em nível avançado.'
  }
];

export const INITIAL_PHYSICAL_ASSESSMENTS: PhysicalAssessment[] = [
  // Lucas Ferreira - Avaliação Inicial (Mês 1)
  {
    id: 'eval-1',
    studentId: 'stud-1',
    date: '2026-06-05',
    title: 'Avaliação Física Inicial (Baseline)',
    photos: {
      front: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80',
      side: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80'
    },
    weightKg: 82.5,
    heightCm: 178,
    bodyFatPercentage: 19.4,
    muscleMassKg: 38.2,
    visceralFat: 6,
    measurements: {
      chestCm: 101.5,
      rightArmCm: 35.0,
      leftArmCm: 34.5,
      waistCm: 86.0,
      abdomenCm: 88.5,
      hipsCm: 99.0,
      rightThighCm: 56.5,
      leftThighCm: 56.0,
      rightCalfCm: 37.0,
      leftCalfCm: 37.0
    },
    postureNotes: 'Ligeira projeção anterior de ombros e cabeça. Pouca flexibilidade na cadeia posterior.',
    examsDocuments: [
      {
        id: 'doc-1',
        name: 'Atestado_Medico_Cardiologico_2026.pdf',
        type: 'pdf',
        date: '2026-05-28',
        sizeKb: 450
      },
      {
        id: 'doc-2',
        name: 'Exame_Bioimpedancia_InBody_Junho.pdf',
        type: 'pdf',
        date: '2026-06-02',
        sizeKb: 1280
      }
    ],
    trainerObservations: 'Aluno com excelente potencial de resposta hipertrófica. Foco inicial em correção postural e fortalecimento de deltoide posterior e trapézio inferior.',
    nextAssessmentDate: '2026-09-05'
  },
  // Lucas Ferreira - Reavaliação 90 Dias (Mês 3)
  {
    id: 'eval-2',
    studentId: 'stud-1',
    date: '2026-09-05',
    title: 'Reavaliação Trimestral (90 Dias)',
    photos: {
      front: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80',
      side: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80'
    },
    weightKg: 84.1,
    heightCm: 178,
    bodyFatPercentage: 15.2,
    muscleMassKg: 41.8,
    visceralFat: 4,
    measurements: {
      chestCm: 106.0,
      rightArmCm: 37.8,
      leftArmCm: 37.5,
      waistCm: 82.5,
      abdomenCm: 83.0,
      hipsCm: 100.5,
      rightThighCm: 59.8,
      leftThighCm: 59.5,
      rightCalfCm: 38.2,
      leftCalfCm: 38.0
    },
    postureNotes: 'Correção nítida dos ombros caídos. Expansão torácica visível e postura ereta natural.',
    examsDocuments: [
      {
        id: 'doc-3',
        name: 'Relatorio_Bioimpedancia_Setembro_2026.pdf',
        type: 'pdf',
        date: '2026-09-04',
        sizeKb: 1420
      }
    ],
    trainerObservations: 'RESULTADO FANTÁSTICO: Ganho expressivo de +3.6 kg de massa magra e redução de -4.2% de gordura corporal! Braços aumentaram quase 3cm com perda de 5.5cm de abdômen.',
    nextAssessmentDate: '2026-12-05'
  },
  // Camila Duarte - Avaliação Inicial
  {
    id: 'eval-3',
    studentId: 'stud-2',
    date: '2026-07-16',
    title: 'Avaliação Física Inicial',
    photos: {
      front: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80',
      side: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80'
    },
    weightKg: 68.4,
    heightCm: 165,
    bodyFatPercentage: 29.2,
    muscleMassKg: 24.1,
    visceralFat: 5,
    measurements: {
      chestCm: 92.0,
      rightArmCm: 28.5,
      leftArmCm: 28.5,
      waistCm: 76.0,
      abdomenCm: 84.0,
      hipsCm: 104.0,
      rightThighCm: 58.0,
      leftThighCm: 58.0,
      rightCalfCm: 36.0,
      leftCalfCm: 36.0
    },
    postureNotes: 'Ligeira hiperlordose lombar decorrente de fraqueza nos glúteos.',
    examsDocuments: [
      {
        id: 'doc-cam-1',
        name: 'Atestado_Liberacao_Camila.pdf',
        type: 'pdf',
        date: '2026-07-10',
        sizeKb: 380
      }
    ],
    trainerObservations: 'Foco em reprogramação motora e fortalecimento do assoalho pélvico e glúteo médio.',
    nextAssessmentDate: '2026-10-15'
  }
];

export const PERSONAL_INFO = {
  name: 'Rodrigo Brandão',
  title: 'Personal Trainer & Especialista em Performance e Biomecânica',
  cref: 'CREF 084920-G/SP',
  avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format&fit=crop&q=80',
  phone: '(11) 99876-5432',
  email: 'rodrigo.personal@apexfitness.com.br',
  experience: '8 anos',
  specialties: ['Biomecânica & Hipertrofia', 'Periodização de Força', 'Reabilitação Postural', 'Fisiologia do Exercício']
};
