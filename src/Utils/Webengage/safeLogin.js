export const loginWebEngageSafe = (leadId, retries = 3) => {
  const normalizedLeadId = String(leadId || "").trim();
  if (!normalizedLeadId) return false;

  try {
    if (!window?.webengage) return false;

    const loginAction = () => {
      try {
        if (window?.webengage?.user?.login) {
          window.webengage.user.login(normalizedLeadId);
          return true;
        }
      } catch (err) {
        // swallow SDK timing/state issues and let retry handle it
      }
      return false;
    };

    if (typeof window.webengage.onReady === "function") {
      window.webengage.onReady(() => {
        const ok = loginAction();
        if (!ok && retries > 0) {
          setTimeout(() => loginWebEngageSafe(normalizedLeadId, retries - 1), 250);
        }
      });
      return true;
    }

    const ok = loginAction();
    if (!ok && retries > 0) {
      setTimeout(() => loginWebEngageSafe(normalizedLeadId, retries - 1), 250);
    }
    return ok;
  } catch (err) {
    return false;
  }
};
