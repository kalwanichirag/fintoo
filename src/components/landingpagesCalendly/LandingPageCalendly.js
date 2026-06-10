import React, { useEffect, useRef, useState } from "react";
import { InlineWidget, useCalendlyEventListener } from "react-calendly";
import { generateLead } from "../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { showCalendlyRedirectLoader } from "../calendlyRedirectLoader";

const CALENDLY_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNjQ4MjExMjQ0LCJqdGkiOiJmMmM1YWIwOC01N2ZiLTQ0YzAtODNjYy1lM2QxZWZhZGY2YzMiLCJ1c2VyX3V1aWQiOiI0ODVhZTAyZC02ZGNiLTQ1MjktODdiYi01MGY2NDE3NGI4ZWYifQ.5bIIwHH3DTn1Vp7Oj6hZlLkVIbI1q7jxqFogGaGkb1g";
const THANKYOU_URL = "https://www.fintoo.in/thankyou-page";

const redirectToThankyouOnce = () => {
  if (window.__calendlyThankYouRedirecting) return;
  window.__calendlyThankYouRedirecting = true;
  showCalendlyRedirectLoader("Booking confirmed. Redirecting you to the next page...");
  setTimeout(() => {
    window.location.replace(THANKYOU_URL);
  }, 1200);
};

const widgetWrapperStyle = {
  position: "relative",
  minHeight: "700px",
  borderRadius: "20px",
  overflow: "hidden",
  background: "#ffffff",
  boxShadow: "0 18px 40px rgba(4, 43, 98, 0.14)",
};

const widgetLoaderStyle = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background:
    "linear-gradient(135deg, rgba(4, 43, 98, 0.96), rgba(8, 72, 139, 0.92))",
  color: "#ffffff",
  zIndex: 2,
  padding: "24px",
  textAlign: "center",
};

const widgetLoaderCardStyle = {
  width: "100%",
  maxWidth: "420px",
};

const spinnerStyle = {
  width: "56px",
  height: "56px",
  margin: "0 auto 18px",
  borderRadius: "50%",
  border: "4px solid rgba(255,255,255,0.25)",
  borderTopColor: "#dd7300",
  animation: "calendly-widget-spin 0.9s linear infinite",
};

const shimmerLineStyle = (width) => ({
  height: "12px",
  width,
  margin: "0 auto 12px",
  borderRadius: "999px",
  background:
    "linear-gradient(90deg, rgba(255,255,255,0.16), rgba(255,255,255,0.32), rgba(255,255,255,0.16))",
  backgroundSize: "200% 100%",
  animation: "calendly-widget-shimmer 1.5s linear infinite",
});

