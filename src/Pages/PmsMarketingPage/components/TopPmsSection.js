import React from "react";
import { brandGreen, Container, CTAButton, Section } from "./shared";

export default function TopPmsSection() {
  return (
    <Section className="tw-py-20">
      <Container>
        <div className="tw-mb-12 tw-flex tw-flex-col tw-items-start tw-justify-between tw-gap-6 md:tw-flex-row md:tw-items-center">
          <h2 className="tw-m-0 tw-text-3xl tw-font-bold">
            Fintoo is one of the <span className="tw-underline tw-decoration-1 tw-underline-offset-8" style={{ color: brandGreen }}>top PMS</span> in India
          </h2>
          <CTAButton />
        </div>
        <div className="tw-overflow-x-auto">
          <table className="tw-w-full tw-border-collapse tw-text-left">
            <thead>
              <tr className="tw-border-0 tw-border-b tw-border-solid tw-border-white/10 tw-text-sm tw-text-gray-500">
                <th className="tw-py-4 tw-font-medium">S.No</th>
                <th className="tw-py-4 tw-font-medium">Name</th>
                <th className="tw-py-4 tw-font-medium">AUM</th>
              </tr>
            </thead>
            <tbody className="tw-text-gray-300">
              <tr className="tw-border-0 tw-border-b tw-border-solid tw-border-white/10">
                <td className="tw-py-6">1</td>
                <td className="tw-py-6">360 One Portfolio Managers Limited (Formerly Known As IIFL Wealth)</td>
                <td className="tw-py-6 tw-font-semibold">₹36,899.81 Cr</td>
              </tr>
              <tr className="tw-border-0 tw-border-b tw-border-solid tw-border-white/10 tw-bg-white/5 tw-text-white">
                <td className="tw-py-6">13</td>
                <td className="tw-py-6 tw-font-bold">Fintoo Investments Private Limited</td>
                <td className="tw-py-6 tw-font-bold">₹11,571.31 Cr</td>
              </tr>
              <tr className="tw-border-0 tw-border-b tw-border-solid tw-border-white/10">
                <td className="tw-py-6">15</td>
                <td className="tw-py-6">Carnelian Asset Management & Advisors Pvt Ltd</td>
                <td className="tw-py-6 tw-font-semibold">₹9,256.38 Cr</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="tw-mt-8 tw-space-y-2 tw-text-xs tw-text-gray-500">
          <p>Source <span className="tw-text-white tw-underline">APMI</span>: As of 31st January 2026</p>
          <p>Also, <span className="tw-text-white tw-underline">Motilal Oswal</span> ranked Fintoo among the Top 10 PMS providers in India by Total AUM, after excluding EPFO and corporate AUM and clients.</p>
        </div>
      </Container>
    </Section>
  );
}
