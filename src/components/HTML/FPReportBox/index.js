import styles from "./style.module.css";
// import Assumptions from "./Images/Assumptions.png";
// import FinancialGoalAdvice from "./Images/FinancialGoalAdvice.png";
// import FintooRecommends from "./Images/FintooRecommends.png";
// import Goal from "./Images/Goal.png";
// import RetirementPlanning from "./Images/RetirementPlanning.png";   
function FPReportBox() {
  return (
    <div className={`${styles.FPReport}`}>
      <div className={`${styles.FPReportBox}`}>
        <div className={`${styles.FPReportImg}`}>
          <img src={process.env.REACT_APP_STATIC_URL + 'media/wp/FPPlan/Assumptions.png'} alt="Assumptions" />
          {/* <img src={Assumptions} /> */}
        </div>
        <div className={`ms-md-5 ${styles.FPReportBoxContent}`}>
          <p className={`${styles.FPReportBoxContentTitle}`}>Assumptions</p>
          <p className={`${styles.FPReportBoxContentText}`}>
            Estimates future income, expenses, and returns based on inflation rates and past performance.
          </p>
        </div>
      </div>
      <div className={`${styles.FPReportBox}`}>
        <div className={`${styles.FPReportBoxContent}`}>
          <p className={`${styles.FPReportBoxContentTitle}`}>
            Net Worth Analysis
          </p>
          <p className={`${styles.FPReportBoxContentText}`}>
            Assists you in assessing your current net worth and comparing it to your ideal financial position.
          </p>
        </div>
        <div className={`ms-md-5 ${styles.FPReportImg}`}>
          <img src={process.env.REACT_APP_STATIC_URL + 'media/wp/FPPlan/FinancialGoalAdvice.png'} alt="" />
          {/* <img src={FinancialGoalAdvice} /> */}
        </div>
      </div>
      <div className={`${styles.FPReportBox}`}>
        <div className={`${styles.FPReportImg}`}>
          <img src={process.env.REACT_APP_STATIC_URL + 'media/wp/FPPlan/FintooRecommends.png'} alt="" />
          {/* <img src={FintooRecommends} /> */}
        </div>
        <div className={`ms-md-5 ${styles.FPReportBoxContent}`}>
          <p className={`${styles.FPReportBoxContentTitle}`}>
            Fintoo Recommends
          </p>
          <p className={`${styles.FPReportBoxContentText}`}>
            Recommends personalized strategies to close the gap between your current financial situation and your ideal goals.
          </p>
        </div>
      </div>
      <div className={`${styles.FPReportBox}`}>
        <div className={`${styles.FPReportBoxContent}`}>
          <p className={`${styles.FPReportBoxContentTitle}`}>Goal Analysis</p>
          <p className={`${styles.FPReportBoxContentText}`}>
            It helps you evaluate how your assets align with your financial goals and optimize them for better results.
          </p>
        </div>
        <div className={`ms-md-5 ${styles.FPReportImg}`}>
          <img src={process.env.REACT_APP_STATIC_URL + 'media/wp/FPPlan/Goal.png'} alt="" />
          {/* <img src={Goal} /> */}
        </div>
      </div>
      <div className={`${styles.FPReportBox}`}>
        <div className={`${styles.FPReportImg}`}>
          <img src={process.env.REACT_APP_STATIC_URL + 'media/wp/FPPlan/RetirementPlanning.png'} alt="" />
          {/* <img src={RetirementPlanning} /> */}
        </div>
        <div className={`ms-md-5 ${styles.FPReportBoxContent}`}>
          <p className={`${styles.FPReportBoxContentTitle}`}>
            Retirement Planning
          </p>
          <p className={`${styles.FPReportBoxContentText}`}>
            Ensures your retirement planning is integrated into your financial plan, securing your future alongside other goals.
          </p>
        </div>
      </div>
    </div>
  );
}

export default FPReportBox;
