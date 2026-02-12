import { Link, useLocation } from "react-router-dom";
import styles from "./style.module.css";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";

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
          <Link
            className="text-decoration-none text-center"
            to={
              isHomePage
                ? `${process.env.PUBLIC_URL}/financial-planning-page#FPCardSection`
                : `${process.env.PUBLIC_URL}/pricing/`
            }
          >
            <button
              className={`${styles["header-section-content-btn"]} ${styles["animatedBouncInUp"]} ${styles["bounceInUp"]}`}
            >
              GET STARTED
            </button>
          </Link>
        </div>
        <div className={`${styles["header-section-image"]}`}>
          <RightSection />
        </div>
      </div>
    </section>
  );
};

export default HeaderSection;
