import React from "react";
import { brandGreen, Container, CTAButton, Section } from "./shared";

export default function ReturnsSection() {
  return (
    <Section id="returns" className="tw-py-24">
      <Container className="tw-grid tw-grid-cols-1 tw-items-center tw-gap-16 lg:tw-grid-cols-2">
        <div className="tw-space-y-8">
          <h2 className="tw-m-0 tw-text-4xl tw-font-extrabold tw-leading-tight">
            Our flagship PMS strategy delivered <span style={{ color: brandGreen }}>higher returns</span> than market
          </h2>
          <CTAButton className="tw-px-8 tw-py-4">Schedule an expert call</CTAButton>
        </div>
        <div className="tw-rounded-3xl tw-border tw-border-solid tw-border-[#222] tw-bg-[#111] tw-p-6">
          <div className="tw-flex tw-h-[350px] tw-items-end tw-justify-center tw-gap-12 tw-border-0 tw-border-b tw-border-solid tw-border-white/10 tw-pb-8">
            <div className="tw-flex tw-h-full tw-w-28 tw-flex-col tw-justify-end tw-text-center">
              <p className="tw-mb-3 tw-text-lg tw-font-bold">+4.67%</p>
              <div className="tw-mx-auto tw-h-[196px] tw-w-20 tw-rounded-t-2xl tw-bg-[#333]" />
              <p className="tw-mt-4 tw-text-xs tw-font-bold tw-text-gray-500">Benchmark</p>
            </div>
            <div className="tw-flex tw-h-full tw-w-28 tw-flex-col tw-justify-end tw-text-center">
              <p className="tw-mb-3 tw-text-lg tw-font-bold">+5.47%</p>
              <div className="tw-mx-auto tw-h-[230px] tw-w-20 tw-rounded-t-2xl tw-bg-[#94bc63]" />
              <p className="tw-mt-4 tw-text-xs tw-font-bold tw-text-gray-500">Fintoo ERS PMS</p>
            </div>
          </div>
          <div className="tw-mt-6 tw-flex tw-flex-wrap tw-justify-center tw-gap-3">
            <button type="button" className="tw-rounded-full tw-border tw-border-solid tw-border-white/10 tw-bg-transparent tw-px-4 tw-py-1.5 tw-text-xs tw-font-bold tw-text-gray-500 hover:tw-text-white">1M</button>
            <button type="button" className="tw-rounded-full tw-border tw-border-solid tw-border-white/10 tw-bg-transparent tw-px-4 tw-py-1.5 tw-text-xs tw-font-bold tw-text-gray-500 hover:tw-text-white">3M</button>
            <button type="button" className="tw-rounded-full tw-border tw-border-solid tw-border-white/10 tw-bg-transparent tw-px-4 tw-py-1.5 tw-text-xs tw-font-bold tw-text-gray-500 hover:tw-text-white">6M</button>
            <button type="button" className="tw-rounded-full tw-border tw-border-solid tw-border-white/10 tw-bg-transparent tw-px-4 tw-py-1.5 tw-text-xs tw-font-bold tw-text-gray-500 hover:tw-text-white">1Y</button>
            <button type="button" className="tw-rounded-full tw-border tw-border-solid tw-border-white/10 tw-bg-[#94bc63] tw-px-4 tw-py-1.5 tw-text-xs tw-font-bold tw-text-black">2Y</button>
            <button type="button" className="tw-rounded-full tw-border tw-border-solid tw-border-white/10 tw-bg-transparent tw-px-4 tw-py-1.5 tw-text-xs tw-font-bold tw-text-gray-500 hover:tw-text-white">Inception</button>
          </div>
          <p className="tw-mt-4 tw-text-center tw-text-[10px] tw-text-gray-600">As of 30th April, 2026 | ERS Factsheet</p>
        </div>
      </Container>
    </Section>
  );
}
