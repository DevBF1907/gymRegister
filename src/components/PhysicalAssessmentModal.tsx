import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, X, Check, Camera, Upload, FileText } from 'lucide-react';
import { PhysicalAssessment } from '../types';

interface PhysicalAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
  onSave: (assessment: PhysicalAssessment) => void;
  latestAssessment?: PhysicalAssessment;
}

export const PhysicalAssessmentModal: React.FC<PhysicalAssessmentModalProps> = ({
  isOpen,
  onClose,
  studentId,
  studentName,
  onSave,
  latestAssessment
}) => {
  const [title, setTitle] = useState('Reavaliação Física Periódica');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weightKg, setWeightKg] = useState<number>(latestAssessment?.weightKg || 80);
  const [heightCm, setHeightCm] = useState<number>(latestAssessment?.heightCm || 175);
  const [bodyFatPercentage, setBodyFatPercentage] = useState<number>(latestAssessment?.bodyFatPercentage || 18);
  const [muscleMassKg, setMuscleMassKg] = useState<number>(latestAssessment?.muscleMassKg || 38);
  const [visceralFat, setVisceralFat] = useState<number>(latestAssessment?.visceralFat || 5);

  // Photos
  const [photoFront, setPhotoFront] = useState<string>(
    'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80'
  );
  const [photoSide, setPhotoSide] = useState<string>(
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80'
  );
  const [photoBack, setPhotoBack] = useState<string>(
    'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80'
  );

  // Circumferences
  const [chestCm, setChestCm] = useState<number>(latestAssessment?.measurements.chestCm || 100);
  const [rightArmCm, setRightArmCm] = useState<number>(latestAssessment?.measurements.rightArmCm || 35);
  const [leftArmCm, setLeftArmCm] = useState<number>(latestAssessment?.measurements.leftArmCm || 35);
  const [waistCm, setWaistCm] = useState<number>(latestAssessment?.measurements.waistCm || 82);
  const [abdomenCm, setAbdomenCm] = useState<number>(latestAssessment?.measurements.abdomenCm || 85);
  const [hipsCm, setHipsCm] = useState<number>(latestAssessment?.measurements.hipsCm || 98);
  const [rightThighCm, setRightThighCm] = useState<number>(latestAssessment?.measurements.rightThighCm || 58);
  const [leftThighCm, setLeftThighCm] = useState<number>(latestAssessment?.measurements.leftThighCm || 58);
  const [rightCalfCm, setRightCalfCm] = useState<number>(latestAssessment?.measurements.rightCalfCm || 37);
  const [leftCalfCm, setLeftCalfCm] = useState<number>(latestAssessment?.measurements.leftCalfCm || 37);

  const [postureNotes, setPostureNotes] = useState('');
  const [trainerObservations, setTrainerObservations] = useState('');
  const [nextDate, setNextDate] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newAssessment: PhysicalAssessment = {
      id: `eval-${Date.now()}`,
      studentId,
      date,
      title: title.trim() || 'Avaliação Física',
      photos: {
        front: photoFront,
        side: photoSide,
        back: photoBack
      },
      weightKg: Number(weightKg),
      heightCm: Number(heightCm),
      bodyFatPercentage: bodyFatPercentage ? Number(bodyFatPercentage) : undefined,
      muscleMassKg: muscleMassKg ? Number(muscleMassKg) : undefined,
      visceralFat: visceralFat ? Number(visceralFat) : undefined,
      measurements: {
        chestCm: Number(chestCm),
        rightArmCm: Number(rightArmCm),
        leftArmCm: Number(leftArmCm),
        waistCm: Number(waistCm),
        abdomenCm: Number(abdomenCm),
        hipsCm: Number(hipsCm),
        rightThighCm: Number(rightThighCm),
        leftThighCm: Number(leftThighCm),
        rightCalfCm: Number(rightCalfCm),
        leftCalfCm: Number(leftCalfCm)
      },
      postureNotes: postureNotes.trim() || undefined,
      examsDocuments: [
        {
          id: `doc-${Date.now()}`,
          name: `Laudo_Bioimpedancia_${date}.pdf`,
          type: 'pdf',
          date,
          sizeKb: 1024
        }
      ],
      trainerObservations: trainerObservations.trim() || 'Avaliação realizada dentro dos padrões antropométricos.',
      nextAssessmentDate: nextDate || undefined
    };

    onSave(newAssessment);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          className="bg-zinc-900 border-t sm:border border-zinc-800 w-full max-w-3xl rounded-t-[32px] sm:rounded-2xl shadow-2xl overflow-hidden my-0 sm:my-6 max-h-[92vh] sm:max-h-[90vh] flex flex-col"
          id="physical-assessment-modal"
        >
          {/* Mobile Grab Handle */}
          <div className="sm:hidden w-12 h-1.5 bg-zinc-700 rounded-full mx-auto my-2.5 opacity-80 shrink-0" />

          {/* Header */}
          <div className="px-5 sm:px-6 py-3.5 sm:py-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/90 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-base sm:text-lg text-white">Nova Avaliação Antropométrica</h3>
                <p className="text-xs text-zinc-400">Aluno: <span className="text-zinc-200 font-medium">{studentName}</span></p>
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

          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
            {/* General Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Título da Avaliação</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Data do Registro</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Core Metrics: Weight, Height, % Fat, Muscle Mass */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">Composição Corporal</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800">
                  <label className="block text-[11px] text-zinc-400 mb-1">Peso Total (kg) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800">
                  <label className="block text-[11px] text-zinc-400 mb-1">Altura (cm) *</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800">
                  <label className="block text-[11px] text-zinc-400 mb-1">% Gordura (BF)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={bodyFatPercentage}
                    onChange={(e) => setBodyFatPercentage(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-sm font-bold text-cyan-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800">
                  <label className="block text-[11px] text-zinc-400 mb-1">Massa Muscular (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={muscleMassKg}
                    onChange={(e) => setMuscleMassKg(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-sm font-bold text-emerald-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Circumferences / Medidas Corporais (cm) */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-3">Medidas Corporais (Perimetria em cm)</h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Tórax / Peito</label>
                  <input
                    type="number"
                    step="0.5"
                    value={chestCm}
                    onChange={(e) => setChestCm(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Cintura</label>
                  <input
                    type="number"
                    step="0.5"
                    value={waistCm}
                    onChange={(e) => setWaistCm(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Abdômen</label>
                  <input
                    type="number"
                    step="0.5"
                    value={abdomenCm}
                    onChange={(e) => setAbdomenCm(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Quadril</label>
                  <input
                    type="number"
                    step="0.5"
                    value={hipsCm}
                    onChange={(e) => setHipsCm(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Braço D / E</label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      step="0.5"
                      value={rightArmCm}
                      onChange={(e) => setRightArmCm(Number(e.target.value))}
                      placeholder="D"
                      className="w-1/2 bg-zinc-950 border border-zinc-800 rounded-lg px-1.5 py-1 text-xs text-white text-center"
                    />
                    <input
                      type="number"
                      step="0.5"
                      value={leftArmCm}
                      onChange={(e) => setLeftArmCm(Number(e.target.value))}
                      placeholder="E"
                      className="w-1/2 bg-zinc-950 border border-zinc-800 rounded-lg px-1.5 py-1 text-xs text-white text-center"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Coxa D / E</label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      step="0.5"
                      value={rightThighCm}
                      onChange={(e) => setRightThighCm(Number(e.target.value))}
                      placeholder="D"
                      className="w-1/2 bg-zinc-950 border border-zinc-800 rounded-lg px-1.5 py-1 text-xs text-white text-center"
                    />
                    <input
                      type="number"
                      step="0.5"
                      value={leftThighCm}
                      onChange={(e) => setLeftThighCm(Number(e.target.value))}
                      placeholder="E"
                      className="w-1/2 bg-zinc-950 border border-zinc-800 rounded-lg px-1.5 py-1 text-xs text-white text-center"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Panturrilha D / E</label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      step="0.5"
                      value={rightCalfCm}
                      onChange={(e) => setRightCalfCm(Number(e.target.value))}
                      placeholder="D"
                      className="w-1/2 bg-zinc-950 border border-zinc-800 rounded-lg px-1.5 py-1 text-xs text-white text-center"
                    />
                    <input
                      type="number"
                      step="0.5"
                      value={leftCalfCm}
                      onChange={(e) => setLeftCalfCm(Number(e.target.value))}
                      placeholder="E"
                      className="w-1/2 bg-zinc-950 border border-zinc-800 rounded-lg px-1.5 py-1 text-xs text-white text-center"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Photos & Visual Record */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2 flex items-center gap-2">
                <Camera className="w-4 h-4 text-cyan-400" /> Fotos do Registro (Frente, Lado, Costas)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <span className="text-[11px] text-zinc-400 block">Vista Frontal</span>
                  <div className="relative aspect-[3/4] bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 flex items-center justify-center">
                    {photoFront ? (
                      <img src={photoFront} alt="Frente" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-zinc-500">Sem foto</span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={photoFront}
                    onChange={(e) => setPhotoFront(e.target.value)}
                    placeholder="URL da Foto Frontal"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-[11px] text-zinc-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] text-zinc-400 block">Vista Lateral</span>
                  <div className="relative aspect-[3/4] bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 flex items-center justify-center">
                    {photoSide ? (
                      <img src={photoSide} alt="Lado" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-zinc-500">Sem foto</span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={photoSide}
                    onChange={(e) => setPhotoSide(e.target.value)}
                    placeholder="URL da Foto Lateral"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-[11px] text-zinc-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] text-zinc-400 block">Vista Posterior</span>
                  <div className="relative aspect-[3/4] bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 flex items-center justify-center">
                    {photoBack ? (
                      <img src={photoBack} alt="Costas" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-zinc-500">Sem foto</span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={photoBack}
                    onChange={(e) => setPhotoBack(e.target.value)}
                    placeholder="URL da Foto Costas"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-[11px] text-zinc-300"
                  />
                </div>
              </div>
            </div>

            {/* Observations & Next date */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Observações do Personal Trainer *
                </label>
                <textarea
                  rows={3}
                  required
                  value={trainerObservations}
                  onChange={(e) => setTrainerObservations(e.target.value)}
                  placeholder="Ex: Excelente evolução na postura e perda significativa de gordura visceral. Próximo ciclo focado em força..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Previsão da Próxima Avaliação (opcional)
                </label>
                <input
                  type="date"
                  value={nextDate}
                  onChange={(e) => setNextDate(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                id="save-physical-assessment-btn"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                Salvar Avaliação Física
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