const LandingPageCalendly = ({ pageName, servicename, calendlyurl, variant = "full", prefill }) => {
  const [utmSource, setUtmSource] = useState("");
  const [tags, setTags] = useState("");
  const [medium, setMedium] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");
  const [isWidgetLoading, setIsWidgetLoading] = useState(true);
  const widgetContainerRef = useRef(null);



  // Capture UTM params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUtmSource(params.get("utm_source") || "");
    setUtmCampaign(params.get("utm_campaign") || "");
    setTags(params.get("tags") || "");
    setMedium(params.get("utm_medium") || "");
  }, []);

  useEffect(() => {
    setIsWidgetLoading(true);
  }, [calendlyurl]);

  useEffect(() => {
    const styleId = "calendly-widget-loader-animations";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      @keyframes calendly-widget-spin {
        to { transform: rotate(360deg); }
      }

      @keyframes calendly-widget-shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `;

    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    const container = widgetContainerRef.current;
    if (!container) return undefined;

    let fallbackTimer = null;

    const handleLoaded = () => {
      setIsWidgetLoading(false);
    };

    const bindIframeLoad = (iframe) => {
      if (!iframe || iframe.dataset.loaderBound === "true") return;
      iframe.dataset.loaderBound = "true";
      iframe.addEventListener("load", handleLoaded, { once: true });
    };

    const existingIframe = container.querySelector("iframe");
    if (existingIframe) {
      bindIframeLoad(existingIframe);
    }

    const observer = new MutationObserver(() => {
      const iframe = container.querySelector("iframe");
      if (iframe) {
        bindIframeLoad(iframe);
      }
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
    });

    fallbackTimer = window.setTimeout(() => {
      setIsWidgetLoading(false);
    }, 8000);

    return () => {
      observer.disconnect();
      if (fallbackTimer) {
        window.clearTimeout(fallbackTimer);
      }
    };
  }, [calendlyurl]);

  const renderCalendlyWidget = (widgetProps = {}) => (
    <div ref={widgetContainerRef} style={widgetWrapperStyle}>
      {isWidgetLoading && (
        <div style={widgetLoaderStyle}>
          <div style={widgetLoaderCardStyle}>
            <div style={spinnerStyle} />
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                marginBottom: "10px",
                color: "#ffffff",
              }}
            >
              Preparing your booking calendar
            </h3>
            <p
              style={{
                marginBottom: "24px",
                color: "rgba(255,255,255,0.86)",
                fontSize: "0.98rem",
              }}
            >
              This takes a few seconds while Calendly loads securely.
            </p>
            <div style={shimmerLineStyle("100%")} />
            <div style={shimmerLineStyle("84%")} />
            <div style={shimmerLineStyle("68%")} />
          </div>
        </div>
      )}

      <InlineWidget
        url={calendlyurl}
        {...widgetProps}
      />
    </div>
  );

  useCalendlyEventListener({
    onEventScheduled: async (e) => {
      try {
        showCalendlyRedirectLoader();
        console.log("Calendly event data:", e.data);

        const inviteeUri = e?.data?.payload?.invitee?.uri;
        if (!inviteeUri) return;

        /* -------------------- 1️⃣ FETCH INVITEE -------------------- */
        const inviteeRes = await fetch(inviteeUri, {
          headers: { Authorization: CALENDLY_TOKEN },
        });

        const inviteeJson = await inviteeRes.json();
        const invitee = inviteeJson?.resource;
        if (!invitee) return;

        console.log("Invitee:", invitee);

        /* -------------------- 2️⃣ FETCH SCHEDULED EVENT -------------------- */
        const scheduledEventUrl = invitee.event;
        if (!scheduledEventUrl) return;

        const eventRes = await fetch(scheduledEventUrl, {
          headers: { Authorization: CALENDLY_TOKEN },
        });

        const eventJson = await eventRes.json();
        const event = eventJson?.resource;
        if (!event) return;

        console.log("Scheduled Event:", event);

        /* -------------------- 3️⃣ Q&A DATA -------------------- */
        const qna = invitee.questions_and_answers || [];

        const mobile =
          qna.find(
            (q) =>
              q.question.toLowerCase().includes("mobile") ||
              q.question.toLowerCase().includes("phone")
          )?.answer || "";
        const cleanedMobile = mobile.replace(/[\s\-()]/g, "")

        const income =
          qna.find((q) =>
            q.question.toLowerCase().includes("annual income")
          )?.answer || "";

        console.log(cleanedMobile, "cleanedMobile")
        /* -------------------- 4️ WEBENGAGE USER ATTRIBUTES -------------------- */
        if (window.webengage) {
          const fullName = invitee.name || "";
          const parts = fullName.trim().split(" ");

          window.webengage.user.setAttribute("we_first_name", parts[0] || "");
          window.webengage.user.setAttribute(
            "we_last_name",
            parts.slice(1).join(" ")
          );
          window.webengage.user.setAttribute("we_email", invitee.email || "");
          window.webengage.user.setAttribute("we_phone", cleanedMobile || "");
          window.webengage.user.setAttribute("Income Slab", income || "");
          webengage.user.setAttribute('we_whatsapp_opt_in', true);
        }

        /* -------------------- 5️⃣ EVENT TIME DATA -------------------- */
        const startDate = event.start_time
          ? new Date(event.start_time)
          : null;

        const endDate = event.end_time
          ? new Date(event.end_time)
          : null;

        const bookingDate = startDate
          ? startDate.toLocaleDateString("en-GB")
          : "";

        const bookingTime = startDate
          ? startDate.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })
          : "";

          const createdAt = invitee.created_at
            ? new Date(invitee.created_at)
            : null;

        const duration =
          startDate && endDate && endDate > startDate
            ? `${Math.round((endDate - startDate) / 60000)} mins`
            : "";

        /* -------------------- 6️⃣ WEBENGAGE EVENT -------------------- */

        const eventName = pageName || "Calendly Booking";

        window.webengage?.track(eventName, {
          name: invitee.name,
          email: invitee.email,
          number: mobile,
          "Lead Source": utmSource || "Website",
          "Lead Medium": medium || "CPC",
          "Lead Status": "Entry",
          "RM Name": "Online",
          "RM Email": "Online@fintoo.in",
          "Tag": tags || "",
"Lead Date":createdAt,         
 calendly_event_name: event.name || "",
          calendly_booking_date: startDate ,
          calendly_booking_time: bookingTime,
          calendly_duration: duration,
        });

        /* -------------------- 7️⃣ GENERATE LEAD -------------------- */
        const leadRes = await generateLead({
          full_name: invitee.name || "",
          email: invitee.email || "",
          mobile: mobile,
          tag: tags,
          slab: income,
          source: utmSource || "Website Callback",
          campaign: utmCampaign || "",
          services: Array.isArray(servicename)
            ? servicename
            : ["assisted_advisory_fixed_fees"],
        });

        const leadId = leadRes?.data?.lead_id;
        let webengageLoggedIn = false;

        if (window.webengage && leadId) {
          try {
            window.webengage.user.login(leadId);
            webengageLoggedIn = true;
          } catch (err) {
            console.warn("WebEngage login failed, continuing anonymous:", err);
          }
        }

      } catch (err) {
        console.error("Calendly handling error:", err);
      } finally {
      redirectToThankyouOnce();
      }
    },
  });

  if (variant === "minimal") {
    return (
      <div className="py-4">
        {renderCalendlyWidget({ prefill })}
      </div>
    );
  }

  return (
    <div className="py-5" style={{ background: "#042b62" }}>
      <div className="container">
        <div className="row align-items-center g-md-5">
          <div className="col-lg-6">
            <h2 className="text-center text-white fs-2 fw-bold">
              Book an introductory{" "}
              <span style={{ color: "#dd7300" }}>
                Complimentary 15 Minutes Call
              </span>{" "}
              with our Financial Experts
            </h2>
          </div>
          <div className="col-lg-6">
            {renderCalendlyWidget()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageCalendly;
