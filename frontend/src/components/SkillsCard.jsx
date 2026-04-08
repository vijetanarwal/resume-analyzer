export default function SkillsCard({ skills }) {
  const { skills_by_category, total_count } = skills

  const categoryColors = {
    languages: '#6366f1',
    ml_ai: '#8b5cf6',
    data: '#06b6d4',
    web_frameworks: '#22c55e',
    databases: '#f59e0b',
    cloud_devops: '#f97316',
    tools: '#ec4899',
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
        <h2 style={{ fontSize: '1rem', fontWeight: '600' }}>Detected Skills</h2>
        <span style={{
          background: 'rgba(99,102,241,0.15)', color: '#818cf8',
          padding: '4px 12px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: '600'
        }}>
          {total_count} total
        </span>
      </div>

      {Object.keys(skills_by_category).length === 0 ? (
        <p style={{ color: '#8888aa' }}>No skills detected. Make sure your resume has a skills section.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Object.entries(skills_by_category).map(([category, skillList]) => (
            <div key={category}>
              <p style={{
                fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase',
                letterSpacing: '0.08em', color: categoryColors[category] || '#8888aa',
                marginBottom: '8px'
              }}>
                {category.replace(/_/g, ' ')}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {skillList.map(skill => (
                  <span key={skill} style={{
                    padding: '4px 12px', borderRadius: '100px', fontSize: '0.82rem',
                    background: `${categoryColors[category] || '#6366f1'}18`,
                    color: categoryColors[category] || '#818cf8',
                    border: `1px solid ${categoryColors[category] || '#6366f1'}30`,
                    fontWeight: '500'
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}