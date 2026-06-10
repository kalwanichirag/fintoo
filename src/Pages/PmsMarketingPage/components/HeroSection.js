import React from "react";
import { brandGreen, Container, CTAButton, Section } from "./shared";

export default function HeroSection() {
  return (
    <Section
      id="about"
      className=" tw-pt-24 tw-pb-24 "
      style={{ background: "radial-gradient(circle at top right, #1a2e1a, #000 60%)" }}
    >
      <Container className="tw-grid tw-grid-cols-1 tw-items-center tw-gap-12 tw-py-16 lg:tw-grid-cols-2">
        <div className="tw-space-y-8">
          <h1 className="tw-m-0 tw-text-4xl tw-font-extrabold tw-leading-tight md:tw-text-5xl lg:tw-text-6xl">
            Fintoo: Your Family's
            <br />
            Wealth Partner
          </h1>
          <ul className="tw-m-0 tw-space-y-4 tw-p-0">
            <li className="tw-flex tw-items-center tw-gap-3 tw-text-gray-300">
              <i className="fa-solid fa-circle-check" style={{ color: brandGreen }} />
              Helps in achieving your financial goals
            </li>
            <li className="tw-flex tw-items-center tw-gap-3 tw-text-gray-300">
              <i className="fa-solid fa-circle-check" style={{ color: brandGreen }} />
              End-to-End Wealth Management
            </li>
            <li className="tw-flex tw-items-center tw-gap-3 tw-text-gray-300">
              <i className="fa-solid fa-circle-check" style={{ color: brandGreen }} />
              Personalised Investment Strategies
            </li>
          </ul>
          <div className="tw-flex tw-flex-col tw-items-start tw-gap-5 sm:tw-flex-row sm:tw-items-center">
            <CTAButton className="tw-px-8 tw-py-4">Book a free call</CTAButton>
            <a href="#offerings" className="tw-border-0 tw-border-b tw-border-solid tw-border-white/30 tw-pb-1 tw-text-sm tw-font-medium tw-text-white tw-no-underline hover:tw-border-white">
              See how it works
            </a>
          </div>
        </div>

        <div>
          <div className="tw-grid tw-grid-cols-3 tw-gap-3 md:tw-gap-4">
            <div className="tw-text-center">
              <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/TPXgOMVZTdXq8fZkCjQzXTMbbwL2%2Fclone-site-assets%2F32fbb85e-d63e-49c3-937b-08d771d9a385.webp" alt="Sandeep Jethwani" className="tw-w-full tw-rounded-xl" />
              <p className="tw-mb-0 tw-mt-2 tw-text-[10px] tw-font-bold tw-uppercase md:tw-text-xs">Sandeep Jethwani</p>
              <p className="tw-m-0 tw-text-[10px] tw-text-gray-500">Co-founder</p>
            </div>
            <div className="tw-text-center">
              <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/TPXgOMVZTdXq8fZkCjQzXTMbbwL2%2Fclone-site-assets%2F21c94bf3-038d-433f-8636-1923a146a6bf.webp" alt="Vaibhav Porwal" className="tw-w-full tw-rounded-xl" />
              <p className="tw-mb-0 tw-mt-2 tw-text-[10px] tw-font-bold tw-uppercase md:tw-text-xs">Vaibhav Porwal</p>
              <p className="tw-m-0 tw-text-[10px] tw-text-gray-500">Co-founder</p>
            </div>
            <div className="tw-text-center">
              <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/TPXgOMVZTdXq8fZkCjQzXTMbbwL2%2Fclone-site-assets%2Ff2e555e3-a0ba-47c5-8a73-658e72c6c1d3.webp" alt="Sahil Contractor" className="tw-w-full tw-rounded-xl" />
              <p className="tw-mb-0 tw-mt-2 tw-text-[10px] tw-font-bold tw-uppercase md:tw-text-xs">Sahil Contractor</p>
              <p className="tw-m-0 tw-text-[10px] tw-text-gray-500">Co-founder</p>
            </div>
          </div>
          <div className="tw-mt-12 tw-text-center">
            <p className="tw-m-0 tw-text-3xl tw-font-bold">₹16k Cr+</p>
            <p className="tw-mt-1 tw-text-xs tw-uppercase tw-tracking-widest tw-text-gray-400">Client assets in 4 years</p>
            <div className="tw-mt-4 tw-flex tw-justify-center tw-gap-1">
              <span className="tw-h-1.5 tw-w-1.5 tw-rounded-full tw-bg-white" />
              <span className="tw-h-1.5 tw-w-1.5 tw-rounded-full tw-bg-gray-600" />
              <span className="tw-h-1.5 tw-w-1.5 tw-rounded-full tw-bg-gray-600" />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
