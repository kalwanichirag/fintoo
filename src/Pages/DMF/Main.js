import React, { useEffect, useState } from "react";
import { AiFillApple, AiFillAndroid } from "react-icons/ai";
import "./Main.css";
import Slider from "../../components/LandingPage/Slider";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Faqs from "../../components/LandingPage/Faqs";
import Circle from "../../components/LandingPage/Circle";

import Carousel from "react-bootstrap/Carousel";
import MobileCircle from "../../components/LandingPage/MobileCircle";

function Main({ isDmf }) {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    document.body.classList.add("white-bg");
    document.body.classList.add("remove-height");
    return () => {
      document.body.classList.remove("remove-height");
      document.body.classList.remove("white-bg");
    };
  }, []);

  return (
    <div className="landPage">
      {/* <div className="container-fluid">
        <MainHeader />
      </div> */}
      <div className="DesktopView">
        {isDmf !== false ? (
          <div className="section  p-4 d-flex justify-content-center align-items-center">
            <div className="container">
              <div className="row">
                <div className="col-12 col-sm-12 col-md-5 col-lg-5 FirstSection">
                  <div className="MobileLayOut">
                    <p className="BigText">
                      Manage Your Investments <br />
                      <span className="largetext">On The Go !</span>
                    </p>
                  </div>
                  <div className="MobileLayOut">
                    <p className="SmallText">
                      Switch to the smartest and a hassle-free way to make and
                      manage investments with Fintoo Invests' online investment
                      platform.
                    </p>
                  </div>
                  <div className="d-flex ms-3 mt-3 ">
                    <div className="ms-2">
                      <a href="https://apps.apple.com/in/app/fintoo/id1339092462">
                        <button className="downloadBtn">
                          <span className="Icons">
                            <AiFillApple />
                          </span>
                          <span>iOS Download</span>
                        </button>
                      </a>
                    </div>
                    <div className="ms-4">
                      <a href="https://play.google.com/store/apps/details?id=com.financialhospital.admin.finh">
                        <button className="downloadBtn">
                          <span className="Icons">
                            <AiFillAndroid />
                          </span>
                          <span>Android Download</span>
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-7 col-lg-7">
                  <div className="d-flex justify-content-center w-100 mobileApp">
                    <img
                      src={
                        process.env.REACT_APP_STATIC_URL +
                        "media/LandingPage/MobileAppView.svg"
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {/* Slider  */}
        <div id="domestic"></div>
        <div id="international"></div>
        <div className="section p-4 mt-md-5 justify-content-center align-items-center">
          <div className="SliderInfo">
            <p className="BigText">
              {" "}
              Forget Shuffling Between Apps. Get An Investment Option For Every
              Goal
            </p>
            <div className="row ">
              <p className="SmallText col-md-9">
                Whether you wish to invest for long term or short term, low-risk
                or mid to high-risk, or receive high returns or average returns.
                Explore investment options and choose the one that meets your
                requirements and matches your goals.
              </p>
            </div>
          </div>
          <div className="p-5">
            <div>
              <div className="outerCircle">
              <img className="outerImg"
                    src={
                      process.env.REACT_APP_STATIC_URL +
                      "media/LandingPage/10_Tax_Saver_Funds.png"
                    }
                  />
                <div className="innerrCircle">
                  <img
                    src={
                      process.env.REACT_APP_STATIC_URL +
                      "media/LandingPage/12_Flexi_Cap_Funds.png"
                    }
                  />
                </div>
              </div>
            </div>
            <Slider />
          </div>
          <div className="SliderInfo">
            <div className="row ">
              <p className="SmallText col-md-9">
                Let our investment dartboard enable you to identify the right
                investment options as per your risk-taking ability and
                ultimately hit a bullseye by achieving your financial goals.
              </p>
            </div>
          </div>
        </div>
        {/* Circle Animation */}
        <div className="section p-4 h-100">
          <Circle />
        </div>
        {/* Dashboard Ad */}

        <div
          className={`section p-4 d-flex justify-content-center align-items-center m-12   ${
            isDmf !== false ? "Dashboardad" : "DashboardadDMF"
          }`}
        >
          {isDmf !== false ? (
            <div className="row">
              <div className="col-12 col-sm-12 col-md-8 col-lg-8">
                <div className="w-100 webApp">
                  <div>
                    <div
                      style={{ position: "relative", display: "inline-block" }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          width: "73%",
                          height: "100%",
                          top: "67px",
                          left: "128px",
                        }}
                      >
                        <Carousel
                          onSelect={(v) => {
                            setSlide(v);
                          }}
                          indicators={false}
                          interval={4000}
                        >
                          <Carousel.Item>
                            <center>
                              <img
                              className="d-block"
                              alt="First slide"
                                src={
                                  process.env.REACT_APP_STATIC_URL +
                                  "media/Slider2.jpg"
                                }
                              />
                            </center>
                          </Carousel.Item>
                          <Carousel.Item>
                            <center>
                            <img
                              className="d-block"
                              alt="First slide"
                                src={
                                  process.env.REACT_APP_STATIC_URL +
                                  "media/Slider2.jpg"
                                }
                              />
                            </center>
                          </Carousel.Item>
                          <Carousel.Item>
                            <center>
                            <img
                              className="d-block"
                              alt="First slide"
                                src={
                                  process.env.REACT_APP_STATIC_URL +
                                  "media/Slider2.jpg"
                                }
                              />
                            </center>
                          </Carousel.Item>
                          <Carousel.Item>
                            <center>
                            <img
                              className="d-block"
                              alt="First slide"
                                src={
                                  process.env.REACT_APP_STATIC_URL +
                                  "media/Slider2.jpg"
                                }
                              />
                            </center>
                          </Carousel.Item>
                          <Carousel.Item>
                            <center>
                            <img
                              className="d-block"
                              alt="First slide"
                                src={
                                  process.env.REACT_APP_STATIC_URL +
                                  "media/Slider2.jpg"
                                }
                              />
                            </center>
                          </Carousel.Item>
                          <Carousel.Item>
                            <center>
                            <img
                              className="d-block"
                              alt="First slide"
                                src={
                                  process.env.REACT_APP_STATIC_URL +
                                  "media/Slider2.jpg"
                                }
                              />
                            </center>
                          </Carousel.Item>
                        </Carousel>
                      </div>
                      <div style={{ display: "inline-block" }}>
                      <img
                             style={{ width: "900px" }}
                              alt=""
                                src={
                                  process.env.REACT_APP_STATIC_URL +
                                  "media/laptop_frame.png"
                                }
                              />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-4 col-lg-4 mt-4">
                <div className="MobileLayOut">
                  <p className="BigText text-left">
                    Features That Have Empowered 1,35,000+ Investors To Create{" "}
                    <br /> Long-Term Wealth
                  </p>
                </div>
                <div>
                  <div className={`PlatformText ${slide == 0 ? "active" : ""}`}>
                    <div className="row">
                      <div className="col-1 col-sm-1 col-md-1">
                        <span
                          style={{
                            width: "40px",
                            height: "40px",
                            display: "inline-block",
                          }}
                        >
                           <img
                              alt=""
                                src={
                                  process.env.REACT_APP_STATIC_URL +
                                  "media/Forward.png"
                                }
                              />
                         
                        </span>
                      </div>
                      <div className="col-10 col-sm-10 col-md-10">
                        <p className="MidText pt-1 ps-1">
                          Stay On Track with live updates and real-time
                          notifications.
                        </p>
                        {/* <p className="SmallText ps-1">
                        Get better returns than most savings accounts with
                        smartsave. Whenever you need the funds, withdraw
                        instantly-even on weekends and holidays.
                      </p> */}
                      </div>
                    </div>
                  </div>
                  <div className={`PlatformText ${slide == 1 ? "active" : ""}`}>
                    <div className="row">
                      <div className="col-1 col-sm-1 col-md-1">
                        <span
                          style={{
                            width: "40px",
                            height: "40px",
                            display: "inline-block",
                          }}
                        >
                          {" "}
                          <img
                              alt=""
                                src={
                                  process.env.REACT_APP_STATIC_URL +
                                  "media/Forward.png"
                                }
                              />
                         
                        </span>
                      </div>
                      <div className="col-10 col-sm-10 col-md-10">
                        <p className="MidText pt-1 ps-1">
                          Make Profitable Decisions with effective data-driven
                          inputs.
                        </p>
                        {/* <p className="SmallText ps-1">
                        Increase Your Net Profit with 0% commission.
                      </p> */}
                      </div>
                    </div>
                  </div>
                  <div className={`PlatformText ${slide == 2 ? "active" : ""}`}>
                    <div className="row">
                      <div className="col-1 col-sm-1 col-md-1">
                        <span
                          style={{
                            width: "40px",
                            height: "40px",
                            display: "inline-block",
                          }}
                        >
                          {" "}
                          <img
                              alt=""
                                src={
                                  process.env.REACT_APP_STATIC_URL +
                                  "media/Forward.png"
                                }
                              />
                         
                        </span>
                      </div>
                      <div className="col-10 col-sm-10 col-md-10">
                        <p className="MidText pt-1 ps-1">
                          {" "}
                          Increase Your Net Profit with 0% commission.
                        </p>
                        {/* <p className="SmallText ps-1">
                        Join A Family of 1,35,000+ investors with an AUM of 250+
                        Crores and trusted since 2015.
                      </p>
                      <p className="SmallText ps-1">
                        Leave Your Worry About Security with world-class
                        security features.
                      </p> */}
                      </div>
                    </div>
                  </div>
                  <div className={`PlatformText ${slide == 3 ? "active" : ""}`}>
                    <div className="row">
                      <div className="col-1 col-sm-1 col-md-1">
                        <span
                          style={{
                            width: "40px",
                            height: "40px",
                            display: "inline-block",
                          }}
                        >
                          {" "}
                          <img
                              alt=""
                                src={
                                  process.env.REACT_APP_STATIC_URL +
                                  "media/Forward.png"
                                }
                              />
                         
                        </span>
                      </div>
                      <div className="col-10 col-sm-10 col-md-10">
                        <p className="MidText pt-1 ps-1">
                          {" "}
                          Achieve Specific Goals with goal-based investments.
                        </p>
                        {/* <p className="SmallText ps-1">
                        Join A Family of 1,35,000+ investors with an AUM of 250+
                        Crores and trusted since 2015.
                      </p>
                      <p className="SmallText ps-1">
                        Leave Your Worry About Security with world-class
                        security features.
                      </p> */}
                      </div>
                    </div>
                  </div>
                  <div className={`PlatformText ${slide == 4 ? "active" : ""}`}>
                    <div className="row">
                      <div className="col-1 col-sm-1 col-md-1">
                        <span
                          style={{
                            width: "40px",
                            height: "40px",
                            display: "inline-block",
                          }}
                        >
                          {" "}
                          <img
                              alt=""
                                src={
                                  process.env.REACT_APP_STATIC_URL +
                                  "media/Forward.png"
                                }
                              />
                         
                        </span>
                      </div>
                      <div className="col-10 col-sm-10 col-md-10">
                        <p className="MidText pt-1 ps-1">
                          {" "}
                          Join A Family of 1,35,000+ investors with an AUM of
                          250+ Crores and trusted since 2015.
                        </p>
                        {/* <p className="SmallText ps-1">
                        Join A Family of 1,35,000+ investors with an AUM of 250+
                        Crores and trusted since 2015.
                      </p>
                      <p className="SmallText ps-1">
                        Leave Your Worry About Security with world-class
                        security features.
                      </p> */}
                      </div>
                    </div>
                  </div>
                  <div className={`PlatformText ${slide == 5 ? "active" : ""}`}>
                    <div className="row">
                      <div className="col-1 col-sm-1 col-md-1">
                        <span
                          style={{
                            width: "40px",
                            height: "40px",
                            display: "inline-block",
                          }}
                        >
                          {" "}
                          <img
                              alt=""
                                src={
                                  process.env.REACT_APP_STATIC_URL +
                                  "media/Forward.png"
                                }
                              />
                         
                        </span>
                      </div>
                      <div className="col-10 col-sm-10 col-md-10">
                        <p className="MidText pt-1 ps-1">
                          {" "}
                          Leave Your Worry About Security with world-class
                          security features.
                        </p>
                        {/* <p className="SmallText ps-1">
                        Join A Family of 1,35,000+ investors with an AUM of 250+
                        Crores and trusted since 2015.
                      </p>
                      <p className="SmallText ps-1">
                        Leave Your Worry About Security with world-class
                        security features.
                      </p> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        {/* FAQ */}
      </div>
      <div className="MobileViewSection">
        {isDmf !== false ? (
          <div className="section  p-4 d-flex justify-content-center align-items-center">
            <div className="container">
              <div className="row">
                <div className="col-12 col-sm-12 col-md-8 col-lg-8">
                  <div className="d-flex justify-content-center w-100 mobileApp">
                  <img
                      src={
                        process.env.REACT_APP_STATIC_URL +
                        "media/LandingPage/MobileAppView.svg"
                      }
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-4 col-lg-4 FirstSection">
                  <div className="MobileLayOut">
                    <p className="BigText">
                      Manage Your Investments <br />
                      <span className="largetext">On The Go !</span>
                    </p>
                  </div>
                  <div className="MobileLayOut">
                    <p className="SmallText">
                      Switch to the smartest and a hassle-free way to make and
                      manage investments with Fintoo Invests' online investment
                      platform.
                    </p>
                  </div>
                  <div className="d-flex justify-content-between ms-3 mt-3 ">
                    <div className="ms-2">
                      <a href="https://apps.apple.com/in/app/fintoo/id1339092462">
                        <button className="downloadBtn">
                          <span className="Icons">
                            <AiFillApple />
                          </span>
                          <span>iOS Download</span>
                        </button>
                      </a>
                    </div>
                    <div className="ms-4">
                      <a href="https://play.google.com/store/apps/details?id=com.financialhospital.admin.finh">
                        <button className="downloadBtn">
                          <span className="Icons">
                            <AiFillAndroid />
                          </span>
                          <span>Android Download</span>
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Slider  */}
        <div className="section mt-1   justify-content-center align-items-center">
          <div className="SliderInfo">
            <p className="BigText ps-4 pe-4 pt-3">
              Forget Shuffling Between Apps. Get An Investment Option For Every
              Goal
            </p>
            <div className="row ">
              <p className="SmallText w-75">
                Whether you wish to invest for long term or short term, low-risk
                or mid to high-risk, or receive high returns or average returns.
                Explore investment options and choose the one that meets your
                requirements and matches your goals.
              </p>
            </div>
          </div>
          <div className="p-md-5 p-2">
            <Slider className="mt-4" />
          </div>
          <div className="SliderInfo">
            <div className="row ">
              <div className="SmallText w-75 py-4">
                Let our investment dartboard enable you to identify the right
                investment options as per your risk-taking ability and
                ultimately hit a bullseye by achieving your financial goals.
              </div>
            </div>
          </div>
        </div>
        {/* Circle Animation */}
        <div className="section m-0 p-4 h-100 d-none">
          <MobileCircle />
        </div>
        {/* Dashboard Ad */}
        {isDmf !== false ? (
          <div className="section p-4 d-flex justify-content-center align-items-center m-4   Dashboardad">
            <div className="row">
              <div className="col-12 col-sm-12 col-md-8 col-lg-8">
                <div className="w-100 webApp">
                  <div>
                    <div
                      style={{ position: "relative", display: "inline-block" }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          width: "72.4%",
                          height: "100%",
                          top: "34px",
                          left: "65px",
                        }}
                      >
                        <Carousel
                          onSelect={(v) => {
                            setSlide(v);
                          }}
                          indicators={false}
                          interval={4000}
                        >
                          <Carousel.Item>
                            <center>
                            <img
                              className="d-block"
                              alt="First slide"
                                src={
                                  process.env.REACT_APP_STATIC_URL +
                                  "media/Slider2.jpg"
                                }
                              />
                            </center>
                          </Carousel.Item>
                          <Carousel.Item>
                            <center>
                              <img
                              className="d-block"
                              alt="First slide"
                                src={
                                  process.env.REACT_APP_STATIC_URL +
                                  "media/Slider2.jpg"
                                }
                              />
                            </center>
                          </Carousel.Item>
                          <Carousel.Item>
                            <center>
                              <img
                              className="d-block"
                              alt="First slide"
                                src={
                                  process.env.REACT_APP_STATIC_URL +
                                  "media/Slider2.jpg"
                                }
                              />
                            </center>
                          </Carousel.Item>
                          <Carousel.Item>
                            <center>
                              <img
                              className="d-block"
                              alt="First slide"
                                src={
                                  process.env.REACT_APP_STATIC_URL +
                                  "media/Slider2.jpg"
                                }
                              />
                            </center>
                          </Carousel.Item>
                          <Carousel.Item>
                            <center>
                              <img
                              className="d-block"
                              alt="First slide"
                                src={
                                  process.env.REACT_APP_STATIC_URL +
                                  "media/Slider2.jpg"
                                }
                              />
                            </center>
                          </Carousel.Item>
                        </Carousel>
                      </div>
                      <div style={{ display: "inline-block" }}>
                      <img
                             style={{ width: "454px" }}
                              alt=""
                                src={
                                  process.env.REACT_APP_STATIC_URL +
                                  "media/laptop_frame.png"
                                }
                              />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-12 col-sm-12 col-md-4 col-lg-4 mt-4"
                style={{
                  width: "350px",
                  margin: "auto",
                  zIndex: "10000",
                }}
              >
                <div className="MobileLayOut">
                  <p className="BigText text-left">
                    Features That Have Empowered 1,35,000+ Investors To Create
                    Long-Term Wealth
                  </p>
                </div>
                <div className="ms-0">
                  <div className={`PlatformText ${slide == 0 ? "active" : ""}`}>
                    <div className="row">
                      <div className="col-1 col-sm-1 col-md-1">
                        <span
                          style={{
                            width: "40px",
                            height: "40px",
                            display: "inline-block",
                          }}
                        >
                          {" "}
                          <img
                              alt=""
                                src={
                                  process.env.REACT_APP_STATIC_URL +
                                  "media/Forward.png"
                                }
                              />
                         
                        </span>
                      </div>
                      <div className="col-10 col-sm-10 col-md-10">
                        <p className="MidText pt-1 ps-3">
                          Stay On Track with live updates and real-time
                          notifications.
                        </p>
                        {/* <p className="SmallText ps-3">
                        Get better returns than most savings accounts with
                        smartsave. Whenever you need the funds, withdraw
                        instantly-even on weekends and holidays.
                      </p> */}
                      </div>
                    </div>
                  </div>
                  <div className={`PlatformText ${slide == 1 ? "active" : ""}`}>
                    <div className="row">
                      <div className="col-1 col-sm-1 col-md-1">
                        <span
                          style={{
                            width: "40px",
                            height: "40px",
                            display: "inline-block",
                          }}
                        >
                          {" "}
                          <img
                              alt=""
                                src={
                                  process.env.REACT_APP_STATIC_URL +
                                  "media/Forward.png"
                                }
                              />
                         
                        </span>
                      </div>
                      <div className="col-10 col-sm-10 col-md-10">
                        <p className="MidText pt-1 ps-3">
                          Make Profitable Decisions with effective data-driven
                          inputs.
                        </p>
                        {/* <p className="SmallText ps-3">
                        Invested elsewhere? Just hit import so you can manage
                        them on Groww.
                      </p> */}
                      </div>
                    </div>
                  </div>
                  <div className={`PlatformText ${slide == 2 ? "active" : ""}`}>
                    <div className="row">
                      <div className="col-1 col-sm-1 col-md-1">
                        <span
                          style={{
                            width: "40px",
                            height: "40px",
                            display: "inline-block",
                          }}
                        >
                          {" "}
                          <img
                              alt=""
                                src={
                                  process.env.REACT_APP_STATIC_URL +
                                  "media/Forward.png"
                                }
                              />
                         
                        </span>
                      </div>
                      <div className="col-10 col-sm-10 col-md-10">
                        <p className="MidText pt-1 ps-3">
                          Achieve Specific Goals with goal-based investments.
                        </p>
                        {/* <p className="SmallText ps-3">
                        Subscribe the latest NFOs and be one of the firsts to
                        subscribe to new funds offered by different fund houses.
                      </p> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {/* FAQ */}
        <div className="section p-4 d-none justify-content-center align-items-center bg-body m-0">
          <div className="FAQ">
            <p className="BigText">Frequently Asked Questions</p>
            <div>
              <input
                className="w-100 FaqSearch"
                placeholder="Search your questions here..."
                type="Search"
              />
            </div>
            <Faqs />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
