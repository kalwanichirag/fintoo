import React from "react";
import { MotionReveal, PlannerIcon, SectionHeader } from "./PlannerShared";
import { chartData, whyPoints } from "./plannerData";

export default function WhyItMattersSection() {
  return (
    <section className="tw-px-[8%] tw-bg-slate-50 tw-py-[80px] max-md:tw-px-[5%] max-md:tw-py-[50px]">
      <MotionReveal>
        <SectionHeader
          tag="Why It Matters"
          title={
            <>
              The Cost of Waiting
              <br />
              Even 5 Years Is Enormous
            </>
          }
          subtitle="Inflation silently erodes your savings. The earlier you start planning, the less you need to save each month for the same comfortable retirement."
        />
      </MotionReveal>

      <div className="tw-mt-[50px] tw-grid tw-gap-10 lg:tw-grid-cols-2 lg:tw-items-center">
        <MotionReveal className="tw-relative" delay={60} y={18} scale={0.99} duration={520}>
          <div className="tw-relative tw-overflow-hidden tw-rounded-[22px] tw-bg-fintoo-blue tw-p-9 tw-text-white">
          <div className="tw-mb-[30px] tw-text-center">
            <div className="tw-text-sm tw-text-white/80 tw-mb-3">Corpus needed at age 60 (₹50k/month expenses)</div>
            <div className="tw-text-5xl tw-text-fintoo-orange tw-mb-3 tw-font-bold">₹3.2 Crore</div>
            <div className="tw-mt-1 tw-text-sm tw-text-white/80 tw-mb-3">Monthly SIP starting age 30 → ₹18,500 | Age 40 → ₹52,000</div>
          </div>

          <div className="tw-flex tw-h-[120px] tw-mt-16 tw-items-end tw-gap-[10px]">
            {chartData.map((item) => (
              <div key={item.label} className="tw-flex tw-flex-1 tw-flex-col tw-items-center tw-gap-[6px]">
                <div className="tw-text-xs tw-font-medium tw-text-white">{item.value}</div>
                <div className="tw-w-full tw-rounded-t-[5px]" style={{ height: item.height, background: item.color }} />
                <div className="tw-text-center tw-text-xs tw-text-white">{item.label}</div>
              </div>
            ))}
          </div>
          {/* Hover Disclaimer */}
<div className="tw-absolute tw-right-5 tw-top-5 tw-group">
  <div className="tw-flex tw-h-6 tw-w-6 tw-cursor-pointer tw-items-center tw-justify-center tw-rounded-full tw-bg-white/15 tw-text-xs tw-font-semibold tw-text-white transition-all duration-200 hover:tw-bg-white/25">
    i
  </div>

  <div className="tw-pointer-events-none tw-absolute tw-right-0 tw-top-9 tw-z-20 tw-w-[240px] tw-rounded-xl tw-bg-white tw-p-3 tw-text-[11px] tw-leading-[1.5] tw-text-slate-600 tw-opacity-0 tw-shadow-xl tw-transition-all tw-duration-200 group-hover:tw-opacity-100">
    SIP values are rough estimates and may vary based on market returns,
    inflation, and investment performance.
  </div>
</div>
          </div>
        </MotionReveal>

        <div className="tw-flex tw-flex-col tw-gap-[22px]">
          {whyPoints.map((point, index) => (
            <MotionReveal key={point.title} delay={90 + index * 55} y={14} scale={0.995} duration={460}>
              <div className="tw-flex tw-items-start tw-gap-4">
                <div className="tw-flex tw-h-11 tw-w-11 tw-min-w-11 tw-items-center tw-justify-center tw-rounded-xl tw-bg-fintoo-blue/10 tw-text-fintoo-blue">
                  <PlannerIcon type={point.icon} />
                </div>
                <div>
                  <h4 className="tw-mb-1 tw-mt-0 tw-text-base tw-font-semibold tw-text-fintoo-blue">{point.title}</h4>
                  <p className="tw-text-sm tw-leading-[1.6] tw-text-slate-500">{point.text}</p>
                </div>
              </div>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
