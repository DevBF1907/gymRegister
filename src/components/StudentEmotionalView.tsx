import React from 'react';
import { motion } from 'motion/react';
import { HeartPulse, Plus, AlertTriangle, Calendar, Info, Smile, Sparkles, TrendingUp, HelpCircle } from 'lucide-react';
import { EmotionalCheckin, Student } from '../types';
import { EmotionalEvolutionChart } from './Charts';

interface StudentEmotionalViewProps {
  student: Student;
  checkins: EmotionalCheckin[];
  onOpenCheckinModal: () => void;
}

export const StudentEmotionalView: React.FC<StudentEmotionalViewProps> = ({
  student,
  checkins,
  onOpenCheckinModal
}) => {
  const studentCheckins = checkins.filter(c => c.studentId === student.id);
  const sorted = [...studentCheckins].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Weekly and monthly averages calculation:
  // Last 7 days / weekly average
  const last4 = sorted.slice(-4);
  const weeklyAvg = last4.length > 0
    ? (last4.reduce((acc, c) => acc + c.score, 0) / last4.length).toFixed(1)
    : '--';

  // Monthly average (all entries in current month or last 12 entries)
  const monthlyAvg = sorted.length > 0
    ? (sorted.reduce((acc, c) => acc + c.score, 0) / sorted.length).toFixed(1)
    : '--';

  // Detect recent trend
  let trendText = 'Padrão estável de disposição';
  let trendColor = 'text-emerald-400';
  if (sorted.length >= 2) {
    const lastScore = sorted[sorted.length - 1].score;
    const prevScore = sorted[sorted.length - 2].score;
    if (lastScore - prevScore >= 3) {
      trendText = 'Tendência de alta: Recuperação acentuada de energia';
      trendColor = 'text-cyan-400';
    } else if (prevScore - lastScore >= 4) {
      trendText = 'Atenção pedagógica: Queda acentuada pós sessão anterior';
      trendColor = 'text-amber-400';
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner with Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-heading font-bold text-white">Histórico & Bem-Estar Subjetivo (0 a 15)</h3>
            <p className="text-xs text-zinc-400">
              {studentCheckins.length} respostas registradas durante as sessões
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCheckinModal}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-lg shadow-emerald-500/20"
          id="trigger-checkin-btn"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Novo Check-in Emocional
        </button>
      </div>

      {/* KPI Cards: Weekly Average, Monthly Average, Trend Indicator */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Média Semanal</span>
            <span className="text-[10px] text-zinc-500">Últimas 4 aulas</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-heading font-extrabold text-emerald-400">
              {weeklyAvg}
            </span>
            <span className="text-xs text-zinc-400 font-medium">/ 15 pontos</span>
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">
            {Number(weeklyAvg) >= 11 ? 'Zona de excelente disposição' : 'Zona de acompanhamento moderado'}
          </span>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Média Mensal</span>
            <span className="text-[10px] text-zinc-500">Consolidado 30 dias</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-heading font-extrabold text-cyan-400">
              {monthlyAvg}
            </span>
            <span className="text-xs text-zinc-400 font-medium">/ 15 pontos</span>
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">
            Índice contínuo de adaptação ao treinamento
          </span>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Diagnóstico de Padrão</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className={`text-sm font-bold mt-2 ${trendColor}`}>
            {trendText}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 leading-snug">
            Auxilia o treinador a decidir se aumenta carga ou introduz regenerativo.
          </p>
        </div>
      </div>

      {/* Main Interactive Temporal Evolution Chart */}
      <EmotionalEvolutionChart
        checkins={studentCheckins}
        studentName={student.name}
      />

      {/* History by Class (Aula a Aula) */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <h4 className="font-heading font-bold text-base text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-400" />
          Histórico Detalhado por Aula
        </h4>

        <div className="space-y-2.5">
          {sorted
            .slice()
            .reverse()
            .map((c) => {
              let badgeColor = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
              if (c.score <= 5) badgeColor = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
              else if (c.score <= 9) badgeColor = 'bg-amber-500/15 text-amber-400 border-amber-500/30';

              return (
                <div
                  key={c.id}
                  className="p-4 bg-zinc-950 rounded-xl border border-zinc-850 hover:border-zinc-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-heading font-bold px-2.5 py-1 rounded-lg border ${badgeColor}`}>
                        {c.score} / 15
                      </span>
                      <span className="text-xs font-bold text-white">
                        {c.date.split('-').reverse().join('/')} às {c.time}
                      </span>
                      {c.tag && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-850 text-zinc-300 border border-zinc-750">
                          {c.tag}
                        </span>
                      )}
                    </div>

                    {c.note && (
                      <p className="text-xs text-zinc-300 italic pt-1">
                        "{c.note}"
                      </p>
                    )}

                    {c.trainerAction && (
                      <div className="text-[11px] text-emerald-400 pt-0.5 font-medium">
                        <strong>Conduta adotada:</strong> {c.trainerAction}
                      </div>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] text-zinc-500 block">Status da Sessão</span>
                    <span className="text-xs font-semibold text-zinc-300">Registrado com sucesso</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Mandatory Medical Disclaimer Box */}
      <div className="bg-zinc-950/80 rounded-2xl p-4 border border-zinc-800 flex items-start gap-3">
        <Info className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-400 space-y-1 leading-relaxed">
          <strong className="text-zinc-200">Aviso Ético e Legal de Utilização:</strong>
          <p>
            O módulo de Acompanhamento Emocional tem como finalidade exclusiva coletar percepções subjetivas e imediatas de bem-estar, cansaço e motivação declaradas pelo aluno antes ou durante os treinos. Essa ferramenta <strong>não realiza diagnóstico psicológico, psiquiátrico ou médico</strong>. É um recurso pedagógico para que o personal trainer ajuste a carga de trabalho, volume e recuperação nas sessões de treinamento físico.
          </p>
        </div>
      </div>
    </div>
  );
};
