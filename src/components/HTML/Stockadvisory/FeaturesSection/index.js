import styles from "./style.module.css";
import commonStyles from "../../../Layout/Fullpage/style.module.css";
import SectionHeader from "../../../SectionHeader";
import { CiMonitor } from "react-icons/ci";
import { FaCreativeCommonsZero, FaRegMoneyBillAlt } from "react-icons/fa";
import { GiChart } from "react-icons/gi";
import { GrShield } from "react-icons/gr";
import { AiOutlineSelect, AiOutlineFileText, AiOutlinePrinter } from "react-icons/ai";

function FeaturesSection() {
  return (
    <>
      <section
        className={`${styles["features-section"]} ${commonStyles["padding-class"]}`}
      >
        <SectionHeader headerText={"Fintoo’s Investment Process"} />
        <br />
        <br />
        <div className={`${styles["features-4"]} `}>
          <div className={`${styles["feature-item"]} `}>
            <div className={`${styles["feature-item-icon"]}`}>
              <AiOutlineSelect />
            </div>
            <div className={`${styles["feature-item-heading"]}`}>
              <span>STOCK SELECTION</span>
            </div>
            <div className={`${styles["feature-item-content"]}`}>
              <p>
                ⦾ Mcap &gt; Rs 10,000 crore
                <br />
                ⦾ Fundamental Screeners used
                <br />
                ⦾ Qualitative factors considered
                <br />⦾ Final check based on technical analysis
              </p>
            </div>
          </div>
          <div className={`${styles["feature-item"]} `}>
            <div className={`${styles["feature-item-icon"]}`}>
              <AiOutlineFileText />
            </div>
            <div className={`${styles["feature-item-heading"]}`}>
              <span>CAPITAL ALLOCATION</span>
            </div>
            <div className={`${styles["feature-item-content"]}`}>
            <p>
                ⦾ Average size of portfolio is 15-25 stocks
                <br />
                ⦾ Weight per stock may range from 3-10%
                <br />
                ⦾ Sector allocation- A cap of 20% to a single sector
              </p>
            </div>
          </div>
          <div className={`${styles["feature-item"]} `}>
            <div className={`${styles["feature-item-icon"]}`}>
              <AiOutlinePrinter />
            </div>
            <div className={`${styles["feature-item-heading"]}`}>
              <span>RISK MANAGEMENT</span>
            </div>
            <div className={`${styles["feature-item-content"]}`}>
            <p>
                ⦾ Quality filters for stock selection
                <br />
                ⦾ Portfolio level stop-loss of 20%
                <br />
                ⦾ Hedging Strategies
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default FeaturesSection;
