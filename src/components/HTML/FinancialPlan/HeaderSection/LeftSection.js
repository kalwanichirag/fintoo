import styles from "./style.module.css";
const LeftSection = (props) => {
  return (
    <>
      <p className={`${styles["section-title"]}`}>Introducing</p>
      <h3 className="header-section-bold-title" style={{color:'#042b62'}}>
        {/* Financial goal advice <br/> Contray to popular */}
        Al-Driven <span style={{color:'#DD7300'}}>Financial Planning</span>, Achieve Your Financial Goals.
      </h3>
      {/* <p className={`${styles.sectionsubText}`}>
        A robo advisory platform powered by Artificial Intelligence which
        understands your financial goals and maps them intelligently to your
        investments.
      </p> */}
    </>
  );
};
export default LeftSection;
