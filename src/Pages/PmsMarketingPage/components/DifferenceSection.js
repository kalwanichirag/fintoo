import React, { useState } from "react";
import { brandGreen, Container, Section } from "./shared";

export default function DifferenceSection() {
  const [active, setActive] = useState("risk");

  const fintooText =
    active === "risk"
      ? "Better risk management through dual expertise (PMS Manager + Mutual Fund Manager), guiding your portfolio."
      : active === "onboarding"
      ? "A guided onboarding flow with clear portfolio mapping, paperwork support, and transparent allocation."
      : active === "tax"
      ? "Strategies are planned with exit loads, holding periods, and tax efficiency in mind."
      : active === "fees"
      ? "Profit-linked fees keep incentives aligned and charge only when your strategy makes gains."
      : "A digital view helps you track portfolio movement and strategy updates in one place.";

  const traditionalText =
    active === "risk"
      ? "Higher risk due to dependency on a single manager in Stock PMS."
      : active === "onboarding"
      ? "Fragmented onboarding that leaves investors coordinating too many moving parts."
      : active === "tax"
      ? "Portfolio actions may optimise returns without enough attention to post-tax outcomes."
      : active === "fees"
      ? "Fixed fee models can charge regardless of portfolio performance."
      : "Updates often depend on periodic reports and manual advisor follow-ups.";

  const tabClass = (key) =>
    `tw-flex tw-w-full tw-items-center tw-justify-between tw-rounded-xl tw-border-0 tw-px-6 tw-py-4 tw-text-left tw-transition ${
      active === key ? "tw-bg-white tw-text-black" : "tw-bg-transparent tw-text-gray-500 hover:tw-bg-white/5 hover:tw-text-white"
    }`;

  return (
    <Section id="why" className="tw-py-24">
      <Container>
        <h2 className="tw-mx-auto tw-mb-16 tw-max-w-4xl tw-text-center tw-text-4xl tw-font-extrabold">
          How is Fintoo <span className="tw-italic" style={{ color: brandGreen }}>different</span> from other Wealth Managers?
        </h2>
        <div className="tw-grid tw-grid-cols-1 tw-items-center tw-justify-center tw-gap-8 lg:tw-grid-cols-12">
          <div className="tw-space-y-2 lg:tw-col-span-5">
            <button type="button" onClick={() => setActive("risk")} className={tabClass("risk")}><span className="tw-flex tw-items-center tw-gap-4"><i className="fa-solid fa-shield-halved" /> Risk Management</span><i className="fa-solid fa-chevron-right tw-text-xs tw-opacity-50" /></button>
            <button type="button" onClick={() => setActive("onboarding")} className={tabClass("onboarding")}><span className="tw-flex tw-items-center tw-gap-4"><i className="fa-solid fa-rocket" /> Onboarding</span><i className="fa-solid fa-chevron-right tw-text-xs tw-opacity-50" /></button>
            <button type="button" onClick={() => setActive("tax")} className={tabClass("tax")}><span className="tw-flex tw-items-center tw-gap-4"><i className="fa-solid fa-percent" /> Tax Efficiency</span><i className="fa-solid fa-chevron-right tw-text-xs tw-opacity-50" /></button>
            <button type="button" onClick={() => setActive("fees")} className={tabClass("fees")}><span className="tw-flex tw-items-center tw-gap-4"><i className="fa-solid fa-coins" /> Fees</span><i className="fa-solid fa-chevron-right tw-text-xs tw-opacity-50" /></button>
            <button type="button" onClick={() => setActive("tracking")} className={tabClass("tracking")}><span className="tw-flex tw-items-center tw-gap-4"><i className="fa-solid fa-chart-line" /> Realtime Tracking</span><i className="fa-solid fa-chevron-right tw-text-xs tw-opacity-50" /></button>
          </div>
          <div className="tw-rounded-3xl tw-border tw-border-solid tw-border-[#222] tw-bg-[#111] tw-p-8 md:tw-p-12 lg:tw-col-span-6">
            <p className="tw-m-0 tw-text-xs tw-font-bold tw-uppercase tw-tracking-widest" style={{ color: brandGreen }}>Fintoo ERS PMS</p>
            <p className="tw-mt-4 tw-text-lg tw-leading-relaxed tw-text-gray-300">{fintooText}</p>
            <div className="tw-relative tw-my-10 tw-flex tw-items-center tw-justify-center">
              <span className="tw-absolute tw-h-px tw-w-full tw-bg-white/15" />
              <span className="tw-relative tw-z-10 tw-flex tw-h-16 tw-w-16 tw-items-center tw-justify-center tw-rounded-full tw-border tw-border-solid tw-border-white/10 tw-bg-[#1f1f1f] tw-text-3xl tw-font-medium tw-text-white/60">VS</span>
            </div>
            <p className="tw-m-0 tw-text-xs tw-font-bold tw-uppercase tw-tracking-widest tw-text-gray-500">Traditional PMS</p>
            <p className="tw-mt-4 tw-text-lg tw-leading-relaxed tw-text-gray-500">{traditionalText}</p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
