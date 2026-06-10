import React from "react";
import { MotionReveal, PlannerLogo } from "./PlannerShared";

export default function FooterSection() {
  return (
    <footer className="tw-border-t tw-border-white/5 tw-bg-fintoo-blue tw-px-[8%] tw-pb-7 tw-pt-[50px] max-md:tw-px-[5%]">
      <MotionReveal className="tw-mb-9 tw-grid tw-gap-10 lg:tw-grid-cols-[2fr_1fr_1fr]" y={14} scale={0.995} duration={460}>
        <div>
          <PlannerLogo footer />
          <p className="tw-mt-3 tw-max-w-[280px] tw-text-sm tw-leading-[1.7] tw-text-white/40">
            India's most trusted SEBI-registered investment advisory platform. Helping 2 lakh+ families build wealth and plan for a secure retirement.
          </p>
        </div>

        <div>
          <h5 className="tw-mb-[14px] tw-text-xs tw-font-medium tw-uppercase tw-tracking-[1px] tw-text-white/40">Quick Links</h5>
          <div className="tw-flex tw-flex-col tw-gap-[9px]">
            <a href="#benefits" className="tw-text-sm tw-text-white/60 hover:tw-text-fintoo-orange">Benefits</a>
            <a href="#how-it-works" className="tw-text-sm tw-text-white/60 hover:tw-text-fintoo-orange">How It Works</a>
            <a href="#why-us" className="tw-text-sm tw-text-white/60 hover:tw-text-fintoo-orange">Why Fintoo</a>
            <a href="#contact" className="tw-text-sm tw-text-white/60 hover:tw-text-fintoo-orange">Book Appointment</a>
            <a href="#faq" className="tw-text-sm tw-text-white/60 hover:tw-text-fintoo-orange">FAQs</a>
          </div>
        </div>

        <div>
          <h5 className="tw-mb-[14px] tw-text-xs tw-font-medium tw-uppercase tw-tracking-[1px] tw-text-white/40">Contact</h5>
          <div className="tw-flex tw-flex-col tw-gap-[9px]">
            <a href="tel:+918069195050" className="tw-text-sm tw-text-white/60 hover:tw-text-fintoo-orange">+91 80691 95050</a>
            <a href="mailto:advisory@fintoo.in" className="tw-text-sm tw-text-white/60 hover:tw-text-fintoo-orange">advisory@fintoo.in</a>
            <p className="tw-text-sm tw-text-white/60">Mumbai · Pune · Bangalore · Delhi</p>
          </div>
        </div>
      </MotionReveal>

      <MotionReveal className="tw-flex tw-flex-col tw-gap-4 tw-border-t tw-border-white/10 tw-pt-[22px] md:tw-flex-row md:tw-items-center md:tw-justify-between" delay={80} y={10} scale={1} duration={420}>
        <p className="tw-text-xs tw-text-white/30">© 2025 Fintoo. All rights reserved. SEBI Reg. No. INA000015586</p>
        <div className="tw-w-fit tw-rounded-full tw-bg-white/5 tw-px-[14px] tw-py-[6px] tw-text-xs tw-text-white/40">SEBI Registered Investment Advisor</div>
      </MotionReveal>
    </footer>
  );
}
