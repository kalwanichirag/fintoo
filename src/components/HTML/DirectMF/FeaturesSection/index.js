import styles from "./style.module.css";
import commonStyles from "../../../Layout/Fullpage/style.module.css";
import SectionHeader from "../../../SectionHeader";
import { CiMonitor } from "react-icons/ci";
import { FaCreativeCommonsZero, FaRegMoneyBillAlt } from "react-icons/fa";
import { GiChart } from "react-icons/gi";
import { GrShield } from "react-icons/gr";
import { AiOutlinePieChart, AiOutlineSelect } from "react-icons/ai";

function FeaturesSection() {
  return (
    <>
      <section
        className={`${styles["features-section"]} ${commonStyles["padding-class"]}`}
      >
        <SectionHeader headerText={"Features"} />
        <br />
        <br />
        <div className={`${styles["features-4"]} `}>
          <div className={`${styles["feature-item"]} `}>
            <div className={`${styles["feature-item-icon"]}`}>
              <CiMonitor />
            </div>
            <div className={`${styles["feature-item-heading"]}`}>
              {" "}
              <span>Research You Can Rely On</span>{" "}
            </div>
            <div className={`${styles["feature-item-content"]}`}>
              {" "}
              <span>
                Get access to innovative AI-Based investment guidance tools that
                give you in-depth insights, live data and live portfolio
                tracking to leave the guesswork out and help you make a wise
                investment decision.
              </span>{" "}
            </div>
          </div>
          <div className={`${styles["feature-item"]} `}>
            <div className={`${styles["feature-item-icon"]}`}>
              <FaRegMoneyBillAlt />
            </div>
            <div className={`${styles["feature-item-heading"]}`}>
              {" "}
              <span>Invest In The Best</span>{" "}
            </div>
            <div className={`${styles["feature-item-content"]}`}>
              {" "}
              <span>
                Choose from the top-performing mutual funds verified by
                recognized and reliable institutions like Morningstar and
                CRISIL.
              </span>{" "}
            </div>
          </div>
          <div className={`${styles["feature-item"]} `}>
            <div className={`${styles["feature-item-icon"]}`}>
              <FaCreativeCommonsZero />
            </div>
            <div className={`${styles["feature-item-heading"]}`}>
              {" "}
              <span>Invest At Zero Commission</span>{" "}
            </div>
            <div className={`${styles["feature-item-content"]}`}>
              {" "}
              <span>
                The direct mutual fund service enables you to invest in 2500+
                mutual funds across all the sectors at absolutely 0% commission.
              </span>{" "}
            </div>
          </div>
          <div className={`${styles["feature-item"]} `}>
            <div className={`${styles["feature-item-icon"]}`}>
              <GiChart />
            </div>
            <div className={`${styles["feature-item-heading"]}`}>
              {" "}
              <span>Portfolio Analysis Report</span>{" "}
            </div>
            <div className={`${styles["feature-item-content"]}`}>
              {" "}
              <span>
                A reliable report that gives you complete clarity about the
                current performance of your portfolio along with its expected
                future performance.
              </span>{" "}
            </div>
          </div>
        </div>
        <br />
        <br />
        <div className={`${styles["features-3"]} `}>
          <div className={`${styles["feature-item"]} `}>
            <div className={`${styles["feature-item-icon"]}`}>
              <GrShield />
            </div>
            <div className={`${styles["feature-item-heading"]}`}>
              {" "}
              <span>Goal-Based Portfolio</span>{" "}
            </div>
            <div className={`${styles["feature-item-content"]}`}>
              {" "}
              <span>
                A customised combination of different funds curated to achieve
                your specific goals within the expected tenure.
              </span>{" "}
            </div>
          </div>
          <div className={`${styles["feature-item"]} `}>
            <div className={`${styles["feature-item-icon"]}`}>
              <AiOutlinePieChart />
            </div>
            <div className={`${styles["feature-item-heading"]}`}>
              {" "}
              <span>Rebalancing and Restructuring</span>{" "}
            </div>
            <div className={`${styles["feature-item-content"]}`}>
              {" "}
              <span>
                Constantly monitoring the performance of your investments and
                whenever required, making the necessary changes to ensure
                optimum performance.
              </span>{" "}
            </div>
          </div>
          <div className={`${styles["feature-item"]} `}>
            <div className={`${styles["feature-item-icon"]}`}>
              <AiOutlineSelect />
            </div>
            <div className={`${styles["feature-item-heading"]}`}>
              {" "}
              <span>Choose The One That Meets Your Needs</span>{" "}
            </div>
            <div className={`${styles["feature-item-content"]}`}>
              {" "}
              <span>
                From debt mutual funds, equity mutual funds, balanced funds,
                hybrid funds or more, choose the kind of mutual funds that match
                your requirements to achieve your financial goals.
              </span>{" "}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default FeaturesSection;
