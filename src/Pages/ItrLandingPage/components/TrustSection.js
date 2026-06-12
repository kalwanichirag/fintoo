import React from "react";

const testimonials = [
  ["MS", "Manish Sunthwal", "Sr. Technical Program Manager, Amazon", "Confidence and clarity - tailored strategies, not products. "],
  ["SG", "Swapnil Gupta", "VP Engineering, Xpress Bees", "Holistic, well-rounded inputs - always aligned to my goals. "],
  ["ST", "Satish Thakur", "VP Engineering, Swiggy", "Complete transparency and a genuine personal touch. "],
];

export default function TrustSection() {
  return (
    <section id="testimonials" className="tw-bg-[#fdf9f3] tw-px-4 tw-py-24 md:tw-px-8">
      <div className="tw-mx-auto tw-max-w-7xl">
        <div className="tw-mb-4 tw-flex tw-items-center tw-gap-2 tw-text-xs tw-font-bold tw-uppercase tw-text-fintoo-orange">
          <span className="tw-h-0.5 tw-w-5 tw-bg-fintoo-orange" />
          Trusted By
        </div>
        <h2 className=" tw-text-4xl tw-font-black tw-leading-tight tw-text-fintoo-blue md:tw-text-5xl">
          Professionals from
          <br />
          the world's best companies.
        </h2>
        
        <div className="tw-grid tw-grid-cols-1 tw-gap-6 md:tw-grid-cols-3 mt-4">
          {testimonials.map(([initials, name, role, quote]) => (
            <article key={name} className="tw-relative tw-overflow-hidden tw-rounded-2xl tw-border tw-border-solid tw-border-fintoo-blue/10 tw-bg-white tw-p-8 tw-transition hover:-tw-translate-y-1 hover:tw-shadow-2xl">
              <div className="tw-mb-4 tw-flex tw-gap-1 tw-text-sm tw-text-fintoo-orange">★★★★★</div>
              <blockquote className="tw-m-0 tw-text-base tw-italic tw-leading-7 tw-text-fintoo-blue">"{quote}"</blockquote>
              <div className="tw-mt-6 tw-flex tw-items-center tw-gap-3">
                <div className="tw-flex tw-h-11 tw-w-11 tw-items-center tw-justify-center tw-rounded-full tw-bg-[linear-gradient(135deg,#083880,#042b62)] tw-font-dmserif tw-text-base tw-font-bold tw-text-white">
                  {initials}
                </div>
                <div>
                  <div className="tw-text-sm tw-font-bold tw-text-fintoo-blue">{name}</div>
                  <div className="tw-text-xs tw-text-fintoo-blue/50">{role}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
        
      </div>
    </section>
  );
}
