import { useState } from 'react'
import UploadPage from './pages/UploadPage'
import ResultsPage from './pages/ResultsPage'

export default function App() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleUpload = async (file) => {
    setLoading(true)
    setError(null)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('http://localhost:8000/upload-resume', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Upload failed')
      }
      const data = await res.json()
      setResults(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setResults(null)
    setError(null)
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {!results ? (
        <UploadPage
          onUpload={handleUpload}
          loading={loading}
          error={error}
        />
      ) : (
        <ResultsPage results={results} onReset={handleReset} />
      )}
    </div>
  )
}