import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Award, AlertTriangle, CheckCircle2, Flame, HeartPulse } from 'lucide-react';
import { LoadProgressionRecord, EmotionalCheckin } from '../types';

interface LoadProgressionChartProps {
  records: LoadProgressionRecord[];
  exerciseName: string;
}

export const LoadProgressionChart: React.FC<LoadProgressionChartProps> = ({ records, exerciseName }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Sort chronologically
  const sorted = [...records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (sorted.length === 0) {
    return (
      <div className="p-8 text-center bg-zinc-950/60 rounded-2xl border border-zinc-800/80 text-zinc-500">
        Nenhum registro de carga cadastrado para {exerciseName}.
      </div>
    );
  }

  const initialWeight = sorted[0].weightKg;
  const currentWeight = sorted[sorted.length - 1].weightKg;
  const maxWeight = Math.max(...sorted.map(r => r.weightKg));
  const minWeight = Math.min(...sorted.map(r => r.weightKg));
  const diffKg = currentWeight - initialWeight;
  const percentGain = initialWeight > 0 ? Math.round((diffKg / initialWeight) * 100) : 0;

  // SVG dimensions
  const width = 600;
  const height = 220;
  const paddingX = 50;
  const paddingY = 35;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const yMin = Math.max(0, Math.floor(minWeight * 0.7));
  const yMax = Math.ceil(maxWeight * 1.25);
  const yRange = yMax - yMin || 1;

  const points = sorted.map((r, idx) => {
    const x = paddingX + (idx / Math.max(1, sorted.length - 1)) * chartWidth;
    const y = height - paddingY - ((r.weightKg - yMin) / yRange) * chartHeight;
    return { x, y, record: r };
  });

  const pathD = points.length === 1
    ? `M ${points[0].x - 30} ${points[0].y} L ${points[0].x + 30} ${points[0].y}`
    : points.reduce((acc, p, i) => {
        if (i === 0) return `M ${p.x} ${p.y}`;
        // smooth cubic bezier
        const prev = points[i - 1];
        const cx1 = prev.x + (p.x - prev.x) / 2;
        const cy1 = prev.y;
        const cx2 = prev.x + (p.x - prev.x) / 2;
        const cy2 = p.y;
        return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p.x} ${p.y}`;
      }, '');

  const areaD = points.length > 1
    ? `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
    : '';

  return (
    <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-5 space-y-4">
      {/* Header with KPI cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <h4 className="font-heading font-bold text-base text-white">{exerciseName}</h4>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Evolução ao longo de {sorted.length} registros registrados
          </p>
        </div>

        {/* Quick stat pill */}
        <div className="flex items-center gap-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-right">
            <span className="text-[10px] text-zinc-400 block uppercase font-medium">Carga Inicial</span>
            <span className="text-sm font-bold text-zinc-300">{initialWeight} kg</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-right">
            <span className="text-[10px] text-zinc-400 block uppercase font-medium">Carga Atual</span>
            <span className="text-sm font-bold text-white">{currentWeight} kg</span>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-1.5 text-right">
            <span className="text-[10px] text-amber-400 block uppercase font-medium">Evolução</span>
            <span className="text-sm font-extrabold text-amber-400">
              {diffKg >= 0 ? `+${diffKg} kg` : `${diffKg} kg`} ({diffKg >= 0 ? `+${percentGain}%` : `${percentGain}%`})
            </span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="loadAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="loadLineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0, 0.33, 0.66, 1].map((ratio, i) => {
            const y = height - paddingY - ratio * chartHeight;
            const weightVal = Math.round(yMin + ratio * yRange);
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.07)"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 10}
                  y={y + 4}
                  fill="#71717a"
                  fontSize="10"
                  textAnchor="end"
                  fontFamily="sans-serif"
                >
                  {weightVal}kg
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          {areaD && (
            <path d={areaD} fill="url(#loadAreaGradient)" />
          )}

          {/* Main Line */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#loadLineGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Points */}
          {points.map((pt, idx) => {
            const isHovered = hoveredIdx === idx;
            const isMax = pt.record.weightKg === maxWeight;

            return (
              <g
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Outer halo */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 9 : 6}
                  fill={isMax ? '#f59e0b' : '#18181b'}
                  stroke="#f59e0b"
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-150"
                />

                {/* Point label (kg) */}
                <text
                  x={pt.x}
                  y={pt.y - 12}
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="drop-shadow"
                >
                  {pt.record.weightKg}kg
                </text>

                {/* Week Label bottom */}
                <text
                  x={pt.x}
                  y={height - 10}
                  fill="#a1a1aa"
                  fontSize="10"
                  textAnchor="middle"
                >
                  {pt.record.weekLabel}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover detail card */}
        {hoveredIdx !== null && points[hoveredIdx] && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-2 right-2 bg-zinc-900 border border-amber-500/40 p-3 rounded-xl shadow-xl pointer-events-none text-xs space-y-1 max-w-xs z-10"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-bold text-amber-400">{points[hoveredIdx].record.weekLabel}</span>
              <span className="text-[10px] text-zinc-400">{points[hoveredIdx].record.date}</span>
            </div>
            <div className="text-white font-bold text-sm">
              {points[hoveredIdx].record.weightKg} kg &bull; {points[hoveredIdx].record.sets} séries x {points[hoveredIdx].record.reps} reps
            </div>
            {points[hoveredIdx].record.rpe && (
              <div className="text-zinc-400 text-[11px]">
                Percepção de esforço: <span className="text-zinc-200 font-medium">RPE {points[hoveredIdx].record.rpe}</span>
              </div>
            )}
            <div className="text-zinc-300 text-[11px] italic pt-1 border-t border-zinc-800">
              "{points[hoveredIdx].record.trainerNotes}"
            </div>
          </motion.div>
        )}
      </div>

      {/* Evolution Summary Cards in the style of the prompt's example */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
        {sorted.map((r, i) => (
          <div
            key={r.id}
            className={`p-3 rounded-xl border text-center transition ${
              r.isPersonalRecord
                ? 'bg-amber-500/10 border-amber-500/30'
                : 'bg-zinc-900/60 border-zinc-800/80'
            }`}
          >
            <span className="text-[11px] text-zinc-400 block font-medium">{r.weekLabel}</span>
            <span className="text-lg font-heading font-extrabold text-white mt-0.5 block">
              {r.weightKg} kg
            </span>
            <span className="text-[10px] text-zinc-500 block">
              {r.sets}x{r.reps} reps
            </span>
            {r.isPersonalRecord && (
              <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                <Flame className="w-3 h-3" /> Recorde
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

interface EmotionalEvolutionChartProps {
  checkins: EmotionalCheckin[];
  studentName: string;
}

export const EmotionalEvolutionChart: React.FC<EmotionalEvolutionChartProps> = ({ checkins, studentName }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const sorted = [...checkins].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (sorted.length === 0) {
    return (
      <div className="p-8 text-center bg-zinc-950/60 rounded-2xl border border-zinc-800/80 text-zinc-500">
        Nenhum check-in emocional registrado ainda.
      </div>
    );
  }

  // Calculate stats:
  const totalScores = sorted.map(c => c.score);
  const averageScore = (totalScores.reduce((a, b) => a + b, 0) / totalScores.length).toFixed(1);

  // Detect pattern changes / alerts
  // A pattern change is defined as:
  // 1. Any score <= 6 (Atenção para fadiga/estresse)
  // 2. A drop of >= 4 points between consecutive sessions
  const patternAlerts: Array<{ date: string; prevScore: number; curScore: number; reason: string }> = [];
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    const drop = prev.score - curr.score;
    if (drop >= 4) {
      patternAlerts.push({
        date: curr.date,
        prevScore: prev.score,
        curScore: curr.score,
        reason: `Queda acentuada de ${drop} pontos entre sessões.`
      });
    } else if (curr.score <= 6) {
      patternAlerts.push({
        date: curr.date,
        prevScore: prev.score,
        curScore: curr.score,
        reason: `Pontuação em zona de fadiga/estresse (${curr.score}/15).`
      });
    }
  }

  const width = 600;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Scale is fixed 0 to 15
  const points = sorted.map((c, idx) => {
    const x = paddingX + (idx / Math.max(1, sorted.length - 1)) * chartWidth;
    const y = height - paddingY - (c.score / 15) * chartHeight;
    return { x, y, checkin: c };
  });

  const pathD = points.length === 1
    ? `M ${points[0].x - 30} ${points[0].y} L ${points[0].x + 30} ${points[0].y}`
    : points.reduce((acc, p, i) => {
        if (i === 0) return `M ${p.x} ${p.y}`;
        const prev = points[i - 1];
        const cx1 = prev.x + (p.x - prev.x) / 2;
        const cy1 = prev.y;
        const cx2 = prev.x + (p.x - prev.x) / 2;
        const cy2 = p.y;
        return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p.x} ${p.y}`;
      }, '');

  return (
    <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-5 space-y-4">
      {/* Top summary & metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-emerald-400" />
            <h4 className="font-heading font-bold text-base text-white">Evolução do Bem-Estar (Escala 0-15)</h4>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Acompanhamento subjetivo aula a aula para adaptação técnica
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-right">
            <span className="text-[10px] text-zinc-400 block uppercase font-medium">Média Geral</span>
            <span className="text-sm font-extrabold text-emerald-400">{averageScore} / 15</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-right">
            <span className="text-[10px] text-zinc-400 block uppercase font-medium">Última Aula</span>
            <span className="text-sm font-bold text-white">
              {sorted[sorted.length - 1].score} / 15
            </span>
          </div>
        </div>
      </div>

      {/* Pattern Change Alerts Banner */}
      {patternAlerts.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-semibold text-amber-300 block">
              Identificação de Variação Relevante no Padrão:
            </span>
            <p className="text-zinc-300 leading-relaxed">
              O sistema identificou oscilação de bem-estar na data {patternAlerts[patternAlerts.length - 1].date} ({patternAlerts[patternAlerts.length - 1].reason}). O personal adaptou o volume e intensidade da sessão para preservar a recuperação do aluno.
            </p>
          </div>
        </div>
      )}

      {/* SVG Chart */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          {/* Background Zones: 0-5 (Red/Atenção), 6-10 (Amber/Neutro), 11-15 (Green/Ótimo) */}
          {/* Zone 11-15 */}
          <rect
            x={paddingX}
            y={paddingY}
            width={chartWidth}
            height={chartHeight * (4 / 15)}
            fill="rgba(16, 185, 129, 0.06)"
          />
          {/* Zone 6-10 */}
          <rect
            x={paddingX}
            y={paddingY + chartHeight * (4 / 15)}
            width={chartWidth}
            height={chartHeight * (5 / 15)}
            fill="rgba(245, 158, 11, 0.04)"
          />
          {/* Zone 0-5 */}
          <rect
            x={paddingX}
            y={paddingY + chartHeight * (9 / 15)}
            width={chartWidth}
            height={chartHeight * (6 / 15)}
            fill="rgba(244, 63, 94, 0.05)"
          />

          {/* Reference Lines for 15, 10, 5, 0 */}
          {[15, 10, 5, 0].map((scoreVal) => {
            const y = height - paddingY - (scoreVal / 15) * chartHeight;
            return (
              <g key={scoreVal}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeDasharray="3 3"
                />
                <text
                  x={paddingX - 8}
                  y={y + 4}
                  fill="#71717a"
                  fontSize="10"
                  textAnchor="end"
                >
                  {scoreVal}
                </text>
              </g>
            );
          })}

          {/* Main Curve */}
          <path
            d={pathD}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Checkin Dots */}
          {points.map((pt, idx) => {
            const isHovered = hoveredIdx === idx;
            const score = pt.checkin.score;
            let dotColor = '#10b981';
            if (score <= 5) dotColor = '#f43f5e';
            else if (score <= 9) dotColor = '#f59e0b';

            return (
              <g
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 8 : 5}
                  fill={dotColor}
                  stroke="#18181b"
                  strokeWidth="2"
                  className="transition-all"
                />
                {/* Score Number above */}
                <text
                  x={pt.x}
                  y={pt.y - 10}
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {score}
                </text>
                {/* Date below */}
                <text
                  x={pt.x}
                  y={height - 8}
                  fill="#a1a1aa"
                  fontSize="9"
                  textAnchor="middle"
                >
                  {pt.checkin.date.split('-').slice(1).join('/')}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover detail card */}
        {hoveredIdx !== null && points[hoveredIdx] && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-2 right-2 bg-zinc-900 border border-emerald-500/40 p-3.5 rounded-xl shadow-xl pointer-events-none text-xs space-y-1.5 max-w-xs z-10"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-bold text-white flex items-center gap-1.5">
                Pontuação: <span className="text-emerald-400 font-extrabold text-sm">{points[hoveredIdx].checkin.score}/15</span>
              </span>
              <span className="text-[10px] text-zinc-400">{points[hoveredIdx].checkin.date}</span>
            </div>

            {points[hoveredIdx].checkin.tag && (
              <span className="inline-block px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded text-[10px] font-medium">
                {points[hoveredIdx].checkin.tag}
              </span>
            )}

            {points[hoveredIdx].checkin.note && (
              <div className="text-zinc-300 text-[11px]">
                "{points[hoveredIdx].checkin.note}"
              </div>
            )}

            {points[hoveredIdx].checkin.trainerAction && (
              <div className="text-emerald-300 text-[10px] bg-emerald-950/40 p-1.5 rounded border border-emerald-800/40">
                <strong>Conduta do Personal:</strong> {points[hoveredIdx].checkin.trainerAction}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Scale Legend & Medical Disclaimer */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800 text-[11px] text-zinc-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> 0-5 Fadiga/Baixa
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> 6-9 Moderado
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> 10-15 Ótimo/Pico
          </span>
        </div>
        <span className="text-zinc-500 italic text-[10px]">
          Recurso subjetivo pedagógico. Sem fins de diagnóstico médico.
        </span>
      </div>
    </div>
  );
};
