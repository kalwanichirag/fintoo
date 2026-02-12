import React, { useEffect, useState } from "react";
import { InlineWidget, useCalendlyEventListener } from "react-calendly";
import { generateLead } from "../../FrappeIntegration-Services/services/user-management-api/userApiService";

const CALENDLY_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNjQ4MjExMjQ0LCJqdGkiOiJmMmM1YWIwOC01N2ZiLTQ0YzAtODNjYy1lM2QxZWZhZGY2YzMiLCJ1c2VyX3V1aWQiOiI0ODVhZTAyZC02ZGNiLTQ1MjktODdiYi01MGY2NDE3NGI4ZWYifQ.5bIIwHH3DTn1Vp7Oj6hZlLkVIbI1q7jxqFogGaGkb1g";

const LandingPageCalendly = ({ pageName, servicename, calendlyurl, variant = "full", prefill }) => {
  const [utmSource, setUtmSource] = useState("");
  const [tags, setTags] = useState("");
  const [medium, setMedium] = useState("");



  // Capture UTM params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUtmSource(params.get("utm_source") || "");
    setTags(params.get("tags") || "");
    setMedium(params.get("utm_medium") || "");
  }, []);

  useCalendlyEventListener({
    onEventScheduled: async (e) => {
      try {
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
          lead_source: utmSource || "Website",
          lead_medium: medium || "CPC",
          lead_status: "Entry",
          rm_name: "Online",
          rm_email: "Online@fintoo.in",
          tag: tags || "",
          lead_date: new Date().toLocaleDateString("en-GB"),
          calendly_event_name: event.name || "",
          calendly_booking_date: bookingDate,
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
      }
    },
  });

  if (variant === "minimal") {
    return (
      <div className="py-4">
        <InlineWidget url={calendlyurl} prefill={prefill} />

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
            <InlineWidget url={calendlyurl} />

          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageCalendly;
