import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Calendar,
  Clock,
  Dumbbell,
  HeartPulse,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Search,
  Plus,
  ArrowUpRight,
  Check,
  Award,
  Sparkles,
  TrendingUp,
  Activity,
  Flame,
  Phone
} from 'lucide-react';
import { Student, ClassSession, LoadProgressionRecord, EmotionalCheckin, PhysicalAssessment } from '../types';
import { MobileProfileView } from './MobileProfileView';
import { TrainerAgendaView } from './TrainerAgendaView';
import { TrainerEvolutionView } from './TrainerEvolutionView';

interface TrainerDashboardProps {
  students: Student[];
  classes: ClassSession[];
  loadRecords: LoadProgressionRecord[];
  emotionalCheckins: EmotionalCheckin[];
  assessments: PhysicalAssessment[];
  onSelectStudent: (studentId: string) => void;
  onOpenBookingModal: () => void;
  onOpenLoadModal: (studentId?: string, initialExercise?: string) => void;
  onOpenEmotionalModal: (studentId?: string, classSession?: ClassSession) => void;
  onOpenAssessmentModal: (studentId?: string) => void;
  onCompleteClass: (classId: string) => void;
  activeTab?: 'home' | 'agenda' | 'students' | 'evolution' | 'profile';
  onResetData?: () => void;
  onSwitchToStudentView?: () => void;
  onChangeTab?: (tab: 'home' | 'agenda' | 'students' | 'evolution' | 'profile') => void;
}

