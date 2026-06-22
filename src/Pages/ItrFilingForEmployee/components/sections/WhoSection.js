import { audienceCards } from '../data';
import Icon from '../shared/Icon';
import SectionHeader from '../shared/SectionHeader';

export default function WhoSection() {
  return (
    <section className="who-section">
      <div className="container">
        <SectionHeader className="who-header" label="Who It's For" title="Built For Complex Tax Situations" />
        <div className="who-grid">
          {audienceCards.map(([icon, title, copy]) => (
            <article className="who-card fade-up" key={title}>
              <span className="who-icon tw-text-[2rem]"><Icon name={icon} /></span>
              <h3 className="tw-text-[1.05rem]">{title}</h3>
              <p className="tw-text-[0.83rem]">{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
