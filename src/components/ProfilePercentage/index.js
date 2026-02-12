const { Link } = require("react-router-dom");
import { useEffect, useState } from "react";
import styles from "./style.module.css";
import { Modal as ReactModal } from "react-responsive-modal";
import { DMF_GET_USER_PROFILE_STATE_URL } from "../../constants";
import { fetchEncryptData, getProfilePercentage, getUserId } from "../../common_utilities";
// import { fetchUserData } from "../../common_utilities";
import ReactApexChart from "react-apexcharts";
import Swal from "sweetalert2";
import { Fetch_User_Mf_Profile_Status } from "../../FrappeIntegration-Services/services/financial-planning-api/ndaflow";
import {
  fetchUserProfileDetails
} from "../../FrappeIntegration-Services/services/user-management-api/userApiService";

const ProfilePercentage = () => {
  //   const [profileStatus, setProfileStatus] = useState({});
  const [percent, setPercent] = useState(100);
  const [userData, setUserData] = useState("");
  const [isOpenReKycModal, setIsOpenReKycModal] = useState(false);
  const [donutData, setDonutData] = useState({
    series: [44, 55, 41, 17, 15],
    options: {
      chart: {
        type: "donut",
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

  useEffect(() => {
    userProfileState();
  }, []);

  const userProfileState = async () => {
    // setIsLoading1(true);
    try {
      const userdata = await fetchUserProfileDetails(getUserId());
      setUserData(userdata.data);
      console.log("nil userdata", userdata.data);
      const profilePercentage = await Fetch_User_Mf_Profile_Status(getUserId());
      
      if(profilePercentage) {
        setPercent(profilePercentage.user_profile_progress.profile_status);
      } else {
        setPercent(0);
      }
    } catch (e) {
      console.error("natu err", e);
    }
  };

  return (
    <>
        <ReactModal
          classNames={{
            modal: "ModalpopupContentWidth",
          }}
          open={isOpenReKycModal}
          showCloseIcon={true}
          center
          animationDuration={0}
          closeOnOverlayClick={false}
          large
          onClose={() => setIsOpenReKycModal(false)}
        >
          <div>
            <h3 className="text-center HeaderText">Attention !</h3>
            <div className="p-2" style={{ fontSize: "1.2rem" }}>
              <p>Dear Client,</p>
              <p>
                We regret to inform you that your KYC verification has failed
                due to certain reasons. As per the recent circular by SEBI, we
                need you to undergo the Re-KYC (Re-verification of KYC) process.
              </p>
              <p>
                Ensuring compliance with KYC norms is crucial for regulatory
                purposes and to maintain the integrity of our financial
                services. Therefore, we kindly request your cooperation in
                completing the Re-KYC process at your earliest convenience.
              </p>
              <p>
                Please{" "}
                <a
                  href="https://investor-web.hdfcfund.com/kyc-verification"
                  onClick={() => {
                    setIsOpenReKycModal(false);
                  }}
                  target="_blank"
                >
                  Click Here
                </a>{" "}
                to initiate the Re-KYC process. Your understanding and prompt
                action in this matter are greatly appreciated.
              </p>
              <div
                className="ButtonBx aadharPopUpFooter"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <button
                  className="ReNew"
                  onClick={() => {
                    setIsOpenReKycModal(false);
                    window.open(
                      "https://investor-web.hdfcfund.com/kyc-verification",
                      "_blank"
                    );
                  }}
                >
                  Re-KYC
                </button>
                <button
                  style={{ backgroundColor: "#999" }}
                  className="ReNew"
                  onClick={() => {
                    setIsOpenReKycModal(false);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </ReactModal>
      {Number(percent) < 100 && (
        <Link
          to={process.env.PUBLIC_URL + "/direct-mutual-fund/profile"}
          style={{ textDecoration: "none", color: "#042b62" }}
          onClick={(e)=> {
            if(userData.user_is_minor === 1 && userData.user_bse_registered == 1) {
              e.preventDefault();
              Swal.fire({
                title: "Note!",
                html: "Your account verification is under process. We'll notify you by email once it's completed.",
                icon: "info",
              });
            }
            if ((userData.user_aof_verified === 1 || userData.user_bse_registered === 1) && userData.kyc_verified == 0){
              e.preventDefault();
              setIsOpenReKycModal(true);
            }
          }}
        >
          <div
            className={`d-flex align-items-center my-profile-complete ${styles["my-profile-complete"]}`}
          >
            <div className={styles["mpc-1"]}>
                {(userData.user_is_minor === 1 && userData.user_bse_registered == 1) ? 'Authentication In Process' : 'Complete Your Profile'}
            </div>
            <div className={` align-items-center ${styles["mpc-2"]}`}>
              {Number(percent) === 0 ? <p>&nbsp;&nbsp;</p> : <p>{percent}%</p>}
              <img
                style={{ width: "1.2rem", height: "1.2rem" }}
                src={process.env.REACT_APP_STATIC_URL + "media/DMF/next.svg"}
              />
            </div>
          </div>
        </Link>
      )}
    </>
  );
};
export default ProfilePercentage;
