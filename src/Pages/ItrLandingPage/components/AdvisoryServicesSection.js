const serviceIconClass = "tw-h-6 tw-w-6";

const services = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className={serviceIconClass} aria-hidden="true">
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
      <svg viewBox="0 0 24 24" fill="none" className={serviceIconClass} aria-hidden="true">
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
      <svg viewBox="0 0 24 24" fill="none" className={serviceIconClass} aria-hidden="true">
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
      <svg viewBox="0 0 24 24" fill="none" className={serviceIconClass} aria-hidden="true">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4.8 9.5h14.4M4.8 14.5h14.4M12 4a14.5 14.5 0 0 1 0 16M12 4a14.5 14.5 0 0 0 0 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    title: "Global Tax Assistance",
    meta: "US Filing · Foreign Assets · FBAR",
    desc: "Expert help for international income, overseas assets, NRI status, and US tax filing obligations.",
  },
];

export default function AdvisoryServicesSection() {
  return (
    <section className="tw-relative tw-overflow-hidden  tw-px-4 tw-pb-16 md:tw-px-8 md:tw-py-24">
   
      <div className="tw-relative tw-mx-auto tw-max-w-7xl">
        <div className="tw-grid tw-gap-10 lg:tw-grid-cols-[0.82fr_1.18fr] lg:tw-items-end">
          <div>
            <div className="tw-mb-4 tw-inline-flex tw-items-center tw-gap-2 tw-rounded-full tw-border tw-border-solid tw-border-fintoo-orange/25 tw-bg-fintoo-orange/10 tw-px-4 tw-py-2 tw-text-xs tw-font-bold tw-uppercase tw-tracking-widest tw-text-fintoo-orange">
              Expert-Led Tax Desk
            </div>
            <h2 className="tw-m-0 tw-font-dmserif1 tw-text-4xl tw-font-black tw-leading-tight tw-text-fintoo-blue md:tw-text-6xl">
              Tax support for every complex income layer.
            </h2>
            <p className="tw-mt-5 tw-max-w-xl tw-text-base tw-leading-8 tw-text-fintoo-blue/65 md:tw-text-lg">
              From live filing to global disclosures, get structured advisory that treats your taxes like part of your financial life.
            </p>
          </div>

          <div className="tw-grid tw-gap-4 sm:tw-grid-cols-2">
            {services.map((service, index) => (
              <article
                key={service.title}
                className={`tw-group tw-relative tw-overflow-hidden tw-rounded-2xl tw-border tw-border-solid tw-border-white/10 tw-bg-white/[0.06] tw-p-5 tw-shadow-[0_24px_80px_rgba(0,0,0,0.22)] tw-backdrop-blur-xl tw-transition-all tw-duration-300 hover:-tw-translate-y-1 hover:tw-border-fintoo-orange/35 hover:tw-bg-white/[0.09]
                
                }`}
              >
           
                <div className="tw-relative">
                  <div className="tw-mb-5 tw-flex tw-items-center tw-gap-3">
                    <div className="tw-flex tw-h-12 tw-w-12 tw-shrink-0 tw-items-center tw-justify-center tw-rounded-xl tw-bg-fintoo-orange/15 tw-text-fintoo-orange">
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="tw-m-0 tw-text-xl tw-font-bold tw-leading-snug tw-text-fintoo-blue">
                        {service.title}
                      </h3>
                      <p className="tw-mb-0 tw-mt-1 tw-text-[11px]   tw-font-bold tw-uppercase tw-tracking-[0.16em] tw-text-fintoo-orange">
                        {service.meta}
                      </p>
                    </div>
                  </div>

                  <p className="tw-mb-0 tw-text-sm tw-leading-7 tw-text-fintoo-blue/60">
                    {service.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
