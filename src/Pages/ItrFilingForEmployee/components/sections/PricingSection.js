import { pricingPlans } from '../data';
import Icon from '../shared/Icon';

const trustBadges = [
  ['lock', '100% Secure & Confidential'],
  ['bolt', 'Quick & Accurate Filing'],
  ['userTie', 'Expert Tax Support'],
  ['rupee', 'Max Refund. Zero Stress.'],
  ['check', 'Tax Expert Reviewed & Verified'],
];

export default function PricingSection({ onBook }) {
  return (
    <section className="pricing-section" id="pricing">
      <div className="container">
        <div className="pricing-header fade-up">
          <div className="section-label tw-text-[0.72rem]">Transparent Pricing</div>
          <div className="pricing-tagline tw-text-[0.78rem]"><Icon name="file" /> Expert Guidance - Accurate Filing - Maximum Refund</div>
          <h2 className="section-title tw-text-3xl md:tw-text-4xl lg:tw-text-5xl">Fintoo ITR Rate Card 2026</h2>
        </div>
        <div className="pricing-grid">
          {pricingPlans.map((plan) => <PlanCard key={plan.key} plan={plan} onBook={onBook} />)}
        </div>
        <div className="pricing-trust fade-up">
          {trustBadges.map(([icon, label]) => <span className="tw-text-[0.8rem]" key={label}><Icon name={icon} /> {label}</span>)}
        </div>
      </div>
    </section>
  );
}

function PlanCard({ plan, onBook }) {
  return (
    <article className={`plan-card${plan.popular ? ' popular' : ''} fade-up`}>
      {plan.popular && <div className="popular-badge tw-text-[0.72rem]"><Icon name="star" fill /> Most Popular</div>}
      <div className="plan-header">
        <div className="plan-label tw-text-[0.65rem]">{plan.label}</div>
        <div className="plan-name tw-text-[2rem]">{plan.name}</div>
        <div className="plan-subtitle tw-text-[0.8rem]">{plan.subtitle}</div>
        <div className="plan-price-wrap">
          <div className="plan-price-box">
            <span className="plan-price-actual tw-text-[1.8rem]">{plan.price}</span>
            <span className="plan-price-original tw-text-[0.75rem]">{plan.originalPrice}</span>
            <span className="plan-price-label tw-text-[0.68rem]">All Inclusive</span>
          </div>
          <div className="plan-savings tw-text-[0.72rem]">{plan.savings}</div>
        </div>
      </div>
      <div className="plan-body">
        <div className="plan-inclusions-label tw-text-[0.65rem]">Inclusions</div>
        <ul className="plan-features">{plan.features.map((feature) => <li className="tw-text-[0.82rem]" key={feature}>{feature}</li>)}</ul>
        <button type="button" className={`btn-plan ${plan.buttonClass} tw-text-[0.88rem]`} onClick={() => onBook(plan.key)}>
          <Icon name="calendar" /> Get Started with {plan.name}
        </button>
      </div>
    </article>
  );
}
