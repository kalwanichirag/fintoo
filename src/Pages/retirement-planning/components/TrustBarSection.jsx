import React from "react";
import { MotionReveal, PlannerIcon } from "./PlannerShared";
import { trustItems } from "./plannerData";

export default function TrustBarSection() {
  return (
    <div className="tw-border-b tw-border-slate-200 tw-bg-slate-50 tw-px-[8%] tw-py-[18px]">
      <div className="tw-flex tw-flex-nowrap tw-items-center tw-gap-5 tw-overflow-x-auto md:tw-flex-wrap md:tw-justify-center md:tw-gap-12">
        {trustItems.map((item, index) => (
            <div className="tw-flex tw-items-center tw-gap-2 tw-whitespace-nowrap tw-text-sm tw-text-slate-500">
              <PlannerIcon type={item.icon} className="tw-h-4 tw-w-4 tw-text-fintoo-blue" />
              {item.label}
            </div>
        ))}
      </div>
    </div>
  );
}
