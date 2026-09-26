import re

with open('src/context/NurseFlowContext.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

def patch_effect(var_name, storage_key):
    global content
    pattern = rf"useEffect\(\(\) => {{\s*localStorage\.setItem\({storage_key}, JSON\.stringify\({var_name}\)\);\s*}}(?:,[^)]+\))?;"
    replacement = f"useEffect(() => {{\n    localStorage.setItem({storage_key}, JSON.stringify({var_name}));\n    if (authUser && isCloudLoaded) setDoc(doc(db, 'users', authUser.uid, 'data', '{var_name}'), {{ data: JSON.stringify({var_name}) }});\n  }}, [{var_name}, authUser, isCloudLoaded]);"
    content = re.sub(pattern, replacement, content)

patch_effect("user", "STORAGE_KEYS.USER")
patch_effect("duties", "STORAGE_KEYS.DUTIES")
patch_effect("modules", "STORAGE_KEYS.MODULES")
patch_effect("procedures", "STORAGE_KEYS.PROCEDURES")
patch_effect("assignments", "STORAGE_KEYS.ASSIGNMENTS")
patch_effect("customShifts", "STORAGE_KEYS.CUSTOM_SHIFTS")
patch_effect("exams", "STORAGE_KEYS.EXAMS")

content = content.replace("'data', 'user')", "'data', 'profile')")

with open('src/context/NurseFlowContext.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
