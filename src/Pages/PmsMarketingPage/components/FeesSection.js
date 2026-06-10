import React from "react";
import { brandGreen, Container, CTAButton, Section } from "./shared";

export default function FeesSection() {
  return (
    <Section id="fees" className="tw-py-24">
      <Container className="tw-grid tw-grid-cols-1 tw-items-center tw-gap-16 lg:tw-grid-cols-2">
        <div className="tw-space-y-8">
          <h2 className="tw-m-0 tw-text-4xl tw-font-extrabold tw-leading-tight">
            Only Pay for the
            <br />
            <span className="tw-underline tw-decoration-1 tw-underline-offset-8" style={{ color: brandGreen }}>Profits You Make</span>
          </h2>
          <CTAButton className="tw-px-8 tw-py-4">Schedule an expert call</CTAButton>
        </div>
        <div className="tw-space-y-12">
          <div className="tw-relative tw-rounded-3xl tw-border tw-border-solid tw-border-[#222] tw-bg-[#111] tw-p-8">
            <div className="tw-absolute -tw-top-4 tw-left-8 tw-rounded-full tw-bg-[#94bc63] tw-px-4 tw-py-1 tw-text-[10px] tw-font-bold tw-uppercase tw-text-black">Profit Sharing Plan</div>
            <h3 className="tw-mb-4 tw-mt-0 tw-text-2xl tw-font-bold">Fintoo charges <span style={{ color: brandGreen }}>upto 10%</span> of profits as fees for ERS strategy.</h3>
            <p className="tw-text-sm tw-text-gray-400">We charge fees on same profit only once.</p>
            <div className="tw-mt-8 tw-flex tw-items-center tw-justify-between tw-border-0 tw-border-t tw-border-solid tw-border-white/10 tw-pt-8">
              <div className="tw-text-xs tw-uppercase tw-tracking-widest tw-text-gray-500">VS</div>
              <div className="tw-text-right">
                <p className="tw-mb-2 tw-text-xs tw-font-bold tw-uppercase tw-text-gray-400">Fixed Fee Plan</p>
                <p className="tw-m-0 tw-text-sm tw-text-gray-400">Pay a standard fixed fee of <span className="tw-text-white">1% of your portfolio</span></p>
              </div>
            </div>
          </div>
          <div className="tw-text-center">
            <a href="#offerings" className="tw-border-0 tw-border-b tw-border-solid tw-border-white/30 tw-pb-1 tw-text-sm tw-font-medium tw-text-white tw-no-underline hover:tw-border-white">See how it works</a>
          </div>
        </div>
      </Container>
    </Section>
  );
}
