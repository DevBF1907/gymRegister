import React from 'react';
import {
  Dumbbell,
  Users,
  User,
  HeartPulse,
  Plus,
  ChevronDown,
  RotateCcw,
  Smartphone,
  Maximize2,
  Sparkles
} from 'lucide-react';
import { Student } from '../types';
import { PERSONAL_INFO } from '../data/mockData';

interface MobileAppHeaderProps {
  viewMode: 'trainer' | 'student';
  onToggleViewMode: (mode: 'trainer' | 'student') => void;
  students: Student[];
  selectedStudentId: string;
  onOpenStudentSwitcher: () => void;
  onOpenQuickActions: () => void;
  deviceFrameMode: boolean;
  onToggleDeviceFrame: () => void;
  onResetData: () => void;
}

export const MobileAppHeader: React.FC<MobileAppHeaderProps> = ({
  viewMode,
  onToggleViewMode,
  students,
  selectedStudentId,
  onOpenStudentSwitcher,
  onOpenQuickActions,
  deviceFrameMode,
  onToggleDeviceFrame,
  onResetData
}) => {
  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0];

  return (
    <header className="sticky top-0 z-30 bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-850 px-3 py-2 shrink-0">
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
        {/* Left: Brand / Avatar & Role Toggle */}
        <div className="flex items-center gap-2 min-w-0">
          {viewMode === 'trainer' ? (
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-sm shadow-emerald-500/20 shrink-0">
                <div className="w-full h-full bg-zinc-950 rounded-[6px] flex items-center justify-center text-emerald-400">
                  <Dumbbell className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="leading-tight min-w-0">
                <span className="font-heading font-extrabold text-xs text-white tracking-tight flex items-center gap-1">
                  Apex<span className="text-emerald-400">Personal</span>
                  <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1 py-0.2 rounded font-black">PRO</span>
                </span>
                <span className="text-[10px] text-zinc-400 block truncate">
                  {PERSONAL_INFO.name.split(' ')[0]} {PERSONAL_INFO.name.split(' ')[1]} &bull; CREF
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenStudentSwitcher}
              className="flex items-center gap-2 text-left cursor-pointer group min-w-0"
              title="Trocar Aluno"
            >
              <div className="relative shrink-0">
                <img
                  src={currentStudent.avatar}
                  alt={currentStudent.name}
                  className="w-7 h-7 rounded-lg object-cover border border-emerald-500/60 shadow-sm"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-zinc-950" />
              </div>
              <div className="leading-tight min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition truncate">
                    {currentStudent.name}
                  </span>
                  <ChevronDown className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300 shrink-0" />
                </div>
                <span className="text-[10px] text-zinc-400 block truncate">
                  {currentStudent.plan.name}
                </span>
              </div>
            </button>
          )}
        </div>

        {/* Center / Right: Mode Switcher (Personal / Aluno) */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Segmented View Switcher: Personal vs Aluno */}
          <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
            <button
              onClick={() => onToggleViewMode('trainer')}
              className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                viewMode === 'trainer'
                  ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
              id="mobile-header-toggle-trainer"
            >
              Personal
            </button>
            <button
              onClick={() => onToggleViewMode('student')}
              className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                viewMode === 'student'
                  ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
              id="mobile-header-toggle-student"
            >
              Aluno
            </button>
          </div>

          {/* Student Picker Button (if in trainer view) */}
          {viewMode === 'trainer' && (
            <button
              onClick={onOpenStudentSwitcher}
              className="p-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 rounded-lg border border-zinc-800 text-[11px] font-medium flex items-center gap-1 transition cursor-pointer"
              title="Trocar aluno ativo"
              id="mobile-header-student-select-btn"
            >
              <img
                src={currentStudent.avatar}
                alt={currentStudent.name}
                className="w-4 h-4 rounded-full object-cover"
              />
              <ChevronDown className="w-3 h-3 text-zinc-500" />
            </button>
          )}

          {/* Device Frame Toggle (Hidden on actual mobile screens, available on desktop) */}
          <button
            onClick={onToggleDeviceFrame}
            className="hidden md:flex p-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-emerald-400 rounded-lg border border-zinc-800 transition items-center justify-center cursor-pointer"
            title={deviceFrameMode ? "Mudar para Visualização Fluida" : "Mudar para Moldura de Smartphone"}
            id="mobile-frame-toggle-btn"
          >
            {deviceFrameMode ? (
              <Maximize2 className="w-3.5 h-3.5" />
            ) : (
              <Smartphone className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
