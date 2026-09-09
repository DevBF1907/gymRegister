import React from 'react';
import { motion } from 'motion/react';
import {
  Dumbbell,
  Users,
  User,
  Calendar,
  HeartPulse,
  Plus,
  RotateCcw,
  Sparkles,
  Shield,
  ChevronDown
} from 'lucide-react';
import { Student } from '../types';
import { PERSONAL_INFO } from '../data/mockData';

interface HeaderProps {
  viewMode: 'trainer' | 'student';
  onToggleViewMode: (mode: 'trainer' | 'student') => void;
  students: Student[];
  selectedStudentId: string;
  onSelectStudent: (studentId: string) => void;
  onOpenBookingModal: () => void;
  onOpenLoadModal: () => void;
  onOpenEmotionalModal: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onToggleViewMode,
  students,
  selectedStudentId,
  onSelectStudent,
  onOpenBookingModal,
  onOpenLoadModal,
  onOpenEmotionalModal,
  onResetData
}) => {
  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0];

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Logo & Platform Title */}
          <div className="flex items-center justify-between sm:justify-start gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20">
                <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center text-emerald-400">
                  <Dumbbell className="w-5 h-5" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-heading font-extrabold text-lg text-white tracking-tight">
                    Apex<span className="text-emerald-400">Personal</span>
                  </h1>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-zinc-800 text-zinc-300 rounded border border-zinc-700">
                    PRO
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 hidden sm:block">
                  {PERSONAL_INFO.name} &bull; {PERSONAL_INFO.cref}
                </p>
              </div>
            </div>

            {/* Mobile View Toggle */}
            <div className="sm:hidden flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
              <button
                onClick={() => onToggleViewMode('trainer')}
                className={`p-1.5 rounded-lg text-xs font-bold transition ${
                  viewMode === 'trainer' ? 'bg-emerald-500 text-zinc-950' : 'text-zinc-400'
                }`}
              >
                Personal
              </button>
              <button
                onClick={() => onToggleViewMode('student')}
                className={`p-1.5 rounded-lg text-xs font-bold transition ${
                  viewMode === 'student' ? 'bg-emerald-500 text-zinc-950' : 'text-zinc-400'
                }`}
              >
                Aluno
              </button>
            </div>
          </div>

          {/* Center / Right controls */}
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3">
            {/* Desktop View Switcher */}
            <div className="hidden sm:flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800">
              <button
                onClick={() => onToggleViewMode('trainer')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  viewMode === 'trainer'
                    ? 'bg-emerald-500 text-zinc-950 shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
                id="toggle-trainer-view"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Painel do Personal</span>
              </button>

              <button
                onClick={() => onToggleViewMode('student')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  viewMode === 'student'
                    ? 'bg-emerald-500 text-zinc-950 shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
                id="toggle-student-view"
              >
                <User className="w-3.5 h-3.5" />
                <span>Área do Aluno</span>
              </button>
            </div>

            {/* Student Selector when in student view (or quick switch) */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={selectedStudentId}
                  onChange={(e) => {
                    onSelectStudent(e.target.value);
                  }}
                  className="appearance-none bg-zinc-900 border border-zinc-800 rounded-xl pl-3 pr-8 py-1.5 text-xs font-semibold text-zinc-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  title="Selecionar Aluno"
                  id="header-student-select"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id} className="bg-zinc-900 text-white">
                      {s.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>

              {/* Quick Action Buttons */}
              <button
                onClick={onOpenEmotionalModal}
                className="px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                title="Questionário emocional 0-15"
                id="header-emotional-checkin-btn"
              >
                <HeartPulse className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Check-in (0-15)</span>
              </button>

              <button
                onClick={onOpenLoadModal}
                className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                title="Registrar carga de treino"
                id="header-load-btn"
              >
                <Dumbbell className="w-3.5 h-3.5" />
                <span className="hidden md:inline">+ Carga</span>
              </button>

              <button
                onClick={onOpenBookingModal}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                title="Agendar aula"
                id="header-booking-btn"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span className="hidden sm:inline">Nova Aula</span>
              </button>

              <button
                onClick={onResetData}
                className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition"
                title="Resetar dados para padrão inicial"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
