import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts'

export default function ScoreCard({ score }) {
  const { total_score, grade, breakdown } = score

  const color = total_score >= 80 ? '#22c55e'
    : total_score >= 65 ? '#6366f1'
    : total_score >= 50 ? '#f59e0b'
    : '#ef4444'

  const data = [{ value: total_score, fill: color }]

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)', border: '1px solid #1e1e2e',
      borderRadius: '16px', padding: '1.5rem', textAlign: 'center'
    }}>
      <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#8888aa' }}>
        Resume Score
      </h2>

      {/* Circular chart */}
      <div style={{ position: 'relative', width: '140px', margin: '0 auto 1rem' }}>
        <ResponsiveContainer width={140} height={140}>
          <RadialBarChart
            cx="50%" cy="50%" innerRadius="70%" outerRadius="100%"
            startAngle={90} endAngle={-270}
            data={[{ value: 100, fill: '#1e1e2e' }, ...data]}
          >
            <RadialBar dataKey="value" cornerRadius={10} background={false} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: '800', color }}>{total_score}</div>
          <div style={{ fontSize: '0.7rem', color: '#8888aa' }}>/ 100</div>
        </div>
      </div>

      <div style={{
        display: 'inline-block', padding: '4px 16px', borderRadius: '100px',
        background: `${color}22`, color, fontSize: '0.85rem', fontWeight: '600',
        marginBottom: '1.5rem'
      }}>
        {grade}
      </div>

      {/* Breakdown bars */}
      <div style={{ textAlign: 'left' }}>
        {Object.entries(breakdown).map(([key, val]) => {
          const max = key === 'skills' ? 30 : key === 'sections' ? 25
            : key === 'projects' ? 20 : key === 'quantified_impact' ? 15 : 10
          const pct = (val / max) * 100
          return (
            <div key={key} style={{ marginBottom: '10px' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: '0.75rem', marginBottom: '4px'
              }}>
                <span style={{ color: '#aaaacc', textTransform: 'capitalize' }}>
                  {key.replace(/_/g, ' ')}
                </span>
                <span style={{ color: '#ccccee' }}>{val}/{max}</span>
              </div>
              <div style={{ height: '4px', background: '#1e1e2e', borderRadius: '2px' }}>
                <div style={{
                  height: '100%', width: `${pct}%`,
                  background: color, borderRadius: '2px',
                  transition: 'width 0.6s ease'
                }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}