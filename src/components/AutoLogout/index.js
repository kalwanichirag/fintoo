import { useEffect, useRef } from "react";
import { removeMemberId, removeUserId } from "../../common_utilities";

const AutoLogout = () => {
  const myTimer = useRef(null);
  const INACTIVITY_LIMIT = 15 * 60 * 1000;

  // Set expiry time in localStorage whenever user is active
  const setStorage = () => {
    const expiryTime = Date.now() + INACTIVITY_LIMIT;
    localStorage.setItem("lastVisit", expiryTime.toString());
  };

  // Logout if expired
  const autoExpire = () => {
    myTimer.current = setInterval(() => {
      const lastVisit = Number(localStorage.getItem("lastVisit"));
      const now = Date.now();

      if (localStorage.getItem("sky") && lastVisit && now > lastVisit) {
        clearInterval(myTimer.current);
        myTimer.current = null;
        triggerLogout(); // call logout for this tab + others
      }
    }, 5000);
  };

  const triggerLogout = () => {
    localStorage.setItem("logoutNow", Date.now().toString());
    redirectNow();
  };

  // Actual cleanup + redirect
  const redirectNow = () => {
    if (window.webengage && window.webengage.user) {
    try {
      window.webengage.user.logout();
    } catch (e) {
      console.warn("WebEngage logout failed:", e);
    }
  }

    removeMemberId();
    removeUserId();
    localStorage.removeItem("sky");

    const currentUrl = window.location.href;
    if (!currentUrl.includes("/session-expired")) {
      localStorage.setItem("redirectToThis", currentUrl);
    }
    window.location.href = process.env.PUBLIC_URL + "/session-expired";
  };

  useEffect(() => {
    // On mount, check if already expired
    const lastVisit = Number(localStorage.getItem("lastVisit"));
    if (localStorage.getItem("sky") && lastVisit && Date.now() > lastVisit) {
      redirectNow();
      return;
    }

    // Initial setup
    setStorage();
    autoExpire();

    // Activity listeners
    const events = ["click", "mousemove", "keypress", "scroll"];
    events.forEach(evt => document.addEventListener(evt, setStorage));

    // Listen for storage changes from other tabs
    const handleStorageChange = (e) => {
      if (e.key === "lastVisit") {
        const lastVisitUpdated = Number(localStorage.getItem("lastVisit"));
        if (lastVisitUpdated && Date.now() <= lastVisitUpdated) {
          if (myTimer.current) clearInterval(myTimer.current);
          autoExpire();
        }
      }
      if (e.key === "logoutNow") {
        redirectNow(); // another tab logged out → logout here instantly
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      if (myTimer.current) clearInterval(myTimer.current);
      events.forEach(evt => document.removeEventListener(evt, setStorage));
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return null;
};

export default AutoLogout;