import { stats } from '../data';

export default function StatsSection() {
  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-header">
          <p className="section-label tw-text-xs">Why Clients Choose Fintoo</p>
          <h2 className="section-title tw-text-4xl md:tw-text-5xl">Trusted Across India</h2>
        </div>
        <div className="stats-grid">
          {stats.map(([value, suffix, label, tone], index) => (
            <div className={`stat-item fade-up${tone ? ` ${tone}` : ''}`} key={label}>
              <span className="stat-num tw-text-4xl md:tw-text-5xl">
                {index === 0 ? <span className="stat-currency">₹</span> : null}
                {value}
                {suffix ? <span className="stat-suffix">{suffix}</span> : null}
              </span>
              <div className="stat-divider" />
              <div className="stat-label tw-text-sm">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
