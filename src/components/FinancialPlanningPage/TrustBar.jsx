import React from "react";
import Slider from "react-slick";

const TrustBar = () => {
  const items = [
    {
      icon: "fas fa-flag tw-text-orange-500",
      text: "India's Most Trusted",
    },
    {
      icon: "fas fa-graduation-cap tw-text-blue-500",
      text: "Certified Planners",
    },
    {
      icon: "fas fa-chart-bar tw-text-green-500",
      text: "Goal-Based Investing",
    },
    {
      icon: "fas fa-award tw-text-purple-500",
      text: "Top Advisory Firm",
    },
  ];

  // Slider config (mobile only)
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 1200,
    slidesToShow: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    pauseOnHover: false,
    swipeToSlide: true,
  };

  return (
    <section
      id="trust-bar"
      className="tw-bg-white tw-border-b tw-border-gray-200 tw-py-6 tw-overflow-hidden"
    >
      <div className="tw-container tw-mx-auto tw-px-6">
        {/* Desktop & Tablet: Static Row */}
        <div className="tw-hidden md:tw-flex tw-flex-wrap tw-items-center tw-justify-center tw-space-x-8 tw-text-gray-600">
          {items.map((item, index) => (
            <div
              key={index}
              className="tw-flex tw-items-center tw-space-x-2 tw-text-base"
            >
              <i className={item.icon}></i>
              <span className="tw-font-medium">{item.text}</span>
            </div>
          ))}
        </div>

        {/* Mobile: React Slick Slider */}
        <div className="md:tw-hidden">
          <Slider {...sliderSettings}>
            {items.map((item, index) => (
              <div key={index} className="tw-text-center">
                <div className="tw-flex tw-items-center tw-justify-center tw-space-x-2 tw-text-gray-600">
                  <i className={item.icon}></i>
                  <span className="tw-font-medium">{item.text}</span>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
