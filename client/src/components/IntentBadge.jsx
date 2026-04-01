// Maps each intent to a color class
const intentStyles = {
  'Billing': 'badge-billing',
  'Technical Support': 'badge-tech',
  'Account Management': 'badge-account',
}

function IntentBadge({ intent }) {
  const colorClass = intentStyles[intent] || 'badge-default'

  return (
    <span className={`intent-badge ${colorClass}`}>
      {intent}
    </span>
  )
}

export default IntentBadge