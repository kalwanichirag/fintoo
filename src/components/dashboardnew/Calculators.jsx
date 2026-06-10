import React, { useEffect, useRef, useState } from "react";
import {
  FaMoneyBillTrendUp,
  FaSackDollar,
  FaGlobe,
} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export default function CalculatorsPreview() {
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const cards = [
    {
      icon: <FaMoneyBillTrendUp className="tw-text-white" />,
      title: "Tax Planning",
      desc: "Optimize tax savings with expert advice.",
      link: "/tax-planning-page",
    },
    {
      icon: <FaSackDollar className="tw-text-white" />,
      title: "Mutual Fund At Zero Cost",
      desc: "Invest in 2500+ mutual funds at 0% commission.",
      link: "/direct-mutual-fund/funds/all",
    },
    {
      icon: <FaGlobe className="tw-text-white" />,
      title: "Global Investment",
      desc: "Invest globally with confidence, backed by our expert advisory team.",
      link: "/international-equity",
    },
  ];

  useEffect(() => {
    const container = sliderRef.current;
    if (!container) return;

    const isMobile = () => window.innerWidth < 768;

    const intervalId = setInterval(() => {
      if (!isMobile()) return;
      const next = (activeSlide + 1) % cards.length;
      container.scrollTo({
        left: next * container.clientWidth,
        behavior: "smooth",
      });
    }, 3500);

    return () => clearInterval(intervalId);
  }, [activeSlide, cards.length]);

  const handleSliderScroll = () => {
    const container = sliderRef.current;
    if (!container || !container.clientWidth) return;
    const nextIndex = Math.round(container.scrollLeft / container.clientWidth);
    if (nextIndex !== activeSlide) {
      setActiveSlide(nextIndex);
    }
  };

  return (
    <section id="calculators-preview" className="tw-mb-4 md:tw-mb-8">
      <div className="tw-bg-white tw-border-solid  tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-200">

        {/* Header */}
        <div className="tw-p-4 md:tw-p-6 !tw-pb-0">
          <div className="tw-flex tw-items-center tw-justify-between">
            <h2 className="tw-text-lg md:tw-text-xl tw-font-bold tw-text-navy tw-font-display tw-text-slate-900">
              Investment & Planning Solutions
            </h2>
          </div>
        </div>

        {/* Cards */}
        <div className="tw-p-4 md:tw-p-6 tw-pt-3 md:tw-pt-4">
          <div
            ref={sliderRef}
            onScroll={handleSliderScroll}
            className="tw-flex tw-gap-3 tw-overflow-x-auto tw-snap-x tw-snap-mandatory md:tw-grid md:tw-grid-cols-3 md:tw-gap-4 md:tw-overflow-visible"
          >
            {cards.map((item, idx) => (
              <div
                key={idx}
                 onClick={() => navigate(item.link)}
                className="tw-min-w-full tw-snap-start tw-bg-white tw-rounded-lg tw-p-4 tw-border tw-border-solid tw-border-gray-200 tw-shadow-sm tw-transition tw-duration-200 hover:tw-shadow-md tw-cursor-pointer md:tw-min-w-0"
              >
                <div className="tw-flex tw-items-center tw-mb-3">
                  <div className="tw-p-2 tw-bg-fintoo-blue tw-rounded-lg tw-mr-3">
                    {item.icon}
                  </div>
                  <h3 className="tw-font-semibold tw-text-slate-900 tw-pb-0 tw-mb-0">{item.title}</h3>
                </div>

                <p className="tw-text-sm tw-text-gray-600 tw-mb-1">
                  {item.desc}
                </p>

                <div
                 
                  className="tw-text-sm tw-text-fintoo-orange tw-font-medium">
                  Learn More →
                </div>
              </div>
            ))}

          </div>

          <div className="tw-flex md:tw-hidden tw-items-center tw-justify-center tw-gap-1.5 tw-mt-3">
            {cards.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => {
                  setActiveSlide(idx);
                  sliderRef.current?.scrollTo({
                    left: idx * (sliderRef.current?.clientWidth || 0),
                    behavior: "smooth",
                  });
                }}
                className={`tw-h-1.5 tw-rounded-full tw-transition-all ${
                  activeSlide === idx
                    ? "tw-w-5 tw-bg-fintoo-blue"
                    : "tw-w-1.5 tw-bg-slate-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
