export default function JobMatchesCard({ jobs }) {
  if (!jobs || jobs.length === 0) {
    return (
      <div style={{
        background: 'rgba(255,255,255,0.03)', border: '1px solid #1e1e2e',
        borderRadius: '16px', padding: '1.5rem'
      }}>
        <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Job Matches</h2>
        <p style={{ color: '#8888aa' }}>No job matches found.</p>
      </div>
    )
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)', border: '1px solid #1e1e2e',
      borderRadius: '16px', padding: '1.5rem'
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '1.2rem'
      }}>
        <h2 style={{ fontSize: '1rem', fontWeight: '600' }}>Job Matches</h2>
        <span style={{ color: '#8888aa', fontSize: '0.85rem' }}>{jobs.length} found</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {jobs.map((job, i) => {
          const matchScore = job.match_score
          const matchColor = matchScore >= 60 ? '#22c55e' : matchScore >= 35 ? '#f59e0b' : '#ef4444'

          return (
            <div
              key={i}
              style={{
                border: '1px solid #1e1e2e', borderRadius: '12px', padding: '1.2rem',
                background: 'rgba(255,255,255,0.02)',
                display: 'grid', gridTemplateColumns: '1fr auto',
                gap: '1rem', alignItems: 'start'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>{job.title}</h3>
                  <span style={{ color: '#8888aa', fontSize: '0.85rem' }}>
                    {job.company} · {job.location}
                  </span>
                </div>

                <p style={{
                  color: '#8888aa', fontSize: '0.82rem',
                  lineHeight: '1.5', marginBottom: '10px'
                }}>
                  {job.description_snippet}
                </p>

                {job.matching_skills && job.matching_skills.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '6px' }}>
                    {job.matching_skills.map((s) => (
                      <span key={s} style={{
                        padding: '2px 10px', borderRadius: '100px', fontSize: '0.75rem',
                        background: 'rgba(34,197,94,0.1)', color: '#4ade80',
                        border: '1px solid rgba(34,197,94,0.2)'
                      }}>
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {job.missing_skills && job.missing_skills.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {job.missing_skills.map((s) => (
                      <span key={s} style={{
                        padding: '2px 10px', borderRadius: '100px', fontSize: '0.75rem',
                        background: 'rgba(239,68,68,0.08)', color: '#f87171',
                        border: '1px solid rgba(239,68,68,0.2)'
                      }}>
                        missing: {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ textAlign: 'center', minWidth: '80px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: matchColor, lineHeight: '1' }}>
                  {matchScore}%
                </div>
                <div style={{ fontSize: '0.7rem', color: '#8888aa', marginBottom: '10px' }}>
                  match
                </div>
                
                <a
                  href={job.apply_link}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'block', padding: '7px 14px', borderRadius: '8px',
                    background: 'rgba(99,102,241,0.15)', color: '#818cf8',
                    fontSize: '0.8rem', fontWeight: '600', textDecoration: 'none',
                    border: '1px solid rgba(99,102,241,0.25)'
                  }}
                >
                  Apply
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}