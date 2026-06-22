import { timelineSteps } from '../data';
import Icon from '../shared/Icon';
import SectionHeader from '../shared/SectionHeader';

export default function TimelineSection() {
  return (
    <section className="timeline-section" id="how">
      <div className="container">
        <SectionHeader className="timeline-header" label="The Process" title="Your 45-Minute Tax Session" />
        <div className="timeline">
          {timelineSteps.map(([icon, title, sub, tag], index) => (
            <div className="timeline-step fade-up" key={title}>
              <div className="step-circle tw-text-[1.1rem]">{index + 1}</div>
              <span className="step-icon tw-text-[1.4rem]"><Icon name={icon} /></span>
              <div className="step-title tw-text-[0.88rem]">{title}</div>
              <div className="step-sub tw-text-[0.75rem]">{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
