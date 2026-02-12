import { Link } from "react-router-dom";
import styles from "./style.module.css";

function BondInvestmentHeaderSection() {
  return (
    <>
      <section className={`${styles["header-section"]} `}>
        <div className={`${styles["header-section-container"]}`}>
          <div className={`${styles["header-section-content"]}`}>
            <h2 className={`${styles["header-section-title"]}`}>
              Fixed Income Securities & Capital Preservation.
            </h2>
            {/* <h3 className={`${styles["section-sub-title"]}`}>
            Invest in the best of bonds offering comparatively lower volatility and highly predictable income at regular intervals.
            </h3> */}
            <br />
            <a href={process.env.REACT_APP_MODE == "live" ? `#` : `${process.env.PUBLIC_URL}/bonds/all`} style={process.env.REACT_APP_MODE == "live" ? { cursor: "default" } : { cursor: "pointer" }}>
              <button className={`${styles["header-section-content-btn"]} ${styles["animatedBouncInUp"]} ${styles["bounceInUp"]} ${process.env.REACT_APP_MODE == `live` ? 'disabled' : ''}`} >
                {process.env.REACT_APP_MODE == "live" ? "Coming Soon" : "Get Started"}
              </button>
            </a>
          </div>
          <div className={`${styles["header-section-image"]}`}>
            <div
              className={`${styles["header-section-image-container"]} ${styles["animated"]} ${styles["animatedFadeInUp"]} ${styles["fadeInUp"]}  `}
            >
              {/* /var/www/fintoo-frontend/public/static/media/wp/BondInvestment/bondInvestmentHeaderImg.png */}
              <img style={{ width: '100%' }} src={process.env.REACT_APP_STATIC_URL + 'media/wp/BondInvestment/bondInvestmentHeaderImg.png'} alt="" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default BondInvestmentHeaderSection;
