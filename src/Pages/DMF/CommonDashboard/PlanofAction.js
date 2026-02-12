import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import Insuranceplan from "../../../components/CommonDashboard/Insurance/Insuranceplan";
import Investmentplan from "../../../components/CommonDashboard/Investplan/Investmentplan";
import CommonDashboardLayout from "../../../components/Layout/Commomdashboard";
import { ADVISORY_GET_PLANOFACTION_API_URL, BASE_API_URL, CHECK_SESSION, imagePath } from "../../../constants";
import Styles from "./Planofaction.module.css";
import CommingSoon from '../../../components/Assets/coming-soon.svg';

import FintooInlineLoader from "../../../components/FintooInlineLoader";
const PlanofAction = (props) => {
  const navigate = useNavigate();
  const active = {
    color: "#fff",
    backgroundColor: "rgb(18 169 238)",
    boxShadow: "0 8px 10px -4px rgb(0 0 0 / 20%)",
    fontWeight: "300px",
    // borderBottom: "3px solid #042b62",
    // paddingBottom: "4px",
    // display: "inline-block",
  };
  const inactive = {};
  const TabName = ["Investment", "Insurance", "Loan"];
  TabName.map((Tabs, index) => index + " = " + Tabs + " = " + TabName[index]);
  const [showTab, setShowTab] = useState("Investment");
  const mutualfunddata = props.mutualfunddata;
  const lifeinsurancerecomm = props.lifeinsurancerecomm;
  const lifeinsurance = props.lifeinsurance;
  const totalmfsum = props.totalmfsum;
  const interval = useRef(null);
  const timer = useRef(0);
  const startTimer = () => {
    // if idle for more than 5 mins logout
    if (timer.current >= 4) {
      clearInterval(interval.current)
      window.location.href = "https://stg.minty.co.in/web/logout"
    }
    else {
      timer.current = timer.current + 1
    }
  }
  const incrementTimer = () => {
    interval.current = setInterval(() => {
      startTimer()
    }, 60000);
  }
  const resetTimer = () => {
    clearInterval(interval.current)
  }
  useEffect(() => {
    // incrementTimer()

  }, [])
  return (<>
    <CommonDashboardLayout>
      <div
        className={`${Styles.PlanofActionsection}`}
        onMouseEnter={() => {
          resetTimer();
        }}
        onMouseLeave={() => {
          resetTimer();
        }}
      >
        <div className={`${Styles.title}`}>
          Here is the plan of action that we have come up with to meet your
          financial goals and risk management, which will help you to achieve
          your future financial goals and also cover your life and health
          benefits.Below we have bifurcated your plan of action into three
          categories : Investments, Insurance, and Loans.
        </div>
        <div className={`${Styles.TabSection}`}>
          <div
            className={`${Styles.investList}`}
            onClick={() => setShowTab("Investment")}
          >
            <p
              style={showTab == "Investment" ? active : inactive}
              className="InvestType custom-background-color"
            >
              Investment
              <span>
                <img src={BASE_API_URL + "static/userflow/img/icons/Investment-db.svg"} alt="Investment" />
              </span>
            </p>
          </div>
          {/* <div
            className={`${Styles.investList}`}
            onClick={() => setShowTab("Insurance")}
          >
            <p
              style={showTab == "Insurance" ? active : inactive}
              className="InvestType custom-background-color"
            >
              Insurance
              <span>
              <img src={BASE_API_URL+"static/userflow/img/icons/Insurance-db.svg"} alt="Insurance" />
              </span>
            </p>
          </div> */}
          <div
            className={`${Styles.investList}`}
            onClick={() => setShowTab("Loan")}
          >
            <p
              style={showTab == "Loan" ? active : inactive}
              className="InvestType custom-background-color"
            >
              Loan
              <span>
                <img src={BASE_API_URL + "static/userflow/img/icons/Loan.svg"} alt="Loan" />
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className={`${Styles.Tabbox}`}>
        {showTab == "Investment" && (
          <>
            <FintooInlineLoader isLoading={props.isLoading} />
            <Investmentplan
              mutualfunddata={mutualfunddata}
              totalmfsum={totalmfsum}
            />
          </>
        )}
        {/* {showTab == "Insurance" && (
          <>
            <FintooInlineLoader isLoading={props.isLoading}/>
            <Insuranceplan
              lifeinsurancerecomm={lifeinsurancerecomm}
              lifeinsurance={lifeinsurance}
            />
          </>
        )} */}
        {showTab == "Loan" && (
          <>
            <div className={`${Styles.CommingSoonImg}`}>
              <img src={imagePath + CommingSoon} />
            </div>
          </>
        )}
      </div>
    </CommonDashboardLayout>
  </>
  );
};

export default PlanofAction;

