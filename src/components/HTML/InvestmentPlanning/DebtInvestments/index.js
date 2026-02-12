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
const DebtInvestments = () => {
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
        <h2 className="text-center pt-md-0 pt-4">Debt Investments</h2>
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
                            "media/wp/InvestPlan/Market_Linked_Debentures.jpg"
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
                            "media/wp/InvestPlan/Market_Linked_Debenture_1.png"
                          }
                        />
                      </>
                    )}
                  </div>
                  <span>Market Linked Debentures</span>
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
                            "media/wp/InvestPlan/Exclusive_Bond_Deals.png"
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
                            "media/wp/InvestPlan/Exclusive_Bond_Deals_1.png"
                          }
                        />
                      </>
                    )}
            
                  </div>
                  <span>Exclusive Bond Deals</span>
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
                            "media/wp/InvestPlan/Debt_Warehousing.png"
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
                            "media/wp/InvestPlan/Debt_Warehousing_1.png"
                          }
                        />
                      </>
                    )}
                  </div>
                  <span>Debt Warehousing</span>
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
                            "media/wp/InvestPlan/Direct_Debt_PMS_Mutual_Funds.png"
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
                            "media/wp/InvestPlan/Direct_Debt_PMS_Mutual_Funds_1.png"
                          }
                        />
                      </>
                    )}

                  </div>
                  <span>Direct Debt PMS & Mutual Funds</span>
                </div>
              </div>
            </div>
            <div className={`${Styles.tabSectionContent}`}>
              {showTab == "EQUITY" && (
                <>
                  <p>
                    Investing in highly tax-efficient hybrid instruments could
                    be either with principal protection or without principle
                    protection.
                  </p>
                </>
              )}
              {showTab == "REAL_ESTATE" && (
                <>
                  <p>
                    Expertise in getting the best deals on bonds in the industry
                    with the help of our vast network of banks, treasuries, and
                    asset management companies.
                  </p>
                </>
              )}
              {showTab == "DEBT" && (
                <>
                  <p>
                    Providing short-term opportunities to park surplus liquid
                    and benefiting from periodic coupons through Debt
                    warehousing.
                  </p>
                </>
              )}
              {showTab == "ALTERNATIVES" && (
                <>
                  <p>
                    Unbiased advisory in Mutual Funds and Portfolio Management
                    services across various maturities and top-rated bonds for
                    secured and steady returns.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default DebtInvestments;
