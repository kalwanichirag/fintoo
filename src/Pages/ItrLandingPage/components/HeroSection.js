
import { useEffect, useState } from "react";

const heroIconClass = "tw-h-6 tw-w-6 sm:tw-h-8 sm:tw-w-8";

export default function HeroSection() {
  const services = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className={heroIconClass} aria-hidden="true">
        <path d="M7 3.5h7l3 3v14H7v-17Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M14 3.5v3h3" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M9.5 11h5M9.5 14h5M9.5 17h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    title: "Live ITR Filing",
    meta: "45 min session · Expert-Led",
    desc: "File your return live, with a CA walking you through every field - accurate, transparent, and tailored to your disclosures.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className={heroIconClass} aria-hidden="true">
        <rect x="5" y="3.5" width="14" height="17" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8.5 8h7M8.5 12h1M12 12h1M15.5 12h1M8.5 16h1M12 16h1M15.5 16h1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    title: "Tax Planning",
    meta: "Current FY · Proactive",
    desc: "Plan your taxes well before the deadline. Reduce liability legally using the right regime, deductions, and investment structuring.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className={heroIconClass} aria-hidden="true">
        <path d="M4 17.5h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M6.5 15l4-4 3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15.5 8h3v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "ESOP & Equity Advisory",
    meta: "RSUs · ESOPs · SBUs",
    desc: "Navigate the tax complexity of stock options, vested shares, and equity income with expert-guided disclosure and planning.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className={heroIconClass} aria-hidden="true">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4.8 9.5h14.4M4.8 14.5h14.4M12 4a14.5 14.5 0 0 1 0 16M12 4a14.5 14.5 0 0 0 0 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    title: "Global Tax Assistance",
    meta: "US Filing · Foreign Assets · FBAR",
    desc: "Expert help for international income, overseas assets, NRI status, and US tax filing obligations.",
  },
];
const [active, setActive] = useState(0);

