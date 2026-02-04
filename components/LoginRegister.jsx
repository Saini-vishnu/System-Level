import React, { useState, useEffect } from 'react'
import './LoginRegister.css'

function LoginRegister({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [serverStatus, setServerStatus] = useState('checking')
  const [apiUrl, setApiUrl] = useState(import.meta.env.VITE_API_URL || 'http://localhost:5000/api')

  // Check server connection on load
  useEffect(() => {
    checkServerConnection()
    const interval = setInterval(checkServerConnection, 5000) // Check every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const checkServerConnection = async () => {
    try {
      const response = await fetch(`${apiUrl.replace('/api', '')}/api/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (response.ok) {
        setServerStatus('online')
        return
      }
    } catch (err) {
      // Server is offline
    }
    setServerStatus('offline')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (serverStatus === 'offline') {
      setError('SERVER OFFLINE\nCHECK BACKEND CONNECTION\nOR USE OFFLINE MODE')
      setLoading(false)
      return
    }

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register'
      const payload = isLogin
        ? { email, password }
        : { username, email, password }

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'AUTHENTICATION FAILED')
        setLoading(false)
        return
      }

      // Success
      if (data.token) {
        localStorage.setItem('authToken', data.token)
        localStorage.setItem('userId', data.userId)
        localStorage.setItem('username', data.username)
        onLoginSuccess(data)
      }
    } catch (err) {
      setError('SERVER CONNECTION FAILED\nENSURE BACKEND IS RUNNING')
      setLoading(false)
    }
  }

  const handleRetryConnection = () => {
    checkServerConnection()
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="server-status">
          <div className={`status-indicator ${serverStatus}`}></div>
          <span className={`status-text ${serverStatus}`}>
            {serverStatus === 'checking' && 'CHECKING SERVER...'}
            {serverStatus === 'online' && '🟢 SERVER ONLINE'}
            {serverStatus === 'offline' && '🔴 SERVER OFFLINE'}
          </span>
          {serverStatus === 'offline' && (
            <button 
              type="button"
              className="retry-button"
              onClick={handleRetryConnection}
            >
              RETRY
            </button>
          )}
        </div>

        <div className="auth-header">
          <h1>SOLO LEVELING PROTOCOL</h1>
          <p>SYSTEM INITIALIZATION</p>
          <p className="auth-mode">
            {isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label>USERNAME</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading || serverStatus === 'offline'}
                placeholder="Enter username"
              />
            </div>
          )}

          <div className="form-group">
            <label>EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading || serverStatus === 'offline'}
              placeholder="Enter email"
            />
          </div>

          <div className="form-group">
            <label>PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading || serverStatus === 'offline'}
              placeholder="Enter password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="auth-button"
            disabled={loading || serverStatus === 'offline'}
          >
            {loading ? 'PROCESSING...' : isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? 'NEW USER?' : 'EXISTING USER?'}
            {' '}
            <button
              type="button"
              className="toggle-button"
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
                setEmail('')
                setPassword('')
                setUsername('')
              }}
              disabled={loading}
            >
              {isLogin ? 'CREATE ACCOUNT' : 'SIGN IN'}
            </button>
          </p>
        </div>

        <div className="offline-mode">
          <p>NO SERVER? START IN OFFLINE MODE</p>
          <button
            type="button"
            className="offline-button"
            onClick={() => {
              localStorage.removeItem('authToken')
              onLoginSuccess(null)
            }}
          >
            OFFLINE MODE
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginRegister
