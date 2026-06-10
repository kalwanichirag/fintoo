import LandingPageCalendly from "../landingpagesCalendly/LandingPageCalendly";
import LandingPageOtp from "../landingpagesOtp/LandingPageOtp";
export default function CTAForm({ formtype }) {

  // ✅ Listen for Calendly event scheduling

  return (
    <section
      id="cta-form-section"
      className="tw-py-14 tw-py-16 lg:tw-py-20 tw-bg-gradient-to-r tw-from-fintoo-blue tw-to-blue-800"
    >
      <div className="tw-max-w-7xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8">
        <div className="tw-grid lg:tw-grid-cols-2 tw-gap-10 lg:tw-gap-12 tw-items-center">
          {/* Left Side */}
          <div className="tw-text-white tw-space-y-8">
            <div className="tw-flex tw-flex-wrap tw-gap-2 sm:tw-gap-3 tw-mb-6">
              <div className="tw-bg-white tw-text-fintoo-blue tw-px-3 sm:tw-px-4 tw-py-2.5 sm:tw-py-3 tw-rounded-full tw-text-xs sm:tw-text-sm tw-font-medium tw-border tw-border-white/20">
                <i className="fas fa-gift tw-mr-2 tw-text-fintoo-blue"></i>
                Free Consultation
              </div>
              <div className="tw-bg-white tw-text-fintoo-blue tw-px-3 sm:tw-px-4 tw-py-2.5 sm:tw-py-3 tw-rounded-full tw-text-xs sm:tw-text-sm tw-font-medium tw-border tw-border-white/20">
                <i className="fas fa-clock tw-mr-2 tw-text-fintoo-blue"></i>
                15-Min Session
              </div>
              <div className="tw-bg-white tw-text-fintoo-blue tw-px-3 sm:tw-px-4 tw-py-2.5 sm:tw-py-3 tw-rounded-full tw-text-xs sm:tw-text-sm tw-font-medium tw-border tw-border-white/20">
                <i className="fas fa-user-graduate tw-mr-2 tw-text-fintoo-blue"></i>
                Certified Advisors
              </div>
            </div>

            <h2 className="tw-text-[2.2rem] sm:tw-text-4xl lg:tw-text-5xl tw-font-bold tw-leading-tight">
              Plan Smarter.{" "}
              <span className="tw-text-fintoo-orange">Invest Better</span>.
              Grow Confidently.
            </h2>

            <p className="tw-text-lg sm:tw-text-xl tw-text-blue-100 tw-leading-relaxed">
              Schedule your complimentary 1-on-1 wealth planning session with a
              certified Fintoo financial advisor today.
            </p>
          </div>

          {/* Right Side Calendly */}
          {formtype == "otp" ?  
                            <LandingPageOtp pageName="Investment Planning"  variant="minimal" calendlyurl={"https://calendly.com/d/cxbp-w25-r83/15-minute-consultation-call-for-investment-planning?hide_event_type_details=1"}  />

            :
            (
            <> <div className="tw-bg-white tw-rounded-[1.75rem] tw-rounded-3xl tw-p-5 sm:tw-p-8 tw-shadow-2xl tw-overflow-hidden">
              <div className="tw-text-center tw-mb-6 sm:tw-mb-8">
                <h3 className="tw-text-2xl sm:tw-text-3xl tw-font-bold tw-text-fintoo-blue tw-mb-2">
                  Book Your Free Consultation
                </h3>
                <p className="tw-text-sm sm:tw-text-base tw-text-gray-600">
                  Start your wealth transformation journey today
                </p>
              </div>
                            <LandingPageCalendly pageName="Investment Planning" servicename={"assisted_advisory_fixed_fees"} calendlyurl={"https://calendly.com/d/cxbp-w25-r83/15-minute-consultation-call-for-investment-planning?hide_event_type_details=1"} variant="minimal" />
<div className="tw-text-center tw-text-sm tw-text-gray-500">
                <i className="fas fa-shield-alt tw-mr-1"></i>100% Secure &
                Confidential
              </div>
            </div>
            </>

              )
}


              
        </div>
      </div>

      {/* ✅ Thank You Popup */}
      {/* {showThankYou && (
        <div className="tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-bg-black/60 tw-z-50">
          <div className="tw-bg-white tw-rounded-2xl tw-px-8 tw-py-10 tw-text-center tw-max-w-md tw-shadow-2xl">
            <h3 className="tw-text-2xl tw-font-bold tw-text-fintoo-blue tw-mb-4">
              Thank You!
            </h3>
            <p className="tw-text-xl tw-text-gray-600 tw-mb-6">
              Your consultation has been successfully scheduled. Our advisor
              will connect with you soon.
            </p>
            <button
              onClick={() => setShowThankYou(false)}
              className="tw-bg-fintoo-blue tw-text-white tw-px-6 tw-py-3 tw-rounded-full tw-font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )} */}
    </section>
  );
}
