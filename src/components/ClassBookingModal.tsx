import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, X, Check, Clock, MapPin, Target } from 'lucide-react';
import { ClassSession, Student } from '../types';

interface ClassBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  selectedStudentId?: string;
  onSave: (newClass: ClassSession) => void;
}

export const ClassBookingModal: React.FC<ClassBookingModalProps> = ({
  isOpen,
  onClose,
  students,
  selectedStudentId,
  onSave
}) => {
  const [studentId, setStudentId] = useState(selectedStudentId || students[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('07:00');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [focus, setFocus] = useState('Hipertrofia - Membros Superiores');
  const [location, setLocation] = useState('Academia BioFit - Sala VIP 1');
  const [trainerNotes, setTrainerNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const newClass: ClassSession = {
      id: `class-${Date.now()}`,
      studentId,
      studentName: student.name,
      date,
      time,
      durationMinutes: Number(durationMinutes),
      status: 'agendada',
      focus: focus.trim() || 'Treino Personalizado',
      location: location.trim() || 'Estúdio',
      trainerNotes: trainerNotes.trim() || undefined
    };

    onSave(newClass);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          className="bg-zinc-900 border-t sm:border border-zinc-800 w-full max-w-md rounded-t-[32px] sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] sm:max-h-[90vh] flex flex-col"
          id="class-booking-modal"
        >
          {/* Mobile Grab Handle */}
          <div className="sm:hidden w-12 h-1.5 bg-zinc-700 rounded-full mx-auto my-2.5 opacity-80 shrink-0" />

          <div className="px-5 sm:px-6 py-3.5 sm:py-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/90 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-base sm:text-lg text-white">Agendar Nova Aula</h3>
                <p className="text-xs text-zinc-400">Organize o cronograma do aluno</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition flex items-center justify-center"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Aluno *</label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id} className="bg-zinc-900 text-white">
                    {s.name} ({s.plan.name})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Data *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Horário *</label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Duração (min)</label>
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value={45}>45 minutos</option>
                  <option value={60}>60 minutos (1h)</option>
                  <option value={75}>75 minutos</option>
                  <option value={90}>90 minutos</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Local</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex: Studio / Sala 2"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Foco / Objetivo do Treino</label>
              <input
                type="text"
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                placeholder="Ex: Peitoral, Ombros & Tríceps (Carga Progressiva)"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Observações Prévias</label>
              <textarea
                rows={2}
                value={trainerNotes}
                onChange={(e) => setTrainerNotes(e.target.value)}
                placeholder="Ex: Trazer toalha e focar no aquecimento escapular..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 resize-none focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                Confirmar Agendamento
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
