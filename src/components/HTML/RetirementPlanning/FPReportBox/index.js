import styles from "./style.module.css";
// import RetirementPlan from "./Images/retirement-1.svg";
// import RetirementPlan2 from "./Images/retirement-planning-2.svg";
// import PostRetirement from "./Images/post-retirement.svg";
function FPReportBox() {
  return (
    <div className={`${styles.FPReport}`}>
      <div className={`${styles.FPReportBox}`}>
        <div className={`${styles.FPReportImg}`}>
        <img  src={process.env.REACT_APP_STATIC_URL + 'media/wp/Rpplan/retirement-1.png'} alt="" />
        </div>
        <div className={`ms-md-5 ${styles.FPReportBoxContent}`}>
          <p className={`${styles.FPReportBoxContentTitle}`}>
            Requirements
          </p>
          <p className={`${styles.FPReportBoxContentText}`}>
            Keeping your requirements in mind we create a customized plan that
            solely aims to fulfil them and give you the kind of retirement life
            you wish to live.
          </p>
        </div>
      </div>
      <div className={`${styles.FPReportBox}`}>
        <div className={`${styles.FPReportBoxContent}`}>
          <p className={`${styles.FPReportBoxContentTitle}`}>
            Retirement Corpus
          </p>
          <p className={`${styles.FPReportBoxContentText}`}>
            Gives you a clear overview of your currently available retirement
            surplus and shortfall i.e. where have you reached and how long do
            you need to go to achieve your goal.
          </p>
        </div>
        <div className={`ms-md-5 ${styles.FPReportImg}`}>
        <img  src={process.env.REACT_APP_STATIC_URL + 'media/wp/Rpplan/retirement-planning-2.png'} alt="" />
        </div>
      </div>
      <div className={`${styles.FPReportBox}`}>
        <div className={`${styles.FPReportImg}`}>
        <img  src={process.env.REACT_APP_STATIC_URL + 'media/wp/Rpplan/post-retirement.png'} alt="" />
        </div>
        <div className={`ms-md-5 ${styles.FPReportBoxContent}`}>
          <p className={`${styles.FPReportBoxContentTitle}`}>
          Projected Post Retirement Cashflow
          </p>
          <p className={`${styles.FPReportBoxContentText}`}>
          Gives you a detailed and a year-on-year picture of the cashflow during your retired life.
          </p>
        </div>
      </div>
    </div>
  );
}

export default FPReportBox;
