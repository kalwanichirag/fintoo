import styles from "./style.module.css";
import LeftSection from './LeftSection'
import RightSection from "./RightSection";
import { Link } from "react-router-dom";
const HeaderSection = () => {
  return (
    <section
      className={`${styles["header-section"]} ${styles["padding-class"]}`}
    >
      <div className={`${styles["header-section-background-overlay"]}`}></div>
      <div className={`${styles["header-section-container"]}`}>
        <div className={`${styles["header-section-content"]}`}>
          <LeftSection />
          <br />
          <Link to={`${process.env.PUBLIC_URL}/pricing?service=tax-planning`}>
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
