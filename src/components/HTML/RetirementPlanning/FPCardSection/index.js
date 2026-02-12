import styles from "./style.module.css";
import Stcok from "./images/stocks.png";
import { FaBeer, FaDownload } from 'react-icons/fa';
const FPCardSection = () => {
  return (
    <section className={`${styles.FPCard}`}>
      <div className={`${styles["FPCard-section-container"]}`}>
        <div className={`${styles.FpCardImg}`}>
          <img src={Stcok} />
        </div>
        <div className={`${styles.FPRightbox}`}>
          <p className={`${styles.FPtitle}`}>
            A Perfect Financial Plan Can Help You Create A Perfect Path To Reach
            Your Financial Goals.
          </p>
          <p className={`${styles.FPSubtext}`}>FIND THE PERFECT PATH TO REACH YOUR DESIRED FINANCIAL POSITION.</p>
          <div className="text-center mt-5">
            <button className={`${styles.FPbtn}`}>Sample Report <span><FaDownload /> </span> </button>
          </div>
        </div>
      </div>
    </section>
  );
};
export default FPCardSection;
