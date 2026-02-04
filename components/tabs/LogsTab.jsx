import React from 'react'

function LogsTab({ state }) {
  return (
    <div className="tab-content active" id="logs-tab">
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.2rem', color: 'var(--violet)', marginBottom: '1.5rem' }}>TRAINING HISTORY</h2>
        <div className="log-container">
          {state.logs.length === 0 ? (
            <div className="loading">NO LOGS FOUND</div>
          ) : (
            state.logs.slice(-10).reverse().map((log, idx) => (
              <div key={idx} className={log.type === 'skip' ? 'log-entry violation' : 'log-entry'}>
                <div className="log-date">{log.date}</div>
                <div className="log-details">
                  {log.type === 'skip' ? (
                    <>
                      VALID SKIP: {log.reason}<br />
                      READING: {log.book}
                    </>
                  ) : (
                    <>
                      STR +{log.gains.str} / AGI +{log.gains.agi} / STA +{log.gains.sta} / SEN +{log.gains.sen}<br />
                      READING: {log.book}
                      {log.notes && <><br />NOTES: {log.notes}</>}
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {state.violations.length > 0 && (
        <div>
          <h2 style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.2rem', color: 'var(--red)', marginBottom: '1.5rem' }}>VIOLATIONS</h2>
          <div className="log-container">
            {state.violations.slice(-5).reverse().map((violation, idx) => (
              <div key={idx} className="log-entry violation">
                <div className="log-date">{violation.date}</div>
                <div className="log-details" style={{ color: 'var(--red)' }}>
                  {violation.type}<br />
                  PENALTY: {violation.penalty}<br />
                  {violation.details}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default LogsTab
