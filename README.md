# NurseFlow - Complete Cloned Instance

**Export Timestamp:** 9/25/2026, 11:30:33 PM  
**Student Profile:** Nursing Candidate (LSN: 40292)

---

## Overview
This zip archive contains an exact, functional clone of the NurseFlow web application instance. It includes all React 19 source code, TypeScript typings, Tailwind CSS styling, Vite configuration, UI components (Calendar, Dashboard, Clinical Skills, Academic Hub, Study Tools, Settings), and your active instance database records (`instance-data.json`).

---

## Quick Setup Instructions

### 1. Requirements
Ensure you have Node.js (version 18 or higher) installed on your machine:
```bash
node -v
```

### 2. Install Project Dependencies
Open your command terminal inside this cloned project directory:
```bash
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```

By default, Vite will start the application at:
`http://localhost:3000`

Open that URL in Google Chrome, Microsoft Edge, Safari, or Firefox to access your local NurseFlow instance.

### 4. Build for Production
To build static production-ready assets:
```bash
npm run build
npm run preview
```

---

## Directory & File Manifest
- **`src/App.tsx`**: Root component with tab navigation and responsive layout
- **`src/context/NurseFlowContext.tsx`**: Global application state engine with local storage syncing
- **`src/components/Calendar/`**: Clinical duty scheduler, shifts manager, and roster file import
- **`src/components/Dashboard/`**: Real-time hours calculations, semester compliance, and attendance rates
- **`src/components/ClinicalSkills/`**: Procedural check-off catalog and competency logs
- **`src/components/AcademicHub/`**: Nursing syllabus, coursework tracker, exam timetable, and lectures
- **`src/components/StudyTab/`**: NCLEX study tools, pharmacology references, and clinical pearls
- **`src/components/Settings/`**: System configuration, ward categories, shift rules, and instance cloning
- **`src/data/seedData.ts`**: Default nursing curriculum, procedures catalog, and baseline shifts
- **`instance-data.json`**: Export of your active duties, syllabus records, customized shifts, and profile
- **`package.json` & `vite.config.ts`**: Node dependencies and Vite builder configuration

---

## Restoring Active Instance Data Locally
When running locally, your existing active state is pre-packaged in `instance-data.json`. 
To import your records into the local app:
1. Navigate to **Settings** in the local app.
2. Under **Data Management & Persistence**, click **Import JSON**.
3. Select the included `instance-data.json` file.
4. Your saved shifts, custom ward tags, and log entries will be restored instantly!
