import { useSettings } from '../lib/SettingsContext'
import { Settings, RotateCcw } from 'lucide-react'

export default function SettingsPage() {
  const { settings, updateSetting, resetSettings } = useSettings()

  const confirmReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      resetSettings()
    }
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <Settings size={28} />
        <h1>Settings</h1>
      </div>

      <div className="settings-container">
        {/* Theme Settings */}
        <section className="settings-section">
          <h2>Appearance</h2>
          
          <div className="settings-group">
            <div className="setting-item">
              <label>Theme</label>
              <div className="setting-description">
                Choose how the app looks
              </div>
              <div className="setting-options">
                {(['light', 'dark', 'auto'] as const).map(option => (
                  <label key={option} className="option-label">
                    <input
                      type="radio"
                      name="theme"
                      value={option}
                      checked={settings.theme === option}
                      onChange={(e) => updateSetting('theme', e.target.value as typeof option)}
                    />
                    <span className="option-text">
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                      {option === 'auto' && ' (Follow system)'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="settings-group">
            <div className="setting-item">
              <label>Font Size</label>
              <div className="setting-description">
                Adjust text size for better readability
              </div>
              <div className="setting-options">
                {(['small', 'medium', 'large'] as const).map(size => (
                  <label key={size} className="option-label">
                    <input
                      type="radio"
                      name="fontSize"
                      value={size}
                      checked={settings.fontSize === size}
                      onChange={(e) => updateSetting('fontSize', e.target.value as typeof size)}
                    />
                    <span className="option-text">
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="settings-group">
            <label className="setting-toggle-item">
              <input
                type="checkbox"
                checked={settings.compactMode}
                onChange={(e) => updateSetting('compactMode', e.target.checked)}
              />
              <span className="toggle-label">
                <span className="toggle-title">Compact Mode</span>
                <span className="toggle-description">Reduce spacing and padding</span>
              </span>
            </label>
          </div>
        </section>

        {/* Editor Settings */}
        <section className="settings-section">
          <h2>Editor</h2>

          <div className="settings-group">
            <label className="setting-toggle-item">
              <input
                type="checkbox"
                checked={settings.showPreview}
                onChange={(e) => updateSetting('showPreview', e.target.checked)}
              />
              <span className="toggle-label">
                <span className="toggle-title">Show Preview</span>
                <span className="toggle-description">Display live preview while editing</span>
              </span>
            </label>
          </div>

          <div className="settings-group">
            <label className="setting-toggle-item">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => updateSetting('autoSave', e.target.checked)}
              />
              <span className="toggle-label">
                <span className="toggle-title">Auto-Save</span>
                <span className="toggle-description">Automatically save your work</span>
              </span>
            </label>
          </div>

          {settings.autoSave && (
            <div className="settings-group">
              <label>Auto-Save Interval</label>
              <div className="setting-description">
                How often to save (in seconds)
              </div>
              <div className="setting-input">
                <input
                  type="number"
                  min="5"
                  max="300"
                  step="5"
                  value={settings.autoSaveInterval}
                  onChange={(e) => updateSetting('autoSaveInterval', parseInt(e.target.value))}
                />
                <span className="input-suffix">seconds</span>
              </div>
            </div>
          )}
        </section>

        {/* Notifications Settings */}
        <section className="settings-section">
          <h2>Notifications</h2>

          <div className="settings-group">
            <label className="setting-toggle-item">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => updateSetting('notifications', e.target.checked)}
              />
              <span className="toggle-label">
                <span className="toggle-title">Enable Notifications</span>
                <span className="toggle-description">Receive alerts and updates</span>
              </span>
            </label>
          </div>
        </section>

        {/* Actions */}
        <section className="settings-section">
          <h2>Actions</h2>
          <button 
            className="reset-settings-btn"
            onClick={confirmReset}
          >
            <RotateCcw size={16} />
            Reset to Defaults
          </button>
        </section>
      </div>
    </div>
  )
}
