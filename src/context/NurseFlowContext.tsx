import React, { createContext, useContext, useEffect, useState, useMemo, ReactNode } from 'react';
import { 
  UserProfile, 
  Duty, 
  Module, 
  ClinicalProcedure, 
  Assignment, 
  ShiftDefinition, 
  ExamMapping,
  DutyStatus
} from '../types';
import { 
  STANDARD_SHIFTS, 
  DEFAULT_WARD_CATEGORIES, 
  SEMESTER_HOURS_TARGETS, 
  INITIAL_MODULES_SEED, 
  INITIAL_PROCEDURES_SEED,
  CLINICAL_WARDS_28
} from '../data/seedData';

interface NurseFlowContextType {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  
  // Shifts
  shifts: ShiftDefinition[];
  addCustomShift: (shift: ShiftDefinition) => void;
  removeCustomShift: (code: string) => void;
  deleteCustomShift: (code: string) => void;
  resetShiftsToDefault: () => void;
  resetToSeedData: () => void;
  getShiftByCode: (code: string) => ShiftDefinition | undefined;

  // Duties
  duties: Duty[];
  addDuty: (duty: Omit<Duty, 'id' | 'userId'>) => void;
  updateDuty: (id: string, duty: Partial<Duty>) => void;
  deleteDuty: (id: string) => void;
  importRosterDuties: (newDuties: Omit<Duty, 'id' | 'userId'>[], resolutionMode?: 'overwrite' | 'keep' | 'merge') => { importedCount: number; conflictCount: number };
  lastSelectedWard: { specificWard?: string; wardCategory?: string };

  // Attendance & Hours Analytics
  programCompletionPercentage: number;
  overallAttendanceRate: number;
  isAttendanceBelowThreshold: boolean;
  totalValidDays: number;
  totalPresentDays: number;
  totalAbsentDays: number;
  totalMedicalHolidayDays: number;
  totalHalfDays: number;
  totalDayOffDays: number;
  totalPendingDays: number;
  totalClinicalHoursLogged: number;
  semesterHoursStats: Record<number, { target: number; rawHours: number; effectiveHours: number; rolledOverFromPrev?: number; rolledOverToNext?: number; percent: number }>;
  monthlyStats: Array<{
    monthKey: string; // YYYY-MM
    monthLabel: string;
    clinicalHours: number;
    attendanceRate: number;
    isLowAttendance: boolean;
    totalDuties: number;
  }>;
  wardCategoryDistribution: Array<{ category: string; hours: number; percentage: number }>;
  specificWardDistribution: Array<{ ward: string; hours: number; percentage: number }>;

  // Modules & Study Tab
  modules: Module[];
  updateModule: (id: string, updates: Partial<Module>) => void;
  swapModuleSemester: (moduleId: string, newSemester: number) => void;
  repeatStudyModule: (moduleId: string) => void;
  toggleUnitStudied: (moduleId: string, unitId: string) => void;
  toggleUnitWritten: (moduleId: string, unitId: string) => void;
  updateUnitClassroomUrl: (moduleId: string, unitId: string, url: string) => void;
  syllabusCompletionProgress: { totalUnits: number; studiedUnits: number; writtenUnits: number; percentStudied: number; percentWritten: number };

  // Exams
  exams: ExamMapping[];
  addExam: (exam: ExamMapping) => void;
  deleteExam: (id: string) => void;
  mapModuleToExam: (moduleId: string, examName?: string) => void;

  // Assignments
  assignments: Assignment[];
  addAssignment: (assignment: Omit<Assignment, 'id' | 'userId'>) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  toggleAssignmentChecklist: (assignmentId: string, checklistId: string) => void;

  // Procedures
  procedures: ClinicalProcedure[];
  addCustomProcedure: (procedure: Omit<ClinicalProcedure, 'id' | 'userId'>) => void;
  updateProcedure: (id: string, updates: Partial<ClinicalProcedure>) => void;
  deleteProcedure: (id: string) => void;
  toggleLecturerDemo: (id: string) => void;
  toggleReturnDemo: (id: string, demoNum: 1 | 2 | 3) => void;
  toggleProcedurePracticed: (id: string) => void;
  sortedProcedures: ClinicalProcedure[];

  // Global Settings & Auth
  activeTab: 'dashboard' | 'calendar' | 'academics' | 'study' | 'skills' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'calendar' | 'academics' | 'study' | 'skills' | 'settings') => void;
  handleMockLogin: () => void;
  handleMockLogout: () => void;
  resetAllData: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => boolean;

  // Filter for Calendar
  dutyFilter: 'All' | 'Clinical Duties Only' | 'Academic Lectures Only';
  setDutyFilter: (filter: 'All' | 'Clinical Duties Only' | 'Academic Lectures Only') => void;
}

