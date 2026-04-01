// Labels for each of the 3 bullet positions
const cardLabels = ['What changed', 'Why it changed', 'What to do next']

function ResultCard({ index, text }) {
  return (
    <div className="result-card">
      <span className="card-label">{cardLabels[index] ?? `Point ${index + 1}`}</span>
      <p className="card-text">{text}</p>
    </div>
  )
}

export default ResultCard