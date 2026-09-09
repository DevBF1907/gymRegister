import React from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Users,
  Dumbbell,
  HeartPulse,
  Activity,
  CreditCard,
  Plus,
  Home,
  User,
  TrendingUp,
  Award
} from 'lucide-react';

export type TrainerTab = 'home' | 'agenda' | 'students' | 'evolution' | 'profile';
export type StudentTab = 'calendar' | 'loads' | 'emotional' | 'assessment' | 'plan';

interface MobileBottomNavProps {
  viewMode: 'trainer' | 'student';
  trainerTab: TrainerTab;
  onSelectTrainerTab: (tab: TrainerTab) => void;
  studentTab: StudentTab;
  onSelectStudentTab: (tab: StudentTab) => void;
  onOpenQuickActions: () => void;
  todayClassesCount?: number;
  activeStudentsCount?: number;
  activeAlertsCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  viewMode,
  trainerTab,
  onSelectTrainerTab,
  studentTab,
  onSelectStudentTab,
  onOpenQuickActions,
  todayClassesCount = 0,
  activeStudentsCount = 0,
  activeAlertsCount = 0
}) => {
  if (viewMode === 'trainer') {
    return (
      <nav
        className="sticky bottom-0 inset-x-0 z-30 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-850 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-1.5 px-2 shadow-[0_-8px_30px_rgba(0,0,0,0.7)] shrink-0 w-full"
        id="mobile-trainer-bottom-nav"
      >
        <div className="max-w-md mx-auto flex items-center justify-around relative">
          {/* Tab 1: Home */}
          <button
            onClick={() => onSelectTrainerTab('home')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-150 relative cursor-pointer active:scale-95 ${
              trainerTab === 'home' ? 'text-emerald-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
            id="mobile-tab-home"
          >
            <div className="relative">
              <Home className={`w-5 h-5 ${trainerTab === 'home' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
            {trainerTab === 'home' && (
              <motion.div
                layoutId="trainer-nav-indicator"
                className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5"
              />
            )}
          </button>

          {/* Tab 2: Agenda */}
          <button
            onClick={() => onSelectTrainerTab('agenda')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-150 relative cursor-pointer active:scale-95 ${
              trainerTab === 'agenda' ? 'text-emerald-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
            id="mobile-tab-agenda"
          >
            <div className="relative">
              <Calendar className={`w-5 h-5 ${trainerTab === 'agenda' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
              {todayClassesCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-emerald-500 text-zinc-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-zinc-950">
                  {todayClassesCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Agenda</span>
            {trainerTab === 'agenda' && (
              <motion.div
                layoutId="trainer-nav-indicator"
                className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5"
              />
            )}
          </button>

          {/* Tab 3: Alunos */}
          <button
            onClick={() => onSelectTrainerTab('students')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-150 relative cursor-pointer active:scale-95 ${
              trainerTab === 'students' ? 'text-emerald-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
            id="mobile-tab-students"
          >
            <div className="relative">
              <Users className={`w-5 h-5 ${trainerTab === 'students' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Alunos</span>
            {trainerTab === 'students' && (
              <motion.div
                layoutId="trainer-nav-indicator"
                className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5"
              />
            )}
          </button>

          {/* Tab 4: Evolução */}
          <button
            onClick={() => onSelectTrainerTab('evolution')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-150 relative cursor-pointer active:scale-95 ${
              trainerTab === 'evolution' ? 'text-emerald-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
            id="mobile-tab-evolution"
          >
            <div className="relative">
              <TrendingUp className={`w-5 h-5 ${trainerTab === 'evolution' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Evolução</span>
            {trainerTab === 'evolution' && (
              <motion.div
                layoutId="trainer-nav-indicator"
                className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5"
              />
            )}
          </button>

          {/* Tab 5: Perfil */}
          <button
            onClick={() => onSelectTrainerTab('profile')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-150 relative cursor-pointer active:scale-95 ${
              trainerTab === 'profile' ? 'text-emerald-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
            id="mobile-tab-profile"
          >
            <div className="relative">
              <User className={`w-5 h-5 ${trainerTab === 'profile' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
              {activeAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-amber-500 w-2.5 h-2.5 rounded-full border-2 border-zinc-950" />
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Perfil</span>
            {trainerTab === 'profile' && (
              <motion.div
                layoutId="trainer-nav-indicator"
                className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5"
              />
            )}
          </button>
        </div>
      </nav>
    );
  }

  // Student Mode Bottom Nav
  return (
    <nav
      className="sticky bottom-0 inset-x-0 z-30 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-850 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-1.5 px-3 shadow-[0_-8px_30px_rgba(0,0,0,0.7)] shrink-0 w-full"
      id="mobile-student-bottom-nav"
    >
      <div className="max-w-md mx-auto flex items-center justify-between relative">
        {/* Tab 1: Aulas / Calendário */}
        <button
          onClick={() => onSelectStudentTab('calendar')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-150 relative cursor-pointer active:scale-95 ${
            studentTab === 'calendar' ? 'text-emerald-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
          id="mobile-student-tab-calendar"
        >
          <Calendar className={`w-5 h-5 ${studentTab === 'calendar' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Aulas</span>
          {studentTab === 'calendar' && (
            <motion.div
              layoutId="student-nav-indicator"
              className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5"
            />
          )}
        </button>

        {/* Tab 2: Cargas */}
        <button
          onClick={() => onSelectStudentTab('loads')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-150 relative cursor-pointer active:scale-95 ${
            studentTab === 'loads' ? 'text-emerald-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
          id="mobile-student-tab-loads"
        >
          <Dumbbell className={`w-5 h-5 ${studentTab === 'loads' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Cargas</span>
          {studentTab === 'loads' && (
            <motion.div
              layoutId="student-nav-indicator"
              className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5"
            />
          )}
        </button>

        {/* Central Action Button: 0-15 Emotional Checkin */}
        <div className="flex-1 flex justify-center -mt-4">
          <button
            onClick={onOpenQuickActions}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 via-emerald-400 to-emerald-500 text-zinc-950 p-0.5 shadow-lg shadow-emerald-500/40 hover:shadow-emerald-500/60 transition-all duration-200 active:scale-90 flex items-center justify-center cursor-pointer border-2 border-zinc-950 group"
            title="Check-in de Bem-Estar Subjetivo (0-15)"
            id="mobile-student-fab-checkin"
          >
            <div className="w-full h-full rounded-full flex items-center justify-center bg-zinc-950 group-hover:bg-transparent transition-colors">
              <HeartPulse className="w-5.5 h-5.5 text-emerald-400 group-hover:text-zinc-950 stroke-[2.5] transition-colors" />
            </div>
          </button>
        </div>

        {/* Tab 4: Avaliação */}
        <button
          onClick={() => onSelectStudentTab('assessment')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-150 relative cursor-pointer active:scale-95 ${
            studentTab === 'assessment' ? 'text-emerald-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
          id="mobile-student-tab-assessment"
        >
          <Activity className={`w-5 h-5 ${studentTab === 'assessment' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Avaliação</span>
          {studentTab === 'assessment' && (
            <motion.div
              layoutId="student-nav-indicator"
              className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5"
            />
          )}
        </button>

        {/* Tab 5: Plano */}
        <button
          onClick={() => onSelectStudentTab('plan')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-150 relative cursor-pointer active:scale-95 ${
            studentTab === 'plan' ? 'text-emerald-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
          id="mobile-student-tab-plan"
        >
          <CreditCard className={`w-5 h-5 ${studentTab === 'plan' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Plano</span>
          {studentTab === 'plan' && (
            <motion.div
              layoutId="student-nav-indicator"
              className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5"
            />
          )}
        </button>
      </div>
    </nav>
  );
};