const STORAGE_KEYS = {
  USER: 'nurseflow_user_v2',
  DUTIES: 'nurseflow_duties_v2',
  MODULES: 'nurseflow_modules_v2',
  PROCEDURES: 'nurseflow_procedures_v2',
  ASSIGNMENTS: 'nurseflow_assignments_v2',
  CUSTOM_SHIFTS: 'nurseflow_custom_shifts_v2',
  EXAMS: 'nurseflow_exams_v2',
  LAST_WARD: 'nurseflow_last_ward_v2'
};

const DEFAULT_USER: UserProfile = {
  id: '',
  name: 'New Student',
  email: '',
  lsn: '00000',
  avatarUrl: '',
  requiredClinicalHours: 1205.0,
  requiredLectureHours: 1400.0,
  programStartDate: new Date().toISOString().split('T')[0],
  programEndDate: new Date(Date.now() + 86400000 * 365 * 3).toISOString().split('T')[0],
  customWards: [],
  semester2TargetHours: 105.0,
  frostedGlass: true,
  theme: 'dark',
  isOnboarded: false, 
};

const SAMPLE_INITIAL_DUTIES: Duty[] = [
  {
    id: 'duty-init-1',
    userId: 'user_40292',
    date: new Date().toISOString().split('T')[0],
    shiftCode: 'C1',
    type: 'Clinical Shift',
    status: 'Present',
    wardCategory: 'Surgical',
    specificWard: '3B',
    notes: 'Morning surgical rotation rounds and wound care dressing check-offs.'
  },
  {
    id: 'duty-init-2',
    userId: 'user_40292',
    date: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0],
    shiftCode: 'J',
    type: 'Clinical Shift',
    status: 'Present',
    wardCategory: 'Pediatrics',
    specificWard: '5A',
    notes: 'Pediatric medication administration and vitals monitoring.'
  },
  {
    id: 'duty-init-3',
    userId: 'user_40292',
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    shiftCode: 'CC',
    type: 'Clinical Shift',
    status: 'Present',
    wardCategory: 'Medical',
    specificWard: '4B',
    notes: 'General medical observations.'
  },
  {
    id: 'duty-init-4',
    userId: 'user_40292',
    date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    shiftCode: 'DO',
    type: 'Clinical Shift',
    status: 'Day Off',
    wardCategory: 'Medical',
    specificWard: '4B'
  },
  {
    id: 'duty-init-5',
    userId: 'user_40292',
    date: new Date(Date.now() + 86400000 * 1).toISOString().split('T')[0],
    shiftCode: 'C1',
    type: 'Academic Lecture',
    status: 'Present',
    lectureTopic: 'Pharmacology - Systemic Drug Therapy calculations'
  }
];

const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'assign-1',
    userId: 'user_40292',
    title: 'Pharmacology Dosage Calculation Case Study',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    remindAt: new Date(Date.now() + 86400000 * 4).toISOString().slice(0, 16),
    completed: false,
    checklist: [
      { id: 'c1', text: 'Review pediatric formula (Clark’s rule)', completed: true },
      { id: 'c2', text: 'Solve sample IV drip rate conversions (gtt/min)', completed: false },
      { id: 'c3', text: 'Format submission PDF with references', completed: false }
    ],
    moduleId: 'm-sem1-03'
  },
  {
    id: 'assign-2',
    userId: 'user_40292',
    title: 'Aseptic Technique Clinical Reflection Log',
    dueDate: new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0],
    remindAt: new Date(Date.now() + 86400000 * 8).toISOString().slice(0, 16),
    completed: false,
    checklist: [
      { id: 'c2-1', text: 'Record Ward 3B surgical sterile field observations', completed: true },
      { id: 'c2-2', text: 'Complete clinical supervisor sign-off section', completed: false }
    ],
    moduleId: 'm-sem1-01'
  }
];

const NurseFlowContext = createContext<NurseFlowContextType | undefined>(undefined);

