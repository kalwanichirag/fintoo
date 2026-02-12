import styles from "./style.module.css";
import LeftSection from './LeftSection'
import RightSection from "./RightSection";
import { Link, useLocation } from "react-router-dom";
const HeaderSection = () => {
  const location = useLocation();
  const isHomePage =
  location.pathname === "/" ||
  location.pathname === "/web" ||
  location.pathname === `${process.env.PUBLIC_URL}/web` ||
  location.pathname === `${process.env.PUBLIC_URL}/`;
  return (
    <section
      className={`header-section ${styles["header-section"]} ${styles["padding-class"]}`}
    >
      <div className={`${styles["header-section-background-overlay"]}`}></div>
      <div className={`${styles["header-section-container"]}`}>
        <div className={`${styles["header-section-content"]}`}>
          <LeftSection />
          <br />
          {
           isHomePage ? <>
              <Link className="text-decoration-none text-center" to={`${process.env.PUBLIC_URL}/retirement-planning-page#HowWeWorkSection`}>
                <button
                  className={`${styles["header-section-content-btn"]} ${styles["animatedBouncInUp"]} ${styles["bounceInUp"]}`}
                >
                  GET STARTED
                </button>
              </Link>
            </> : <a href="#book-appointment">
              <button
                className={`${styles["header-section-content-btn"]} ${styles["animatedBouncInUp"]} ${styles["bounceInUp"]}`}
              >
                GET STARTED
              </button>
            </a>
          }

        </div>
        <div className={`${styles["header-section-image"]}`}>

          <RightSection />
        </div>
      </div>
    </section>
  );
};
export default HeaderSection;
