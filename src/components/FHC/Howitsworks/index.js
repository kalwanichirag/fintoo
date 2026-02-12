import React, { useEffect } from "react";
import styles from "./howiteworks.module.css";
import steps from "./steps.module.css"
function Howitsworks(props) {
  const redirectionToLogin = props.redirectToLogin;

  return (
    <div>
      <div className={`${styles.Howitsworks}`} style={{ position: "relative" }}>
        <div className={`${styles.timelineData}`}>
          <div
            style={{ position: "relative", top: "2rem" }}
            className={`${styles.title}`}
          >
            How it Works ?
          </div>
          <div className={`mt-md-2 mt-4 ${steps.StepsInvestmentPlanBox} ${steps.StepsInvestmentPlanBox12}`}>
            <div className={`${steps.StepsInvestmentPlanCard}`}>
              <div className={`${steps.StepsInvestmentPlanCardImg}`}>
                <img
                  src={
                    process.env.REACT_APP_STATIC_URL +
                    "media/wp/FPPlan/number-one.svg"
                  }
                  alt=""
                />
                {/* <img src={One} /> */}
              </div>
              <div className={`${steps.StepsInvestmentPlancontent}`}>
                <div className={`${steps.StepsInvestmentPlancontenttitle}`}>
                Start your journey
                </div>
                <div className={`text-white ${steps.StepsInvestmentPlanContentText}`}>
                Enroll and subscribe to our services.
                </div>
              </div>
            </div>
            <div className={`${steps.StepsInvestmentPlanCard}`}>
              <div className={`${steps.StepsInvestmentPlancontent}`}>
                <div className={`${steps.StepsInvestmentPlancontenttitle}`}>
                Provide your financial details
                </div>
                <div className={`text-white ${steps.StepsInvestmentPlanContentText}`}>
                Enter your financial information, including income, expenses, assets and liabilities.

                </div>
              </div>
              <div className={`${steps.StepsInvestmentPlanCardImg}`}>
                <img
                  src={
                    process.env.REACT_APP_STATIC_URL +
                    "media/wp/FPPlan/number-2.svg"
                  }
                  alt=""
                />
                {/* <img src={Two} /> */}
              </div>
            </div>
            <div className={`${steps.StepsInvestmentPlanCard}`}>
              <div className={`${steps.StepsInvestmentPlanCardImg}`}>
                <img
                  src={
                    process.env.REACT_APP_STATIC_URL +
                    "media/wp/FPPlan/number-3.svg"
                  }
                  alt=""
                />
                {/* <img src={Three} /> */}
              </div>
              <div className={`${steps.StepsInvestmentPlancontent}`}>
                <div className={`${steps.StepsInvestmentPlancontenttitle}`}>
                Generate your Report
                </div>
                <div className={`text-white ${steps.StepsInvestmentPlanContentText}`}>
                Generate your Financial Health Check-up Report within 30 seconds.
                </div>
              </div>
            </div>         
            <div className={`${steps.StepsInvestmentPlanCard}`}>
              <div className={`${steps.StepsInvestmentPlancontent}`}>
                <div className={`${steps.StepsInvestmentPlancontenttitle}`}>
                Receive tailored financial advice
                </div>
                <div className={`text-white ${steps.StepsInvestmentPlanContentText}`}>
                Get personalized recommendations to optimize your portfolio performance, manage your finances effectively.
              
                </div>
              </div>
              <div className={`${steps.StepsInvestmentPlanCardImg}`}>
                <img
                  src={
                    process.env.REACT_APP_STATIC_URL +
                    "media/wp/FPPlan/Four.png"
                  }
                  alt=""
                />
                {/* <img src={Two} /> */}
              </div>
            </div>
            <div className={`${steps.StepsInvestmentPlanCard}`}>
              <div className={`${steps.StepsInvestmentPlanCardImg}`}>
                <img
                  src={
                    process.env.REACT_APP_STATIC_URL +
                    "media/wp/FPPlan/five.png"
                  }
                  alt=""
                />
                {/* <img src={One} /> */}
              </div>
              <div className={`${steps.StepsInvestmentPlancontent}`}>
                <div className={`${steps.StepsInvestmentPlancontenttitle}`}>
                Access comprehensive financial insights
                </div>
                <div className={`text-white ${steps.StepsInvestmentPlanContentText}`}>
                Discover the power of financial insights at your fingertips with our comprehensive financial dashboard!
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            borderTop: "1px solid rgb(84 84 84 / 56%)",
            borderWidth: "thin",
            height: "100%",
          }}
        ></div>
        <div className={`${styles.planPriceSection}`}>
          <div>
            <div className={`${styles.planName}`}>
              Get Financial Health Check-up
            </div>
            <div className={`${styles.planPrice}`}>
              <span>At just</span> <span>₹ 2,499<sup>*</sup>/-</span>
            </div>
            <div className={`${styles.subscribeBtn} mt-2`}>
              <button type="button" onClick={() => redirectionToLogin()}>
                Subscribe Now
              </button>
            </div>
          </div>
          {/* <div
              style={{
                borderRight: "1px solid rgb(84 84 84 / 56%)",
                borderWidth: "thin",
                width: "10px",
                height: "190px",
                padding: "2rem ",
              }}
            ></div> */}
          <div className={`${styles.planinfo}`}>
            <div className="d-flex align-items-center">
              <div className={`${styles.listStart}`}>*</div>{" "}
              <div>Comprehensive Financial Planning</div>
            </div>
            <div className="d-flex align-items-center">
              <div className={`${styles.listStart}`}>*</div>{" "}
              <div>Money Management</div>
            </div>
            <div className="d-flex align-items-center">
              <div className={`${styles.listStart}`}>*</div>{" "}
              <div>Networth Analysis</div>
            </div>
            <div className="d-flex align-items-center">
              <div className={`${styles.listStart}`}>*</div>{" "}
              <div>Goal Analysis</div>
            </div>
            <div className="d-flex align-items-center">
              <div className={`${styles.listStart}`}>*</div>{" "}
              <div>Risk Management</div>
            </div>
            <div className="d-flex align-items-center">
              <div className={`${styles.listStart}`}>*</div>{" "}
              <div>Cashflow Analysis</div>
            </div>
            <div className="d-flex align-items-center">
              <div className={`${styles.listStart}`}>*</div>{" "}
              <div>Retirement Corpus</div>
              Assessment
            </div>
            <div className="d-flex align-items-center">
              <div className={`${styles.listStart}`}>*</div>{" "}
              <div>Review & Rebalancing of Portfolio</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Howitsworks;
