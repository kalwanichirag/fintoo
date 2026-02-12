import styles from "./style.module.css";
import commonStyles from "../../../Layout/Fullpage/style.module.css";
import SectionHeader from "../../../SectionHeader";
import { FaCoins } from "react-icons/fa";
import { GiProgression } from "react-icons/gi";
import { TbUsers } from "react-icons/tb";
import { RiCalculatorLine } from "react-icons/ri";
import { Link } from "react-router-dom";

function NeedHelpSection() {
  return (
    <>
      <section
        className={`${styles["features-section"]} ${commonStyles["padding-class"]}`}
      >
        <SectionHeader headerText={"Other Expertise"} />
        <br />
        <br />
        <br />
        <div className={`${styles["features-4"]} `}>
          <Link
            style={{
              color: "#042b62",
            }}
            className="text-decoration-none"
            to={`${process.env.PUBLIC_URL}/financial-planning-page`}
          >
            <div className={`${styles["feature-item"]} `}>
              <div className={`${styles["feature-item-icon"]}`}>
                <FaCoins />
              </div>
              <div className={`${styles["feature-item-heading"]}`}>
                {" "}
                <span>Financial Planning</span>{" "}
              </div>
              <div className={`${styles["feature-item-content"]}`}>
                {" "}
                <span>
                  360 degrees wealth management for lifelong financial freedom.
                </span>{" "}
              </div>
            </div>
          </Link>
          <Link
            style={{
              color: "#042b62",
            }}
            className="text-decoration-none"
            to={`${process.env.PUBLIC_URL}/tax-planning-page`}
          >
            <div className={`${styles["feature-item"]} `}>
              <div className={`${styles["feature-item-icon"]}`}>
                <RiCalculatorLine />
              </div>
              <div className={`${styles["feature-item-heading"]}`}>
                {" "}
                <span>Tax Planning</span>{" "}
              </div>
              <div className={`${styles["feature-item-content"]}`}>
                {" "}
                <span>
                  Make the right investment for every financial goal.
                  <br/>
                  <br/>
                </span>{" "}
              </div>
            </div>
          </Link>
          <Link
            style={{
              color: "#042b62",
            }}
            className="text-decoration-none"
            to={`${process.env.PUBLIC_URL}/investment-planning-page`}
          >
            <div className={`${styles["feature-item"]} `}>
              <div className={`${styles["feature-item-icon"]}`}>
                <GiProgression />
              </div>
              <div className={`${styles["feature-item-heading"]}`}>
                {" "}
                <span>Investment Planning</span>{" "}
              </div>
              <div className={`${styles["feature-item-content"]}`}>
                {" "}
                <span>
                  Reduce your income tax to increase your savings and
                  investments.
                </span>{" "}
              </div>
            </div>
          </Link>
          <Link
            style={{
              color: "#042b62",
            }}
            className="text-decoration-none"
            to={`${process.env.PUBLIC_URL}/retirement-planning-page`}
          >
            <div className={`${styles["feature-item"]} `}>
              <div className={`${styles["feature-item-icon"]}`}>
                <TbUsers />
              </div>
              <div className={`${styles["feature-item-heading"]}`}>
                {" "}
                <span>Retirement Planning</span>{" "}
              </div>
              <div className={`${styles["feature-item-content"]}`}>
                {" "}
                <span>
                  The right way to live your retired life without anyone’s
                  support.
                </span>{" "}
              </div>
            </div>
          </Link>
        </div>
        <br />
        <br />
      </section>
    </>
  );
}

export default NeedHelpSection;
