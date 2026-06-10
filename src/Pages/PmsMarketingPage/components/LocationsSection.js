import React from "react";
import { Container, CTAButton, Section } from "./shared";

export default function LocationsSection() {
  return (
    <Section id="locations" className="tw-overflow-hidden tw-py-24">
      <Container className="tw-grid tw-grid-cols-1 tw-items-center tw-gap-16 lg:tw-grid-cols-2">
        <div className="tw-space-y-8">
          <h2 className="tw-m-0 tw-text-5xl tw-font-extrabold tw-leading-tight">Come visit us at any of our offices</h2>
          <CTAButton className="tw-px-8 tw-py-4">Schedule an expert call</CTAButton>
        </div>
        <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/TPXgOMVZTdXq8fZkCjQzXTMbbwL2%2Fclone-site-assets%2F7e223532-a0b3-4613-8889-13093212af7e.svg" alt="India office map" className="tw-w-full tw-opacity-30" />
      </Container>
    </Section>
  );
}
