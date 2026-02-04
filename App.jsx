import React, { useState, useEffect } from 'react'
import SystemBackend from './services/SystemBackend'
import APIService from './services/APIService'
import HybridSystemBackend from './services/HybridSystemBackend'
import LoginRegister from './components/LoginRegister'
import Header from './components/Header'
import Navigation from './components/Navigation'
import StatusTab from './components/tabs/StatusTab'
import TrainingTab from './components/tabs/TrainingTab'
import LogsTab from './components/tabs/LogsTab'
import SettingsTab from './components/tabs/SettingsTab'
import TaskModal from './components/modals/TaskModal'
import TargetModal from './components/modals/TargetModal'
import SystemAlert from './components/SystemAlert'
import SystemMessage from './components/SystemMessage'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [apiService] = useState(() => new APIService(import.meta.env.VITE_API_URL || 'http://localhost:5000/api'))
  const [hybridBackend] = useState(() => new HybridSystemBackend(apiService))
  const [backend] = useState(() => new SystemBackend())
  const [state, setState] = useState(null)
  const [currentTab, setCurrentTab] = useState('status')
  const [message, setMessage] = useState(null)
  const [taskModal, setTaskModal] = useState(false)
  const [targetModal, setTargetModal] = useState(false)
  const [currentTask, setCurrentTask] = useState(null)
  const [isAudit, setIsAudit] = useState(false)
  const [syncStatus, setSyncStatus] = useState(null)

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  // Initialize backend
  useEffect(() => {
    if (isAuthenticated || !apiService.isAuthenticated()) {
      const status = backend.getSystemStatus()
      setState(status.state)

      if (status.isPaused) {
        const endDate = new Date(status.state.pauseEndDate).toLocaleDateString()
        setMessage({
          text: `SYSTEM PAUSED\nDISCIPLINE RESTORATION REQUIRED\nRESUMES: ${endDate}`,
          type: 'error'
        })
      }

      if (status.missedDays) {
        setMessage({
          text: `PENALTY APPLIED\nMISSED DAYS: ${status.missedDays}\nALL STATS -${status.missedDays * 10} HP\nSTREAK RESET`,
          type: 'error'
        })
      }

      if (status.auditRequired) {
        setTaskModal(true)
        setIsAudit(true)
        setCurrentTask({
          description: 'WEEKLY AUDIT REQUIRED\nREVIEW STATS\nREVIEW PENALTIES\nPLAN NEXT WEEK'
        })
      } else if (status.automatedTask && !status.automatedTask.completed) {
        setTaskModal(true)
        setCurrentTask(status.automatedTask)
      }

      // Show sync status
      const status_info = hybridBackend.getStatus()
      setSyncStatus(status_info)
    }
  }, [backend, hybridBackend, apiService, isAuthenticated])

  const handleSwitchTab = (tab) => {
    setCurrentTab(tab)
  }

  const handleLogSubmit = (logData) => {
    const result = backend.processLog(logData)

    if (result.success) {
      setMessage({
        text: result.message,
        type: 'success'
      })
      setState({ ...backend.state })
      setCurrentTab('status')
    } else {
      setMessage({
        text: result.message,
        type: 'error'
      })
      setState({ ...backend.state })
    }
  }

  const handleTargetUpdate = (newTarget) => {
    backend.updateDailyTarget(newTarget)
    setState({ ...backend.state })
    setTargetModal(false)
    setMessage({
      text: 'DAILY TARGET UPDATED',
      type: 'success'
    })
  }

  const handleAcknowledgeTask = () => {
    if (isAudit) {
      backend.completeWeeklyAudit()
      setMessage({
        text: 'WEEKLY AUDIT COMPLETE\nRANK UNLOCKED',
        type: 'success'
      })
      setIsAudit(false)
    } else {
      backend.completeAutomatedTask()
      setMessage({
        text: 'TASK ACKNOWLEDGED\nCOMPLETE BEFORE DAY END',
        type: 'success'
      })
    }
    setState({ ...backend.state })
    setTaskModal(false)
    setCurrentTask(null)
  }

  const handleResetSystem = () => {
    if (window.confirm('⚠️ WARNING: This will delete ALL your data. Are you sure?')) {
      if (window.confirm('This action CANNOT be undone. Continue?')) {
        localStorage.removeItem('soloLevelingSystemV3')
        window.location.reload()
      }
    }
  }

  const handleLoginSuccess = (loginData) => {
    setIsAuthenticated(true)
    setMessage({
      text: 'LOGIN SUCCESSFUL\nSYSTEM INITIALIZING...',
      type: 'success'
    })
  }

  const handleLogout = () => {
    if (window.confirm('LOGOUT AND RETURN TO LOGIN?')) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('userId')
      localStorage.removeItem('username')
      apiService.logout()
      setIsAuthenticated(false)
      setMessage({
        text: 'LOGGED OUT\nGOODBYE',
        type: 'success'
      })
    }
  }

  if (!isAuthenticated) {
    return <LoginRegister onLoginSuccess={handleLoginSuccess} />
  }

  if (!state) return <div className="loading">SYSTEM INITIALIZING...</div>

  const username = localStorage.getItem('username') || 'USER'

  return (
    <div className="container">
      <Header username={username} onLogout={handleLogout} />
      
      {syncStatus && (
        <div className="sync-status">
          <span>{syncStatus.message}</span>
          {syncStatus.pendingSyncCount > 0 && (
            <span className="pending-badge">{syncStatus.pendingSyncCount} PENDING</span>
          )}
        </div>
      )}
      
      {state.systemPaused && (
        <SystemAlert pauseEndDate={state.pauseEndDate} />
      )}

      <Navigation currentTab={currentTab} onTabChange={handleSwitchTab} />

      {currentTab === 'status' && <StatusTab state={state} />}
      {currentTab === 'training' && (
        <TrainingTab
          state={state}
          onLogSubmit={handleLogSubmit}
          onEditTarget={() => setTargetModal(true)}
          onMarkTaskComplete={() => {
            backend.completeAutomatedTask()
            setState({ ...backend.state })
          }}
        />
      )}
      {currentTab === 'logs' && <LogsTab state={state} />}
      {currentTab === 'settings' && (
        <SettingsTab onResetSystem={handleResetSystem} />
      )}

      {message && (
        <SystemMessage message={message} onClose={() => setMessage(null)} />
      )}

      {taskModal && currentTask && (
        <TaskModal
          task={currentTask}
          isAudit={isAudit}
          onAcknowledge={handleAcknowledgeTask}
          onClose={() => {
            setTaskModal(false)
            setCurrentTask(null)
          }}
        />
      )}

      {targetModal && (
        <TargetModal
          target={state.dailyTarget}
          onSave={handleTargetUpdate}
          onClose={() => setTargetModal(false)}
        />
      )}
    </div>
  )
}

export default App
