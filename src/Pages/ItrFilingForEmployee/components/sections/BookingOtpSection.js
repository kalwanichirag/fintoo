import LandingPageOtp from '../../../../components/landingpagesOtp/LandingPageOtp';
import Icon from '../shared/Icon';
import "./../../../../components/Insurance/tailwind.css";

export default function BookingOtpSection() {
  const benefits = [
    ['video', 'Trusted expert guidance', 'Work with a Tax Expert who understands salary income, investments, ESOPs, foreign assets, and complex disclosures.'],
    ['shield', 'Confidential filing support', 'Your financial details are handled carefully, with a structured review before anything is filed.'],
    ['clock', 'Clear filing roadmap', 'Know exactly what happens next, from plan selection to document review, appointment booking, and live filing.'],
  ];

  return (
    <section id="book" className="booking-otp-section tw-bg-[#f4f7fb] tw-py-20 tw-px-5 lg:tw-px-12">
      <div className="tw-container tw-max-w-6xl tw-mx-auto">
        <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-[0.9fr_1fr] tw-gap-10 xl:tw-gap-16 tw-items-center">
          <div className="tw-max-w-xl">
            <div className="section-label tw-text-xs tw-text-fintoo-orange tw-mb-4">Start Filing</div>
            <h2 className="section-title tw-text-3xl md:tw-text-4xl lg:tw-text-5xl tw-mb-5">
              Book Your ITR Filing Consultation
            </h2>
            <p className="tw-text-base md:tw-text-lg tw-text-[#60708a] tw-leading-7 tw-mb-8">
              Share your basic details and our team will help you choose the right filing path for salary, capital gains, ESOPs, foreign assets, or NRI reporting.
            </p>

            <div className="tw-space-y-4">
              {benefits.map(([icon, title, copy]) => (
                <div className="tw-flex tw-gap-4 tw-rounded-lg tw-bg-white tw-border tw-border-[#dfe7f1] tw-p-4" key={title}>
                  <span className="tw-grid tw-h-11 tw-w-11 tw-shrink-0 tw-place-items-center tw-rounded-lg tw-bg-[#fff3e7] tw-text-fintoo-orange tw-text-xl">
                    <Icon name={icon} />
                  </span>
                  <div>
                    <h3 className="tw-text-base tw-font-bold tw-text-[#10233f] tw-mb-1">{title}</h3>
                    <p className="tw-text-sm tw-leading-6 tw-text-[#60708a] tw-mb-0">{copy}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="tw-mt-6 tw-inline-flex tw-items-center tw-gap-2 tw-rounded-lg tw-border tw-border-fintoo-orange/30 tw-bg-white tw-px-4 tw-py-3 tw-text-sm tw-font-semibold tw-text-[#10233f]">
              <Icon name="shield" />
              SEBI Registered Investment Advisor
            </div>
          </div>

          <div className="tw-relative tw-w-full tw-max-w-xl tw-mx-auto lg:tw-mr-0">
            <LandingPageOtp variant="minimal" pageName="ITR Filing For Employee" />
            <div className="tw-pointer-events-none tw-absolute -tw-right-5 -tw-top-5 tw-h-20 tw-w-20 tw-rounded-full tw-bg-fintoo-orange/20 tw-blur-2xl" />
            <div className="tw-pointer-events-none tw-absolute -tw-bottom-8 -tw-left-8 tw-h-32 tw-w-32 tw-rounded-full tw-bg-fintoo-brand-blue/10 tw-blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
