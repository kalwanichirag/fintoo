import React from "react";
import { PlannerLogo } from "./PlannerShared";

export default function NavigationSection() {
  return (
    <nav className="tw-sticky tw-top-0 tw-z-[100] tw-flex tw-h-[68px] tw-items-center tw-justify-between tw-border-b tw-border-slate-200 tw-bg-white tw-px-[5%]">
      <PlannerLogo />
      <div className="tw-hidden tw-items-center tw-gap-7 md:tw-flex">
        <a href="#benefits" className="tw-text-[14px] tw-font-normal tw-text-slate-500 hover:tw-text-fintoo-blue">
          Benefits
        </a>
        <a href="#how-it-works" className="tw-text-[14px] tw-font-normal tw-text-slate-500 hover:tw-text-fintoo-blue">
          How It Works
        </a>
        <a href="#why-us" className="tw-text-[14px] tw-font-normal tw-text-slate-500 hover:tw-text-fintoo-blue">
          Why Fintoo
        </a>
        <a href="#faq" className="tw-text-[14px] tw-font-normal tw-text-slate-500 hover:tw-text-fintoo-blue">
          FAQs
        </a>
        <a
          href="#contact"
          className="tw-rounded-[8px] tw-bg-fintoo-orange tw-px-[22px] tw-py-[9px] tw-text-[14px] tw-font-medium tw-text-white hover:tw-brightness-95"
        >
          Talk to Advisor
        </a>
      </div>
    </nav>
  );
}
