import styles from "./style.module.css";
import { Link, useLocation } from "react-router-dom";
function HeaderSection() {
  const location = useLocation();
  const isHomePage =
    location.pathname === "/" ||
    location.pathname === "/web" ||
    location.pathname === `${process.env.PUBLIC_URL}/web` ||
    location.pathname === `${process.env.PUBLIC_URL}/`;
  return (
    <>
      <section className={`header-section ${styles["header-section"]} `}>
        <div className={`${styles["header-section-background-overlay"]}`}></div>
        <div className={`${styles["header-section-container"]}`}>
          <div className={`${styles["header-section-content"]}`}>
            <h2 className={styles["header-section-title"]}>
              Expect the Unexpected, <br />
              Protect What’s Yours!
            </h2>
            {/* <h3 className={`${styles["section-sub-title"]}`}>
              Give yourself and all your loved one’s a financially secured and
              stress-free future.
            </h3> */}
            <br />

            {
              isHomePage ? <>
                <Link className="text-decoration-none text-center" to={`${process.env.PUBLIC_URL}/risk-management#WhyInsuranceSection`}>
                  <button
                    className={`${styles["header-section-content-btn"]} ${styles["animatedBouncInUp"]} ${styles["bounceInUp"]}`}
                  >
                    GET STARTED
                  </button>
                </Link>
              </> :
                <a href="#book-appointment">
                  <button
                    className={`${styles["header-section-content-btn"]} ${styles["animatedBouncInUp"]} ${styles["bounceInUp"]}`}
                  >
                    GET STARTED
                  </button>
                </a>
            }


          </div>
          <div className={`${styles["header-section-image"]}`}>
            <div
              className={`${styles["header-section-image-container"]} ${styles["animated"]} ${styles["animatedFadeInUp"]} ${styles["fadeInUp"]}  `}
            >
              <img
                src={
                  process.env.REACT_APP_STATIC_URL +
                  "media/wp/insurance-1.png"
                }
                alt="Insurance planning"
            
                fetchPriority="high"
                loading="eager"
                decoding="async"
               
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HeaderSection;
