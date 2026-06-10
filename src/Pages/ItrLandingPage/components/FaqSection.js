import React, { useState } from "react";

const faqs = [
  ["Is my financial data secure with Fintoo?", "Yes, absolutely. We treat data privacy and security with the highest standards. Fintoo is SEBI Registered (INA000020031), compliant with strict regulatory guidelines. All your files, Form 16, and statements are processed through bank-grade 256-bit encryption and never shared with any third party."],
  ["What documents do I need for my tax review?", "For a complete and optimal tax strategy, we typically need your Form 16, capital gains statements from your brokerages, ESOP/RSU vesting and sale reports, and foreign assets details for Schedule FA filing."],
  ["How is Fintoo different from a local CA or online filing portals?", "Unlike DIY portals that automate filing without strategic depth, Fintoo offers expert CA-led advisory specialized in corporate remuneration structures including ESOPs, RSUs and global earnings."],
  ["Are there any hidden fees or commission-based product sales?", "No. Fintoo is a fee-only advisory. We earn from transparent, upfront fees for filing and advisory services, with zero commission from product recommendations."],
];

export default function FaqSection() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="tw-bg-[#f8f6f1] tw-px-4 tw-py-24 md:tw-px-8">
      <div className="tw-mx-auto tw-max-w-7xl">
        <div className="tw-mx-auto tw-mb-12 tw-max-w-3xl tw-text-center">
          <div className="tw-mb-4 tw-inline-flex tw-items-center tw-gap-2 tw-text-xs tw-font-bold tw-uppercase tw-text-fintoo-orange">
            <span className="tw-h-0.5 tw-w-5 tw-bg-fintoo-orange" />
            Common Questions
          </div>
          <h2 className="tw-font-dmserif1 tw-text-4xl tw-font-black tw-leading-tight tw-text-fintoo-blue md:tw-text-5xl">
            Got questions?
            <br />
            We have answers.
          </h2>
          <p className="tw-mx-auto tw-mt-4 tw-max-w-2xl tw-text-base tw-leading-8 tw-text-fintoo-blue/50">
            Clear, honest details about how Fintoo Advisory works for corporate professionals.
          </p>
        </div>
        <div className="tw-mx-auto tw-grid tw-max-w-3xl tw-gap-4">
          {faqs.map(([question, answer], index) => {
            const active = open === index;
            return (
              <div key={question} className={`tw-overflow-hidden tw-rounded-2xl tw-border tw-border-solid tw-bg-white tw-transition-all ${active ? "tw-border-fintoo-orange/30 tw-shadow-xl" : "tw-border-fintoo-blue/10"}`}>
                <button type="button" onClick={() => setOpen(active ? -1 : index)} className="tw-flex tw-w-full tw-items-center tw-justify-between tw-bg-transparent tw-p-6 tw-text-left">
                  <h3 className="tw-m-0 tw-font-dmserif1 tw-text-lg tw-font-bold tw-text-fintoo-blue">{question}</h3>
                  <span className={`tw-flex tw-h-6 tw-w-6 tw-items-center tw-justify-center tw-rounded-full tw-bg-fintoo-blue/5 tw-text-sm tw-font-bold tw-transition ${active ? "tw-rotate-45 tw-text-fintoo-orange" : "tw-text-fintoo-blue"}`}>+</span>
                </button>
                {active ? <div className="tw-px-6 tw-pb-6 tw-text-sm tw-leading-7 tw-text-fintoo-blue/50">{answer}</div> : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
