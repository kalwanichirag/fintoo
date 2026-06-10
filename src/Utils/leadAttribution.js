import Cookies from "js-cookie";

const CHOICE_LEAD_KEY = "leadData";

export const storeChoiceLeadFromUrl = (search = window.location.search) => {
  try {
    const params = new URLSearchParams(search || "");
    const source = params.get("utm_source");
    const campaign = params.get("utm_campaign");
    const tag = params.get("tags");

    // Store only Choice traffic attribution
    if (!source || source.toLowerCase() !== "choice") return null;

    const payload = {
      source,
      campaign: campaign || "",
      tag: tag || "",
    };
    localStorage.setItem(CHOICE_LEAD_KEY, JSON.stringify(payload));
    Cookies.set(CHOICE_LEAD_KEY, JSON.stringify(payload), { expires: 30, path: "/" });
    return payload;
  } catch {
    return null;
  }
};

export const getStoredChoiceLead = () => {
  try {
    const raw = localStorage.getItem(CHOICE_LEAD_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return parsed;
    }

    const cookieData = Cookies.get(CHOICE_LEAD_KEY);
    if (!cookieData) return null;
    const parsed = JSON.parse(cookieData);
    if (!parsed || typeof parsed !== "object") return null;
    localStorage.setItem(CHOICE_LEAD_KEY, JSON.stringify(parsed));
    return parsed;
  } catch {
    return null;
  }
};
