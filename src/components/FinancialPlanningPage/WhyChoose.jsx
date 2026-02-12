import React from "react";

const WhyChoose = ({ onBookClick }) => {
  return (
    <section id="why-choose" className="tw-py-20 tw-bg-white">
      <div className="tw-container tw-mx-auto tw-px-6">
        <div className="tw-grid lg:tw-grid-cols-2 tw-gap-16 tw-items-center">
          <div>
            <h2 className="tw-text-4xl tw-font-bold tw-text-gray-800 tw-mb-8">
              Why Professionals<br />
              <span className="tw-text-blue-600">Trust Fintoo</span>
            </h2>

            <div className="tw-space-y-6">
              <div className="tw-flex tw-items-start tw-space-x-4">
                <div className="tw-w-10 tw-h-10 tw-bg-blue-100 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-flex-shrink-0">
                  <i className="fas fa-trophy tw-text-blue-600"></i>
                </div>
                <div>
                  <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-2 tw-mt-0">
                    Highest-Rated Financial Planners
                  </h4>
                  <p className="tw-text-gray-600">
                    Serving professionals across Mumbai, Bangalore, Hyderabad, and pan-India with exceptional service quality.
                  </p>
                </div>
              </div>

              <div className="tw-flex tw-items-start tw-space-x-4">
                <div className="tw-w-10 tw-h-10 tw-bg-green-100 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-flex-shrink-0">
                  <i className="fas fa-user-tie tw-text-green-600"></i>
                </div>
                <div>
                  <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-2 tw-mt-0">
                    Personalized Service
                  </h4>
                  <p className="tw-text-gray-600">
                    Tailored solutions for high-income professionals and business owners with dedicated advisor support.
                  </p>
                </div>
              </div>

              <div className="tw-flex tw-items-start tw-space-x-4">
                <div className="tw-w-10 tw-h-10 tw-bg-purple-100 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-flex-shrink-0">
                  <i className="fas fa-chart-line tw-text-purple-600"></i>
                </div>
                <div>
                  <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-2 tw-mt-0">
                    Proven Track Record
                  </h4>
                  <p className="tw-text-gray-600">
                    Consistently delivering 3–5% higher returns vs. average market performance through strategic planning.
                  </p>
                </div>
              </div>

              <div className="tw-flex tw-items-start tw-space-x-4">
                <div className="tw-w-10 tw-h-10 tw-bg-orange-100 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-flex-shrink-0">
                  <i className="fas fa-handshake tw-text-orange-600"></i>
                </div>
                <div>
                  <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-2 tw-mt-0">
                    100% Unbiased Approach
                  </h4>
                  <p className="tw-text-gray-600">
                    Service-first philosophy with complete transparency and no hidden agendas or commission-based recommendations.
                  </p>
                </div>
              </div>
            </div>

            <div className="tw-mt-8 tw-p-6 tw-bg-gradient-to-r tw-from-blue-50 tw-to-orange-50 tw-rounded-2xl">
              <div className="tw-flex tw-items-center tw-justify-between">
                <div>
                  <h5 className="tw-font-semibold tw-text-gray-800">Ready to get started?</h5>
                  <p className="tw-text-sm tw-text-gray-600">Join thousands of satisfied clients</p>
                </div>
                <a onClick={onBookClick}
                  className="tw-text-sm tw-cursor-pointer   md:tw-text-base  tw-text-white tw-no-underline hover:tw-text-white tw-gradient-orange tw-text-white tw-px-6 tw-py-3 tw-rounded-full tw-font-semibold hover:tw-shadow-lg tw-transition-all tw-duration-300">
                  Book Your Free Appointment
                </a>
              </div>
            </div>
          </div>

          <div className="tw-relative">
            <img
              className="tw-w-full tw-h-auto tw-max-h-96 tw-object-cover tw-rounded-2xl tw-shadow-xl"
              src="/static/media/F12.jpg"
              alt="happy Indian clients with financial advisor, success meeting, professional office, celebration atmosphere"
            />

            <div className="tw-absolute -tw-top-4 -tw-right-4 neumorphic tw-p-4">
              <div className="tw-text-center">
                <div className="tw-text-2xl tw-font-bold tw-text-green-600">₹500Cr+</div>
                <div className="tw-text-sm tw-text-gray-600">Assets Under Management</div>
              </div>
            </div>

            <div className="tw-absolute -tw-bottom-4 -tw-left-4 tw-bg-white tw-rounded-lg tw-shadow-lg tw-p-4">
              <div className="tw-text-center">
                <div className="tw-text-2xl tw-font-bold tw-text-blue-600">97%</div>
                <div className="tw-text-sm tw-text-gray-600">Client Satisfaction</div>
              </div>
            </div>

            <div className="tw-absolute tw-top-1/2 md:-tw-right-8 -tw-right-0 tw-bg-orange-500 tw-text-white tw-rounded-2xl tw-p-4 tw-shadow-xl">
              <div className="tw-text-center">
                <div className="tw-text-lg tw-font-bold">4.9★</div>
                <div className="tw-text-xs">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  );
};

export default WhyChoose;
