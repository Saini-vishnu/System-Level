import React from 'react'
import StatCard from '../StatCard'
import RankShowcase from '../RankShowcase'

function StatusTab({ state }) {
  const stats = [
    { id: 'str', name: 'STRENGTH', icon: '💪' },
    { id: 'agi', name: 'AGILITY', icon: '⚡' },
    { id: 'sta', name: 'STAMINA', icon: '🔥' },
    { id: 'sen', name: 'PERCEPTION', icon: '👁️' }
  ]

  return (
    <div className="tab-content active" id="status-tab">
      <div className="status-dashboard">
        <RankShowcase rank={state.rank} streak={state.streak} />

        <div className="stats-container">
          {stats.map(stat => (
            <StatCard
              key={stat.id}
              stat={stat}
              current={state.stats[stat.id].current}
              limit={state.stats[stat.id].limit}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default StatusTab
