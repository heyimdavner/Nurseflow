import re

with open('src/context/NurseFlowContext.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

if 'import { db }' not in content:
    content = content.replace(
        "import React, { createContext, useContext, useEffect, useState, useMemo, ReactNode } from 'react';",
        "import React, { createContext, useContext, useEffect, useState, useMemo, ReactNode } from 'react';\nimport { db } from '../lib/firebase';\nimport { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';\nimport { useAuth } from './AuthContext';"
    )

with open('src/context/NurseFlowContext.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