export const NurseFlowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. User Profile State
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_USER, ...parsed };
        }
      } catch (e) {
        console.error('Error parsing saved user', e);
      }
    }
    return DEFAULT_USER;
  });

  // 2. Active Tab State (Landing defaults to 'dashboard')
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calendar' | 'academics' | 'study' | 'skills' | 'settings'>('dashboard');

  // 3. Filter for Calendar
  const [dutyFilter, setDutyFilter] = useState<'All' | 'Clinical Duties Only' | 'Academic Lectures Only'>('All');

  // 4. Shifts State
  const [customShifts, setCustomShifts] = useState<ShiftDefinition[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_SHIFTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) { return []; }
    }
    return [];
  });

  const shifts = useMemo(() => {
    return [...STANDARD_SHIFTS, ...customShifts];
  }, [customShifts]);

  // 5. Duties State
  const [duties, setDuties] = useState<Duty[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DUTIES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.error('Error parsing saved duties', e);
      }
    }
    return [];
  });

  // 6. Last Selected Ward for Sticky Helper
  const [lastSelectedWard, setLastSelectedWard] = useState<{ specificWard?: string; wardCategory?: string }>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LAST_WARD);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return (parsed && typeof parsed === 'object') ? parsed : { specificWard: '3B', wardCategory: 'Surgical' };
      } catch (e) { return { specificWard: '3B', wardCategory: 'Surgical' }; }
    }
    return { specificWard: '3B', wardCategory: 'Surgical' };
  });

  // 7. Modules State
  const [modules, setModules] = useState<Module[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MODULES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.map((m: any) => ({ ...m, units: Array.isArray(m.units) ? m.units : [] })) : [];
      } catch (e) { return []; }
    }
    return [];
  });

  // 8. Procedures State
  const [procedures, setProcedures] = useState<ClinicalProcedure[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROCEDURES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.map((p: any) => ({ ...p, subProcedures: Array.isArray(p.subProcedures) ? p.subProcedures : [] })) : [];
      } catch (e) { return []; }
    }
    return [];
  });

  // 9. Assignments State
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.map((a: any) => ({ ...a, checklist: Array.isArray(a.checklist) ? a.checklist : [] })) : [];
      } catch (e) { return []; }
    }
    return [];
  });

  // 10. Exams State
  const [exams, setExams] = useState<ExamMapping[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EXAMS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) { return []; }
    }
    return [];
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DUTIES, JSON.stringify(duties));
  }, [duties]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(modules));
  }, [modules]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROCEDURES, JSON.stringify(procedures));
  }, [procedures]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_SHIFTS, JSON.stringify(customShifts));
  }, [customShifts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LAST_WARD, JSON.stringify(lastSelectedWard));
  }, [lastSelectedWard]);

  // Apply dark / light theme to document element
  useEffect(() => {
    const root = document.documentElement;
    if (user.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [user.theme]);

  // Helper to find shift definition
  const getShiftByCode = (code: string) => {
    return shifts.find(s => s.code.toUpperCase() === code.toUpperCase());
  };

  // User Profile updater
  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  // Custom Shifts handlers
  const addCustomShift = (shift: ShiftDefinition) => {
    setCustomShifts(prev => [...prev.filter(s => s.code !== shift.code), { ...shift, isCustom: true }]);
  };

  const removeCustomShift = (code: string) => {
    setCustomShifts(prev => prev.filter(s => s.code !== code));
  };

  const deleteCustomShift = (code: string) => {
    removeCustomShift(code);
  };

  const resetShiftsToDefault = () => {
    setCustomShifts([]);
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_SHIFTS);
  };

  // Duties CRUD
  const addDuty = (dutyData: Omit<Duty, 'id' | 'userId'>) => {
    const newId = `duty-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newDuty: Duty = {
      ...dutyData,
      id: newId,
      userId: user.id
    };
    setDuties(prev => [...prev.filter(d => d.date !== dutyData.date), newDuty]);

    // Update sticky last ward helper
    if (dutyData.specificWard || dutyData.wardCategory) {
      setLastSelectedWard({
        specificWard: dutyData.specificWard,
        wardCategory: dutyData.wardCategory
      });
    }
  };

  const updateDuty = (id: string, dutyUpdates: Partial<Duty>) => {
    setDuties(prev => prev.map(d => (d.id === id ? { ...d, ...dutyUpdates } : d)));
    if (dutyUpdates.specificWard || dutyUpdates.wardCategory) {
      setLastSelectedWard(prev => ({
        specificWard: dutyUpdates.specificWard || prev.specificWard,
        wardCategory: dutyUpdates.wardCategory || prev.wardCategory
      }));
    }
  };

  const deleteDuty = (id: string) => {
    setDuties(prev => prev.filter(d => d.id !== id));
  };

  // Roster Import with Duplicate Shift Overlap Guard
  const importRosterDuties = (
    newDutiesData: Omit<Duty, 'id' | 'userId'>[], 
    resolutionMode: 'overwrite' | 'keep' | 'merge' = 'merge'
  ) => {
    let importedCount = 0;
    let conflictCount = 0;

    setDuties(prevDuties => {
      const existingDateMap = new Map<string, Duty>();
      prevDuties.forEach(d => existingDateMap.set(d.date, d));

      const updatedDuties: Duty[] = [...prevDuties];

      newDutiesData.forEach(item => {
        const existing = existingDateMap.get(item.date);
        if (existing) {
          conflictCount++;
          if (resolutionMode === 'overwrite') {
            const index = updatedDuties.findIndex(d => d.id === existing.id);
            if (index !== -1) {
              updatedDuties[index] = {
                ...item,
                id: existing.id,
                userId: user.id
              };
              importedCount++;
            }
          } else if (resolutionMode === 'merge') {
            // Keep original if it was already marked Present, else update with parsed
            if (existing.status === 'Pending' || existing.status === 'Day Off') {
              const index = updatedDuties.findIndex(d => d.id === existing.id);
              if (index !== -1) {
                updatedDuties[index] = {
                  ...existing,
                  shiftCode: item.shiftCode,
                  specificWard: item.specificWard || existing.specificWard,
                  wardCategory: item.wardCategory || existing.wardCategory,
                  notes: `${existing.notes || ''} [Roster import synced]`.trim()
                };
                importedCount++;
              }
            }
          }
          // 'keep' mode does nothing to existing
        } else {
          // Brand new date
          const newId = `duty-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
          updatedDuties.push({
            ...item,
            id: newId,
            userId: user.id
          });
          importedCount++;
        }
      });

      return updatedDuties;
    });

    return { importedCount, conflictCount };
  };

  // --- MATHEMATICAL BUSINESS RULES & ANALYTICS COMPUTATIONS ---

  // Helper to compute clinical hours for a single duty
  const getClinicalHoursForDuty = (duty: Duty): number => {
    if (duty.type !== 'Clinical Shift') return 0;
    
    // Status checks
    if (duty.status === 'Absent' || 
        duty.status === 'Special Holiday' || 
        duty.status === 'Medical' || 
        duty.status === 'Day Off' || 
        duty.status === 'Public Holiday' || 
        duty.status === 'Pending') {
      return 0;
    }

    // Base scheduled hours
    let baseHours = 0;
    if (duty.customHours !== undefined && duty.customHours !== null && !isNaN(duty.customHours)) {
      baseHours = Number(duty.customHours);
    } else {
      const shift = getShiftByCode(duty.shiftCode);
      baseHours = shift ? shift.hours : 0;
    }

    if (duty.status === 'Half Day') {
      return baseHours * 0.5;
    }

    if (duty.status === 'Present') {
      return baseHours;
    }

    return 0;
  };

  // 1. Program Completion Percentage
  const programCompletionPercentage = useMemo(() => {
    const start = new Date(user.programStartDate).getTime();
    const end = new Date(user.programEndDate).getTime();
    const now = Date.now();

    if (isNaN(start) || isNaN(end) || end <= start) return 0;
    const progress = ((now - start) / (end - start)) * 100;
    return Math.max(0, Math.min(100, Math.round(progress * 10) / 10));
  }, [user.programStartDate, user.programEndDate]);

  // 2. Attendance Counts & Overall Percentage
  const {
    totalValidDays,
    totalPresentDays,
    totalAbsentDays,
    totalMedicalHolidayDays,
    totalHalfDays,
    totalDayOffDays,
    totalPendingDays,
    overallAttendanceRate,
    totalClinicalHoursLogged
  } = useMemo(() => {
    let present = 0;
    let absent = 0;
    let specialMed = 0;
    let halfDay = 0;
    let dayOff = 0;
    let pending = 0;
    let totalHours = 0;

    duties.forEach(duty => {
      // Hours
      totalHours += getClinicalHoursForDuty(duty);

      // Attendance categories
      switch (duty.status) {
        case 'Present':
          present += 1;
          break;
        case 'Absent':
          absent += 1;
          break;
        case 'Special Holiday':
        case 'Medical':
          specialMed += 1;
          break;
        case 'Half Day':
          halfDay += 1;
          break;
        case 'Day Off':
        case 'Public Holiday':
          dayOff += 1;
          break;
        case 'Pending':
          pending += 1;
          break;
      }
    });

    // Attendance Math:
    // Medical/Special holidays shouldn't penalize attendance, so we exclude them from the denominator.
    // Numerator = Present + (Half Day * 0.5)
    // Denominator = Present + Absent + Half Day
    const numerator = present + (halfDay * 0.5);
    const denominator = present + absent + halfDay;
    const rate = denominator > 0 ? (numerator / denominator) * 100 : 100.0;

    return {
      totalValidDays: denominator,
      totalPresentDays: present,
      totalAbsentDays: absent,
      totalMedicalHolidayDays: specialMed,
      totalHalfDays: halfDay,
      totalDayOffDays: dayOff,
      totalPendingDays: pending,
      overallAttendanceRate: Math.round(rate * 10) / 10,
      totalClinicalHoursLogged: Math.round(totalHours * 10) / 10
    };
  }, [duties, shifts]);

  const isAttendanceBelowThreshold = overallAttendanceRate < 80.0 && totalValidDays > 0;

  // 3. Semester Clinical Hours with Automatic Deficit Rollover
  const semesterHoursStats = useMemo(() => {
    const start = new Date(user.programStartDate).getTime();
    const end = new Date(user.programEndDate).getTime();
    const totalDuration = end - start;
    const semesterDuration = totalDuration / 6; // 6 equal semesters across 3 years

    const rawBySemester: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

    duties.forEach(d => {
      if (d.type !== 'Clinical Shift') return;
      const dutyTime = new Date(d.date).getTime();
      const hours = getClinicalHoursForDuty(d);
      if (hours <= 0) return;

      // Determine which semester this date belongs to
      const diff = dutyTime - start;
      let sem = Math.floor(diff / semesterDuration) + 1;
      if (sem < 1) sem = 1;
      if (sem > 6) sem = 6;

      rawBySemester[sem] = (rawBySemester[sem] || 0) + hours;
    });

    // Targets
    const targets: Record<number, number> = {
      1: SEMESTER_HOURS_TARGETS[1], // 125.0
      2: user.semester2TargetHours || SEMESTER_HOURS_TARGETS[2], // default 105.0
      3: SEMESTER_HOURS_TARGETS[3], // 105.0
      4: SEMESTER_HOURS_TARGETS[4], // 75.0
      5: SEMESTER_HOURS_TARGETS[5], // 250.0
      6: SEMESTER_HOURS_TARGETS[6], // 650.0
    };

    // Automatic Deficit Rollover:
    // A deficit in Semester `s` can be backfilled by hours from subsequent semesters (s+1, s+2, etc.)
    const effectiveHours: Record<number, number> = { ...rawBySemester };
    
    // We propagate deficits from Sem 1 to Sem 5, checking if any future semester can cover it.
    for (let s = 1; s <= 5; s++) {
      let deficit = Math.max(0, targets[s] - effectiveHours[s]);
      let nextSem = s + 1;
      
      while (deficit > 0 && nextSem <= 6) {
        if (effectiveHours[nextSem] > 0) {
          const rolloverAmount = Math.min(deficit, effectiveHours[nextSem]);
          effectiveHours[s] += rolloverAmount;
          effectiveHours[nextSem] -= rolloverAmount;
          deficit -= rolloverAmount;
        }
        nextSem++;
      }
    }

    const result: Record<number, { target: number; rawHours: number; effectiveHours: number; percent: number }> = {};

    for (let s = 1; s <= 6; s++) {
      const target = targets[s];
      const eff = Math.round(effectiveHours[s] * 10) / 10;
      const raw = Math.round(rawBySemester[s] * 10) / 10;
      const percent = target > 0 ? Math.min(100, Math.round((eff / target) * 100)) : (eff > 0 ? 100 : 0);

      result[s] = {
        target,
        rawHours: raw,
        effectiveHours: eff,
        percent
      };
    }

    return result;
  }, [duties, user.programStartDate, user.programEndDate, user.semester2TargetHours, shifts]);

  // 4. Monthly Stats (Clinical Hours & Attendance per Month)
  const monthlyStats = useMemo(() => {
    const monthMap = new Map<string, { present: number; absent: number; specialMed: number; halfDay: number; clinicalHours: number; totalDuties: number }>();

    duties.forEach(duty => {
      const monthKey = duty.date.slice(0, 7); // YYYY-MM
      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, { present: 0, absent: 0, specialMed: 0, halfDay: 0, clinicalHours: 0, totalDuties: 0 });
      }
      const data = monthMap.get(monthKey)!;
      data.totalDuties += 1;
      data.clinicalHours += getClinicalHoursForDuty(duty);

      switch (duty.status) {
        case 'Present':
          data.present += 1;
          break;
        case 'Absent':
          data.absent += 1;
          break;
        case 'Special Holiday':
        case 'Medical':
          data.specialMed += 1;
          break;
        case 'Half Day':
          data.halfDay += 1;
          break;
      }
    });

    // Ensure at least the current and recent months appear
    const currentMonthKey = new Date().toISOString().slice(0, 7);
    if (!monthMap.has(currentMonthKey)) {
      monthMap.set(currentMonthKey, { present: 0, absent: 0, specialMed: 0, halfDay: 0, clinicalHours: 0, totalDuties: 0 });
    }

    const sortedKeys = Array.from(monthMap.keys()).sort();

    return sortedKeys.map(key => {
      const data = monthMap.get(key)!;
      // Consistent with overall math: exclude specialMed from denominator
      const num = data.present + (data.halfDay * 0.5);
      const den = data.present + data.absent + data.halfDay;
      const rate = den > 0 ? (num / den) * 100 : 100;
      const dateObj = new Date(`${key}-01T00:00:00`);
      const monthLabel = dateObj.toLocaleString('default', { month: 'short', year: 'numeric' });

      return {
        monthKey: key,
        monthLabel,
        clinicalHours: Math.round(data.clinicalHours * 10) / 10,
        attendanceRate: Math.round(rate * 10) / 10,
        isLowAttendance: den > 0 && rate < 80.0,
        totalDuties: data.totalDuties
      };
    });
  }, [duties, shifts]);

  // 5. Ward Distribution
  const { wardCategoryDistribution, specificWardDistribution } = useMemo(() => {
    const catMap = new Map<string, number>();
    const wardMap = new Map<string, number>();
    let totalClinicalHours = 0;

    duties.forEach(duty => {
      if (duty.type !== 'Clinical Shift') return;
      const h = getClinicalHoursForDuty(duty);
      if (h <= 0) return;

      totalClinicalHours += h;
      const cat = duty.wardCategory || 'Uncategorized';
      const w = duty.specificWard || 'Unspecified';

      catMap.set(cat, (catMap.get(cat) || 0) + h);
      wardMap.set(w, (wardMap.get(w) || 0) + h);
    });

    const catDist = Array.from(catMap.entries()).map(([category, hours]) => ({
      category,
      hours: Math.round(hours * 10) / 10,
      percentage: totalClinicalHours > 0 ? Math.round((hours / totalClinicalHours) * 100) : 0
    })).sort((a, b) => b.hours - a.hours);

    const wardDist = Array.from(wardMap.entries()).map(([ward, hours]) => ({
      ward,
      hours: Math.round(hours * 10) / 10,
      percentage: totalClinicalHours > 0 ? Math.round((hours / totalClinicalHours) * 100) : 0
    })).sort((a, b) => b.hours - a.hours);

    return {
      wardCategoryDistribution: catDist,
      specificWardDistribution: wardDist
    };
  }, [duties, shifts]);

  // 6. Modules & Study Tab Operations
  const updateModule = (id: string, updates: Partial<Module>) => {
    setModules(prev => prev.map(m => (m.id === id ? { ...m, ...updates } : m)));
  };

  const swapModuleSemester = (moduleId: string, newSemester: number) => {
    setModules(prev => prev.map(m => {
      if (m.id === moduleId) {
        return { ...m, semester: newSemester };
      }
      return m;
    }));
  };

  const repeatStudyModule = (moduleId: string) => {
    const source = modules.find(m => m.id === moduleId);
    if (!source) return;

    const newModuleId = `${source.id}-rep-${Date.now()}`;
    const duplicatedModule: Module = {
      ...source,
      id: newModuleId,
      name: `${source.name} (Repeat Study)`,
      isRepeated: true,
      repeatTag: 'Repeat Track',
      units: source.units.map((u, idx) => ({
        ...u,
        id: `${u.id}-rep-${idx}-${Date.now()}`,
        moduleId: newModuleId,
        written: false,
        studied: false
      }))
    };

    setModules(prev => [...prev, duplicatedModule]);
  };

  const toggleUnitStudied = (moduleId: string, unitId: string) => {
    setModules(prev => prev.map(m => {
      if (m.id !== moduleId) return m;
      return {
        ...m,
        units: m.units.map(u => (u.id === unitId ? { ...u, studied: !u.studied } : u))
      };
    }));
  };

  const toggleUnitWritten = (moduleId: string, unitId: string) => {
    setModules(prev => prev.map(m => {
      if (m.id !== moduleId) return m;
      return {
        ...m,
        units: m.units.map(u => (u.id === unitId ? { ...u, written: !u.written } : u))
      };
    }));
  };

  const updateUnitClassroomUrl = (moduleId: string, unitId: string, url: string) => {
    setModules(prev => prev.map(m => {
      if (m.id !== moduleId) return m;
      return {
        ...m,
        units: m.units.map(u => (u.id === unitId ? { ...u, classroomUrl: url } : u))
      };
    }));
  };

  const syllabusCompletionProgress = useMemo(() => {
    let totalUnits = 0;
    let studiedUnits = 0;
    let writtenUnits = 0;

    modules.forEach(m => {
      m.units.forEach(u => {
        totalUnits++;
        if (u.studied) studiedUnits++;
        if (u.written) writtenUnits++;
      });
    });

    const percentStudied = totalUnits > 0 ? Math.round((studiedUnits / totalUnits) * 100) : 0;
    const percentWritten = totalUnits > 0 ? Math.round((writtenUnits / totalUnits) * 100) : 0;

    return { totalUnits, studiedUnits, writtenUnits, percentStudied, percentWritten };
  }, [modules]);

  // 7. Exam Mappings
  const addExam = (exam: ExamMapping) => {
    setExams(prev => [...prev, exam]);
  };

  const deleteExam = (id: string) => {
    setExams(prev => prev.filter(e => e.id !== id));
  };

  const mapModuleToExam = (moduleId: string, examName?: string) => {
    setModules(prev => prev.map(m => (m.id === moduleId ? { ...m, mappedExam: examName } : m)));
  };

  // 8. Assignments CRUD
  const addAssignment = (assignmentData: Omit<Assignment, 'id' | 'userId'>) => {
    const newId = `assign-${Date.now()}`;
    setAssignments(prev => [...prev, { ...assignmentData, id: newId, userId: user.id }]);
  };

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    setAssignments(prev => prev.map(a => (a.id === id ? { ...a, ...updates } : a)));
  };

  const deleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  const toggleAssignmentChecklist = (assignmentId: string, checklistId: string) => {
    setAssignments(prev => prev.map(a => {
      if (a.id !== assignmentId) return a;
      const updatedChecklist = a.checklist.map(item =>
        item.id === checklistId ? { ...item, completed: !item.completed } : item
      );
      const allDone = updatedChecklist.length > 0 && updatedChecklist.every(i => i.completed);
      return {
        ...a,
        checklist: updatedChecklist,
        completed: allDone
      };
    }));
  };

  // 9. Clinical Procedures CRUD & Smart Sorting
  const addCustomProcedure = (procData: Omit<ClinicalProcedure, 'id' | 'userId'>) => {
    const newId = `proc-custom-${Date.now()}`;
    setProcedures(prev => [...prev, { ...procData, id: newId, userId: user.id, isCustom: true }]);
  };

  const updateProcedure = (id: string, updates: Partial<ClinicalProcedure>) => {
    setProcedures(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProcedure = (id: string) => {
    setProcedures(prev => prev.filter(p => p.id !== id));
  };

  const toggleLecturerDemo = (id: string) => {
    setProcedures(prev => prev.map(p => {
      if (p.id !== id) return p;
      const nextState = !p.demonstratedByLecturer;
      return {
        ...p,
        demonstratedByLecturer: nextState,
        // If locking again, we preserve prior dates or leave them as is
      };
    }));
  };

  const toggleReturnDemo = (id: string, demoNum: 1 | 2 | 3) => {
    setProcedures(prev => prev.map(p => {
      if (p.id !== id) return p;
      if (!p.demonstratedByLecturer) return p; // locked

      const dateField = `returnDemo${demoNum}Date` as const;
      const isCurrentlyChecked = !!p[dateField];
      const newTimestamp = isCurrentlyChecked ? null : new Date().toISOString();

      return {
        ...p,
        [dateField]: newTimestamp
      };
    }));
  };

  const toggleProcedurePracticed = (id: string) => {
    setProcedures(prev => prev.map(p => (p.id === id ? { ...p, practiced: !p.practiced } : p)));
  };

  // Priority Smart Sorting:
  // "Procedures where 'Demonstrated by Lecturer = True' but have fewer than 3 completed 'Return Demonstrations'
  // must float automatically to the top of the skills list. Fully completed procedures must sink to the bottom."
  const sortedProcedures = useMemo(() => {
    return [...procedures].sort((a, b) => {
      const getCompletedCount = (p: ClinicalProcedure) => {
        let count = 0;
        if (p.returnDemo1Date) count++;
        if (p.returnDemo2Date) count++;
        if (p.returnDemo3Date) count++;
        return count;
      };

      const countA = getCompletedCount(a);
      const countB = getCompletedCount(b);

      const isHighPriorityA = a.demonstratedByLecturer && countA < 3;
      const isHighPriorityB = b.demonstratedByLecturer && countB < 3;

      if (isHighPriorityA && !isHighPriorityB) return -1;
      if (!isHighPriorityA && isHighPriorityB) return 1;

      // Fully completed procedures sink to bottom
      const isCompleteA = countA === 3;
      const isCompleteB = countB === 3;
      if (!isCompleteA && isCompleteB) return -1;
      if (isCompleteA && !isCompleteB) return 1;

      return a.semester - b.semester || a.procedureName.localeCompare(b.procedureName);
    });
  }, [procedures]);

  // 10. Mock Auth & Data Reset
  const handleMockLogin = () => {
    setUser(prev => ({
      ...prev,
      name: 'Nursing Candidate',
      lsn: '40292',
      email: 'candidate.nursing@health.edu',
      isOnboarded: true
    }));
  };

  const handleMockLogout = () => {
    // Clears session state while leaving static structure intact
    setUser(prev => ({
      ...prev,
      isOnboarded: false
    }));
  };

  const resetAllData = () => {
    localStorage.clear();
    setUser(DEFAULT_USER);
    setDuties([]);
    setModules([]);
    setProcedures([]);
    setAssignments([]);
    setCustomShifts([]);
    setExams([]);
    setLastSelectedWard({ specificWard: '3B', wardCategory: 'Surgical' });
    
    // Force a full page reload to ensure all state is wiped from memory
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const exportDataJSON = () => {
    const state = {
      user,
      duties,
      modules,
      procedures,
      assignments,
      customShifts,
      exams,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(state, null, 2);
  };

  const importDataJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      
      if (parsed.user) {
        const safeUser = { ...DEFAULT_USER, ...parsed.user };
        setUser(safeUser);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(safeUser));
      }
      
      if (Array.isArray(parsed.duties)) {
        setDuties(parsed.duties);
        localStorage.setItem(STORAGE_KEYS.DUTIES, JSON.stringify(parsed.duties));
      }
      
      if (Array.isArray(parsed.modules)) {
        // Defensively ensure `units` array exists on all modules
        const safeModules = parsed.modules.map((m: any) => ({
          ...m,
          units: Array.isArray(m.units) ? m.units : []
        }));
        setModules(safeModules);
        localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(safeModules));
      }
      
      if (Array.isArray(parsed.procedures)) {
        const safeProcedures = parsed.procedures.map((p: any) => ({
          ...p,
          subProcedures: Array.isArray(p.subProcedures) ? p.subProcedures : []
        }));
        setProcedures(safeProcedures);
        localStorage.setItem(STORAGE_KEYS.PROCEDURES, JSON.stringify(safeProcedures));
      }
      
      if (Array.isArray(parsed.assignments)) {
        const safeAssignments = parsed.assignments.map((a: any) => ({
          ...a,
          checklist: Array.isArray(a.checklist) ? a.checklist : []
        }));
        setAssignments(safeAssignments);
        localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(safeAssignments));
      }
      
      if (Array.isArray(parsed.customShifts)) {
        setCustomShifts(parsed.customShifts);
        localStorage.setItem(STORAGE_KEYS.CUSTOM_SHIFTS, JSON.stringify(parsed.customShifts));
      }
      
      if (Array.isArray(parsed.exams)) {
        setExams(parsed.exams);
        localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(parsed.exams));
      }
      
      return true;
    } catch (e) {
      console.error('Failed to import JSON', e);
      return false;
    }
  };

  return (
    <NurseFlowContext.Provider
      value={{
        user,
        setUser,
        updateUserProfile,
        shifts,
        addCustomShift,
        removeCustomShift,
        deleteCustomShift,
        resetShiftsToDefault,
        resetToSeedData: resetAllData,
        getShiftByCode,
        duties,
        addDuty,
        updateDuty,
        deleteDuty,
        importRosterDuties,
        lastSelectedWard,
        programCompletionPercentage,
        overallAttendanceRate,
        isAttendanceBelowThreshold,
        totalValidDays,
        totalPresentDays,
        totalAbsentDays,
        totalMedicalHolidayDays,
        totalHalfDays,
        totalDayOffDays,
        totalPendingDays,
        totalClinicalHoursLogged,
        semesterHoursStats,
        monthlyStats,
        wardCategoryDistribution,
        specificWardDistribution,
        modules,
        updateModule,
        swapModuleSemester,
        repeatStudyModule,
        toggleUnitStudied,
        toggleUnitWritten,
        updateUnitClassroomUrl,
        syllabusCompletionProgress,
        exams,
        addExam,
        deleteExam,
        mapModuleToExam,
        assignments,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        toggleAssignmentChecklist,
        procedures,
        addCustomProcedure,
        updateProcedure,
        deleteProcedure,
        toggleLecturerDemo,
        toggleReturnDemo,
        toggleProcedurePracticed,
        sortedProcedures,
        activeTab,
        setActiveTab,
        handleMockLogin,
        handleMockLogout,
        resetAllData,
        exportDataJSON,
        importDataJSON,
        dutyFilter,
        setDutyFilter
      }}
    >
      {children}
    </NurseFlowContext.Provider>
  );
};

export const useNurseFlow = () => {
  const context = useContext(NurseFlowContext);
  if (!context) {
    throw new Error('useNurseFlow must be used within a NurseFlowProvider');
  }
  return context;
};
