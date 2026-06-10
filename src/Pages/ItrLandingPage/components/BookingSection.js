import React, { useState } from "react";
import LandingPageOtp from "../../../components/landingpagesOtp/LandingPageOtp";

export default function BookingSection() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section
      id="booking"
      className="tw-relative tw-overflow-hidden tw-bg-[#021d44] tw-px-4 tw-py-24 md:tw-px-8"
    >
      {/* Background */}
      <div className="tw-absolute tw-inset-0 tw-bg-white/5" />

      <div className="tw-absolute tw-left-1/2 tw-top-1/2 tw-h-96 tw-w-96 -tw-translate-x-1/2 -tw-translate-y-1/2 tw-rounded-full tw-bg-[radial-gradient(circle,rgba(221,115,0,0.12)_0%,transparent_65%)]" />

      <div className="tw-relative tw-z-10 tw-mx-auto tw-max-w-7xl">
        <div className="tw-grid tw-gap-16 lg:tw-grid-cols-2 lg:tw-items-center">
          
          {/* Left Side */}
          <div>
            <div className="tw-mb-6 tw-inline-flex tw-items-center tw-rounded-full tw-border tw-border-fintoo-orange/20 tw-bg-fintoo-orange/10 tw-px-4 tw-py-1.5 tw-text-xs tw-font-bold tw-uppercase tw-text-fintoo-orange">
              Book 45-Minute Session
            </div>

            <h2 className="tw-font-dmserif1 tw-text-4xl tw-font-black tw-leading-tight tw-text-white md:tw-text-6xl">
              Let's <span className="tw-text-fintoo-orange">simplify</span>
              <br />
              your taxes.
            </h2>

            <p className="tw-mt-6 tw-max-w-xl tw-text-lg tw-leading-8 tw-text-white/70">
              Book a one-on-one consultation with an experienced CA and get a
              personalized tax strategy tailored to your income, investments,
              and financial goals.
            </p>

            {/* Benefits */}
            <div className="tw-mt-10 tw-space-y-5">
              <div className="tw-flex tw-items-start tw-gap-4">
                <div className="tw-mt-1 tw-flex tw-h-8 tw-w-8 tw-items-center tw-justify-center tw-rounded-full tw-bg-fintoo-orange/15 tw-text-fintoo-orange">
                  ✓
                </div>
                <div>
                  <h4 className="tw-text-lg tw-font-semibold tw-text-white">
                    Personalized Tax Planning
                  </h4>
                  <p className="tw-text-white/60">
                    Recommendations tailored to your income profile.
                  </p>
                </div>
              </div>

              <div className="tw-flex tw-items-start tw-gap-4">
                <div className="tw-mt-1 tw-flex tw-h-8 tw-w-8 tw-items-center tw-justify-center tw-rounded-full tw-bg-fintoo-orange/15 tw-text-fintoo-orange">
                  ✓
                </div>
                <div>
                  <h4 className="tw-text-lg tw-font-semibold tw-text-white">
                    Expert CA Consultation
                  </h4>
                  <p className="tw-text-white/60">
                    Get guidance from qualified tax professionals.
                  </p>
                </div>
              </div>

              <div className="tw-flex tw-items-start tw-gap-4">
                <div className="tw-mt-1 tw-flex tw-h-8 tw-w-8 tw-items-center tw-justify-center tw-rounded-full tw-bg-fintoo-orange/15 tw-text-fintoo-orange">
                  ✓
                </div>
                <div>
                  <h4 className="tw-text-lg tw-font-semibold tw-text-white">
                    Clear Action Plan
                  </h4>
                  <p className="tw-text-white/60">
                    Walk away knowing exactly what to do next.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="tw-mt-12 tw-flex tw-flex-wrap tw-gap-10">
              <div>
                <div className="tw-text-3xl tw-font-bold tw-text-white">
                  25,000+
                </div>
                <div className="tw-text-sm tw-text-white/50">
                  Tax Returns Filed
                </div>
              </div>

              <div>
                <div className="tw-text-3xl tw-font-bold tw-text-white">
                  100+
                </div>
                <div className="tw-text-sm tw-text-white/50">
                  Tax Experts
                </div>
              </div>

              <div>
                <div className="tw-text-3xl tw-font-bold tw-text-white">
                  4.9★
                </div>
                <div className="tw-text-sm tw-text-white/50">
                  Client Rating
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Form */}
          <div className="tw-relative">
            <LandingPageOtp
                  variant="minimal"
                  pageName="ITR Booking"
                />
           

            {/* Floating Decoration */}
            <div className="tw-absolute -tw-right-5 -tw-top-5 tw-h-20 tw-w-20 tw-rounded-full tw-bg-fintoo-orange/20 tw-blur-2xl" />
            <div className="tw-absolute -tw-bottom-8 -tw-left-8 tw-h-32 tw-w-32 tw-rounded-full tw-bg-white/10 tw-blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
