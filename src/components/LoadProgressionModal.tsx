import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dumbbell, X, Check, Award, Flame, TrendingUp, Plus, Minus, Timer, Play, Pause, RotateCcw, Copy, Calculator, Sparkles, CheckCircle2 } from 'lucide-react';
import { LoadProgressionRecord, Student } from '../types';

interface LoadProgressionModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
  onSave: (record: LoadProgressionRecord) => void;
  existingExercises?: string[];
  initialExercise?: string;
  students?: Student[];
  loadRecords?: LoadProgressionRecord[];
  onSelectStudent?: (id: string) => void;
}

const COMMON_EXERCISES = [
  { name: 'Supino reto', category: 'Peito' },
  { name: 'Agachamento livre', category: 'Pernas' },
  { name: 'Levantamento terra', category: 'Costas' },
  { name: 'Puxada alta', category: 'Costas' },
  { name: 'Leg Press 45°', category: 'Pernas' },
  { name: 'Desenvolvimento militar', category: 'Ombros' },
  { name: 'Elevação pélvica', category: 'Pernas' },
  { name: 'Rosca direta', category: 'Braços' }
] as const;

const REST_PRESETS = [30, 45, 60, 90, 120] as const;

export const LoadProgressionModal: React.FC<LoadProgressionModalProps> = ({
  isOpen,
  onClose,
  studentId,
  studentName,
  onSave,
  existingExercises = [],
  initialExercise,
  students = [],
  loadRecords = [],
  onSelectStudent
}) => {
  const [activeStudentId, setActiveStudentId] = useState<string>(studentId);
  const [exerciseName, setExerciseName] = useState(initialExercise || 'Supino reto');
  const [category, setCategory] = useState<'Peito' | 'Costas' | 'Pernas' | 'Ombros' | 'Braços' | 'Core' | 'Outros'>('Peito');
  const [weightKg, setWeightKg] = useState<number>(30);
  const [reps, setReps] = useState<number>(10);
  const [sets, setSets] = useState<number>(3);
  const [trainerNotes, setTrainerNotes] = useState<string>('');
  const [isPersonalRecord, setIsPersonalRecord] = useState<boolean>(false);

  // Rest Timer State
  const [timerDuration, setTimerDuration] = useState<number>(60);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isTimerFinished, setIsTimerFinished] = useState<boolean>(false);
  const [showRestTimer, setShowRestTimer] = useState<boolean>(false);

  // Plate Calculator State
  const [showPlateCalc, setShowPlateCalc] = useState<boolean>(false);
  const [barWeight, setBarWeight] = useState<number>(20); // 20kg olimpica default

  // Duplicate load confirmation animation
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);

  // Sound generator (Web Audio API)
  const playChime = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.85);
    } catch {
      // ignore
    }
  };

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setIsTimerFinished(true);
            playChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSecondsLeft]);

  // Sync if studentId changes
  useEffect(() => {
    setActiveStudentId(studentId);
  }, [studentId]);

  // Find previous weight for this student and exercise
  const previousRecord = useMemo(() => {
    if (!loadRecords || loadRecords.length === 0) return null;
    const matches = loadRecords.filter(
      r => r.studentId === activeStudentId &&
      r.exerciseName.toLowerCase().trim() === exerciseName.toLowerCase().trim()
    );
    if (matches.length === 0) return null;
    return matches.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }, [loadRecords, activeStudentId, exerciseName]);

  const lastWeight = previousRecord ? previousRecord.weightKg : null;
  const evolutionDiff = lastWeight !== null ? Number((weightKg - lastWeight).toFixed(1)) : null;

  // Plate Calculator calculation
  const plateBreakdown = useMemo(() => {
    const total = Number(weightKg) || 0;
    const bar = Number(barWeight) || 0;
    const weightPerSide = Math.max(0, (total - bar) / 2);
    let rem = weightPerSide;
    const plateValues = [25, 20, 15, 10, 5, 2.5, 1.25];
    const plates: number[] = [];

    for (const p of plateValues) {
      while (rem >= p - 0.001) {
        plates.push(p);
        rem = Number((rem - p).toFixed(2));
      }
    }
    return {
      weightPerSide,
      plates,
      hasRemainder: rem > 0.05
    };
  }, [weightKg, barWeight]);

  if (!isOpen) return null;

  const currentStudentObj = students.find(s => s.id === activeStudentId);
  const displayName = currentStudentObj?.name || studentName;

  const handleSelectExercise = (name: string, cat?: string) => {
    setExerciseName(name);
    if (cat && ['Peito', 'Costas', 'Pernas', 'Ombros', 'Braços', 'Core', 'Outros'].includes(cat)) {
      setCategory(cat as any);
    }
  };

  const handleDuplicateLastLoad = () => {
    if (!previousRecord) return;
    setWeightKg(previousRecord.weightKg);
    setSets(previousRecord.sets);
    setReps(previousRecord.reps);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  const handleStartTimer = (sec: number) => {
    setTimerDuration(sec);
    setTimerSecondsLeft(sec);
    setIsTimerFinished(false);
    setIsTimerRunning(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exerciseName.trim()) return;

    const today = new Date().toISOString().split('T')[0];

    const newRecord: LoadProgressionRecord = {
      id: `load-${Date.now()}`,
      studentId: activeStudentId,
      exerciseName: exerciseName.trim(),
      category,
      date: today,
      weekLabel: 'Semana Atual',
      weightKg: Number(weightKg),
      reps: Number(reps),
      sets: Number(sets),
      rpe: 8,
      trainerNotes: trainerNotes.trim() || 'Execução sob supervisão.',
      isPersonalRecord: isPersonalRecord || (lastWeight !== null && weightKg > lastWeight)
    };

    onSave(newRecord);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="bg-zinc-900 border-t sm:border border-zinc-800 w-full max-w-md rounded-t-[28px] sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
          id="load-progression-modal"
        >
          {/* Mobile Grab Handle */}
          <div className="sm:hidden w-12 h-1.5 bg-zinc-700 rounded-full mx-auto my-2 opacity-70 shrink-0" />

          {/* Header */}
          <div className="px-5 py-3.5 border-b border-zinc-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Dumbbell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-white">Registrar Treino</h3>
                <p className="text-[11px] text-zinc-400">Rápido &bull; Cargas da sessão</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition flex items-center justify-center cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Toolbar: Cronômetro de Descanso & Calculadora de Anilhas */}
          <div className="px-4 py-2 bg-zinc-950/90 border-b border-zinc-850 flex items-center justify-between gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowRestTimer(!showRestTimer)}
              className={`text-xs px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold transition cursor-pointer ${
                showRestTimer || isTimerRunning || isTimerFinished
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              <span>
                {isTimerRunning
                  ? `Descanso: ${timerSecondsLeft}s`
                  : isTimerFinished
                  ? 'Descanso Concluído!'
                  : 'Cronômetro de Descanso'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowPlateCalc(!showPlateCalc)}
              className={`text-xs px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold transition cursor-pointer ${
                showPlateCalc
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Anilhas</span>
            </button>
          </div>

          {/* Rest Timer Expansion Panel */}
          <AnimatePresence>
            {showRestTimer && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-zinc-950 border-b border-zinc-850 px-4 py-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xl font-heading font-black ${
                      isTimerFinished ? 'text-emerald-400 animate-pulse' : 'text-amber-400'
                    }`}>
                      {timerSecondsLeft}s
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      {isTimerFinished ? 'Série pronta! 💪' : isTimerRunning ? 'em contagem...' : 'Pausado'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {isTimerRunning ? (
                      <button
                        type="button"
                        onClick={() => setIsTimerRunning(false)}
                        className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-amber-400 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Pause className="w-3.5 h-3.5" /> Pausar
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (timerSecondsLeft === 0) setTimerSecondsLeft(timerDuration);
                          setIsTimerRunning(true);
                          setIsTimerFinished(false);
                        }}
                        className="p-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" /> Iniciar
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setIsTimerRunning(false);
                        setIsTimerFinished(false);
                        setTimerSecondsLeft(timerDuration);
                      }}
                      className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg cursor-pointer"
                      title="Reiniciar"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Preset Chips: 30s, 45s, 60s, 90s, 120s */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold">Presets:</span>
                  {REST_PRESETS.map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => handleStartTimer(sec)}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-bold transition cursor-pointer ${
                        timerDuration === sec && (isTimerRunning || timerSecondsLeft > 0)
                          ? 'bg-amber-500 text-zinc-950 border-amber-400'
                          : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Plate Calculator Expansion Panel */}
          <AnimatePresence>
            {showPlateCalc && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-zinc-950 border-b border-zinc-850 px-4 py-3 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs font-bold text-white">
                    <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Calculadora de Anilhas</span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px]">
                    <span className="text-zinc-500">Barra:</span>
                    {[
                      { label: 'Olímpica 20kg', val: 20 },
                      { label: 'Padrão 10kg', val: 10 },
                      { label: 'Halter 0kg', val: 0 }
                    ].map(b => (
                      <button
                        key={b.val}
                        type="button"
                        onClick={() => setBarWeight(b.val)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
                          barWeight === b.val
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold'
                            : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                        }`}
                      >
                        {b.val}kg
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase font-bold">
                      Por lado da barra
                    </span>
                    <span className="text-lg font-heading font-black text-emerald-400">
                      {plateBreakdown.weightPerSide} kg
                    </span>
                  </div>

                  {plateBreakdown.plates.length > 0 ? (
                    <div className="flex items-center gap-1 flex-wrap justify-end">
                      {plateBreakdown.plates.map((plate, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[10px] font-black"
                        >
                          {plate} kg
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-zinc-500">Somente o peso da barra</span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSave} className="p-4 sm:p-5 space-y-3.5 overflow-y-auto flex-1">
            {/* Student Selector if multiple */}
            {students.length > 1 && (
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Aluno
                </label>
                <select
                  value={activeStudentId}
                  onChange={(e) => {
                    setActiveStudentId(e.target.value);
                    if (onSelectStudent) onSelectStudent(e.target.value);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id} className="bg-zinc-900 text-white">
                      {s.name} ({s.goal})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Exercise Name */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-semibold text-zinc-300">
                  Exercício
                </label>
                <span className="text-[10px] text-zinc-500">Toque para selecionar</span>
              </div>
              <input
                type="text"
                required
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                placeholder="Ex: Supino reto"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-amber-500"
              />

              {/* Chips rápidos */}
              <div className="flex flex-wrap gap-1 mt-1.5">
                {COMMON_EXERCISES.slice(0, 4).map((ex) => (
                  <button
                    key={ex.name}
                    type="button"
                    onClick={() => handleSelectExercise(ex.name, ex.category)}
                    className={`text-[10px] px-2 py-0.5 rounded-lg border transition cursor-pointer ${
                      exerciseName.toLowerCase() === ex.name.toLowerCase()
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                        : 'bg-zinc-800/40 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    {ex.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Previous load indicator & Quick Duplicate Button (Opção 1) */}
            <div className="bg-zinc-950 border border-zinc-800/80 p-2.5 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-medium block">
                    Último treino
                  </span>
                  <span className="text-xs font-bold text-zinc-200">
                    {lastWeight !== null ? `${lastWeight} kg (${previousRecord?.sets}x${previousRecord?.reps})` : 'Primeiro registro'}
                  </span>
                </div>

                {evolutionDiff !== null && (
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 uppercase font-medium block">
                      Evolução
                    </span>
                    <span className={`text-xs font-extrabold ${evolutionDiff > 0 ? 'text-emerald-400' : evolutionDiff === 0 ? 'text-zinc-400' : 'text-amber-400'}`}>
                      {evolutionDiff > 0 ? `+${evolutionDiff} kg 🔥` : `${evolutionDiff} kg`}
                    </span>
                  </div>
                )}
              </div>

              {/* Botão de 1 Toque para Duplicar Carga Anterior */}
              {previousRecord && (
                <button
                  type="button"
                  onClick={handleDuplicateLastLoad}
                  className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                    copiedSuccess
                      ? 'bg-emerald-500 text-zinc-950 border-emerald-400'
                      : 'bg-zinc-900 hover:bg-zinc-850 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {copiedSuccess ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Carga duplicada com sucesso!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Repetir carga da última série ({previousRecord.weightKg} kg)</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Carga [ 30 kg ] with steppers & mobile decimal keypad (inputMode="decimal") */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-amber-400">Carga</label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setWeightKg(prev => Math.max(0, Number((prev - 2.5).toFixed(1))))}
                    className="px-1.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-bold rounded cursor-pointer"
                  >
                    -2.5
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeightKg(prev => Number((prev + 2.5).toFixed(1)))}
                    className="px-1.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-bold rounded cursor-pointer"
                  >
                    +2.5
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeightKg(prev => Number((prev + 5).toFixed(1)))}
                    className="px-1.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-bold rounded cursor-pointer"
                  >
                    +5
                  </button>
                </div>
              </div>

              <div className="relative">
                <input
                  type="number"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  step="0.5"
                  min="0"
                  required
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm font-extrabold text-white focus:outline-none focus:border-amber-500"
                />
                <span className="absolute right-3 top-2 text-xs text-zinc-500 font-bold">kg</span>
              </div>
            </div>

            {/* Séries [ 3 ] e Repetições [ 10 ] with inputMode="numeric" */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                  Séries
                </label>
                <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setSets(prev => Math.max(1, prev - 1))}
                    className="px-2.5 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    min="1"
                    max="20"
                    required
                    value={sets}
                    onChange={(e) => setSets(Number(e.target.value))}
                    className="w-full bg-transparent text-center text-xs font-bold text-white focus:outline-none py-1.5"
                  />
                  <button
                    type="button"
                    onClick={() => setSets(prev => prev + 1)}
                    className="px-2.5 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                  Repetições
                </label>
                <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setReps(prev => Math.max(1, prev - 1))}
                    className="px-2.5 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    min="1"
                    max="100"
                    required
                    value={reps}
                    onChange={(e) => setReps(Number(e.target.value))}
                    className="w-full bg-transparent text-center text-xs font-bold text-white focus:outline-none py-1.5"
                  />
                  <button
                    type="button"
                    onClick={() => setReps(prev => prev + 1)}
                    className="px-2.5 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Observação opcional */}
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                Observação (opcional)
              </label>
              <input
                type="text"
                value={trainerNotes}
                onChange={(e) => setTrainerNotes(e.target.value)}
                placeholder="Ex: Boa execução, aumentar na próxima aula"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Botão Salvar Treino */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full h-11 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-zinc-950 font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                id="save-load-record-btn"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                Salvar Treino
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};


