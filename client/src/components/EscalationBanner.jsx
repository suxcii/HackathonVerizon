function EscalationBanner() {
  return (
    <div className="escalation-banner">
      <span className="escalation-icon">⚠️</span>
      <div className="escalation-text">
        <strong>This may need a human agent.</strong>
        <p>Your question involves something our bot can't fully resolve. A specialist will follow up.</p>
      </div>
    </div>
  )
}

export default EscalationBanner