import { React, useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { BASE_API_URL } from "../../constants";

const active = {
  borderBottom: "3px solid #042b62",
  paddingBottom: "4px",
  display: "inline-block",
};
const inactive = {};
const TabName = ["mfi", "equity", "usequity"];

TabName.map((Tabs, index) => index + " = " + Tabs + " = " + TabName[index]);
function Slider() {
  const { pathname, hash } = useLocation();
  const [showTab, setShowTab] = useState("mfi");
  const slideNext = () => {
    var i = TabName.indexOf(showTab);
    i = i + 1;
    if (i == TabName.length) i = 0;
    setShowTab(TabName[i]);
  };

  useEffect(() => {
    if (hash == "#international") {
      setShowTab("usequity");
    } else if (hash == "#domestic") {
      setShowTab("equity");
    } else {
      setShowTab("mfi");
    }
  }, [hash]);

  return (
    <>
      <div>
        <div className="container d-flex justify-content-center m-auto  mobileSection">
          <div
            className="d-block justify-content-center align-it text-center pointer investList "
            onClick={() => setShowTab("mfi")}
          >
            <div
              className={`BgChange ${
                showTab == "mfi"
                  ? "ImgBorder1 d-flex justify-content-center align-items-center m-auto"
                  : "ImgBorder d-flex justify-content-center align-items-center m-auto"
              }`}
            >
              <img
                className="img-circle fimage"
                alt="mutual fund"
                src={
                  process.env.REACT_APP_STATIC_URL +
                  "media/LandingPage/01_Mutual_Fund.png"
                }
              />

              <img
                className="img-circle Simage"
                alt="mutual fund"
                src={
                  process.env.REACT_APP_STATIC_URL +
                  "media/LandingPage/01-mutual-fund_white.png"
                }
              />
            </div>
            <p
              style={showTab == "mfi" ? active : inactive}
              className="InvestType"
            >
              Mutual Fund
            </p>
          </div>
          <div
            className="d-block justify-content-center align-it text-center pointer investList"
            onClick={() => setShowTab("equity")}
          >
            <div
              className={`BgChange ${
                showTab == "equity"
                  ? "ImgBorder1 d-flex justify-content-center align-items-center m-auto"
                  : "ImgBorder d-flex justify-content-center align-items-center m-auto"
              }`}
            >
              <img
                className="img-circle fimage"
                alt="Cinque Terre"
                src={
                  process.env.REACT_APP_STATIC_URL +
                  "media/LandingPage/2_Equity_Black.png"
                }
              />
              <img
                className="img-circle Simage"
                alt="Cinque Terre"
                src={
                  process.env.REACT_APP_STATIC_URL +
                  "media/LandingPage/02_Equity.png"
                }
              />
            </div>
            <p
              style={showTab == "equity" ? active : inactive}
              className="InvestType"
            >
              Indian Equity
            </p>
          </div>
          <div
            className="d-block justify-content-center align-it text-center pointer investList"
            onClick={() => setShowTab("usequity")}
          >
            <div
              className={`BgChange ${
                showTab == "usequity"
                  ? "ImgBorder1 d-flex justify-content-center align-items-center m-auto"
                  : "ImgBorder d-flex justify-content-center align-items-center m-auto"
              }`}
            >
              <img
                className="img-circle fimage"
                alt="Cinque Terre"
                src={
                  process.env.REACT_APP_STATIC_URL +
                  "media/LandingPage/03_US_Equity.png"
                }
              />
              <img
                className="img-circle Simage"
                alt="Cinque Terre"
                src={
                  process.env.REACT_APP_STATIC_URL +
                  "media/LandingPage/03_Us_Equity_White.png"
                }
              />
            </div>
            <p
              style={showTab == "usequity" ? active : inactive}
              className="InvestType"
            >
              US Equity
            </p>
          </div>
          {/* <div
            className="d-none justify-content-center align-it text-center pointer investList"
            onClick={() => setShowTab("bonds")}
          >
            <div
              className={`BgChange ${
                showTab == "bonds"
                  ? "ImgBorder1 d-flex justify-content-center align-items-center m-auto"
                  : "ImgBorder d-flex justify-content-center align-items-center m-auto"
              }`}
            >
              <img
                src={Bonds}
                className="img-circle fimage"
                alt="Cinque Terre"
              />
              <img
                src={BondsWhite}
                className="img-circle Simage"
                alt="Cinque Terre"
              />
            </div>
            <p
              style={showTab == "bonds" ? active : inactive}
              className="InvestType"
            >
              Bonds
            </p>
          </div> */}
        </div>
        <div
          className="SliderNextBtn dekstopNextbtn"
          onClick={() => slideNext()}
        >
          <img
            alt="Next"
            src={
              process.env.REACT_APP_STATIC_URL +
              "media/SliderNext.svg"
            }
          />
        </div>
        <div className="categorySlider">
          {showTab == "mfi" && (
            <>
              <div className="FundTypeSection DesktopFund d-md-block">
                <div className="d-flex FundList justify-content-between pb-4">
                  <div className="w-25">
                    <a
                      href={`${process.env.PUBLIC_URL}/direct-mutual-fund/funds/recommended`}
                      className="text-decoration-none pointer"
                    >
                      <div className="d-flex justify-content-center">
                        <img
                          className="FundListImg"
                          alt=""
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/LandingPage/01_recommended_funds.png"
                          }
                        />
                      </div>
                      <p className="fundText pointer">Recommended Funds</p>
                    </a>
                  </div>
                  <div className="w-25">
                    <a
                      href={`${process.env.PUBLIC_URL}/direct-mutual-fund/funds/recommended?category=landing`}
                      className="text-decoration-none pointer"
                    >
                      <div className="d-flex justify-content-center">
                        <img
                          className="FundListImg"
                          alt=""
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/LandingPage/02_Top-Performing_funds.png"
                          }
                        />
                      </div>
                      <p className="fundText pointer">Top Performing Funds</p>
                    </a>
                  </div>
                  <div className="w-25">
                    <a
                      href={`${process.env.PUBLIC_URL}/direct-mutual-fund/funds/all?category=equity`}
                      className="text-decoration-none pointer"
                    >
                      <div className="d-flex justify-content-center">
                        <img
                          className="FundListImg"
                          alt=""
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/LandingPage/03_Equity_Funds.png"
                          }
                        />
                      </div>
                      <p className="fundText pointer">Equity Funds</p>
                    </a>
                  </div>
                  <div className="w-25">
                    <a
                      href={`${process.env.PUBLIC_URL}/direct-mutual-fund/funds/all?category=hybrid`}
                      className="text-decoration-none pointer"
                    >
                      <div className="d-flex justify-content-center">
                        <img
                          className="FundListImg"
                          alt=""
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/LandingPage/04_Hybrid_Funds.png"
                          }
                        />
                      </div>
                      <p className="fundText pointer">Hybrid Funds</p>
                    </a>
                  </div>
                </div>
                <div className="d-flex justify-content-between pt-5">
                  <div className="w-25">
                    <a
                      href={`${process.env.PUBLIC_URL}/direct-mutual-fund/funds/all?category=debt`}
                      className="text-decoration-none pointer"
                    >
                      <div className="d-flex justify-content-center">
                        <img
                          className="FundListImg"
                          alt=""
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/LandingPage/05_debt_fund.png"
                          }
                        />
                      </div>
                      <p className="fundText pointer">Debt Funds</p>
                    </a>
                  </div>
                  <div className="w-25">
                    <a
                      href={`${process.env.PUBLIC_URL}/direct-mutual-fund/funds/tax-saver`}
                      className="text-decoration-none pointer"
                    >
                      <div className="d-flex justify-content-center">
                        <img
                          className="FundListImg"
                          alt=""
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/LandingPage/06_Tax_Saving_Fund.png"
                          }
                        />
                      </div>
                      <p className="fundText pointer">Tax Saving Funds</p>
                    </a>
                  </div>
                  <div className="w-25">
                    <a
                      href={`${process.env.PUBLIC_URL}/direct-mutual-fund/funds/all?category=sector - precious metals`}
                      className="text-decoration-none pointer"
                    >
                      <div className="d-flex justify-content-center">
                        <img
                          className="FundListImg"
                          alt=""
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/LandingPage/07_gold_funds.png"
                          }
                        />
                      </div>
                      <p className="fundText pointer">Gold Funds</p>
                    </a>
                  </div>
                  <div className="w-25">
                    <a
                      href={`${process.env.PUBLIC_URL}/direct-mutual-fund/funds/nfo`}
                      className="text-decoration-none pointer"
                    >
                      <div className="d-flex justify-content-center">
                        <img
                          className="FundListImg"
                          alt=""
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/LandingPage/08_NFO.png"
                          }
                        />
                      </div>
                      <p className="fundText pointer">NFO</p>
                    </a>
                  </div>
                </div>
              </div>
              <div className="FundTypeSection mobileFund d-md-none">
                <div className=" FundList justify-content-between pb-4">
                  <div>
                    <div className="d-flex justify-content-center">
                      <img
                        className="FundListImg"
                        alt=""
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/01_recommended_funds.png"
                        }
                      />
                    </div>
                    <p className="fundText pointer">Recommended Funds</p>
                  </div>
                  <div>
                    <div className="d-flex justify-content-center">
                      <img
                        className="FundListImg"
                        alt=""
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/02_Top-Performing_funds.png"
                        }
                      />
                    </div>
                    <p className="fundText pointer">Top Performing Funds</p>
                  </div>
                  <div>
                    <div className="d-flex justify-content-center">
                      <img
                        className="FundListImg"
                        alt=""
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/03_Equity_Funds.png"
                        }
                      />
                    </div>
                    <p className="fundText pointer">Equity Funds</p>
                  </div>
                  <div>
                    <div className="d-flex justify-content-center">
                      <img
                        className="FundListImg"
                        alt=""
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/04_Hybrid_Funds.png"
                        }
                      />
                    </div>
                    <p className="fundText pointer">Hybrid Funds</p>
                  </div>
                  <div>
                    <div className="d-flex justify-content-center">
                      <img
                        className="FundListImg"
                        alt=""
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/05_debt_fund.png"
                        }
                      />
                    </div>
                    <p className="fundText pointer">Debt Funds</p>
                  </div>
                  <div>
                    <div className="d-flex justify-content-center">
                      <img
                        className="FundListImg"
                        alt=""
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/06_Tax_Saving_Fund.png"
                        }
                      />
                    </div>
                    <p className="fundText pointer">Tax Saving Funds</p>
                  </div>
                  <div>
                    <div className="d-flex justify-content-center">
                      <img
                        className="FundListImg"
                        alt=""
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/07_gold_funds.png"
                        }
                      />
                    </div>
                    <p className="fundText pointer">Gold Funds</p>
                  </div>
                  <div>
                    <div className="d-flex justify-content-center">
                      <img
                        className="FundListImg"
                        alt=""
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/08_NFO.png"
                        }
                      />
                    </div>
                    <p className="fundText pointer">NFO</p>
                  </div>
                  <div className="SliderNextBtn" onClick={() => slideNext()}>
                    <img
                      alt=""
                      src={
                        process.env.REACT_APP_STATIC_URL +
                        "media/LandingPage/SliderNext.svg"
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <button className="ExporeAll">
                  <Link
                    className="text-decoration-none text-white"
                    to={`${process.env.PUBLIC_URL}/direct-mutual-fund/funds/all`}
                  >
                    Explore
                  </Link>
                </button>
              </div>
            </>
          )}

          {showTab == "equity" && (
            <>
              <div className="FundTypeSection DesktopFund d-md-block">
                <div className="d-flex FundList justify-content-between pb-4">
                  <div className="w-25">
                    <a href="#" className="text-decoration-none pointer">
                      <div className="d-flex justify-content-center">
                        <img
                          className="FundListImg"
                          alt=""
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/LandingPage/01_Top_Gainer.png"
                          }
                        />
                      </div>
                      <p className="fundText pointer">Top Gainers</p>
                    </a>
                  </div>
                  <div className="w-25">
                    <a href="#" className="text-decoration-none pointer">
                      <div className="d-flex justify-content-center">
                        <img
                          className="FundListImg"
                          alt=""
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/LandingPage/02_52_Week_Low.png"
                          }
                        />
                      </div>
                      <p className="fundText pointer">52 Week Low</p>
                    </a>
                  </div>
                  <div className="w-25">
                    <a href="#" className="text-decoration-none pointer">
                      <div className="d-flex justify-content-center">
                        <img
                          className="FundListImg"
                          alt=""
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/LandingPage/03_52_Week_High.png"
                          }
                        />
                      </div>
                      <p className="fundText pointer">52 Week High</p>
                    </a>
                  </div>
                  <div className="w-25">
                    <a href="#" className="text-decoration-none pointer">
                      <div className="d-flex justify-content-center">
                        <img
                          className="FundListImg"
                          alt=""
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/LandingPage/04_ipo.png"
                          }
                        />
                      </div>
                      <p className="fundText pointer">IPO</p>
                    </a>
                  </div>
                </div>
                <div className="d-flex justify-content-between pt-5">
                  <div className="w-25">
                    <a href="#" className="text-decoration-none pointer">
                      <div className="d-flex justify-content-center">
                        <img
                          className="FundListImg"
                          alt=""
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/LandingPage/05_nifty_50.png"
                          }
                        />
                      </div>
                      <p className="fundText pointer">Nifty 50</p>
                    </a>
                  </div>
                  <div className="w-25">
                    <a href="#" className="text-decoration-none pointer">
                      <div className="d-flex justify-content-center">
                        <img
                          className="FundListImg"
                          alt=""
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/LandingPage/06_sensex.png"
                          }
                        />
                      </div>
                      <p className="fundText pointer">Sensex</p>
                    </a>
                  </div>
                  <div className="w-25">
                    <a href="#" className="text-decoration-none pointer">
                      <div className="d-flex justify-content-center">
                        <img
                          className="FundListImg"
                          alt=""
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/LandingPage/07_Bank_Nifty.png"
                          }
                        />
                      </div>
                      <p className="fundText pointer">Bank Nifty</p>
                    </a>
                  </div>
                  <div className="w-25">
                    <a href="#" className="text-decoration-none pointer">
                      <div className="d-flex justify-content-center">
                        <img
                          className="FundListImg"
                          alt=""
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/LandingPage/08_nifty_IT.png"
                          }
                        />
                      </div>
                      <p className="fundText pointer">Nifty IT</p>
                    </a>
                  </div>
                </div>
              </div>
              <div className="FundTypeSection mobileFund d-md-none">
                <div className=" FundList justify-content-between pb-4">
                  <div>
                    <div className="d-flex justify-content-center">
                      <img
                        className="FundListImg"
                        alt=""
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/01_Top_Gainer.png"
                        }
                      />
                    </div>
                    <p className="fundText pointer">Top Gainers</p>
                  </div>
                  <div>
                    <div className="d-flex justify-content-center">
                      <img
                        className="FundListImg"
                        alt=""
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/02_52_Week_Low.png"
                        }
                      />
                    </div>
                    <p className="fundText pointer">52 Week Low</p>
                  </div>
                  <div>
                    <div className="d-flex justify-content-center">
                      <img
                        className="FundListImg"
                        alt=""
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/03_52_Week_High.png"
                        }
                      />
                    </div>
                    <p className="fundText pointer">52 Week High</p>
                  </div>
                  <div>
                    <div className="d-flex justify-content-center">
                      <img
                        className="FundListImg"
                        alt=""
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/04_ipo.png"
                        }
                      />
                    </div>
                    <p className="fundText pointer">IPO</p>
                  </div>
                  <div>
                    <div className="d-flex justify-content-center">
                      <img
                        className="FundListImg"
                        alt=""
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/05_nifty_50.png"
                        }
                      />
                    </div>
                    <p className="fundText pointer">Nifty 50</p>
                  </div>
                  <div>
                    <div className="d-flex justify-content-center">
                      <img
                        className="FundListImg"
                        alt=""
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/06_sensex.png"
                        }
                      />
                    </div>
                    <p className="fundText pointer">Sensex</p>
                  </div>
                  <div>
                    <div className="d-flex justify-content-center">
                      <img
                        className="FundListImg"
                        alt=""
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/07_Bank_Nifty.png"
                        }
                      />
                    </div>
                    <p className="fundText pointer">Bank Nifty</p>
                  </div>
                  <div>
                    <div className="d-flex justify-content-center">
                      <img
                        className="FundListImg"
                        alt=""
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/08_nifty_IT.png"
                        }
                      />
                    </div>
                    <p className="fundText pointer">Nifty IT</p>
                  </div>
                  <div className="SliderNextBtn" onClick={() => slideNext()}>
                    <img
                      alt=""
                      src={
                        process.env.REACT_APP_STATIC_URL +
                        "media/LandingPage/SliderNext.svg"
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <button className="ExporeAll">
                  <Link
                    className="text-decoration-none text-white"
                    to={`${process.env.PUBLIC_URL}/stock-advisory/`}
                  >
                    Explore
                  </Link>
                </button>
              </div>
            </>
          )}
          {showTab == "usequity" && (
            <>
              <div className="FundTypeSection DesktopFund d-md-block">
                <div className="d-flex FundList justify-content-between pb-4">
                  <div className="w-25">
                    <a href="#" className="text-decoration-none pointer">
                      <div className="d-flex justify-content-center">
                      <img
                        className="FundListImg"
                        alt=""
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/01_Top_Gainers.png"
                        }
                      />
                      </div>
                      <p className="fundText pointer">Top Gainers</p>
                    </a>
                  </div>
                  <div className="w-25">
                    <a href="#" className="text-decoration-none pointer">
                      <div className="d-flex justify-content-center">
                      <img
                        className="FundListImg"
                        alt=""
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/02_52 Week_Low.png"
                        }
                      />
                      </div>
                      <p className="fundText pointer">52 Week Low</p>
                    </a>
                  </div>
                  <div className="w-25">
                    <a href="#" className="text-decoration-none pointer">
                      <div className="d-flex justify-content-center">
                      <img
                        className="FundListImg"
                        alt=""
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/03_52_Week_High.png"
                        }
                      />
                      </div>
                      <p className="fundText pointer">52 Week High</p>
                    </a>
                  </div>
                  <div className="w-25">
                    <a href="#" className="text-decoration-none pointer">
                      <div className="d-flex justify-content-center">
                      <img
                        className="FundListImg"
                        alt=""
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/04_Nasdaq.png"
                        }
                      />
                      </div>
                      <p className="fundText pointer">Nasdaq</p>
                    </a>
                  </div>
                </div>
                <div className="d-flex justify-content-between pt-5">
                  <div className="w-25">
                    <a href="#" className="text-decoration-none pointer">
                      <div className="d-flex justify-content-center">
                      <img
                        className="FundListImg"
                        alt=""
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/05_S_P_500.png"
                        }
                      />
                      </div>
                      <p className="fundText pointer">S&P 500</p>
                    </a>
                  </div>
                  <div className="w-25">
                    <a href="#" className="text-decoration-none pointer">
                      <div className="d-flex justify-content-center">
                      <img
                        className="FundListImg"
                        alt=""
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/06_recommended_us_equity.png"
                        }
                      />
                      </div>
                      <p className="fundText pointer">Recommended US Equity</p>
                    </a>
                  </div>
                  <div className="w-25">
                    <a href="#" className="text-decoration-none pointer">
                      <div className="d-flex justify-content-center">
                      <img
                        className="FundListImg"
                        alt=""
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/07_Top_Banking_Stocks.png"
                        }
                      />
                      </div>
                      <p className="fundText pointer">Top Banking Stocks</p>
                    </a>
                  </div>
                  <div className="w-25">
                    <a href="#" className="text-decoration-none pointer">
                      <div className="d-flex justify-content-center">
                      <img
                        className="FundListImg"
                        alt=""
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/08_Top_Tech_Stocks.png"
                        }
                      />
                      </div>
                      <p className="fundText pointer">Top Tech Stocks </p>
                    </a>
                  </div>
                </div>
              </div>
              <div className="FundTypeSection mobileFund d-md-none">
                <div className=" FundList justify-content-between pb-4">
                  <div>
                    <div className="d-flex justify-content-center">
                    <img
                        className="FundListImg"
                        alt=""
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/01_Top_Gainers.png"
                        }
                      />
                    </div>
                    <p className="fundText pointer">Top Gainers</p>
                  </div>
                  <div>
                    <div className="d-flex justify-content-center">
                    <img
                        className="FundListImg"
                        alt=""
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/02_52 Week_Low.png"
                        }
                      />
                    </div>
                    <p className="fundText pointer">52 Week Low</p>
                  </div>
                  <div>
                    <div className="d-flex justify-content-center">
                    <img
                        className="FundListImg"
                        alt=""
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/03_52_Week_High.png"
                        }
                      />
                    </div>
                    <p className="fundText pointer">52 Week High</p>
                  </div>
                  <div>
                    <div className="d-flex justify-content-center">
                    <img
                        className="FundListImg"
                        alt=""
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/04_Nasdaq.png"
                        }
                      />
                    </div>
                    <p className="fundText pointer">Nasdaq</p>
                  </div>
                  <div>
                    <div className="d-flex justify-content-center">
                    <img
                        className="FundListImg"
                        alt=""
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/05_S_P_500.png"
                        }
                      />
                    </div>
                    <p className="fundText pointer">S&P 500</p>
                  </div>
                  <div>
                    <div className="d-flex justify-content-center">
                    <img
                        className="FundListImg"
                        alt=""
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/06_recommended_us_equity.png"
                        }
                      />
                    </div>
                    <p className="fundText pointer">Recommended US Equity</p>
                  </div>
                  <div>
                    <div className="d-flex justify-content-center">
                    <img
                        className="FundListImg"
                        alt=""
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/07_Top_Banking_Stocks.png"
                        }
                      />
                    </div>
                    <p className="fundText pointer">Top Banking Stocks</p>
                  </div>
                  <div>
                    <div className="d-flex justify-content-center">
                    <img
                        className="FundListImg"
                        alt=""
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/08_Top_Tech_Stocks.png"
                        }
                      />
                    </div>
                    <p className="fundText pointer">Top Tech Stocks</p>
                  </div>
                  <div className="SliderNextBtn" onClick={() => slideNext()}>
                  <img
                       
                        alt=""
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/SliderNext.svg"
                        }
                      />
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <button className="ExporeAll">
                  <Link
                    className="text-decoration-none text-white"
                    to={`${process.env.PUBLIC_URL}/international-equity/`}
                  >
                    Explore
                  </Link>
                </button>
              </div>
            </>
          )}
          {/* {showTab == "bonds" && (
            <>
            <div className="FundTypeSection DesktopFund d-md-block">
              <div className="d-flex FundList justify-content-between pb-4">
                <div className="w-25">
                  <div className="d-flex justify-content-center">
                    <img className="FundListImg" src={HotPicks} />
                  </div>
                  <p className="fundText pointer">Recommended Funds</p>
                </div>
                <div className="w-25">
                  <div className="d-flex justify-content-center">
                    <img className="FundListImg" src={TaxSaver} />
                  </div>
                  <p className="fundText pointer">Top Performing Funds</p>
                </div>
                <div className="w-25">
                  <div className="d-flex justify-content-center">
                    <img className="FundListImg" src={Overnight} />
                  </div>
                  <p className="fundText pointer">Equity Funds</p>
                </div>
                <div className="w-25">
                  <div className="d-flex justify-content-center">
                    <img className="FundListImg" src={FlexiCap} />
                  </div>
                  <p className="fundText pointer">Hybrid Funds</p>
                </div>
              </div>
              <div className="d-flex justify-content-between pt-5">
                <div className="w-25">
                  <div className="d-flex justify-content-center">
                    <img className="FundListImg" src={HotPicksNew} />
                  </div>
                  <p className="fundText pointer">Debt Funds</p>
                </div>
                <div className="w-25">
                  <div className="d-flex justify-content-center">
                    <img className="FundListImg" src={TaxSaverNew} />
                  </div>
                  <p className="fundText pointer">Tax Saving Funds</p>
                </div>
                <div className="w-25">
                  <div className="d-flex justify-content-center">
                    <img className="FundListImg" src={OverNightNew} />
                  </div>
                  <p className="fundText pointer">Gold Funds</p>
                </div>
                <div className="w-25">
                  <div className="d-flex justify-content-center">
                    <img className="FundListImg" src={FlexiCapNew} />
                  </div>
                  <p className="fundText pointer">NFO</p>
                </div>
              </div>
            </div>
            <div className="FundTypeSection mobileFund d-md-none">
              <div className=" FundList justify-content-between pb-4">
                <div>
                  <div className="d-flex justify-content-center">
                    <img className="FundListImg" src={HotPicks} />
                  </div>
                  <p className="fundText pointer">Recommended Funds</p>
                </div>
                <div>
                  <div className="d-flex justify-content-center">
                    <img className="FundListImg" src={TaxSaver} />
                  </div>
                  <p className="fundText pointer">Top Performing Funds</p>
                </div>
                <div>
                  <div className="d-flex justify-content-center">
                    <img className="FundListImg" src={Overnight} />
                  </div>
                  <p className="fundText pointer">Equity Funds</p>
                </div>
                <div>
                  <div className="d-flex justify-content-center">
                    <img className="FundListImg" src={FlexiCap} />
                  </div>
                  <p className="fundText pointer">Hybrid Funds</p>
                </div>
                <div>
                  <div className="d-flex justify-content-center">
                    <img className="FundListImg" src={HotPicksNew} />
                  </div>
                  <p className="fundText pointer">Debt Funds</p>
                </div>
                <div>
                  <div className="d-flex justify-content-center">
                    <img className="FundListImg" src={TaxSaverNew} />
                  </div>
                  <p className="fundText pointer">Tax Saving Funds</p>
                </div>
                <div>
                  <div className="d-flex justify-content-center">
                    <img className="FundListImg" src={OverNightNew} />
                  </div>
                  <p className="fundText pointer">Gold Funds</p>
                </div>
                <div>
                  <div className="d-flex justify-content-center">
                    <img className="FundListImg" src={FlexiCapNew} />
                  </div>
                  <p className="fundText pointer">NFO</p>
                </div>
                <div className="SliderNextBtn" onClick={() => slideNext()}>
                  <img src={SliderNext} />
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <button className="ExporeAll">
                <Link
                  className="text-decoration-none text-white"
                  to={`${process.env.PUBLIC_URL}/direct-mutual-fund/`}
                >
                  Explore
                </Link>
              </button>
            </div>
          </>
          )} */}
          {/* <div className="SliderNextBtn" onClick={() => slideNext()}>
            <img src={SliderNext} />
          </div> */}
        </div>
      </div>
    </>
  );
}
export default Slider;
