import React from "react";
import { MotionReveal, PlannerIcon, SectionHeader } from "./PlannerShared";

export default function ContactSection() {
  return (
    <section className="tw-bg-fintoo-blue tw-px-[8%] tw-py-[80px] max-md:tw-px-[5%] max-md:tw-py-[50px]" id="contact">
      <MotionReveal className="tw-max-w-[620px]">
        <SectionHeader
          tag="Book a Free Session"
          dark
          title={
            <>
              Speak with a Retirement
              <br />
              Advisor Today
            </>
          }
          subtitle="No sales pitch, no commitment. Just a 30-minute conversation that can change the trajectory of your retirement. Pick a slot that works for you."
        />
      </MotionReveal>

      <MotionReveal className="tw-mt-10" delay={70} y={18} scale={0.99} duration={520}>
        <div className="tw-overflow-hidden tw-rounded-[22px] tw-bg-white">
        <div className="tw-flex tw-min-h-[500px] tw-flex-col tw-items-center tw-justify-center tw-gap-4 tw-p-10 tw-text-center">
          <div className="tw-mb-2 tw-flex tw-h-[70px] tw-w-[70px] tw-items-center tw-justify-center tw-rounded-[20px] tw-bg-fintoo-blue/10 tw-text-fintoo-blue">
            <PlannerIcon type="calendar" className="tw-h-9 tw-w-9" />
          </div>
          <h3 className="tw-text-2xl tw-text-fintoo-blue">Schedule Your Free 30-Min Session</h3>
          <p className="tw-max-w-[420px] tw-text-base tw-text-slate-500">
            Our SEBI-registered retirement advisors are available 6 days a week. Choose a time that suits you best.
          </p>
          <a
            href="https://calendly.com/fintoo"
            target="_blank"
            rel="noreferrer"
            className="tw-inline-block tw-rounded-[10px] tw-bg-fintoo-orange tw-px-9 tw-py-[14px] tw-text-base tw-font-semibold tw-text-white hover:tw-brightness-95"
          >
            Book Free Appointment →
          </a>
          <p className="tw-mt-3 tw-text-xs tw-text-slate-500">No payment required · Cancel anytime · Confirmation sent instantly</p>
        </div>
        </div>
      </MotionReveal>
    </section>
  );
}
