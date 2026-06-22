import { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import '../../components/Insurance/tailwind.css';
import './style.css';
import {
  BookingOtpSection,
  ChecklistSection,
  ComparisonSection,
  FaqSection,
  HeroSection,
  MistakesSection,
  PricingSection,
  ProductShowcaseSection,
  StatsSection,
  StickyBar,
  TestimonialsSection,
  TimelineSection,
  WhoSection,
} from './components/sections';
import Disclaimer from '../../components/retirement-planning/Disclaimer';
import ClientReviews from '../../components/HTML/ClientReviews';

export default function ItrFilingForEmployee() {
  const pageRef = useRef(null);
  const [isStickyVisible, setIsStickyVisible] = useState(false);

  const scrollToBooking = useCallback(() => {
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  useEffect(() => {
    const onScroll = () => setIsStickyVisible(window.scrollY > 600);

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const page = pageRef.current;
    if (!page || !('IntersectionObserver' in window)) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    page.querySelectorAll('.fade-up').forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={pageRef} className="itr-filing-for-employee-page tw-font-inter tw-text-[#10233f] tw-bg-white tw-leading-[1.6] tw-overflow-x-hidden">
      <Helmet>
        <title>File ITR Live With A Tax Expert | Fintoo</title>
        <meta name="description" content="File ITR live with a Tax Expert through Fintoo's guided tax filing session." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>

      <StickyBar isVisible={isStickyVisible} onBook={scrollToBooking} />
      <HeroSection onBook={scrollToBooking} />
      <ProductShowcaseSection onBook={scrollToBooking} />
      
      <MistakesSection />
      <ComparisonSection onBook={scrollToBooking} />
      <TimelineSection />
      <WhoSection />
      <PricingSection onBook={scrollToBooking} />
      <ChecklistSection onBook={scrollToBooking} />
      {/* <StatsSection /> */}
      <TestimonialsSection />
      <BookingOtpSection />
      
      {/* <FaqSection /> */}
      <Disclaimer/>
    </div>
  );
}
