import { SendEmail } from "../../FrappeIntegration-Services/services/financial-planning-api/ndaflow";
import { getParentUserId, getUserId } from "../../common_utilities";
import { userManagementEndpoints } from "../../constants";
import Cookies from "js-cookie";

const ALERT_EMAIL = "chirag.kalwani@wealthtech.ai";
const THROTTLE_WINDOW_MS = 30000;
const lastSentByKey = new Map();

const toText = (value) => {
  if (value == null) return "";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

const parseUserData = () => {
  try {
    const userData = localStorage.getItem("user_data");
    return userData ? JSON.parse(userData) : {};
  } catch {
    return {};
  }
};

const shouldThrottle = (key) => {
  const now = Date.now();
  const lastSent = lastSentByKey.get(key);
  if (lastSent && now - lastSent < THROTTLE_WINDOW_MS) {
    return true;
  }
  lastSentByKey.set(key, now);
  return false;
};

export const reportDashboardError = async ({
  component = "UnknownComponent",
  step = "unknown-step",
  error,
  errorInfo,
  extra,
} = {}) => {
  try {
    const userData = parseUserData();
    const userId = getUserId() || userData?.user_id || "";
    const parentUserId = getParentUserId() || userData?.user_parent_id || "";
    const userEmail = userData?.user_email || userData?.email || "";

    const errorName = error?.name || "Error";
    const errorMessage = error?.message || toText(error) || "Unknown error";
    const errorStack = error?.stack || "";
    const componentStack = errorInfo?.componentStack || "";

    const dedupeKey = `${component}|${step}|${errorName}|${errorMessage}`;
    if (shouldThrottle(dedupeKey)) return;

    const details = [
      `Timestamp: ${new Date().toISOString()}`,
      `Component: ${component}`,
      `Step: ${step}`,
      `Route: ${window.location?.href || ""}`,
      `User ID: ${userId || "NA"}`,
      `Parent User ID: ${parentUserId || "NA"}`,
      `User Email: ${userEmail || "NA"}`,
      `User Agent: ${navigator.userAgent || "NA"}`,
      `Error Name: ${errorName}`,
      `Error Message: ${errorMessage}`,
      `Error Stack:`,
      errorStack || "NA",
      `Component Stack:`,
      componentStack || "NA",
      `Extra Context:`,
      toText(extra) || "NA",
    ].join("\n");

    const emailPayload = {
      userdata: { to: ALERT_EMAIL },
      subject: `[New Dashboard] Error | ${component}`,
      template: "contact_mail_admin.html",
      contextvar: {
        name: "Dashboard Error Reporter",
        useremail: userEmail || "NA",
        phone: String(userId || parentUserId || "NA"),
        subject: `Step: ${step}`,
        message: details,
      },
    };

    const primaryRes = await SendEmail(emailPayload);
    const primaryOk = String(primaryRes?.status_code) === "200";

    if (!primaryOk) {
      // Retry once with direct fetch so failures in apiClient path don't hide alerts.
      const token = Cookies.get("token");
      const fallbackRes = await fetch(userManagementEndpoints.SEND_EMAIL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `token ${token}` } : {}),
        },
        body: JSON.stringify(emailPayload),
      });

      let fallbackBody = null;
      try {
        fallbackBody = await fallbackRes.json();
      } catch {
        fallbackBody = { status_code: String(fallbackRes.status) };
      }

      const fallbackOk =
        fallbackRes.ok && String(fallbackBody?.status_code || "200") === "200";

      const mailDebug = {
        primaryRes,
        fallbackStatus: fallbackRes.status,
        fallbackBody,
        fallbackOk,
      };
      localStorage.setItem(
        "dashboard_error_mail_last_status",
        JSON.stringify(mailDebug)
      );

      if (!fallbackOk) {
        console.error("Dashboard error mail failed:", mailDebug);
      }
    } else {
      localStorage.setItem(
        "dashboard_error_mail_last_status",
        JSON.stringify({ primaryRes, primaryOk: true })
      );
    }
  } catch (mailError) {
    localStorage.setItem(
      "dashboard_error_mail_last_status",
      JSON.stringify({
        exception: mailError?.message || String(mailError),
      })
    );
    console.error("Failed to report dashboard error via email:", mailError);
  }
};

export const sendDummyDashboardErrorMail = async () => {
  await reportDashboardError({
    component: "DummyDashboardTest",
    step: "manual-test",
    error: new Error("Dummy test error from dashboard reporter"),
    extra: { source: "manual" },
  });
};