export const TrainerDashboard: React.FC<TrainerDashboardProps> = ({
  students,
  classes,
  loadRecords,
  emotionalCheckins,
  assessments,
  onSelectStudent,
  onOpenBookingModal,
  onOpenLoadModal,
  onOpenEmotionalModal,
  onOpenAssessmentModal,
  onCompleteClass,
  activeTab = 'home',
  onResetData,
  onSwitchToStudentView,
  onChangeTab
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const todayStr = '2026-09-08';
  const todayClasses = classes
    .filter(c => c.date === todayStr)
    .sort((a, b) => a.time.localeCompare(b.time));

  // Find next upcoming class
  const nextClass = todayClasses.find(c => c.status === 'agendada') || todayClasses[0];

  // Emotional alerts across students (score <= 7)
  const emotionalAlerts = emotionalCheckins
    .filter(c => c.score <= 7)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2);

  // Active students count
  const activeStudentsCount = students.filter(s => s.status === 'ativo').length;

  // Filter students for the "Alunos" tab
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.goal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Delegate tab rendering
  if (activeTab === 'agenda') {
    return (
      <TrainerAgendaView
        classes={classes}
        students={students}
        onSelectStudent={onSelectStudent}
        onOpenBookingModal={onOpenBookingModal}
        onOpenLoadModal={onOpenLoadModal}
        onOpenEmotionalModal={onOpenEmotionalModal}
        onCompleteClass={onCompleteClass}
      />
    );
  }

  if (activeTab === 'evolution') {
    return (
      <TrainerEvolutionView
        students={students}
        loadRecords={loadRecords}
        onOpenLoadModal={onOpenLoadModal}
        onSelectStudentProfile={onSelectStudent}
      />
    );
  }

  if (activeTab === 'profile') {
    return (
      <MobileProfileView
        students={students}
        onResetData={onResetData || (() => {})}
        onSwitchToStudentView={onSwitchToStudentView || (() => {})}
      />
    );
  }

  if (activeTab === 'students') {
    return (
      <div className="space-y-4 pb-6" id="trainer-students-list-view">
        {/* Header & Search */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-heading font-extrabold text-white">
              Meus Alunos ({students.length})
            </h2>
            <button
              onClick={() => onOpenLoadModal()}
              className="text-xs text-emerald-400 font-bold hover:underline"
            >
              + Registrar Treino
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar aluno ou objetivo..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Student List */}
        <div className="space-y-2">
          {filteredStudents.map((s) => {
            const studentClasses = classes.filter(c => c.studentId === s.id && c.status === 'agendada');
            const nextStudentClass = studentClasses[0];

            return (
              <motion.div
                key={s.id}
                whileTap={{ scale: 0.99 }}
                onClick={() => onSelectStudent(s.id)}
                className="w-full p-3.5 bg-zinc-900/90 border border-zinc-800 hover:border-emerald-500/50 rounded-2xl transition cursor-pointer flex items-center justify-between shadow-sm"
                id={`student-card-${s.id}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={s.avatar}
                      alt={s.name}
                      className="w-11 h-11 rounded-xl object-cover border border-zinc-700"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-zinc-900" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-heading font-bold text-white truncate">
                        {s.name}
                      </h4>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-medium">
                        {s.plan.name.split(' ')[0]}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {s.goal}
                    </p>

                    <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-400">
                      <span className="text-emerald-400 font-semibold">
                        {Math.round((s.attendedClassesCount / Math.max(1, s.totalClassesCount)) * 100)}% freq.
                      </span>
                      <span>&bull;</span>
                      <span className="truncate">
                        Próx: {nextStudentClass ? `${nextStudentClass.time} (${nextStudentClass.date === todayStr ? 'Hoje' : nextStudentClass.date.split('-').slice(1).reverse().join('/')})` : s.preferredTime}
                      </span>
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0" />
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // DEFAULT: HOME (Extremamente objetiva)
  return (
    <div className="space-y-4 pb-6" id="trainer-home-view">
      {/* 1. Topo: Olá, [Nome do Personal] */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-white tracking-tight">
            Olá, Lucas
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Terça-feira, 08 de Setembro
          </p>
        </div>

        {/* Indicador de alunos ativos no topo */}
        <div className="px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-right">
          <span className="text-[10px] text-zinc-500 uppercase font-bold block">Alunos Ativos</span>
          <span className="text-xs font-heading font-extrabold text-emerald-400">
            {activeStudentsCount} alunos
          </span>
        </div>
      </div>

      {/* Botão Principal: + Registrar treino */}
      <button
        onClick={() => onOpenLoadModal()}
        className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-heading font-black text-sm rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.99] cursor-pointer"
        id="home-primary-register-workout-btn"
      >
        <Plus className="w-5 h-5 stroke-[3]" />
        <span>+ Registrar treino</span>
      </button>

      {/* 2. Próxima Aula (Destaque objetivo) */}
      {nextClass && (
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-emerald-500/30 rounded-2xl p-4 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Próxima Aula
            </span>
            <span className="text-xs font-bold text-zinc-300">Hoje</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-2xl font-heading font-black text-white tracking-tight">
                {nextClass.time}
              </div>
              <div className="text-sm font-bold text-zinc-200 mt-0.5">
                {nextClass.studentName}
              </div>
              <div className="text-xs text-zinc-400">
                {nextClass.focusTopic || 'Treino Personalizado'}
              </div>
            </div>

            {/* Quick action buttons for next class */}
            <div className="flex flex-col gap-1.5 shrink-0">
              <button
                onClick={() => onOpenLoadModal(nextClass.studentId)}
                className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Dumbbell className="w-3.5 h-3.5" />
                <span>Registrar</span>
              </button>

              <button
                onClick={() => onCompleteClass(nextClass.id)}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{nextClass.status === 'concluida' ? 'Concluída' : 'Presença'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Aulas de Hoje (Lista Simples) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Hoje ({todayClasses.length} aulas)
          </h3>
          {onChangeTab && (
            <button
              onClick={() => onChangeTab('agenda')}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer"
            >
              Ver agenda completa
            </button>
          )}
        </div>

        <div className="space-y-1.5">
          {todayClasses.map((c) => {
            const isDone = c.status === 'concluida';
            const isNext = nextClass && nextClass.id === c.id && !isDone;

            return (
              <div
                key={c.id}
                onClick={() => onSelectStudent(c.studentId)}
                className={`p-3 rounded-xl border transition flex items-center justify-between cursor-pointer ${
                  isDone
                    ? 'bg-zinc-950/60 border-zinc-850/80 text-zinc-400'
                    : isNext
                    ? 'bg-zinc-900/90 border-emerald-500/40 shadow-sm text-white'
                    : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono text-xs font-bold text-zinc-300 shrink-0">
                    {c.time}
                  </span>
                  <span className="text-zinc-600">—</span>
                  <span className="text-xs font-bold truncate">
                    {c.studentName}
                  </span>
                  <span className="text-[11px] text-zinc-500 truncate hidden sm:inline">
                    ({c.focusTopic})
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isDone ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-medium">
                      Concluída
                    </span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                      Agendada
                    </span>
                  )}
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Alertas Importantes (apenas se houver alerta relevante) */}
      {emotionalAlerts.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span className="text-xs font-bold tracking-tight">Alerta de Atenção</span>
          </div>

          {emotionalAlerts.map(alert => {
            const student = students.find(s => s.id === alert.studentId);
            return (
              <div key={alert.id} className="text-xs text-zinc-300 flex items-center justify-between">
                <span>
                  <strong>{student?.name || 'Aluno'}:</strong> Bem-estar registrado em {alert.score}/15
                  {alert.tag && ` (${alert.tag})`}
                </span>
                <button
                  onClick={() => onSelectStudent(alert.studentId)}
                  className="text-[11px] text-amber-400 hover:underline font-bold shrink-0 ml-2"
                >
                  Ver
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
