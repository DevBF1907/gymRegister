import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Student,
  ClassSession,
  LoadProgressionRecord,
  EmotionalCheckin,
  PhysicalAssessment
} from './types';
import {
  getStoredStudents,
  saveStudents,
  getStoredClasses,
  saveClasses,
  getStoredLoadRecords,
  saveLoadRecords,
  getStoredEmotionalCheckins,
  saveEmotionalCheckins,
  getStoredAssessments,
  saveAssessments,
  resetAllData
} from './data/storage';
import { Header } from './components/Header';
import { TrainerDashboard } from './components/TrainerDashboard';
import { StudentArea } from './components/StudentArea';
import { EmotionalScaleModal } from './components/EmotionalScaleModal';
import { LoadProgressionModal } from './components/LoadProgressionModal';
import { PhysicalAssessmentModal } from './components/PhysicalAssessmentModal';
import { ClassBookingModal } from './components/ClassBookingModal';
import { MobileAppHeader } from './components/MobileAppHeader';
import { MobileBottomNav } from './components/MobileBottomNav';
import { QuickActionBottomSheet } from './components/QuickActionBottomSheet';
import { MobileStudentSwitcherSheet } from './components/MobileStudentSwitcherSheet';
import { MobileDeviceSimulator } from './components/MobileDeviceSimulator';
import { CheckCircle2, Dumbbell, HeartPulse, Activity } from 'lucide-react';

