import { ClinicalProcedure, Module, ShiftDefinition } from '../types';

export const STANDARD_SHIFTS: ShiftDefinition[] = [
  { code: 'C1', name: 'Morning', startTime: '07:00 AM', endTime: '03:00 PM', hours: 8.0 },
  { code: 'J', name: 'Evening', startTime: '11:00 AM', endTime: '07:00 PM', hours: 8.0 },
  { code: 'N', name: 'Night', startTime: '07:00 PM', endTime: '07:00 AM', hours: 12.0 },
  { code: 'CC', name: 'Day', startTime: '07:00 AM', endTime: '01:00 PM', hours: 6.0 },
  { code: 'C3', name: 'Extended Day', startTime: '07:00 AM', endTime: '07:00 PM', hours: 12.0 },
  { code: 'L', name: 'Afternoon', startTime: '01:00 PM', endTime: '07:00 PM', hours: 6.0 },
  { code: 'HS', name: 'Half Shift', startTime: '01:00 PM', endTime: '04:00 PM', hours: 3.0 },
  { code: 'DO', name: 'Day Off', startTime: '00:00 AM', endTime: '00:00 AM', hours: 0.0 },
];

export const CLINICAL_WARDS_28 = [
  '3B', '3C', '4A', '4B', '4C', '5A', '5B', '5C', 
  '6A', '6B', '6C', '7C', '8A', '8B', '8C', 
  'ETU', 'DSU', 'NICU', 'MICU', 'SICU', 'CCU', 
  'GOT', 'CSSD', 'Cathlab', 'Blood Bank', 'RICU', 
  'Endoscopy', 'Fertility & IVF'
];

export const DEFAULT_WARD_CATEGORIES = [
  'Medical',
  'Surgical',
  'Pediatrics',
  'Geriatrics',
  'ICU',
  'ETU',
  'Gynae/Obstetrics'
];

export const SEMESTER_HOURS_TARGETS: Record<number, number> = {
  1: 125.0,
  2: 105.0, // customizable in settings, default 105.0
  3: 105.0,
  4: 75.0,
  5: 250.0,
  6: 650.0
};

