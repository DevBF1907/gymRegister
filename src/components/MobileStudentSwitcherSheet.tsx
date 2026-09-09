import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Search, Check, X, Flame, HeartPulse, Sparkles } from 'lucide-react';
import { Student } from '../types';

interface MobileStudentSwitcherSheetProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  selectedStudentId: string;
  onSelectStudent: (studentId: string) => void;
}

export const MobileStudentSwitcherSheet: React.FC<MobileStudentSwitcherSheetProps> = ({
  isOpen,
  onClose,
  students,
  selectedStudentId,
  onSelectStudent
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.goal.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm">
        <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="relative z-10 w-full max-w-md bg-zinc-900 border-t border-zinc-800 rounded-t-[32px] p-5 pb-8 shadow-2xl max-h-[85vh] flex flex-col"
          id="mobile-student-switcher-sheet"
        >
          {/* Grab Handle */}
          <div className="w-12 h-1.5 bg-zinc-700 rounded-full mx-auto mb-3 opacity-80 shrink-0" />

          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-base text-white">
                  Selecionar Aluno
                </h3>
                <p className="text-[11px] text-zinc-400">
                  {students.length} alunos cadastrados
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative mt-3 shrink-0">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar aluno por nome ou objetivo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9.5 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Student List */}
          <div className="space-y-2 mt-3 overflow-y-auto flex-1 pr-1">
            {filtered.map((s) => {
              const isSelected = s.id === selectedStudentId;

              return (
                <button
                  key={s.id}
                  onClick={() => {
                    onSelectStudent(s.id);
                    onClose();
                  }}
                  className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-500/50 shadow-sm shadow-emerald-500/10'
                      : 'bg-zinc-950/70 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-950'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={s.avatar}
                        alt={s.name}
                        className="w-11 h-11 rounded-xl object-cover border border-zinc-700"
                      />
                      {isSelected && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center text-[10px] font-black">
                          ✓
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          {s.name}
                        </span>
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider bg-zinc-800 text-zinc-300">
                          {s.plan.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {s.goal} &bull; {s.age} anos
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-400">
                        <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
                          <Flame className="w-3 h-3" /> {s.streakCount} sem
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-0.5 text-emerald-400">
                          <HeartPulse className="w-3 h-3" /> {s.latestEmotionalScore || 13}/15
                        </span>
                      </div>
                    </div>
                  </div>

                  {isSelected ? (
                    <span className="text-xs font-bold text-emerald-400 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                      Ativo
                    </span>
                  ) : (
                    <span className="text-xs text-zinc-500 font-medium">
                      Selecionar
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
