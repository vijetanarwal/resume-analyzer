import ScoreCard from '../components/ScoreCard'
import SkillsCard from '../components/SkillsCard'
import SuggestionsCard from '../components/SuggestionsCard'
import JobMatchesCard from '../components/JobMatchesCard'

export default function ResultsPage({ results, onReset }) {
  const { score, skills, job_matches, contact, sections_found } = results

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '700' }}>Resume Analysis</h1>
          {contact?.email && (
            <p style={{ color: '#8888aa', fontSize: '0.9rem', marginTop: '4px' }}>
              {contact.email}
            </p>
          )}
        </div>
        <button
          onClick={onReset}
          style={{
            padding: '10px 24px', borderRadius: '10px', border: '1px solid #2a2a3e',
            background: 'transparent', color: '#ccccee', cursor: 'pointer',
            fontSize: '0.9rem', fontWeight: '500'
          }}
        >
          Upload New
        </button>
      </div>

      {/* Row 1: Score + Suggestions */}
      <div style={{
        display: 'grid', gridTemplateColumns: '280px 1fr',
        gap: '1.5rem', marginBottom: '1.5rem'
      }}>
        <ScoreCard score={score} />
        <SuggestionsCard suggestions={score.suggestions} sections={sections_found} />
      </div>

      {/* Row 2: Skills */}
      <div style={{ marginBottom: '1.5rem' }}>
        <SkillsCard skills={skills} />
      </div>

      {/* Row 3: Job Matches */}
      <div>
        <JobMatchesCard jobs={job_matches} />
      </div>
    </div>
  )
}