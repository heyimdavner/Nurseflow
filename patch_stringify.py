import re

with open('src/context/NurseFlowContext.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Patch setDoc to stringify
content = re.sub(
    r"setDoc\(doc\(db, 'users', authUser\.uid, 'data', '([^']+)'\), \{ data: ([^ ]+) \}\)",
    r"setDoc(doc(db, 'users', authUser.uid, 'data', '\1'), { data: JSON.stringify(\2) })",
    content
)

# Patch getDoc to parse
content = content.replace(
    "const data = d.data().data;",
    "const raw = d.data().data; const data = typeof raw === 'string' ? JSON.parse(raw) : raw;"
)

with open('src/context/NurseFlowContext.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