useEffect(() => {
  const timer = setInterval(() => {
    setActive((prev) => (prev + 1) % services.length);
  }, 2500);

  return () => clearInterval(timer);
}, []);
  
  return (
    <section id="home" className="tw-relative tw-flex tw-min-h-screen tw-items-center tw-overflow-hidden tw-bg-[#021d44] tw-px-4 tw-pb-20 tw-pt-10 md:tw-px-8 lg:tw-pt-32">
      <div className="tw-absolute tw-inset-0 tw-bg-white/5" />
      <div className="tw-absolute -tw-right-24 -tw-top-24 tw-h-96 tw-w-96 tw-rounded-full tw-bg-[radial-gradient(circle,rgba(221,115,0,0.18)_0%,transparent_70%)] tw-blur-3xl" />
      <div className="tw-absolute -tw-bottom-24 tw-left-1/4 tw-h-96 tw-w-96 tw-rounded-full tw-bg-[radial-gradient(circle,rgba(8,56,128,0.4)_0%,transparent_70%)] tw-blur-3xl" />

      <div className="tw-relative tw-z-10 tw-mx-auto tw-grid tw-w-full tw-max-w-7xl tw-grid-cols-1 tw-gap-14 lg:tw-grid-cols-2 lg:tw-items-center">
        <div>
          <div className="tw-mb-7 tw-inline-flex tw-items-center tw-gap-2 tw-rounded-full tw-border tw-border-solid tw-border-fintoo-orange/25 tw-bg-fintoo-orange/10 tw-py-1.5 tw-pl-2 tw-pr-4">
            <span className="tw-text-xs tw-font-bold tw-uppercase tw-text-fintoo-orange">
              SEBI Registered · INA000020031
            </span>
          </div>
          <h1 className="tw-m-0 tw-font-dmserif1 tw-text-4xl tw-font-black tw-leading-tight tw-text-white md:tw-text-7xl">
            Not Just
            <br />
            <em className="tw-text-fintoo-orange">ITR Filing.</em>
            <br />
            Structured Tax
            <br />
            Advisory.
          </h1>
          <p className="tw-mt-6 tw-max-w-lg tw-text-lg tw-font-light tw-leading-8 tw-text-white/65">
            India's most trusted tax advisory for corporate professionals with complex income streams - ESOPs, global
            assets, multiple sources, and beyond.
          </p>

          <div className="tw-mt-8 tw-flex tw-flex-nowrap tw-items-center tw-gap-2 sm:tw-mt-10 sm:tw-flex-wrap sm:tw-gap-4">
            <a
              href="#booking"
              className="tw-inline-flex tw-min-w-0 tw-flex-1 tw-items-center tw-justify-center tw-gap-1.5 tw-rounded-lg tw-bg-fintoo-orange tw-px-2 tw-py-3 tw-text-xs tw-font-bold tw-text-white tw-no-underline tw-shadow-xl hover:tw-bg-[#f08c1a] hover:tw-text-white sm:tw-flex-none sm:tw-gap-2.5 sm:tw-px-7 sm:tw-py-4 sm:tw-text-sm"
            >
              <span className="sm:tw-hidden">Book Free</span>
              <span className="tw-hidden sm:tw-inline">Book Free Consultation</span>
              <span>→</span>
            </a>
           
          </div>

          <div className="tw-mt-10 tw-grid tw-grid-cols-3 tw-gap-3 sm:tw-mt-14 sm:tw-flex sm:tw-flex-wrap sm:tw-gap-8">
            {[
              ["₹5,000 Cr+", "Assets Tracked"],
              ["25,000+", "Employees Advised"],
              ["500+", "Corporate Tie-Ups"],
            ].map(([num, label]) => (
              <div key={label} className="tw-border-0 tw-border-r tw-border-solid tw-border-white/10 tw-pr-3 last:tw-border-r-0 sm:tw-pr-8">
                <div className="tw-font-dmserif1 tw-text-xl tw-font-bold tw-leading-none tw-text-white sm:tw-text-3xl">{num}</div>
                <div className="tw-mt-1 tw-text-xs tw-font-bold tw-uppercase tw-leading-tight tw-text-white/50">{label}</div>
              </div>
            ))}
          </div>
        </div>
<div>
<div className="tw-relative tw-flex tw-items-center tw-justify-center">

  <div className="tw-relative tw-w-full tw-max-w-lg">

    {/* glow */}
    <div className="tw-absolute -tw-inset-8 tw-rounded-3xl tw-bg-fintoo-orange/20 tw-blur-3xl" />

    <div className="tw-relative tw-overflow-hidden tw-rounded-3xl tw-border tw-border-solid tw-border-white/10 tw-bg-white/[0.04] tw-backdrop-blur-xl">

      {/* progress */}
      <div className="tw-h-1 tw-bg-white/5">
        <div
          key={active}
          className="tw-h-full tw-bg-fintoo-orange animate-progress"
        />
      </div>

      <div className="tw-p-5 sm:tw-p-10">

        <div
          key={active}
          className="animate-slide-card"
        >
          <div className="tw-mb-5 tw-flex tw-items-center tw-gap-3 sm:tw-mb-6 sm:tw-gap-4">

            <div className="tw-flex tw-h-12 tw-w-12 tw-shrink-0 tw-items-center tw-justify-center tw-rounded-2xl tw-bg-fintoo-orange/15 tw-text-2xl tw-text-fintoo-orange sm:tw-h-16 sm:tw-w-16 sm:tw-text-3xl">
              {services[active].icon}
            </div>

            <div>
              <h3 className="tw-m-0 tw-text-xl tw-font-bold tw-leading-snug tw-text-white sm:tw-text-2xl">
                {services[active].title}
              </h3>

              <p className="tw-mt-1 tw-text-xs tw-font-medium tw-uppercase tw-tracking-wide tw-text-fintoo-orange sm:tw-text-sm">
                {services[active].meta}
              </p>
            </div>

          </div>

          <p className="tw-text-sm tw-leading-7 tw-text-white/75 sm:tw-text-lg sm:tw-leading-8">
            {services[active].desc}
          </p>

          <div className="tw-mt-8 tw-flex tw-items-center tw-gap-2">
            {services.map((_, index) => (
              <button
                key={index}
                onClick={() => setActive(index)}
                className={`tw-h-2 tw-rounded-full tw-transition-all ${
                  active === index
                    ? "tw-w-10 tw-bg-fintoo-orange"
                    : "tw-w-2 tw-bg-white/25"
                }`}
              />
            ))}
          </div>

        </div>

      </div>

    </div>

    {/* floating stats */}
    

  </div>

</div>
      </div>
      </div>
    </section>
  );
}
