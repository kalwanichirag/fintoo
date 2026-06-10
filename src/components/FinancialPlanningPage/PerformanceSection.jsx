import React from "react";
import Slider from "react-slick";

const PerformanceSection = () => {
  // Slider settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
      arrows: false,
    responsive: [
      {
        breakpoint: 768, // mobile
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
       
        },
      },
      {
        breakpoint: 1024, // tablet
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Performance data
  const performanceData = [
    {
      value: "14.8%",
      color: "tw-text-blue-600",
      title: "Average Annualized Return",
      sub: "+3.2% vs Market",
      subColor: "tw-text-green-600",
    },
    {
      value: "₹4000Cr+",
      color: "tw-text-green-600",
      title: "Assets Under Tracking",
      sub: "Growing 25% YoY",
      subColor: "tw-text-blue-600",
    },
    {
      value: "2,50,000+",
      color: "tw-text-purple-600",
      title: "Happy Clients",
      sub: "97% Retention Rate",
      subColor: "tw-text-green-600",
    },
    {
      value: "20+",
      color: "tw-text-orange-600",
      title: "Years Experience",
      sub: "Market Leadership",
      subColor: "tw-text-purple-600",
    },
  ];

  return (
    <section id="performance" className="tw-py-20 tw-bg-gray-50">
      <div className="tw-container tw-mx-auto tw-px-6">
        <div className="tw-text-center tw-mb-16">
          <h2 className="tw-text-4xl tw-font-bold tw-text-gray-800 tw-mb-4">
            Our Portfolio Performance Speaks for Itself
          </h2>
          <p className="tw-text-lg tw-text-gray-600 tw-max-w-3xl tw-mx-auto">
            Consistent outperformance and superior risk-adjusted returns across
            different market cycles and investment categories.
          </p>
        </div>

        {/* Grid for desktop, slider for mobile */}
        <div className="tw-hidden md:tw-grid md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-8">
          {performanceData.map((item, index) => (
            <div
              key={index}
              className="tw-bg-white  tw-p-6 tw-text-center tw-rounded-2xl tw-shadow-lg hover-lift"
            >
              <div
                className={`tw-text-3xl tw-font-bold ${item.color} tw-mb-2`}
              >
                {item.value}
              </div>
              <div className="tw-text-sm tw-text-gray-600 tw-mb-1">
                {item.title}
              </div>
              <div className={`tw-text-xs ${item.subColor}`}>{item.sub}</div>
            </div>
          ))}
        </div>

        {/* Mobile slider */}
        <div className="tw-block md:tw-hidden">
          <Slider {...settings}>
            {performanceData.map((item, index) => (
              <div key={index} className="tw-px-3">
                <div className="tw-bg-white tw-border tw-border-solid tw-border-[#e9e9e9] tw-p-6 tw-text-center tw-rounded-2xl ">
                  <div
                    className={`tw-text-3xl tw-font-bold ${item.color} tw-mb-2`}
                  >
                    {item.value}
                  </div>
                  <div className="tw-text-sm tw-text-gray-600 tw-mb-1">
                    {item.title}
                  </div>
                  <div className={`tw-text-xs ${item.subColor}`}>{item.sub}</div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default PerformanceSection;
