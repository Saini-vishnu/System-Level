import React, { useState, useEffect } from 'react'

function TargetModal({ target, onSave, onClose }) {
  const [formData, setFormData] = useState(target)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('running') || name.includes('distance') ? parseFloat(value) || 0 : parseInt(value) || 0
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="modal active" id="targetModal">
      <div className="modal-content">
        <div className="modal-header">EDIT DAILY TARGET</div>
        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div className="exercise-grid" style={{ marginBottom: '2rem' }}>
            <div>
              <label className="form-label">Push Ups</label>
              <input type="number" className="form-input" name="pushups" min="0" value={formData.pushups} onChange={handleChange} />
            </div>
            <div>
              <label className="form-label">Squats</label>
              <input type="number" className="form-input" name="squats" min="0" value={formData.squats} onChange={handleChange} />
            </div>
            <div>
              <label className="form-label">Sit Ups</label>
              <input type="number" className="form-input" name="situps" min="0" value={formData.situps} onChange={handleChange} />
            </div>
            <div>
              <label className="form-label">Running (KM)</label>
              <input type="number" className="form-input" name="running" min="0" step="0.1" value={formData.running} onChange={handleChange} />
            </div>
            <div>
              <label className="form-label">100m Dash</label>
              <input type="number" className="form-input" name="dash" min="0" value={formData.dash} onChange={handleChange} />
            </div>
            <div>
              <label className="form-label">Burpees</label>
              <input type="number" className="form-input" name="burpees" min="0" value={formData.burpees} onChange={handleChange} />
            </div>
            <div>
              <label className="form-label">Distance (KM)</label>
              <input type="number" className="form-input" name="distance" min="0" step="0.1" value={formData.distance} onChange={handleChange} />
            </div>
            <div>
              <label className="form-label">Breath Box</label>
              <input type="number" className="form-input" name="breathbox" min="0" value={formData.breathbox} onChange={handleChange} />
            </div>
            <div>
              <label className="form-label">Shadowbox</label>
              <input type="number" className="form-input" name="shadowbox" min="0" value={formData.shadowbox} onChange={handleChange} />
            </div>
            <div>
              <label className="form-label">Yoga</label>
              <input type="number" className="form-input" name="yoga" min="0" value={formData.yoga} onChange={handleChange} />
            </div>
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn">SAVE TARGET</button>
            <button type="button" className="btn btn-danger" onClick={onClose}>CANCEL</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TargetModal
