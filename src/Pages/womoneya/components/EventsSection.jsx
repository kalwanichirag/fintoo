import { GALLERY_IMAGES } from "../constants";

export default function EventsSection({ onBookSession }) {
  return (
    <section id="events" className="tw-py-10 md:tw-py-16 tw-bg-gradient-to-br tw-from-purple-50 tw-to-pink-50">
      <div className="tw-max-w-7xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8">
        <div className="tw-text-center tw-mb-10 md:tw-mb-16">
          <h2 className="font-display tw-text-3xl md:tw-text-5xl tw-font-bold tw-text-gray-900 tw-mb-6">Past Events Gallery</h2>
          <p className="tw-text-base md:tw-text-xl tw-text-gray-600 tw-max-w-3xl tw-mx-auto">
            Glimpses from Womoneya 1.0 and 2.0 - Celebrating women empowerment across India
          </p>
        </div>

        <div className="tw-grid tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-3 sm:tw-gap-4 tw-mb-10">
          {GALLERY_IMAGES.map((image, idx) => (
            <div key={image} className="tw-relative tw-group tw-overflow-hidden tw-rounded-2xl tw-shadow-lg hover:tw-shadow-2xl tw-transition tw-h-32 sm:tw-h-44 md:tw-h-56">
              <img
                className="tw-w-full tw-h-full tw-object-cover tw-transform group-hover:tw-scale-110 tw-transition tw-duration-500"
                src={image}
                alt={`Womoneya awards gallery image ${idx + 1}`}
              />
            </div>
          ))}
        </div>

        <div className="tw-bg-white tw-rounded-3xl tw-p-6 md:tw-p-12 tw-shadow-xl">
          <div className="tw-flex tw-flex-col lg:tw-flex-row tw-items-start lg:tw-items-center tw-gap-6 tw-justify-between">
            <div className="tw-flex-1 tw-w-full">
              <h3 className="tw-text-2xl md:tw-text-3xl tw-font-bold tw-text-gray-900 tw-mb-3 tw-pb-0 md:tw-mb-4">Watch Event Highlights</h3>
              <p className="tw-text-gray-700 tw-text-sm md:tw-text-lg tw-mb-0 md:tw-mb-6">
                See the impact and energy of Womoneya events through our curated video highlights showcasing transformational moments.
              </p>
            </div>
            <div className="tw-mt-0 lg:tw-mt-0 lg:tw-ml-12">
              <iframe
                className="tw-w-full tw-max-w-full lg:tw-w-96 tw-h-48 sm:tw-h-56 md:tw-h-64 tw-rounded-2xl tw-shadow-lg"
                src="https://www.youtube.com/embed/RBNYGHwmMDw"
                title="Womoneya Event Highlights"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>

        <div className="tw-bg-gradient-to-r tw-from-purple-600 tw-to-pink-500 tw-rounded-3xl tw-mt-10 tw-p-6 md:tw-p-12 tw-text-white tw-text-center">
          <h3 className="tw-text-2xl md:tw-text-4xl tw-font-bold tw-mb-0">This is not just a session - it is an investment in your women workforce.</h3>
          <p className="tw-text-sm md:tw-text-xl tw-mb-7 md:tw-mb-8 tw-max-w-3xl tw-mx-auto">
            Join leading organizations across India in making Women's Day 2026 a truly transformational experience for your team.
          </p>
          <button
            type="button"
            onClick={onBookSession}
            className="tw-bg-white tw-text-purple-600 tw-px-7 md:tw-px-12 tw-py-3 md:tw-py-4 tw-rounded-full tw-font-bold tw-text-sm md:tw-text-lg hover:tw-shadow-2xl tw-transition tw-transform hover:tw-scale-105 tw-inline-block"
          >
            Book Your Session Now
          </button>
        </div>
      </div>
    </section>
  );
}
