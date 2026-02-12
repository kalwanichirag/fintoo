import React, { useEffect } from "react";
import Cookies from "js-cookie";

const OnboardflowPage = () => {
  useEffect(() => {
   
    const currentPath = window.location.pathname;

    const token = Cookies.get("token");
    if (!token &&  currentPath !== process.env.PUBLIC_URL + "/login") {
      // window.location.href = process.env.PUBLIC_URL + "/login";
      return;
    }

    const userDataString = localStorage.getItem("user_data");
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);

        if (
          userData.user_onboarding_status === false &&
          currentPath !== process.env.PUBLIC_URL + "/onboard-flow"
        ) {
          // window.location.href = process.env.PUBLIC_URL + "/onboard-flow";
        }
      } catch (err) {
        console.error("Invalid user_data in localStorage", err);
      }
    }
  }, []);

  return null;
};

export default OnboardflowPage;
