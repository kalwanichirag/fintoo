import React from "react";
import Slider from "react-slick";
import {
  FiSearch,
  FiBarChart2,
  FiTarget,
  FiCheckCircle,
} from "react-icons/fi";

const steps = [
  {
    num: "01",
    icon: FiSearch,
    title: "Discovery Session",
    copy: "A dedicated consultation with a senior tax expert to understand your income streams, investments, business interests, and financial objectives.",
  },
  {
    num: "02",
    icon: FiBarChart2,
    title: "Deep Analysis",
    copy: "Comprehensive review of salary, capital gains, ESOPs, foreign assets, business income, deductions, and disclosure obligations.",
  },
  {
    num: "03",
    icon: FiTarget,
    title: "Tax Strategy",
    copy: "A personalized roadmap covering tax regime selection, optimization opportunities, advance tax planning, and compliance safeguards.",
  },
  {
    num: "04",
    icon: FiCheckCircle,
    title: "Accurate Filing",
    copy: "End-to-end ITR preparation and filing with expert review, complete disclosures, and year-round advisory support.",
  },
];

const processSliderSettings = {
  dots: true,
  arrows: false,
  infinite: false,
  speed: 400,
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: true,
};

const StepCard = ({ step }) => {
  const Icon = step.icon;

  return (
    <article className="group tw-relative tw-overflow-hidden tw-rounded-3xl tw-border tw-border-white/10 tw-bg-white/[0.04] tw-p-5 tw-backdrop-blur-xl tw-transition-all tw-duration-300 hover:-tw-translate-y-2 hover:tw-border-fintoo-orange/40 md:tw-p-8">
      <div className="tw-absolute tw-right-0 tw-top-0 tw-h-32 tw-w-32 tw-rounded-full tw-bg-fintoo-orange/10 tw-blur-3xl tw-opacity-0 tw-transition-opacity group-hover:tw-opacity-100" />

      <div className="tw-absolute tw-right-5 tw-top-4 tw-text-7xl tw-font-black tw-leading-none tw-text-white/[0.03] md:tw-text-8xl">
        {step.num}
      </div>

      <div className="tw-relative tw-z-10 tw-flex tw-h-12 tw-w-12 tw-items-center tw-justify-center tw-rounded-2xl tw-border tw-border-fintoo-orange/20 tw-bg-fintoo-orange/10 md:tw-h-16 md:tw-w-16">
        <Icon className="tw-text-xl tw-text-fintoo-orange md:tw-text-2xl" />
      </div>

      <div className="tw-mt-4 tw-h-1 tw-w-10 tw-rounded-full tw-bg-fintoo-orange md:tw-mt-6 md:tw-w-12" />

      <h3 className="tw-m-0 tw-mt-4 tw-font-dmserif1 tw-text-xl tw-font-bold tw-text-white md:tw-mt-5 md:tw-text-2xl">
        {step.title}
      </h3>

      <p className="tw-m-0 tw-mt-3 tw-text-sm tw-leading-6 tw-text-white/70 md:tw-mt-4 md:tw-leading-7">
        {step.copy}
      </p>
    </article>
  );
};

export default function ProcessSection() {
  return (
    <section
      id="process"
      className="tw-relative tw-overflow-hidden tw-bg-[#021d44] tw-px-4 tw-py-14 md:tw-px-8 md:tw-py-28"
    >
      {/* Background Glow */}
      <div className="tw-absolute tw-left-1/2 tw-top-0 tw-h-96 tw-w-96 -tw-translate-x-1/2 tw-rounded-full tw-bg-fintoo-orange/10 tw-blur-3xl" />

      <div className="tw-relative tw-mx-auto tw-max-w-7xl">
        {/* Heading */}
        <div className="tw-text-center">
          <div className="tw-mb-3 tw-inline-flex tw-items-center tw-gap-2 tw-rounded-full tw-border tw-border-fintoo-orange/20 tw-bg-fintoo-orange/10 tw-px-4 tw-py-2 tw-text-xs tw-font-bold tw-uppercase tw-tracking-widest tw-text-fintoo-orange md:tw-mb-4">
            How It Works
          </div>

          <h2 className="tw-m-0 tw-font-dmserif1 tw-text-3xl tw-font-black tw-leading-tight tw-text-white md:tw-text-6xl">
            From Complexity
            <span className="tw-block tw-text-fintoo-orange">
              to Complete Clarity
            </span>
          </h2>

          <p className="tw-mx-auto tw-mt-3 tw-max-w-2xl tw-text-sm tw-leading-6 tw-text-white/70 md:tw-mt-5 md:tw-text-lg md:tw-leading-8">
            A structured advisory process designed for professionals,
            founders, investors, NRIs, and individuals with complex tax
            situations.
          </p>
        </div>

        {/* Cards */}
        <div className="tw-mt-8 md:tw-hidden">
          <Slider {...processSliderSettings} className="itr-process-slider">
            {steps.map((step) => (
              <div key={step.title} className="tw-px-1 tw-pb-8">
                <StepCard step={step} />
              </div>
            ))}
          </Slider>
        </div>

        <div className="tw-hidden md:tw-mt-20 md:tw-grid md:tw-gap-6 md:tw-grid-cols-2 lg:tw-grid-cols-4">
          {steps.map((step) => (
            <StepCard key={step.title} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
}
