import React from 'react'

function Navigation({ currentTab, onTabChange }) {
  const tabs = [
    { id: 'status', label: 'STATUS' },
    { id: 'training', label: 'TRAINING' },
    { id: 'logs', label: 'LOGS' },
    { id: 'settings', label: 'SETTINGS' }
  ]

  return (
    <nav className="nav-tabs">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`nav-tab ${currentTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}

export default Navigation
