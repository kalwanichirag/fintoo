import React from "react";
import MFI from "../Assets/MFI.svg";
function MobileCircle() {
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
            <span className="RiskText">Low Risk</span>
            <span>
              <img
                alt=""
                src={
                  process.env.REACT_APP_STATIC_URL +
                  "media/LandingPage/NextRisk.png"
                }
              />
            </span>
            <span className="RiskText">High Risk</span>
          </div>
          <div id="small-circle">
            <div
              style={{
                position: "absolute",
                marginLeft: "364px",
                marginTop: "319px",
                zIndex: "1",
                display: "flex",
                lineHeight: "1em",
              }}
            >
              <div
                className="CircleBox"
                style={{
                  width: "49px",
                  height: "49px",
                  cursor: "pointer",
                  position: "absolute",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: "0px",
                  marginTop: "0px",
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
                    width: "42px",
                    height: "42px",
                    cursor: "pointer",
                  }}
                  src={
                    process.env.REACT_APP_STATIC_URL +
                    "media/LandingPage/15_Glit_Funds.png"
                  }
                />
              </div>
              <div
                className=""
                style={{
                  paddingLeft: "3.6rem  ",
                  paddingTop: ".7rem",
                }}
              >
                <p className="CircleBigTxt mb-1">Indain Stocks</p>
                <p
                  style={{
                    textAlign: "left",
                    fontSize: ".7em",
                    fontWeight: "500",
                    width: "200px",
                    lineHeight: "0.4em",
                    color: "#4b4d4a",
                  }}
                >
                  10%-15%
                </p>
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
                  width: "13px",
                  height: "13px",
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
                    "media/LandingPage/22_US_ETF.png"
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
                <p
                  style={{
                    textAlign: "center",
                    fontSize: "1em",
                    fontWeight: "500",
                    width: "150px",
                    lineHeight: "0em",
                    color: "#4b4d4a",
                  }}
                >
                  8% - 10%
                </p>
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                marginLeft: "1035px",
                marginTop: "1260px",
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
                  marginTop: "-10px",
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
                    "media/LandingPage/24_52_weeks_High_US.png"
                  }
                />
              </div>
              <div
                className="mt-4"
                style={{
                  paddingLeft: "1rem  ",
                }}
              >
                <p className="CircleBigTxt mb-1">Mid Cap Funds</p>
                <p
                  style={{
                    textAlign: "left",
                    fontSize: "1em",
                    fontWeight: "500",
                    color: "#4b4d4a",
                    width: "200px",
                    lineHeight: "1.3em",
                  }}
                >
                  8% - 10%
                </p>
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                marginLeft: "260px",
                marginTop: "1214px",
                zIndex: "1",
                display: "flex",
                lineHeight: "10px",
              }}
            >
              <div className="mt-5 pe-4">
                <p
                  className="CircleBigTxt mb-2"
                  style={{
                    textAlign: "right",
                  }}
                >
                  Small Cap Funds
                </p>
                <p
                  style={{
                    textAlign: "right",
                    fontSize: "1em",
                    fontWeight: "500",
                    color: "#4b4d4a",
                    width: "200px",
                    lineHeight: "1.2em",
                  }}
                >
                  8% - 10%
                </p>
              </div>
              <div
                className="CircleBox"
                style={{
                  position: "relative",
                  marginLeft: "0px",
                  marginTop: "15px",
                  background: "#ffff",
                  padding: "1em",
                  boxShadow: "rgb(230 230 230) -2px 3px 6px 3px",
                  zIndex: "1",
                  borderRadius: "50%",
                  width: "80px",
                  height: "80px",
                }}
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
                    "media/LandingPage/23_52_weeks_high_india.png"
                  }
                />
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                marginLeft: "138px",
                marginTop: "380px",
                zIndex: "1",
                display: "flex",
                lineHeight: "5px",
              }}
            >
              <div className="mt-2 pe-4">
                <p
                  className="CircleBigTxt"
                  style={{
                    textAlign: "right",
                    lineHeight: "1.2em",
                  }}
                >
                  Thematic/ <br /> Sector Funds
                </p>
                <p
                  style={{
                    textAlign: "right",
                    fontSize: "1em",
                    fontWeight: "500",
                    color: "#4b4d4a",
                    width: "200px",
                  }}
                >
                  12% - 15%
                </p>
              </div>
              <div
                className="CircleBox"
                style={{
                  position: "relative",
                  width: "60px",
                  height: "60px",
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
                    width: "35px",
                    height: "35px",
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
                    "media/LandingPage/13_Sector_Funds.png"
                  }
                />
              </div>
            </div>
            <div className="SemiCircle">
              <div
                style={{
                  position: "absolute",
                  marginLeft: "81px",
                  marginTop: "7.9px",
                  zIndex: "1",
                  display: "grid",
                  // lineHeight: "1em",
                }}
              >
                <div
                  className=""
                  style={{
                    paddingLeft: "3rem  ",
                  }}
                >
                  <p
                    className="CircleBigTxt mb-1"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    US ETF
                  </p>
                  <p
                    className="mb-1"
                    style={{
                      textAlign: "center",
                      fontSize: "1em",
                      fontWeight: "500",
                      width: "200px",
                      lineHeight: ".8em",
                      color: "#4b4d4a",
                    }}
                  >
                    10%-15%
                  </p>
                </div>
                <div
                  className="CircleBox"
                  style={{
                    position: "relative",
                    width: "46px",
                    height: "46px",
                    background: "#ffff",
                    padding: ".9em",
                    boxShadow: "rgb(230 230 230) -2px 3px 6px 3px",
                    zIndex: "1",
                    borderRadius: "50%",
                    alignItems: "center",
                    marginLeft: "120px",
                    marginTop: "5px",
                  }}
                >
                  <img
                    alt=""
                    style={{
                      width: "23px",
                      height: "23px",
                      cursor: "pointer",
                      position: "absolute",
                      display: "flex",
                      justifyContent: "center",
                    }}
                    src={
                      process.env.REACT_APP_STATIC_URL +
                      "media/LandingPage/14_Fixed_deposite.png"
                    }
                  />
                </div>
              </div>
              <div
                style={{
                  position: "absolute",
                  marginLeft: "67px",
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
                  <p
                    style={{
                      textAlign: "right",
                      fontSize: "1em",
                      fontWeight: "500",
                      color: "#4b4d4a",
                    }}
                  >
                    8% - 10%
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
                      "media/LandingPage/19_Ultra_Short.png"
                    }
                  />
                </div>
              </div>
              <div id="small-circle1">
                <div
                  style={{
                    position: "absolute",
                    marginLeft: "23px",
                    marginTop: "220px",
                    zIndex: "1",
                    display: "flex",
                    lineHeight: "1.2em",
                  }}
                >
                  <div className="mt-3 pe-2">
                    <p
                      className="CircleBigTxt mb-1"
                      style={{ textAlign: "right" }}
                    >
                      Ultra Short <br /> Duration Funds
                    </p>
                    <p
                      style={{
                        textAlign: "right",
                        fontSize: "1em",
                        fontWeight: "500",
                        color: "#4b4d4a",
                      }}
                    >
                      8% - 10%
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
                        "media/LandingPage/16_Govt_Sector.png"
                      }
                    />
                  </div>
                </div>
                <div
                  style={{
                    position: "absolute",
                    marginLeft: "457px",
                    marginTop: "161px",
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
                        "media/LandingPage/LiquidFunds.svg"
                      }
                    />
                  </div>
                  <div
                    className=""
                    style={{
                      paddingLeft: "1rem  ",
                      paddingTop: "1rem",
                    }}
                  >
                    <p className="CircleBigTxt">Low Duration Funds</p>
                    <p
                      style={{
                        textAlign: "left",
                        fontSize: "1em",
                        fontWeight: "500",
                        color: "#4b4d4a",
                      }}
                    >
                      8% - 10%
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    position: "absolute",
                    marginLeft: "626px",
                    marginTop: "347px",
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
                      width: "68px",
                      height: "68px",
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
                        "media/LandingPage/18_Liquid_Fund.png"
                      }
                    />
                  </div>
                  <div
                    className=""
                    style={{
                      paddingTop: "1rem  ",
                      paddingLeft: "1rem  ",
                    }}
                  >
                    <p className="CircleBigTxt mb-2">Gift Bonds</p>
                    <p
                      style={{
                        textAlign: "left",
                        fontSize: "1em",
                        fontWeight: "500",
                        width: "200px",
                        color: "#4b4d4a",
                      }}
                    >
                      6% - 8%
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    position: "absolute",
                    marginLeft: "525px",
                    marginTop: "522px",
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
                        "media/LandingPage/21_Corp_Bond.png"
                      }
                    />
                  </div>
                  <div
                    className=""
                    style={{
                      marginLeft: "1rem  ",
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
                    <p
                      style={{
                        textAlign: "left",
                        fontSize: "1em",
                        fontWeight: "500",
                        color: "#4b4d4a",
                      }}
                    >
                      7% - 8%
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    position: "absolute",
                    marginLeft: "11px",
                    marginTop: "70.7px",
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
                    <img
                      alt=""
                      style={{
                        width: "42px",
                        height: "42px",
                        cursor: "pointer",
                      }}
                      src={
                        process.env.REACT_APP_STATIC_URL +
                        "media/LandingPage/MFI.svg"
                      }
                    />
                  </div>
                  <div className="mt-5 ms-5">
                    <p className="CircleBigTxt text-center mb-1 mt-3">
                      Corporate Bonds
                    </p>
                    <p
                      style={{
                        textAlign: "right",
                        fontSize: "1em",
                        fontWeight: "500",
                        color: "#4b4d4a",
                      }}
                    >
                      7% - 8%
                    </p>
                  </div>
                </div>
                <div id="small-circle2">
                  <div
                    style={{
                      position: "absolute",
                      marginLeft: "-44px",
                      marginTop: "263px",
                      marginLeft: "-77px",
                      zIndex: "1",
                      display: "flex",
                      lineHeight: "10px",
                    }}
                  >
                    <div className="mt-3 pe-4">
                      <p className="CircleBigTxt">Liquid Fund</p>
                      <p
                        style={{
                          textAlign: "right",
                          fontSize: "1em",
                          fontWeight: "500",
                          color: "#4b4d4a",
                        }}
                      >
                        8% - 10%
                      </p>
                    </div>
                    <div
                      className="CircleBox"
                      style={{
                        width: "80px",
                        height: "80px",
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
                      <img
                        alt=""
                        style={{
                          width: "50px",
                          height: "50px",
                          cursor: "pointer",
                          position: "absolute",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/LandingPage/20_Med_To_Long.png"
                        }
                      />
                    </div>
                  </div>

                  <div id="small-circle3">
                    <div id="small-circle4">
                      <div
                        className="CircleBox"
                        style={{
                          position: "relative",
                          marginLeft: "65px",
                          marginTop: "55px",
                          background: "#ffff",
                          padding: ".9em",
                          boxShadow: "rgb(230 230 230) -2px 3px 6px 3px",
                          borderRadius: "50%",
                          opacity: "1",
                          width: "60px",
                          height: "60px",
                        }}
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
                            "media/LandingPage/10_Tax_Saver_Funds.png"
                          }
                        />
                      </div>
                      <div className="">
                        <p className="CircleBigTxt text-center mb-1 ">
                          Overnight Funds
                        </p>
                        <p
                          style={{
                            textAlign: "center",
                            fontSize: "1em",
                            fontWeight: "500",
                            color: "#4b4d4a",
                          }}
                        >
                          7% - 8%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileCircle;
