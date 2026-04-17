import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface UserSettings {
  theme: 'light' | 'dark' | 'auto'
  compactMode: boolean
  sidebarCollapsed: boolean
  autoSave: boolean
  autoSaveInterval: number
  fontSize: 'small' | 'medium' | 'large'
  notifications: boolean
  showPreview: boolean
}

interface SettingsContextType {
  settings: UserSettings
  updateSetting: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void
  resetSettings: () => void
}

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'auto',
  compactMode: false,
  sidebarCollapsed: false,
  autoSave: true,
  autoSaveInterval: 30,
  fontSize: 'medium',
  notifications: true,
  showPreview: true,
}

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SETTINGS,
  updateSetting: () => {},
  resetSettings: () => {},
})

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(() => {
    const stored = localStorage.getItem('user-settings')
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS
  })

  useEffect(() => {
    localStorage.setItem('user-settings', JSON.stringify(settings))
    
    // Apply theme setting
    const root = document.documentElement
    if (settings.theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
    } else {
      root.setAttribute('data-theme', settings.theme)
    }

    // Apply compact mode
    root.setAttribute('data-compact', settings.compactMode ? 'true' : 'false')
    
    // Apply font size
    root.setAttribute('data-font-size', settings.fontSize)
  }, [settings])

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
