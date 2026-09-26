import re

with open('src/context/NurseFlowContext.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add a visual alert if setDoc fails
content = content.replace(
    "{ console.log('Saving duties to cloud', duties.length); setDoc(doc(db, 'users', authUser.uid, 'data', 'duties'), { data: duties }); }",
    "{ setDoc(doc(db, 'users', authUser.uid, 'data', 'duties'), { data: duties }).catch(e => alert('Failed to save duties: ' + e.message)); }"
)
content = content.replace(
    "if (authUser && isCloudLoaded) setDoc(doc(db, 'users', authUser.uid, 'data', 'modules'), { data: modules });",
    "if (authUser && isCloudLoaded) setDoc(doc(db, 'users', authUser.uid, 'data', 'modules'), { data: modules }).catch(e => alert('Failed to save modules: ' + e.message));"
)
content = content.replace(
    "catch(e) { console.error('Cloud fetch error', e); }",
    "catch(e) { alert('Cloud fetch error: ' + e.message); console.error('Cloud fetch error', e); }"
)

with open('src/context/NurseFlowContext.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
