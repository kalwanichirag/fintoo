import React from "react";

const metrics = [
  ["₹5K Cr+", "Assets Under Tracking"],
  ["25,000+", "Employees Advised"],
  ["100+", "Corporate Tie-Ups"],
  ["Top 3", "Financial Advisory Firm"],
];

export default function MetricsSection() {
  return (
    <section className="tw-border-0 tw-border-y tw-border-solid tw-border-white/10 tw-bg-[#021d44] tw-px-[5%] tw-py-20">
      <div className="tw-mx-auto tw-grid tw-max-w-7xl tw-grid-cols-2 tw-gap-10 lg:tw-grid-cols-4">
        {metrics.map(([num, label]) => (
          <div key={label} className="tw-text-center">
            <div className="tw-bg-[linear-gradient(135deg,#ffffff_30%,#dd7300_100%)] tw-bg-clip-text tw-font-dmserif1 tw-text-4xl tw-font-black tw-leading-none tw-text-transparent md:tw-text-[52px]">
              {num}
            </div>
            <div className="tw-mt-2 tw-text-sm tw-font-semibold tw-uppercase tw-text-white/65">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
