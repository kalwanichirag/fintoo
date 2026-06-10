import { TESTIMONIALS } from "../constants";

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="tw-py-10 md:tw-py-16 tw-bg-white">
      <div className="tw-max-w-7xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8">
        <div className="tw-text-center tw-mb-10 md:tw-mb-16">
          <h2 className="font-display tw-text-3xl md:tw-text-5xl tw-font-bold tw-text-gray-900 tw-mb-6">What Organizations Are Saying</h2>
          <p className="tw-text-base md:tw-text-xl tw-text-gray-600 tw-max-w-3xl tw-mx-auto">
            Hear from HR leaders and participants who experienced Womoneya in previous editions
          </p>
        </div>

        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6 md:tw-gap-8 tw-mb-12">
          {TESTIMONIALS.map((item) => (
            <div key={item.name} className={`tw-bg-gradient-to-br ${item.bg} tw-to-white tw-rounded-3xl tw-p-5 md:tw-p-8 tw-shadow-lg hover:tw-shadow-xl tw-transition`}>
              <div className="tw-flex tw-space-x-1 tw-mb-4">
                <i className="fa-solid fa-star tw-text-yellow-400"></i>
                <i className="fa-solid fa-star tw-text-yellow-400"></i>
                <i className="fa-solid fa-star tw-text-yellow-400"></i>
                <i className="fa-solid fa-star tw-text-yellow-400"></i>
                <i className="fa-solid fa-star tw-text-yellow-400"></i>
              </div>
              <p className="tw-text-sm md:tw-text-base tw-text-gray-700 tw-leading-relaxed tw-mb-5 md:tw-mb-6">{item.quote}</p>
              <div className="tw-font-bold tw-text-gray-900 tw-text-sm md:tw-text-base">{item.name}</div>
              <div className="tw-text-sm tw-text-gray-600">{item.role}</div>
            </div>
          ))}
        </div>

        <div className="tw-bg-gradient-to-r tw-from-purple-100 tw-to-pink-100 tw-rounded-3xl tw-p-6 md:tw-p-10 tw-text-center">
          <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-3 tw-gap-6 sm:tw-gap-8 tw-mb-6">
            <div>
              <div className="tw-text-3xl sm:tw-text-4xl md:tw-text-5xl tw-font-bold tw-text-purple-600">98%</div>
              <div className="tw-text-sm md:tw-text-base tw-text-gray-700 tw-font-medium">Satisfaction Rate</div>
            </div>
            <div>
              <div className="tw-text-3xl sm:tw-text-4xl md:tw-text-5xl tw-font-bold tw-text-pink-500">5,000+</div>
              <div className="tw-text-sm md:tw-text-base tw-text-gray-700 tw-font-medium">Women Empowered</div>
            </div>
            <div>
              <div className="tw-text-3xl sm:tw-text-4xl md:tw-text-5xl tw-font-bold tw-text-blue-500">150+</div>
              <div className="tw-text-sm md:tw-text-base tw-text-gray-700 tw-font-medium">Corporate Tieups</div>
            </div>
          </div>
          <p className="tw-text-gray-700 tw-text-sm md:tw-text-lg tw-mb-0">Join the growing community of organizations making a real difference</p>
        </div>
      </div>
    </section>
  );
}
