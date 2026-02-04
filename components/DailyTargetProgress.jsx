import React, { useMemo } from 'react'

function DailyTargetProgress({ currentData, dailyTarget }) {
  const exerciseLabels = {
    pushups: 'Push Ups',
    squats: 'Squats',
    situps: 'Sit Ups',
    running: 'Running',
    dash: '100m Dash',
    burpees: 'Burpees',
    distance: 'Distance',
    breathbox: 'Breath Box',
    shadowbox: 'Shadowbox',
    yoga: 'Yoga'
  }

  const progress = useMemo(() => {
    const result = {}
    for (let key in dailyTarget) {
      const target = dailyTarget[key]
      const current = currentData[key] || 0
      result[key] = {
        current: current,
        target: target,
        percentage: target > 0 ? Math.min(100, (current / target) * 100) : 0,
        completed: current >= target
      }
    }
    return result
  }, [currentData, dailyTarget])

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div className="target-grid">
        {Object.entries(progress).map(([key, item]) => (
          <div key={key} className={`target-card ${item.completed ? 'completed' : ''}`}>
            <div className="target-label">{exerciseLabels[key]}</div>
            <div className={`target-values ${item.completed ? 'completed' : ''}`}>
              {item.current} / {item.target}
            </div>
            <div className="target-bar">
              <div className="target-bar-fill" style={{ width: `${item.percentage}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DailyTargetProgress
