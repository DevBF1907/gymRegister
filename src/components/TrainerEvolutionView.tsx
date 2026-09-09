import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Dumbbell, Plus, TrendingUp, Calendar, Filter, ChevronRight, Award } from 'lucide-react';
import { Student, LoadProgressionRecord } from '../types';
import { LoadProgressionChart } from './Charts';

interface TrainerEvolutionViewProps {
  students: Student[];
  loadRecords: LoadProgressionRecord[];
  onOpenLoadModal: (studentId?: string, initialExercise?: string) => void;
  onSelectStudentProfile?: (studentId: string) => void;
}

type PeriodFilter = '1m' | '3m' | '6m' | 'all';

export const TrainerEvolutionView: React.FC<TrainerEvolutionViewProps> = ({
  students,
  loadRecords,
  onOpenLoadModal,
  onSelectStudentProfile
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [period, setPeriod] = useState<PeriodFilter>('3m');

  // Get all exercises for selected student
  const studentRecords = useMemo(() => {
    return loadRecords.filter(r => r.studentId === selectedStudentId);
  }, [loadRecords, selectedStudentId]);

  const uniqueExercises = useMemo(() => {
    const set = new Set<string>();
    studentRecords.forEach(r => set.add(r.exerciseName));
    if (set.size === 0) {
      return ['Supino reto', 'Agachamento livre', 'Levantamento terra'];
    }
    return Array.from(set);
  }, [studentRecords]);

  const [selectedExercise, setSelectedExercise] = useState<string>(uniqueExercises[0] || 'Supino reto');

  // Keep selectedExercise valid if student changes
  React.useEffect(() => {
    if (!uniqueExercises.includes(selectedExercise) && uniqueExercises.length > 0) {
      setSelectedExercise(uniqueExercises[0]);
    }
  }, [selectedStudentId, uniqueExercises, selectedExercise]);

  // Records for selected exercise, sorted by date ascending for chart
  const exerciseRecordsAsc = useMemo(() => {
    return studentRecords
      .filter(r => r.exerciseName.toLowerCase().trim() === selectedExercise.toLowerCase().trim())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [studentRecords, selectedExercise]);

  // Apply period filter
  const filteredRecords = useMemo(() => {
    if (exerciseRecordsAsc.length === 0) return [];
    if (period === 'all') return exerciseRecordsAsc;

    const daysMap = { '1m': 30, '3m': 90, '6m': 180 };
    const maxDays = daysMap[period];
    const latestDate = new Date(exerciseRecordsAsc[exerciseRecordsAsc.length - 1].date);
    const cutoff = new Date(latestDate.getTime() - maxDays * 24 * 60 * 60 * 1000);

    const res = exerciseRecordsAsc.filter(r => new Date(r.date) >= cutoff);
    return res.length > 0 ? res : exerciseRecordsAsc;
  }, [exerciseRecordsAsc, period]);

  // Metrics: Última carga & Evolução
  const firstRecord = exerciseRecordsAsc[0];
  const lastRecord = exerciseRecordsAsc[exerciseRecordsAsc.length - 1];

  const lastWeight = lastRecord ? lastRecord.weightKg : 0;
  const initialWeight = firstRecord ? firstRecord.weightKg : 0;
  const evolutionKg = Number((lastWeight - initialWeight).toFixed(1));

  // Reverse list for history view (most recent first)
  const historyDesc = useMemo(() => {
    return [...filteredRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [filteredRecords]);

  const currentStudent = students.find(s => s.id === selectedStudentId);

  const formatDateDisplay = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = parts[2];
        const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
        const m = months[parseInt(parts[1], 10) - 1] || parts[1];
        return `${d} ${m}`;
      }
    } catch {
      // fallback
    }
    return dateStr;
  };

  return (
    <div className="space-y-4 pb-6" id="trainer-evolution-view">
      {/* Student & Exercise Selectors */}
      <div className="grid grid-cols-2 gap-2 bg-zinc-900/90 border border-zinc-800 p-2.5 rounded-2xl">
        <div>
          <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
            Aluno
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {students.map(s => (
              <option key={s.id} value={s.id} className="bg-zinc-900 text-white">
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
            Exercício
          </label>
          <select
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            {uniqueExercises.map(ex => (
              <option key={ex} value={ex} className="bg-zinc-900 text-white">
                {ex}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metric Cards: Última Carga & Evolução */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3.5 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-tight">
            Última carga
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
              {lastWeight}
            </span>
            <span className="text-xs text-zinc-500 font-bold">kg</span>
          </div>
          <span className="text-[10px] text-zinc-500 mt-1">
            {lastRecord ? formatDateDisplay(lastRecord.date) : 'Sem registro'}
          </span>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3.5 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-tight">
            Evolução
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className={`text-2xl sm:text-3xl font-heading font-extrabold ${
              evolutionKg > 0 ? 'text-emerald-400' : evolutionKg === 0 ? 'text-zinc-300' : 'text-amber-400'
            }`}>
              {evolutionKg > 0 ? `+${evolutionKg}` : evolutionKg}
            </span>
            <span className="text-xs text-zinc-500 font-bold">kg</span>
          </div>
          <span className="text-[10px] text-emerald-400/90 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {evolutionKg > 0 ? 'Progressão consistente' : 'Manutenção de carga'}
          </span>
        </div>
      </div>

      {/* Single Main Chart: Carga x Data */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3.5 space-y-3">
        {/* Period Filter Tabs: 1 mês | 3 meses | 6 meses | Tudo */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Dumbbell className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-heading font-bold text-white">Carga × Data</h4>
          </div>

          <div className="flex items-center p-0.5 bg-zinc-950 border border-zinc-800 rounded-lg">
            {(['1m', '3m', '6m', 'all'] as PeriodFilter[]).map((p) => {
              const labels: Record<PeriodFilter, string> = {
                '1m': '1 mês',
                '3m': '3 meses',
                '6m': '6 meses',
                'all': 'Tudo'
              };
              return (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-2 py-1 rounded-md text-[10px] font-bold transition cursor-pointer ${
                    period === p
                      ? 'bg-amber-500 text-zinc-950'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {labels[p]}
                </button>
              );
            })}
          </div>
        </div>

        {/* The Chart */}
        <div className="h-44 w-full pt-2">
          {filteredRecords.length > 0 ? (
            <LoadProgressionChart records={filteredRecords} />
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-zinc-500">
              Nenhum registro para {selectedExercise} no período selecionado.
            </div>
          )}
        </div>
      </div>

      {/* Histórico simples em lista */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-heading font-bold text-white">Histórico recente</h4>
          <button
            onClick={() => onOpenLoadModal(selectedStudentId, selectedExercise)}
            className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> + Registrar carga
          </button>
        </div>

        {historyDesc.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-4">Nenhum treino registrado para este exercício.</p>
        ) : (
          <div className="divide-y divide-zinc-850">
            {historyDesc.map((rec) => (
              <div key={rec.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-zinc-300">
                    {formatDateDisplay(rec.date)}
                  </span>
                  {rec.isPersonalRecord && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-400 text-[9px] font-extrabold border border-amber-500/30">
                      PR
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-400">
                    {rec.sets}x{rec.reps}
                  </span>
                  <span className="font-heading font-black text-sm text-white">
                    {rec.weightKg} kg
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
