import React, { useEffect, useRef, useState } from "react";
import { SectionHeader } from "./PlannerShared";
import { steps } from "./plannerData";

export default function ProcessSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      {
        threshold: 0.28,
        rootMargin: "0px 0px -12% 0px",
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="tw-bg-slate-50 tw-px-[8%] tw-py-[80px] max-md:tw-px-[5%] max-md:tw-py-[50px]"
      id="how-it-works"
    >
      <SectionHeader
        tag="Process"
        centered
        title="Your Retirement Plan in 4 Simple Steps"
        subtitle="From first conversation to comprehensive plan — we make retirement planning effortlessly simple."
      />

      <div className="tw-relative tw-mt-[50px] tw-grid tw-gap-6 sm:tw-grid-cols-2 xl:tw-grid-cols-4">
        <div className="tw-pointer-events-none tw-absolute tw-left-[14%] tw-right-[14%] tw-top-7 tw-hidden tw-h-[1.5px] tw-overflow-hidden xl:tw-block">
          <div
            className="tw-h-full tw-w-full tw-origin-left tw-transition-transform tw-duration-700 tw-ease-out"
            style={{
              background: "repeating-linear-gradient(90deg, #dd7300 0, #dd7300 8px, transparent 8px, transparent 20px)",
              transform: isVisible ? "scaleX(1)" : "scaleX(0)",
            }}
          />
        </div>
        {steps.map(([number, title, text]) => (
          <div
            key={number}
            className="tw-relative tw-z-[1] tw-text-center tw-transition-all tw-duration-700 tw-ease-out"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0px)" : "translateY(16px)",
              transitionDelay: `${Number(number) * 90}ms`,
            }}
          >
            <div
              className="tw-mx-auto tw-mb-4 tw-flex tw-h-14 tw-w-14 tw-items-center tw-justify-center tw-rounded-full tw-border-4 tw-border-white tw-bg-fintoo-blue tw-text-2xl tw-text-white tw-shadow-[0_0_0_2px_#dd7300] tw-transition-all tw-duration-400 tw-ease-out"
              style={{
                transform: isVisible ? "scale(1)" : "scale(0.96)",
                transitionDelay: `${80 + Number(number) * 90}ms`,
              }}
            >
              {number}
            </div>
            <h4 className="tw-mb-[6px] tw-text-base tw-font-semibold tw-text-fintoo-blue">{title}</h4>
            <p className="tw-text-sm tw-text-slate-500">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
