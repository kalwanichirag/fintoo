import React, { useState } from "react";

const ServicesSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const services = [
    {
      title: "Personal Financial Planning",
      icon: "fa-chart-pie",
      gradient: "tw-gradient-bg",
      description:
        "Comprehensive financial roadmaps tailored to your unique goals, risk profile, and life stage.",
      points: [
        "Goal-based planning",
        "Risk assessment",
        "Regular reviews",
      ],
    },
    {
      title: "Investment Consulting",
      icon: "fa-chart-line",
      gradient: "tw-gradient-orange",
      description:
        "Expert portfolio optimization and investment strategies to maximize your returns while managing risk.",
      points: [
        "Portfolio optimization",
        "Asset allocation",
        "Performance tracking",
      ],
    },
    {
      title: "Tax Planning & Savings",
      icon: "fa-calculator",
      gradient: "tw-bg-gradient-to-r tw-from-green-500 tw-to-green-600",
      description:
        "Strategic tax optimization to help you save more and invest better for long-term wealth creation.",
      points: [
        "Tax-saving investments",
        "Deduction optimization",
        "Compliance support",
      ],
    },
    {
      title: "Mutual Funds & Equity",
      icon: "fa-coins",
      gradient: "tw-bg-gradient-to-r tw-from-purple-500 tw-to-purple-600",
      description:
        "Direct mutual fund investments and equity strategies for optimal wealth building.",
      points: [
        "Direct fund investing",
        "SIP planning",
        "Fund selection",
      ],
    },
    {
      title: "Wealth Management",
      icon: "fa-shield-alt",
      gradient: "tw-bg-gradient-to-r tw-from-teal-500 tw-to-teal-600",
      description:
        "Comprehensive wealth preservation and growth strategies for high-net-worth individuals.",
      points: [
        "Estate planning",
        "Wealth protection",
        "Legacy planning",
      ],
    },
    {
      title: "Transparent Advisory",
      icon: "fa-handshake",
      gradient: "tw-bg-gradient-to-r tw-from-indigo-500 tw-to-indigo-600",
      description:
        "100% unbiased, commission-free advisory services with complete transparency in all recommendations.",
      points: [
        "No hidden fees",
        "Unbiased advice",
        "Full transparency",
      ],
    },
  ];

  const toggleService = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="services" className="tw-py-20 tw-bg-white">
      <div className="tw-container tw-mx-auto tw-px-6">
        {/* Header */}
        <div className="tw-text-center tw-mb-16">
          <h2 className="tw-text-4xl tw-font-bold tw-text-gray-800 tw-mb-4">
            What We Do Best
          </h2>
          <p className="tw-text-lg tw-text-gray-600 tw-max-w-2xl tw-mx-auto">
            Comprehensive financial solutions designed to help you achieve your wealth goals with confidence and clarity.
          </p>
        </div>

        {/* Services Grid */}
        <div className="tw-grid md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4 md:tw-gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="neumorphic tw-p-6 tw-rounded-2xl tw-transition-all tw-duration-300 hover-lift tw-cursor-pointer"
            >
              {/* Header (icon + title) */}
              <div
                className="tw-flex tw-items-center tw-justify-between md:tw-block"
                onClick={() => toggleService(index)}
              >
                <div className="tw-flex tw-items-center tw-space-x-2 md:tw-space-x-4">
                  <div
                    className={`tw-w-14 tw-h-14 ${service.gradient} tw-rounded-2xl tw-flex tw-items-center tw-justify-center`}
                  >
                    <i className={`fas ${service.icon} tw-text-white tw-text-xl`}></i>
                  </div>
                  <h3 className="tw-text-lg tw-mb-0 tw-pb-0 md:tw-text-xl tw-font-bold tw-text-gray-800">
                    {service.title}
                  </h3>
                </div>

                {/* Mobile Toggle Icon */}
                <i
                  className={`fas fa-chevron-down tw-text-gray-500 md:tw-hidden tw-transition-transform ${
                    openIndex === index ? "tw-rotate-180" : ""
                  }`}
                ></i>
              </div>

              {/* Collapsible Content */}
              <div
                className={`tw-overflow-hidden tw-transition-all tw-duration-500 md:tw-max-h-none ${
                  openIndex === index
                    ? "tw-max-h-96 tw-mt-4"
                    : "tw-max-h-0 md:tw-max-h-full md:tw-mt-6"
                }`}
              >
                <p className="tw-text-gray-600 tw-mb-4 tw-mt-4 md:tw-mt-0">
                  {service.description}
                </p>
                <ul className="tw-space-y-2 tw-text-sm tw-text-gray-600">
                  {service.points.map((point, i) => (
                    <li
                      key={i}
                      className="tw-flex tw-items-center tw-space-x-2"
                    >
                      <i className="fas fa-check tw-text-green-500"></i>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
