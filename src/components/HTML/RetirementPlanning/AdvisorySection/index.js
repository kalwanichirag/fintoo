import styles from "./style.module.css";
import Stcok from "./images/stocks.png";
import { CiDesktop } from "react-icons/ci";
import { FiUsers } from "react-icons/fi";
const AdvisorycardSection = () => {
  return (
    <section className={`${styles.AdvisorycardSection}`}>
      <div className={`${styles["AdvisorycardSection-section-container"]}`}>
        <div className={`${styles.Advisorycard}`}>
          <p className={`${styles.CardIcon}`}><CiDesktop /> </p>
          <p className={`${styles.CardTitle}`}>Automated advisory</p>
          <p className={`${styles.CardPara}`}>
            Fintoo's Automated Financial Advisory option uses cutting-edge
            Artificial Intelligence to assess your financial situation and
            provides a customised financial planning solution is best suited for
            you.
          </p>
          <div>
          <a href="https://www.fintoo.in//userflow/dashboard-summary/">
            <button className={`ms-3 mt-4 ${styles.AdvisorycardBtn}`}>Start</button></a>
          </div>
        </div>
        <div className={` ms-md-4 mt-5 mt-md-0 ${styles.Advisorycard}`}>
        <p className={`${styles.CardIcon}`}><FiUsers /> </p>
        <p className={`${styles.CardTitle}`}>Expert Advisory</p>
        <p className={`${styles.CardPara}`}>
            Fintoo's Expert Advisory option combines cutting-edge Artificial
            Intelligence with inputs from the extremely experienced and the best
            financial advisors in India. The two come together to assess your
            financial situation and provide recommendations that are best suited
            for you.
          </p>
          <div >
          <a href={process.env.REACT_APP_PYTHON_URL + "/expert/"}>
            <button className={`ms-3 ${styles.AdvisorycardBtn}`}>Start</button></a>
          </div>
        </div>
      </div>
    </section>
  );
};
export default AdvisorycardSection;
