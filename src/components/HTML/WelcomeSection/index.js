import React from "react";
import styles from "./style.module.css";
import Slider from "react-slick";
import FinancialPlanning from "../FinancialPlan/HeaderSection";
import RetirementPlanning from "../RetirementPlanning/HeaderSection";
import InvestmentPlanning from "../InvestmentPlanning/HeaderSection";
import TaxPlanning from "../TaxPlanning/TaxPlanningHeaderSection";
import Riskmanagement from "../Insurance/HeaderSection/index";

const WelcomeSection = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplaySpeed: 3000,
    autoplay: false,
    fade: false,
    slidesToShow: 1,
    arrows: false,
    margin: 20,
    centerPadding: "20",
    dotsClass: "slick-dots categories-slick-dots dashboard-slick-dots",
  };

  return (
    <section className={`pb-5 ${styles.welcomeSection}`}>
      <div>
        <Slider {...settings}>
          <div>
            <FinancialPlanning />
          </div>
          <div>
            <RetirementPlanning />
          </div>
          <div>
            <InvestmentPlanning />
          </div>
          <div>
            <TaxPlanning />
          </div>
          <div>
            <Riskmanagement />
          </div>
        </Slider>
      </div>
    </section>
  );
};

export default WelcomeSection;
