import React from "react";

const HeroSection = ({onBookClick}) => {
  return (
    <section
      id="hero"
      className="tw-gradient-bg tw-text-white tw-pt-16 md:tw-pt-24 tw-pb-16 tw-relative tw-overflow-hidden"
    >
      <div className="tw-absolute tw-inset-0 tw-bg-black/10"></div>

      <div className="tw-container tw-mx-auto tw-px-6 tw-relative tw-z-10">
        <div className="tw-grid lg:tw-grid-cols-2 tw-gap-12 tw-items-center ">
          {/* Left Content */}
          <div className="tw-fade-in">
            <div className="tw-flex tw-items-center  tw-gap-3 tw-mb-6">
              <div className="tw-flex tw-items-center tw-space-x-1 tw-bg-white/20 tw-px-3 tw-py-1 tw-rounded-full">
                <i className="fas fa-star tw-text-yellow-400"></i>
                <span className="tw-text-sm">20+ Years Experience</span>
              </div>

              <div className="tw-flex tw-items-center tw-space-x-1 tw-bg-white/20 tw-px-3 tw-py-1 tw-rounded-full">
                <i className="fas fa-trophy tw-text-yellow-400"></i>
                <span className="tw-text-sm">Certified Advisors</span>
              </div>

              <div className="tw-flex tw-items-center tw-space-x-1 tw-bg-white/20 tw-px-3 tw-py-1 tw-rounded-full">
                <i className="fas fa-users tw-text-yellow-400"></i>
                <span className="tw-text-sm">2,50,000+ Clients</span>
              </div>
            </div>

            <h1 className="tw-text-[2.5rem] lg:tw-text-6xl tw-font-bold tw-mb-6 tw-leading-tight">
              Plan Your Wealth,
              <br />
              <span className="tw-text-orange-400">Secure Your Future</span>
            </h1>

            <p className="tw-text-xl tw-mb-4 tw-text-blue-100">
              Best Financial Advice for Indian Professionals &amp; Business
              Owners
            </p>

            <p className="tw-text-lg tw-mb-8 tw-text-blue-200">
              Personalized Financial Planning &amp; Investment Advisory.
              <br />
              Book your complimentary 15-min virtual consultation with a
              certified Fintoo advisor.
            </p>

            <div className="tw-flex tw-flex-col sm:tw-flex-row tw-gap-4">
              <a onClick={onBookClick}
 className="tw-cursor-pointer  tw-text-white tw-no-underline hover:tw-text-white tw-gradient-orange tw-text-white tw-px-8 tw-py-4 tw-rounded-full tw-font-semibold tw-text-lg hover:tw-shadow-xl tw-transition-all tw-duration-300">
                <i className="fas fa-calendar-alt tw-mr-2"></i>
                Book Your Free Session
              </a>
            </div>
            <div className="tw-flex tw-items-center  tw-text-sm  tw-gap-3 tw-mt-8">

              <div className="tw-flex tw-items-center  tw-space-x-2">
                <i className="fas fa-check-circle tw-text-green-400"></i>
                <span>No Hidden Fees</span>
              </div>
              <div className="tw-flex tw-items-center tw-space-x-2">
                <i className="fas fa-check-circle tw-text-green-400"></i>
                <span>Unbiased Advice</span>
              </div>
              <div className="tw-flex tw-items-center tw-space-x-2">
                <i className="fas fa-check-circle tw-text-green-400"></i>
                <span>Personalized Plans</span>
              </div>
            </div>
          </div>

          {/* Right Image Section */}
          <div className="tw-relative tw-slide-up tw-py-10">
            <div className="tw-relative">
              <img
                className="tw-w-full tw-h-auto tw-max-h-96 tw-object-cover tw-rounded-2xl tw-shadow-2xl"
                src="/static/media/indian-family.jpg"
                alt="professional Indian financial advisor consulting with clients, modern office setting, warm lighting, professional atmosphere"
              />

              {/* Floating Stats */}
              <div className="tw-absolute -tw-top-4 -tw-right-4 tw-bg-white tw-rounded-2xl tw-p-4 tw-shadow-xl tw-animate-bounce-slow">
                <div className="tw-text-center">
                  <div className="tw-text-2xl tw-font-bold tw-text-green-600">
                    14.8%
                  </div>
                  <div className="tw-text-sm tw-text-gray-600">Avg Returns</div>
                </div>
              </div>

              <div
                className="tw-absolute -tw-bottom-6 -tw-left-4 tw-bg-white tw-rounded-2xl tw-p-4 tw-shadow-xl tw-animate-bounce-slow"
                style={{ animationDelay: "1s" }}
              >
                <div className="tw-text-center">
                  <div className="tw-text-2xl tw-font-bold tw-text-blue-600">
                    ₹500Cr+
                  </div>
                  <div className="tw-text-sm tw-text-gray-600">AUM</div>
                </div>
              </div>

              <div className="tw-absolute tw-top-1/2 -tw-left-6 tw-bg-orange-500 tw-text-white tw-rounded-full tw-p-3 tw-shadow-xl">
                <div className="tw-flex tw-items-center tw-space-x-2">
                  <i className="fas fa-star"></i>
                  <span className="tw-font-bold">4.9/5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="tw-absolute tw-top-20 tw-left-10 tw-w-20 tw-h-20 tw-bg-white/10 tw-rounded-full tw-animate-pulse"></div>
      <div className="tw-absolute tw-bottom-20 tw-right-20 tw-w-32 tw-h-32 tw-bg-orange-400/20 tw-rounded-full tw-animate-bounce-slow"></div>
      <div
        className="tw-absolute tw-top-1/2 tw-right-10 tw-w-16 tw-h-16 tw-bg-white/5 tw-rounded-full tw-animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
    </section>
  );
};

export default HeroSection;
