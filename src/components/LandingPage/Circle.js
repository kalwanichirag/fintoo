import React from "react";
import { Ul } from "evergreen-ui";
function Circle() {
  return (
    <div className="circleAnimate">
      <div id="container">
        <div id="circle">
          <div
            className="LowHighRisk"
            style={{
              // display : "flex",
              textAlign: "center",
            }}
          >
            <span className="RiskText">High Risk</span>
          </div>
          <div id="small-circle">
            <div
              style={{
                position: "absolute",
                marginLeft: "1162px",
                marginTop: "319px",
                zIndex: "1",
                display: "flex",
                lineHeight: "1em",
              }}
            >
              <div>
                <img
                  alt=""
                  className="CircleBox"
                  style={{
                    width: "80px",
                    height: "80px",
                    cursor: "pointer",
                    position: "absolute",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: "0px",
                    marginTop: "0px",
                    background: "#ffff",
                    padding: "1em",
                    boxShadow: "rgb(230 230 230) -2px 3px 6px 3px",
                    zIndex: "1",
                    borderRadius: "50%",
                  }}
                  src={
                    process.env.REACT_APP_STATIC_URL +
                    "media/LandingPage/Indian_Stocks.svg"
                  }
                />
              </div>
              <div
                className=""
                style={{
                  paddingLeft: "6.6rem  ",
                  paddingTop: "2.2rem",
                }}
              >
                <p className="CircleBigTxt">Indain Stocks</p>
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                marginLeft: "1255px",
                marginTop: "723px",
                zIndex: "1",
                display: "grid",
                lineHeight: "1em",
              }}
            >
              <div
                className="CircleBox"
                style={{
                  width: "110px",
                  height: "110px",
                  position: "relative",
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: "120px",
                  marginTop: "5px",
                  background: "#ffff",
                  padding: "2.3em",
                  boxShadow: "rgb(230 230 230) -2px 3px 6px 3px",
                  zIndex: "1",
                  borderRadius: "50%",
                }}
              >
                <img
                  alt=""
                  style={{
                    width: "50px",
                    height: "50px",
                    cursor: "pointer",
                    position: "absolute",
                    display: "flex",
                  }}
                  src={
                    process.env.REACT_APP_STATIC_URL +
                    "media/LandingPage/us_stocks.svg"
                  }
                />
              </div>
              <div
                className=""
                style={{
                  paddingLeft: "7rem  ",
                  paddingTop: "1rem",
                }}
              >
                <p
                  className="CircleBigTxt"
                  style={{
                    textAlign: "center",
                  }}
                >
                  US Stocks
                </p>
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                marginLeft: "1092px",
                marginTop: "1344px",
                zIndex: "1",
                display: "flex",
                lineHeight: "1em",
                maxWidth: "400px",
              }}
            >
              <div
                className="CircleBox"
                style={{
                  marginLeft: "0px",
                  marginTop: "0px",
                  background: "#ffff",
                  padding: "1.5em",
                  boxShadow: "rgb(230 230 230) -2px 3px 6px 3px",
                  zIndex: "1",
                  borderRadius: "50%",
                  padding: "1.8rem",
                  width: "100px",
                  height: "100px",
                }}
              >
                <a
                  href={`${process.env.PUBLIC_URL}/direct-mutual-fund/funds/all?category=mid_cap`}
                  className="text-decoration-none pointer"
                >
                  <img
                    alt=""
                    style={{
                      width: "55px",
                      height: "55px",
                      cursor: "pointer",
                      position: "absolute",
                    }}
                    src={
                      process.env.REACT_APP_STATIC_URL +
                      "media/LandingPage/mid_cap_funds.svg"
                    }
                  />
                </a>
              </div>
              <div
                className="mt-5"
                style={{
                  paddingLeft: "1rem  ",
                }}
              >
                <p className="CircleBigTxt mb-1">Mid Cap Funds</p>
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                marginLeft: "260px",
                marginTop: "1187px",
                zIndex: "1",
                display: "flex",
                lineHeight: "10px",
              }}
            >
              <div className="mt-5 pe-3">
                <p
                  className="CircleBigTxt mb-2"
                  style={{
                    textAlign: "right",
                  }}
                >
                  Small Cap Funds
                </p>
              </div>
              <div
                className="CircleBox"
                style={{
                  position: "relative",
                  marginLeft: "0px",
                  marginTop: "7px",
                  background: "#ffff",
                  padding: "1em",
                  boxShadow: "rgb(230 230 230) -2px 3px 6px 3px",
                  zIndex: "1",
                  borderRadius: "50%",
                  width: "80px",
                  height: "80px",
                }}
              >
                <a
                  href={`${process.env.PUBLIC_URL}/direct-mutual-fund/funds/all?category=small_cap`}
                  className="text-decoration-none pointer"
                >
                  <img
                    alt=""
                    style={{
                      width: "46px",
                      height: "46px",
                      cursor: "pointer",
                      position: "absolute",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    src={
                      process.env.REACT_APP_STATIC_URL +
                      "media/LandingPage/SmallCapFunds.svg"
                    }
                  />
                </a>
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                marginLeft: "269px",
                marginTop: "380px",
                zIndex: "1",
                display: "flex",
                lineHeight: "5px",
              }}
            >
              <div className="mt-3 pe-2">
                <p
                  className="CircleBigTxt"
                  style={{
                    textAlign: "right",
                    lineHeight: "1.2em",
                  }}
                >
                  Thematic / <br /> Sector Funds
                </p>
              </div>
              <div
                className="CircleBox"
                style={{
                  position: "relative",
                  width: "66px",
                  height: "66px",
                  background: "#ffff",
                  padding: ".9em",
                  boxShadow: "rgb(230 230 230) -2px 3px 6px 3px",
                  zIndex: "1",
                  borderRadius: "50%",
                }}
              >
                <img
                  alt=""
                  style={{
                    width: "39px",
                    height: "39px",
                    cursor: "pointer",
                    position: "absolute",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: "0px",
                    marginTop: "0px",
                  }}
                  src={
                    process.env.REACT_APP_STATIC_URL +
                    "media/LandingPage/Thematic.svg"
                  }
                />
              </div>
            </div>
            <div className="SemiCircle">
              <div
                style={{
                  position: "absolute",
                  marginLeft: "455px",
                  marginTop: "137px",
                  zIndex: "1",
                  display: "grid",
                  // lineHeight: "1em",
                }}
              >
                <div
                  className=""
                  style={{
                    paddingLeft: "8.5rem",
                  }}
                >
                  <p
                    className="CircleBigTxt"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    US ETF
                  </p>
                </div>
                <div
                  className="CircleBox"
                  style={{
                    position: "relative",
                    width: "66px",
                    height: "66px",
                    background: "#ffff",
                    padding: ".9em",
                    boxShadow: "rgb(230 230 230) -2px 3px 6px 3px",
                    zIndex: "1",
                    borderRadius: "50%",
                    alignItems: "center",
                    marginLeft: "120px",
                  }}
                >
                  <img
                    alt=""
                    style={{
                      width: "39px",
                      height: "39px",
                      cursor: "pointer",
                      position: "absolute",
                      display: "flex",
                      justifyContent: "center",
                    }}
                    src={
                      process.env.REACT_APP_STATIC_URL +
                      "media/LandingPage/US_ETF.svg"
                    }
                  />
                </div>
              </div>
              <div
                style={{
                  position: "absolute",
                  marginLeft: "-78px",
                  marginTop: "785px",
                  zIndex: "1",
                  display: "flex",
                  lineHeight: "1.3em",
                }}
              >
                <div className="mt-3 pe-4">
                  <p
                    className="CircleBigTxt mb-1 "
                    style={{
                      textAlign: "right",
                    }}
                  >
                    Balanced Allocation <br /> Funds
                  </p>
                </div>
                <div
                  className="CircleBox"
                  style={{
                    position: "relative",
                    marginLeft: "0px",
                    marginTop: "0px",
                    background: "#ffff",
                    padding: ".9em",
                    boxShadow: "rgb(230 230 230) -2px 3px 6px 3px",
                    zIndex: "1",
                    borderRadius: "50%",
                    width: "60px",
                    height: "60px",
                  }}
                >
                  <a
                    href={`${process.env.PUBLIC_URL}/direct-mutual-fund/funds/all?category=balanced allocation`}
                    className="text-decoration-none pointer"
                  >
                    <img
                      alt=""
                      style={{
                        width: "39px",
                        height: "39px",
                        cursor: "pointer",
                        position: "absolute",
                        display: "flex",
                        justifyContent: "center",
                      }}
                      src={
                        process.env.REACT_APP_STATIC_URL +
                        "media/LandingPage/Balanced-Allocation.png"
                      }
                    />
                  </a>
                </div>
              </div>
              <div id="small-circle1">
                <div
                  style={{
                    position: "absolute",
                    marginLeft: "83px",
                    marginTop: "180px",
                    zIndex: "1",
                    display: "flex",
                    lineHeight: "1.2em",
                  }}
                >
                  <div className="mt-3 pe-3">
                    <p
                      className="CircleBigTxt mb-1"
                      style={{ textAlign: "right" }}
                    >
                      Ultra Short <br /> Duration Funds
                    </p>
                  </div>
                  <div
                    className="CircleBox"
                    style={{
                      position: "relative",
                      marginLeft: "0px",
                      marginTop: "0px",
                      background: "#ffff",
                      padding: ".9em",
                      boxShadow: "rgb(230 230 230) -2px 3px 6px 3px",
                      zIndex: "1",
                      borderRadius: "50%",
                      width: "66px",
                      height: "66px",
                    }}
                  >
                    <a
                      href={`${process.env.PUBLIC_URL}/direct-mutual-fund/funds/all?category=ultra short duration`}
                      className="text-decoration-none pointer"
                    >
                      <img
                        alt=""
                        style={{
                          width: "39px",
                          height: "39px",
                          cursor: "pointer",
                          position: "absolute",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/ultra_shot.svg"
                        }
                      />
                    </a>
                  </div>
                </div>
                <div
                  style={{
                    position: "absolute",
                    marginLeft: "457px",
                    marginTop: "138px",
                    zIndex: "1",
                    display: "flex",
                    lineHeight: "10px",
                  }}
                >
                  <div
                    className="CircleBox"
                    style={{
                      position: "relative",
                      background: "#ffff",
                      padding: ".9em",
                      boxShadow: "rgb(230 230 230) -2px 3px 6px 3px",
                      zIndex: "1",
                      borderRadius: "50%",
                      width: "60px",
                      height: "60px",
                    }}
                  >
                    <a
                      href={`${process.env.PUBLIC_URL}/direct-mutual-fund/funds/all?category=low duration`}
                      className="text-decoration-none pointer"
                    >
                      <img
                        alt=""
                        style={{
                          width: "35px",
                          height: "35px",
                          cursor: "pointer",
                          position: "absolute",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/Low_duration_fund.svg"
                        }
                      />
                    </a>
                  </div>
                  <div
                    className=""
                    style={{
                      paddingLeft: ".8rem  ",
                      paddingTop: "1.7rem",
                    }}
                  >
                    <p className="CircleBigTxt">Low Duration Funds</p>
                  </div>
                </div>
                <div
                  style={{
                    position: "absolute",
                    marginLeft: "648px",
                    marginTop: "293px",
                    zIndex: "1",
                    display: "flex",
                    lineHeight: "1em",
                  }}
                >
                  <div
                    className="CircleBox"
                    style={{
                      position: "relative",
                      marginLeft: "0px",
                      // marginTop: "-20px",
                      background: "#ffff",
                      padding: ".9em",
                      boxShadow: "rgb(230 230 230) -2px 3px 6px 3px",
                      zIndex: "1",
                      borderRadius: "50%",
                      width: "70px",
                      height: "70px",
                    }}
                  >
                    <img
                      alt=""
                      style={{
                        width: "56px",
                        height: "56px",
                        cursor: "pointer",
                        position: "absolute",
                        marginTop: "-1.5rem",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      src={
                        process.env.REACT_APP_STATIC_URL +
                        "media/LandingPage/Gilt_Bonds.png"
                      }
                    />
                  </div>
                  <div
                    className=""
                    style={{
                      paddingTop: "1rem  ",
                      paddingLeft: "1rem  ",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <p className="CircleBigTxt pt-2">Gilt Bonds</p>
                  </div>
                </div>
                <div
                  style={{
                    position: "absolute",
                    marginLeft: "565px",
                    marginTop: "656px",
                    zIndex: "1",
                    display: "flex",
                    lineHeight: "1em",
                    maxWidth: "400px",
                  }}
                >
                  <div
                    className="CircleBox"
                    style={{
                      width: "90px",
                      height: "90px",
                      position: "relative",
                      justifyContent: "center",
                      alignItems: "center",
                      marginLeft: "0px",
                      marginTop: "-20px",
                      background: "#ffff",
                      padding: "1.5em",
                      boxShadow: "rgb(230 230 230) -2px 3px 6px 3px",
                      zIndex: "1",
                      borderRadius: "50%",
                    }}
                  >
                    <a
                      href={`${process.env.PUBLIC_URL}/direct-mutual-fund/funds/all?category=government bond`}
                      className="text-decoration-none pointer"
                    >
                      <img
                        alt=""
                        style={{
                          width: "50px",
                          height: "50px",
                          cursor: "pointer",
                          position: "absolute",
                          display: "flex",
                        }}
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/Govt_Bonds.png"
                        }
                      />
                    </a>
                  </div>
                  <div
                    className=""
                    style={{
                      marginLeft: "1rem  ",
                      marginTop: "1rem",
                    }}
                  >
                    <p
                      className="CircleBigTxt"
                      style={{
                        whiteSpace: "nowrap",
                      }}
                    >
                      GVT Bonds Funds
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    position: "absolute",
                    marginLeft: "137px",
                    marginTop: "574.7px",
                    zIndex: "1",
                    display: "flex",
                    lineHeight: "1em",
                    maxWidth: "400px",
                  }}
                >
                  <div
                    className="CircleBox"
                    style={{
                      width: "65px",
                      height: "65px",
                      cursor: "pointer",
                      position: "absolute",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginLeft: "114px",
                      marginTop: "-17px",
                      background: "#ffff",
                      padding: ".9em",
                      boxShadow: "rgb(230 230 230) -2px 3px 6px 3px",
                      zIndex: "1",
                      borderRadius: "50%",
                    }}
                  >
                    <a
                      href={`${process.env.PUBLIC_URL}/direct-mutual-fund/funds/all?category=corporate_bond`}
                      className="text-decoration-none pointer"
                    >
                      <img
                        alt=""
                        style={{
                          width: "42px",
                          height: "42px",
                          cursor: "pointer",
                        }}
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/corporate_bonds.png"
                        }
                      />
                    </a>
                  </div>
                  <div
                    className="mt-5"
                    style={{
                      marginLeft: "5rem",
                    }}
                  >
                    <p className="CircleBigTxt text-center mb-1 mt-3">
                      Corporate Bonds
                    </p>
                  </div>
                </div>
                <div id="small-circle2">
                  <div
                    style={{
                      position: "absolute",
                      marginLeft: "-119px",
                      marginTop: "253px",
                      zIndex: "1",
                      display: "flex",
                    }}
                  >
                    <div className="mt-3 pe-5">
                      <p className="CircleBigTxt">Liquid Fund</p>
                    </div>
                    <div
                      className="CircleBox"
                      style={{
                        width: "80px",
                        height: "80px",
                        cursor: "pointer",
                        position: "relative",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: "-29px",
                        marginTop: "-17px",
                        background: "#ffff",
                        padding: ".9em",
                        boxShadow: "rgb(230 230 230) -2px 3px 6px 3px",
                        zIndex: "1",
                        borderRadius: "50%",
                      }}
                    >
                      <a
                        href={`${process.env.PUBLIC_URL}/direct-mutual-fund/funds/all?category=liquid`}
                        className="text-decoration-none pointer"
                      >
                        <img
                          alt=""
                          style={{
                            width: "44px",
                            height: "44px",
                            cursor: "pointer",
                            position: "absolute",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginLeft: "-1.5rem",
                            marginTop: "-1.4rem"
                          }}
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/LandingPage/LiquidFunds.svg"
                          }
                        />
                      </a>
                    </div>
                  </div>

                  <div id="small-circle3">
                    <div id="small-circle4">
                      <div
                        className=""
                        style={{
                          position: "relative",
                          verticalAlign: "middle",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <p
                          className="CircleBigTxt text-center mb-1 "
                          style={{
                            fontSize: "2rem",
                            fontWeight: "800",
                          }}
                        >
                          Low Risk
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        marginTop: "259px",
                        marginLeft: "260px",
                        zIndex: "1",
                        display: "flex",
                      }}
                    >
                      <div
                        className="CircleBox"
                        style={{
                          width: "60px",
                          height: "60px",
                          cursor: "pointer",
                          position: "relative",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginLeft: "-29px",
                          marginTop: "-17px",
                          background: "#ffff",
                          padding: ".9em",
                          boxShadow: "rgb(230 230 230) -2px 3px 6px 3px",
                          zIndex: "1",
                          borderRadius: "50%",
                        }}
                      >
                        <a
                          href={`${process.env.PUBLIC_URL}/direct-mutual-fund/funds/all?category=overnight`}
                          className="text-decoration-none pointer"
                        >
                          <img
                            alt=""
                            style={{
                              width: "34px",
                              height: "34px",
                              cursor: "pointer",
                              position: "absolute",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginLeft: "-1.2rem",
                            marginTop: "-1.2rem"
                            }}
                            src={
                              process.env.REACT_APP_STATIC_URL +
                              "media/LandingPage/Overnights.svg"
                            }
                          />
                        </a>
                      </div>
                      <div className="mt-1 ps-2">
                        <p
                          style={{
                            whiteSpace: "nowrap",
                          }}
                          className="CircleBigTxt"
                        >
                          Overnight Funds
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="LowHighRisk"
            style={{
              // display : "flex",
              position: "absolute",
              marginTop: "1400px",
              textAlign: "center",
            }}
          >
            <span className="RiskText">High Risk</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Circle;
