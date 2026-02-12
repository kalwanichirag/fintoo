import styles from "./style.module.css";
import commonStyles from "../../../Layout/Fullpage/style.module.css";
import SectionHeader from "../../../SectionHeader";

function WhyChooseBondInvestmentSection() {
  return (
    <>
      <section
        className={`${styles["why-trust-us-section"]} ${commonStyles["padding-class"]}`}
      >
        <SectionHeader
          headerText={"Why Choose Fintoo For Your Bond Investments"}
        />
        <br />
        <br />
        <div className={`${styles["why-trust-us-section-items-container"]}`}>
          <div
            className={`${styles["why-trust-us-section-item"]} ${styles["flex-item-left"]}`}
          >
            <div className={`${styles["why-trust-us-section-item-icon"]}`}>
              <div style={{ width: "50px" }}>
                <img
                  style={{ width: "100%" }}
                  src={
                    process.env.REACT_APP_STATIC_URL +
                    "media/wp/BondInvestment/cardImg1.png"
                  }
                  alt=""
                />
              </div>
            </div>
            <div>
              <div className={`${styles["why-trust-us-section-item-heading"]}`}>
                Researched & Reliable Listings
              </div>
              <div className={`${styles["why-trust-us-section-item-content"]}`}>
                Choose from 1300+ the top-performing, premium-grade bonds
                ranging from AA to AAA ratings. Each bong enlisted at Fintoo is
                hand-picked only if it has the potential to give you a better
                value for your investment and generate higher returns in a
                limited time.{" "}
              </div>
            </div>
          </div>
          <div
            className={`${styles["why-trust-us-section-item"]} ${styles["flex-item-right"]}`}
          >
            <div>
              <div className={`${styles["why-trust-us-section-item-heading"]}`}>
                Latest Updates & Insights
              </div>
              <div className={`${styles["why-trust-us-section-item-content"]}`}>
                Take complete advantage of our advanced analytical tools that to
                compare the several bonds of your choice and get the minutest
                insight to decide the ones that will be able to help you achieve
                your financial goals.
              </div>
            </div>
            <div className={`${styles["why-trust-us-section-item-icon"]}`}>
              <div style={{ width: "50px" }}>
                <img
                  style={{ width: "100%" }}
                  src={
                    process.env.REACT_APP_STATIC_URL +
                    "media/wp/BondInvestment/cardImg2.png"
                  }
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
      </section>
    </>
  );
}

export default WhyChooseBondInvestmentSection;
