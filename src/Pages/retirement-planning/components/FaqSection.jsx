import React, { useState } from "react";
import { MotionReveal, SectionHeader } from "./PlannerShared";
import { faqs } from "./plannerData";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <section className="tw-bg-slate-50 tw-px-[8%] tw-py-[80px] max-md:tw-px-[5%] max-md:tw-py-[50px]" id="faq">
      <MotionReveal>
        <SectionHeader tag="FAQs" title="Frequently Asked Questions" centered />
      </MotionReveal>

      <div className="tw-mx-auto tw-mt-10 tw-max-w-[720px]">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <MotionReveal key={faq.question} delay={index * 40} y={10} scale={1} duration={420}>
              <div className="tw-border-b tw-border-slate-200">
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="tw-flex tw-w-full tw-items-center tw-justify-between tw-gap-4 tw-bg-transparent tw-px-4 tw-py-5 tw-text-left tw-text-base tw-font-medium tw-text-fintoo-blue"
                >
                  <span>{faq.question}</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`tw-h-5 tw-w-5 tw-shrink-0 tw-text-slate-500 tw-transition-transform ${isOpen ? "tw-rotate-45 tw-text-fintoo-orange" : ""}`}
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
                {isOpen ? <div className="tw-px-4 tw-pb-[18px] tw-text-sm tw-leading-[1.7] tw-text-slate-500">{faq.answer}</div> : null}
              </div>
            </MotionReveal>
          );
        })}
      </div>
    </section>
  );
}
