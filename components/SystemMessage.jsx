import React, { useEffect } from 'react'

function SystemMessage({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`system-message ${message.type}`}>
      <div className="message-text">
        {message.text.split('\n').map((line, idx) => (
          <React.Fragment key={idx}>
            {line}
            {idx < message.text.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default SystemMessage
