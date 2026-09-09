import React from 'react';
import {
  ShieldCheck,
  Award,
  Phone,
  Mail,
  Instagram,
  RotateCcw,
  Sparkles,
  Users,
  Calendar,
  HeartPulse,
  Dumbbell,
  CheckCircle2,
  ExternalLink,
  Smartphone
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/mockData';
import { Student } from '../types';

interface MobileProfileViewProps {
  students: Student[];
  onResetData: () => void;
  onSwitchToStudentView: () => void;
}

export const MobileProfileView: React.FC<MobileProfileViewProps> = ({
  students,
  onResetData,
  onSwitchToStudentView
}) => {
  return (
    <div className="space-y-4 pb-20" id="mobile-trainer-profile-view">
      {/* Profile Card */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 relative overflow-hidden shadow-xl">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
              alt={PERSONAL_INFO.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center text-[10px] font-black border border-zinc-900">
              ✓
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-heading font-extrabold text-white">
                {PERSONAL_INFO.name}
              </h2>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                PRO
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">
              {PERSONAL_INFO.title}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold mt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{PERSONAL_INFO.cref} (Ativo)</span>
            </div>
          </div>
        </div>

        {/* Quick Trainer Stats */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-zinc-800/80 text-center">
          <div className="bg-zinc-950/70 p-2.5 rounded-xl border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase font-bold block">Alunos</span>
            <span className="text-base font-extrabold text-white">{students.length}</span>
          </div>
          <div className="bg-zinc-950/70 p-2.5 rounded-xl border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase font-bold block">Experiência</span>
            <span className="text-base font-extrabold text-emerald-400">{PERSONAL_INFO.experience}</span>
          </div>
          <div className="bg-zinc-950/70 p-2.5 rounded-xl border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase font-bold block">Especialidade</span>
            <span className="text-xs font-bold text-amber-400 truncate block">Hipertrofia</span>
          </div>
        </div>
      </div>

      {/* Specialties */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-emerald-400" /> Especialidades & Certificações
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {PERSONAL_INFO.specialties.map((spec, i) => (
            <span
              key={i}
              className="text-xs px-2.5 py-1 rounded-xl bg-zinc-800/80 text-zinc-200 border border-zinc-700/60 font-medium"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      {/* Contact & Links */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-2.5">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
          Contato Profissional
        </h3>
        <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800">
          <div className="flex items-center gap-2 text-zinc-300">
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>{PERSONAL_INFO.phone}</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold">WhatsApp</span>
        </div>
        <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800">
          <div className="flex items-center gap-2 text-zinc-300">
            <Mail className="w-4 h-4 text-cyan-400" />
            <span>{PERSONAL_INFO.email}</span>
          </div>
          <span className="text-[10px] text-zinc-500 font-medium">E-mail</span>
        </div>
      </div>

      {/* App & System Management */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-3">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
          Gerenciamento do Aplicativo
        </h3>

        <button
          onClick={onSwitchToStudentView}
          className="w-full py-3 px-4 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-between transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Alternar para Área do Aluno</span>
          </div>
          <span className="text-[10px] bg-emerald-500 text-zinc-950 px-2 py-0.5 rounded font-black">
            Ver Aluno
          </span>
        </button>

        <button
          onClick={onResetData}
          className="w-full py-3 px-4 rounded-xl bg-zinc-800/80 hover:bg-rose-500/15 hover:border-rose-500/40 hover:text-rose-300 text-zinc-300 font-semibold text-xs flex items-center justify-between transition border border-zinc-700/60 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-zinc-400" />
            <span>Restaurar Dados Demonstrativos</span>
          </div>
          <span className="text-[10px] text-zinc-500">Padrão inicial</span>
        </button>
      </div>

      {/* Mobile Badge */}
      <div className="text-center py-2 text-[11px] text-zinc-500 flex items-center justify-center gap-1.5">
        <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
        <span>ApexPersonal Mobile App Edition &bull; v2.4</span>
      </div>
    </div>
  );
};
