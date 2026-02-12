import styles from "./style.module.css";
import SectionHeader from "../../../SectionHeader";
import One from "./images/number-one.svg";
import Two from "./images/number-2.svg";
import Three from "./images/number-3.svg";
import Four from "./images/Four.png";
const StepsInvestmentPlan = () => {
  return (
    <section className={`${styles.StepsInvestmentPlanSection}`}>
      <div className={`${styles.StepsInvestmentPlanHederText}`}>
        <SectionHeader
          className="text-center"
          headerText={"Equity Offerings"}
        />
      </div>
      <div className={`${styles.StepsInvestmentPlanBox}`}>
        <div className={`${styles.StepsInvestmentPlanCard}`}>
          <div className={`${styles.StepsInvestmentPlanCardImg}`}>
            <img src={One} />
          </div>
          <div className={`${styles.StepsInvestmentPlancontent}`}>
            <div className={`${styles.StepsInvestmentPlancontenttitle}`}>
              Private Equity
            </div>
            <div className={`${styles.StepsInvestmentPlanContentText}`}>
              Early identification of leaders in the emerging market. <br />
              Novel opportunities in high-growth companies. <br /> Association
              with dynamic and innovative entrepreneurs.
            </div>
          </div>
        </div>
        <div className={`${styles.StepsInvestmentPlanCard}`}>
          <div className={`${styles.StepsInvestmentPlancontent}`}>
            <div className={`${styles.StepsInvestmentPlancontenttitle}`}>
              Structured Product
            </div>
            <div className={`${styles.StepsInvestmentPlanContentText}`}>
              In-house research with tailored solutions. <br />
              Analysis based on qualitative and quantitative parameters. <br />
              Fintoo’s exclusively curated, research-based structured product
              solutions.
            </div>
          </div>
          <div className={`${styles.StepsInvestmentPlanCardImg}`}>
            <img src={Two} />
          </div>
        </div>
        <div className={`${styles.StepsInvestmentPlanCard}`}>
          <div className={`${styles.StepsInvestmentPlanCardImg}`}>
            <img src={Three} />
          </div>
          <div className={`${styles.StepsInvestmentPlancontent}`}>
            <div className={`${styles.StepsInvestmentPlancontenttitle}`}>
              Offshore Investments
            </div>
            <div className={`${styles.StepsInvestmentPlanContentText}`}>
              Access to various opportunities in diversified markets across the
              globe. <br />
              Provides hedge against exchange & economic risk. <br />
              Tax-efficient structured product solutions.
            </div>
          </div>
        </div>
        <div className={`${styles.StepsInvestmentPlanCard}`}>
          <div className={`${styles.StepsInvestmentPlancontent}`}>
            <div className={`${styles.StepsInvestmentPlancontenttitle}`}>
            Structured Product
            </div>
            <div className={`${styles.StepsInvestmentPlanContentText}`}>
            Direct Mutual Funds. <br />
Direct Portfolio Management Services. <br />
Direct equity-oriented Alternative Investments Funds (AIF).
            </div>
          </div>
          <div className={`${styles.StepsInvestmentPlanCardImg}`}>
            <img src={Four} />
          </div>
        </div>
      </div>
    </section>
  );
};
export default StepsInvestmentPlan;
