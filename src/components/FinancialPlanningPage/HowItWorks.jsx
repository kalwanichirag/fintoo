import React from "react";

const HowItWorksSection = ({onBookClick}) => {
  return (
    <section id="how-it-works" className="tw-py-20 tw-bg-gray-50">
      <div className="tw-container tw-mx-auto tw-px-6">
        {/* Section Header */}
        <div className="tw-text-center tw-mb-16">
          <h2 className="tw-text-4xl tw-font-bold tw-text-gray-800 tw-mb-4">
            Your Financial Clarity in 3 Simple Steps
          </h2>
          <p className="tw-text-lg tw-text-gray-600 tw-max-w-2xl tw-mx-auto">
            Getting started with professional financial planning has never been easier. 
            Follow our simple process to secure your financial future.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="tw-grid md:tw-grid-cols-3 tw-gap-8 tw-relative">
          {/* Step 1 */}
          <div className="tw-text-center tw-relative">
            <div className="neumorphic tw-w-20 tw-h-20 tw-mx-auto tw-mb-6 tw-flex tw-items-center tw-justify-center">
              <div className="tw-w-12 tw-h-12 tw-gradient-bg tw-rounded-full tw-flex tw-items-center tw-justify-center">
                <span className="tw-text-white tw-font-bold tw-text-xl">1</span>
              </div>
            </div>
            <h3 className="tw-text-xl tw-font-bold tw-text-gray-800 tw-mb-4">
              Book Free Session
            </h3>
            <p className="tw-text-gray-600">
              Schedule a 15-minute complimentary consultation with a certified Fintoo advisor at your convenience.
            </p>
          </div>

          {/* Step 2 */}
          <div className="tw-text-center tw-relative">
            <div className="neumorphic tw-w-20 tw-h-20 tw-mx-auto tw-mb-6 tw-flex tw-items-center tw-justify-center">
              <div className="tw-w-12 tw-h-12 tw-gradient-orange tw-rounded-full tw-flex tw-items-center tw-justify-center">
                <span className="tw-text-white tw-font-bold tw-text-xl">2</span>
              </div>
            </div>
            <h3 className="tw-text-xl tw-font-bold tw-text-gray-800 tw-mb-4">
              Discuss Your Goals
            </h3>
            <p className="tw-text-gray-600">
              Share your financial goals, current savings, investments, and risk preferences with our expert advisor.
            </p>
          </div>

          {/* Step 3 */}
          <div className="tw-text-center tw-relative">
            <div className="neumorphic tw-w-20 tw-h-20 tw-mx-auto tw-mb-6 tw-flex tw-items-center tw-justify-center">
              <div className="tw-w-12 tw-h-12 tw-bg-gradient-to-r tw-from-green-500 tw-to-green-600 tw-rounded-full tw-flex tw-items-center tw-justify-center">
                <span className="tw-text-white tw-font-bold tw-text-xl">3</span>
              </div>
            </div>
            <h3 className="tw-text-xl tw-font-bold tw-text-gray-800 tw-mb-4">
              Get Your Roadmap
            </h3>
            <p className="tw-text-gray-600">
              Receive a personalized financial roadmap with actionable recommendations to achieve your wealth goals.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="tw-text-center tw-mt-12">
         <a           onClick={onBookClick}
 className="tw-cursor-pointer tw-text-white tw-no-underline hover:tw-text-white tw-gradient-orange tw-text-white tw-px-8 tw-py-4 tw-rounded-full tw-font-semibold tw-text-lg hover:tw-shadow-xl tw-transition-all tw-duration-300">
            <i className="fas fa-calendar-check tw-mr-2"></i>
            Book Your Free Appointment
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
