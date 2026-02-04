import React from 'react'

function DailyTaskCard({ task, onMarkComplete }) {
  const today = new Date().toISOString().split('T')[0]
  
  if (!task || task.assignedDate !== today) {
    return null
  }

  const isCompleted = task.completed

  return (
    <div id="dailyTaskSection" style={{ display: 'block', marginBottom: '2rem' }}>
      <div className={`daily-task-card ${isCompleted ? 'completed' : ''}`}>
        <div className={`task-badge ${isCompleted ? 'completed' : 'pending'}`}>
          {isCompleted ? '✓ COMPLETED' : '⚠ PENDING'}
        </div>
        <div className="task-title">AUTOMATED DAILY TASK</div>
        <div className="task-description">{task.description}</div>
        {!isCompleted && (
          <button className="btn" onClick={onMarkComplete}>MARK COMPLETE</button>
        )}
      </div>
    </div>
  )
}

export default DailyTaskCard
