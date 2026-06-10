import React, { useRef, useState } from "react";
import Slider from "react-slick";
import { MotionReveal, PlannerIcon, SectionHeader } from "./PlannerShared";
import { whyFintoo } from "./plannerData";

export default function WhyFintooPointsSection() {
  const sliderRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const sliderSettings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 450,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (current) => setActiveSlide(current),
  };

  return (
    <section className="tw-bg-slate-50 tw-px-[8%] tw-py-[80px] max-md:tw-px-[5%] max-md:tw-py-[50px]" id="why-us">
      <MotionReveal>
        <SectionHeader
          tag="Why Fintoo"
          title={
            <>
              Why 2.5 Lakh+ Indians Trust
              <br />
              Fintoo with Their Retirement
            </>
          }
          subtitle="We're not just a calculator — we're a team of fiduciary advisors who act in your interest, not ours."
        />
      </MotionReveal>

      <div className="tw-mt-[50px] tw-hidden tw-gap-4 md:tw-grid md:tw-grid-cols-2 xl:tw-grid-cols-4">
        {whyFintoo.map(([title, text, icon], index) => (
          <MotionReveal key={title} delay={index * 50} y={14} scale={0.995} duration={460}>
            <div className="tw-flex tw-h-full tw-flex-col tw-rounded-[14px] tw-border tw-border-slate-200 tw-bg-white tw-p-[22px] tw-transition hover:tw-border-fintoo-orange/35 hover:tw-shadow-[0_6px_24px_rgba(4,43,98,0.08)]">
              <div className="tw-mb-4 tw-flex tw-h-[46px] tw-w-[46px] tw-items-center tw-justify-center tw-rounded-xl tw-bg-fintoo-blue tw-text-white">
                <PlannerIcon type={icon} className="tw-h-[22px] tw-w-[22px]" />
              </div>
              <h4 className="tw-mb-[5px] tw-text-base tw-font-semibold tw-text-fintoo-blue">{title}</h4>
              <p className="tw-text-sm tw-leading-[1.6] tw-text-slate-500">{text}</p>
            </div>
          </MotionReveal>
        ))}
      </div>

      <div className="tw-mt-[40px] md:tw-hidden">
        <MotionReveal className="tw--mx-[10px]" delay={70} y={16} scale={0.995} duration={460}>
          <Slider ref={sliderRef} {...sliderSettings}>
            {whyFintoo.map(([title, text, icon]) => (
              <div key={title} className="tw-px-[10px]">
                <div className="tw-flex tw-min-h-[220px] tw-flex-col tw-rounded-[14px] tw-border tw-border-slate-200 tw-bg-white tw-p-[22px]">
                  <div className="tw-mb-4 tw-flex tw-h-[46px] tw-w-[46px] tw-items-center tw-justify-center tw-rounded-xl tw-bg-fintoo-blue tw-text-white">
                    <PlannerIcon type={icon} className="tw-h-[22px] tw-w-[22px]" />
                  </div>
                  <h4 className="tw-mb-[5px] tw-text-base tw-font-semibold tw-text-fintoo-blue">{title}</h4>
                  <p className="tw-text-sm tw-leading-[1.6] tw-text-slate-500">{text}</p>
                </div>
              </div>
            ))}
          </Slider>
        </MotionReveal>

        <MotionReveal className="tw-mt-6 tw-flex tw-justify-center tw-gap-3" delay={120} y={8} scale={1} duration={420}>
          {whyFintoo.map(([title], index) => {
            const isActive = index === activeSlide;

            return (
              <button
                key={title}
                type="button"
                onClick={() => sliderRef.current?.slickGoTo(index)}
                aria-label={`Go to Why Fintoo slide ${index + 1}`}
                className={[
                  "tw-h-2.5 tw-w-2.5 tw-rounded-full tw-transition-all",
                  isActive ? "tw-bg-fintoo-orange tw-scale-110" : "tw-bg-fintoo-blue/20 hover:tw-bg-fintoo-blue/35",
                ].join(" ")}
              />
            );
          })}
        </MotionReveal>
      </div>
    </section>
  );
}
