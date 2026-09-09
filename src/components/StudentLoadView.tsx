import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Dumbbell, Plus, Flame, Award, Calendar, History, TrendingUp, Filter } from 'lucide-react';
import { LoadProgressionRecord, Student } from '../types';
import { LoadProgressionChart } from './Charts';

interface StudentLoadViewProps {
  student: Student;
  records: LoadProgressionRecord[];
  onOpenNewLoadModal: (initialExercise?: string) => void;
}

export const StudentLoadView: React.FC<StudentLoadViewProps> = ({
  student,
  records,
  onOpenNewLoadModal
}) => {
  const studentRecords = records.filter(r => r.studentId === student.id);

  // Group unique exercises
  const uniqueExercises = Array.from(new Set(studentRecords.map(r => r.exerciseName)));
  const defaultExercise = uniqueExercises.includes('Supino Reto com Barra')
    ? 'Supino Reto com Barra'
    : (uniqueExercises[0] || 'Supino Reto com Barra');

  const [selectedExercise, setSelectedExercise] = useState<string>(defaultExercise);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = ['Todos', 'Peito', 'Pernas', 'Costas', 'Ombros', 'Braços', 'Core'];

  const filteredExercises = uniqueExercises.filter(name => {
    if (selectedCategory === 'Todos') return true;
    const rec = studentRecords.find(r => r.exerciseName === name);
    return rec?.category === selectedCategory;
  });

  const activeExerciseRecords = studentRecords.filter(r => r.exerciseName === selectedExercise);

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-heading font-bold text-white">Evolução de Cargas & Performance</h3>
            <p className="text-xs text-zinc-400">
              {studentRecords.length} registros de sobrecarga progressiva cadastrados
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenNewLoadModal(selectedExercise)}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-lg shadow-amber-500/20"
          id="add-load-record-btn"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Registrar Carga do Treino
        </button>
      </div>

      {/* Category filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`text-xs px-3 py-1.5 rounded-xl font-medium transition whitespace-nowrap border ${
              selectedCategory === cat
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 font-bold'
                : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Exercise selector chips */}
      {filteredExercises.length > 0 ? (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {filteredExercises.map(ex => {
            const isSelected = selectedExercise === ex;
            const exRecs = studentRecords.filter(r => r.exerciseName === ex);
            const max = Math.max(...exRecs.map(r => r.weightKg));

            return (
              <button
                key={ex}
                onClick={() => setSelectedExercise(ex)}
                className={`p-3 rounded-xl border text-left transition min-w-[180px] ${
                  isSelected
                    ? 'bg-zinc-900 border-amber-500 shadow-md ring-1 ring-amber-500'
                    : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <span className="text-[10px] text-zinc-500 block uppercase font-medium">
                  {exRecs[0]?.category}
                </span>
                <span className={`text-xs font-bold block truncate ${isSelected ? 'text-amber-400' : 'text-zinc-200'}`}>
                  {ex}
                </span>
                <span className="text-xs text-zinc-400 mt-1 block">
                  Pico: <strong className="text-white">{max} kg</strong> ({exRecs.length} sessões)
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="p-4 text-xs text-zinc-500 bg-zinc-950 rounded-xl border border-zinc-800">
          Nenhum exercício cadastrado nesta categoria ainda.
        </div>
      )}

      {/* Main Interactive Chart Component */}
      <LoadProgressionChart
        records={activeExerciseRecords}
        exerciseName={selectedExercise}
      />

      {/* Complete Historical Table */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-heading font-bold text-base text-white flex items-center gap-2">
            <History className="w-4 h-4 text-amber-400" />
            Histórico Detalhado de Séries e Observações
          </h4>
          <span className="text-xs text-zinc-400">
            {activeExerciseRecords.length} sessões registradas
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950/80 text-zinc-400 uppercase text-[10px] font-semibold border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Semana / Data</th>
                <th className="py-3 px-4">Carga (kg)</th>
                <th className="py-3 px-4">Volume (Séries x Reps)</th>
                <th className="py-3 px-4">Intensidade (RPE)</th>
                <th className="py-3 px-4">Observações do Personal</th>
                <th className="py-3 px-4 text-right">Destaque</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {activeExerciseRecords
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((r) => (
                  <tr key={r.id} className="hover:bg-zinc-800/40 transition">
                    <td className="py-3 px-4">
                      <span className="font-bold text-white block">{r.weekLabel}</span>
                      <span className="text-[10px] text-zinc-500">{r.date.split('-').reverse().join('/')}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-extrabold text-amber-400">{r.weightKg} kg</span>
                    </td>
                    <td className="py-3 px-4 text-zinc-300 font-medium">
                      {r.sets} séries x {r.reps} reps
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-zinc-800 rounded-md text-[11px] font-medium text-zinc-300">
                        {r.rpe ? `RPE ${r.rpe}` : '--'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-300 italic max-w-xs truncate">
                      "{r.trainerNotes}"
                    </td>
                    <td className="py-3 px-4 text-right">
                      {r.isPersonalRecord ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                          <Flame className="w-3 h-3" /> Recorde (PR)
                        </span>
                      ) : (
                        <span className="text-[10px] text-zinc-500">Regular</span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
