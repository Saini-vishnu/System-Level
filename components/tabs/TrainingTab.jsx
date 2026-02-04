import React, { useState } from 'react'
import DailyLogForm from '../DailyLogForm'
import DailyTaskCard from '../DailyTaskCard'
import DailyTargetProgress from '../DailyTargetProgress'

function TrainingTab({ state, onLogSubmit, onEditTarget, onMarkTaskComplete }) {
  const [currentData, setCurrentData] = useState({
    pushups: 0,
    squats: 0,
    situps: 0,
    running: 0,
    dash: 0,
    burpees: 0,
    distance: 0,
    breathbox: 0,
    shadowbox: 0,
    yoga: 0
  })

  const handleInputChange = (field, value) => {
    setCurrentData(prev => ({
      ...prev,
      [field]: field.includes('running') || field.includes('distance') ? parseFloat(value) || 0 : parseInt(value) || 0
    }))
  }

  return (
    <div className="tab-content active" id="training-tab">
      <DailyTaskCard task={state.pendingTask} onMarkComplete={onMarkTaskComplete} />

      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.2rem', color: 'var(--violet)' }}>DAILY TARGET</h2>
        <button className="btn" onClick={onEditTarget}>EDIT TARGET</button>
      </div>

      <DailyTargetProgress currentData={currentData} dailyTarget={state.dailyTarget} />

      <DailyLogForm
        state={state}
        currentData={currentData}
        onInputChange={handleInputChange}
        onSubmit={onLogSubmit}
      />
    </div>
  )
}

export default TrainingTab
