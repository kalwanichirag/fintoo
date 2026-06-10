import React from "react";

const companies = ["Google", "Amazon", "Microsoft", "NVIDIA", "Broadcom", "TCS", "Accenture", "Swiggy"];

export default function MarqueeSection() {
  return (
    <div className="tw-overflow-hidden tw-border-0 tw-border-y tw-border-solid tw-border-white/10 tw-bg-fintoo-blue tw-py-4">
      <div className="tw-flex tw-w-max tw-animate-marquee tw-whitespace-nowrap">
        {[...companies, ...companies, ...companies].map((company, index) => (
          <div
            key={`${company}-${index}`}
            className="tw-mx-10 tw-flex tw-h-8 tw-items-center  tw-uppercase tw-text-sm tw-font-semibold tw-tracking-wide tw-text-white/85 hover:tw-text-white tw-transition"
          >
            {company}
          </div>
        ))}
      </div>
    </div>
  );
}
