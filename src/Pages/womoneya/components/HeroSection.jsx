export default function HeroSection({ onBookSession, variant = "default" }) {
  const isAssociationVariant = variant === "association";

  return (
    <section
      id="hero-banner"
      className="tw-relative  tw-bg-gradient-to-br tw-from-purple-50 tw-via-pink-50 tw-to-orange-50 tw-overflow-hidden md:tw-py-12 md:tw-pt-24 tw-pt-8 tw-pb-10"
    >
   
      <div className="tw-max-w-7xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8 tw-h-full tw-flex tw-items-center tw-relative tw-z-10">
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4 md:tw-gap-6 lg:tw-gap-16 tw-items-center tw-w-full">
          <div className="tw-space-y-4 md:tw-space-y-8 tw-order-2 md:tw-order-1">
            <div className="md:tw-inline-block tw-hidden">
              <div className="tw-flex tw-items-center tw-flex-wrap tw-gap-3">
              <img
                src="https://www.fintoo.in/static/media/wp/Fintoologo_.svg"
                alt="Fintoo"
                className=" tw-w-auto tw-mb-6 tw-p-3 tw-bg-white tw-rounded-lg tw-shadow-md"
              />
              </div>
              {!isAssociationVariant ? (
                <div className="tw-bg-gradient-to-r tw-from-purple-600 tw-to-pink-500 tw-text-white tw-px-6 tw-py-2 tw-rounded-full tw-text-sm tw-font-semibold tw-tracking-wide">
                  A Women's Day Initiative For Corporates
                </div>
              ) : (
                <div className="tw-bg-gradient-to-r tw-from-purple-600 tw-to-pink-500 tw-text-white tw-px-5 tw-py-2.5 tw-rounded-2xl tw-text-sm tw-font-semibold tw-tracking-wide tw-flex tw-items-center tw-flex-wrap tw-gap-2">
                  <span>A Women's Day Initiative For Corporates</span>
             
                  <span className="tw-opacity-90 tw-font-medium">in association with</span>
                  <span className="tw-bg-white tw-rounded-md tw-px-2 tw-pb-1 tw-pt-2 tw-inline-flex tw-items-center">
                    <img
                      src="https://choiceindia.com/_next/static/media/logo-v-2.b890ec3e.svg"
                      alt="Choice India"
                      className="tw-h-6 sm:tw-h-7 tw-w-auto"
                    />
                  </span>
                </div>
              )}
            </div>

            <h1 className="font-display tw-text-4xl sm:tw-text-5xl md:tw-text-7xl tw-font-bold tw-leading-tight tw-text-gray-900">
              Womoneya <span className="gradient-text">3.0</span>
            </h1>

            <p className="tw-text-sm sm:tw-text-base tw-text-gray-700 tw-leading-relaxed tw-max-w-xl">
              Womoneya 3.0 is a powerful initiative dedicated to empowering women with the knowledge, confidence, and tools to take charge
              of their financial, professional, and personal growth.
              <br />
              <br />
              Bringing together expert-led sessions on financial planning, leadership presence, and holistic well-being, the platform is
              designed to help women thrive in every sphere of life.
              <br />
              <br />
              It is a celebration of ambition, independence, and the journey toward creating lasting impact - for themselves, their
              families, and the future.
            </p>

            <div className="tw-flex tw-flex-col sm:tw-flex-row tw-items-stretch sm:tw-items-center tw-gap-3 md:tw-gap-4 tw-pt-2 md:tw-pt-4">
              <button
                type="button"
                onClick={onBookSession}
                className="tw-bg-gradient-to-r tw-from-purple-600 tw-to-pink-500 tw-text-white tw-px-6 sm:tw-px-10 tw-py-3 sm:tw-py-4 tw-rounded-full tw-font-bold tw-text-sm sm:tw-text-base hover:tw-shadow-2xl tw-transition tw-transform hover:tw-scale-105 tw-flex tw-items-center tw-justify-center tw-space-x-2"
              >
                <span>Book a Session for Your Organization</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>

          <div className="tw-relative tw-order-1 md:tw-order-2 tw-mt-2 md:tw-mt-5">
             <div className="tw-inline-block md:tw-hidden tw-mb-6">
              <div className="tw-flex tw-items-center tw-flex-wrap tw-gap-3">
              <img
                src="https://www.fintoo.in/static/media/wp/Fintoologo_.svg"
                alt="Fintoo"
                className=" tw-w-auto tw-mb-6 tw-p-3 tw-bg-white tw-rounded-lg tw-shadow-md"
              />
              </div>
              {!isAssociationVariant ? (
                <div className="tw-bg-gradient-to-r tw-from-purple-600 tw-to-pink-500 tw-text-white tw-px-6 tw-py-2 tw-rounded-full tw-text-sm tw-font-semibold tw-tracking-wide">
                  A Women's Day Initiative For Corporates
                </div>
              ) : (
                <div className="tw-bg-gradient-to-r tw-from-purple-600 tw-to-pink-500 tw-text-white tw-px-5 tw-py-2.5 tw-rounded-2xl tw-text-sm tw-font-semibold tw-tracking-wide tw-flex tw-items-center tw-flex-wrap tw-gap-2">
                  <span>A Women's Day Initiative For Corporates</span>
             
                  <span className="tw-opacity-90 tw-font-medium">in association with</span>
                  <span className="tw-bg-white tw-rounded-md tw-px-2 tw-pb-1 tw-pt-2 tw-inline-flex tw-items-center">
                    <img
                      src="https://choiceindia.com/_next/static/media/logo-v-2.b890ec3e.svg"
                      alt="Choice India"
                      className="tw-h-6 sm:tw-h-7 tw-w-auto"
                    />
                  </span>
                </div>
              )}
            </div>

            <div className="tw-rounded-3xl "></div>
            <img
              className="tw-relative tw-w-full tw-h-full tw-rounded-3xl tw-shadow-2xl animate-float"
              src="static/media/womoneya/logo.jpg"
               
            />
          </div>
        </div>
      </div>

      <div className="tw-absolute tw-bottom-0 tw-left-0 tw-right-0 tw-h-32 tw-bg-gradient-to-t tw-from-white tw-to-transparent"></div>
    </section>
  );
}
