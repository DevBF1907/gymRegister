import React from 'react';
import { motion } from 'motion/react';
import {
  HeartPulse,
  Dumbbell,
  CalendarPlus,
  Activity,
  X,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export type QuickActionType = 'emotional' | 'load' | 'booking' | 'assessment';

interface QuickActionBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: QuickActionType) => void;
  selectedStudentName?: string;
}

export const QuickActionBottomSheet: React.FC<QuickActionBottomSheetProps> = ({
  isOpen,
  onClose,
  onAction,
  selectedStudentName
}) => {
  if (!isOpen) return null;
  const actions: Array<{
    id: QuickActionType;
    title: string;
    description: string;
    icon: typeof HeartPulse;
    badge: string;
    gradient: string;
    iconBg: string;
  }> = [
    {
      id: 'emotional',
      title: 'Check-in de Bem-Estar (0 a 15)',
      description: 'Registro do humor, estresse e prontidão diária',
      icon: HeartPulse,
      badge: 'Subjetivo',
      gradient: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
      iconBg: 'bg-emerald-500/20 text-emerald-400'
    },
    {
      id: 'load',
      title: 'Registrar Evolução de Carga',
      description: 'Exercício, carga (kg), repetições, RPE e PR',
      icon: Dumbbell,
      badge: 'Sobrecarga',
      gradient: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
      iconBg: 'bg-amber-500/20 text-amber-400'
    },
    {
      id: 'booking',
      title: 'Agendar Nova Aula',
      description: 'Data, horário, local e foco do treino',
      icon: CalendarPlus,
      badge: 'Agenda',
      gradient: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400',
      iconBg: 'bg-cyan-500/20 text-cyan-400'
    },
    {
      id: 'assessment',
      title: 'Nova Avaliação Física',
      description: 'Fotos comparativas, circunferências e % de gordura',
      icon: Activity,
      badge: 'Biometria',
      gradient: 'from-purple-500/20 to-rose-500/10 border-purple-500/30 text-purple-400',
      iconBg: 'bg-purple-500/20 text-purple-400'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm transition-opacity">
      {/* Backdrop click to close */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

        {/* Mobile Sheet Container */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          className="relative z-10 w-full max-w-md bg-zinc-900 border-t border-zinc-800 rounded-t-[32px] p-5 pb-8 shadow-2xl overflow-hidden"
          id="quick-action-bottom-sheet"
        >
          {/* Pull Handle */}
          <div className="w-12 h-1.5 bg-zinc-700 rounded-full mx-auto mb-4 opacity-80" />

          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Ações Rápidas
                </span>
              </div>
              <h3 className="font-heading font-extrabold text-lg text-white mt-0.5">
                O que deseja registrar?
              </h3>
              <p className="text-[11px] text-zinc-400">
                Aluno selecionado: <span className="text-zinc-200 font-semibold">{selectedStudentName}</span>
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action List Items */}
          <div className="space-y-2.5 mt-4">
            {actions.map((act) => {
              const Icon = act.icon;
              return (
                <button
                  key={act.id}
                  onClick={() => {
                    onAction(act.id);
                    onClose();
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border bg-gradient-to-r ${act.gradient} hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-between gap-3 cursor-pointer group`}
                  id={`quick-action-btn-${act.id}`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${act.iconBg} shadow-sm`}>
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white tracking-tight group-hover:text-emerald-300 transition">
                          {act.title}
                        </h4>
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-zinc-950/60 text-zinc-300 border border-zinc-700/50">
                          {act.badge}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5 leading-snug">
                        {act.description}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
            <span>ApexPersonal Mobile &bull; Toque para registrar</span>
            <span className="text-emerald-400 font-semibold">100% sincronizado</span>
          </div>
        </motion.div>
      </div>
  );
};
