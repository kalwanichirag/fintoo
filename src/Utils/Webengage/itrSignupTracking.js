const ITR_SIGNUP_CONTEXT_KEY = "itr_webengage_signup_context";

const readUserData = () => {
  try {
    return JSON.parse(localStorage.getItem("user_data") || "{}");
  } catch {
    return {};
  }
};

export const formatIndianPhone = (value) => {
  const phone = String(value || "").trim();
  if (!phone) return "";
  if (phone.startsWith("+91")) return phone;
  const digits = phone.replace(/\D/g, "");
  return `+91${digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits}`;
};

export const getItrSignupContext = () => {
  try {
    return JSON.parse(localStorage.getItem(ITR_SIGNUP_CONTEXT_KEY) || "null");
  } catch {
    return null;
  }
};

export const beginItrSignupJourney = (plan) => {
  const mrp = Number(plan?.plan_description?.original_amount) || 0;
  const listPrice = Number(plan?.plan_amount) || 0;
  const params = new URLSearchParams(window.location.search);

  localStorage.setItem(ITR_SIGNUP_CONTEXT_KEY, JSON.stringify({
    url: window.location.href,
    "list price": listPrice,
    MRP: mrp,
    "list discount": mrp - listPrice,
    "plan name": plan?.plan_name || "",
    "plan id": plan?.name || plan?.plan_id || plan?.plan_uuid || "",
    service: plan?.service || "ITR Filing",
    utm_source: params.get("utm_source") || localStorage.getItem("utm_source") || "Direct",
    Service: plan?.service || "ITR Filing",
  }));
};

export const trackItrSignupEvent = (eventName, attributes = {}) => {
  const context = getItrSignupContext();
  if (!context || !window?.webengage?.track) return;

  const userData = readUserData();
  const phone = formatIndianPhone(
    attributes.phone
    || userData.user_mobile
    || userData.mobile
    || userData.mobile_number
  );

  window.webengage.track(eventName, {
    ...attributes,
    phone,
    Service: context.Service,
  });
};

export const trackItrSignupInitiated = (attributes = {}) => {
  const context = getItrSignupContext();
  if (!context) return;

  localStorage.setItem(ITR_SIGNUP_CONTEXT_KEY, JSON.stringify({
    ...context,
    signup_started: true,
  }));

  const userData = readUserData();
  trackItrSignupEvent("signup initiated", {
    ...context,
    "lead id": attributes["lead id"] || userData.user_lead_id || userData.lead_id || "",
    name: attributes.name || userData.user_name || "",
    email: attributes.email || userData.user_email || "",
    "whatsapp optin": Boolean(attributes["whatsapp optin"]),
    phone: attributes.phone,
  });
};

export const trackItrSignupCompleted = (attributes = {}) => {
  const context = getItrSignupContext();
  if (!context?.signup_started) return;

  const userData = readUserData();
  trackItrSignupEvent("signup completed", {
    url: context.url,
    "list price": context["list price"],
    MRP: context.MRP,
    "list discount": context["list discount"],
    "plan name": context["plan name"],
    "plan id": context["plan id"],
    "lead id": attributes["lead id"] || userData.user_lead_id || userData.lead_id || "",
    name: attributes.name || userData.user_name || "",
    email: attributes.email || userData.user_email || "",
    utm_source: context.utm_source,
    phone: attributes.phone,
  });

  localStorage.removeItem(ITR_SIGNUP_CONTEXT_KEY);
};
