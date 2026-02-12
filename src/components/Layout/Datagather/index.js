import { useEffect, useState } from "react";
import { getItemLocal } from "../../../common_utilities";
import HideFooter from "../../HideFooter";
import HideHeader from "../../HideHeader";
import Sidebar from "./Sidebar";
import Cookies from "js-cookie";

const DatagatherLayout = (props) => {
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
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
