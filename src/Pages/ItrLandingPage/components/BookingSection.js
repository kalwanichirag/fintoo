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

            <h2 className=" tw-text-3xl tw-font-black  tw-text-white md:tw-text-6xl !tw-leading-[1.25]">
              Bring  <span className="tw-text-fintoo-orange">Stress-Free </span>
              <br />
             Tax Filing to Your Workforce
            </h2>

            <p className="tw-mt-6 tw-max-w-xl tw-text-lg tw-leading-8 tw-text-white/70">
            Partner with Fintoo to give your employees access to expert-led ITR filing, personalized tax planning, and one-on-one CA consultations — at zero cost to your HR team's bandwidth.
            </p>

            {/* Benefits */}
            <div className="tw-mt-10 tw-space-y-5">
              <div className="tw-flex tw-items-center tw-gap-4">
                <div className="tw-mt-1 tw-flex tw-h-8 tw-w-8 tw-items-center tw-justify-center tw-rounded-full tw-bg-fintoo-orange/15 tw-text-fintoo-orange">
                  ✓
                </div>
                <div>
                  <h4 className="tw-text-lg tw-font-semibold tw-text-white tw-mb-0">
                   Live 45-minute ITR filing sessions with qualified CAs
                  </h4>
                 
                </div>
              </div>

              <div className="tw-flex tw-items-center tw-gap-4">
                <div className="tw-mt-1 tw-flex tw-h-8 tw-w-8 tw-items-center tw-justify-center tw-rounded-full tw-bg-fintoo-orange/15 tw-text-fintoo-orange">
                  ✓
                </div>
                <div>
                  <h4 className="tw-text-lg tw-font-semibold tw-text-white tw-mb-0">
                   Personalized tax planning based on income, ESOPs, and investments
                  </h4>
                 
                </div>
              </div>

              <div className="tw-flex tw-items-center tw-gap-4">
                <div className="tw-mt-1 tw-flex tw-h-8 tw-w-8 tw-items-center tw-justify-center tw-rounded-full tw-bg-fintoo-orange/15 tw-text-fintoo-orange">
                  ✓
                </div>
                <div>
                  <h4 className="tw-text-lg tw-font-semibold tw-text-white tw-mb-0">
                    Support for global income, foreign assets, and overseas tax filing
                  </h4>
                  
                </div>
              </div>
               <div className="tw-flex tw-items-center tw-gap-4">
                <div className="tw-mt-1 tw-flex tw-h-8 tw-w-8 tw-items-center tw-justify-center tw-rounded-full tw-bg-fintoo-orange/15 tw-text-fintoo-orange">
                  ✓
                </div>
                <div>
                  <h4 className="tw-text-lg tw-font-semibold tw-text-white tw-mb-0">
                   A clear, actionable plan — not just a filed return
                  </h4>
                  
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
                  pageName="ITR Filing For Corporates"
                  servicename={"itr_filing"}
                />
           

            {/* Floating Decoration */}
            <div className="tw-absolute -tw-right-5 -tw-top-5 tw-h-20 tw-w-20 tw-rounded-full tw-bg-fintoo-orange/20 tw-blur-2xl" />
            <div className="tw-absolute -tw-bottom-8 -tw-left-8 tw-h-32 tw-w-32 tw-rounded-full tw-bg-white/10 tw-blur-3xl" />
          </div>
        </div>

        <p className=" tw-mt-20 tw-text-white tw-text-center tw-mb-0">
          Join 100+ leading corporates including Google, Amazon, Microsoft, Swiggy, and Accenture who trust Fintoo to simplify tax season for their teams.
        </p>
      </div>
    </section>
  );
}
