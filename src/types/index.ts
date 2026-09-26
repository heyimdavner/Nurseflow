export type DutyType = 'Clinical Shift' | 'Academic Lecture';

export type DutyStatus = 
  | 'Present'
  | 'Absent'
  | 'Special Holiday'
  | 'Medical'
  | 'Day Off'
  | 'Public Holiday'
  | 'Half Day'
  | 'Pending';

export interface ShiftDefinition {
  code: string;
  name: string;
  startTime: string;
  endTime: string;
  hours: number;
  isCustom?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  lsn: string; // Local Student Number, e.g. "40292"
  avatarUrl?: string;
  requiredClinicalHours: number;
  requiredLectureHours: number;
  programStartDate: string; // YYYY-MM-DD
  programEndDate: string;   // YYYY-MM-DD
  customWards: string[];    // Ward Categories: e.g. 'Medical', 'Surgical', 'Pediatrics', etc.
  specificWards?: string[]; // Specific Wards: e.g. '3B', 'NICU'
  sem2ClinicalHoursTarget?: number;
  semester2TargetHours: number; // default 105.0
  frostedGlass: boolean;
  theme: 'dark' | 'light';
  isOnboarded: boolean;
}

export interface Duty {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  shiftCode: string;
  type: DutyType;
  status: DutyStatus;
  wardCategory?: string;  // e.g. 'Surgical'
  specificWard?: string;  // e.g. '3B', 'NICU'
  customHours?: number;
  customStartTime?: string;
  customEndTime?: string;
  notes?: string;
  lectureTopic?: string;
}

export interface TopicUnit {
  id: string;
  moduleId: string;
  title: string;
  syllabusHours?: number;
  written: boolean;   // Note-taking completed (managed in Academic Hub)
  studied: boolean;   // Syllabus revision completed (managed in Study Tab)
  classroomUrl?: string; // Resource URL specific to this unit
}

export interface Module {
  id: string;
  userId?: string;
  code: string;
  name: string;
  semester: number; // 1 to 6
  isRepeated?: boolean;
  repeatTag?: string;
  units: TopicUnit[];
  mappedExam?: string; // e.g. 'Semester 1 Midterm', 'Final Exam'
}

export interface AssignmentChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Assignment {
  id: string;
  userId: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  remindAt?: string; // YYYY-MM-DDTHH:mm for browser alarm
  completed: boolean;
  checklist: AssignmentChecklistItem[];
  moduleId?: string;
}

export interface SubProcedure {
  id: string;
  title: string;
  completed?: boolean;
}

export interface ClinicalProcedure {
  id: string;
  userId: string;
  semester: number;
  moduleCode: string;
  procedureName: string;
  subProcedures?: SubProcedure[];
  demonstratedByLecturer: boolean;
  returnDemo1Date?: string | null; // ISO timestamp
  returnDemo2Date?: string | null; // ISO timestamp
  returnDemo3Date?: string | null; // ISO timestamp
  practiced: boolean;
  resourceUrl?: string;
  isCustom?: boolean;
}

export interface ExamMapping {
  id: string;
  name: string;
  date: string;
  moduleCodes: string[];
}
