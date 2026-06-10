import React, { useRef, useState } from "react";
import Slider from "react-slick";
import { MotionReveal, PlannerIcon, SectionHeader } from "./PlannerShared";
import { benefits } from "./plannerData";

export default function BenefitsSection() {
  const sliderRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    afterChange: (current) => setActiveSlide(current),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="tw-bg-fintoo-blue tw-px-[8%] tw-py-[80px] max-md:tw-px-[5%] max-md:tw-py-[50px]" id="benefits">
      <MotionReveal>
                            <img src="/static/media/wp/Fintoowhitelogo_.svg" alt="Fintoo Logo" className="tw-h-10 tw-mb-4 tw-w-auto" />

        <SectionHeader
          tag="Benefits of Retirement Planning"
          dark
          title={
            <>
              Everything a Good Retirement
              <br />
              Plan Does for You
            </>
          }
          subtitle="Retirement planning with Fintoo is not just about accumulating wealth — it's about designing the life you want after 60."
        />
      </MotionReveal>

      <MotionReveal className="tw-mt-[50px] tw--mx-[11px]" delay={60} y={18} scale={0.99} duration={520}>
        <Slider ref={sliderRef} {...settings}>
          {benefits.map((benefit) => (
            <div key={benefit.title} className="tw-px-[11px]">
              <div className="tw-min-h-[250px] tw-rounded-[14px] tw-border tw-border-white/10 tw-bg-white/5 tw-p-[26px] tw-transition hover:tw--translate-y-[3px] hover:tw-bg-fintoo-orange/10">
                <div className="tw-mb-5 tw-flex tw-h-12 tw-w-12 tw-items-center tw-justify-center tw-rounded-full tw-bg-fintoo-orange tw-text-white">
                  <PlannerIcon type={benefit.icon} className="tw-h-5 tw-w-5" />
                </div>
                <h4 className="tw-mb-2 tw-text-base tw-font-semibold tw-text-white">{benefit.title}</h4>
                <p className="tw-text-sm tw-leading-[1.6] tw-text-white/55">{benefit.text}</p>
              </div>
            </div>
          ))}
        </Slider>
      </MotionReveal>

      <MotionReveal className="tw-mt-8 tw-flex tw-justify-center tw-gap-3" delay={120} y={8} scale={1} duration={420}>
        {benefits.map((benefit, index) => {
          const isActive = index === activeSlide;

          return (
            <button
              key={benefit.title}
              type="button"
              onClick={() => sliderRef.current?.slickGoTo(index)}
              aria-label={`Go to benefit slide ${index + 1}`}
              className={[
                "tw-h-2.5 tw-w-2.5 tw-rounded-full tw-transition-all",
                isActive ? "tw-bg-fintoo-orange tw-scale-110" : "tw-bg-white/30 hover:tw-bg-white/50",
              ].join(" ")}
            />
          );
        })}
      </MotionReveal>
    </section>
  );
}
