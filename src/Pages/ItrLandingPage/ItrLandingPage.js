import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../components/Insurance/tailwind.css";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import MarqueeSection from "./components/MarqueeSection";
import ServeSection from "./components/ServeSection";
import ProcessSection from "./components/ProcessSection";
import ServicesSection from "./components/ServicesSection";
import ComparisonSection from "./components/ComparisonSection";
import MetricsSection from "./components/MetricsSection";
import TrustSection from "./components/TrustSection";
import TeamSection from "./components/TeamSection";
import FaqSection from "./components/FaqSection";
import BookingSection from "./components/BookingSection";
import Footer from "./components/Footer";
import Disclaimer from "../../components/retirement-planning/Disclaimer";
import CorporateTaxSolutions from "./components/CorporateTaxSolutions";

gsap.registerPlugin(ScrollTrigger);

export default function ItrLandingPage() {
  const pageRef = useRef(null);

  useEffect(() => {
    const page = pageRef.current;

    if (!page) {
      return undefined;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const heroBgLayers = gsap.utils.toArray("[data-itr-hero-bg]");

      gsap.set(heroBgLayers, {
        scale: 1.12,
        transformOrigin: "center center",
        willChange: "transform",
      });

      gsap.to(heroBgLayers, {
        scale: 0.96,
        ease: "none",
        scrollTrigger: {
          trigger: "#home",
          start: "top top",
          end: "bottom top",
          scrub: 0.9,
        },
      });

      gsap.to("[data-itr-hero-parallax]", {
        yPercent: -24,
        ease: "none",
        scrollTrigger: {
          trigger: "#home",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      const sections = gsap.utils.toArray("main > section, main > div");

      sections.forEach((section) => {
        const revealItems = Array.from(section.children || []).filter(
          (item) =>
            item.tagName !== "STYLE" &&
            !item.hasAttribute("data-itr-hero-bg") &&
            !item.hasAttribute("data-itr-hero-parallax")
        );
        const targets = revealItems.length ? revealItems : [section];

        gsap.set(targets, {
          autoAlpha: 0,
          y: 96,
          willChange: "transform, opacity",
        });

        gsap.to(targets, {
          autoAlpha: 1,
          y: 0,
          duration: 1.05,
          ease: "power4.out",
          stagger: 0.12,
          clearProps: "willChange",
          scrollTrigger: {
            trigger: section,
            start: "top 84%",
            once: true,
          },
        });
      });

      ScrollTrigger.refresh();
    }, page);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="itr-marketing-page tw-min-h-screen tw-overflow-x-hidden tw-bg-[#fdf9f3] tw-font-dmsans tw-text-fintoo-blue"
    >
    
      <main>
        <HeroSection />
        <MarqueeSection />
        <CorporateTaxSolutions/>
        <ServeSection />
        <ProcessSection />
       
        <ComparisonSection />
       
        <TrustSection />
        <TeamSection />
        
        <BookingSection />
        <FaqSection />
      </main>
      <a
        href="#booking"
        className="tw-fixed tw-bottom-5 tw-right-4 tw-z-50 tw-rounded-full tw-bg-fintoo-orange tw-px-5 tw-py-3 tw-text-sm tw-font-bold tw-uppercase tw-text-white tw-no-underline tw-shadow-[0_10px_30px_rgba(221,115,0,0.35)] hover:tw-bg-[#f08c1a] hover:tw-text-white md:tw-hidden"
      >
        Book Now
      </a>
     <Disclaimer/>
    </div>
  );
}
