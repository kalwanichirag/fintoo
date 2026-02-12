import { useState, useEffect } from "react";
import Footer from "../components/MainComponents/Footer";
import { ReactComponent as Logo } from "../Assets/Images/logo.svg";
import SideModal from "../components/SideModal";
import MainHeader from "../components/MainHeader";
import ServiceCard from "../components/ServiceCard";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Fullpage from "../components/Layout/Fullpage";
import { imagePath } from "../constants";
const FinancialPlanning = () => {
  const optionsIncomeSlab = [
    { value: "1", label: "Income Slab" },
    { value: "2", label: "0 to 10 Lacs" },
    { value: "3", label: "10 Lacs to 25 Lacs" },
    { value: "4", label: "25+ Lacs" },
  ];
  const customStyles = {
    option: (base, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...base,
        backgroundColor: isFocused ? "#ffff" : "#ffff",
        color: isFocused ? "#042b62" : "#042b62",
        cursor: "pointer",
      };
    },
    menuList: (base) => ({
      ...base,
      height: "100px",
      overflowY: 'scroll',
      scrollBehavior: 'smooth',
      "::-webkit-scrollbar": {
        width: "4px",
        height: "0px",
      },
      "::-webkit-scrollbar-track": {
        background: "#fff"
      },
      "::-webkit-scrollbar-thumb": {
        background: "#042b62"
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: "#555"
      }
    })
  };
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [getInTouch, setGetInTouch] = useState(false);
  const [expand, setExpand] = useState(false);

  useEffect(() => {
    document.body.classList.add("main-layout");
  }, []);

  return (

    <Fullpage>
      <section className="video-promo-hero position-relative">
        <div className="video-background-container">
          <video
            loop={true}
            muted={true}
            className="video-content video"
            poster=""
            preload="none"
            id="bg-video"
            autoPlay={true}
          >
            <source
              src={imagePath + "/static/media/Images/userflow/video/financial_planning.mp4"}
              type="video/mp4"
            />
          </video>
        </div>

        <div
          className="container "
          style={{ paddingTop: "2rem", paddingBottom: "1rem", }}
        >
          <div className="row align-items-center banner-content color-white">
            <div className="col-md-8">
              <h1
                className="page-header"
                style={{ fontSize: "32px !important" }}
              >
                Financial Planning
              </h1>
              <div className="button-container" style={{ marginTop: 20, marginBottom: 20 }}>
                <button
                  type="submit"
                  id="start_plan"
                  value="Start a plan"
                  onClick={() => setShow(true)}
                  className="outline-btn white d-inline-block custom-margin"
                >
                  Start a plan
                </button>
                <button
                  type="submit"
                  id="get_in_touch"
                  value="Get in touch"
                  onClick={() => setGetInTouch(true)}
                  className="outline-btn white d-inline-block"
                >
                  Get in touch
                </button>
                <a
                  target="_blank"
                  href="https://minty.co.in/restapi/downloadfilefromstaticurl/financial-planning-page-sample-report.pdf"
                  className="outline-btn white d-inline-block"
                >
                  Sample Report
                </a>
              </div>
              <p>
                A wish without a plan is just a dream. While everyone wishes to
                have a nice home, good car, yearly vacations, sufficient
                emergency funds, and a happy retired life, but only a few are
                able to achieve it. The most important reason behind this
                difference is planning. So, a financial plan is what you need to
                turn your wishes into reality. Fintoo, with the help of logical
                and practical financial planning&nbsp;done by Fintoo's financial
                planning tool, helps you realize your financial goals and create
                the future of your dreams.
              </p>
              <br />
              <p>
                Fintoo’s exceptional financial advisory services not only focus
                on helping you achieve your financial goals but also ensures
                that you achieve them at your desired time.
              </p>
              <br />
              <p>
                As there is no ‘one solution for all needs’ concept in financial
                planning, Fintoo’s first step towards preparing an exclusively
                tailored financial plan for you is to know you, your income
                details, expenses, spending habits, family details, financial
                goals, priorities. This will enable the robo advisor to prepare
                a perfect financial plan that will help you to utilize your
                income, prioritize your expenses, maximize your investments and
                finally, make your money, make more money for you. Wish To Know
                Your Current Financial Status? Use Fintoo’s FINANCIAL PLANNING
                CALCULATOR Now!
              </p>
              <br />
              <p>
                Wondering Why To Choose Fintoo’s Financial Planning &amp;
                Financial Advisory Services? Here’s Why;
              </p>
              <ul className="financial-services">
                <li>
                  Customised and comprehensive financial plan for every investor
                </li>
                <li>
                  One-of-the-most reliable AI-Driven Financial Planning Tool in
                  India
                </li>
                <li>
                  Unique financial planning process combining Artificial
                  Intelligence and Human Experience
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <SideModal
        show={show}
        expand={expand}
        onClose={() => {
          setShow(false);
          setExpand(false);
        }}
      >
        <div className="row m-0 myrow">
          <div className={`p-4 cnbx ${expand ? "col-md-6 col-12" : "col-12"}`}>
            <div className="mycardcon">
              <ServiceCard
                onClick={() => navigate(process.env.PUBLIC_URL + "/pricing")}
                image={imagePath + "/static/media/Images/userflow/img/automated-advisory.svg"}
                title="Automated advisory"
              />
              <ServiceCard
                image={imagePath + "/static/media/Images/userflow/img/expert-advisory.svg"}
                onClick={() => setExpand(true)}
                title="Expert advisory"
              />
            </div>
          </div>
          {expand && (
            <>
              <div className="col-md-6 col-12">
                <div className="mycardcon">
                  <div className="mt-5">
                    <h2 class="page-header text-center">
                      Fill in your details
                    </h2>
                    <div className="row justify-content-center mt-3">
                      <div className="col-md-8">
                        <div className="material input">
                          <input type="text" tabindex="1" placeholder="Name*" />
                        </div>
                      </div>
                    </div>
                    <div className="row justify-content-center mt-3">
                      <div className="col-md-8">
                        <div className="material input">
                          <input
                            type="text"
                            tabindex="1"
                            placeholder="Email Address*"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row justify-content-center mt-3">
                      <div className="col-md-8">
                        <div className="material input">
                          <input
                            type="number"
                            tabindex="1"
                            placeholder="Mobile Number*"
                          />
                        </div>
                      </div>
                    </div>
                    {/* <div className="row justify-content-center mt-3">
                      <div className="col-md-8">
                        <Select
                          classNamePrefix="sortSelectData"
                          placeholder="Select Expert*"
                          isSearchable={false}
                          styles={customStyles}
                          options={optionsIncomeSlab}
                        />
                      </div>
                    </div> */}
                    {/* <div className="expertcallback_captcha_div pt-3">
                      <div className="row form-row justify-content-center mt-3">
                        <div className="col-md-4">
                          <div id="captcha_block">
                            <img
                              src={require("../Assets/Images/main/captcha.png")}
                              style={{ float: "left" }}
                              draggable="false"
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <img
                            src="https://images.minty.co.in/static/assets/img/refresh_captcha.png"
                            className="refresh_captcha"
                            alt="REFRESH CAPTCHA"
                          />
                        </div>
                      </div>
                    </div> */}
                    {/* <div className="row justify-content-center mt-3">
                      <div className="col-md-8">
                        <div className="material input">
                          <input
                            type="text"
                            tabindex="1"
                            placeholder="Captcha*"
                          />
                        </div>
                      </div>
                    </div> */}
                    <div className="btn-container text-center">
                      <button
                        type="button"
                        value="Submit"
                        className="default-btn"
                      >
                        Select RM
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </SideModal>

      <SideModal show={getInTouch} onClose={() => setGetInTouch(false)}>
        <div className="row m-0 myrow">
          <div className=" col-12">
            <div style={{ paddingTop: "19%" }}>
              <h2 class="page-header text-center">Fill in your details</h2>
              <div className="row justify-content-center mt-3">
                <div className="col-md-8">
                  <div className="material input">
                    <input type="text" tabindex="1" placeholder="Name*" />
                  </div>
                </div>
              </div>
              <div className="row justify-content-center mt-3">
                <div className="col-md-8">
                  <div className="material input">
                    <input
                      type="text"
                      tabindex="1"
                      placeholder="Email Address*"
                    />
                  </div>
                </div>
              </div>
              <div className="row justify-content-center mt-3">
                <div className="col-md-8">
                  <div className="material input">
                    <input
                      type="text"
                      tabindex="1"
                      placeholder="Mobile Number*"
                    />
                  </div>
                </div>
              </div>
              {/* <div className="row justify-content-center mt-3">
                <div className="col-md-8">
                  <div className="material input">
                    <Select
                      classNamePrefix="sortSelectData"
                      placeholder="Select Expert*"
                      isSearchable={false}
                      styles={customStyles}
                      options={optionsIncomeSlab}
                    />
                  </div>
                </div>
              </div> */}
              <div className="expertcallback_captcha_div pt-3">
                <div className="row form-row justify-content-center mt-3">
                  <div className="col-md-4">
                    <div id="captcha_block">
                      <img
                        src={require("../Assets/Images/main/captcha.png")}
                        style={{ float: "left" }}
                        draggable="false"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <img
                      src={imagePath + "/static/media/Images/assets/img/refresh_captcha.png"}
                      className="refresh_captcha"
                      alt="REFRESH CAPTCHA"
                    />
                  </div>
                </div>
              </div>
              <div className="row justify-content-center mt-3">
                <div className="col-md-8">
                  <div className="material input">
                    <input type="text" tabindex="1" placeholder="Captcha*" />
                  </div>
                </div>
              </div>
              <div className="btn-container text-center">
                <button type="button" value="Submit" className="default-btn">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </SideModal>
    </Fullpage>
  );
};
export default FinancialPlanning;
