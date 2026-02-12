import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Styles from "./Styles.module.css";
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
        <h2 className="text-center pt-md-0 pt-4">
          Private Wealth Management Solutions
        </h2>
        <div className={`${Styles.tabSection}`}>
          <div
            className={`${Styles.tabData}`}
            style={showTab == "EQUITY" ? bgcolor : inactive}
          >
            <div className={`${Styles.links}`}>
              <div
                onMouseOver={() => setShowTab("EQUITY")}
                className={` ${Styles.tabName} ${showTab ? "ActiveTab" : ""}`}
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
                            "media/wp/InvestPlan/EQUITY.png"
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
                            "media/wp/InvestPlan/EQUITY_1.png"
                          }
                        />
                      </>
                    )}
                  </div>
                  <span>EQUITY</span>
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
                            "media/wp/InvestPlan/Real_Estate_.png"
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
                            "media/wp/InvestPlan/Real_Estate_1.png"
                          }
                        />
                      </>
                    )}
                  </div>
                  <span>REAL ESTATE</span>
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
                            "media/wp/InvestPlan/DEBT.png"
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
                            "media/wp/InvestPlan/DEBT_1.png"
                          }
                        />
                      </>
                    )}
                  </div>
                  <span>DEBT</span>
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
                            "media/wp/InvestPlan/ALTERNATIVES.png"
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
                            "media/wp/InvestPlan/ALTERNATIVES_1.png"
                          }
                        />
                      </>
                    )}
                  </div>

                  <span>ALTERNATIVES</span>
                </div>
              </div>
            </div>
            <div className={`${Styles.tabSectionContent}`}>
              {showTab == "EQUITY" && (
                <>
                  <p>
                    Our in-house equity research desk focuses on investing in
                    companies with predictable and consistent earnings and can
                    typically generate above-average earnings growth over more
                    extended periods. We arrive at a portfolio strategy after a
                    complete need analysis designed to meet an individual's
                    requirements and financial goals.
                  </p>
                </>
              )}
              {showTab == "REAL_ESTATE" && (
                <>
                  <p>
                    Our team of global experts, through their thorough research
                    and enriching experience, specialise in providing end-to-end
                    advisory in the real estate segment across the globe, along
                    with spotting niche investment opportunities on a complete
                    and/or shared ownership basis.
                  </p>
                </>
              )}
              {showTab == "DEBT" && (
                <>
                  <p>
                    Our strong network with various banks, treasuries, and asset
                    management companies enables us to offer many fixed-income
                    investment opportunities at attractive prices across the
                    yield curve.
                  </p>
                </>
              )}
              {showTab == "ALTERNATIVES" && (
                <>
                  <p>
                    Our strong network in the group-level ecosystem enables us
                    to provide differentiated investment opportunities in
                    private markets across diversified asset classes like debt,
                    real estate, private equity, new-age investments & other
                    innovative opportunities.
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
export default KeyDifferentiators;
