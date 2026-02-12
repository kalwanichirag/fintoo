import styles from "./style.module.css";
import LeftSection from './LeftSection'
import RightSection from "./RightSection";
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
          {/* <a href={`${process.env.PUBLIC_URL}/stocks`} ></a> */}
          <a href="#appointment-section">
            <button
              className={`${styles["header-section-content-btn"]} ${styles["animatedBouncInUp"]} ${styles["bounceInUp"]}`}
            >
              {/* Explore */}
              GET STARTED
            </button>
          </a>
        </div>
        <div className={`${styles["header-section-image"]}`}>
          
          <RightSection />
        </div>
      </div>
    </section>
  );
};
export default HeaderSection;
