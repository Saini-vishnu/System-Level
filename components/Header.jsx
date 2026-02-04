import React from 'react'

function Header({ username, onLogout }) {
  return (
    <header className="system-header">
      <div className="header-left">
        <h1 className="system-logo">SYSTEM</h1>
        <p className="system-subtitle">Solo Leveling Protocol</p>
      </div>
      {username && (
        <div className="header-right">
          <span className="user-info">{username}</span>
          {onLogout && (
            <button className="logout-btn" onClick={onLogout}>
              LOGOUT
            </button>
          )}
        </div>
      )}
    </header>
  )
}

export default Header
