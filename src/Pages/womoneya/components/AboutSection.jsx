import { ABOUT_STAGE_IMAGES } from "../constants";

export default function AboutSection({ aboutStageIndex, onPrevSlide, onNextSlide }) {
  return (
    <section id="about" className="tw-py-10 md:tw-py-16 tw-bg-gradient-to-br tw-from-purple-50 tw-via-pink-50 tw-to-orange-50">
      <div className="tw-max-w-7xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8">
        <div className="tw-text-center tw-mb-10 md:tw-mb-16">
          <h2 className="font-display tw-text-3xl md:tw-text-5xl tw-font-bold tw-text-gray-900 tw-mb-4 md:tw-mb-6">A little about our initiative...</h2>
          <p className="tw-text-base md:tw-text-lg tw-text-gray-700 tw-max-w-4xl tw-mx-auto tw-leading-relaxed tw-font-medium">
            Purpose-led complimentary 30 min sessions on financial planning, power dressing and holistic wellness, followed by Q&A with
            the experts.
          </p>
        </div>

        <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-10 lg:tw-gap-12 tw-items-center tw-mb-12 md:tw-mb-20">
          <div className="tw-relative">
            <div className="tw-absolute tw-inset-0 tw-bg-gradient-to-br tw-from-purple-400/20 tw-to-pink-400/20 tw-rounded-3xl tw-blur-2xl"></div>
            <div id="aboutStageSlider" className="tw-relative tw-w-full tw-h-[15.25rem] md:tw-h-[32.25rem] tw-rounded-3xl tw-shadow-2xl tw-overflow-hidden">
              {ABOUT_STAGE_IMAGES.map((image, idx) => (
                <img
                  key={image}
                  className={`tw-absolute tw-inset-0 tw-w-full tw-h-full tw-object-cover tw-transition-opacity tw-duration-700 ${
                    idx === aboutStageIndex ? "tw-opacity-100 tw-z-10" : "tw-opacity-0 tw-z-0"
                  }`}
                  src={image}
                  alt={`Womoneya stage event photo ${idx + 1}`}
                />
              ))}

              <button
                id="aboutStagePrev"
                type="button"
                className="tw-absolute tw-z-20 tw-left-2 md:tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-w-9 tw-h-9 md:tw-w-10 md:tw-h-10 tw-rounded-full tw-bg-white/80 hover:tw-bg-white tw-text-gray-700 tw-shadow-md tw-transition"
                aria-label="Previous slide"
                onClick={onPrevSlide}
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <button
                id="aboutStageNext"
                type="button"
                className="tw-absolute tw-z-20 tw-right-2 md:tw-right-3 tw-top-1/2 -tw-translate-y-1/2 tw-w-9 tw-h-9 md:tw-w-10 md:tw-h-10 tw-rounded-full tw-bg-white/80 hover:tw-bg-white tw-text-gray-700 tw-shadow-md tw-transition"
                aria-label="Next slide"
                onClick={onNextSlide}
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>

          <div className="tw-space-y-6 md:tw-space-y-8">
            <div className="tw-grid tw-grid-cols-1 tw-gap-4 md:tw-gap-6">
              <div className="tw-bg-white tw-rounded-2xl tw-p-4 md:tw-p-6 tw-shadow-lg tw-border-l-4 tw-border-purple-600">
                <div className="tw-flex tw-items-start tw-space-x-3 md:tw-space-x-4">
                  <div className="tw-w-10 tw-h-10 md:tw-w-12 md:tw-h-12 tw-bg-purple-100 tw-rounded-xl tw-flex tw-items-center tw-justify-center tw-flex-shrink-0">
                    <i className="fa-solid fa-coins tw-text-purple-600 tw-text-xl"></i>
                  </div>
                  <div>
                    <h4 className="tw-text-lg md:tw-text-xl tw-font-bold tw-text-gray-900 tw-mb-1 tw-mt-0">Money Mastery for Women</h4>
                    <p className="tw-text-sm md:tw-text-base tw-text-gray-600">
                      Gain an understanding of finance related nuances from the experts, and learn ways to grow your wealth for complete
                      financial independence.
                    </p>
                  </div>
                </div>
              </div>

              <div className="tw-bg-white tw-rounded-2xl tw-p-4 md:tw-p-6 tw-shadow-lg tw-border-l-4 tw-border-pink-500">
                <div className="tw-flex tw-items-start tw-space-x-3 md:tw-space-x-4">
                  <div className="tw-w-10 tw-h-10 md:tw-w-12 md:tw-h-12 tw-bg-pink-100 tw-rounded-xl tw-flex tw-items-center tw-justify-center tw-flex-shrink-0">
                    <i className="fa-solid fa-shirt tw-text-pink-500 tw-text-xl"></i>
                  </div>
                  <div>
                    <h4 className="tw-text-lg md:tw-text-xl tw-font-bold tw-text-gray-900 tw-mb-1 tw-mt-0">Power Style Playbook</h4>
                    <p className="tw-text-sm md:tw-text-base tw-text-gray-600">
                      Building executive presence through workplace styling, body language, and confident self-presentation
                    </p>
                  </div>
                </div>
              </div>

              <div className="tw-bg-white tw-rounded-2xl tw-p-4 md:tw-p-6 tw-shadow-lg tw-border-l-4 tw-border-orange-500">
                <div className="tw-flex tw-items-start tw-space-x-3 md:tw-space-x-4">
                  <div className="tw-w-10 tw-h-10 md:tw-w-12 md:tw-h-12 tw-bg-orange-100 tw-rounded-xl tw-flex tw-items-center tw-justify-center tw-flex-shrink-0">
                    <i className="fa-solid fa-heart-pulse tw-text-orange-500 tw-text-xl"></i>
                  </div>
                  <div>
                    <h4 className="tw-text-lg md:tw-text-xl tw-font-bold tw-text-gray-900 tw-mb-1 tw-mt-0">Mind & Body Wellness</h4>
                    <p className="tw-text-sm md:tw-text-base tw-text-gray-600">
                      Master your mental clarity and physical vitality to succeed sustainably - not just professionally, but personally.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
