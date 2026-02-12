import { useState, useEffect } from "react";

import Partners from "./Partners";
import Clients from "./Clients";
const AboutUs = () => {
  useEffect(() => {
    document.body.classList.add("main-layout");
    return () => {
      document.body.classList.remove("dg-layout");
    };
  }, []);

  return (
    <div>
      {/* <MainHeader /> */}
      <div ng-controller="aboutController" className="ng-scope">
        {/* About Main Section */}
        <section
          className="about-banner"
          style={{
            backgroundColor: "#ffff",
          }}
        >
          <div className="container-fluid">
            <div className="row h100 align-items-center">
              <div className="col-md-5">
                <p>The financial market doesn’t help even your odds. We do.</p>
                <h2 className="mt-0">
                  Grow your money with genuine expert advice from Fintoo!
                </h2>
                <a
                  href="/contact"
                  target="_self"
                  className="default-btn d-inline-block"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </section>
        {/* Our Core Value */}
        <section
          className="core-value sectionPadding"
          style={{
            backgroundColor: "#ffff",
          }}
        >
          <div className="container">
            <h2 className="page-header color-blue text-center font-600 mt-0">
              Our Core Value
            </h2>
            <div className="row mt-5">
              <div className="col-md-4">
                <div>
                  <img
                    alt="Customer centricity"
                    src={
                      process.env.REACT_APP_STATIC_URL +
                      "media/AboutUs/customer-centricity.svg"
                    }
                    className="core-icon"
                  />
                  <h3>Customer Centricity</h3>
                  <p>
                    Whatever queries you have, Fintoo can answer them. Our
                    customers’ needs are our main focus and we pride ourselves
                    on providing creative solutions to complex financial
                    problems.
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div>
                  <img
                    alt=""
                    className="core-icon"
                    src={
                      process.env.REACT_APP_STATIC_URL +
                      "media/AboutUs/honest-determination.svg"
                    }
                  />
                  <h3>Honest Determination</h3>
                  <p>
                    Fintoo is determined to help you achieve the maximum through
                    your investments. Your financial goals are of utmost
                    importance to us and we promise to offer customised advice
                    by harnessing the power of our intelligent systems.
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div>
                  <img
                    alt=""
                    className="core-icon"
                    src={
                      process.env.REACT_APP_STATIC_URL +
                      "media/AboutUs/responsibility.svg"
                    }
                  />

                  <h3>Responsibility for your Wealth</h3>
                  <p>
                    Growing your money is the top-most priority and Fintoo helps
                    you do that with the right advice. We take complete
                    responsibility for the trust you place in Fintoo and ensure
                    that your goals are achieved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Who are we */}
        <section className="who-are-we sectionPadding">
          <div className="container">
            <h2 className="page-header color-blue text-center font-600">
              Who Are We?
            </h2>
            <div className="row mt-80 mt-5">
              <div className="col-md-6">
                <img
                  alt=""
                  className="who-are-we-img"
                  src={
                    process.env.REACT_APP_STATIC_URL +
                    "media/AboutUs/intelligent-platform-that-cares.svg"
                  }
                />
              </div>
              <div className="col-md-5 mt-3">
                <h2 className="mt-0 font-600">
                  An intelligent platform that cares
                </h2>
                <p className="mt-2">
                  Fintoo is one of India’s best platforms dedicated to helping
                  you take sound financial decisions. We have a dream to disrupt
                  the financial space by introducing innovative technology like
                  advice on-the-go, while simultaneously offering to connect
                  users to qualified Financial and Taxation Advisors.
                </p>
                <p>
                  {" "}
                  With a perfect blend of modern technology and traditional
                  wisdom, Fintoo helps you achieve your financial goals with
                  just a snap of your fingers. It is the single point
                  destination for your financial queries and Fintoo is always
                  available, wherever you are.
                </p>
              </div>
            </div>
            <div className="row mt-80 reverse mt-5 ms-5">
              <div className="col-md-5">
                <h2 className="mt-0 font-600">The journey has just begun</h2>
                <p className="mt-2">
                  Over the last few years, we have developed cutting-edge Robo
                  Advisors to provide accurate financial advice that can help
                  you get your financial journey on track. We use these Robo
                  Advisors to carry out an analysis of the investments you need
                  to make to achieve your financial goals. Accordingly, we
                  advise you on what steps to take, what your tax liability will
                  be, etc.{" "}
                </p>
                <p>
                  As a result, Fintoo has established itself as a genuine
                  financial advisor that prioritises your wellbeing over
                  everything else. We have nudged thousands of customers in the
                  right direction, but our journey has just begun and we are
                  raring to go!
                </p>
              </div>
              <div className="col-md-6">
                <img
                  alt=""
                  className="who-are-we-img"
                  src={
                    process.env.REACT_APP_STATIC_URL +
                    "media/AboutUs/the-journey-has-just-began.svg"
                  }
                />
              </div>
            </div>
          </div>
        </section>
        {/* Why Us */}
        <section
          className="why-us sectionPadding"
          style={{
            backgroundColor: "#ffff",
          }}
        >
          <div className="container">
            <h2 className="page-header color-blue text-center font-600">
              Why Us?
            </h2>
            <img
              style={{ margin: "auto", width: "70%", display: "flex" }}
              alt="why-us"
              src={
                process.env.REACT_APP_STATIC_URL +
                "media/AboutUs/why-us-banner.svg"
              }
            />
            <div className="why-us-block text-center">
              <p>
                Our team believes that a solid foundation built with detailed
                advice can help you achieve your financial goals. We understand
                your need for financial stability, and help you achieve this
                through smart investment decisions. Our prime objective is to
                help every individual make the most of their wealth.
              </p>
            </div>
          </div>
        </section>
        {/* Our Partners */}
        <section
          className="our-partners sectionPadding"
          style={{
            backgroundColor: "#ffff",
          }}
        >
          <div className="container">
            <h2 className="page-header color-blue text-center font-600">
              Our Partners
            </h2>
            <div className="our-partners-carousel owl-carousel owl-theme owl-loaded owl-drag">
              <Partners />
            </div>
          </div>
        </section>
        <section
          className="minty-products"
          style={{
            backgroundColor: "#ffff",
          }}
        >
          <div className="container-fluid">
            <div className="row text-center">
              <div className="col-md-6 sectionPadding bg-grey">
                <div>
                  <img
                    alt="Fintoo logo"
                   src={process.env.REACT_APP_STATIC_URL + "media/wp/Fintoologo_.svg"}
                  />
                 
                  <p className="Textinfo text-center pt-4 col-md-9 m-auto">
                    Fintoo is a product of Fintoo Wealth Private Limited, a company
                    established in 2004. Fintoo Wealth Private Limited has helped over
                    60,000 clients with their financial goals. Fintoo is India’s
                    only on-the-go platform for financial and tax advice and
                    comes with the experience and knowledge of Fintoo Wealth Private Limited. Available to customers at a pan-India level, Fintoo
                    helps individuals realise their true financial potential.
                  </p>
                </div>
              </div>
              <div className="col-md-6 sectionPadding">
                <div>
                  <img
                  style={{marginTop : "5px"}}
                    alt="Fintoo logo"
                   src={process.env.REACT_APP_STATIC_URL + "media/fintooinvestlogo.svg"}
                  />
                 
                  <p className="Textinfo text-center pt-3 col-md-9 m-auto">
                    From Fintoo Wealth Private Limited – a company established in 2004 –
                    comes another pioneer app, Fintooinvest. Fintooinvest is a
                    platform dedicated to Mutual Funds. While Fintoo guides you
                    regarding your financial goals, Fintooinvest helps you
                    actualize those goals through concrete actions, such as
                    making the right investment. Keeping in mind our core value
                    of customer centricity, Fintoo and Fintooinvest together
                    make it a whole lot easier for you to track your financial
                    requirements at one go!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="section fp-auto-height-responsive" id="section4">
          <section
            className="about-client sectionPadding itr-clients"
            id="section5"
          >
            <div className="container-fluid">
              <h2 className="page-header color-blue text-center font-600 mt-0">
                Our Clients Have Something To Say
              </h2>
              <div>
                <Clients />
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  );
};
export default AboutUs;
