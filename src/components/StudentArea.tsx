import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Dumbbell, HeartPulse, Activity, CreditCard, Flame, Award, Phone, Mail, Clock, ArrowLeft } from 'lucide-react';
import { Student, ClassSession, LoadProgressionRecord, EmotionalCheckin, PhysicalAssessment } from '../types';
import { StudentCalendarView } from './StudentCalendarView';
import { StudentLoadView } from './StudentLoadView';
import { StudentEmotionalView } from './StudentEmotionalView';
import { PhysicalAssessmentView } from './PhysicalAssessmentView';
import { StudentPlanView } from './StudentPlanView';

interface StudentAreaProps {
  student: Student;
  classes: ClassSession[];
  loadRecords: LoadProgressionRecord[];
  emotionalCheckins: EmotionalCheckin[];
  assessments: PhysicalAssessment[];
  onOpenBookingModal: () => void;
  onOpenLoadModal: (initialExercise?: string) => void;
  onOpenEmotionalModal: (classSession?: ClassSession) => void;
  onOpenAssessmentModal: () => void;
  onBackToDashboard?: () => void;
  activeTab?: 'calendar' | 'loads' | 'emotional' | 'assessment' | 'plan';
  onTabChange?: (tab: 'calendar' | 'loads' | 'emotional' | 'assessment' | 'plan') => void;
}

export const StudentArea: React.FC<StudentAreaProps> = ({
  student,
  classes,
  loadRecords,
  emotionalCheckins,
  assessments,
  onOpenBookingModal,
  onOpenLoadModal,
  onOpenEmotionalModal,
  onOpenAssessmentModal,
  onBackToDashboard,
  activeTab: controlledActiveTab,
  onTabChange
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState<'calendar' | 'loads' | 'emotional' | 'assessment' | 'plan'>('calendar');
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;

  const handleSelectTab = (tab: 'calendar' | 'loads' | 'emotional' | 'assessment' | 'plan') => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalActiveTab(tab);
    }
  };

  const studentLoads = loadRecords.filter(r => r.studentId === student.id);
  const studentCheckins = emotionalCheckins.filter(c => c.studentId === student.id);
  const studentAssessments = assessments.filter(a => a.studentId === student.id);

  const studentScheduledClasses = classes
    .filter(c => c.studentId === student.id && c.status === 'agendada')
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
  const nextClass = studentScheduledClasses[0];

  interface TabItem {
    id: 'calendar' | 'loads' | 'emotional' | 'assessment' | 'plan';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
  }

  const tabs: TabItem[] = [
    { id: 'calendar', label: 'Agenda', icon: Calendar, badge: studentScheduledClasses.length },
    { id: 'loads', label: 'Evolução', icon: Dumbbell, badge: studentLoads.length },
    { id: 'assessment', label: 'Avaliação', icon: Activity, badge: studentAssessments.length },
    { id: 'emotional', label: 'Bem-estar', icon: HeartPulse, badge: `${student.latestEmotionalScore || 13}/15` },
    { id: 'plan', label: 'Plano', icon: CreditCard }
  ];

  return (
    <div className="space-y-4">
      {/* Student Hub Central Header: Foto, Nome, Plano, Próxima aula */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 relative shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {onBackToDashboard && (
              <button
                onClick={onBackToDashboard}
                className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition shrink-0 cursor-pointer"
                title="Voltar ao Painel Geral"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            {/* Foto */}
            <div className="relative shrink-0">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-13 h-13 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-zinc-900 rounded-full flex items-center justify-center text-[9px] text-zinc-950 font-black">
                ✓
              </span>
            </div>

            {/* Nome & Plano */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-heading font-extrabold text-white truncate">
                  {student.name}
                </h2>
                <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                  {student.plan.name.split(' ')[0]}
                </span>
              </div>

              {/* Próxima aula */}
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-zinc-300">
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">
                  <strong>Próxima aula:</strong>{' '}
                  {nextClass
                    ? `${nextClass.date === '2026-09-08' ? 'Hoje' : nextClass.date.split('-').slice(1).reverse().join('/')} às ${nextClass.time}`
                    : 'A combinar'}
                </span>
              </div>

              <p className="text-[10px] text-zinc-400 mt-0.5 truncate">
                {student.goal} &bull; {student.activeDays.join(', ')}
              </p>
            </div>
          </div>
        </div>

        {/* Shortcuts / Hub Central */}
        <div className="grid grid-cols-5 gap-1 mt-3 pt-3 border-t border-zinc-850">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handleSelectTab(tab.id)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-center transition cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-zinc-950 font-bold shadow-sm'
                    : 'bg-zinc-950/60 text-zinc-400 hover:text-white hover:bg-zinc-800/80 border border-zinc-850'
                }`}
                id={`hub-tab-${tab.id}`}
              >
                <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-zinc-950 stroke-[2.5]' : 'text-zinc-400'}`} />
                <span className="text-[10px] leading-tight truncate w-full">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-tab content */}
      <div>
        {activeTab === 'calendar' && (
          <StudentCalendarView
            student={student}
            classes={classes}
            onOpenBookingModal={onOpenBookingModal}
            onOpenEmotionalModal={onOpenEmotionalModal}
            onOpenLoadModal={() => onOpenLoadModal()}
          />
        )}

        {activeTab === 'loads' && (
          <StudentLoadView
            student={student}
            records={loadRecords}
            onOpenNewLoadModal={onOpenLoadModal}
          />
        )}

        {activeTab === 'emotional' && (
          <StudentEmotionalView
            student={student}
            checkins={emotionalCheckins}
            onOpenCheckinModal={() => onOpenEmotionalModal()}
          />
        )}

        {activeTab === 'assessment' && (
          <PhysicalAssessmentView
            assessments={studentAssessments}
            studentName={student.name}
            onOpenNewModal={onOpenAssessmentModal}
          />
        )}

        {activeTab === 'plan' && (
          <StudentPlanView student={student} />
        )}
      </div>
    </div>
  );
};
