import React, { useState } from "react";
import FintooLogo from "../../Assets/Images/logo.svg";
import Cart from "../../Assets/Images/cart.png";
import ShoppingCart from "../../Assets/Images/shopping_cart.png";
import { AiFillApple, AiFillAndroid } from "react-icons/ai";
import { RiFundsFill } from "react-icons/ri";
import "./Main.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Faqs from "../../components/LandingPage/Faqs";
import { BsSearch } from "react-icons/bs";
import MFI from "../../Assets/Images/MFI.svg";
import Forward from "../../Assets/Images/Forward.png";
import MobileAppView from "../../Assets/Images/MobileAppView.svg";
import WebApp from "../../Assets/Images/Lp_f_1.jpg";
import LaotopF from "../../Assets/Images/laptop_frame.png";
import Apple from "../../Assets/Images/apple.png";
import MS from "../../Assets/Images/MS.png";
import Google from "../../Assets/Images/Google.png";
import Amazon from "../../Assets/Images/Amazon.png";
import Tesla from "../../Assets/Images/Tesla.png";
import ThreeM from "../../Assets/Images/3M.png";
import UsStockSlider from "react-elastic-carousel";
import Carousel from "react-bootstrap/Carousel";
import { Link } from "react-router-dom";
const breakPoints = [
  { width: 1, itemsToShow: 1 },
  { width: 550, itemsToShow: 2, itemsToScroll: 2 },
  { width: 768, itemsToShow: 4 },
  { width: 1200, itemsToShow: 4 },
];
function USstokcs() {
  const [slide, setSlide] = useState(0);
  return (
    <div className="landPage Us-stocks">
      <div className="container-fluid">
        <nav className="navbar navbar-expand-lg navbar-dark bg-transparent shadow-none p-2 ms-2">
          <a className="navbar-brand" href="#">
            <img src={process.env.REACT_APP_STATIC_URL + "media/wp/Fintoologo_.svg"} alt="fintoo logo" />
          </a>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav  justify-content-center d-flex flex-fill">
              <li className="nav-item active">
                <a className="nav-link text-dark" href="#">
                  Advisory
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-dark" href="#">
                  Mutual Fund
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-dark" href="#">
                  Invest
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-dark" href="#">
                  ITR Filling
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-dark" href="#">
                  Blog
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-dark" href="#">
                  Events
                </a>
              </li>
            </ul>
          </div>
          <div className="LoginNdCart">
            <ul className="navbar-nav justify-content-center navbar-brand">
              <li className="nav-item active">
                <a className="nav-link text-dark" href="#">
                  Login
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-dark" href="#">
                  <img
                    style={{
                      width: "20px",
                    }}
                    src={Cart}
                  />
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="section p-4 d-flex justify-content-center align-items-center">
        <div className="container ">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-8 col-lg-8 ">
              <div className="d-flex justify-content-center w-100 mt-5">
                <img className="mt-6" src={MobileAppView} />
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-4 FirstSection">
              <div className="MobileLayOut">
                <p className="BigText">Start Investing in US Stocks</p>
              </div>
              <div className="MobileLayOut">
                <p className="SmallText">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                  malesuada tempus lectus a finibus. Praesent non euismod quam,
                  at tristique urna. Curabitur augue lorem, pellentesque at mi
                  nec, volutpat eleifend augue.
                </p>
              </div>
              <div className="d-flex justify-content-between ms-3 mt-5 ">
                <div className="ms-2">
                  <button className="downloadBtn">
                    <Link
                      to="#"
                      className="text-decoration-none text-white"
                      style={{
                        fontWeight: "600",
                        width: "100% !important",
                      }}
                    >
                      Login
                    </Link>
                  </button>
                </div>
                <div className="ms-4">
                  <button className="downloadBtn">
                    <Link
                      to="#"
                      className="text-decoration-none text-white"
                      style={{
                        fontWeight: "600",
                        width: "100% !important",
                      }}
                    >
                      Get the App
                    </Link>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slider  */}
      <div className="section p-4  justify-content-center align-items-center">
        <div className="SliderInfo">
          <p className="BigText"> Top by Market Cap </p>
          <div className="row ">
            <p className="SmallText col-md-9">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
              malesuada tempus lectus a finibus. Praesent non euismod quam, at
              tristique urna.
            </p>
          </div>
        </div>
        <div className="p-5 container  w-100 m-auto">
          <UsStockSlider
            itemsToShow={4}
            enableAutoPlay
            autoPlaySpeed={1500}
            autoTabIndexVisibleItems={true}
            breakPoints={breakPoints}
          >
            <div className="imgCenter">
              <div className="imgBorderUS">
                <center>
                  <img
                    style={{
                      width: "40px",
                      height: "40px",
                    }}
                    src={Apple}
                  />
                </center>
              </div>
              <div className="pt-2">
                <div className="SliderText"> Apple INC</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={MS}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Microsoft Corporation</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={Google}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Alphabet INC</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={Amazon}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Amazoncom INC</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={Apple}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Apple INC</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={MS}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Microsoft Corporation</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={Google}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Alphabet INC</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={Amazon}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Amazoncom INC</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div>
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={Apple}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Apple INC</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={MS}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Microsoft Corporation</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={Google}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Alphabet INC</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={Amazon}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Amazoncom INC</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={Apple}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Apple INC</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={MS}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Microsoft Corporation</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={Google}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Alphabet INC</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={Amazon}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Amazoncom INC</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
          </UsStockSlider>
        </div>
      </div>
      <div className="section p-4  justify-content-center align-items-center">
        <div className="SliderInfo">
          <p className="BigText"> Top Technology Funds </p>
          <div className="row ">
            <p className="SmallText col-md-9">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
              malesuada tempus lectus a finibus. Praesent non euismod quam, at
              tristique urna.
            </p>
          </div>
        </div>
        <div className="p-5">
          <UsStockSlider
            itemsToShow={4}
            enableAutoPlay
            autoPlaySpeed={1500}
            autoTabIndexVisibleItems={true}
            breakPoints={breakPoints}
          >
            <div className="imgCenter">
              <div className="imgBorderUS">
                <center>
                  <img
                    style={{
                      width: "40px",
                      height: "40px",
                    }}
                    src={Tesla}
                  />
                </center>
              </div>
              <div className="pt-2">
                <div className="SliderText"> Tesla</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={MS}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Microsoft Corporation</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={ThreeM}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText">3M</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={Apple}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Apple INC</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={Amazon}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Amazoncom INC</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={MS}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Microsoft Corporation</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={Google}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Alphabet INC</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={Amazon}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Amazoncom INC</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div>
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={Apple}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Apple INC</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={MS}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Microsoft Corporation</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={Google}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Alphabet INC</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={Amazon}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Amazoncom INC</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={Apple}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Apple INC</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={MS}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Microsoft Corporation</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={Google}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Alphabet INC</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={Amazon}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Amazoncom INC</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
          </UsStockSlider>
        </div>
      </div>
      {/* Dashboard Ad */}
      <div className="section p-4 d-flex justify-content-center align-items-center m-12   Dashboardad">
        <div className="row">
          <div className="col-12 col-sm-12 col-md-6 col-lg-6">
            <div className="w-100 webApp">
              <div className="MobileLayOut">
                <div className="BigText text-left">0% Charges</div>
                <span className="BigText text-left">100% Value</span>
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
                        {" "}
                        <img src={Forward} />
                      </span>
                    </div>
                    <div className="col-10 col-sm-10 col-md-10">
                      <p className="MidText pt-1 ps-3">Free account opening</p>
                      <p className="SmallText ps-3">
                        Get better returns than most savings accounts with
                        smartsave. Whenever you need the funds, withdraw
                        instantly-even on weekends and holidays.
                      </p>
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
                        <img src={Forward} />
                      </span>
                    </div>
                    <div className="col-10 col-sm-10 col-md-10">
                      <p className="MidText pt-1 ps-3">
                        Zero account USstokcstenance charges
                      </p>
                      <p className="SmallText ps-3">
                        Invested elsewhere? Just hit import so you can manage
                        them on Groww.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <button className="downloadBtn">
                <Link
                  to="#"
                  className="text-decoration-none text-white"
                  style={{
                    fontWeight: "600",
                    width: "100% !important",
                  }}
                >
                  Know More
                </Link>
              </button>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-4">
            <div>
              <div style={{ position: "relative", display: "inline-block" }}>
                <div
                  style={{
                    position: "absolute",
                    width: "72.5%",
                    height: "100%",
                    top: "52px",
                    left: "100px",
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
                          src={WebApp}
                          alt="First slide"
                        />
                      </center>
                    </Carousel.Item>
                    <Carousel.Item>
                      <center>
                        <img
                          className="d-block"
                          src={WebApp}
                          alt="First slide"
                        />
                      </center>
                    </Carousel.Item>
                    <Carousel.Item>
                      <center>
                        <img
                          className="d-block"
                          src={WebApp}
                          alt="First slide"
                        />
                      </center>
                    </Carousel.Item>
                  </Carousel>
                </div>
                <div style={{ display: "inline-block" }}>
                  <img src={LaotopF} style={{ width: "700px" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* FAQ */}
      <div className="section p-4  justify-content-center align-items-center">
        <div className="SliderInfo">
          <p className="BigText"> Exchange-traded funds (ETFs) </p>
          <div className="row ">
            <p className="SmallText col-md-9">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
              malesuada tempus lectus a finibus. Praesent non euismod quam, at
              tristique urna.
            </p>
          </div>
        </div>
        <div className="p-5 container  w-70 m-auto">
          <UsStockSlider
            itemsToShow={4}
            enableAutoPlay
            autoPlaySpeed={1500}
            autoTabIndexVisibleItems={true}
            breakPoints={breakPoints}
          >
            <div className="imgCenter">
              <div className="imgBorderUS">
                <center>
                  <img
                    style={{
                      width: "40px",
                      height: "40px",
                    }}
                    src={Apple}
                  />
                </center>
              </div>
              <div className="pt-2">
                <div className="SliderText">
                  {" "}
                  Vanguard Groups, Inc. Mid-Cap ETF
                </div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={MS}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText">Invesco Capital Management LLC</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={Google}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText">SSgA Active Trust SPDR Dow</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={Amazon}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText">
                  {" "}
                  BlackRock Institutional Trust Company N.A INC
                </div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div>
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={Apple}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Apple INC</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={MS}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Microsoft Corporation</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={Google}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Alphabet INC</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={Amazon}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Amazoncom INC</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div>
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={Apple}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Apple INC</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={MS}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Microsoft Corporation</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={Google}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Alphabet INC</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={Amazon}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Amazoncom INC</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={Apple}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Apple INC</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={MS}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Microsoft Corporation</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={Google}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Alphabet INC</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
            <div className="imgCenter">
              <div className="imgBorderUS">
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={Amazon}
                />
              </div>
              <div className="pt-2">
                <div className="SliderText"> Amazoncom INC</div>
                <div className="stockVal">$164.62</div>
              </div>
            </div>
          </UsStockSlider>
        </div>
      </div>
    </div>
  );
}

export default USstokcs;
