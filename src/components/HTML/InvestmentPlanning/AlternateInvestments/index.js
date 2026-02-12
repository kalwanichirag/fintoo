import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Styles from "./style.module.css";
import TRADITIONAL_INVESTMENTS from "./images/TRADITIONAL_INVESTMENTS.png";
import TRADITIONAL_INVESTMENTS1 from "./images/TRADITIONAL_INVESTMENTS_1.png";
import UNCONVENTIONAL_INVESTMENTS from "./images/UNCONVENTIONAL_INVESTMENTS.png";
import UNCONVENTIONAL_INVESTMENTS1 from "./images/UNCONVENTIONAL_INVESTMENTS_1.png";
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
const AlternateInvestments = () => {
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
        <h2 className="text-center pt-md-0 pt-4">Alternate Investments</h2>
        <p className={`${Styles.subTxt}`}>
          Our team of specialists look for a wide range of investment
          opportunities in diverse markets across the globe with a focus on
          delivering uncorrelated and superlative risk-adjusted returns. We lay
          special emphasis on opportunities that cater to a niche market and
          have the potential to deliver higher alpha than standard investment
          solutions.
        </p>
        <div className={`${Styles.tabSection}`}>
          <div
            className={`${Styles.tabData}`}
            style={showTab == "EQUITY" ? bgcolor : inactive}
          >
            <div className={` ${Styles.links}`}>
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
                            "media/wp/InvestPlan/TRADITIONAL_INVESTMENTS.png"
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
                            "media/wp/InvestPlan/TRADITIONAL_INVESTMENTS_1.png"
                          }
                        />
                      </>
                    )}
                  </div>
                  <span>TRADITIONAL INVESTMENTS</span>
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
                            "media/wp/InvestPlan/UNCONVENTIONAL_INVESTMENTS.png"
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
                            "media/wp/InvestPlan/UNCONVENTIONAL_INVESTMENTS_1.png"
                          }
                        />
                      </>
                    )}
                  </div>
                  <span>UNCONVENTIONAL INVESTMENTS</span>
                </div>
              </div>
            </div>
            <div className={`${Styles.tabSectionContent}`}>
              {showTab == "EQUITY" && (
                <>
                  <p>
                    Traditional investments suite caters to the regulated,
                    well-known opportunities easily accessible to the masses
                    spanning equity, debt, real estate, and commodities. Curated
                    Alternative Investment Funds <br />
                    Commodities like Gold & Silver
                  </p>
                </>
              )}
              {showTab == "REAL_ESTATE" && (
                <>
                  <p>
                    Unconventional investment opportunities cater to innovative
                    and new-age technology solutions that are lucrative,
                    complex, unregulated, and accessible through unique
                    sourcing. 
                  </p>
                    <div>
                      <div>Cryptocurrency</div>
                      <div>NFT</div>
                      <div>Blockchain companies</div>
                      <div>Artefacts</div>
                      <div>Collectables</div>
                    </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AlternateInvestments;
