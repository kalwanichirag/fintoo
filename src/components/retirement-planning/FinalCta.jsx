import image4 from "../../../src/Assets/Images/retirement/image-4.jpg";
import LandingPageCalendly from "../landingpagesCalendly/LandingPageCalendly";
import LandingPageOtp from "../landingpagesOtp/LandingPageOtp";

export default function FinalCTA({ formtype }) {


  return (
    <section id="final-cta" className="tw-py-20 tw-bg-white">
      <div className="tw-container tw-mx-auto tw-px-6">
        <div className="tw-text-center tw-mb-12">
          <h2 className="tw-text-3xl lg:tw-text-6xl tw-font-bold tw-text-fintoo-blue tw-mb-6">
            Your Retirement Won't Plan Itself.{" "}
            <span className="tw-text-fintoo-orange">Let's Do It Together.</span>
          </h2>
          <p className="tw-text-base lg:tw-text-xl lg:tw-text-2xl tw-text-gray-600 tw-mb-8 tw-max-w-4xl tw-mx-auto tw-leading-relaxed">
            Book your complimentary consultation and take the first step towards your early retirement plan.
          </p>
        </div>

        <div className="tw-grid lg:tw-grid-cols-2 tw-gap-16 tw-items-center tw-max-w-7xl tw-mx-auto">
          <div>
            <img
              className="tw-w-full tw-h-auto tw-max-h-[400px] sm:tw-max-h-[500px] tw-object-cover tw-rounded-2xl tw-shadow-2xl"
              src={image4}
              alt="Indian couple planning retirement"
            />

            <div className="tw-mt-8 tw-grid tw-grid-cols-2 md:tw-grid-cols-3 tw-gap-6 tw-text-center">
              <div className="tw-flex tw-flex-col tw-items-center">
                <div className="tw-bg-blue-100 tw-p-4 tw-rounded-full tw-mb-4">
                  <i className="fa-solid fa-clock tw-text-2xl tw-text-blue-600"></i>
                </div>
                <div className="tw-font-semibold tw-text-fintoo-blue">
                  Free 15-Minute Session
                </div>
                <div className="tw-text-sm tw-text-gray-500">
                  No obligations, just expert advice
                </div>
              </div>

              <div className="tw-flex tw-flex-col tw-items-center">
                <div className="tw-bg-green-100 tw-p-4 tw-rounded-full tw-mb-4">
                  <i className="fa-solid fa-user-tie tw-text-2xl tw-text-green-600"></i>
                </div>
                <div className="tw-font-semibold tw-text-fintoo-blue">
                  Certified Experts
                </div>
                <div className="tw-text-sm tw-text-gray-500">
                  SEBI registered advisors
                </div>
              </div>

              <div className="tw-flex tw-flex-col tw-items-center">
                <div className="tw-bg-orange-100 tw-p-4 tw-rounded-full tw-mb-4">
                  <i className="fa-solid fa-chart-line tw-text-2xl tw-text-orange-600"></i>
                </div>
                <div className="tw-font-semibold tw-text-fintoo-blue">
                  Proven Results
                </div>
                <div className="tw-text-sm tw-text-gray-500">
                  Average 18% returns
                </div>
              </div>
            </div>
          </div>

          <div className="tw-bg-gradient-to-br tw-from-fintoo-blue tw-to-blue-800 tw-rounded-3xl tw-p-6 sm:tw-p-8 lg:tw-p-12 tw-text-white">
            <div className="tw-text-center tw-mb-8">
              <h3 className="tw-text-3xl tw-font-bold tw-mb-4">Get Your Free Consultation</h3>
              <p className="tw-text-lg tw-opacity-90">
                Book a time below, and our advisor will connect with you soon.
              </p>
            </div>


            {formtype == "otp" ? (<LandingPageOtp servicename={"assisted_advisory_fixed_fees"}  pageName="Retirement Planning"  calendlyurl={"https://calendly.com/d/cwkx-wvw-y7t/15-minute-consultation-call-for-retirement-planning?hide_event_type_details=1"} variant="minimal" />
            
            ) :(
              <LandingPageCalendly pageName="Retirement Planning" servicename={"assisted_advisory_fixed_fees"} calendlyurl={"https://calendly.com/d/cwkx-wvw-y7t/15-minute-consultation-call-for-retirement-planning?hide_event_type_details=1"} variant="minimal" />
            )
            }

          </div>
        </div>


      </div>
    </section>
  );
}
