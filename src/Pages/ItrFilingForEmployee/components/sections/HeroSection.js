import { trustItems } from '../data';
import CtaButton from '../shared/CtaButton';
import Icon from '../shared/Icon';

export default function HeroSection({ onBook }) {
  return (
    <section className="hero" id="top">
      <div className="hero-inner">
        <div className="hero-content">
          <div className="hero-eyebrow tw-text-[0.78rem] before:tw-text-[0.5rem]">Live Tax Expert-Assisted ITR Filing</div>
          <h1 className="tw-text-4xl md:tw-text-6xl lg:tw-text-7xl">
            <span className="hero-line">One Tax Expert.</span>
            <span className="hero-line">One dedicated session.</span>
            <span className="hero-line">Your <em>ITR filed</em> in 45 minutes.</span>
          </h1>
          <div className="hero-not tw-text-[0.92rem]">
            <span>No chatbot maze</span>
            <span>No ticketing-system wait</span>
          </div>
          <p className="hero-desc tw-text-lg lg:tw-text-xl">Connect with a qualified tax expert over a live video consultation and get your return filed with confidence.</p>
          <p className="hero-subline tw-text-[0.98rem]">Personalized, accurate, and stress-free tax filing for salaried professionals, investors, founders, and NRIs.</p>
          <div className="hero-btns">
            <CtaButton onClick={() => onBook('free')}><Icon name="calendar" /> Book Your ITR Filing Session</CtaButton>
            <CtaButton href="#how" variant="secondary">See How Live Filing Works <Icon name="arrowRight" /></CtaButton>
          </div>
          <div className="trust-strip">
            {trustItems.map(([value, label]) => (
              <div className="trust-item" key={label}>
                <span className="trust-num tw-text-[1.2rem]">{value}</span>
                <span className="trust-label tw-text-[0.68rem]">{label}</span>
              </div>
            ))}
          </div>
        </div>

     
      </div>
    </section>
  );
}
