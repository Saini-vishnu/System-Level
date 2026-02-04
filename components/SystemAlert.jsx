import React from 'react'

function SystemAlert({ pauseEndDate }) {
  const endDate = new Date(pauseEndDate).toLocaleDateString()
  
  return (
    <div className="system-alert">
      <div className="alert-text">
        SYSTEM PAUSED - DISCIPLINE RESTORATION REQUIRED<br />
        RESUMES: {endDate}
      </div>
    </div>
  )
}

export default SystemAlert
