import React, { useState, useEffect } from "react";
import Styles from "./style.module.css";
import RiskMeter from "./Assets/02_01_Risk_meter_small_icon.svg";
import MaleAvatarImg from "./Assets/02_03_Risk_Appetite_Male.svg";
import FemaleAvatarImg from "./Assets/02_03_Risk_Appetite_Female.svg";
import InvestPyramid from "./Assets/02_05_investment_pyramid.png";
import investment from "./Assets/02_03_Risk_Appetite_Male.png";
import Fullline from "./Assets/full_line_dot.png";
import {
  apiCall,
  getItemLocal,
  getParentUserId,
  loginRedirectGuest,
} from "../../../../common_utilities";
function Risk_Appetite() {
  const [userSessionData, setUserSessionData] = useState({});
  const [userRiskAppetiteData, setRiskAppetiteData] = useState({});
  const [Avatar, setAvatar] = useState("");
  const [riskIndicator, setRiskIndicator] = useState("7%");
  const [riskProfile, setRiskProfile] = useState("");
  const [riskMessage, setRiskMessage] = useState("");
  const userid = getParentUserId();

  const getSessionData = async () => {
    // let url = CHECK_SESSION;
    // let data = { user_id: userid, sky: getItemLocal("sky") };
    // let session_data = await apiCall(url, data, true, false);
    // if (session_data["error_code"] == "100") {
    //   setUserSessionData(session_data["data"]);
    //   if (session_data["data"]["user_details"]["gender"] == "male") {
    //     setAvatar(MaleAvatarImg);
    //   } else if (session_data["data"]["user_details"]["gender"] == "female") {
    //     setAvatar(FemaleAvatarImg);
    //   }
    // } else if (session_data["error_code"] == "102") {
    //   loginRedirectGuest();
    // } else {
    //   setUserSessionData({});
    // }
  };

  const getRpRiskAppetite = async () => {
    if (Object.keys(userSessionData).length != 0) {
      // let url = ADVISORY_RISK_APPETITE_API_URL;
      let url = '';
      let data = {
        user_id: userSessionData["user_details"]["user_id"],
        fp_log_id: userSessionData["user_details"]["fp_log_id"],
      };
      let response = await apiCall(url, data, true, false);
      if (response["error_code"] == "100") {
        setRiskAppetiteData(response["data"]);
        let riskProfile = response["data"][0]["field2"];
        setRiskMessage(response["data"][0]["field3"]);
        if (riskProfile == "Highly Conservative") {
          setRiskIndicator("7%");
        } else if (riskProfile == "Conservative") {
          setRiskIndicator("27%");
        } else if (riskProfile == "Moderate") {
          setRiskIndicator("47%");
        } else if (riskProfile == "Aggressive") {
          setRiskIndicator("67%");
        } else if (riskProfile == "Highly Aggressive") {
          setRiskIndicator("87%");
        }
        setRiskProfile(riskProfile);
      }
    }
  };

  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    if (!userid) {
      loginRedirectGuest();
    }
  }, []);

  useEffect(() => {
    getSessionData();
  }, []);

  useEffect(() => {
    getRpRiskAppetite();
  }, [userSessionData]);

  return (
    <>
      {/* <ReportHeader /> */}
      <div>
        <div className={`${Styles.ReportProfile}`}>
          <div className="d-flex justify-content-between">
            <div className="d-flex">
              <div>
                <img width={30} src={RiskMeter} />
              </div>
              <div className={`ms-md-4 ${Styles.RiskData}`}>
                <div className={`${Styles.riskTitle}`}>Risk Appetite </div>
                <div className={`${Styles.riskPara}`} dangerouslySetInnerHTML={{ __html: riskMessage }}></div>
                <div className={`${Styles.RiskBarSection}`}>
                  <p className={`${Styles.barText}`}>
                    Risk Profile : <span>{riskProfile}</span>{" "}
                  </p>
                  <div className={`${Styles.RiskBar}`}>
                    <div className={`${Styles.riskappetitebar}`}>
                      <ul className={`${Styles.riskbar}`}>
                        <li className={`${Styles.level1}`}></li>
                        <li className={`${Styles.level2}`}></li>
                        <li className={`${Styles.level3}`}></li>
                        <li className={`${Styles.level4}`}></li>
                        <li className={`${Styles.level5}`}></li>
                      </ul>
                      <span
                        className={`${Styles.riskindicator}`}
                        style={{
                          left: riskIndicator,
                        }}
                      ></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={` ${Styles.RightSection}`}>
              <p className="text-center">Your Avatar</p>
              <div>
                <img width={200} src={MaleAvatarImg} />
              </div>
            </div>
          </div>

          <div
            className={`d-flex justify-content-between ${Styles.InvestmentPhilosophy}`}
          >
            <div className="d-flex">
              <div>
                <img width={30} src={investment} />
              </div>
              <div className={`ms-md-4 ${Styles.RiskData}`}>
                <div className={`${Styles.riskTitle}`}>
                  Investment Philosophy{" "}
                </div>

                <div className={`${Styles.RiskBarSection}`}>
                  <div className={`${Styles.barBox}`}>
                    <p className={`${Styles.barBoxtype}`}>Highly Aggresive</p>
                  </div>
                  <div className={`${Styles.InvestBox}`}>
                    <div>
                      <div className={`${Styles.InvestTxt}`}>
                        Equity Assets Class
                      </div>
                      <div className={`${Styles.InvestPara}`}>
                        Derivatives, F&O, Stocks, IPO, Sector Mutual Fund, Small
                        Cap Mutual Fund, PMS, Venture capital, Unlisted Stocks,
                        Etc.
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className={`${Styles.InvestTxt}`}>
                        Others Assets Class{" "}
                      </div>
                      <div className={`${Styles.InvestPara}`}>
                        AIF, Crypto Currency Etc.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={` ${Styles.RightSection}`}>
              <div className={`${Styles.FullLine}`}>
                <img src={Fullline} />
              </div>
              <div className={`${Styles.InvestPyramid}`}>
                <img width={400} src={InvestPyramid} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <ReportFooter /> */}
    </>
  );
}

export default Risk_Appetite;
