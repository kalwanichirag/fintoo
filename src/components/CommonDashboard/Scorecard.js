import { useEffect, useRef, useState } from "react";
import style from "./style.module.css";
import meter from "../../Assets/Images/CommonDashboard/meter.png"
import { get_score_card } from "../../FrappeIntegration-Services/services/financial-planning-api/rp_yourprofile";
import { getUserId } from "../../common_utilities";

const Scorecard = ({ value, width }) => {
  const refPin = useRef(null);
  const timer = useRef(null);
  const [scoreLeft, setScoreLeft] = useState("-10px");
  const [scoreColor, setScoreColor] = useState("#FE432F");

  // useEffect(() => {
  //   if (value === null) return;
  //   setTimeout(() => {
  //     if (refPin.current) {
  //       refPin.current.style.webkitTransform =
  //         "rotate(" + (180 * (Number(value) / 100) - 90) + "deg)";
  //     }

  //   }, 2000);
  // }, [value]);

  useEffect(() => {
    if (value) {

      let position = "3px";
      // let color = ["#FE432F", "#FCAE00", "#FFEB00", "#60C600", "#00B800"]

      // let deg =  "rotate(" + (180 * (Number(value) / 900 ) - 90) + "deg)";
      switch (true) {
        case value <= 20:
          position = "3px";
          // setScoreColor(color[0]);
          break;
        case value > 20 && value <= 40:
          position = "57px";
          // setScoreColor(color[1]);
          break;
        case value > 40 && value <= 60:
          position = "113px";
          // setScoreColor(color[2]);
          break;
        case value > 60 && value <= 80:
          position = "172px";
          // setScoreColor(color[3]);
          break;
        case value > 80 && value <= 100:
          position = "230px";
          // setScoreColor(color[4]);
          break;
        default:
          position = "3px";
          // setScoreColor(color[0]);
          break;
      }

      setTimeout(() => {

        setScoreLeft(position);
      }, 300);
      // // let deg =  "rotate(" + scoreIndicator + "deg)";
      // setScoreDeg(deg)
    }

  }, [value]);

const getScoreCardData = async () => {
  try {
    const user_id = getUserId();
    if (!user_id) {
      console.error("No user ID found for score card data");
      return;
    }

    const decoded_res = await get_score_card(user_id);

    if (decoded_res?.status_code === "200") {
      const solvencyRatio = Number(decoded_res?.data?.ratio?.solvency_ratio);
      const emergencyFundRatio = Number(decoded_res?.data?.ratio?.liquidity_ratio);
      const investmentRatio = Number(decoded_res?.data?.ratio?.saving_ratio);

      // HARD validation
      if (
        Number.isNaN(solvencyRatio) ||
        Number.isNaN(emergencyFundRatio) ||
        Number.isNaN(investmentRatio)
      ) {
        console.warn("Invalid scorecard ratios", {
          solvencyRatio,
          emergencyFundRatio,
          investmentRatio,
        });
        return;
      }

      if (window.webengage?.user) {
        console.log("✅ WebEngage scorecard attributes", {
          solvencyRatio,
          emergencyFundRatio,
          investmentRatio,
        });

        window.webengage.user.setAttribute({
          "Solvency Ratio": solvencyRatio,
        });
         window.webengage.user.setAttribute({
          "Emergency Fund Ratio": emergencyFundRatio,
         });
         window.webengage.user.setAttribute({
          "Investment Ratio": investmentRatio,
        });
      }
    }
  } catch (e) {
    console.log("Error fetching score card data:", e);
  }
};

useEffect(() => {
  getScoreCardData();
}, []);

  useEffect(() => {
  if (value === null || value === undefined) return;

  const scoreValue = Number(value);
  if (Number.isNaN(scoreValue)) return;

  if (window.webengage?.user) {
    console.log("✅ WebEngage Scorecard Value:", scoreValue);

    window.webengage.user.setAttribute({
      "Scorecard Value": scoreValue,
    });
  }
}, [value]);




  return (
    <div className="ScoreCard">
      {/* <div
        id={style["meter-box"]}
        style={{
          width: width + "px",
          height: width * 0.6 + "px",
        }}
      >
        <img
          id={style["meter"]}
          alt="meter"
          style={{ width: "100%" }}
          src={meter}
        />
        <img
          ref={refPin}
          id={style["pin"]}
          alt="pin"
          src="https://res.cloudinary.com/dptwdk7ky/image/upload/v1673938837/Temp/02_meter_new.png"
        />
      </div> */}
      <div style={{
        margin: "1rem 0",
        position: "relative"
      }}>
        <div>
          <img style={{
            // width: "100%",
          }} src={process.env.REACT_APP_STATIC_URL + "media/Creditscoregraph.svg"} />
        </div>
        <div className="CreditScoreTooltip" style={{ left: `${scoreLeft}` }}>
          <span style={{ fontWeight: "bold" }} className="CreditScoreTooltipnumber">{value}</span>
        </div>
      </div>
      <div className="mt-5">
        <div className="" style={{
          color: "#042b62"
        }}>
          Your Score is based on your savings ratio, expense ratio, net worth, liquidity ratio and solvency ratio, take a look at how you have fared in these areas individually to understand where you can improve.
        </div>
        {/* <div className=" ScorecardValue">
          <span style={{ color: "#042b62"}} className="Scoreval">{value}</span>{" "}
          <span className="borderLine">&#x7C;</span>{" "}
          <span style={{ color: "#042b62" }} className="ScoreTotal">100</span>
        </div> */}
      </div>
    </div>
  );
};
export default Scorecard;
