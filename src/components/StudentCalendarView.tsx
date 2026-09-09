import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Clock, MapPin, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, Plus, HeartPulse, Dumbbell, Sparkles } from 'lucide-react';
import { ClassSession, Student } from '../types';

interface StudentCalendarViewProps {
  student: Student;
  classes: ClassSession[];
  onOpenBookingModal: () => void;
  onOpenEmotionalModal: (classSession?: ClassSession) => void;
  onOpenLoadModal: () => void;
  onUpdateClassStatus?: (classId: string, status: ClassSession['status']) => void;
}

export const StudentCalendarView: React.FC<StudentCalendarViewProps> = ({
  student,
  classes,
  onOpenBookingModal,
  onOpenEmotionalModal,
  onOpenLoadModal,
  onUpdateClassStatus
}) => {
  // Current month reference: September 2026 (or dynamic)
  const [currentDate, setCurrentDate] = useState<Date>(new Date('2026-09-08T12:00:00'));
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-09-08');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'agendada' | 'concluida'>('todos');

  // Filter student classes
  const studentClasses = classes.filter(c => c.studentId === student.id);

  // Filtered by status
  const filteredClasses = studentClasses.filter(c => {
    if (statusFilter === 'todos') return true;
    return c.status === statusFilter;
  });

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed (8 = September)
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Count attendance stats
  const completedCount = studentClasses.filter(c => c.status === 'concluida').length;
  const upcomingCount = studentClasses.filter(c => c.status === 'agendada').length;

  const classesOnSelectedDate = studentClasses.filter(c => c.date === selectedDateStr);

  return (
    <div className="space-y-6">
      {/* Top Banner with Frequency & Plan Quick Status */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-zinc-900/80 border border-zinc-800 p-2.5 rounded-xl flex flex-col justify-between text-center">
          <span className="text-[10px] text-zinc-400 font-medium block">Frequência</span>
          <span className="text-lg font-heading font-extrabold text-white my-0.5">{student.plan.weeklyFrequency}x/sem</span>
          <span className="text-[9px] text-zinc-500 truncate">{student.activeDays.join(', ')}</span>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 p-2.5 rounded-xl flex flex-col justify-between text-center">
          <span className="text-[10px] text-zinc-400 font-medium block">Concluídas</span>
          <span className="text-lg font-heading font-extrabold text-emerald-400 my-0.5">{completedCount}</span>
          <span className="text-[9px] text-zinc-500">{student.streakCount} sem ativas</span>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 p-2.5 rounded-xl flex flex-col justify-between text-center">
          <span className="text-[10px] text-zinc-400 font-medium block">Próximas</span>
          <span className="text-lg font-heading font-extrabold text-cyan-400 my-0.5">{upcomingCount}</span>
          <span className="text-[9px] text-zinc-500 truncate">{student.preferredTime}</span>
        </div>
      </div>

      {/* Main Calendar + Classes List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Calendar Box (7 cols) */}
        <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-3.5 sm:p-4 space-y-3">
          {/* Month Header */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-heading font-bold text-sm sm:text-base text-white">
                {monthNames[month]} {year}
              </h4>
              <p className="text-[11px] text-zinc-400">Toque em um dia para ver os treinos</p>
            </div>
            <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
              <button
                onClick={prevMonth}
                className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-850 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-850 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-zinc-400 pb-1 border-b border-zinc-800/80">
            <span>Dom</span>
            <span>Seg</span>
            <span>Ter</span>
            <span>Qua</span>
            <span>Qui</span>
            <span>Sex</span>
            <span>Sáb</span>
          </div>

          {/* Day Cells */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells before month start */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="h-10 sm:h-12 rounded-lg bg-transparent" />
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isSelected = dateStr === selectedDateStr;
              const isToday = dateStr === '2026-09-08';

              const dayClasses = studentClasses.filter(c => c.date === dateStr);
              const hasCompleted = dayClasses.some(c => c.status === 'concluida');
              const hasUpcoming = dayClasses.some(c => c.status === 'agendada');

              return (
                <button
                  key={dayNum}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`h-10 sm:h-12 rounded-lg p-1 flex flex-col justify-between items-center transition relative border cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-500 text-white font-bold ring-1 ring-emerald-500'
                      : isToday
                      ? 'bg-zinc-800/80 border-zinc-700 text-white'
                      : 'bg-zinc-950/60 border-zinc-850/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between w-full px-0.5">
                    <span className={`text-[11px] ${isToday ? 'text-emerald-400 font-extrabold' : ''}`}>
                      {dayNum}
                    </span>
                    {isToday && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    )}
                  </div>

                  {/* Badges for classes on that day */}
                  <div className="flex items-center gap-1 mt-auto">
                    {hasCompleted && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Aula realizada" />
                    )}
                    {hasUpcoming && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" title="Aula agendada" />
                    )}
                    {dayClasses.length > 1 && (
                      <span className="text-[8px] font-bold text-zinc-400">+{dayClasses.length}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-[10px] text-zinc-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Concluída
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Agendada
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Hoje
              </span>
            </div>
            <span className="text-zinc-500 hidden sm:inline">Check-in 0 a 15</span>
          </div>
        </div>

        {/* Selected Date Details & Classes List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Selected Date Header */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">Dia Selecionado</span>
                <h4 className="font-heading font-bold text-base text-white">
                  {selectedDateStr.split('-').reverse().join('/')}
                </h4>
              </div>
              <button
                onClick={onOpenBookingModal}
                className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Agendar Aula
              </button>
            </div>

            {/* Classes on Selected Date */}
            {classesOnSelectedDate.length === 0 ? (
              <div className="py-8 text-center text-zinc-500 text-xs space-y-2">
                <p>Nenhuma aula registrada nesta data.</p>
                <button
                  onClick={onOpenBookingModal}
                  className="text-emerald-400 hover:underline font-medium"
                >
                  Deseja agendar uma sessão?
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {classesOnSelectedDate.map(c => (
                  <div
                    key={c.id}
                    className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-bold text-white">{c.time}</span>
                        <span className="text-xs text-zinc-500 font-medium">({c.durationMinutes} min)</span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        c.status === 'concluida'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                      }`}>
                        {c.status === 'concluida' ? 'Concluída' : 'Agendada'}
                      </span>
                    </div>

                    <div>
                      <h5 className="text-xs font-bold text-zinc-200">{c.focus}</h5>
                      <p className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-zinc-500" /> {c.location}
                      </p>
                    </div>

                    {c.trainerNotes && (
                      <p className="text-[11px] text-zinc-400 italic bg-zinc-900 p-2 rounded-lg border border-zinc-850">
                        "{c.trainerNotes}"
                      </p>
                    )}

                    {/* Action buttons inside class card */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => onOpenEmotionalModal(c)}
                        className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition border ${
                          c.emotionalScore !== undefined
                            ? 'bg-zinc-900 border-zinc-800 text-zinc-300'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                        }`}
                      >
                        <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
                        {c.emotionalScore !== undefined
                          ? `Bem-Estar: ${c.emotionalScore}/15`
                          : 'Check-in Emocional'}
                      </button>

                      <button
                        onClick={onOpenLoadModal}
                        className="py-1.5 px-2.5 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <Dumbbell className="w-3.5 h-3.5 text-amber-400" />
                        Cargas
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Agenda Feed */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-3">
            <h4 className="font-heading font-bold text-sm text-white flex items-center justify-between">
              <span>Todas as Próximas Aulas</span>
              <span className="text-xs font-normal text-zinc-400">{upcomingCount} agendadas</span>
            </h4>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {studentClasses.filter(c => c.status === 'agendada').map(c => (
                <div
                  key={c.id}
                  onClick={() => setSelectedDateStr(c.date)}
                  className="p-2.5 bg-zinc-950/70 border border-zinc-800/80 rounded-xl hover:border-zinc-700 transition cursor-pointer flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white block">{c.focus}</span>
                    <span className="text-[10px] text-zinc-400">{c.date.split('-').reverse().join('/')} às {c.time} &bull; {c.location}</span>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-semibold px-2 py-0.5 bg-cyan-950/40 border border-cyan-800/40 rounded-full">
                    Agendada
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
