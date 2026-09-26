import re

with open('src/components/Settings/SettingsTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

if 'import { useAuth }' not in content:
    content = content.replace("import { useNurseFlow } from '../../context/NurseFlowContext';", "import { useNurseFlow } from '../../context/NurseFlowContext';\nimport { useAuth } from '../../context/AuthContext';")

if 'const { signOut } = useAuth();' not in content:
    content = content.replace("export const SettingsTab: React.FC = () => {", "export const SettingsTab: React.FC = () => {\n  const { signOut } = useAuth();")

logout_button = """
            <button
              onClick={async () => {
                await signOut();
              }}
              className="w-full flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold border border-zinc-700 transition-colors mt-3"
            >
              <span>Sign Out of NurseFlow Cloud</span>
            </button>
"""
if 'Sign Out of NurseFlow Cloud' not in content:
    content = content.replace("<span>Reset Database to Clean Slate</span>\n            </button>", "<span>Reset Database to Clean Slate</span>\n            </button>" + logout_button)

with open('src/components/Settings/SettingsTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Injected Logout button")
