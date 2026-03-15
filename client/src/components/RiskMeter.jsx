import './RiskMeter.css'

const LEVEL_COLOR = {
  safe:     'var(--safe)',
  low:      'var(--low)',
  medium:   'var(--medium)',
  high:     'var(--high)',
  critical: 'var(--critical)',
}

export default function RiskMeter({ score = 0, level = 'safe' }) {
  const color = LEVEL_COLOR[level] || 'var(--text-2)'
  const pct   = Math.min(100, Math.max(0, score))

  return (
    <div className="risk-meter">
      <div className="rm-bar-wrap">
        <div
          className="rm-bar-fill"
          style={{ width: `${pct}%`, background: color, boxShadow: `0 0 10px ${color}` }}
        />
      </div>
      <div className="rm-labels">
        <span className="rm-score mono" style={{ color }}>{score}</span>
        <span className="rm-max mono">/100</span>
      </div>
    </div>
  )
}
