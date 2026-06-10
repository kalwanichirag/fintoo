import React, { useState } from "react";
import { Section } from "./shared";

export default function FaqSection() {
  const [open, setOpen] = useState(0);

  return (
    <Section id="faqs" className="tw-py-24">
      <div className="tw-mx-auto tw-max-w-4xl tw-px-4 md:tw-px-8">
        <h2 className="tw-mb-16 tw-text-center tw-text-4xl tw-font-extrabold">Frequently asked questions</h2>
        <FaqItem index={0} open={open} setOpen={setOpen} question="What are the returns of the Fintoo ERS PMS strategy?" />
        <FaqItem index={1} open={open} setOpen={setOpen} question="What exactly are Portfolio Management Services (PMS), and how can Fintoo help me?" />
        <FaqItem index={2} open={open} setOpen={setOpen} question="How does Fintoo's PMS differ from standard mutual fund investments?" />
        <FaqItem index={3} open={open} setOpen={setOpen} question="What is Fintoo Equity Revival Strategy, and what results can I expect?" />
        <FaqItem index={4} open={open} setOpen={setOpen} question="What type of investor is best suited for Fintoo's PMS, and what's the minimum investment?" />
      </div>
    </Section>
  );
}

function FaqItem({ index, open, setOpen, question }) {
  const isOpen = open === index;

  return (
    <div className="tw-border-0 tw-border-b tw-border-solid tw-border-[#333]">
      <button type="button" onClick={() => setOpen(isOpen ? -1 : index)} className="tw-flex tw-w-full tw-items-center tw-justify-between tw-border-0 tw-bg-transparent tw-py-6 tw-text-left tw-text-white">
        <span className="tw-text-lg tw-font-medium">{question}</span>
        <i className={`fa-solid ${isOpen ? "fa-minus" : "fa-plus"} tw-text-gray-500`} />
      </button>
      {isOpen && (
        <p className="tw-mt-0 tw-max-w-3xl tw-pb-6 tw-text-sm tw-leading-relaxed tw-text-gray-400">
          Fintoo's team evaluates your goals, risk appetite, and current portfolio before recommending a PMS strategy. Exact outcomes depend on market conditions and the selected strategy.
        </p>
      )}
    </div>
  );
}
