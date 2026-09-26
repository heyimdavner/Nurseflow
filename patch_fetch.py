import re

with open('src/context/NurseFlowContext.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "} catch(e) { console.error('Cloud fetch error', e); }\n      setIsCloudLoaded(true);",
    "} catch(e) { console.error('Cloud fetch error', e); return; }\n      setIsCloudLoaded(true);"
)

with open('src/context/NurseFlowContext.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
