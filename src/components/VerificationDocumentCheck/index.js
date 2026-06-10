import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { kyc_fp_redirection } from "../../common_utilities";

const VerificationDocumentCheck = () => {
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const checkRedirection = async () => {
      try {
        let user_Data = null;

        for (let i = 0; i < 20; i++) {
          const data = localStorage.getItem("user_data");
          if (data) {
            user_Data = JSON.parse(data);
            break;
          }
          await new Promise((res) => setTimeout(res, 150));
        }

        if (!user_Data || !isMounted) return;

        const {
          mobile_verified,
          user_onboarding_status,
          user_lead_id
        } = user_Data;

        if (!mobile_verified || !user_onboarding_status || !user_lead_id) {
          return;
        }

        const verificationPath =
          process.env.PUBLIC_URL + "/datagathering/verification-docs";

        const fromCrm = localStorage.getItem("from_crm") === "1";
        const skipped = sessionStorage.getItem("kyc_skipped") === "1";

        if (skipped) return;

        if (fromCrm) {
          if (location.pathname !== verificationPath) {
            window.location.replace(verificationPath);
          }
          return;
        }

        const shouldRedirect = await kyc_fp_redirection(user_lead_id);

        if (shouldRedirect) {
          if (location.pathname !== verificationPath) {
            window.location.replace(verificationPath);
          }
        }

      } catch (err) {
        console.error("Redirection check failed", err);
      }
    };

    checkRedirection();

    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  return null;
};

export default VerificationDocumentCheck;