import { fetchData } from "../common_utilities";
import { taxplanningEndpoints } from "../constants";
import { apiCall } from "../common_utilities";
import { conversionFun } from "../Pages/wpPages/common/conversionFun";
import { generateLead } from "../FrappeIntegration-Services/services/user-management-api/userApiService";
import { Getpaymentstatus } from "../FrappeIntegration-Services/services/payment-api/paymentapiService";
import { getParentUserId } from "../common_utilities";
import { DATA_BELONGS_TO } from "../constants";
import { showCalendlyRedirectLoader } from "./calendlyRedirectLoader";

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

export const calendlyCallbackFun = async (pageName, scheduleData, addIncomSlabAndComment) => {
  try {
    showCalendlyRedirectLoader(
      "Please wait while we confirm your appointment and save your booking details..."
    );


    /* ---------------- UTM ---------------- */
    const params = new URLSearchParams(window.location.search);
    const utm_source = params.get("utm_source") || "Website";
    const utm_medium = params.get("utm_medium") || "Calendly";
    const utm_campaign = params.get("utm_campaign") || "";
    const tags = params.get("tags") || "";

    /* ---------------- INVITEE ---------------- */
    if (!scheduleData?.eventURL) return;

    const inviteeRes = await fetchData({
      url: scheduleData.eventURL,
      method: "GET",
      headers: { Authorization: CALENDLY_TOKEN },
    });

    const invitee = inviteeRes?.resource;
    if (!invitee) return;

    showCalendlyRedirectLoader(
      "Almost there. We are syncing your Calendly booking with Fintoo..."
    );

    /* ---------------- EVENT ---------------- */
    let scheduledEvent = null;

    if (invitee.event) {
      const eventRes = await fetchData({
        url: invitee.event,
        method: "GET",
        headers: { Authorization: CALENDLY_TOKEN },
      });
      scheduledEvent = eventRes?.resource;
    }

    const startDate = scheduledEvent?.start_time
      ? new Date(scheduledEvent.start_time)
      : null;
    const endDate = scheduledEvent?.end_time
      ? new Date(scheduledEvent.end_time)
      : null;

        const createdAt = scheduledEvent.created_at
            ? new Date(scheduledEvent.created_at)
            : null;


    const calendlyEventName = scheduledEvent?.name || "";
    const bookingDate = startDate?.toLocaleDateString("en-GB") || "";
    const bookingTime =
      startDate?.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }) || "";
    const duration =
      startDate && endDate
        ? `${Math.round((endDate - startDate) / 60000)} mins`
        : "";
        

    /* ---------------- Q&A ---------------- */
    const qna = invitee.questions_and_answers || [];
    const income =
      qna.find(q => q.question.toLowerCase().includes("income"))?.answer || "";
    const mobileRaw =
      qna.find(q => q.question.toLowerCase().includes("mobile"))?.answer || "";
    const mobile = mobileRaw.replace(/[\s\-()]/g, "");

    /* ---------------- LEAD ---------------- */
    const leadRes = await generateLead({
      full_name: scheduleData.fullname || invitee.name || "",
      email: scheduleData.email || invitee.email || "",
      mobile,
      tag: tags,
      slab: income,
      source: utm_source,
      campaign: utm_campaign,
      services: [scheduleData.serviceName || "Financial Planning"],
    });

    showCalendlyRedirectLoader(
      "Your meeting is confirmed. Redirecting you to the thank you page..."
    );

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

    /* ---------------- WEBENGAGE (FINAL) ---------------- */
    const webengagePayload = {
      "Lead Source": utm_source,
      "Lead Medium": utm_medium,
      "Lead Status": "Entry",
      "RM Name": "Online",
      "RM Email": "Online@fintoo.in",
      "Tag": tags || "",
      "Lead Date": createdAt,

      "Lead Status": "Entry",


      name: invitee.name,
      email: invitee.email,
      number: mobile,
      calendly_event_name: calendlyEventName,
      calendly_booking_date: startDate,
      calendly_booking_time: bookingTime,
      calendly_duration: duration,
    };

    console.group("%c[Calendly → WebEngage FINAL]", "color:#4caf50;font-weight:bold");
    console.log(webengagePayload, "webengagePayload");
    console.groupEnd();
    const finalName = scheduleData.fullname || invitee?.name || "";
    const finalEmail = scheduleData.email || invitee?.email || "";
    const finalMobile = scheduleData.mobileNumber || mobile || "";
    console.log("Final User Identity:");
    console.table({
      finalName: scheduleData.fullname || invitee?.name,
      finalEmail: scheduleData.email || invitee?.email,
      finalMobile: scheduleData.mobileNumber || mobile,
    });
    if (window.webengage) {
      if (leadRes?.data?.lead_status === "Created") {
        window.webengage.user.setAttribute("Lead Source", utm_source);
        window.webengage.user.setAttribute("Lead Medium", utm_medium);
        window.webengage.user.setAttribute("LeadDate", new Date());
      }
      const parts = finalName.trim().split(" ");

      window.webengage.user.setAttribute("we_first_name", parts[0] || "");
      window.webengage.user.setAttribute(
        "we_last_name",
        parts.slice(1).join(" ")
      );

      window.webengage.user.setAttribute("we_email", finalEmail);

      window.webengage.user.setAttribute("we_phone", finalMobile);

      webengage.user.setAttribute('we_whatsapp_opt_in', true);

      window.webengage.user.setAttribute("Income Slab", income || "");
      console.log(Object.keys(webengagePayload));
      // ✅ STATIC EVENT NAME
      window.webengage.track(
        pageName,
        webengagePayload
      );
    }

    /* ---------------- APPOINTMENT ---------------- */
    // if (startDate) {
    //   await apiCall(
    //     taxplanningEndpoints.CREATE_APPOINTMENT_DETAILS,
    //     {
    //       appointment_date: startDate.toLocaleDateString("en-CA"),
    //       appointment_plan_uuid: scheduleData.planId || "",
    //       appointment_expert_id: "EMPM-1",
    //       income_slab: income || "",
    //     },
    //     false,
    //     false
    //   );
    // }

  } catch (e) {
    console.error("Error in calendlyCallbackFun:", e);
  } finally {
    redirectToThankyouOnce();
  }
};
