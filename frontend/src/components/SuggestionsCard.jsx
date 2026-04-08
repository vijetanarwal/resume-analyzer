export default function SuggestionsCard({ suggestions, sections }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)', border: '1px solid #1e1e2e',
      borderRadius: '16px', padding: '1.5rem'
    }}>
      <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1.2rem' }}>
        Improvement Suggestions
      </h2>

      {suggestions.length === 0 ? (
        <div style={{
          padding: '1rem', background: 'rgba(34,197,94,0.08)',
          borderRadius: '10px', color: '#4ade80', fontWeight: '500'
        }}>
          Your resume looks strong — no major gaps found!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {suggestions.map((s, i) => (
            <div key={i} style={{
              display: 'flex', gap: '12px', alignItems: 'flex-start',
              padding: '12px 14px', borderRadius: '10px',
              background: 'rgba(245,158,11,0.06)',
              border: '1px solid rgba(245,158,11,0.15)'
            }}>
              <span style={{ fontSize: '16px', marginTop: '1px' }}>💡</span>
              <p style={{ color: '#d4d4e8', fontSize: '0.9rem', lineHeight: '1.5' }}>{s}</p>
            </div>
          ))}
        </div>
      )}

      {/* Sections checklist */}
      <div style={{ marginTop: '1.5rem' }}>
        <p style={{ fontSize: '0.8rem', color: '#8888aa', marginBottom: '10px', fontWeight: '600' }}>
          SECTIONS DETECTED
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {['education', 'experience', 'skills', 'projects', 'certifications', 'summary'].map(sec => {
            const found = sections?.[sec]
            return (
              <span key={sec} style={{
                padding: '4px 12px', borderRadius: '100px', fontSize: '0.8rem',
                background: found ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.08)',
                color: found ? '#4ade80' : '#f87171',
                border: `1px solid ${found ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.2)'}`,
                display: 'flex', alignItems: 'center', gap: '5px'
              }}>
                {found ? '✓' : '✗'} {sec}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}