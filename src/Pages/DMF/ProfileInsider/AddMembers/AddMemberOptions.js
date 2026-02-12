import React, { useEffect, useState, useRef } from "react";
import style from "./style.module.css";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { Link, Router, redirect, useNavigate } from "react-router-dom";
import {
  fetchEncryptData,
  getItemLocal,
  getProfilePercentage,
  getUserId,
} from "../../../../common_utilities";
import { toast } from "react-toastify";
import IncompleteRegistration from "../../../../components/IncompleteRegistration";
import { Fetch_User_Mf_Profile_Status } from "../../../../FrappeIntegration-Services/services/financial-planning-api/ndaflow";

const AddMemberOptions = (props) => {
  localStorage.removeItem("combinedDetails");
  localStorage.removeItem("ParentDetails");

  const navigate = useNavigate();
  const [statusData, setStatusData] = useState("");

  useEffect(() => {
    document.body.style.background = "white";

    return () => document.body.style.removeProperty("background");
  }, []);

  useEffect(() => {
    userProfileState();
  }, []);

  const userProfileState = async () => {
    try {
      const profilePercentage = await Fetch_User_Mf_Profile_Status(getUserId());
      setStatusData(profilePercentage.user_profile_progress);
    } catch (e) {
      console.error("natu err", e);
    }
  };

  return (
    <div>
      <div className={`${style.elemContainer} ${style.elemContainerWidth}`}>
        <div className={`${style.optionsHeaderContainer}`}>
          <img
            style={{
              transform: "rotate(180deg)",
              marginBottom: "0.5rem",
              cursor: "pointer",
            }}
            width={20}
            height={20}
            src={process.env.PUBLIC_URL + "/static/media/icons/chevron.svg"}
            onClick={() => navigate(-1)}
          />
          <div className={`${style.titleTxt}`}>Account Type</div>
        </div>

        <div className={`${style.optionsContainer}`}>
          <div>
            <div className={`${style.titleTxt}`}>New Member</div>
            <div className={`${style.titleTxtSub}`}>
              Create an account for a family member above 18 years of age
            </div>
            <Link
              to={`${process.env.PUBLIC_URL}/direct-mutual-fund/profile/addmembers`}
            >
              <div className={`${style.addMemberBtn}`}>+ Add</div>
            </Link>
          </div>
          <div>
            <div className={`${style.titleTxt}`}>
              Minor{" "}
              <span className={`${style.chip}`}>Coming Soon</span>
              {/* <span data-title="Please note that you would need to provide information about an adult guardian (with proof of relationship) and a bank account in the name of the minor under the guardianship of the adult guardian.">
                <AiOutlineInfoCircle />
              </span> */}
            </div>
            <div className={`${style.titleTxtSub}`}>
              Create an account for Minor with age less than 18 years.
            </div>
            {/* <span
              onClick={(e) => {
                localStorage.removeItem("YmFua19pZA==");
                localStorage.removeItem("klmclNXd");
                localStorage.removeItem("Bank_DETAILS");
                if (statusData !== 100) {
                  e.preventDefault();
                  toast.error(
                    "Please complete the Profile for Guardian’s first. ",
                    {
                      position: toast.POSITION.BOTTOM_LEFT,
                    }
                  );

                  setTimeout(() => {
                    navigate(
                      `${process.env.PUBLIC_URL}/direct-mutual-fund/profile/`
                    );
                  }, 3000);
                } else {
                  navigate(
                    `${process.env.PUBLIC_URL}/direct-mutual-fund/profile/AddMinor?minor=1`
                  );
                }
              }}
            > */}
              <span className={`${style.addMemberBtn} ${style.disabledElem}`}
                // className={`${style.addMemberBtn} ${
                //   statusData !== 100 ? style.disabled : ""
                // }`}
              >
                + Add
              </span>
            {/* </span> */}
          </div>
          <div>
            <div
              className={`${style.titleTxt}`}
              style={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
              Hindu Undivided Family (HUF){" "}
              <span className={`${style.chip}`}>Coming Soon</span>
            </div>
            <div className={`${style.titleTxtSub}`}>
              Create a Hindu Undivided Family (HUF) account.
            </div>
            <div className={`${style.addMemberBtn} ${style.disabledElem}`}>
              + Add
            </div>
          </div>
          <div>
            <div
              className={`${style.titleTxt}`}
              style={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
              Corporate <span className={`${style.chip}`}>Coming Soon</span>
            </div>
            <div className={`${style.titleTxtSub}`}>
              Create a Corporate account in name of a Company
            </div>
            <div className={`${style.addMemberBtn} ${style.disabledElem}`}>
              + Add
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMemberOptions;
