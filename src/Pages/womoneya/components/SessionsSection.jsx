export default function SessionsSection({ onOpenSpeakerModal, onBookSession }) {
  return (
    <section id="Sessions" className="tw-py-10 md:tw-py-16 tw-bg-white">
      <div className="tw-max-w-7xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8">
        <div className="tw-text-center tw-mb-10 md:tw-mb-16">
          <h2 className="font-display tw-text-3xl md:tw-text-5xl tw-font-bold tw-text-gray-900 tw-mb-6">Choose Your Experience</h2>
          <p className="tw-text-base md:tw-text-xl tw-text-gray-600 tw-max-w-3xl tw-mx-auto">
            The strength of a woman needs to be recognized, honoured and nurtured.
            <br />
            This year, come celebrate the spirit of womanhood together.
          </p>
        </div>

        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6 md:tw-gap-8">
          <div className="tw-bg-gradient-to-br tw-from-purple-50 tw-to-purple-100 tw-rounded-3xl tw-p-5 md:tw-p-8 hover:tw-shadow-2xl tw-transition tw-border-2 tw-border-solid tw-border-purple-200">
            <div className="tw-bg-purple-600 tw-text-white tw-w-14 tw-h-14 md:tw-w-16 md:tw-h-16 tw-rounded-2xl tw-flex tw-items-center tw-justify-center tw-mb-5 md:tw-mb-6">
              <i className="fa-solid fa-shirt tw-text-xl md:tw-text-2xl"></i>
            </div>
            <h3 className="tw-text-xl md:tw-text-2xl tw-font-bold tw-text-gray-900 tw-mb-3 tw-pb-0">Power Style Playbook</h3>
            <p className="tw-text-sm md:tw-text-base tw-text-gray-700 tw-mb-5 md:tw-mb-6 tw-leading-relaxed">
              A focused experience that helps women build professional image, executive presence, and confidence through practical Power
              Style Playbook principles.
            </p>

            <div className="tw-space-y-2.5 tw-mb-6">
              <div className="tw-flex tw-items-start tw-space-x-2"><i className="fa-solid fa-circle-check tw-text-purple-600 tw-mt-1"></i><span className="tw-text-sm md:tw-text-base tw-text-gray-700">30-minutes interactive session</span></div>
              <div className="tw-flex tw-items-start tw-space-x-2"><i className="fa-solid fa-circle-check tw-text-purple-600 tw-mt-1"></i><span className="tw-text-sm md:tw-text-base tw-text-gray-700">Q&A Session with the expert</span></div>
              <div className="tw-flex tw-items-start tw-space-x-2"><i className="fa-solid fa-circle-check tw-text-purple-600 tw-mt-1"></i><span className="tw-text-sm md:tw-text-base tw-text-gray-700">Workwear styling framework</span></div>
              <div className="tw-flex tw-items-start tw-space-x-2"><i className="fa-solid fa-circle-check tw-text-purple-600 tw-mt-1"></i><span className="tw-text-sm md:tw-text-base tw-text-gray-700">Dress for the Role You Want - Not the Role You Have</span></div>
              <div className="tw-flex tw-items-start tw-space-x-2"><i className="fa-solid fa-circle-check tw-text-purple-600 tw-mt-1"></i><span className="tw-text-sm md:tw-text-base tw-text-gray-700">Command the Room Without Speaking</span></div>
              <div className="tw-flex tw-items-start tw-space-x-2"><i className="fa-solid fa-circle-check tw-text-purple-600 tw-mt-1"></i><span className="tw-text-sm md:tw-text-base tw-text-gray-700">Align Image with Ambition</span></div>
              <div className="tw-flex tw-items-start tw-space-x-2"><i className="fa-solid fa-circle-check tw-text-purple-600 tw-mt-1"></i><span className="tw-text-sm md:tw-text-base tw-text-gray-700">Build Signature Professional Identity</span></div>
            </div>

       <button
              type="button"
              onClick={onBookSession}
              className="tw-w-full tw-inline-flex tw-items-center tw-justify-center tw-bg-purple-600 tw-text-white tw-py-3 md:tw-py-4 tw-rounded-full tw-font-bold tw-text-sm md:tw-text-base hover:tw-bg-purple-700 tw-transition"
            >
              Know More
            </button>
          </div>

          <div className="tw-bg-gradient-to-br tw-from-pink-50 tw-to-pink-100 tw-rounded-3xl tw-p-5 md:tw-p-8 hover:tw-shadow-2xl tw-transition tw-border-4 tw-border-solid tw-border-pink-400 tw-relative">
            <div className="tw-absolute -tw-top-4 tw-left-1/2 tw-transform -tw-translate-x-1/2 tw-bg-gradient-to-r tw-from-purple-600 tw-to-pink-500 tw-text-white tw-px-6 tw-py-2 tw-rounded-full tw-text-sm tw-font-bold">
              MOST POPULAR
            </div>
            <div className="tw-bg-pink-500 tw-text-white tw-w-14 tw-h-14 md:tw-w-16 md:tw-h-16 tw-rounded-2xl tw-flex tw-items-center tw-justify-center tw-mb-5 md:tw-mb-6">
              <i className="fa-solid fa-indian-rupee-sign tw-text-xl md:tw-text-2xl"></i>
            </div>
            <h3 className="tw-text-xl md:tw-text-2xl tw-font-bold tw-text-gray-900 tw-mb-3 tw-pb-0">Money Mastery for Women</h3>
            <p className="tw-text-sm md:tw-text-base tw-text-gray-700 tw-mb-5 md:tw-mb-6 tw-leading-relaxed">
              A focused financial planning session designed to help working women take control of their money with clarity and confidence,
              aligning income with long-term goals while optimizing taxes and planning for career breaks or life transitions.
            </p>

            <div className="tw-space-y-2.5 tw-mb-6">
              <div className="tw-flex tw-items-start tw-space-x-2"><i className="fa-solid fa-circle-check tw-text-pink-500 tw-mt-1"></i><span className="tw-text-sm md:tw-text-base tw-text-gray-700">30-minutes interactive session</span></div>
              <div className="tw-flex tw-items-start tw-space-x-2"><i className="fa-solid fa-circle-check tw-text-pink-500 tw-mt-1"></i><span className="tw-text-sm md:tw-text-base tw-text-gray-700">Q&A Session with the expert</span></div>
              <div className="tw-flex tw-items-start tw-space-x-2"><i className="fa-solid fa-circle-check tw-text-pink-500 tw-mt-1"></i><span className="tw-text-sm md:tw-text-base tw-text-gray-700">Shift from Paycheck Thinking to Goal-Based Wealth Planning</span></div>
              <div className="tw-flex tw-items-start tw-space-x-2"><i className="fa-solid fa-circle-check tw-text-pink-500 tw-mt-1"></i><span className="tw-text-sm md:tw-text-base tw-text-gray-700">Career Break & Single-Income Resilience Plan</span></div>
              <div className="tw-flex tw-items-start tw-space-x-2"><i className="fa-solid fa-circle-check tw-text-pink-500 tw-mt-1"></i><span className="tw-text-sm md:tw-text-base tw-text-gray-700">Salary Optimization for Tax Efficiency</span></div>
              <div className="tw-flex tw-items-start tw-space-x-2"><i className="fa-solid fa-circle-check tw-text-pink-500 tw-mt-1"></i><span className="tw-text-sm md:tw-text-base tw-text-gray-700">Take Active Role in Household Financial Decisions</span></div>
              <div className="tw-flex tw-items-start tw-space-x-2"><i className="fa-solid fa-circle-check tw-text-pink-500 tw-mt-1"></i><span className="tw-text-sm md:tw-text-base tw-text-gray-700">Secure Your Legacy & Raise Financially Aware Families</span></div>
            </div>

            <button
              type="button"
              onClick={onBookSession}
              className="tw-w-full tw-inline-flex tw-items-center tw-justify-center tw-bg-gradient-to-r tw-from-purple-600 tw-to-pink-500 tw-text-white tw-py-3 md:tw-py-4 tw-rounded-full tw-font-bold tw-text-sm md:tw-text-base hover:tw-shadow-xl tw-transition"
            >
              Know More
            </button>
          </div>

          <div className="tw-bg-gradient-to-br tw-from-orange-50 tw-to-orange-100 tw-rounded-3xl tw-p-5 md:tw-p-8 hover:tw-shadow-2xl tw-transition tw-border-solid tw-border-2 tw-border-orange-200">
            <div className="tw-bg-orange-500 tw-text-white tw-w-14 tw-h-14 md:tw-w-16 md:tw-h-16 tw-rounded-2xl tw-flex tw-items-center tw-justify-center tw-mb-5 md:tw-mb-6">
              <i className="fa-solid fa-heart-pulse tw-text-xl md:tw-text-2xl"></i>
            </div>
            <h3 className="tw-text-xl md:tw-text-2xl tw-font-bold tw-text-gray-900 tw-mb-3 tw-pb-0">Mind and Body Wellness</h3>
            <p className="tw-text-sm md:tw-text-base tw-text-gray-700 tw-mb-5 md:tw-mb-6 tw-leading-relaxed">
              This session highlights how mental resilience, physical vitality, and emotional stability drive long-term success, showing
              working women that sustainable achievement comes from energy and health - not just ambition.
            </p>
            <div className="tw-space-y-2.5 tw-mb-6">
              <div className="tw-flex tw-items-start tw-space-x-2"><i className="fa-solid fa-circle-check tw-text-orange-500 tw-mt-1"></i><span className="tw-text-sm md:tw-text-base tw-text-gray-700">30-minutes interactive session</span></div>
              <div className="tw-flex tw-items-start tw-space-x-2"><i className="fa-solid fa-circle-check tw-text-orange-500 tw-mt-1"></i><span className="tw-text-sm md:tw-text-base tw-text-gray-700">Q&A Session with the expert</span></div>
              <div className="tw-flex tw-items-start tw-space-x-2"><i className="fa-solid fa-circle-check tw-text-orange-500 tw-mt-1"></i><span className="tw-text-sm md:tw-text-base tw-text-gray-700">Guided breathing practice</span></div>
              <div className="tw-flex tw-items-start tw-space-x-2"><i className="fa-solid fa-circle-check tw-text-orange-500 tw-mt-1"></i><span className="tw-text-sm md:tw-text-base tw-text-gray-700">Light desk yoga</span></div>
              <div className="tw-flex tw-items-start tw-space-x-2"><i className="fa-solid fa-circle-check tw-text-orange-500 tw-mt-1"></i><span className="tw-text-sm md:tw-text-base tw-text-gray-700">Quick stress-reset routine</span></div>
              <div className="tw-flex tw-items-start tw-space-x-2"><i className="fa-solid fa-circle-check tw-text-orange-500 tw-mt-1"></i><span className="tw-text-sm md:tw-text-base tw-text-gray-700">Practical Tools to Manage Stress & Prevent Burnout</span></div>
              <div className="tw-flex tw-items-start tw-space-x-2"><i className="fa-solid fa-circle-check tw-text-orange-500 tw-mt-1"></i><span className="tw-text-sm md:tw-text-base tw-text-gray-700">Sustainable Habits for Energy, Fitness, and Mental Clarity</span></div>
            </div>

            <button
              type="button"
              onClick={onBookSession}
              className="tw-w-full tw-inline-flex tw-items-center tw-justify-center tw-bg-orange-500 tw-text-white tw-py-3 md:tw-py-4 tw-rounded-full tw-font-bold tw-text-sm md:tw-text-base hover:tw-bg-orange-600 tw-transition"
            >
              Know More
            </button>
          </div>
        </div>

        <div className="tw-mt-10 md:tw-mt-16 tw-bg-gradient-to-r tw-from-purple-100 tw-to-pink-100 tw-rounded-3xl tw-p-6 md:tw-p-10">
          <div className="tw-flex tw-flex-col lg:tw-flex-row tw-items-start lg:tw-items-center tw-gap-6 tw-justify-between">
            <div className="tw-flex-1 tw-w-full">
              <h3 className="tw-text-xl md:tw-text-2xl tw-font-bold tw-text-gray-900 tw-mb-3 tw-pb-0">Not sure which session to opt for?</h3>
              <p className="tw-text-sm md:tw-text-lg tw-text-gray-700 tw-mb-0">
                Schedule a consultation with our partnerships team to discuss your organization's specific needs and goals.
              </p>
            </div>
            <button
              type="button"
              onClick={onBookSession}
              className="tw-bg-white tw-text-purple-600 tw-px-4 sm:tw-px-6 lg:tw-px-8 tw-py-3 md:tw-py-4 tw-rounded-full tw-font-bold tw-text-sm md:tw-text-base hover:tw-shadow-xl tw-transition tw-flex tw-items-center tw-space-x-2"
            >
              <span>Schedule Consultation</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
