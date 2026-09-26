import re

with open('src/context/NurseFlowContext.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Imports
if 'import { db }' not in content:
    content = content.replace(
        "import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';",
        "import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';\nimport { db } from '../lib/firebase';\nimport { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';\nimport { useAuth } from './AuthContext';"
    )

# 2. Add authUser to Provider
if 'const { user: authUser } = useAuth();' not in content:
    content = content.replace(
        "export const NurseFlowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {",
        "export const NurseFlowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {\n  const { user: authUser } = useAuth();\n  const [isCloudLoaded, setIsCloudLoaded] = useState(false);\n\n  // Cloud Fetch\n  useEffect(() => {\n    if (!authUser) return;\n    const fetchCloudData = async () => {\n      try {\n        const collections = ['profile', 'duties', 'modules', 'procedures', 'assignments', 'customShifts', 'exams'];\n        for (const col of collections) {\n          const d = await getDoc(doc(db, 'users', authUser.uid, 'data', col));\n          if (d.exists()) {\n            const data = d.data().data;\n            if (col === 'profile' && data.lsn) setUser(data);\n            if (col === 'duties' && Array.isArray(data)) setDuties(data);\n            if (col === 'modules' && Array.isArray(data)) setModules(data);\n            if (col === 'procedures' && Array.isArray(data)) setProcedures(data);\n            if (col === 'assignments' && Array.isArray(data)) setAssignments(data);\n            if (col === 'customShifts' && Array.isArray(data)) setCustomShifts(data);\n            if (col === 'exams' && Array.isArray(data)) setExams(data);\n          }\n        }\n      } catch(e) { console.error('Cloud fetch error', e); }\n      setIsCloudLoaded(true);\n    };\n    fetchCloudData();\n  }, [authUser]);"
    )

# 3. Patch the sync useEffects
sync_patches = [
    ("localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));", "localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));\n    if (authUser && isCloudLoaded) setDoc(doc(db, 'users', authUser.uid, 'data', 'profile'), { data: user });"),
    ("localStorage.setItem(STORAGE_KEYS.DUTIES, JSON.stringify(duties));", "localStorage.setItem(STORAGE_KEYS.DUTIES, JSON.stringify(duties));\n    if (authUser && isCloudLoaded) setDoc(doc(db, 'users', authUser.uid, 'data', 'duties'), { data: duties });"),
    ("localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(modules));", "localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(modules));\n    if (authUser && isCloudLoaded) setDoc(doc(db, 'users', authUser.uid, 'data', 'modules'), { data: modules });"),
    ("localStorage.setItem(STORAGE_KEYS.PROCEDURES, JSON.stringify(procedures));", "localStorage.setItem(STORAGE_KEYS.PROCEDURES, JSON.stringify(procedures));\n    if (authUser && isCloudLoaded) setDoc(doc(db, 'users', authUser.uid, 'data', 'procedures'), { data: procedures });"),
    ("localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));", "localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));\n    if (authUser && isCloudLoaded) setDoc(doc(db, 'users', authUser.uid, 'data', 'assignments'), { data: assignments });"),
    ("localStorage.setItem(STORAGE_KEYS.CUSTOM_SHIFTS, JSON.stringify(customShifts));", "localStorage.setItem(STORAGE_KEYS.CUSTOM_SHIFTS, JSON.stringify(customShifts));\n    if (authUser && isCloudLoaded) setDoc(doc(db, 'users', authUser.uid, 'data', 'customShifts'), { data: customShifts });"),
    ("localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));", "localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));\n    if (authUser && isCloudLoaded) setDoc(doc(db, 'users', authUser.uid, 'data', 'exams'), { data: exams });")
]

for patch in sync_patches:
    # Only replace if not already patched
    if "setDoc(doc(db," not in content.split(patch[0])[0] + patch[0]: # rough check
        content = content.replace(patch[0], patch[1])

# 4. Patch resetAllData
if 'localStorage.clear();' in content and 'deleteDoc(doc(db,' not in content:
    reset_patch = """localStorage.clear();
    if (authUser) {
      const collections = ['profile', 'duties', 'modules', 'procedures', 'assignments', 'customShifts', 'exams'];
      collections.forEach(col => deleteDoc(doc(db, 'users', authUser.uid, 'data', col)));
    }"""
    content = content.replace("localStorage.clear();", reset_patch)

with open('src/context/NurseFlowContext.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched Context!")