import { checklistItems } from '../data';
import CtaButton from '../shared/CtaButton';
import Icon from '../shared/Icon';

export default function ChecklistSection({ onBook }) {
  return (
    <section className="checklist-section">
      <div className="container checklist-inner">
        <div className="checklist-copy fade-up">
          <div className="section-label tw-text-[0.72rem]">Session Coverage</div>
          <h2 className="section-title light tw-text-3xl md:tw-text-4xl lg:tw-text-5xl">
            Everything Covered In Your Session
          </h2>
          <p className="tw-text-base lg:tw-text-lg">
            Your 45-minute session is structured to leave nothing on the table — from accurate reporting to optimisation opportunities most people miss.
          </p>
          <CtaButton onClick={onBook}>
            <Icon name="calendar" /> Book Your Session
          </CtaButton>
          <div className="sebi-badge tw-text-[0.75rem]">
            <Icon name="shield" />
            <span><strong>SEBI Registered Investment Advisor</strong> · RIA No. INA000014252</span>
          </div>
        </div>

        <div className="checklist-grid fade-up">
          {checklistItems.map((item) => (
            <div className="check-item fade-up" key={item}>
              <div className="check-tick tw-text-[0.65rem]"><Icon name="check" /></div>
              <span className="tw-text-[0.82rem]">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
