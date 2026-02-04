import React from 'react'

function TaskModal({ task, isAudit, onAcknowledge, onClose }) {
  return (
    <div className="modal active" id="taskModal">
      <div className={`modal-content ${isAudit ? 'audit' : ''}`}>
        <div className={`modal-header ${isAudit ? 'audit' : ''}`}>
          {isAudit ? 'WEEKLY AUDIT REQUIRED' : 'AUTOMATED TASK ASSIGNED'}
        </div>
        <div className="modal-description">
          {task.description.split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              {idx < task.description.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
        <div className="modal-actions">
          <button className="btn" onClick={onAcknowledge}>ACKNOWLEDGE</button>
        </div>
      </div>
    </div>
  )
}

export default TaskModal
