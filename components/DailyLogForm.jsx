import React, { useState, useEffect } from 'react'

function DailyLogForm({ state, currentData, onInputChange, onSubmit }) {
  const [formData, setFormData] = useState({
    date: '',
    pushups: 0,
    squats: 0,
    situps: 0,
    running: 0,
    dash: 0,
    burpees: 0,
    distance: 0,
    breathbox: 0,
    shadowbox: 0,
    yoga: 0,
    bookName: '',
    bookPages: '',
    skipReason: '',
    notes: ''
  })

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setFormData(prev => ({ ...prev, date: today }))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    onInputChange(name, value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      pushups: parseInt(formData.pushups) || 0,
      squats: parseInt(formData.squats) || 0,
      situps: parseInt(formData.situps) || 0,
      running: parseFloat(formData.running) || 0,
      dash: parseInt(formData.dash) || 0,
      burpees: parseInt(formData.burpees) || 0,
      distance: parseFloat(formData.distance) || 0,
      breathbox: parseInt(formData.breathbox) || 0,
      shadowbox: parseInt(formData.shadowbox) || 0,
      yoga: parseInt(formData.yoga) || 0
    })
    setFormData({
      date: new Date().toISOString().split('T')[0],
      pushups: 0,
      squats: 0,
      situps: 0,
      running: 0,
      dash: 0,
      burpees: 0,
      distance: 0,
      breathbox: 0,
      shadowbox: 0,
      yoga: 0,
      bookName: '',
      bookPages: '',
      skipReason: '',
      notes: ''
    })
  }

  return (
    <div className="form-section">
      <h2 className="form-title">SUBMIT DAILY LOG</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">DATE</label>
          <input
            type="date"
            className="form-input"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">STRENGTH EXERCISES</label>
          <div className="exercise-grid">
            <div>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Push Ups</label>
              <input type="number" className="form-input" name="pushups" min="0" placeholder="0" value={formData.pushups} onChange={handleChange} />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Squats</label>
              <input type="number" className="form-input" name="squats" min="0" placeholder="0" value={formData.squats} onChange={handleChange} />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Sit Ups</label>
              <input type="number" className="form-input" name="situps" min="0" placeholder="0" value={formData.situps} onChange={handleChange} />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Running (KM)</label>
              <input type="number" className="form-input" name="running" min="0" step="0.1" placeholder="0" value={formData.running} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">AGILITY EXERCISES</label>
          <div className="exercise-grid">
            <div>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>100m Dash</label>
              <input type="number" className="form-input" name="dash" min="0" placeholder="0" value={formData.dash} onChange={handleChange} />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Burpees</label>
              <input type="number" className="form-input" name="burpees" min="0" placeholder="0" value={formData.burpees} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">STAMINA EXERCISES</label>
          <div className="exercise-grid">
            <div>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Distance (KM)</label>
              <input type="number" className="form-input" name="distance" min="0" step="0.1" placeholder="0" value={formData.distance} onChange={handleChange} />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Breath Box</label>
              <input type="number" className="form-input" name="breathbox" min="0" placeholder="0" value={formData.breathbox} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">PERCEPTION EXERCISES</label>
          <div className="exercise-grid">
            <div>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Shadowbox</label>
              <input type="number" className="form-input" name="shadowbox" min="0" placeholder="0" value={formData.shadowbox} onChange={handleChange} />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Yoga</label>
              <input type="number" className="form-input" name="yoga" min="0" placeholder="0" value={formData.yoga} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">BOOK READING (REQUIRED)</label>
          <input type="text" className="form-input" name="bookName" placeholder="Book name" value={formData.bookName} onChange={handleChange} style={{ marginBottom: '0.5rem' }} />
          <input type="text" className="form-input" name="bookPages" placeholder="Pages/Duration" value={formData.bookPages} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">SKIP REASON (IF APPLICABLE)</label>
          <select className="form-select" name="skipReason" value={formData.skipReason} onChange={handleChange}>
            <option value="">No Skip</option>
            <option value="fever">Fever</option>
            <option value="injury">Injury</option>
            <option value="exam">Exam</option>
            <option value="emergency">Emergency</option>
          </select>
          <div style={{ fontSize: '0.75rem', color: 'var(--grey)', marginTop: '0.5rem' }}>
            {state.validSkipsThisMonth > 0 && `Valid skips used this month: ${state.validSkipsThisMonth} / 2`}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">NOTES</label>
          <textarea className="form-textarea" name="notes" placeholder="Additional notes..." value={formData.notes} onChange={handleChange}></textarea>
        </div>

        <button type="submit" className="btn" disabled={state.systemPaused}>SUBMIT LOG</button>
      </form>
    </div>
  )
}

export default DailyLogForm