export const INITIAL_MODULES_SEED: Module[] = [
  // --- SEMESTER 1 ---
  {
    id: 'm-sem1-01',
    code: 'N85T002M01',
    name: 'Fundamentals of Nursing I',
    semester: 1,
    units: [
      { id: 'u1-1', moduleId: 'm-sem1-01', title: 'Introduction of Professional Nursing', syllabusHours: 15, written: true, studied: true },
      { id: 'u1-2', moduleId: 'm-sem1-01', title: 'Principles of Maintaining a Safe Environment', syllabusHours: 12, written: true, studied: true },
      { id: 'u1-3', moduleId: 'm-sem1-01', title: 'Preparation of the Safe Environment', syllabusHours: 10, written: true, studied: false },
      { id: 'u1-4', moduleId: 'm-sem1-01', title: 'Assess Vital Signs', syllabusHours: 10, written: true, studied: true },
      { id: 'u1-5', moduleId: 'm-sem1-01', title: 'Meeting the Hygienic Needs of the Client', syllabusHours: 8, written: false, studied: false },
      { id: 'u1-6', moduleId: 'm-sem1-01', title: 'Assisting with Nutritional Needs', syllabusHours: 6, written: false, studied: false },
      { id: 'u1-7', moduleId: 'm-sem1-01', title: 'Elimination Support', syllabusHours: 3, written: false, studied: false },
      { id: 'u1-8', moduleId: 'm-sem1-01', title: 'Rest, Sleep, and Comfort', syllabusHours: 14, written: false, studied: false },
    ]
  },
  {
    id: 'm-sem1-02',
    code: 'N85T002M02',
    name: 'Anatomy and Physiology in Nursing I',
    semester: 1,
    units: [
      { id: 'u2-1', moduleId: 'm-sem1-02', title: 'Introduction to Anatomical Terms and Body Organization', syllabusHours: 4, written: true, studied: true },
      { id: 'u2-2', moduleId: 'm-sem1-02', title: 'Introduction to Detailed Body Structure', syllabusHours: 10, written: true, studied: true },
      { id: 'u2-3', moduleId: 'm-sem1-02', title: 'The Skeleton and Joints', syllabusHours: 12, written: true, studied: false },
      { id: 'u2-4', moduleId: 'm-sem1-02', title: 'The Muscular System', syllabusHours: 5, written: true, studied: false },
      { id: 'u2-5', moduleId: 'm-sem1-02', title: 'Blood and Blood Products', syllabusHours: 10, written: false, studied: false },
      { id: 'u2-6', moduleId: 'm-sem1-02', title: 'The Circulatory System', syllabusHours: 10, written: false, studied: false },
      { id: 'u2-7', moduleId: 'm-sem1-02', title: 'The Lymphatic System', syllabusHours: 6, written: false, studied: false },
      { id: 'u2-8', moduleId: 'm-sem1-02', title: 'The Nervous System', syllabusHours: 12, written: false, studied: false },
    ]
  },
  {
    id: 'm-sem1-03',
    code: 'N85T002M03',
    name: 'Basic Pharmacology for Nursing',
    semester: 1,
    units: [
      { id: 'u3-1', moduleId: 'm-sem1-03', title: 'Introduction and Terminology', syllabusHours: 4, written: true, studied: true },
      { id: 'u3-2', moduleId: 'm-sem1-03', title: 'Pharmaceutical Standards and Prescriptions', syllabusHours: 4, written: true, studied: false },
      { id: 'u3-3', moduleId: 'm-sem1-03', title: 'Professional Obligations and Legal Guidelines', syllabusHours: 3, written: false, studied: false },
      { id: 'u3-4', moduleId: 'm-sem1-03', title: 'Weights, Measures, and Math Calculations', syllabusHours: 6, written: true, studied: true },
      { id: 'u3-5', moduleId: 'm-sem1-03', title: 'Preparation of Solutions', syllabusHours: 2, written: false, studied: false },
      { id: 'u3-6', moduleId: 'm-sem1-03', title: 'Administration of Drugs', syllabusHours: 10, written: false, studied: false },
      { id: 'u3-7', moduleId: 'm-sem1-03', title: 'Actions and Fate of Drugs', syllabusHours: 3, written: false, studied: false },
      { id: 'u3-8', moduleId: 'm-sem1-03', title: 'Drug Classifications', syllabusHours: 6, written: false, studied: false },
      { id: 'u3-9', moduleId: 'm-sem1-03', title: 'Nurses\' Responsibility and Safety Guidelines', syllabusHours: 4, written: false, studied: false },
      { id: 'u3-10', moduleId: 'm-sem1-03', title: 'Pharmaceutical Preparations', syllabusHours: 6, written: false, studied: false },
    ]
  },
  {
    id: 'm-sem1-04',
    code: 'N85T002M04',
    name: 'History & Trends in Nursing',
    semester: 1,
    units: [
      { id: 'u4-1', moduleId: 'm-sem1-04', title: 'Nursing as an Art, Vocation, and Profession', syllabusHours: 6, written: true, studied: true },
      { id: 'u4-2', moduleId: 'm-sem1-04', title: 'Current Trends in Nursing Education and Services', syllabusHours: 10, written: true, studied: false },
      { id: 'u4-3', moduleId: 'm-sem1-04', title: 'Professional Organizations', syllabusHours: 4, written: false, studied: false },
    ]
  },
  {
    id: 'm-sem1-05',
    code: 'N85T002M05',
    name: 'Nursing Professionalism and Ethics',
    semester: 1,
    units: [
      { id: 'u5-1', moduleId: 'm-sem1-05', title: 'Nursing as a Profession', syllabusHours: 2, written: true, studied: true },
      { id: 'u5-2', moduleId: 'm-sem1-05', title: 'Professional Ethics and Etiquette', syllabusHours: 4, written: true, studied: true },
      { id: 'u5-3', moduleId: 'm-sem1-05', title: 'Personal and Professional Development', syllabusHours: 6, written: false, studied: false },
    ]
  },
  {
    id: 'm-sem1-06',
    code: 'N85T002M06',
    name: 'Scientific Principles in Nursing Practice',
    semester: 1,
    units: [
      { id: 'u6-1', moduleId: 'm-sem1-06', title: 'Structure, Composition, and Reaction of Matter', syllabusHours: 6, written: true, studied: false },
      { id: 'u6-2', moduleId: 'm-sem1-06', title: 'Electricity in Nursing', syllabusHours: 4, written: false, studied: false },
      { id: 'u6-3', moduleId: 'm-sem1-06', title: 'Radio-Activity', syllabusHours: 2, written: false, studied: false },
      { id: 'u6-4', moduleId: 'm-sem1-06', title: 'Organic Chemistry and Matter', syllabusHours: 3, written: false, studied: false },
      { id: 'u6-5', moduleId: 'm-sem1-06', title: 'Matter, Energy, and Life', syllabusHours: 5, written: false, studied: false },
      { id: 'u6-6', moduleId: 'm-sem1-06', title: 'Application of Principles', syllabusHours: 3, written: false, studied: false },
    ]
  },
  {
    id: 'm-sem1-07',
    code: 'EMPM01',
    name: 'Workplace Information Management',
    semester: 1,
    units: [
      { id: 'u7-1', moduleId: 'm-sem1-07', title: 'Documentation and ICT Tools', syllabusHours: 8, written: true, studied: true },
      { id: 'u7-2', moduleId: 'm-sem1-07', title: 'Information Analysis and Analytics', syllabusHours: 6, written: false, studied: false },
      { id: 'u7-3', moduleId: 'm-sem1-07', title: 'Customer Relationship Management', syllabusHours: 6, written: false, studied: false },
    ]
  },

  // --- SEMESTER 2 ---
  {
    id: 'm-sem2-08',
    code: 'N85T002M07',
    name: 'Psychology in Nursing',
    semester: 2,
    units: [
      { id: 'u8-1', moduleId: 'm-sem2-08', title: 'Introduction', syllabusHours: 2, written: false, studied: false },
      { id: 'u8-2', moduleId: 'm-sem2-08', title: 'Structure of the Mind', syllabusHours: 2, written: false, studied: false },
      { id: 'u8-3', moduleId: 'm-sem2-08', title: 'Psychology of Human Behavior', syllabusHours: 10, written: false, studied: false },
      { id: 'u8-4', moduleId: 'm-sem2-08', title: 'Learning', syllabusHours: 2, written: false, studied: false },
      { id: 'u8-5', moduleId: 'm-sem2-08', title: 'Thinking, Reasoning, and Perception', syllabusHours: 4, written: false, studied: false },
      { id: 'u8-6', moduleId: 'm-sem2-08', title: 'Personality and Intelligence', syllabusHours: 10, written: false, studied: false },
    ]
  },
  {
    id: 'm-sem2-09',
    code: 'N85T002M08',
    name: 'Fundamentals of Nursing II',
    semester: 2,
    units: [
      { id: 'u9-1', moduleId: 'm-sem2-09', title: 'Therapeutic Application of Heat and Cold', syllabusHours: 4, written: false, studied: false },
      { id: 'u9-2', moduleId: 'm-sem2-09', title: 'Elimination and Gastrointestinal Procedures', syllabusHours: 8, written: false, studied: false },
      { id: 'u9-3', moduleId: 'm-sem2-09', title: 'Safe Medication Administration', syllabusHours: 10, written: false, studied: false },
      { id: 'u9-4', moduleId: 'm-sem2-09', title: 'Medical and Surgical Asepsis', syllabusHours: 8, written: false, studied: false },
      { id: 'u9-5', moduleId: 'm-sem2-09', title: 'Rehabilitation and Patient Mobilization', syllabusHours: 6, written: false, studied: false },
    ]
  },
  {
    id: 'm-sem2-10',
    code: 'N85T002M09',
    name: 'Anatomy and Physiology II',
    semester: 2,
    units: [
      { id: 'u10-1', moduleId: 'm-sem2-10', title: 'The Sense Organs', syllabusHours: 10, written: false, studied: false },
      { id: 'u10-2', moduleId: 'm-sem2-10', title: 'The Respiratory System', syllabusHours: 10, written: false, studied: false },
      { id: 'u10-3', moduleId: 'm-sem2-10', title: 'The Digestive System', syllabusHours: 10, written: false, studied: false },
      { id: 'u10-4', moduleId: 'm-sem2-10', title: 'The Excretory and Urinary System', syllabusHours: 12, written: false, studied: false },
    ]
  },
  {
    id: 'm-sem2-11',
    code: 'N85T002M10',
    name: 'Socio Cultural Aspects in Nursing',
    semester: 2,
    units: [
      { id: 'u11-1', moduleId: 'm-sem2-11', title: 'Introduction', syllabusHours: 2, written: false, studied: false },
      { id: 'u11-2', moduleId: 'm-sem2-11', title: 'Individual and Socialization', syllabusHours: 4, written: false, studied: false },
      { id: 'u11-3', moduleId: 'm-sem2-11', title: 'The Family as a Social Unit', syllabusHours: 4, written: false, studied: false },
      { id: 'u11-4', moduleId: 'm-sem2-11', title: 'Social Problems and Stratification', syllabusHours: 6, written: false, studied: false },
      { id: 'u11-5', moduleId: 'm-sem2-11', title: 'The Community', syllabusHours: 4, written: false, studied: false },
    ]
  },
  {
    id: 'm-sem2-12',
    code: 'N85T002M11',
    name: 'Nutrition for Health and Illness',
    semester: 2,
    units: [
      { id: 'u12-1', moduleId: 'm-sem2-12', title: 'History and Energy', syllabusHours: 9, written: false, studied: false },
      { id: 'u12-2', moduleId: 'm-sem2-12', title: 'National Food Problems', syllabusHours: 2, written: false, studied: false },
      { id: 'u12-3', moduleId: 'm-sem2-12', title: 'Specific Nutrients', syllabusHours: 8, written: false, studied: false },
      { id: 'u12-4', moduleId: 'm-sem2-12', title: 'Family Meal Planning', syllabusHours: 3, written: false, studied: false },
      { id: 'u12-5', moduleId: 'm-sem2-12', title: 'Food Hygiene and Preservation', syllabusHours: 6, written: false, studied: false },
      { id: 'u12-6', moduleId: 'm-sem2-12', title: 'Invalid Cookery and Feeding', syllabusHours: 10, written: false, studied: false },
      { id: 'u12-7', moduleId: 'm-sem2-12', title: 'Nutritional Deficiencies', syllabusHours: 6, written: false, studied: false },
      { id: 'u12-8', moduleId: 'm-sem2-12', title: 'Medical Nutrition Therapy in Disease', syllabusHours: 6, written: false, studied: false },
    ]
  },
  {
    id: 'm-sem2-13',
    code: 'N85T002M12',
    name: 'First Aid Principles and Applications',
    semester: 2,
    units: [
      { id: 'u13-1', moduleId: 'm-sem2-13', title: 'First Aid Principles', syllabusHours: 4, written: false, studied: false },
      { id: 'u13-2', moduleId: 'm-sem2-13', title: 'Emergency Measures', syllabusHours: 2, written: false, studied: false },
      { id: 'u13-3', moduleId: 'm-sem2-13', title: 'Specific First Aid Situations', syllabusHours: 10, written: false, studied: false },
      { id: 'u13-4', moduleId: 'm-sem2-13', title: 'Bandaging, Splinting, and Transport', syllabusHours: 3, written: false, studied: false },
      { id: 'u13-5', moduleId: 'm-sem2-13', title: 'Basic Life Support', syllabusHours: 4, written: false, studied: false },
      { id: 'u13-6', moduleId: 'm-sem2-13', title: 'Fire Safety', syllabusHours: 3, written: false, studied: false },
    ]
  },
  {
    id: 'm-sem2-14',
    code: 'EMPM02',
    name: 'Workplace Communication Management',
    semester: 2,
    units: [
      { id: 'u14-1', moduleId: 'm-sem2-14', title: 'Principles of Workplace Communication', syllabusHours: 6, written: false, studied: false },
      { id: 'u14-2', moduleId: 'm-sem2-14', title: 'Applications of ICT and Written Communication', syllabusHours: 6, written: false, studied: false },
    ]
  },

  // --- SEMESTER 3 ---
  {
    id: 'm-sem3-15',
    code: 'N85T002M13',
    name: 'Applied Pharmacology for Nursing',
    semester: 3,
    units: [
      { id: 'u15-1', moduleId: 'm-sem3-15', title: 'Pharmacology by Body Systems', syllabusHours: 25, written: false, studied: false },
      { id: 'u15-2', moduleId: 'm-sem3-15', title: 'Specialized Drug Therapies', syllabusHours: 5, written: false, studied: false },
    ]
  },
  {
    id: 'm-sem3-16',
    code: 'N85T002M14',
    name: 'Pathology in Nursing',
    semester: 3,
    units: [
      { id: 'u16-1', moduleId: 'm-sem3-16', title: 'Introduction to Pathology', syllabusHours: 2, written: false, studied: false },
      { id: 'u16-2', moduleId: 'm-sem3-16', title: 'The Inflammatory Process', syllabusHours: 4, written: false, studied: false },
      { id: 'u16-3', moduleId: 'm-sem3-16', title: 'Circulatory Disturbances', syllabusHours: 4, written: false, studied: false },
      { id: 'u16-4', moduleId: 'm-sem3-16', title: 'Disorders of Growth', syllabusHours: 4, written: false, studied: false },
      { id: 'u16-5', moduleId: 'm-sem3-16', title: 'Laboratory Specimen Dispatch', syllabusHours: 8, written: false, studied: false },
    ]
  },
  {
    id: 'm-sem3-17',
    code: 'N85T002M15',
    name: 'Microbiology in Nursing',
    semester: 3,
    units: [
      { id: 'u17-1', moduleId: 'm-sem3-17', title: 'Introduction to Microbiology', syllabusHours: 2, written: false, studied: false },
      { id: 'u17-2', moduleId: 'm-sem3-17', title: 'Study of Micro-organisms', syllabusHours: 6, written: false, studied: false },
      { id: 'u17-3', moduleId: 'm-sem3-17', title: 'Infection and Transmission', syllabusHours: 6, written: false, studied: false },
      { id: 'u17-4', moduleId: 'm-sem3-17', title: 'Immunology', syllabusHours: 4, written: false, studied: false },
      { id: 'u17-5', moduleId: 'm-sem3-17', title: 'Control and Destruction of Microbes', syllabusHours: 6, written: false, studied: false },
    ]
  },
  {
    id: 'm-sem3-18',
    code: 'N85T002M16',
    name: 'Adult Nursing I',
    semester: 3,
    units: [
      { id: 'u18-1', moduleId: 'm-sem3-18', title: 'History and Assessment', syllabusHours: 9, written: false, studied: false },
      { id: 'u18-2', moduleId: 'm-sem3-18', title: 'Role of Stress in Illness', syllabusHours: 4, written: false, studied: false },
      { id: 'u18-3', moduleId: 'm-sem3-18', title: 'Nursing Management of Communicable Diseases', syllabusHours: 15, written: false, studied: false },
    ]
  },
  {
    id: 'm-sem3-19',
    code: 'N85T002M17',
    name: 'Community Health',
    semester: 3,
    units: [
      { id: 'u19-1', moduleId: 'm-sem3-19', title: 'Concepts of Community Health', syllabusHours: 6, written: false, studied: false },
      { id: 'u19-2', moduleId: 'm-sem3-19', title: 'Administrative Structure', syllabusHours: 2, written: false, studied: false },
      { id: 'u19-3', moduleId: 'm-sem3-19', title: 'Community Health Problems', syllabusHours: 12, written: false, studied: false },
    ]
  },
  {
    id: 'm-sem3-20',
    code: 'EMPM03',
    name: 'Planning and Scheduling Work at Workplace',
    semester: 3,
    units: [
      { id: 'u20-1', moduleId: 'm-sem3-20', title: 'Workplace Planning and Scheduling', syllabusHours: 6, written: false, studied: false },
    ]
  },

  // --- SEMESTER 4 ---
  {
    id: 'm-sem4-21',
    code: 'N85T002M18',
    name: 'Pediatrics & Pediatric Nursing',
    semester: 4,
    units: [
      { id: 'u21-1', moduleId: 'm-sem4-21', title: 'Introduction to Child Health', syllabusHours: 3, written: false, studied: false },
      { id: 'u21-2', moduleId: 'm-sem4-21', title: 'Growth and Development', syllabusHours: 15, written: false, studied: false },
      { id: 'u21-3', moduleId: 'm-sem4-21', title: 'Hospitalization of the Child', syllabusHours: 3, written: false, studied: false },
      { id: 'u21-4', moduleId: 'm-sem4-21', title: 'Pediatric Procedures', syllabusHours: 10, written: false, studied: false },
      { id: 'u21-5', moduleId: 'm-sem4-21', title: 'Child with Congenital Disorders', syllabusHours: 12, written: false, studied: false },
      { id: 'u21-6', moduleId: 'm-sem4-21', title: 'Pediatric Systemic Disorders', syllabusHours: 15, written: false, studied: false },
      { id: 'u21-7', moduleId: 'm-sem4-21', title: 'Pediatric Emergencies & Child Welfare', syllabusHours: 6, written: false, studied: false },
    ]
  },
  {
    id: 'm-sem4-22',
    code: 'N85T002M19',
    name: 'Women Nursing',
    semester: 4,
    units: [
      { id: 'u22-1', moduleId: 'm-sem4-22', title: 'Introduction', syllabusHours: 5, written: false, studied: false },
      { id: 'u22-2', moduleId: 'm-sem4-22', title: 'Gynecological Assessment', syllabusHours: 4, written: false, studied: false },
      { id: 'u22-3', moduleId: 'm-sem4-22', title: 'Gynecological Management', syllabusHours: 4, written: false, studied: false },
      { id: 'u22-4', moduleId: 'm-sem4-22', title: 'Inflammatory and Infectious Conditions', syllabusHours: 5, written: false, studied: false },
      { id: 'u22-5', moduleId: 'm-sem4-22', title: 'Maternity Nursing', syllabusHours: 6, written: false, studied: false },
    ]
  },
  {
    id: 'm-sem4-23',
    code: 'N85T002M20',
    name: 'Adult Nursing II',
    semester: 4,
    units: [
      { id: 'u23-1', moduleId: 'm-sem4-23', title: 'Hematological Disorders', syllabusHours: 15, written: false, studied: false },
      { id: 'u23-2', moduleId: 'm-sem4-23', title: 'Eye, Ear, Nose, Throat (ENT) and Eye Disorders', syllabusHours: 12, written: false, studied: false },
      { id: 'u23-3', moduleId: 'm-sem4-23', title: 'Integumentary and Connective Tissue Disorders', syllabusHours: 10, written: false, studied: false },
      { id: 'u23-4', moduleId: 'm-sem4-23', title: 'Musculoskeletal Disorders', syllabusHours: 15, written: false, studied: false },
      { id: 'u23-5', moduleId: 'm-sem4-23', title: 'Emergency and Disaster Management', syllabusHours: 20, written: false, studied: false },
    ]
  },

  // --- SEMESTER 5 ---
  {
    id: 'm-sem5-24',
    code: 'N85T002M21',
    name: 'Geriatric Care in Nursing',
    semester: 5,
    units: [
      { id: 'u24-1', moduleId: 'm-sem5-24', title: 'Basic Science and Gerontology', syllabusHours: 5, written: false, studied: false },
      { id: 'u24-2', moduleId: 'm-sem5-24', title: 'Geriatric Assessment and Nutrition', syllabusHours: 8, written: false, studied: false },
      { id: 'u24-3', moduleId: 'm-sem5-24', title: 'Geriatric Diseases and Management', syllabusHours: 12, written: false, studied: false },
    ]
  },
  {
    id: 'm-sem5-25',
    code: 'N85T002M22',
    name: 'Palliative Care in Nursing',
    semester: 5,
    units: [
      { id: 'u25-1', moduleId: 'm-sem5-25', title: 'Introduction to Palliative Care', syllabusHours: 4, written: false, studied: false },
      { id: 'u25-2', moduleId: 'm-sem5-25', title: 'Pain and Symptom Management', syllabusHours: 10, written: false, studied: false },
      { id: 'u25-3', moduleId: 'm-sem5-25', title: 'Psychosocial and Spiritual Support', syllabusHours: 6, written: false, studied: false },
    ]
  },
  {
    id: 'm-sem5-26',
    code: 'N85T002M23',
    name: 'Research in Nursing',
    semester: 5,
    units: [
      { id: 'u26-1', moduleId: 'm-sem5-26', title: 'Introduction to Nursing Research', syllabusHours: 3, written: false, studied: false },
      { id: 'u26-2', moduleId: 'm-sem5-26', title: 'The Research Process', syllabusHours: 2, written: false, studied: false },
      { id: 'u26-3', moduleId: 'm-sem5-26', title: 'Research Design and Methodology', syllabusHours: 4, written: false, studied: false },
    ]
  },
  {
    id: 'm-sem5-27',
    code: 'N85T002M24',
    name: 'Psychiatric Nursing',
    semester: 5,
    units: [
      { id: 'u27-1', moduleId: 'm-sem5-27', title: 'Introduction', syllabusHours: 4, written: false, studied: false },
      { id: 'u27-2', moduleId: 'm-sem5-27', title: 'History of Psychiatry', syllabusHours: 3, written: false, studied: false },
      { id: 'u27-3', moduleId: 'm-sem5-27', title: 'Mental Health Assessment', syllabusHours: 4, written: false, studied: false },
      { id: 'u27-4', moduleId: 'm-sem5-27', title: 'Therapeutic Relationship', syllabusHours: 4, written: false, studied: false },
      { id: 'u27-5', moduleId: 'm-sem5-27', title: 'Mental Disorders & Nursing Care', syllabusHours: 8, written: false, studied: false },
      { id: 'u27-6', moduleId: 'm-sem5-27', title: 'Bio-Psycho-Social Therapies', syllabusHours: 3, written: false, studied: false },
    ]
  },
  {
    id: 'm-sem5-28',
    code: 'N85T002M25',
    name: 'Management and Leadership in Nursing',
    semester: 5,
    units: [
      { id: 'u28-1', moduleId: 'm-sem5-28', title: 'Introduction', syllabusHours: 3, written: false, studied: false },
      { id: 'u28-2', moduleId: 'm-sem5-28', title: 'Client Care Management', syllabusHours: 3, written: false, studied: false },
      { id: 'u28-3', moduleId: 'm-sem5-28', title: 'Resource and Personnel Management', syllabusHours: 6, written: false, studied: false },
    ]
  },
  {
    id: 'm-sem5-29',
    code: 'EMPM04',
    name: 'Problem Solving and Decision Making',
    semester: 5,
    units: [
      { id: 'u29-1', moduleId: 'm-sem5-29', title: 'Problem Solving Techniques', syllabusHours: 6, written: false, studied: false },
      { id: 'u29-2', moduleId: 'm-sem5-29', title: 'Decision Making Styles', syllabusHours: 4, written: false, studied: false },
    ]
  },

  // --- SEMESTER 6 ---
  {
    id: 'm-sem6-30',
    code: 'EMPM05',
    name: 'Teamwork and Leadership',
    semester: 6,
    units: [
      { id: 'u30-1', moduleId: 'm-sem6-30', title: 'Team Processes and Roles', syllabusHours: 8, written: false, studied: false },
      { id: 'u30-2', moduleId: 'm-sem6-30', title: 'Team Communication and Social Analysis', syllabusHours: 8, written: false, studied: false },
    ]
  },
  {
    id: 'm-sem6-31',
    code: 'EMPM06',
    name: 'Creating and Maintaining a Learning Culture at Workplace',
    semester: 6,
    units: [
      { id: 'u31-1', moduleId: 'm-sem6-31', title: 'Learning Culture Concepts', syllabusHours: 8, written: false, studied: false },
    ]
  }
];

