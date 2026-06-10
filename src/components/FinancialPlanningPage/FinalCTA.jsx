import LandingPageCalendly from "../landingpagesCalendly/LandingPageCalendly";
import LandingPageOtp from "../landingpagesOtp/LandingPageOtp";
import "../../components/Insurance/tailwind.css"

const FinalCTA = ({formtype}) => {



  return (
    <section
      id="final-cta"
      className="tw-py-20 tw-gradient-bg tw-text-white tw-relative tw-overflow-hidden"
    >
      {/* Overlay */}
      <div className="tw-absolute tw-inset-0 tw-bg-black/20"></div>

      {/* Main Container */}
      <div className="tw-container tw-mx-auto tw-px-6 tw-relative tw-z-10">
        <div className="tw-grid md:tw-grid-cols-2 md:tw-gap-12 tw-items-center">
          
          {/* LEFT: Text Section */}
          <div className="tw-text-left tw-max-w-2xl">
            <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-4 tw-text-blue-200 tw-mb-8">
              <div className="tw-flex tw-items-center tw-space-x-1">
                <i className="fas fa-clock"></i>
                <span>15 minutes</span>
              </div>
              <div className="tw-flex tw-items-center tw-space-x-1">
                <i className="fas fa-video"></i>
                <span>Virtual meeting</span>
              </div>
              <div className="tw-flex tw-items-center tw-space-x-1">
                <i className="fas fa-gift"></i>
                <span>Complementary Session</span>
              </div>
            </div>

            <h2 className="tw-text-4xl tw-font-bold tw-mb-4 tw-leading-snug">
              Secure Your Financial Future—
              <br />
              <span className="tw-text-orange-400">Start Now</span>
            </h2>

            <p className="tw-text-lg tw-mb-6 tw-text-blue-100">
              Don’t let another day pass without taking control of your financial destiny.
              <br />
              Join thousands of successful Indians who trust Fintoo with their wealth.
            </p>

           {/*   <div className="tw-flex tw-flex-col sm:tw-flex-row tw-gap-4 tw-mb-10">
             <button className="tw-gradient-orange tw-text-white tw-px-8 tw-py-4 tw-rounded-full tw-font-semibold tw-text-lg hover:tw-shadow-2xl tw-transition-all tw-duration-300">
                <i className="fas fa-calendar-check tw-mr-2"></i>
                Book Your Complimentary Session
              </button> 
            </div>*/}
          </div>

          {/* RIGHT: Calendly Embed */}
          <div className="">
  {formtype == "otp" ? (<LandingPageOtp  variant="minimal" pageName="Financial Advice" calendlyurl={"https://calendly.com/d/csqj-96h-zc9/15-mins-consultation-call-with-financial-advisor?hide_event_type_details=1"}  />

                ) :
            <LandingPageCalendly pageName="Financial Advice" servicename={"assisted_advisory_fixed_fees"} calendlyurl={"https://calendly.com/d/csqj-96h-zc9/15-mins-consultation-call-with-financial-advisor?hide_event_type_details=1"} variant="minimal" />

}
            {/* <InlineWidget url="https://calendly.com/d/csqj-96h-zc9/15-mins-consultation-call-with-financial-advisor?hide_event_type_details=1" /> */}
          </div>
        </div>
      </div>

          
      {/* Floating Elements */}
      <div className="tw-absolute tw-top-10 tw-left-10 tw-w-20 tw-h-20 tw-bg-white/10 tw-rounded-full tw-animate-pulse"></div>
      <div className="tw-absolute tw-bottom-10 tw-right-10 tw-w-28 tw-h-28 tw-bg-orange-400/20 tw-rounded-full animate-bounce-slow"></div>
      <div
        className="tw-absolute tw-top-1/3 tw-right-20 tw-w-16 tw-h-16 tw-bg-white/5 tw-rounded-full tw-animate-pulse"
        style={{ animationDelay: "1.5s" }}
      ></div>
    </section>
  );
};

export default FinalCTA;


