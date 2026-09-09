import React from 'react';
import { Wifi, BatteryMedium, Signal, Smartphone, Maximize2, Sparkles } from 'lucide-react';

interface MobileDeviceSimulatorProps {
  children: React.ReactNode;
  enabled: boolean;
  onToggleEnabled: () => void;
  viewMode: 'trainer' | 'student';
}

export const MobileDeviceSimulator: React.FC<MobileDeviceSimulatorProps> = ({
  children,
  enabled,
  onToggleEnabled,
  viewMode
}) => {
  if (!enabled) {
    // Responsive mobile view (centered max-w-lg container on desktop, 100% on mobile)
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center">
        {/* Desktop Helper Banner */}
        <div className="w-full hidden md:flex items-center justify-between px-6 py-2 bg-zinc-900/90 border-b border-zinc-800 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-zinc-300">ApexPersonal Mobile</span> &bull; 
            <span>Modo Responsivo Mobile ({viewMode === 'trainer' ? 'Personal Trainer' : 'Área do Aluno'})</span>
          </div>
          <button
            onClick={onToggleEnabled}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Ver em Moldura de Celular</span>
          </button>
        </div>

        {/* Centered Mobile App Container */}
        <div className="w-full max-w-lg min-h-screen bg-zinc-950 flex flex-col shadow-2xl relative border-x border-zinc-900">
          {children}
        </div>
      </div>
    );
  }

  // Smartphone Frame Simulator Mode (looks like modern flagship smartphone)
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black flex flex-col items-center justify-start sm:py-6 px-0 sm:px-4">
      {/* Frame Control Bar on Desktop */}
      <div className="w-full max-w-md hidden md:flex items-center justify-between mb-3 px-2 text-xs text-zinc-400">
        <div className="flex items-center gap-1.5 font-medium">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span className="text-zinc-200 font-bold">Simulador Mobile</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-zinc-800 rounded text-zinc-400">iOS / Android</span>
        </div>
        <button
          onClick={onToggleEnabled}
          className="flex items-center gap-1 text-[11px] font-semibold text-zinc-400 hover:text-white px-2 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-800 transition cursor-pointer"
          title="Alternar para tela responsiva cheia"
        >
          <Maximize2 className="w-3 h-3" />
          <span>Tela Expandida</span>
        </button>
      </div>

      {/* The Smartphone Device Shell */}
      <div className="w-full sm:max-w-[420px] min-h-screen sm:min-h-[850px] sm:max-h-[92vh] sm:rounded-[48px] bg-zinc-950 sm:border-[10px] sm:border-zinc-800/90 shadow-[0_0_60px_rgba(0,0,0,0.9),0_20px_40px_rgba(16,185,129,0.08)] flex flex-col relative overflow-hidden ring-1 ring-zinc-700/40">
        
        {/* Dynamic Island / Top Notch & Mobile Status Bar */}
        <div className="w-full bg-zinc-950 pt-2.5 px-6 pb-1 flex items-center justify-between shrink-0 select-none z-30 border-b border-zinc-900/50">
          {/* Clock */}
          <span className="text-xs font-bold text-zinc-300 font-sans tracking-tight">
            09:41
          </span>

          {/* Dynamic Island Pill */}
          <div className="w-24 h-4.5 bg-black rounded-full flex items-center justify-center gap-1.5 px-2 border border-zinc-800/80 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-zinc-900 border border-zinc-800" />
            <span className="w-2.5 h-1 rounded-full bg-emerald-500/60" />
          </div>

          {/* Icons: Signal, Wifi, Battery */}
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <BatteryMedium className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Scrollable Mobile Content Container */}
        <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative scrollbar-none">
          {children}
        </div>

        {/* Home Indicator Bar at the bottom */}
        <div className="w-full bg-zinc-950 py-1.5 flex items-center justify-center shrink-0 z-40 select-none pointer-events-none">
          <div className="w-32 h-1 bg-zinc-600 rounded-full opacity-60" />
        </div>
      </div>
    </div>
  );
};
