import { useState } from 'react'

function InputForm({ onSubmit, isLoading }) {
  const [text, setText] = useState('')

  const handleClick = () => {
    onSubmit(text)
  }

  return (
    <section className="input-section">
      <h2 className="input-heading">Paste your bill or ask a question</h2>
      <p className="input-subtext">
        We'll summarize it, detect the issue type, and tell you what to do next.
      </p>

      <textarea
        className="input-textarea"
        rows={6}
        placeholder="e.g. 'My bill went up $30 this month. It shows an activation fee and data overage...'"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isLoading}
      />

      <button
        className="submit-btn"
        onClick={handleClick}
        disabled={isLoading || !text.trim()}
      >
        {isLoading ? 'Analyzing...' : 'Analyze Bill →'}
      </button>
    </section>
  )
}

export default InputForm