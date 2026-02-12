import React, { useEffect } from "react";

const MobileVerificationPage = () => {
  useEffect(() => {
    const userDataString = localStorage.getItem("user_data");
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        const currentPath = window.location.pathname;
        if (
          userData.mobile_verified === false &&
          currentPath !== process.env.PUBLIC_URL + "/mobile-verfication"
        ) {
          window.location.href = process.env.PUBLIC_URL + "/mobile-verfication";
        }
      } catch (err) {
        console.error("Invalid user_data in localStorage", err);
      }
    }
  }, []);

  return null;
};

export default MobileVerificationPage;
