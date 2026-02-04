import React from 'react'

function StatCard({ stat, current, limit }) {
  const percentage = (current / limit) * 100

  return (
    <div className="stat-card">
      <div className="stat-header">
        <div className="stat-name">{stat.name}</div>
        <div className="stat-icon">{stat.icon}</div>
      </div>
      <div className="stat-value-display"><span>{current}</span></div>
      <div className="stat-limit">MAX: <span>{limit}</span> HP</div>
      <div className="stat-bar">
        <div className="stat-bar-fill" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  )
}

export default StatCard
