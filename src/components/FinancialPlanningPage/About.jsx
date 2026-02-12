import React from "react";

const AboutSection = () => {
  return (
    <section id="about" className="tw-py-16 md:tw-py-20 tw-bg-gray-50">
      <div className="tw-container tw-mx-auto tw-px-6">
        <div className="tw-grid lg:tw-grid-cols-2 tw-gap-16 tw-items-center">
          {/* Left Column */}
          <div className="tw-slide-up">
            <h2 className="tw-text-4xl tw-font-bold tw-text-gray-800 tw-mb-6">
              20+ Years of Financial Wisdom,
              <br />
              <span className="tw-text-blue-600">Tailored for You</span>
            </h2>

            <p className="tw-text-lg tw-text-gray-700 tw-mb-8 tw-leading-relaxed">
              For over 20+ years, Fintoo has been the go-to financial advisor
              for ambitious Indians—salaried professionals, entrepreneurs, and
              families. As a leading financial services company, we've helped
              thousands achieve their money goals with transparent, unbiased
              advice and custom investment plans.
            </p>

            <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 tw-gap-6">
              {/* Item 1 */}
              <div className="tw-flex tw-items-start tw-space-x-3">
                <div className="tw-w-8 tw-h-8 tw-rounded-full tw-bg-blue-100 tw-flex tw-items-center tw-justify-center tw-flex-shrink-0">
                  <i className="fas fa-flag tw-text-blue-600"></i>
                </div>
                <div>
                  <h4 className="tw-font-semibold tw-text-gray-800 mt-0 ">
                    India&apos;s Most Trusted
                  </h4>
                  <p className="tw-text-gray-600 tw-text-sm">
                    Wealth advisors with proven track record
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="tw-flex tw-items-start tw-space-x-3">
                <div className="tw-w-8 tw-h-8 tw-rounded-full tw-bg-green-100 tw-flex tw-items-center tw-justify-center tw-flex-shrink-0">
                  <i className="fas fa-graduation-cap tw-text-green-600"></i>
                </div>
                <div>
                  <h4 className="tw-font-semibold tw-text-gray-800 mt-0 ">
                    Certified Experts
                  </h4>
                  <p className="tw-text-gray-600 tw-text-sm">
                    Financial planner consultants
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="tw-flex tw-items-start tw-space-x-3">
                <div className="tw-w-8 tw-h-8 tw-rounded-full tw-bg-purple-100 tw-flex tw-items-center tw-justify-center tw-flex-shrink-0">
                  <i className="fas fa-chart-bar tw-text-purple-600"></i>
                </div>
                <div>
                  <h4 className="tw-font-semibold tw-text-gray-800 mt-0 ">
                    Legacy of Excellence
                  </h4>
                  <p className="tw-text-gray-600 tw-text-sm">
                    Goal-based investment management
                  </p>
                </div>
              </div>

              {/* Item 4 */}
              <div className="tw-flex tw-items-start tw-space-x-3">
                <div className="tw-w-8 tw-h-8 tw-rounded-full tw-bg-orange-100 tw-flex tw-items-center tw-justify-center tw-flex-shrink-0">
                  <i className="fas fa-star tw-text-orange-600"></i>
                </div>
                <div>
                  <h4 className="tw-font-semibold tw-text-gray-800 mt-0 ">
                    Top Rated
                  </h4>
                  <p className="tw-text-gray-600 tw-text-sm">
                    Best financial advisory firms in India
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Image + Badges) */}
          <div className="tw-relative tw-fade-in">
            <img
              className="tw-w-full tw-h-auto tw-max-h-96 tw-object-cover tw-rounded-2xl tw-shadow-xl"
              src="https://storage.googleapis.com/uxpilot-auth.appspot.com/dca519b61d-d76dafd5ed5e984ab13a.png"
              alt="Indian financial advisory team in modern office, diverse professionals, charts and graphs, success atmosphere"
            />

            {/* Achievement Badge - Years */}
            <div className="tw-absolute -tw-top-6 -tw-right-6 tw-bg-white tw-rounded-full tw-p-4 tw-shadow-xl">
              <div className="tw-text-center">
                <div className="tw-text-xl tw-font-bold tw-text-blue-600">
                  20+
                </div>
                <div className="tw-text-xs tw-text-gray-600">Years</div>
              </div>
            </div>

            {/* Achievement Badge - Clients */}
            <div className="tw-absolute -tw-bottom-6 -tw-left-6 tw-bg-gradient-to-r tw-from-orange-400 tw-to-orange-600 tw-text-white tw-rounded-2xl tw-p-4 tw-shadow-xl">
              <div className="tw-text-center">
                <div className="tw-text-lg tw-font-bold">2,50,000+</div>
                <div className="tw-text-xs">Happy Clients</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
