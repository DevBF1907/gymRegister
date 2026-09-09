import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Plus, ArrowRight, TrendingDown, TrendingUp, Calendar, FileText, Download, Check, Eye, Columns, Layers, SlidersHorizontal, Share2, Copy, CheckCircle2, MessageSquare, Send, Sparkles, X } from 'lucide-react';
import { PhysicalAssessment } from '../types';

interface PhysicalAssessmentViewProps {
  assessments: PhysicalAssessment[];
  studentName: string;
  onOpenNewModal: () => void;
}

export const PhysicalAssessmentView: React.FC<PhysicalAssessmentViewProps> = ({
  assessments,
  studentName,
  onOpenNewModal
}) => {
  // Sort chronologically
  const sorted = [...assessments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Comparison selection
  const [selectedBaselineId, setSelectedBaselineId] = useState<string>(
    sorted.length >= 2 ? sorted[0].id : (sorted[0]?.id || '')
  );
  const [selectedCurrentId, setSelectedCurrentId] = useState<string>(
    sorted.length >= 2 ? sorted[sorted.length - 1].id : (sorted[0]?.id || '')
  );

  const [activePhotoAngle, setActivePhotoAngle] = useState<'front' | 'side' | 'back'>('front');
  const [photoViewMode, setPhotoViewMode] = useState<'slider' | 'side-by-side'>('slider');
  const [sliderPosition, setSliderPosition] = useState<number>(50); // 0 to 100
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<boolean>(false);

  if (sorted.length === 0) {
    return (
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-12 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
          <Activity className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-lg font-heading font-bold text-white">Nenhuma Avaliação Física Cadastrada</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
            Cadastre a primeira avaliação antropométrica de {studentName} para acompanhar a composição corporal e fotos de evolução.
          </p>
        </div>
        <button
          onClick={onOpenNewModal}
          className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-bold rounded-xl transition inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Cadastrar Primeira Avaliação
        </button>
      </div>
    );
  }

  const baseline = sorted.find(a => a.id === selectedBaselineId) || sorted[0];
  const current = sorted.find(a => a.id === selectedCurrentId) || sorted[sorted.length - 1];

  const calcDiff = (valCurrent?: number, valBase?: number) => {
    if (valCurrent === undefined || valBase === undefined) return null;
    const diff = Number((valCurrent - valBase).toFixed(1));
    return diff;
  };

  const weightDiff = calcDiff(current.weightKg, baseline.weightKg);
  const fatDiff = calcDiff(current.bodyFatPercentage, baseline.bodyFatPercentage);
  const muscleDiff = calcDiff(current.muscleMassKg, baseline.muscleMassKg);

  // Key perimeters for visual radar / chart
  const perimetersList = [
    { label: 'Tórax / Peitoral', key: 'chestCm', base: baseline.measurements.chestCm, curr: current.measurements.chestCm, icon: '📐' },
    { label: 'Braço (Bíceps)', key: 'rightArmCm', base: baseline.measurements.rightArmCm, curr: current.measurements.rightArmCm, icon: '💪' },
    { label: 'Cintura', key: 'waistCm', base: baseline.measurements.waistCm, curr: current.measurements.waistCm, icon: '🎯' },
    { label: 'Abdômen', key: 'abdomenCm', base: baseline.measurements.abdomenCm, curr: current.measurements.abdomenCm, icon: '🔥' },
    { label: 'Quadril', key: 'hipsCm', base: baseline.measurements.hipsCm, curr: current.measurements.hipsCm, icon: '⚡' },
    { label: 'Coxa Direita', key: 'rightThighCm', base: baseline.measurements.rightThighCm, curr: current.measurements.rightThighCm, icon: '🦵' },
  ];

  // WhatsApp formatted share text
  const generateShareText = () => {
    const wText = weightDiff !== null ? (weightDiff > 0 ? `+${weightDiff} kg` : `${weightDiff} kg`) : 'N/A';
    const bfText = fatDiff !== null ? (fatDiff > 0 ? `+${fatDiff}%` : `${fatDiff}%`) : 'N/A';

    return `🔥 *EVOLUÇÃO & AVALIAÇÃO FÍSICA - ${studentName.toUpperCase()}* 🔥

📅 *Período:* ${baseline.date.split('-').reverse().join('/')} ➔ ${current.date.split('-').reverse().join('/')}

📊 *Composição Corporal:*
• Peso: ${baseline.weightKg} kg ➔ *${current.weightKg} kg* (${wText})
• % Gordura: ${baseline.bodyFatPercentage || '--'}% ➔ *${current.bodyFatPercentage || '--'}%* (${bfText})
• Massa Muscular: ${baseline.muscleMassKg || '--'} kg ➔ *${current.muscleMassKg || '--'} kg*

📐 *Principais Medidas Corporais:*
• Tórax: ${baseline.measurements.chestCm} cm ➔ ${current.measurements.chestCm} cm (${calcDiff(current.measurements.chestCm, baseline.measurements.chestCm)! > 0 ? '+' : ''}${calcDiff(current.measurements.chestCm, baseline.measurements.chestCm)} cm)
• Braço: ${baseline.measurements.rightArmCm} cm ➔ ${current.measurements.rightArmCm} cm (${calcDiff(current.measurements.rightArmCm, baseline.measurements.rightArmCm)! > 0 ? '+' : ''}${calcDiff(current.measurements.rightArmCm, baseline.measurements.rightArmCm)} cm)
• Cintura: ${baseline.measurements.waistCm} cm ➔ ${current.measurements.waistCm} cm (${calcDiff(current.measurements.waistCm, baseline.measurements.waistCm)! > 0 ? '+' : ''}${calcDiff(current.measurements.waistCm, baseline.measurements.waistCm)} cm)
• Coxa: ${baseline.measurements.rightThighCm} cm ➔ ${current.measurements.rightThighCm} cm (${calcDiff(current.measurements.rightThighCm, baseline.measurements.rightThighCm)! > 0 ? '+' : ''}${calcDiff(current.measurements.rightThighCm, baseline.measurements.rightThighCm)} cm)

💬 *Comentário do Personal:*
"${current.trainerObservations || 'Parabéns pela dedicação e disciplina! Seguimos firmes na meta!'}"

💪 _Acompanhamento Personal Trainer de Alta Performance_`;
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(generateShareText());
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(generateShareText());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top action & comparison selectors */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-heading font-bold text-white">Evolução & Avaliação Física</h3>
            <p className="text-xs text-zinc-400">Total de {sorted.length} registros no histórico</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {sorted.length >= 2 && (
            <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-xl text-xs">
              <span className="text-zinc-400">Comparar:</span>
              <select
                value={selectedBaselineId}
                onChange={(e) => setSelectedBaselineId(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs"
              >
                {sorted.map(a => (
                  <option key={a.id} value={a.id} className="bg-zinc-900 text-white">
                    {a.title} ({a.date.split('-').reverse().join('/')})
                  </option>
                ))}
              </select>

              <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />

              <select
                value={selectedCurrentId}
                onChange={(e) => setSelectedCurrentId(e.target.value)}
                className="bg-transparent text-cyan-400 font-semibold focus:outline-none cursor-pointer text-xs"
              >
                {sorted.map(a => (
                  <option key={a.id} value={a.id} className="bg-zinc-900 text-white">
                    {a.title} ({a.date.split('-').reverse().join('/')})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Share button */}
          <button
            onClick={() => setShowShareModal(true)}
            className="px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            title="Compartilhar no WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Compartilhar</span>
          </button>

          <button
            onClick={onOpenNewModal}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
            id="new-assessment-btn"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Nova Avaliação
          </button>
        </div>
      </div>

      {/* Comparison KPI Summary */}
      {sorted.length >= 2 && baseline.id !== current.id && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-medium">Peso Corporal</span>
              {weightDiff !== null && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  weightDiff <= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-cyan-500/10 text-cyan-400'
                }`}>
                  {weightDiff > 0 ? `+${weightDiff} kg` : `${weightDiff} kg`}
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-heading font-extrabold text-white">{current.weightKg} kg</span>
              <span className="text-xs text-zinc-500">era {baseline.weightKg} kg</span>
            </div>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-medium">% Gordura Corporal</span>
              {fatDiff !== null && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  fatDiff < 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                }`}>
                  {fatDiff > 0 ? `+${fatDiff}%` : `${fatDiff}%`}
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-heading font-extrabold text-cyan-400">
                {current.bodyFatPercentage ? `${current.bodyFatPercentage}%` : '--'}
              </span>
              {baseline.bodyFatPercentage && (
                <span className="text-xs text-zinc-500">era {baseline.bodyFatPercentage}%</span>
              )}
            </div>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-medium">Massa Muscular</span>
              {muscleDiff !== null && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  muscleDiff >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                }`}>
                  {muscleDiff > 0 ? `+${muscleDiff} kg` : `${muscleDiff} kg`}
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-heading font-extrabold text-emerald-400">
                {current.muscleMassKg ? `${current.muscleMassKg} kg` : '--'}
              </span>
              {baseline.muscleMassKg && (
                <span className="text-xs text-zinc-500">era {baseline.muscleMassKg} kg</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Visual Photo Comparison Section with Interactive Curtain Slider */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div>
            <h4 className="font-heading font-bold text-base text-white flex items-center gap-2">
              <span>Comparativo Fotográfico</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                {photoViewMode === 'slider' ? 'Cortina Deslizante' : 'Lado a Lado'}
              </span>
            </h4>
            <p className="text-xs text-zinc-400">Arraste a cortina interativa para comparar a evolução física</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Switcher: Slider vs Side-by-side */}
            <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800">
              <button
                type="button"
                onClick={() => setPhotoViewMode('slider')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                  photoViewMode === 'slider'
                    ? 'bg-cyan-500 text-zinc-950 font-bold shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Modo Cortina Deslizante"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden sm:inline">Cortina</span>
              </button>
              <button
                type="button"
                onClick={() => setPhotoViewMode('side-by-side')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                  photoViewMode === 'side-by-side'
                    ? 'bg-cyan-500 text-zinc-950 font-bold shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Modo Lado a Lado"
              >
                <Columns className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden sm:inline">Lado a Lado</span>
              </button>
            </div>

            {/* Angle switcher buttons */}
            <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
              {(['front', 'side', 'back'] as const).map((angle) => (
                <button
                  key={angle}
                  onClick={() => setActivePhotoAngle(angle)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                    activePhotoAngle === angle
                      ? 'bg-cyan-500 text-zinc-950 font-bold shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {angle === 'front' ? 'Frente' : angle === 'side' ? 'Perfil' : 'Costas'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Photos View: Slider Mode */}
        {photoViewMode === 'slider' ? (
          <div className="space-y-3">
            <div className="relative aspect-[4/5] sm:aspect-[16/10] max-w-2xl mx-auto bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 select-none shadow-2xl">
              {/* After image (Right / Underneath) */}
              <div className="absolute inset-0">
                {current.photos[activePhotoAngle] ? (
                  <img
                    src={current.photos[activePhotoAngle]}
                    alt={`${current.title} - Depois`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500">
                    Sem foto recente
                  </div>
                )}
                {/* Badge Depois */}
                <div className="absolute top-3 right-3 bg-cyan-950/80 border border-cyan-500/40 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-cyan-300 pointer-events-none">
                  DEPOIS &bull; {current.weightKg} kg ({current.date.split('-').reverse().join('/')})
                </div>
              </div>

              {/* Before image (Left / Clipped overlay) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <div className="w-full h-full relative" style={{ width: '100%', height: '100%' }}>
                  {baseline.photos[activePhotoAngle] ? (
                    <img
                      src={baseline.photos[activePhotoAngle]}
                      alt={`${baseline.title} - Antes`}
                      className="absolute inset-0 w-full h-full object-cover max-w-none"
                      style={{
                        width: `${100 * (100 / Math.max(sliderPosition, 0.1))}%`,
                        height: '100%'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500">
                      Sem foto anterior
                    </div>
                  )}
                  {/* Badge Antes */}
                  <div className="absolute top-3 left-3 bg-black/80 border border-zinc-700 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-white pointer-events-none">
                    ANTES &bull; {baseline.weightKg} kg ({baseline.date.split('-').reverse().join('/')})
                  </div>
                </div>
              </div>

              {/* Vertical divider line & handle */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-zinc-950 flex items-center justify-center shadow-xl border-2 border-cyan-400 font-bold text-xs">
                  ◂▸
                </div>
              </div>

              {/* Range Input for smooth touch and drag control */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                aria-label="Cortina Deslizante Antes e Depois"
              />
            </div>

            {/* Slider visual track controls */}
            <div className="flex items-center justify-between text-xs text-zinc-400 max-w-md mx-auto px-4">
              <span className="font-semibold text-white">◀ Antes ({sliderPosition}%)</span>
              <span className="text-[11px] text-zinc-500">Arraste para os lados</span>
              <span className="font-semibold text-cyan-400">Depois ▶</span>
            </div>
          </div>
        ) : (
          /* Side by Side Mode */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Baseline photo */}
            <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Registro Anterior (Antes)</span>
                  <h5 className="font-heading font-bold text-sm text-white">{baseline.title}</h5>
                </div>
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  {baseline.date.split('-').reverse().join('/')}
                </span>
              </div>

              <div className="relative aspect-[4/5] bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 flex items-center justify-center">
                {baseline.photos[activePhotoAngle] ? (
                  <img
                    src={baseline.photos[activePhotoAngle]}
                    alt={`${baseline.title} - ${activePhotoAngle}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-zinc-500">Sem foto deste ângulo</span>
                )}
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-semibold text-white">
                  {baseline.weightKg} kg &bull; {baseline.bodyFatPercentage || '--'}% BF
                </div>
              </div>
            </div>

            {/* Current photo */}
            <div className="bg-zinc-950 rounded-2xl border border-cyan-500/30 p-4 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-cyan-400 block">Registro Atual (Depois)</span>
                  <h5 className="font-heading font-bold text-sm text-white">{current.title}</h5>
                </div>
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-cyan-500" />
                  {current.date.split('-').reverse().join('/')}
                </span>
              </div>

              <div className="relative aspect-[4/5] bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 flex items-center justify-center">
                {current.photos[activePhotoAngle] ? (
                  <img
                    src={current.photos[activePhotoAngle]}
                    alt={`${current.title} - ${activePhotoAngle}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-zinc-500">Sem foto deste ângulo</span>
                )}
                <div className="absolute bottom-3 left-3 bg-cyan-950/80 border border-cyan-500/40 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-semibold text-cyan-200">
                  {current.weightKg} kg &bull; {current.bodyFatPercentage || '--'}% BF
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Perimeters Radar / Comparative Visual Chart (Opção 2) */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-heading font-bold text-base text-white">
              Evolução dos Perímetros Corporais
            </h4>
            <p className="text-xs text-zinc-400">Comparativo direto em centímetros por grupamento anatômico</p>
          </div>
          <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-lg">
            Medidas Chave
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {perimetersList.map((item) => {
            const diff = Number((item.curr - item.base).toFixed(1));
            const isReduction = diff < 0;
            return (
              <div
                key={item.key}
                className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-3.5 flex items-center justify-between hover:border-zinc-700 transition"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <span className="text-xs font-bold text-white block">{item.label}</span>
                    <span className="text-[11px] text-zinc-400">
                      {item.base}cm ➔ <strong className="text-zinc-200">{item.curr}cm</strong>
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-black px-2 py-0.5 rounded-lg inline-block ${
                    diff === 0
                      ? 'bg-zinc-800 text-zinc-400'
                      : isReduction
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  }`}>
                    {diff > 0 ? `+${diff} cm` : `${diff} cm`}
                  </span>
                  <span className="text-[9px] text-zinc-500 block mt-0.5 font-semibold">
                    {diff === 0 ? 'estável' : isReduction ? 'redução' : 'ganho'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Measurements Full Table */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <h4 className="font-heading font-bold text-base text-white">
          Tabela Completa de Medidas (Perimetria)
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950/80 text-zinc-400 uppercase text-[10px] font-semibold border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Ponto Anatômico</th>
                <th className="py-3 px-4">{baseline.title} ({baseline.date.split('-').slice(1).join('/')})</th>
                <th className="py-3 px-4">{current.title} ({current.date.split('-').slice(1).join('/')})</th>
                <th className="py-3 px-4">Diferença (Delta)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-medium">
              {[
                { label: 'Tórax / Peito', base: baseline.measurements.chestCm, curr: current.measurements.chestCm },
                { label: 'Braço Direito', base: baseline.measurements.rightArmCm, curr: current.measurements.rightArmCm },
                { label: 'Braço Esquerdo', base: baseline.measurements.leftArmCm, curr: current.measurements.leftArmCm },
                { label: 'Cintura', base: baseline.measurements.waistCm, curr: current.measurements.waistCm },
                { label: 'Abdômen', base: baseline.measurements.abdomenCm, curr: current.measurements.abdomenCm },
                { label: 'Quadril', base: baseline.measurements.hipsCm, curr: current.measurements.hipsCm },
                { label: 'Coxa Direita', base: baseline.measurements.rightThighCm, curr: current.measurements.rightThighCm },
                { label: 'Coxa Esquerda', base: baseline.measurements.leftThighCm, curr: current.measurements.leftThighCm },
                { label: 'Panturrilha Direita', base: baseline.measurements.rightCalfCm, curr: current.measurements.rightCalfCm },
                { label: 'Panturrilha Esquerda', base: baseline.measurements.leftCalfCm, curr: current.measurements.leftCalfCm },
              ].map((row, idx) => {
                const diff = Number((row.curr - row.base).toFixed(1));
                return (
                  <tr key={idx} className="hover:bg-zinc-800/40 transition">
                    <td className="py-3 px-4 font-semibold text-white">{row.label}</td>
                    <td className="py-3 px-4 text-zinc-400">{row.base} cm</td>
                    <td className="py-3 px-4 text-white font-bold">{row.curr} cm</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 font-bold ${
                        diff === 0 ? 'text-zinc-500' : diff > 0 ? 'text-cyan-400' : 'text-emerald-400'
                      }`}>
                        {diff > 0 ? `+${diff} cm` : `${diff} cm`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Observations & Attached Exams / Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Personal Trainer Observations */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-3">
          <h4 className="font-heading font-bold text-sm text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Observações do Personal Trainer
          </h4>
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-xs text-zinc-300 leading-relaxed space-y-2">
            <p>"{current.trainerObservations}"</p>
            {current.postureNotes && (
              <div className="pt-2 border-t border-zinc-800/80 text-zinc-400">
                <strong className="text-zinc-300">Análise Postural:</strong> {current.postureNotes}
              </div>
            )}
            {current.nextAssessmentDate && (
              <div className="pt-2 text-[11px] text-cyan-400 font-semibold">
                Próxima reavaliação prevista: {current.nextAssessmentDate.split('-').reverse().join('/')}
              </div>
            )}
          </div>
        </div>

        {/* Exams & Documents */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-3">
          <h4 className="font-heading font-bold text-sm text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" /> Exames & Documentos Anexados
          </h4>
          <div className="space-y-2">
            {current.examsDocuments && current.examsDocuments.length > 0 ? (
              current.examsDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-zinc-700 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-[10px]">
                      PDF
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-white block">{doc.name}</span>
                      <span className="text-[10px] text-zinc-400">{doc.date} &bull; {doc.sizeKb} KB</span>
                    </div>
                  </div>
                  <button
                    onClick={() => alert(`Visualizando documento: ${doc.name}`)}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
                    title="Baixar ou visualizar exame"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-500 italic">Nenhum laudo anexado nesta avaliação.</p>
            )}
          </div>
        </div>
      </div>

      {/* Share WhatsApp Modal (Opção 2) */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-t-[28px] sm:rounded-2xl shadow-2xl overflow-hidden p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-white">Resumo Compartilhável</h3>
                    <p className="text-[11px] text-zinc-400">Envie o feedback diretamente para {studentName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="w-7 h-7 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Preview of the card */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 font-mono text-xs text-zinc-300 max-h-56 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {generateShareText()}
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  {copiedText ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Texto</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleOpenWhatsApp}
                  className="py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar no WhatsApp</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
