import { useEffect } from "react";
import GuestLayout from "../../Layout/GuestLayout";
import Cookies from "js-cookie";
import { userLogout } from "../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { removeMemberId, removeUserId } from "../../../common_utilities";
import { clearLocalStorageExcept } from "../../../Utils/storage";

const SessionExpired = () => {
  useEffect(() => {
    removeMemberId();
    removeUserId();
    localStorage.removeItem("sky");
    Cookies.remove('token');
    Cookies.remove('user_data');
    clearLocalStorageExcept(["leadData"]);
  }, []);

  return (
    <GuestLayout className="container-sm">
      <div className="PaymentSuccess">
        <div className="Res-modal ">
          <div className="mt-4 justify-center align-content-center">
            <h5 className="text-center">Session Expired</h5>
            <p
              className="text-center"
              style={{
                color: "#a0a0a0",
                fontSize: "1em",
              }}
            >
              Your session has expired due to inactivity. Please log in again to continue.
            </p>
          </div>
          <div className="ErrorBtn">
            <button
              className="shadow-none outline-none continue-btn w-30 custom-background-color"
              onClick={() => {
                userLogout();
              }}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </GuestLayout>
  );
};

export default SessionExpired;
