import React from "react";

const rows = [
  ["Live Screen-Share Filing", "Go through every line item with your CA in real time.", ["✓", "45-Min Live Session", "yes"], ["✕", "Offline / Email-based", "no"], ["✕", "Fully Automated DIY", "no"]],
  ["ESOP & RSU Tax Optimization", "Navigating double taxation, vesting, and capital gains.", ["✓", "Expert Equity Advisory", "yes"], ["~", "Varies by CA", "partial"], ["✕", "No Custom Advice", "no"]],
  ["Global Income & Schedule FA", "Accurate foreign asset disclosure & DTAA compliance.", ["✓", "Full Disclosures Handled", "yes"], ["~", "Prone to omissions", "partial"], ["✕", "High risk of notices", "no"]],
  ["Fee-Only Structure", "Strictly zero commission from investment products.", ["✓", "100% Conflict-Free", "yes"], ["✕", "Often sells products", "no"], ["✕", "Upsells loans/insurances", "no"]],
  ["Year-Round Proactive Review", "Advance tax updates and planning calls every quarter.", ["✓", "Continuous Advisory", "yes"], ["✕", "Only at tax deadline", "no"], ["✕", "One-time tool access", "no"]],
];

const columns = ["Fintoo Structured Advisory", "Traditional CAs", "DIY Tax Portals"];

function Status({ data }) {
  const [icon, text, type] = data;
  const styles = {
    yes: "tw-bg-[#2d8a4e]/10 tw-text-[#2d8a4e]",
    no: "tw-bg-[#c53333]/10 tw-text-[#c53333]",
    partial: "tw-bg-fintoo-orange/10 tw-text-fintoo-orange",
  };
  return (
    <div className="tw-flex tw-items-center tw-gap-2">
      <span className={`tw-flex tw-h-5 tw-w-5 tw-shrink-0 tw-items-center tw-justify-center tw-rounded-full tw-text-xs tw-font-bold ${styles[type]}`}>{icon}</span>
      <span className="tw-text-sm tw-font-semibold tw-leading-snug tw-text-fintoo-blue">{text}</span>
    </div>
  );
}

export default function ComparisonSection() {
  return (
    <section id="comparison" className="tw-bg-[#fdf9f3] tw-px-4 tw-py-14 md:tw-px-8 md:tw-py-24">
      <div className="tw-mx-auto tw-max-w-7xl">
        <div className="tw-mx-auto tw-mb-8 tw-max-w-3xl tw-text-center md:tw-mb-12">
          <div className="tw-mb-3 tw-inline-flex tw-items-center tw-gap-2 tw-text-xs tw-font-bold tw-uppercase tw-text-fintoo-orange md:tw-mb-4">
            <span className="tw-h-0.5 tw-w-5 tw-bg-fintoo-orange" />
            How We Compare
          </div>
          <h2 className="tw-font-dmserif1 tw-text-3xl tw-font-black tw-leading-tight tw-text-fintoo-blue md:tw-text-5xl">
            Choose the right path
            <br />
            for your taxes.
          </h2>
          <p className="tw-mx-auto tw-mt-3 tw-max-w-2xl tw-text-sm tw-leading-6 tw-text-fintoo-blue/60 md:tw-mt-4 md:tw-text-base md:tw-leading-8">
            Why corporate professionals with stock options, global assets, and multi-source incomes trust Fintoo over
            traditional options.
          </p>
        </div>

        <div className="tw-mb-3 tw-flex tw-items-center tw-justify-between tw-gap-3 tw-rounded-xl tw-bg-white tw-px-4 tw-py-3 tw-text-xs tw-font-bold tw-uppercase tw-text-fintoo-blue/60 tw-shadow-sm md:tw-hidden">
          <span>Comparison Table</span>
          <span className="tw-text-fintoo-orange">Swipe to compare</span>
        </div>

        <div className="tw-overflow-x-auto tw-rounded-2xl tw-border tw-border-solid tw-border-fintoo-blue/10 tw-bg-white tw-shadow-xl">
          <table className="tw-w-full tw-min-w-[43rem] tw-border-collapse tw-text-left md:tw-min-w-max">
            <thead>
              <tr>
                {["Features & Capabilities", ...columns].map((head, index) => (
                  <th
                    key={head}
                    className={`tw-border-0 tw-border-b tw-border-solid tw-border-fintoo-blue/10 tw-p-4 tw-font-dmserif1 tw-text-base tw-font-bold tw-text-fintoo-blue md:tw-p-6 md:tw-text-lg ${
                      index === 0 ? "tw-sticky tw-left-0 tw-z-20 tw-bg-white" : ""
                    } ${
                      index === 1
                        ? "tw-border-x tw-border-fintoo-orange/15 tw-border-t-4 tw-border-t-fintoo-orange tw-bg-fintoo-orange/[0.03] tw-text-fintoo-orange"
                        : ""
                    }`}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([feature, desc, fintoo, ca, diy]) => (
                <tr key={feature}>
                  <td className="tw-sticky tw-left-0 tw-z-10 tw-w-56 tw-border-0 tw-border-b tw-border-solid tw-border-fintoo-blue/10 tw-bg-white tw-p-4 md:tw-w-auto md:tw-p-6">
                    <div className="tw-text-sm tw-font-bold tw-text-fintoo-blue">{feature}</div>
                    <span className="tw-mt-1 tw-block tw-text-xs tw-font-normal tw-text-fintoo-blue/50">{desc}</span>
                  </td>
                  {[fintoo, ca, diy].map((status, index) => (
                    <td key={index} className={`tw-w-52 tw-border-0 tw-border-b tw-border-solid tw-border-fintoo-blue/10 tw-p-4 md:tw-w-auto md:tw-p-6 ${index === 0 ? "tw-border-x tw-border-fintoo-orange/15 tw-bg-fintoo-orange/[0.03]" : ""}`}>
                      <Status data={status} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
