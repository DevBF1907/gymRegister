import { Student, ClassSession, LoadProgressionRecord, EmotionalCheckin, PhysicalAssessment } from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_CLASSES,
  INITIAL_LOAD_RECORDS,
  INITIAL_EMOTIONAL_CHECKINS,
  INITIAL_PHYSICAL_ASSESSMENTS
} from './mockData';

const STORAGE_KEYS = {
  STUDENTS: 'apex_personal_students',
  CLASSES: 'apex_personal_classes',
  LOAD_RECORDS: 'apex_personal_load_records',
  EMOTIONAL_CHECKINS: 'apex_personal_emotional_checkins',
  ASSESSMENTS: 'apex_personal_assessments',
};

export const getStoredStudents = (): Student[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse students from localStorage', e);
  }
  return INITIAL_STUDENTS;
};

export const saveStudents = (students: Student[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  } catch (e) {
    console.error(e);
  }
};

export const getStoredClasses = (): ClassSession[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CLASSES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_CLASSES;
};

export const saveClasses = (classes: ClassSession[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
  } catch (e) {
    console.error(e);
  }
};

export const getStoredLoadRecords = (): LoadProgressionRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOAD_RECORDS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_LOAD_RECORDS;
};

export const saveLoadRecords = (records: LoadProgressionRecord[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.LOAD_RECORDS, JSON.stringify(records));
  } catch (e) {
    console.error(e);
  }
};

export const getStoredEmotionalCheckins = (): EmotionalCheckin[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EMOTIONAL_CHECKINS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_EMOTIONAL_CHECKINS;
};

export const saveEmotionalCheckins = (checkins: EmotionalCheckin[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.EMOTIONAL_CHECKINS, JSON.stringify(checkins));
  } catch (e) {
    console.error(e);
  }
};

export const getStoredAssessments = (): PhysicalAssessment[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_PHYSICAL_ASSESSMENTS;
};

export const saveAssessments = (assessments: PhysicalAssessment[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(assessments));
  } catch (e) {
    console.error(e);
  }
};

export const resetAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.STUDENTS);
  localStorage.removeItem(STORAGE_KEYS.CLASSES);
  localStorage.removeItem(STORAGE_KEYS.LOAD_RECORDS);
  localStorage.removeItem(STORAGE_KEYS.EMOTIONAL_CHECKINS);
  localStorage.removeItem(STORAGE_KEYS.ASSESSMENTS);
};
