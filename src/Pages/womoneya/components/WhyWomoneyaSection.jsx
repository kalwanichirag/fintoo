import { WHY_WOMONEYA_ITEMS } from "../constants";

export default function WhyWomoneyaSection() {
  return (
    <section id="why-womoneya" className="tw-py-10 md:tw-py-16 tw-bg-gradient-to-br tw-from-gray-50 tw-to-purple-50">
      <div className="tw-max-w-7xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8">
        <div className="tw-text-center tw-mb-10 md:tw-mb-16">
          <h2 className="font-display tw-text-3xl md:tw-text-5xl tw-font-bold tw-text-gray-900 tw-mb-6">Why This Matters for Your Organization</h2>
          <p className="tw-text-base md:tw-text-xl tw-text-gray-600 tw-max-w-3xl tw-mx-auto">
            Investing in Womoneya 3.0 is more than a Women's Day celebration-it's a strategic commitment to your workforce
          </p>
        </div>

        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6 md:tw-gap-8 tw-mb-10 md:tw-mb-16">
          {WHY_WOMONEYA_ITEMS.map((item) => (
            <div key={item.title} className="tw-bg-white tw-rounded-3xl tw-p-5 md:tw-p-10 tw-shadow-xl hover:tw-shadow-2xl tw-transition">
              <div className="tw-flex tw-items-start tw-space-x-4 md:tw-space-x-6">
                <div className={`tw-w-14 tw-h-14 md:tw-w-20 md:tw-h-20 tw-bg-gradient-to-br ${item.bg} tw-rounded-2xl tw-flex tw-items-center tw-justify-center tw-flex-shrink-0`}>
                  <i className={`fa-solid ${item.icon} tw-text-white tw-text-xl md:tw-text-3xl`}></i>
                </div>
                <div>
                  <h3 className="tw-text-lg md:tw-text-2xl tw-font-bold tw-text-gray-900 tw-mb-2 tw-pb-0">{item.title}</h3>
                  <p className="tw-text-sm md:tw-text-base tw-text-gray-700 tw-leading-relaxed tw-mb-0">{item.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
