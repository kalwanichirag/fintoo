import React from "react";
import { Container, Section, brandGreen } from "./shared";

export default function ChallengesSection() {
  return (
    <Section id="challenges" className="pms-challenges tw-relative tw-overflow-hidden tw-py-24">
      <Container className="tw-grid tw-grid-cols-1 tw-items-center tw-gap-16 lg:tw-grid-cols-2">
        <div className="tw-relative tw-z-10 tw-space-y-8">
          <div className="tw-flex tw-items-center tw-gap-4">
            <div className="tw-relative">
              <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg" alt="Client" className="tw-h-16 tw-w-16 tw-rounded-full tw-border-2 tw-border-solid tw-border-lime-400 tw-object-cover" />
              <span className="tw-absolute tw-inset-0 tw-rounded-full tw-border tw-border-solid tw-border-lime-400 tw-opacity-30 tw-animate-ping" />
            </div>
            <div className="tw-rounded-2xl tw-rounded-bl-none tw-bg-lime-400 tw-p-3 tw-text-black">
              <i className="fa-solid fa-message" />
            </div>
          </div>
          <h2 className="tw-m-0 tw-text-4xl tw-font-bold tw-leading-tight md:tw-text-6xl">
            Challenges <span style={{ color: brandGreen }} >5000+</span> users had before they became our clients
          </h2>
          <a href="#start" className="tw-inline-flex tw-items-center tw-gap-3 tw-rounded-full tw-bg-white tw-px-8 tw-py-4 tw-font-semibold tw-text-black tw-no-underline hover:tw-bg-lime-400">
            Talk to us <i className="fa-solid fa-arrow-right" />
          </a>
        </div>
        <div className="tw-relative tw-z-10 tw-flex tw-min-h-[440px] tw-items-center tw-justify-center tw-overflow-hidden">
          <div className="tw-absolute tw-h-[500px] tw-w-[500px] tw-rounded-full tw-bg-lime-400/10 tw-blur-3xl" />
          <div className="tw-relative tw-flex tw-flex-wrap tw-justify-center tw-gap-4">
            <span className="pms-float-pill tw-whitespace-nowrap tw-rounded-full tw-border tw-border-solid tw-border-white/10 tw-bg-white/[0.03] tw-px-5 tw-py-3 tw-text-sm tw-text-white/70 tw-backdrop-blur-xl">"I do not have the time"</span>
            <span className="pms-float-pill tw-whitespace-nowrap tw-rounded-full tw-border tw-border-solid tw-border-lime-400/30 tw-bg-lime-400/10 tw-px-5 tw-py-3 tw-text-sm tw-text-white tw-backdrop-blur-xl" style={{ animationDelay: ".2s" }}>"My portfolio is not performing well"</span>
            <span className="pms-float-pill tw-whitespace-nowrap tw-rounded-full tw-border tw-border-solid tw-border-white/10 tw-bg-white/[0.03] tw-px-5 tw-py-3 tw-text-sm tw-text-white/70 tw-backdrop-blur-xl" style={{ animationDelay: ".4s" }}>"Disappointed with my advisor"</span>
            <span className="pms-float-pill tw-whitespace-nowrap tw-rounded-full tw-border tw-border-solid tw-border-white/10 tw-bg-white/[0.03] tw-px-5 tw-py-3 tw-text-sm tw-text-white/70 tw-backdrop-blur-xl" style={{ animationDelay: ".6s" }}>"My investments are too complex to manage alone"</span>
            <span className="pms-float-pill tw-whitespace-nowrap tw-rounded-full tw-border tw-border-solid tw-border-white/10 tw-bg-white/[0.03] tw-px-5 tw-py-3 tw-text-sm tw-text-white/70 tw-backdrop-blur-xl" style={{ animationDelay: ".8s" }}>"Curious about new investment options"</span>
            <span className="pms-float-pill tw-whitespace-nowrap tw-rounded-full tw-border tw-border-solid tw-border-white/10 tw-bg-white/[0.03] tw-px-5 tw-py-3 tw-text-sm tw-text-white/70 tw-backdrop-blur-xl" style={{ animationDelay: "1s" }}>"Looking for tax optimisation"</span>
            <span className="pms-float-pill tw-whitespace-nowrap tw-rounded-full tw-border tw-border-solid tw-border-white/10 tw-bg-white/[0.03] tw-px-5 tw-py-3 tw-text-sm tw-text-white/70 tw-backdrop-blur-xl" style={{ animationDelay: "1.2s" }}>"Nearing retirement age"</span>
            <span className="pms-float-pill tw-whitespace-nowrap tw-rounded-full tw-border tw-border-solid tw-border-white/10 tw-bg-white/[0.03] tw-px-5 tw-py-3 tw-text-sm tw-text-white/70 tw-backdrop-blur-xl" style={{ animationDelay: "1.4s" }}>"Planning for my child's future"</span>
          </div>
        </div>
      </Container>
    </Section>
  );
}
