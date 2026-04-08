import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

export default function UploadPage({ onUpload, loading, error }) {
  const [selectedFile, setSelectedFile] = useState(null)

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) setSelectedFile(accepted[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  })

  const handleSubmit = () => {
    if (selectedFile) onUpload(selectedFile)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '2rem'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '10px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          padding: '8px 20px', borderRadius: '100px', marginBottom: '1.5rem',
          fontSize: '13px', fontWeight: '600', letterSpacing: '0.05em'
        }}>
          AI RESUME ANALYZER
        </div>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '700',
          lineHeight: '1.2', marginBottom: '1rem',
          background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          Get your resume<br />analyzed instantly
        </h1>
        <p style={{ color: '#8888aa', fontSize: '1.1rem', maxWidth: '480px' }}>
          Upload your PDF or DOCX resume and get AI-powered feedback,
          a score, skill gap analysis, and matching jobs.
        </p>
      </div>

      {/* Drop Zone */}
      <div
        {...getRootProps()}
        style={{
          width: '100%', maxWidth: '560px',
          border: `2px dashed ${isDragActive ? '#6366f1' : '#2a2a3e'}`,
          borderRadius: '16px', padding: '3rem 2rem', textAlign: 'center',
          background: isDragActive ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)',
          cursor: 'pointer', transition: 'all 0.2s ease',
          marginBottom: '1.5rem'
        }}
      >
        <input {...getInputProps()} />
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
        {selectedFile ? (
          <div>
            <p style={{ color: '#6366f1', fontWeight: '600', fontSize: '1.1rem' }}>
              {selectedFile.name}
            </p>
            <p style={{ color: '#8888aa', fontSize: '0.85rem', marginTop: '4px' }}>
              {(selectedFile.size / 1024).toFixed(0)} KB — click to change
            </p>
          </div>
        ) : (
          <div>
            <p style={{ color: '#ccccee', fontWeight: '500', marginBottom: '6px' }}>
              {isDragActive ? 'Drop it here!' : 'Drag & drop your resume here'}
            </p>
            <p style={{ color: '#8888aa', fontSize: '0.85rem' }}>
              or click to browse — PDF or DOCX, max 5MB
            </p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: '10px', padding: '12px 20px', marginBottom: '1rem',
          color: '#f87171', maxWidth: '560px', width: '100%', textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!selectedFile || loading}
        style={{
          padding: '14px 40px', borderRadius: '12px', border: 'none',
          background: selectedFile && !loading
            ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
            : '#2a2a3e',
          color: selectedFile && !loading ? '#fff' : '#555577',
          fontSize: '1rem', fontWeight: '600', cursor: selectedFile ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s', minWidth: '200px'
        }}
      >
        {loading ? 'Analyzing...' : 'Analyze Resume'}
      </button>

      {loading && (
        <p style={{ color: '#8888aa', marginTop: '1rem', fontSize: '0.9rem' }}>
          Extracting skills, scoring and matching jobs...
        </p>
      )}
    </div>
  )
}