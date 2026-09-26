import re

with open('src/components/Settings/SettingsTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "setTimeout(() => window.location.reload(), 2000);",
    "// setTimeout(() => window.location.reload(), 2000); // Removed to prevent interrupting Firebase uploads"
)

with open('src/components/Settings/SettingsTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
