import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smile, Frown, Meh, Sparkles, X, Check, HeartPulse, Info } from 'lucide-react';
import { EmotionalCheckin } from '../types';

interface EmotionalScaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
  classSessionId?: string;
  onSave: (checkin: EmotionalCheckin) => void;
  initialScore?: number;
}

const QUICK_TAGS = [
  'Disposto & Focado',
  'Energia Alta',
  'Cansado do Trabalho',
  'Poucas horas de sono',
  'Dores musculares',
  'Alimentação boa',
  'Estresse rotineiro',
  'Super motivado'
];

export const EmotionalScaleModal: React.FC<EmotionalScaleModalProps> = ({
  isOpen,
  onClose,
  studentId,
  studentName,
  classSessionId,
  onSave,
  initialScore = 12
}) => {
  const [score, setScore] = useState<number>(initialScore);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [trainerAction, setTrainerAction] = useState<string>('');
  const [showTrainerFields, setShowTrainerFields] = useState<boolean>(false);

  if (!isOpen) return null;

  const getScoreColor = (val: number) => {
    if (val <= 3) return 'from-rose-500 to-red-600 border-red-500/40 text-rose-400';
    if (val <= 7) return 'from-amber-500 to-orange-600 border-amber-500/40 text-amber-400';
    if (val <= 11) return 'from-emerald-500 to-teal-600 border-emerald-500/40 text-emerald-400';
    return 'from-emerald-400 to-cyan-500 border-cyan-500/40 text-cyan-300';
  };

  const getScoreDescription = (val: number) => {
    if (val <= 2) return { label: 'Muito Ruim', desc: 'Esgotado fisicamente ou mentalmente', icon: Frown, color: 'text-rose-400' };
    if (val <= 5) return { label: 'Abaixo do normal', desc: 'Pouca energia ou sono insuficiente', icon: Frown, color: 'text-rose-300' };
    if (val <= 8) return { label: 'Moderado', desc: 'Disposição média para o treino', icon: Meh, color: 'text-amber-400' };
    if (val <= 11) return { label: 'Bom', desc: 'Animado e com boa energia', icon: Smile, color: 'text-emerald-400' };
    if (val <= 13) return { label: 'Muito Bom', desc: 'Disposição excelente e focado', icon: Smile, color: 'text-emerald-300' };
    return { label: 'Excelente / Pico', desc: 'No auge da motivação e força', icon: Sparkles, color: 'text-cyan-300' };
  };

  const currentDesc = getScoreDescription(score);
  const StatusIcon = currentDesc.icon;

  const handleSave = () => {
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const newCheckin: EmotionalCheckin = {
      id: `em-${Date.now()}`,
      studentId,
      classSessionId,
      date: today,
      time: nowTime,
      score,
      tag: selectedTag || undefined,
      note: note.trim() || undefined,
      trainerAction: trainerAction.trim() || undefined
    };

    onSave(newCheckin);
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
          className="bg-zinc-900 border-t sm:border border-zinc-800 w-full max-w-xl rounded-t-[32px] sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] sm:max-h-[90vh] flex flex-col"
          id="emotional-scale-modal"
        >
          {/* Mobile Grab Handle */}
          <div className="sm:hidden w-12 h-1.5 bg-zinc-700 rounded-full mx-auto my-2.5 opacity-80 shrink-0" />

          {/* Header */}
          <div className="px-5 sm:px-6 py-3.5 sm:py-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/90 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg text-white">Check-in de Bem-Estar</h3>
                <p className="text-xs text-zinc-400">Aluno: <span className="text-zinc-200 font-medium">{studentName}</span></p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition flex items-center justify-center"
              aria-label="Fechar"
              id="close-emotional-modal-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto flex-1">
            {/* Question */}
            <div className="text-center space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Escala de 0 a 15</span>
              <h2 className="text-xl md:text-2xl font-heading font-bold text-white">
                Como você está se sentindo hoje?
              </h2>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Leva apenas alguns segundos. Ajuda seu personal a calibrar a intensidade e o ritmo da aula.
              </p>
            </div>

            {/* Score Highlight Box */}
            <div className="bg-zinc-950/80 rounded-2xl p-5 border border-zinc-800/80 text-center relative overflow-hidden">
              <div className="flex items-center justify-center gap-3">
                <StatusIcon className={`w-8 h-8 ${currentDesc.color}`} />
                <span className="text-5xl font-heading font-extrabold tracking-tight text-white">
                  {score}
                </span>
                <span className="text-lg text-zinc-500 font-medium">/ 15</span>
              </div>

              <div className="mt-2">
                <div className={`text-base font-semibold ${currentDesc.color}`}>
                  {currentDesc.label}
                </div>
                <div className="text-xs text-zinc-400">
                  {currentDesc.desc}
                </div>
              </div>
            </div>

            {/* Visual 0 - 15 Scale Selector */}
            <div>
              <div className="flex justify-between text-xs text-zinc-400 font-medium mb-2.5 px-1">
                <span className="text-rose-400 flex items-center gap-1">
                  <span>0</span> — Muito Ruim
                </span>
                <span className="text-zinc-500">7.5 Neutro</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  15 — Muito Bom
                </span>
              </div>

              {/* Numerical Buttons Grid for 0 to 15 */}
              <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5 p-2 bg-zinc-950 rounded-xl border border-zinc-800">
                {Array.from({ length: 16 }, (_, i) => i).map((val) => {
                  const isSelected = score === val;
                  let bgClass = 'bg-zinc-800/60 text-zinc-300 hover:bg-zinc-700/80 hover:text-white';
                  if (isSelected) {
                    if (val <= 3) bgClass = 'bg-rose-500 text-white font-bold ring-2 ring-rose-400 shadow-lg shadow-rose-500/30';
                    else if (val <= 7) bgClass = 'bg-amber-500 text-zinc-950 font-bold ring-2 ring-amber-400 shadow-lg shadow-amber-500/30';
                    else if (val <= 11) bgClass = 'bg-emerald-500 text-zinc-950 font-bold ring-2 ring-emerald-400 shadow-lg shadow-emerald-500/30';
                    else bgClass = 'bg-cyan-400 text-zinc-950 font-bold ring-2 ring-cyan-300 shadow-lg shadow-cyan-500/30';
                  }

                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setScore(val)}
                      className={`h-11 rounded-lg text-sm transition-all flex items-center justify-center cursor-pointer ${bgClass}`}
                      id={`emotional-btn-${val}`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>

              {/* Slider for smooth dragging */}
              <div className="mt-3 px-1">
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="1"
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  id="emotional-range-slider"
                />
              </div>
            </div>

            {/* Quick Tags */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400">
                Fator de destaque hoje (opcional):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_TAGS.map((tag) => {
                  const isSelected = selectedTag === tag;
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(isSelected ? '' : tag)}
                      className={`text-xs px-3 py-1.5 rounded-lg transition-all border ${
                        isSelected
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-medium'
                          : 'bg-zinc-800/50 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Toggle Personal Trainer Notes / Adaptation */}
            <div>
              <button
                type="button"
                onClick={() => setShowTrainerFields(!showTrainerFields)}
                className="text-xs text-zinc-400 hover:text-emerald-400 transition flex items-center gap-1.5"
              >
                <span>{showTrainerFields ? '− Ocultar anotações do treinador' : '+ Adicionar nota rápida ou ajuste de conduta'}</span>
              </button>

              {showTrainerFields && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 space-y-3 pt-3 border-t border-zinc-800"
                >
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Comentário do Aluno (opcional):</label>
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Ex: Dormi apenas 5h, mas quero tentar treinar bem..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Adaptação do Personal (se houver):</label>
                    <input
                      type="text"
                      value={trainerAction}
                      onChange={(e) => setTrainerAction(e.target.value)}
                      placeholder="Ex: Reduzido volume de pernas e enfatizado mobilidade..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Medical Disclaimer requirement */}
            <div className="bg-zinc-950/60 rounded-xl p-3 border border-zinc-800/60 flex items-start gap-2.5 text-zinc-400 text-[11px] leading-relaxed">
              <Info className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
              <span>
                <strong>Aviso de acompanhamento:</strong> Esta ferramenta destina-se exclusivamente ao registro do bem-estar subjetivo percebido pelo aluno para direcionamento pedagógico do treino. Não realiza diagnóstico médico ou psicológico.
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-zinc-900/90 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              id="confirm-emotional-score-btn"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              Confirmar Resposta ({score}/15)
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
