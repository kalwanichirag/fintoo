import { useState, useEffect } from "react";
import Footer from "../components/MainComponents/Footer";
import { ReactComponent as Logo } from "../Assets/Images/logo.svg";
import SideModal from "../components/SideModal";
import MainHeader from "../components/MainHeader";
import RegisterForm from "../components/RegisterForm";
import RegisterFormTax from "../components/RegisterFormTax";
import { imagePath } from "../constants";

const TaxPlanningStrategies = () => {
  const [getInTouch, setGetInTouch] = useState(false);
  useEffect(() => {
    document.body.classList.add("main-layout");
  }, []);
  return (
    <div>
      {/* <MainHeader /> */}

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
              src={imagePath + "/static/media/Images/userflow/video/tax_planning.mp4"}
              type="video/mp4"
            />
          </video>
        </div>

        <div className="container " style={{ paddingTop: "2rem", paddingBottom: "1rem", }}>
          <div className="row align-items-center banner-content color-white">
            <div className="col-md-8">
              <h1
                className="page-header"
                style={{ fontSize: "32px !important" }}
              >
                Tax Planning
              </h1>
              <div className="button-container" style={{ marginTop: 20, marginBottom: 20 }}>
                <button
                  type="submit"
                  id="get_in_touch"
                  value="Get in touch"
                  onClick={() => setGetInTouch(true)}
                  className="outline-btn white d-inline-block"
                >
                  Get in touch
                </button>
              </div>
              <p>
                Is it the tax season or you are one of the few people who do not
                wait till the last moment to do their tax planning?
              </p>
              <br />
              <p>
                Tax planning isn’t just something that you should think about
                only during the tax season. Ideally, you should always keep an
                eye on efficient tax-saving schemes and strategies by certified
                income tax planners that can help you maximize your income tax
                savings and increase your investments.
              </p>
              <br />
              <p>
                As each person’s income and income tax calculation is unique,
                Fintoo’s experts perform an in-depth analysis of all your
                tax-related requirements and prepare an ideal plan for you.
                Whether your tax planning process requires business taxation,
                advance taxation, NRI taxation, cash flow management or even
                capital gains, we deliver an end-to-end tax solution for you.
              </p>
              <br />
              <p>
                Need more reasons to start your tax planning with Fintoo? Well,
                here are few more reasons to choose Fintoo for your tax
                planning;
              </p>
              <ul className="financial-services">
                <li>Comprehensive tax planning services</li>
                <li>Legitimate income tax saving strategies</li>
                <li>Direct contact with your tax planner</li>
                <li>Salary restricting to minimize tax liability</li>
                <li>
                  Individual Taxation, Business Taxation, NRI Taxation, Domestic
                  Taxation, Capital Gain Taxation, and Advance Taxation. All
                  types of tax planning in one place.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <SideModal show={getInTouch} onClose={() => setGetInTouch(false)}>
        <div className="row m-0 myrow">
          <div className=" col-12">
            <RegisterFormTax />
          </div>
        </div>
      </SideModal>

      {/* <Footer /> */}
    </div>
  );
};
export default TaxPlanningStrategies;
