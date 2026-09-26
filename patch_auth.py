import re

with open('src/context/AuthContext.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

if 'localStorage.clear();' not in content:
    content = content.replace(
        "const signOut = async () => {",
        "const signOut = async () => {\n    localStorage.clear();"
    )
    with open('src/context/AuthContext.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched AuthContext")
else:
    print("Already patched")
