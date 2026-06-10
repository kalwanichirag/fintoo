import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container, CTAButton, Section } from "./shared";

gsap.registerPlugin(ScrollTrigger);

const offerings = [
  {
    key: "equity",
    label: "Equity",
    tone: "equity",
    accent: "#f5c28b",
    items: [
      { icon: "fa-chart-line", title: "Equity Revival Strategy", text: "Multi-cap mutual fund strategy for market outperformance" },
      { icon: "fa-arrow-trend-up", title: "Alpha Focus Strategy", text: "Small and mid-cap mutual funds for high-growth alpha" },
      { icon: "fa-sparkles", title: "Constellation Fund (AIF)", text: "A multi-manager Category III AIF of top boutique funds" },
    ],
  },
  {
    key: "fixed",
    label: "Fixed Income",
    tone: "fixed",
    accent: "#67e8f9",
    items: [
      { icon: "fa-leaf", title: "Dynamic Debt+ Strategy", text: "Bonds plus REITs and InvITs for inflation-beating returns" },
      { icon: "fa-coins", title: "Liquid Strategy", text: "Flexible low-risk parking for surplus cash" },
      { icon: "fa-rotate", title: "Arbitrage Strategy", text: "Tax-efficient parking for short-term cash" },
    ],
  },
  {
    key: "others",
    label: "Others",
    tone: "others",
    accent: "#a5b4fc",
    items: [
      { icon: "fa-layer-group", title: "SHINE Strategy", text: "Gold and Silver ETFs for hedging market risk" },
      { icon: "fa-building", title: "Infra Yield Strategy", text: "Diversified income from infrastructure assets" },
      { icon: "fa-chart-pie", title: "SmartTax Balanced Growth", text: "Diversified multi-asset growth portfolio" },
    ],
  },
];

export default function OfferingsSection() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const trackRef = useRef(null);
  const triggerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const activeIndex = Math.min(offerings.length - 1, Math.round(progress * (offerings.length - 1)));

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const track = trackRef.current;

    if (!section || !pin || !track || window.matchMedia("(max-width: 767px)").matches) return undefined;

    const ctx = gsap.context(() => {
      gsap.set(track, { xPercent: 0 });

      triggerRef.current = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${window.innerWidth * (offerings.length - 1)}`,
        pin,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        animation: gsap.to(track, {
          xPercent: -((offerings.length - 1) * 100) / offerings.length,
          ease: "none",
        }),
        onUpdate: (self) => setProgress(self.progress),
      });
    }, section);

    return () => {
      triggerRef.current = null;
      ctx.revert();
    };
  }, []);

  const scrollToOffering = (index) => {
    const trigger = triggerRef.current;

    if (!trigger) return;
    const targetProgress = index / (offerings.length - 1);
    window.scrollTo({
      top: trigger.start + (trigger.end - trigger.start) * targetProgress,
      behavior: "smooth",
    });
  };

  return (
    <Section id="offerings" ref={sectionRef} className="pms-offerings-section tw-overflow-hidden">
      <div className="pms-offerings-pin" ref={pinRef}>
        <Container className="tw-h-full">
          <div className="tw-flex tw-h-full tw-flex-col tw-justify-center">
            <div className="tw-mb-8 tw-space-y-6 tw-text-center md:tw-mb-10">
              <h2 className="tw-m-0 tw-text-4xl tw-font-extrabold tw-leading-tight md:tw-text-5xl">
                <span className="tw-font-light">We offer</span> different investment solutions
              </h2>
              <div className="tw-inline-flex tw-rounded-full tw-border tw-border-solid tw-border-white/5 tw-bg-[#111] tw-p-1.5">
                {offerings.map((offering, index) => (
                  <button
                    type="button"
                    onClick={() => scrollToOffering(index)}
                    className={`tw-rounded-full tw-border-0 tw-px-4 tw-py-3 tw-text-sm tw-font-semibold tw-transition md:tw-px-8 ${activeIndex === index ? "tw-bg-white tw-text-black" : "tw-bg-transparent tw-text-white/50 hover:tw-text-white"}`}
                    key={offering.key}
                  >
                    {offering.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="pms-offerings-window">
              <div className="pms-offerings-track" ref={trackRef}>
                {offerings.map((offering) => (
                  <OfferingPanel offering={offering} key={offering.key} />
                ))}
              </div>
            </div>
            <div className="tw-mt-8 tw-text-center">
              <CTAButton className="tw-px-10 tw-py-5">Talk to us to know more</CTAButton>
            </div>
          </div>
        </Container>
      </div>
    </Section>
  );
}

function OfferingPanel({ offering }) {
  return (
    <div className="pms-offering-panel">
      <div className="pms-offering-card tw-rounded-[2rem] tw-border tw-border-solid tw-border-white/5 tw-bg-[#0f0f10] tw-p-6 tw-shadow-2xl md:tw-rounded-[3rem] md:tw-p-12 lg:tw-p-16">
        <div className="tw-grid tw-grid-cols-1 tw-items-center tw-gap-10 lg:tw-grid-cols-2 lg:tw-gap-12">
          <div className="tw-space-y-8 md:tw-space-y-10">
            {offering.items.map((item) => (
              <OfferingItem icon={item.icon} title={item.title} text={item.text} key={item.title} />
            ))}
          </div>
          <div className="tw-flex tw-justify-center">
            <div className="tw-relative tw-h-[240px] tw-w-full tw-max-w-[400px] tw-overflow-hidden tw-rounded-[40px] tw-border tw-border-solid tw-border-white/10 tw-bg-black md:tw-h-[360px] lg:tw-h-[400px]">
              <div className={`tw-absolute tw-inset-0 tw-bg-gradient-to-t ${offering.tone === "fixed" ? "tw-from-cyan-300/30" : offering.tone === "others" ? "tw-from-indigo-300/30" : "tw-from-orange-300/30"} tw-to-transparent`} />
              <svg className="tw-absolute tw-bottom-0 tw-left-0 tw-h-full tw-w-full" viewBox="0 0 400 400" role="img" aria-label={`${offering.label} investment visual`}>
                <path d="M0 300 Q100 180 200 240 T400 40" stroke={offering.accent} strokeWidth="6" fill="none" strokeLinecap="round" />
              </svg>
              <div className="pms-orbit tw-absolute tw-left-[42%] tw-top-[42%] tw-flex tw-h-16 tw-w-16 tw-items-center tw-justify-center tw-rounded-full tw-bg-white tw-text-3xl tw-font-bold tw-text-black tw-shadow-[0_0_60px_rgba(255,255,255,0.35)]">
                {offering.tone === "fixed" ? "₹" : ""}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OfferingItem({ icon, title, text }) {
  return (
    <div className="tw-flex tw-gap-5">
      <i className={`fa-solid ${icon} tw-mt-1 tw-text-3xl tw-text-white/40`} />
      <div>
        <h3 className="tw-mb-3 tw-mt-0 tw-text-2xl tw-font-bold md:tw-text-4xl">{title}</h3>
        <p className="tw-m-0 tw-text-lg tw-leading-relaxed tw-text-white/70 md:tw-text-2xl">{text}</p>
      </div>
    </div>
  );
}
