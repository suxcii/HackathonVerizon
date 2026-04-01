import { useState } from 'react'
import Header from './components/Header'
import InputForm from './components/InputForm'
import IntentBadge from './components/IntentBadge'
import ResultCard from './components/ResultCard'
import EscalationBanner from './components/EscalationBanner'

function App() {
  // Possible states: 'idle' | 'loading' | 'results' | 'error'
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)

  // This will call the real API later — for now it uses mock data
  const handleSubmit = async (text) => {
    if (!text.trim()) return

    setStatus('loading')
    setResult(null)

    try {
      // MOCK RESPONSE — replace this block with a real fetch() later
      await new Promise((resolve) => setTimeout(resolve, 1200)) // fake delay

      const mockResult = {
        intent: 'Billing',
        summary: [
          'Your bill increased by $30 compared to last month.',
          'The increase is due to a one-time activation fee and a data overage charge.',
          'Consider upgrading to an unlimited plan to avoid future overages.',
        ],
        escalate: false,
      }

      setResult(mockResult)
      setStatus('results')
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <div className="app-wrapper">
      <Header />

      <main className="main-content">
        <InputForm onSubmit={handleSubmit} isLoading={status === 'loading'} />

        {status === 'loading' && (
          <div className="loading-state">
            <div className="spinner" />
            <p>Analyzing your bill...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="error-state">
            <p>⚠️ Something went wrong. Please try again.</p>
          </div>
        )}

        {status === 'results' && result && (
          <div className="results-section">
            <div className="results-header">
              <span className="results-label">Detected Intent</span>
              <IntentBadge intent={result.intent} />
            </div>

            {result.escalate && <EscalationBanner />}

            <div className="summary-grid">
              {result.summary.map((point, index) => (
                <ResultCard
                  key={index}
                  index={index}
                  text={point}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App