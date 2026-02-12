import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Styles from "../KeyDifferentiators/Styles.module.css";
const active = {
  //   borderBottom: "3px solid #042b62",
  color: "#042b62",
  backgroundColor: "#ffff",
};
const bgcolor = {
  backgroundColor: "#fff",
  transition: ".2s ease-in-out",
};
const inactive = {};
const TabName = ["EQUITY", "REAL_ESTATE", "DEBT", "ALTERNATIVES"];

TabName.map((Tabs, index) => index + " = " + Tabs + " = " + TabName[index]);
const KeyDifferentiators = () => {
  const { pathname, hash } = useLocation();
  const [showTab, setShowTab] = useState("EQUITY");
  useEffect(() => {
    if (hash == "#international") {
      setShowTab("usequity");
    } else if (hash == "#domestic") {
      setShowTab("equity");
    } else {
      setShowTab("EQUITY");
    }
  }, [hash]);
  return (
    <>
      <div className="container p-md-5 ">
        <h2 className="text-center pt-md-0 pt-4">Equity Offerings</h2>
        <div className={`${Styles.tabSection}`}>
          <div
            className={`${Styles.tabData}`}
            style={showTab == "EQUITY" ? bgcolor : inactive}
          >
            <div className={`${Styles.links}`}>
              <div
                onMouseOver={() => setShowTab("EQUITY")}
                className={`${Styles.tabName} ${showTab ? "ActiveTab" : ""}`}
              >
                <div
                  className="d-flex align-items-center"
                  style={showTab == "EQUITY" ? active : inactive}
                >
                  <div>
                    {showTab == "EQUITY" ? (
                      <>
                        <img
                          alt=""
                          style={{
                            width: "40px",
                          }}
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/wp/InvestPlan/Private_Equity.png"
                          }
                        />
                      </>
                    ) : (
                      <>
                        <img
                          alt=""
                          style={{
                            width: "40px",
                          }}
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/wp/InvestPlan/Private_Equity_1.png"
                          }
                        />
                      </>
                    )}
                  </div>
                  <span>Private Equity</span>
                </div>
              </div>
              <div
                onMouseOver={() => setShowTab("REAL_ESTATE")}
                className={`${Styles.tabName}`}
              >
                <div
                  className="d-flex align-items-center"
                  style={showTab == "REAL_ESTATE" ? active : inactive}
                >
                  <div>
                    {showTab == "REAL_ESTATE" ? (
                      <>
                       <img
                          alt=""
                          style={{
                            width: "40px",
                          }}
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/wp/InvestPlan/Structured_Product.png"
                          }
                        />
                      </>
                    ) : (
                      <>
                        <img
                          alt=""
                          style={{
                            width: "40px",
                          }}
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/wp/InvestPlan/Structured_Product_1.png"
                          }
                        />
                      </>
                    )}
                  </div>
                  <span>Structured Product</span>
                </div>
              </div>
              <div
                onMouseOver={() => setShowTab("DEBT")}
                className={`${Styles.tabName}`}
              >
                <div
                  className="d-flex align-items-center"
                  style={showTab == "DEBT" ? active : inactive}
                >
                  <div>
                    {showTab == "DEBT" ? (
                      <>
                        <img
                          alt=""
                          style={{
                            width: "40px",
                          }}
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/wp/InvestPlan/Offshore_Investments.png"
                          }
                        />
                      </>
                    ) : (
                      <>
                       <img
                          alt=""
                          style={{
                            width: "40px",
                          }}
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/wp/InvestPlan/Offshore_Investments_1.png"
                          }
                        />
                      </>
                    )}
                  </div>
                  <span>Offshore Investments</span>
                </div>
              </div>
              <div
                onMouseOver={() => setShowTab("ALTERNATIVES")}
                className={`${Styles.tabName}`}
              >
                <div
                  className="d-flex align-items-center"
                  style={showTab == "ALTERNATIVES" ? active : inactive}
                >
                  <div>
                  {showTab == "ALTERNATIVES" ? (
                      <>
                        <img
                          alt=""
                          style={{
                            width: "40px",
                          }}
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/wp/InvestPlan/Other_Direct_Investment.png"
                          }
                        />
                      </>
                    ) : (
                      <>
                         <img
                          alt=""
                          style={{
                            width: "40px",
                          }}
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/wp/InvestPlan/Other_Direct_Investment_1.png"
                          }
                        />
                      </>
                    )}
                  </div>
                  <span>Other Direct Investment</span>
                </div>
              </div>
            </div>
            <div className={`${Styles.tabSectionContent}`}>
              {showTab == "EQUITY" && (
                <>
                <ul>
                  <li>Private Equity</li>
                  <li>Early identification of leaders in the emerging market.</li>
                  <li>Novel opportunities in high-growth companies.</li>
                  <li>Association with dynamic and innovative entrepreneurs.</li>
                </ul>
                </>
              )}
              {showTab == "REAL_ESTATE" && (
                <>
                 <ul>
                  <li>In-house research with tailored solutions.</li>
                  <li>Analysis based on qualitative and quantitative parameters.</li>
                  <li>Fintoo’s exclusively curated, research-based structured
                    product solutions.</li>
                </ul>
                </>
              )}
              {showTab == "DEBT" && (
                <>
                 <ul>
                  <li>Access to various opportunities in diversified markets
                    across the globe.</li>
                  <li>Provides hedge against exchange & economic risk.</li>
                  <li>Tax-efficient structured product solutions.</li>
                </ul>
                </>
              )}
              {showTab == "ALTERNATIVES" && (
                <>
                 <ul>
                  <li>Direct Mutual Funds.</li>
                  <li>Direct Portfolio Management Services.</li>
                  <li>Direct equity-oriented Alternative Investments Funds (AIF).</li>
                </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default KeyDifferentiators;
