import { useEffect, useMemo, useRef, useState } from "react";
import AboutFintooSection from "./components/AboutFintooSection";
import AboutSection from "./components/AboutSection";
import BookingSection from "./components/BookingSection";
import EventsSection from "./components/EventsSection";
import HeroSection from "./components/HeroSection";
import SessionsSection from "./components/SessionsSection";
import SpeakerModal from "./components/SpeakerModal";
import StickyCTA from "./components/StickyCTA";
import TestimonialsSection from "./components/TestimonialsSection";
import WhyWomoneyaSection from "./components/WhyWomoneyaSection";
import { ABOUT_STAGE_IMAGES } from "./constants";
import "../../components/Insurance/tailwind.css";
import { sendMail } from "../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { useNavigate } from "react-router-dom";

export default function WomoneyaPage({ variant = "default" }) {
  const navigate = useNavigate();
  const [isSpeakerModalOpen, setIsSpeakerModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [offlineCity, setOfflineCity] = useState("");
  const [otherCity, setOtherCity] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    designation: "",
    email: "",
    phone: "",
    sessionType: "",
  });
  const [aboutStageIndex, setAboutStageIndex] = useState(0);
  const [isStickyVisible, setIsStickyVisible] = useState(false);
  const [hideStickyForCityFocus, setHideStickyForCityFocus] = useState(false);
  const bookingSectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsStickyVisible(window.scrollY > 800);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setAboutStageIndex((prev) => (prev + 1) % ABOUT_STAGE_IMAGES.length);
    }, 3500);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const onEscape = (event) => {
      if (event.key === "Escape") {
        setIsSpeakerModalOpen(false);
      }
    };

    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("tw-overflow-hidden", isSpeakerModalOpen);
    return () => document.body.classList.remove("tw-overflow-hidden");
  }, [isSpeakerModalOpen]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeInUp");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );

    const sections = document.querySelectorAll(".womoneya-page section");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const showOtherCityInput = isOfflineMode && offlineCity === "Other";

  const isStickyShown = useMemo(() => {
    return isStickyVisible && !isSpeakerModalOpen && !hideStickyForCityFocus;
  }, [isStickyVisible, isSpeakerModalOpen, hideStickyForCityFocus]);

  const goToNextSlide = () => {
    setAboutStageIndex((prev) => (prev + 1) % ABOUT_STAGE_IMAGES.length);
  };

  const goToPrevSlide = () => {
    setAboutStageIndex((prev) => (prev - 1 + ABOUT_STAGE_IMAGES.length) % ABOUT_STAGE_IMAGES.length);
  };

  const handleModeChange = (value) => {
    const offlineSelected = value === "offline";
    setIsOfflineMode(offlineSelected);
    if (!offlineSelected) {
      setOfflineCity("");
      setOtherCity("");
    }
  };

  const handleOfflineCityChange = (city) => {
    setOfflineCity(city);
    if (city !== "Other") {
      setOtherCity("");
    }
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookSessionClick = () => {
    const section = bookingSectionRef.current;
    if (!section) return;

    const yOffset = -80;
    const y = section.getBoundingClientRect().top + window.scrollY + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const handleSubmit = async (event) => {
    setSubmitError("");

    if (isOfflineMode && !offlineCity) {
      event.preventDefault();
      setSubmitError("Please select a city for Offline mode.");
      return;
    }

    if (isOfflineMode && offlineCity === "Other" && !otherCity.trim()) {
      event.preventDefault();
      setSubmitError("Please enter your city name.");
      return;
    }

    if (!formData.sessionType) {
      event.preventDefault();
      setSubmitError("Please select one session.");
      return;
    }

    let phoneDigits = (formData.phone || "").replace(/\D/g, "");
    if (phoneDigits.length === 12 && phoneDigits.startsWith("91")) {
      phoneDigits = phoneDigits.slice(2);
    }
    if (phoneDigits.length !== 10) {
      event.preventDefault();
      setSubmitError("Please enter a valid 10-digit phone number.");
      return;
    }

    event.preventDefault();
    setIsSubmitting(true);

    try {
      const modeValue = isOfflineMode ? "Offline" : "Online";
      const cityValue = isOfflineMode ? (offlineCity === "Other" ? otherCity : offlineCity) : "NA";
      const emailBody = [
        `Name: ${formData.name}`,
        `Company Name: ${formData.companyName}`,
        `Designation: ${formData.designation}`,
        `Email: ${formData.email}`,
        `Phone Number: ${phoneDigits}`,
        `Selected Session: ${formData.sessionType}`,
        `Preferred Mode: ${modeValue}`,
        `Offline City: ${cityValue}`,
        `Source: ${window.location.href}`,
      ].join("\n");

      const recipients = ["salman.warwande@fintoo.in", "chirag.kalwani@wealthtech.ai"];
      const requests = recipients.map((to) =>
        sendMail({
          userdata: { to },
          subject: "New Womoneya 3.0 Session Booking Request",
          template: "contact_mail_admin.html",
          contextvar: {
            name: formData.name,
            useremail: formData.email,
            phone: formData.phone,
            subject: `Womoneya Session - ${formData.sessionType}`,
            message: emailBody,
          },
        })
      );

      await Promise.all(requests);
      navigate("/thankyou-page");
    } catch (error) {
      setSubmitError("Unable to submit request right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="womoneya-page tw-bg-white tw-overflow-x-hidden">
        <HeroSection onBookSession={handleBookSessionClick} variant={variant} />
        <AboutSection aboutStageIndex={aboutStageIndex} onPrevSlide={goToPrevSlide} onNextSlide={goToNextSlide} />
        <SessionsSection onOpenSpeakerModal={() => setIsSpeakerModalOpen(true)} onBookSession={handleBookSessionClick} />
        <WhyWomoneyaSection />
        <TestimonialsSection />
        <EventsSection onBookSession={handleBookSessionClick} />
        <AboutFintooSection />
        <BookingSection
          sectionRef={bookingSectionRef}
          formData={formData}
          onFieldChange={handleFieldChange}
          isOfflineMode={isOfflineMode}
          offlineCity={offlineCity}
          otherCity={otherCity}
          showOtherCityInput={showOtherCityInput}
          onModeChange={handleModeChange}
          onOfflineCityChange={handleOfflineCityChange}
          onOtherCityChange={setOtherCity}
          onCityFocus={() => setHideStickyForCityFocus(true)}
          onCityBlur={() => setHideStickyForCityFocus(false)}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitError={submitError}
        />

        <SpeakerModal
          isOpen={isSpeakerModalOpen}
          onClose={() => setIsSpeakerModalOpen(false)}
          onBookSession={handleBookSessionClick}
        />
        <StickyCTA isVisible={isStickyShown} onBookSession={handleBookSessionClick} />
      </div>
    </>
  );
}
