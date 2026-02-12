import styles from "./style.module.css";
import { Link } from "react-router-dom";
import { BASE_API_URL } from "../../../../constants";

function DirectMFHeaderSection() {
  return (
    <>
      <section className={`${styles["header-section"]} `}>
        <div className={`mt-md-5 ${styles["header-section-container"]}`}>
          <div className={`${styles["header-section-content"]}`}>
            <h2 className={`${styles["header-section-title"]}`}>
              Optimized Portfolio Diversification for Risk Mitigation.
            </h2>
            {/* <h3 className={`${styles["section-sub-title"]}`}>
              Start Investing With No Commission Direct Mutual Funds, <br />
              Exclusively Personalised To Match Your Requirements, Risk Profile
              And Goals.
            </h3> */}
            <br />

            <a href={process.env.PUBLIC_URL + "/direct-mutual-fund/funds/all"}>
              <button
                className={`${styles["header-section-content-btn"]} ${styles["animatedBouncInUp"]} ${styles["bounceInUp"]}`}
              >
                EXPLORE
              </button>
            </a>
          </div>
          <div className={`${styles["header-section-image"]}`}>
            <div
              className={`${styles["header-section-image-container"]} ${styles["animated"]} ${styles["animatedFadeInUp"]} ${styles["fadeInUp"]}  `}
            >
              <img style={{ width: "100%" }} src={process.env.REACT_APP_STATIC_URL + 'media/wp/DirectMF-header-image.svg'} alt="" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default DirectMFHeaderSection;
