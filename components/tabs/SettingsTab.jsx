import React from 'react'

function SettingsTab({ onResetSystem }) {
  return (
    <div className="tab-content active" id="settings-tab">
      <div className="form-section">
        <h2 className="form-title">SYSTEM SETTINGS</h2>
        <p style={{ color: 'var(--grey)', marginBottom: '2rem' }}>Configure your daily training targets and system preferences.</p>
        
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--grey)' }}>
          <p>Additional settings and customization options will be available here.</p>
          <button className="btn" onClick={onResetSystem} style={{ marginTop: '2rem' }}>RESET SYSTEM DATA</button>
        </div>
      </div>
    </div>
  )
}

export default SettingsTab
