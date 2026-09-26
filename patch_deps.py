import re

with open('src/context/NurseFlowContext.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the alerts
content = content.replace(".catch(e => alert('Failed to save duties: ' + e.message))", "")
content = content.replace(".catch(e => alert('Failed to save modules: ' + e.message))", "")
content = content.replace("alert('Cloud fetch error: ' + e.message); ", "")

# Fix dependencies
content = content.replace("}, [user]);", "}, [user, authUser, isCloudLoaded]);")
content = content.replace("}, [duties]);", "}, [duties, authUser, isCloudLoaded]);")
content = content.replace("}, [modules]);", "}, [modules, authUser, isCloudLoaded]);")
content = content.replace("}, [procedures]);", "}, [procedures, authUser, isCloudLoaded]);")
content = content.replace("}, [assignments]);", "}, [assignments, authUser, isCloudLoaded]);")
content = content.replace("}, [customShifts]);", "}, [customShifts, authUser, isCloudLoaded]);")
content = content.replace("}, [exams]);", "}, [exams, authUser, isCloudLoaded]);")
content = content.replace("}, [lastSelectedWard]);", "}, [lastSelectedWard, authUser, isCloudLoaded]);")

with open('src/context/NurseFlowContext.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
