

import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import PhoneVerificationView from "./PhoneVerificationView/PhoneVerificationView";
import { getItemLocal } from "../../../common_utilities";
import HideFooter from "../../../components/HideFooter";
import HideHeader from "../../../components/HideHeader";
import styles from "../AuthModal.module.css";
const Profile = () => {

  const router = useNavigate();

  const [showMobileVerification, setMobileVerification] = useState(false);

  useEffect(() => {
    const user_data = JSON.parse(localStorage.getItem("user_data") || '{}');

    if (user_data) {
      // const parsedUserData = JSON.parse(user_data);
      if (user_data.mobile_verified == false) {
        setMobileVerification(true);
        return;
      } else {
        if (!Boolean(user_data.user_onboarding_status)) {
          // router.push('/onboarding-flow');
          setMobileVerification(false);
          return;
        } else {
          router.push('/commondashboard');
          return;
        }
      }
    }
  }, []);

  return (

    <>
      <HideFooter />
      <HideHeader />
      {/* {showMobileVerification} */}
      <div className={styles.backdrop}>
        <div className={styles.verificationWrapper}>
          <div className={styles.verificationContainer}>
            {
              showMobileVerification == true && <>
                <div className="bg-backdropColor">
                  <PhoneVerificationView />
                </div>
              </>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
