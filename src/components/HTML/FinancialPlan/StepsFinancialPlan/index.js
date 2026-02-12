import styles from "./style.module.css";
import SectionHeader from "../../../SectionHeader";
const StepsFinancialPlan = () => {
  return (
    <section className={`${styles.StepsInvestmentPlanSection}`}>
      <div className={`${styles.StepsInvestmentPlanHederText}`}>
        <SectionHeader
          className="text-center"
          headerText={"Steps For Financial Planning"}
        />
      </div>
      <div className={`${styles.StepsInvestmentPlanBox}`}>
        <div className={`${styles.StepsInvestmentPlanCard}`}>
          <div className={`${styles.StepsInvestmentPlanCardImg}`}>
            <img src={process.env.REACT_APP_STATIC_URL + 'media/wp/FPPlan/number-one.svg'} alt="Financial DNA" />
            {/* <img src={One} /> */}
          </div>
          <div className={`${styles.StepsInvestmentPlancontent}`}>
            <div className={`${styles.StepsInvestmentPlancontenttitle}`}>
              Discover Your Financial DNA: Understanding You and Your Goals
            </div>
            <div className={`${styles.StepsInvestmentPlanContentText}`}>
              Our financial planning starts by understanding your unique needs and goals. Through expert Financial Advisors, we create a tailored strategy that aligns with your financial aspirations, ensuring a strong foundation for success.
            </div>
          </div>
        </div>
        <div className={`${styles.StepsInvestmentPlanCard}`}>
          <div className={`${styles.StepsInvestmentPlancontent}`}>
            <div className={`${styles.StepsInvestmentPlancontenttitle}`}>
            AI-Powered Investment Insights: The Smart Way to Grow Your Wealth
            </div>
            <div className={`${styles.StepsInvestmentPlanContentText}`}>
            With AI-driven insights, our financial advisory identifies the best investment avenues to meet your goals. We offer comprehensive financial planning for a holistic wealth management approach, including retirement and tax strategies.

            </div>
          </div>
          <div className={`${styles.StepsInvestmentPlanCardImg}`}>
            <img src={process.env.REACT_APP_STATIC_URL + 'media/wp/FPPlan/number-2.svg'} alt="AI-Powered Investment" />
            {/* <img src={Two} /> */}
          </div>
        </div>
        <div className={`${styles.StepsInvestmentPlanCard}`}>
          <div className={`${styles.StepsInvestmentPlanCardImg}`}>
            <img src={process.env.REACT_APP_STATIC_URL + 'media/wp/FPPlan/number-3.svg'} alt="From Strategy to Success" />
            {/* <img src={Three} /> */}
          </div>
          <div className={`${styles.StepsInvestmentPlancontent}`}>
            <div className={`${styles.StepsInvestmentPlancontenttitle}`}>
            From Strategy to Success: Taking Action to Achieve Your Goals
            </div>
            <div className={`${styles.StepsInvestmentPlanContentText}`}>
            Our financial Advisor team guides you through executing your financial plan. We actively manage your portfolio, ensuring your financial planning stays on track to achieve your goals with regular performance reviews and adjustments.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default StepsFinancialPlan;
