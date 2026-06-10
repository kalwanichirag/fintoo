import React from "react";

const services = [
  ["□", "Live ITR Filing", "45 min session · Expert-Led", "File your return live, with a CA walking you through every field - accurate, transparent, and tailored to your disclosures."],
  ["◷", "Tax Planning", "Current FY · Proactive", "Plan your taxes well before the deadline. Reduce liability legally using the right regime, deductions, and investment structuring."],
  ["↗", "ESOP & Equity Advisory", "RSUs · ESOPs · SBUs", "Navigate the tax complexity of stock options, vested shares, and equity income with expert-guided disclosure and planning."],
  ["◎", "Global Tax Assistance", "US Filing · Foreign Assets · FBAR", "Expert help for international income, overseas assets, NRI status, and US tax filing obligations - all under one roof."],
];

export default function ServicesSection() {
  return (
    <section id="services" className="tw-bg-[#f8f6f1] tw-px-[5%] tw-py-24">
      <div className="tw-mx-auto tw-max-w-7xl">
        <div className="tw-mb-4 tw-flex tw-items-center tw-gap-2 tw-text-[11px] tw-font-bold tw-uppercase tw-text-fintoo-orange">
          <span className="tw-h-0.5 tw-w-5 tw-bg-fintoo-orange" />
          The Offering
        </div>
        <h2 className="tw-m-0 tw-font-dmserif1 tw-text-4xl tw-font-black tw-leading-tight tw-text-fintoo-blue md:tw-text-[52px]">
          One advisory.
          <br />
          Every dimension.
        </h2>
        <div className="tw-mt-14 tw-grid tw-grid-cols-1 tw-gap-14 lg:tw-grid-cols-[400px_1fr]">
          <div className="lg:tw-sticky lg:tw-top-28 lg:tw-self-start">
            <p className="tw-m-0 tw-mb-8 tw-text-[17px] tw-font-light tw-leading-8 tw-text-fintoo-blue/50">
              We don't just file your ITR. We structure and optimize your entire tax life - ethically, accurately, and
              transparently.
            </p>
            <div className="tw-rounded-[16px] tw-border tw-border-solid tw-border-fintoo-orange/15 tw-bg-fintoo-orange/[0.06] tw-p-7">
              <div className="tw-mb-3 tw-text-[11px] tw-font-bold tw-uppercase tw-text-fintoo-orange">Our Promise</div>
              <div className="tw-mb-4 tw-font-dmserif1 tw-text-2xl tw-font-bold tw-leading-tight tw-text-fintoo-blue">
                Fee-Only. Zero Commissions. Always.
              </div>
              <p className="tw-m-0 tw-text-sm tw-leading-6 tw-text-fintoo-blue/50">
                Every recommendation we make is purely in your interest. We earn no commission - ever. That's how trust
                is built.
              </p>
            </div>
          </div>
          <div className="tw-grid tw-gap-4">
            {services.map(([icon, title, tag, copy]) => (
              <article key={title} className="tw-rounded-[16px] tw-border tw-border-solid tw-border-fintoo-blue/10 tw-bg-white tw-p-6 tw-transition-all hover:tw-border-fintoo-orange/30 hover:tw-shadow-[0_8px_32px_rgba(4,43,98,0.08)]">
                <div className="tw-mb-3 tw-flex tw-items-start tw-gap-4">
                  <div className="tw-flex tw-h-11 tw-w-11 tw-shrink-0 tw-items-center tw-justify-center tw-rounded-[12px] tw-bg-fintoo-blue/5 tw-text-xl tw-text-fintoo-blue">
                    {icon}
                  </div>
                  <div>
                    <h3 className="tw-m-0 tw-font-dmserif1 tw-text-xl tw-font-bold tw-text-fintoo-blue">{title}</h3>
                    <div className="tw-mt-1 tw-text-[10px] tw-font-bold tw-uppercase tw-text-fintoo-orange">{tag}</div>
                  </div>
                </div>
                <p className="tw-m-0 tw-text-sm tw-leading-6 tw-text-fintoo-blue/50">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
