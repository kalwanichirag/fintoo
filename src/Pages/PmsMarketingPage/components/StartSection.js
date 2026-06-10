import React from "react";
import { brandGreen, Container, Section } from "./shared";
import LandingPageOtp from "../../../components/landingpagesOtp/LandingPageOtp";

export default function StartSection() {
  return (
    <Section id="start" className="tw-bg-[#111] tw-py-24">
      <Container className="tw-space-y-12 tw-text-center">
        <div className="tw-space-y-4">
          <h2 className="tw-m-0 tw-text-4xl tw-font-extrabold">Get started with your <span style={{ color: brandGreen }}>investment journey with Fintoo</span></h2>
          <p className="tw-m-0 tw-text-gray-400">Minimum Investment: ₹50 Lakhs</p>
        </div>
        <div className="tw-max-w-2xl tw-mx-auto tw-space-y-6">
                <LandingPageOtp  variant='minimal' pageName="Personal Financial Planning" calendlyurl={"https://calendly.com/d/2zt-z8p-34k/15-min-consultation-call-financial-planning?hide_event_type_details=1"}/>

        </div>
      </Container>
    </Section>
  );
}
