import { useEffect, useState } from "react";
import { getItemLocal, getParentUserId, setItemLocal } from "../../../common_utilities";
import HideFooter from "../../HideFooter";
import HideHeader from "../../HideHeader";
import Sidebar from "./Sidebar";
import Cookies from "js-cookie";
import { check_all_status_api } from "../../../FrappeIntegration-Services/services/user-management-api/userApiService";

const DatagatherLayout = (props) => {
  const [authorized, setAuthorized] = useState(null);


  const handleCheckAllStatus = async (userId) => {
    try {
      if (userId) {
        const result = await check_all_status_api(userId);

        if (result?.status_code === "200") {
          const {
            nda_sign_check,
            data_gethering_check,
            report_check,
            plan_uuid,
            plan_is_expired,
            opportunity_id
          } = result.data;

          setItemLocal("ndasignstatus", nda_sign_check);
          setItemLocal("datagatheringstatus", data_gethering_check);
          setItemLocal("reportstatus", report_check);
          setItemLocal("plan_is_expired", plan_is_expired);
          setItemLocal("plan_uuid", plan_uuid);
          setItemLocal("opportunity_id", opportunity_id);

        } else {
          console.error("Status check failed:", result?.message);
        }
      } else {
        console.error("User ID not found.");
      }
    } catch (error) {
      console.error("Error checking user status:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      const userId = getParentUserId();
      await handleCheckAllStatus(userId);

      const planIsExpired = getItemLocal("plan_is_expired");
      const token = Cookies.get("token");
      const pathname = window.location.pathname;

      if (!token && (pathname.includes("/datagathering/") || pathname.includes("/report/"))) {
        window.location.href = "/login";
        setAuthorized(false);
        return;
      }

      if (planIsExpired === "Y" && (pathname.includes("/datagathering/") || pathname.includes("/report/"))) {
        window.location.href = "/pricing";
        setAuthorized(false);
        return;
      }

      setAuthorized(true);
    };

    init();
  }, []);

  if (authorized === null) {
    return null;
  }

  return (
    <div className="reports">
      <HideHeader />
      <Sidebar />
      {props.children}
      <HideFooter />
    </div>
  );
};

export default DatagatherLayout;