export default function App() {
  // Master state with persistent storage
  const [students, setStudents] = useState<Student[]>(() => getStoredStudents());
  const [classes, setClasses] = useState<ClassSession[]>(() => getStoredClasses());
  const [loadRecords, setLoadRecords] = useState<LoadProgressionRecord[]>(() => getStoredLoadRecords());
  const [emotionalCheckins, setEmotionalCheckins] = useState<EmotionalCheckin[]>(() => getStoredEmotionalCheckins());
  const [assessments, setAssessments] = useState<PhysicalAssessment[]>(() => getStoredAssessments());

  // View state
  const [viewMode, setViewMode] = useState<'trainer' | 'student'>('trainer');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => students[0]?.id || 'stud-1');

  // Mobile focused state
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(true);
  const [mobileTrainerTab, setMobileTrainerTab] = useState<'home' | 'agenda' | 'students' | 'evolution' | 'profile'>('home');
  const [mobileStudentTab, setMobileStudentTab] = useState<'calendar' | 'loads' | 'emotional' | 'assessment' | 'plan'>('calendar');
  const [isQuickActionSheetOpen, setIsQuickActionSheetOpen] = useState<boolean>(false);
  const [isStudentSwitcherSheetOpen, setIsStudentSwitcherSheetOpen] = useState<boolean>(false);

  // Modals state
  const [isEmotionalModalOpen, setIsEmotionalModalOpen] = useState(false);
  const [emotionalModalTarget, setEmotionalModalTarget] = useState<{ studentId: string; classSession?: ClassSession } | null>(null);

  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [loadModalTarget, setLoadModalTarget] = useState<{ studentId: string; initialExercise?: string } | null>(null);

  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [assessmentModalStudentId, setAssessmentModalStudentId] = useState<string>('stud-1');

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync back to storage on changes
  useEffect(() => {
    saveStudents(students);
  }, [students]);

  useEffect(() => {
    saveClasses(classes);
  }, [classes]);

  useEffect(() => {
    saveLoadRecords(loadRecords);
  }, [loadRecords]);

  useEffect(() => {
    saveEmotionalCheckins(emotionalCheckins);
  }, [emotionalCheckins]);

  useEffect(() => {
    saveAssessments(assessments);
  }, [assessments]);

  // Current selected student object
  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0];

  // Handlers
  const handleSaveEmotionalCheckin = (checkin: EmotionalCheckin) => {
    const updatedCheckins = [...emotionalCheckins, checkin];
    setEmotionalCheckins(updatedCheckins);

    // Update student's latest emotional score
    setStudents(prev => prev.map(s => {
      if (s.id === checkin.studentId) {
        return { ...s, latestEmotionalScore: checkin.score };
      }
      return s;
    }));

    // If attached to a class session, update the session
    if (checkin.classSessionId) {
      setClasses(prev => prev.map(c => {
        if (c.id === checkin.classSessionId) {
          return { ...c, emotionalScore: checkin.score, status: 'concluida' };
        }
        return c;
      }));
    }

    showToast(`Check-in de bem-estar (${checkin.score}/15) registrado com sucesso!`);
  };

  const handleSaveLoadRecord = (record: LoadProgressionRecord) => {
    // Check if this weight is higher than previous max for this student and exercise
    const previous = loadRecords.filter(r => r.studentId === record.studentId && r.exerciseName === record.exerciseName);
    const maxPrev = previous.length > 0 ? Math.max(...previous.map(p => p.weightKg)) : 0;
    const isNewPR = record.weightKg > maxPrev;

    const recordToSave = {
      ...record,
      isPersonalRecord: isNewPR || record.isPersonalRecord
    };

    setLoadRecords(prev => [...prev, recordToSave]);

    showToast(`Carga de ${record.weightKg}kg registrada para ${record.exerciseName}!${isNewPR ? ' 🔥 Novo Recorde Pessoal (PR)!' : ''}`);
  };

  const handleSaveAssessment = (assessment: PhysicalAssessment) => {
    setAssessments(prev => [...prev, assessment]);
    showToast(`Avaliação física "${assessment.title}" salva com sucesso!`);
  };

  const handleSaveClass = (newClass: ClassSession) => {
    setClasses(prev => [...prev, newClass]);
    setStudents(prev => prev.map(s => {
      if (s.id === newClass.studentId) {
        return { ...s, totalClassesCount: s.totalClassesCount + 1 };
      }
      return s;
    }));
    showToast(`Aula agendada com sucesso para ${newClass.date.split('-').reverse().join('/')} às ${newClass.time}!`);
  };

  const handleCompleteClass = (classId: string) => {
    setClasses(prev => prev.map(c => {
      if (c.id === classId) {
        return { ...c, status: 'concluida' };
      }
      return c;
    }));

    const targetClass = classes.find(c => c.id === classId);
    if (targetClass) {
      setStudents(prev => prev.map(s => {
        if (s.id === targetClass.studentId) {
          return {
            ...s,
            attendedClassesCount: s.attendedClassesCount + 1,
            streakCount: s.streakCount + 1
          };
        }
        return s;
      }));
    }

    showToast('Aula finalizada com presença confirmada!');
  };

  const handleResetData = () => {
    if (window.confirm('Deseja restaurar os dados de demonstração iniciais? Suas alterações serão redefinidas.')) {
      resetAllData();
      window.location.reload();
    }
  };

  const handleOpenEmotionalModal = (studentId?: string, classSession?: ClassSession) => {
    const targetId = studentId || selectedStudentId;
    setEmotionalModalTarget({ studentId: targetId, classSession });
    setIsEmotionalModalOpen(true);
  };

  const handleOpenLoadModal = (studentId?: string, initialExercise?: string) => {
    const targetId = studentId || selectedStudentId;
    setLoadModalTarget({ studentId: targetId, initialExercise });
    setIsLoadModalOpen(true);
  };

  const handleOpenAssessmentModal = (studentId?: string) => {
    const targetId = studentId || selectedStudentId;
    setAssessmentModalStudentId(targetId);
    setIsAssessmentModalOpen(true);
  };

  const handleSelectStudentFromDashboard = (studentId: string) => {
    setSelectedStudentId(studentId);
    setViewMode('student');
  };

  return (
    <MobileDeviceSimulator
      enabled={deviceFrameMode}
      onToggleEnabled={() => setDeviceFrameMode(prev => !prev)}
      viewMode={viewMode}
    >
      <div className="flex-1 flex flex-col bg-zinc-950 text-zinc-100 font-sans relative min-h-full">
        {/* Global Toast */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-14 left-4 right-4 z-50 bg-emerald-500 text-zinc-950 px-4 py-2.5 rounded-xl shadow-2xl font-bold text-xs flex items-center justify-between border border-emerald-400"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 stroke-[3] shrink-0" />
                <span className="truncate">{toastMessage}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile App Header */}
        <MobileAppHeader
          viewMode={viewMode}
          onToggleViewMode={setViewMode}
          students={students}
          selectedStudentId={selectedStudentId}
          onOpenStudentSwitcher={() => setIsStudentSwitcherSheetOpen(true)}
          onOpenQuickActions={() => setIsQuickActionSheetOpen(true)}
          deviceFrameMode={deviceFrameMode}
          onToggleDeviceFrame={() => setDeviceFrameMode(prev => !prev)}
          onResetData={handleResetData}
        />

        {/* Main Body */}
        <main className="flex-1 w-full px-3.5 sm:px-4 py-3 pb-24 overflow-x-hidden">
          {viewMode === 'trainer' ? (
            <TrainerDashboard
              students={students}
              classes={classes}
              loadRecords={loadRecords}
              emotionalCheckins={emotionalCheckins}
              assessments={assessments}
              onSelectStudent={handleSelectStudentFromDashboard}
              onOpenBookingModal={() => setIsBookingModalOpen(true)}
              onOpenLoadModal={(studentId, initialExercise) => handleOpenLoadModal(studentId, initialExercise)}
              onOpenEmotionalModal={(studentId, classSession) => handleOpenEmotionalModal(studentId, classSession)}
              onOpenAssessmentModal={(studentId) => handleOpenAssessmentModal(studentId)}
              onCompleteClass={handleCompleteClass}
              activeTab={mobileTrainerTab}
              onResetData={handleResetData}
              onSwitchToStudentView={() => setViewMode('student')}
              onChangeTab={(tab) => setMobileTrainerTab(tab)}
            />
          ) : (
            <StudentArea
              student={currentStudent}
              classes={classes}
              loadRecords={loadRecords}
              emotionalCheckins={emotionalCheckins}
              assessments={assessments}
              onOpenBookingModal={() => setIsBookingModalOpen(true)}
              onOpenLoadModal={(initialExercise) => handleOpenLoadModal(selectedStudentId, initialExercise)}
              onOpenEmotionalModal={(classSession) => handleOpenEmotionalModal(selectedStudentId, classSession)}
              onOpenAssessmentModal={() => handleOpenAssessmentModal(selectedStudentId)}
              onBackToDashboard={() => setViewMode('trainer')}
              activeTab={mobileStudentTab}
              onTabChange={(tab) => setMobileStudentTab(tab)}
            />
          )}
        </main>

        {/* Mobile Persistent Bottom Navigation */}
        <MobileBottomNav
          viewMode={viewMode}
          trainerTab={mobileTrainerTab}
          studentTab={mobileStudentTab}
          onSelectTrainerTab={setMobileTrainerTab}
          onSelectStudentTab={setMobileStudentTab}
          onOpenQuickActions={() => setIsQuickActionSheetOpen(true)}
          todayClassesCount={classes.filter(c => c.date === '2026-09-08' && c.status === 'agendada').length}
          activeStudentsCount={students.filter(s => s.status === 'ativo').length}
          activeAlertsCount={emotionalCheckins.filter(c => c.score <= 7).length}
        />

        {/* Quick Action Bottom Sheet */}
        <QuickActionBottomSheet
          isOpen={isQuickActionSheetOpen}
          onClose={() => setIsQuickActionSheetOpen(false)}
          onAction={(action) => {
            if (action === 'load') handleOpenLoadModal();
            else if (action === 'emotional') handleOpenEmotionalModal();
            else if (action === 'booking') setIsBookingModalOpen(true);
            else if (action === 'assessment') handleOpenAssessmentModal();
          }}
          selectedStudentName={currentStudent.name}
        />

        {/* Student Switcher Sheet */}
        <MobileStudentSwitcherSheet
          isOpen={isStudentSwitcherSheetOpen}
          onClose={() => setIsStudentSwitcherSheetOpen(false)}
          students={students}
          selectedStudentId={selectedStudentId}
          onSelectStudent={(id) => {
            setSelectedStudentId(id);
          }}
        />

        {/* Modals / Bottom Sheets */}
        {isEmotionalModalOpen && (
          <EmotionalScaleModal
            isOpen={isEmotionalModalOpen}
            onClose={() => setIsEmotionalModalOpen(false)}
            studentId={emotionalModalTarget?.studentId || selectedStudentId}
            studentName={students.find(s => s.id === (emotionalModalTarget?.studentId || selectedStudentId))?.name || 'Aluno'}
            classSessionId={emotionalModalTarget?.classSession?.id}
            onSave={handleSaveEmotionalCheckin}
          />
        )}

        {isLoadModalOpen && (
          <LoadProgressionModal
            isOpen={isLoadModalOpen}
            onClose={() => setIsLoadModalOpen(false)}
            studentId={loadModalTarget?.studentId || selectedStudentId}
            studentName={students.find(s => s.id === (loadModalTarget?.studentId || selectedStudentId))?.name || 'Aluno'}
            initialExercise={loadModalTarget?.initialExercise}
            students={students}
            loadRecords={loadRecords}
            onSelectStudent={(id) => setSelectedStudentId(id)}
            onSave={handleSaveLoadRecord}
          />
        )}

        {isAssessmentModalOpen && (
          <PhysicalAssessmentModal
            isOpen={isAssessmentModalOpen}
            onClose={() => setIsAssessmentModalOpen(false)}
            studentId={assessmentModalStudentId}
            studentName={students.find(s => s.id === assessmentModalStudentId)?.name || 'Aluno'}
            latestAssessment={assessments.filter(a => a.studentId === assessmentModalStudentId).slice(-1)[0]}
            onSave={handleSaveAssessment}
          />
        )}

        {isBookingModalOpen && (
          <ClassBookingModal
            isOpen={isBookingModalOpen}
            onClose={() => setIsBookingModalOpen(false)}
            students={students}
            selectedStudentId={selectedStudentId}
            onSave={handleSaveClass}
          />
        )}
      </div>
    </MobileDeviceSimulator>
  );
}