export const INITIAL_PROCEDURES_SEED: ClinicalProcedure[] = [
  // --- SEMESTER 1 ---
  {
    id: 'proc-s1-01',
    userId: 'default',
    semester: 1,
    moduleCode: 'Module 01: Medical asepsis',
    procedureName: '01.1 Methodical hand washing',
    demonstratedByLecturer: true,
    returnDemo1Date: '2025-02-10T09:30:00.000Z',
    returnDemo2Date: '2025-02-14T11:15:00.000Z',
    returnDemo3Date: '2025-02-18T14:00:00.000Z',
    practiced: true,
    resourceUrl: 'https://youtube.com',
  },
  {
    id: 'proc-s1-02',
    userId: 'default',
    semester: 1,
    moduleCode: 'Module 01: Medical asepsis',
    procedureName: '01.2 Wearing gloves/mask/gown',
    demonstratedByLecturer: true,
    returnDemo1Date: '2025-02-12T10:00:00.000Z',
    returnDemo2Date: '2025-02-19T15:20:00.000Z',
    returnDemo3Date: null,
    practiced: true,
  },
  {
    id: 'proc-s1-03',
    userId: 'default',
    semester: 1,
    moduleCode: 'Module 01: Medical asepsis',
    procedureName: '01.3 Donning & doffing',
    demonstratedByLecturer: true,
    returnDemo1Date: '2025-02-20T08:45:00.000Z',
    returnDemo2Date: null,
    returnDemo3Date: null,
    practiced: false,
  },
  {
    id: 'proc-s1-04',
    userId: 'default',
    semester: 1,
    moduleCode: 'Module 02: Preparation of the safe environment',
    procedureName: '02.1 Preparation of beds',
    subProcedures: [
      { id: 'sub-02-1', title: '02.1.1 unoccupied bed' },
      { id: 'sub-02-2', title: '02.1.2 stripping/remaking' },
      { id: 'sub-02-3', title: '02.1.3 occupied bed' },
      { id: 'sub-02-4', title: '02.1.4 changing bed' },
      { id: 'sub-02-5', title: '02.1.5 admission bed' },
      { id: 'sub-02-6', title: '02.1.6 carbolizing' },
      { id: 'sub-02-7', title: '02.1.7 surgical bed' },
      { id: 'sub-02-8', title: '02.1.8 cardiac bed' },
      { id: 'sub-02-9', title: '02.2.9 amputation bed' },
    ],
    demonstratedByLecturer: true,
    returnDemo1Date: '2025-02-25T11:00:00.000Z',
    returnDemo2Date: null,
    returnDemo3Date: null,
    practiced: true,
  },
  {
    id: 'proc-s1-05',
    userId: 'default',
    semester: 1,
    moduleCode: 'Module 03: Health assessment',
    procedureName: '03.1 General physical assessment',
    subProcedures: [
      { id: 'sub-03-1-1', title: '03.1.1 history taking' },
      { id: 'sub-03-1-2', title: '03.1.2 height/weight measurement' },
      { id: 'sub-03-1-3', title: '03.1.3 head-to-toe examination' },
      { id: 'sub-03-1-4', title: '03.1.4 observation chart' },
    ],
    demonstratedByLecturer: true,
    returnDemo1Date: '2025-03-01T14:30:00.000Z',
    returnDemo2Date: '2025-03-05T09:00:00.000Z',
    returnDemo3Date: null,
    practiced: true,
  },
  {
    id: 'proc-s1-06',
    userId: 'default',
    semester: 1,
    moduleCode: 'Module 03: Health assessment',
    procedureName: '03.2 Patient Positioning',
    subProcedures: [
      { id: 'sub-03-2-1', title: "Fowler's position" },
      { id: 'sub-03-2-2', title: 'Supine position' },
      { id: 'sub-03-2-3', title: 'Lateral position' },
      { id: 'sub-03-2-4', title: 'Prone position' },
      { id: 'sub-03-2-5', title: 'Lithotomy position' },
      { id: 'sub-03-2-6', title: "Sims' position" },
      { id: 'sub-03-2-7', title: 'Dorsal recumbent position' },
      { id: 'sub-03-2-8', title: 'Trendelenburg position' },
    ],
    demonstratedByLecturer: true,
    returnDemo1Date: '2025-03-04T10:00:00.000Z',
    returnDemo2Date: null,
    returnDemo3Date: null,
    practiced: true,
  },
  {
    id: 'proc-s1-07',
    userId: 'default',
    semester: 1,
    moduleCode: 'Module 03: Health assessment',
    procedureName: '03.3 Lifting, Moving & Transportation',
    subProcedures: [
      { id: 'sub-03-3-1', title: 'Moving patient up in bed' },
      { id: 'sub-03-3-2', title: 'Turning patient' },
      { id: 'sub-03-3-3', title: 'Assisting to sit up' },
      { id: 'sub-03-3-4', title: 'Transfer to chair' },
      { id: 'sub-03-3-5', title: 'Transfer to stretcher' },
      { id: 'sub-03-3-6', title: 'Moving to wheelchair' },
      { id: 'sub-03-3-7', title: 'Log rolling' },
    ],
    demonstratedByLecturer: true,
    returnDemo1Date: null,
    returnDemo2Date: null,
    returnDemo3Date: null,
    practiced: false,
  },
  {
    id: 'proc-s1-08',
    userId: 'default',
    semester: 1,
    moduleCode: 'Module 03: Health assessment',
    procedureName: '03.4 Vital Signs Monitoring',
    subProcedures: [
      { id: 'sub-03-4-1', title: 'Temperature measurement (Oral/Axillary/Tympanic)' },
      { id: 'sub-03-4-2', title: 'Pulse palpation and counting' },
      { id: 'sub-03-4-3', title: 'Respiration rate assessment' },
      { id: 'sub-03-4-4', title: 'Blood Pressure (Sphygmomanometer)' },
      { id: 'sub-03-4-5', title: 'Oxygen saturation (Pulse Oximetry)' },
      { id: 'sub-03-4-6', title: 'Observation chart recording' },
    ],
    demonstratedByLecturer: true,
    returnDemo1Date: '2025-02-15T08:30:00.000Z',
    returnDemo2Date: '2025-02-22T09:00:00.000Z',
    returnDemo3Date: '2025-03-01T10:15:00.000Z',
    practiced: true,
  },
  {
    id: 'proc-s1-09',
    userId: 'default',
    semester: 1,
    moduleCode: 'Module 03: Health assessment',
    procedureName: '03.5 Specimen Collection',
    subProcedures: [
      { id: 'sub-03-5-1', title: 'Urine specimen collection' },
      { id: 'sub-03-5-2', title: 'Feces specimen collection' },
      { id: 'sub-03-5-3', title: 'Sputum collection' },
      { id: 'sub-03-5-4', title: 'Vomitus assessment & collection' },
    ],
    demonstratedByLecturer: false,
    returnDemo1Date: null,
    returnDemo2Date: null,
    returnDemo3Date: null,
    practiced: false,
  },
  {
    id: 'proc-s1-10',
    userId: 'default',
    semester: 1,
    moduleCode: 'Module 03: Health assessment',
    procedureName: '03.6 Hygienic Needs Support',
    subProcedures: [
      { id: 'sub-03-6-1', title: '03.6.1 Oral hygiene (assisted, performing, special mouth care)' },
      { id: 'sub-03-6-2', title: '03.6.2 Skin/nail care (bed bath, back care, pressure points, evening care, perineal care, foot/toe/nail care, diapers, bedpans, shower bath, dressing/undressing, hair combing)' },
      { id: 'sub-03-6-3', title: '03.6.3 Scalp/hair care (head wash in bed, pediculosis treatment)' },
    ],
    demonstratedByLecturer: true,
    returnDemo1Date: '2025-03-08T13:00:00.000Z',
    returnDemo2Date: null,
    returnDemo3Date: null,
    practiced: true,
  },
  {
    id: 'proc-s1-11',
    userId: 'default',
    semester: 1,
    moduleCode: 'Module 03: Health assessment',
    procedureName: '03.7 Nutritional Needs Preparation & Serving',
    subProcedures: [
      { id: 'sub-03-7-1', title: 'Albumin water preparation' },
      { id: 'sub-03-7-2', title: 'Orange juice preparation' },
      { id: 'sub-03-7-3', title: 'Special Tea preparation' },
      { id: 'sub-03-7-4', title: 'Food serving and assisted feeding' },
    ],
    demonstratedByLecturer: false,
    returnDemo1Date: null,
    returnDemo2Date: null,
    returnDemo3Date: null,
    practiced: false,
  },
  {
    id: 'proc-s1-12',
    userId: 'default',
    semester: 1,
    moduleCode: 'Module 03: Health assessment',
    procedureName: '03.8 Emotional and Spiritual Needs Support',
    subProcedures: [
      { id: 'sub-03-8-1', title: 'Facilitating recreational activities' },
      { id: 'sub-03-8-2', title: 'Supporting religious & cultural practices' },
    ],
    demonstratedByLecturer: false,
    returnDemo1Date: null,
    returnDemo2Date: null,
    returnDemo3Date: null,
    practiced: false,
  },

  // --- SEMESTER 2 ---
  {
    id: 'proc-s2-13',
    userId: 'default',
    semester: 2,
    moduleCode: 'Module 04: Therapeutic intervention',
    procedureName: '04.1 Therapeutic Application of Heat and Cold',
    subProcedures: [
      { id: 'sub-04-1-1', title: 'Hot water bottle application' },
      { id: 'sub-04-1-2', title: 'Medical fomentation' },
      { id: 'sub-04-1-3', title: 'Cold compress application' },
      { id: 'sub-04-1-4', title: 'Tepid sponge bath' },
      { id: 'sub-04-1-5', title: 'SITZ bath procedure' },
    ],
    demonstratedByLecturer: false,
    returnDemo1Date: null,
    returnDemo2Date: null,
    returnDemo3Date: null,
    practiced: false,
  },
  {
    id: 'proc-s2-14',
    userId: 'default',
    semester: 2,
    moduleCode: 'Module 04: Therapeutic intervention',
    procedureName: '04.2 Safe Administration of Medications',
    subProcedures: [
      { id: 'sub-04-2-1', title: 'Oral medication administration' },
      { id: 'sub-04-2-2', title: 'Eye, ear and nasal drops' },
      { id: 'sub-04-2-3', title: 'Topical application' },
      { id: 'sub-04-2-4', title: 'Nebulization administration' },
      { id: 'sub-04-2-5', title: 'Steam inhalation' },
      { id: 'sub-04-2-6', title: 'Suppositories insertion' },
      { id: 'sub-04-2-7', title: 'Evacuant Enema administration' },
      { id: 'sub-04-2-8', title: 'Colonic irrigation' },
      { id: 'sub-04-2-9', title: 'Oxygen therapy administration' },
    ],
    demonstratedByLecturer: false,
    returnDemo1Date: null,
    returnDemo2Date: null,
    returnDemo3Date: null,
    practiced: false,
  },
  {
    id: 'proc-s2-15',
    userId: 'default',
    semester: 2,
    moduleCode: 'Module 05: Assisting nutritional needs of client',
    procedureName: '05.1 NG Tube Insertion, Feeding & Removal',
    demonstratedByLecturer: false,
    returnDemo1Date: null,
    returnDemo2Date: null,
    returnDemo3Date: null,
    practiced: false,
  },
  {
    id: 'proc-s2-16',
    userId: 'default',
    semester: 2,
    moduleCode: 'Module 05: Assisting nutritional needs of client',
    procedureName: '05.2 Fluid Balance Chart Maintenance',
    demonstratedByLecturer: false,
    returnDemo1Date: null,
    returnDemo2Date: null,
    returnDemo3Date: null,
    practiced: false,
  },
  {
    id: 'proc-s2-17',
    userId: 'default',
    semester: 2,
    moduleCode: 'Module 06: Medical asepsis techniques',
    procedureName: '06.1 CSSD (Central Sterile Services) Orientation',
    demonstratedByLecturer: false,
    returnDemo1Date: null,
    returnDemo2Date: null,
    returnDemo3Date: null,
    practiced: false,
  },
  {
    id: 'proc-s2-18',
    userId: 'default',
    semester: 2,
    moduleCode: 'Module 06: Medical asepsis techniques',
    procedureName: '06.2 Skin Prep and Shaving for Surgery',
    demonstratedByLecturer: false,
    returnDemo1Date: null,
    returnDemo2Date: null,
    returnDemo3Date: null,
    practiced: false,
  },
  {
    id: 'proc-s2-19',
    userId: 'default',
    semester: 2,
    moduleCode: 'Module 07: Accident and emergencies',
    procedureName: '07.1 Medical Bandaging Techniques',
    subProcedures: [
      { id: 'sub-07-1-1', title: 'Simple spiral bandage' },
      { id: 'sub-07-1-2', title: 'Reverse spiral bandage' },
      { id: 'sub-07-1-3', title: 'Figure-of-eight bandage' },
      { id: 'sub-07-1-4', title: 'Cephalic (head) bandage' },
      { id: 'sub-07-1-5', title: 'Ear bandage' },
      { id: 'sub-07-1-6', title: 'Eye bandage' },
      { id: 'sub-07-1-7', title: 'Barrel bandage' },
      { id: 'sub-07-1-8', title: 'Spica bandage' },
    ],
    demonstratedByLecturer: false,
    returnDemo1Date: null,
    returnDemo2Date: null,
    returnDemo3Date: null,
    practiced: false,
  },
  {
    id: 'proc-s2-20',
    userId: 'default',
    semester: 2,
    moduleCode: 'Module 07: Accident and emergencies',
    procedureName: '07.2 Medical Slings Application',
    subProcedures: [
      { id: 'sub-07-2-1', title: 'Arm sling' },
      { id: 'sub-07-2-2', title: 'Elevated (collar and cuff) sling' },
    ],
    demonstratedByLecturer: false,
    returnDemo1Date: null,
    returnDemo2Date: null,
    returnDemo3Date: null,
    practiced: false,
  },
  {
    id: 'proc-s2-21',
    userId: 'default',
    semester: 2,
    moduleCode: 'Module 07: Accident and emergencies',
    procedureName: '07.3 Basic Life Support (BLS) Techniques',
    demonstratedByLecturer: false,
    returnDemo1Date: null,
    returnDemo2Date: null,
    returnDemo3Date: null,
    practiced: false,
  },
  {
    id: 'proc-s2-22',
    userId: 'default',
    semester: 2,
    moduleCode: 'Module 08: Care of the dead body',
    procedureName: '08.1 Dead body preparation (Last Offices)',
    demonstratedByLecturer: false,
    returnDemo1Date: null,
    returnDemo2Date: null,
    returnDemo3Date: null,
    practiced: false,
  },
  {
    id: 'proc-s2-23',
    userId: 'default',
    semester: 2,
    moduleCode: 'Module 08: Care of the dead body',
    procedureName: '08.2 Mortuary Documentation & Tagging',
    demonstratedByLecturer: false,
    returnDemo1Date: null,
    returnDemo2Date: null,
    returnDemo3Date: null,
    practiced: false,
  },
  {
    id: 'proc-s2-24',
    userId: 'default',
    semester: 2,
    moduleCode: 'Module 08: Care of the dead body',
    procedureName: '08.3 Handing over dead body to family / undertaker',
    demonstratedByLecturer: false,
    returnDemo1Date: null,
    returnDemo2Date: null,
    returnDemo3Date: null,
    practiced: false,
  },
];
