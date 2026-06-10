import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import "../../components/Insurance/tailwind.css";
import HeroSection from "./components/HeroSection";
import TrustBarSection from "./components/TrustBarSection";
import WhyItMattersSection from "./components/WhyItMattersSection";
import BenefitsSection from "./components/BenefitsSection";
import ProcessSection from "./components/ProcessSection";
import WhyFintooPointsSection from "./components/WhyFintooPointsSection";
import TestimonialsSection from "./components/TestimonialsSection";
import DezervRetirementSection from "./components/DezervRetirementSection";
import ContactSection from "./components/ContactSection";
import FaqSection from "./components/FaqSection";
import SuccessModal from "./components/SuccessModal";
import Disclaimer from "../../components/retirement-planning/Disclaimer";
import { generateLead } from "../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { SendEmail } from "../../FrappeIntegration-Services/services/financial-planning-api/ndaflow";

export default function RetirementPlanner() {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    currentAge: 35,
    retirementAge: 60,
    annualIncome: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showFullPage, setShowFullPage] = useState(false);
  const [showMobileFormCta, setShowMobileFormCta] = useState(false);

  const fireSubmitTracking = () => {
    const existingScript = document.querySelector('script[src="https://www.googletagmanager.com/gtag/js?id=G-T15R5ED28G"]');

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://www.googletagmanager.com/gtag/js?id=G-T15R5ED28G";
      script.async = true;
      document.head.appendChild(script);
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
      window.dataLayer.push(arguments);
    };

    window.gtag("js", new Date());
    window.gtag("config", "G-T15R5ED28G");
    window.gtag("event", "retirement_planner_submit", {
      page_location: window.location.href,
      page_title: document.title,
      event_category: "lead_form",
      event_label: "retirement_planner",
    });
  };

  useEffect(() => {
    if (showFullPage) {
      setShowMobileFormCta(false);
      return undefined;
    }

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const formElement = document.getElementById("retirement-planner-form");

    if (!mediaQuery.matches || !formElement) {
      setShowMobileFormCta(false);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowMobileFormCta(!entry.isIntersecting);
      },
      {
        threshold: 0.2,
      }
    );

    observer.observe(formElement);

    const handleMediaChange = (event) => {
      if (!event.matches) {
        setShowMobileFormCta(false);
      }
    };

    mediaQuery.addEventListener?.("change", handleMediaChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener?.("change", handleMediaChange);
    };
  }, [showFullPage]);

  const scrollToForm = () => {
    const formElement = document.getElementById("retirement-planner-form");
    formElement?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleChange = (key) => (event) => {
    setForm((current) => ({
      ...current,
      [key]: event.target.value,
    }));
    setErrors((current) => ({
      ...current,
      [key]: "",
      submit: "",
    }));
  };

  const validateForm = () => {
    const nextErrors = {};
    const trimmedName = form.name.trim();
    const trimmedMobile = form.mobile.trim();
    const trimmedEmail = form.email.trim();
    const currentAge = Number(form.currentAge);
    const retirementAge = Number(form.retirementAge);

    if (!trimmedName) {
      nextErrors.name = "Please enter your name.";
    }

    if (!trimmedMobile) {
      nextErrors.mobile = "Please enter your mobile number.";
    } else if (!/^\d{10}$/.test(trimmedMobile.replace(/\D/g, ""))) {
      nextErrors.mobile = "Please enter a valid 10-digit mobile number.";
    }

    if (!trimmedEmail) {
      nextErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!form.currentAge && form.currentAge !== 0) {
      nextErrors.currentAge = "Please enter your current age.";
    } else if (!Number.isFinite(currentAge) || currentAge < 18 || currentAge > 70) {
      nextErrors.currentAge = "Current age must be between 18 and 70.";
    }

    if (!form.retirementAge && form.retirementAge !== 0) {
      nextErrors.retirementAge = "Please enter your retirement age.";
    } else if (!Number.isFinite(retirementAge) || retirementAge < 40 || retirementAge > 80) {
      nextErrors.retirementAge = "Retirement age must be between 40 and 80.";
    } else if (Number.isFinite(currentAge) && retirementAge <= currentAge) {
      nextErrors.retirementAge = "Retirement age must be greater than current age.";
    }

    if (!form.annualIncome) {
      nextErrors.annualIncome = "Please select your annual income.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    fireSubmitTracking();

    const params = new URLSearchParams(window.location.search);
    const source = params.get("utm_source") || "Website Callback";
    const campaign = params.get("utm_campaign") || "";
    const tag = params.get("tags") || "retirement_planner";
    const cleanedMobile = form.mobile.replace(/\D/g, "").slice(-10);
    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();
    const formattedMessage = [
      `Name: ${trimmedName}`,
      `Email: ${trimmedEmail}`,
      `Mobile Number: ${cleanedMobile}`,
      `Current Age: ${form.currentAge}`,
      `Retirement Age: ${form.retirementAge}`,
      `Annual Income: ${form.annualIncome}`,
      `Lead Source: ${source}`,
      `UTM Campaign: ${campaign || "NA"}`,
      `Tag: ${tag}`,
      `Page URL: ${window.location.href}`,
      `Submitted At: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`,
    ].join("\n");
    const adminEmailPayload = {
      userdata: {
        from: trimmedEmail,
        to: "chirag.kalwani@wealthtech.ai",
      },
      subject: `New Retirement Planner Lead | ${trimmedName} | ${cleanedMobile}`,
      template: "contact_mail_admin.html",
      contextvar: {
        name: trimmedName,
        useremail: trimmedEmail,
        phone: cleanedMobile,
        subject: "Retirement Planner Lead Submission",
        message: formattedMessage,
      },
    };

    setIsSubmitting(true);

    try {
      const leadRes = await generateLead({
        full_name: trimmedName,
        email: trimmedEmail,
        mobile: cleanedMobile,
        slab: form.annualIncome,
        source,
        campaign,
        tag,
        services: ["retirement_planner"],
      });

      await SendEmail(adminEmailPayload);

      if (window.webengage) {
        window.webengage.user.setAttribute("we_first_name", trimmedName.split(" ")[0] || "");
        window.webengage.user.setAttribute("we_email", trimmedEmail);
        webengage.user.setAttribute('we_whatsapp_opt_in', true);

        window.webengage.user.setAttribute("we_phone", cleanedMobile);
        window.webengage.track("Retirement Planner Lead", {
          name: trimmedName,
          email: trimmedEmail,
          number: cleanedMobile,
          "Lead Source": source,
          "Lead Status": "Entry",
          "RM Name": "Online",
          "RM Email": "online@fintoo.in",
          "Lead Type": "Retirement Planner",
          "Income Slab": form.annualIncome,
          "Tag": tag,

        });

        const leadId = leadRes?.data?.lead_id;
        if (leadId) {
          try {
            window.webengage.user.login(leadId);
          } catch (error) {
            console.warn("WebEngage login failed:", error);
          }
        }
      }

      setShowFullPage(true);
      setShowModal(true);
    } catch (error) {
      console.error("Retirement planner lead submission failed:", error);
      setErrors((current) => ({
        ...current,
        submit: "We could not submit your request right now. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Retirement Planner | Fintoo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <div className="tw-overflow-x-hidden tw-bg-white tw-font-dmsans tw-text-slate-800">


        {!showFullPage && (
          <div className="tw-min-h-screen tw-flex tw-flex-col tw-justify-between ">

            <HeroSection
              form={form}
              errors={errors}
              isSubmitting={isSubmitting}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />

            <TrustBarSection />

            <WhyItMattersSection />
            <TestimonialsSection />

            <FaqSection />
            <Disclaimer />
          </div>
        )}



        {/* Step 2: After submit */}
        {showFullPage && (
          <>
            <BenefitsSection />
            <ProcessSection />
            <WhyFintooPointsSection />
            <DezervRetirementSection />
            <ContactSection />
            <Disclaimer />
          </>
        )}

        {showModal && (
          <SuccessModal

            onClose={() => setShowModal(false)}
          />
        )}

        {showMobileFormCta && !showFullPage && (
          <button
            type="button"
            onClick={scrollToForm}
            className="tw-fixed tw-bottom-5 tw-right-4 tw-z-50 tw-inline-flex tw-items-center tw-gap-2 tw-rounded-full tw-bg-fintoo-orange tw-px-4 tw-py-3 tw-text-sm tw-font-semibold tw-text-white tw-shadow-[0_18px_36px_rgba(221,115,0,0.35)] md:tw-hidden"
          >
            Get Plan
          </button>
        )}
      </div>
    </>
  );
}
