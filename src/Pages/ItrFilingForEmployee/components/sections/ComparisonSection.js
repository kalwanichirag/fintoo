import { comparisonRows } from '../data';
import CtaButton from '../shared/CtaButton';
import Icon from '../shared/Icon';

export default function ComparisonSection({ onBook }) {
  return (
    <section className="compare-section">
      <div className="container compare-inner">
        <div className="compare-copy fade-up">
          <div className="section-label tw-text-[0.72rem]">What Makes Us Different</div>
          <h2 className="section-title tw-text-3xl md:tw-text-4xl lg:tw-text-5xl">Fintoo vs Everyone Else</h2>
          <p className="tw-text-[0.95rem]">Most platforms hand you a form and wish you luck. Fintoo gives you a tax expert who understands your situation and files it right the first time.</p>
          <CtaButton onClick={() => onBook('free')}><Icon name="calendar" /> Book Free Intro Call</CtaButton>
        </div>
        <div className="fade-up">
          <table className="compare">
            <thead>
              <tr>
                <th className="tw-text-[0.8rem]">Other Platforms</th>
                <th className="tw-text-[0.8rem]">
                  <span className="compare-brand">
                    <img src="/static/media/wp/Fintoowhitelogo_.svg" alt="Fintoo" />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map(([other, fintoo]) => (
                <tr key={other}>
                  <td className="tw-text-[0.85rem]">{other}</td>
                  <td className="tw-text-[0.88rem]"><span className="check-icon tw-text-[0.85rem]"><Icon name="check" /> {fintoo}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
