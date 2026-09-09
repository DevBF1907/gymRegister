import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  CheckCircle2,
  Dumbbell,
  HeartPulse,
  Plus,
  ChevronRight,
  X,
  Sparkles,
  MapPin,
  Check
} from 'lucide-react';
import { ClassSession, Student } from '../types';

interface TrainerAgendaViewProps {
  classes: ClassSession[];
  students: Student[];
  onSelectStudent: (studentId: string) => void;
  onOpenBookingModal: () => void;
  onOpenLoadModal: (studentId?: string) => void;
  onOpenEmotionalModal: (studentId?: string, classSession?: ClassSession) => void;
  onCompleteClass: (classId: string) => void;
}

type AgendaPeriod = 'today' | 'week' | 'month';

export const TrainerAgendaView: React.FC<TrainerAgendaViewProps> = ({
  classes,
  students,
  onSelectStudent,
  onOpenBookingModal,
  onOpenLoadModal,
  onOpenEmotionalModal,
  onCompleteClass
}) => {
  const [period, setPeriod] = useState<AgendaPeriod>('today');
  const [selectedClass, setSelectedClass] = useState<ClassSession | null>(null);

  const todayStr = '2026-09-08';

  // Filter classes based on period
  const filteredClasses = classes.filter(c => {
    if (period === 'today') {
      return c.date === todayStr;
    }
    if (period === 'week') {
      // 7 days around todayStr
      return c.date >= '2026-09-07' && c.date <= '2026-09-14';
    }
    // month
    return c.date.startsWith('2026-09');
  }).sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.time.localeCompare(b.time);
  });

  const getStudent = (studentId: string) => students.find(s => s.id === studentId);

  return (
    <div className="space-y-4 pb-6" id="trainer-agenda-view">
      {/* Top Controls: Period selector + New Class */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
          <button
            onClick={() => setPeriod('today')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              period === 'today'
                ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Hoje
          </button>
          <button
            onClick={() => setPeriod('week')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              period === 'week'
                ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              period === 'month'
                ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Mês
          </button>
        </div>

        <button
          onClick={onOpenBookingModal}
          className="h-9 px-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-zinc-700/60 transition cursor-pointer"
          id="agenda-new-class-btn"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-400" />
          <span>Agendar</span>
        </button>
      </div>

      {/* Date Header Subtitle */}
      <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
        <span className="font-semibold text-zinc-300">
          {period === 'today' && 'Terça-feira, 08 de Setembro'}
          {period === 'week' && 'Semana de 07 a 14 de Setembro'}
          {period === 'month' && 'Setembro de 2026'}
        </span>
        <span>{filteredClasses.length} {filteredClasses.length === 1 ? 'aula' : 'aulas'}</span>
      </div>

      {/* Simple List of Classes */}
      {filteredClasses.length === 0 ? (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 text-center space-y-2">
          <CalendarIcon className="w-8 h-8 text-zinc-600 mx-auto" />
          <p className="text-xs text-zinc-400 font-medium">Nenhuma aula agendada para este período.</p>
          <button
            onClick={onOpenBookingModal}
            className="text-xs text-emerald-400 font-bold hover:underline"
          >
            + Agendar aula agora
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredClasses.map((c) => {
            const student = getStudent(c.studentId);
            const isDone = c.status === 'concluida';

            return (
              <motion.div
                key={c.id}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelectedClass(c)}
                className={`w-full p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between text-left ${
                  isDone
                    ? 'bg-zinc-950/60 border-zinc-800/80 opacity-75'
                    : 'bg-zinc-900/90 border-zinc-800 hover:border-emerald-500/50 shadow-sm'
                }`}
                id={`agenda-class-${c.id}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center font-bold shrink-0 ${
                    isDone
                      ? 'bg-zinc-800 text-zinc-400'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    <span className="text-xs tracking-tight">{c.time}</span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-heading font-extrabold text-white truncate">
                        {c.studentName}
                      </span>
                      {isDone && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                          Concluída
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {c.focus || 'Treino Personalizado'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-zinc-500 shrink-0">
                  <span className="text-[11px] text-zinc-400 hidden sm:inline">Opções</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Quick Action Bottom Sheet on Class Tap */}
      <AnimatePresence>
        {selectedClass && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="bg-zinc-900 border-t sm:border border-zinc-800 w-full max-w-sm rounded-t-[28px] sm:rounded-2xl shadow-2xl p-5 space-y-4"
              id="agenda-class-action-sheet"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
                    {selectedClass.time}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-white">{selectedClass.studentName}</h3>
                    <p className="text-[11px] text-zinc-400">{selectedClass.focus}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedClass(null)}
                  className="w-7 h-7 rounded-lg text-zinc-400 hover:text-white flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 4 Quick Actions Mandated by User */}
              <div className="space-y-2">
                {/* 1. Abrir aluno */}
                <button
                  onClick={() => {
                    const sId = selectedClass.studentId;
                    setSelectedClass(null);
                    onSelectStudent(sId);
                  }}
                  className="w-full h-11 px-3.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-xl flex items-center gap-3 text-left transition cursor-pointer text-xs font-semibold text-zinc-200"
                >
                  <User className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>1. Abrir perfil do aluno</span>
                </button>

                {/* 2. Registrar treino */}
                <button
                  onClick={() => {
                    const sId = selectedClass.studentId;
                    setSelectedClass(null);
                    onOpenLoadModal(sId);
                  }}
                  className="w-full h-11 px-3.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-xl flex items-center gap-3 text-left transition cursor-pointer text-xs font-semibold text-zinc-200"
                >
                  <Dumbbell className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>2. Registrar treino / cargas</span>
                </button>

                {/* 3. Registrar presença */}
                <button
                  onClick={() => {
                    onCompleteClass(selectedClass.id);
                    setSelectedClass(null);
                  }}
                  className={`w-full h-11 px-3.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-xl flex items-center gap-3 text-left transition cursor-pointer text-xs font-semibold ${
                    selectedClass.status === 'concluida' ? 'text-zinc-500' : 'text-zinc-200'
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${selectedClass.status === 'concluida' ? 'text-zinc-600' : 'text-emerald-400'}`} />
                  <span>
                    {selectedClass.status === 'concluida' ? 'Presença já registrada (Concluída)' : '3. Registrar presença (Concluir)'}
                  </span>
                </button>

                {/* 4. Fazer check-in de bem-estar */}
                <button
                  onClick={() => {
                    const sId = selectedClass.studentId;
                    const cSession = selectedClass;
                    setSelectedClass(null);
                    onOpenEmotionalModal(sId, cSession);
                  }}
                  className="w-full h-11 px-3.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-xl flex items-center gap-3 text-left transition cursor-pointer text-xs font-semibold text-zinc-200"
                >
                  <HeartPulse className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>4. Fazer check-in de bem-estar (0-15)</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
