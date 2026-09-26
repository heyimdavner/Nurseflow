import re

with open('src/context/NurseFlowContext.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add console logs to fetch
content = content.replace(
    "const d = await getDoc(doc(db, 'users', authUser.uid, 'data', col));",
    "const d = await getDoc(doc(db, 'users', authUser.uid, 'data', col));\n          console.log('Fetched', col, d.exists());"
)

# Add console logs to setDoc
content = content.replace(
    "if (authUser && isCloudLoaded) setDoc(doc(db, 'users', authUser.uid, 'data', 'duties'), { data: duties });",
    "if (authUser && isCloudLoaded) { console.log('Saving duties to cloud', duties.length); setDoc(doc(db, 'users', authUser.uid, 'data', 'duties'), { data: duties }); }"
)

with open('src/context/NurseFlowContext.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
