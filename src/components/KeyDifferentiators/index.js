import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Styles from "./Styles.module.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {FcNext} from "react-icons/fc";
import {FcPrevious} from "react-icons/fc";
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
const TabName = ["Comprehensive", "Rebalancing", "Triggers", "Locker"];

TabName.map((Tabs, index) => index + " = " + Tabs + " = " + TabName[index]);
const KeyDifferentiators = () => {
  const { pathname, hash } = useLocation();
  const [showTab, setShowTab] = useState("Comprehensive");
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    { header: "Comprehensive & Personalised", content: "Keeping your income, expenses, assets, liabilities, risk profile, and goals in mind, we develop a 360-degree financial plan that covers every aspect of financial planning like money management, investment portfolio analysis, contingency planning, and pre-and-post-retirement cash flow projections. This empowers you with the information, necessary to make informed and beneficial financial decisions." },
    { header: "Rebalancing And Restructuring", content: "Just like your dreams have no boundaries, we too believe in going beyond boundaries and giving you a solution that offers more than just the creation of static documents. By keeping pace with the ever-changing economic landscape, we offer dynamic and personalised advice through a range of rebalancing and restructuring options that keep your investments on track to achieve your financial goals." },
    { header: "What If Analysis & Triggers", content: "Various ‘What If’ analysis tools and triggers to keep you updated on goals and investments." },
    { header: "Fintoo Locker", content: "Keep all your financial and tax-related documents in a single secure location for easy access." }
  ];

  const handlePrevious = () => {
    setActiveSlide((prevSlide) =>
      prevSlide - 1 >= 0 ? prevSlide - 1 : slides.length - 1
    );
  };

  const handleNext = () => {
    setActiveSlide((prevSlide) =>
      prevSlide + 1 < slides.length ? prevSlide + 1 : 0
    );
  };
  useEffect(() => {
    if (hash == "#international") {
      setShowTab("usequity");
    } else if (hash == "#domestic") {
      setShowTab("equity");
    } else {
      setShowTab("Comprehensive");
    }
  }, [hash]);
  return (
    <>
      <div className="container">
        <h2 className={`text-center ${Styles.TextHeader}`} >
          Key Differentiators That Make Our Advice More Effective
        </h2>
        <div className={`${Styles.TextLabel}`}>
          Combining the power of our in-house developed algorithmic financial
          planning platform with the extensive experience of our team of expert
          advisors, we deliver tangible and comprehensive wealth management
          solutions that are at par with your financial goals.
        </div>
        <div className={`${Styles.tabSection}`}>
          <div
            className={`d-md-block d-none  ${Styles.tabData}`}
            style={showTab == "Comprehensive" ? bgcolor : inactive}
          >
            <div className={`${Styles.links}`}>
              <div
                onMouseOver={() => setShowTab("Comprehensive")}
                className={`${Styles.tabName} ${showTab ? "ActiveTab" : ""}`}
              >
                <div style={showTab == "Comprehensive" ? active : inactive}>
                  Comprehensive & Personalised
                </div>
              </div>
              <div
                onMouseOver={() => setShowTab("Rebalancing")}
                className={`${Styles.tabName}`}
              >
                <div style={showTab == "Rebalancing" ? active : inactive}>
                  Rebalancing And Restructuring
                </div>
              </div>
              <div
                onMouseOver={() => setShowTab("Triggers")}
                className={`${Styles.tabName}`}
              >
                <div style={showTab == "Triggers" ? active : inactive}>
                  What If Analysis & Triggers
                </div>
              </div>
              <div
                onMouseOver={() => setShowTab("Locker")}
                className={`${Styles.tabName}`}
              >
                <div style={showTab == "Locker" ? active : inactive}>
                  Fintoo Locker
                </div>
              </div>
            </div>
            <div className={`${Styles.tabSection}`}>
              {showTab == "Comprehensive" && (
                <>
                  <p>
                    Keeping your income, expenses, assets, liabilities, risk
                    profile, and goals in mind, we develop a 360-degree
                    financial plan that covers every aspect of financial
                    planning like money management, investment portfolio
                    analysis, contingency planning, and pre-and-post-retirement
                    cash flow projections. This empowers you with the
                    information, necessary to make informed and beneficial
                    financial decisions.
                  </p>
                </>
              )}
              {showTab == "Rebalancing" && (
                <>
                  <p>
                    Just like your dreams have no boundaries, we too believe in
                    going beyond boundaries and giving you a solution that
                    offers more than just the creation of static documents. By
                    keeping pace with the ever-changing economic landscape, we
                    offer dynamic and personalised advice through a range of
                    rebalancing and restructuring options that keep your
                    investments on track to achieve your financial goals.
                  </p>
                </>
              )}
              {showTab == "Triggers" && (
                <>
                  <p>
                    Various ‘What If’ analysis tools and triggers to keep you
                    updated on goals and investments.
                  </p>
                </>
              )}
              {showTab == "Locker" && (
                <>
                  <p>
                    Keep all your financial and tax-related documents in a
                    single secure location for easy access.
                  </p>
                </>
              )}
            </div>
          </div>
          {/* For Mobile Responsive */}
          <div className="d-md-none d-block" style={{border : "1px solid #042b62"}}>
            <Carousel showIndicators={false} showArrows={false} showThumbs={false} showStatus={false} selectedItem={activeSlide}>
              {slides.map((slide, index) => (
                <div key={index}>
                  <h2 className="d-flex justify-content-between align-items-center">
                    <div className="ms-2" onClick={handlePrevious}>
                     <FcPrevious style={{fontSize : "1rem"}}/>
                    </div>
                    <div style={{borderBottom : "2px solid #042b62"}} className={`pt-2 ${Styles.tabName}`}>  {slide.header}</div>
                    <div className="me-2" onClick={handleNext}>
                      <FcNext style={{fontSize : "1rem"}}/>
                    </div>
                  </h2>
                  <p className={`${Styles.conetntSlide}`}>{slide.content}</p>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </div>
    </>
  );
};
export default KeyDifferentiators;
