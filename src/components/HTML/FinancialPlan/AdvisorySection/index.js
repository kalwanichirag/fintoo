import styles from "./style.module.css";
import { CiDesktop } from "react-icons/ci";
import { FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";
const AdvisorycardSection = () => {
  return (
    <section className={`${styles.AdvisorycardSection}`}>
      <div className={`${styles["AdvisorycardSection-section-container"]}`}>
        <div className={`${styles.Advisorycard}`}>
          <div>
            <div className={`${styles.CardIcon}`}>
              <CiDesktop />{" "}
            </div>
            <p className={`${styles.CardTitle}`}>Automated Advisory</p>
            <p className={`${styles.CardPara}`}>
              Fintoo’s AI-Powered Financial Advisory analyzes your unique financial situation and delivers a tailored plan to help you achieve your goals.
            </p>
          </div>
          <div className={` ${styles.btnStart}`}>
            <Link to={`${process.env.PUBLIC_URL}/pricing/`}>
              <button className={`ms-3  ${styles.AdvisorycardBtn}`}>
                Start
              </button>
            </Link>
          </div>
        </div>
        <div className={` ms-md-4 mt-5 mt-md-0 ${styles.Advisorycard}`}>
          <div className={`${styles.CardIcon}`}>
            <FiUsers />{" "}
          </div>
          <p className={`${styles.CardTitle}`}>Expert Advisory</p>
          <p className={`${styles.CardPara}`}>
            Fintoo’s Expert Advisory combines advanced Artificial Intelligence with insights from India’s top financial advisors, creating a personalized strategy to suit your financial needs.
          </p>
          <div className={` ${styles.btnStart}`}>
            <Link to={`${process.env.PUBLIC_URL}/expert/`}>
              <button className={`ms-3  ${styles.AdvisorycardBtn}`}>
                Start
              </button>
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
};
export default AdvisorycardSection;
