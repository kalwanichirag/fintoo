import React, { useEffect, useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import { Link, useSearchParams } from "react-router-dom";
// import FintooLogo from "../Assets/Dashboard/fintoo_white.png";
import { connect } from "react-redux";
import style from "./style.module.css";
import FintooLogo from "../../Assets/Images/F_logo.png";
import { useLocation } from "react-router-dom";
import { getProfilePercentage ,getItemLocal, getUserId} from "../../common_utilities";
import AdvisoryIcon from './images/01_advisory.svg'
import { Fetch_User_Mf_Profile_Status } from "../../FrappeIntegration-Services/services/financial-planning-api/ndaflow";
import { useDispatch } from "react-redux";
const DashboardSidebar = (props) => {
  const location = useLocation();
  const [currentUrl, setCurrentUrl] = useState("");
  const [searchParams] = useSearchParams();
  const [percent, setPercent] = useState(0);
  const dispatch = useDispatch();

  React.useEffect(() => {
    setCurrentUrl(location.pathname);
  }, [location]);

  useEffect(() => {
    userProfileState();
  }, []);

  const userProfileState = async () => {
    try {
      const profilePercentage = await Fetch_User_Mf_Profile_Status(getUserId());
      setPercent(profilePercentage.user_profile_progress.profile_status);
    } catch (e) {
      console.log("natu err");
      console.error("natu err", e);
    }
  };

  return (
    <>
    
      <div className={`${style.sidebar} ${props.hideSideBar ? "d-none" : ""}`}>
        
        {searchParams.get("update") == null && (
          
          <div className={style["in-sidebar"]}>
            {/* <div className={style["fintoo-dashboard-logo"]}>
            <img src={FintooLogo} />
          </div> */}
        {getItemLocal('family')?"":
            <div className={style["profile-menu-list"]}>
              
              <Link
                className={`menu-link-182 ${style["menu-link"]} ${
                  currentUrl.toLowerCase().indexOf("dashboard") > -1 &&
                  currentUrl.toLowerCase().split("/")[
                    currentUrl.toLowerCase().split("/").length - 1
                  ] == "dashboard"
                    ? "active"
                    : ""
                }`}
                to={`${process.env.PUBLIC_URL}/direct-mutual-fund/profile/dashboard`}
              >
                <span className="">
                  <img src={AdvisoryIcon} />
                </span>
                <span className="">Profile</span>
              </Link>
            </div>
        }
            {percent === 100 && (
              <>
            {getItemLocal("family")?"":
                <div className={style["profile-menu-list"]}>
                  <Link
                    onClick={() => {
                      dispatch({ type: "BANK_ADD_COUNT" });
                    }}
                    className={`menu-link-182 ${style["menu-link"]} ${
                      currentUrl
                        .toLowerCase()
                        .indexOf("dashboard/bankaccount") > -1
                        ? "active"
                        : ""
                    }`}
                    to={`${process.env.PUBLIC_URL}/direct-mutual-fund/profile/dashboard/bankaccount`}
                  >
                    <span className="">
                      <img src={AdvisoryIcon} />
                    </span>
                    <span className="">Bank details</span>
                  </Link>
                </div>
            }
            {getItemLocal("family")?"":
                <div className={style["profile-menu-list"]}>
                  <Link
                    onClick={() => {
                      dispatch({ type: "NOMINEE BACK" });
                    }}
                    className={`menu-link-182 ${style["menu-link"]} ${
                      currentUrl.toLowerCase().indexOf("dashboard/nominee") > -1
                        ? "active"
                        : ""
                    }`}
                    to={`${process.env.PUBLIC_URL}/direct-mutual-fund/profile/dashboard/Nominee`}
                  >
                    <span className="">
                      <img src={AdvisoryIcon} />
                    </span>
                    <span className="">Nominee</span>
                  </Link>
                </div>
            }
              </>
            )}
          </div>
        )}
        

      </div>

    </>
                  
  );
};

const mapStateToProps = (state) => ({
  hideSideBar: state.hideSideBar,
});

export default connect(mapStateToProps)(DashboardSidebar);
