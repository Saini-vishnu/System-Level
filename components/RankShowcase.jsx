import React from 'react'

function RankShowcase({ rank, streak }) {
  return (
    <div className="rank-showcase">
      <div className="rank-label">CURRENT RANK</div>
      <div className="rank-value">{rank}</div>
      <div className="streak-info">
        ACTIVE STREAK: <span className="streak-number">{streak}</span> DAYS
      </div>
    </div>
  )
}

export default RankShowcase
