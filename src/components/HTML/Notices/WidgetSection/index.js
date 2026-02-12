import styles from "./style.module.css";
import commonStyles from "../../../Layout/Fullpage/style.module.css";
import SectionHeader from "../../../SectionHeader";
import Idea from "./images/wall-clock.png";
import Linechart from "./images/Linechart.svg";
import Hand from "./images/bar-graph.png";
import Handshake from "./images/stopwatch.png";
import Zero from "./images/zero.png";
function WidgetSection() {
  return (
    <>
      <section
        className={`${styles["widget-section"]} ${commonStyles["padding-class"]} pb-5 pt-5`}
      >
        <SectionHeader className="text-center" headerText={"Why Choose Us"} />
        <div className={`mt-5 ${styles["widget-section-container"]}`}>
          <div className={`${styles["widget-item"]}`}>
            <div className={`${styles["widget-icons"]}`}>
              <img src={Idea} />
            </div>
            <div className={`${styles["widget-Content"]}`}>
              <div
                className={`${styles["widget-item-content"]} ${styles["widget-content-text"]}`}
              >
               15+ years of experience & expertise in handling income tax notices. 
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
        <div className={`${styles["widget-section-container"]}`}>
          <div className={`${styles["widget-item"]}`}>
            <div className={`${styles["widget-Content"]}`}>
              <div
                className={`${styles["widget-item-content"]} ${styles["widget-content-text"]}`}
              >
              Experienced team of CAs, Income Tax professionals and tax attorneys. 
              </div>
            </div>
            <div className={`${styles["widget-icons"]}`}>
              <img src={Linechart} />
            </div>
          </div>
        </div>
        <br />
        <br />
        <div className={`${styles["widget-section-container"]}`}>
          <div className={`${styles["widget-item"]}`}>
            <div className={`${styles["widget-icons"]}`}>
              <img src={Hand} />
            </div>
            <div className={`${styles["widget-Content"]}`}>
              <div
                className={`${styles["widget-item-content"]} ${styles["widget-content-text"]}`}
              >
                Organized process that eliminates the need for frequent visits. 
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
        <div className={`${styles["widget-section-container"]}`}>
          <div className={`${styles["widget-item"]}`}>
            <div className={`${styles["widget-Content"]}`}>
              <div
                className={`${styles["widget-item-content"]} ${styles["widget-content-text"]}`}
              >
              Swift, timely, transparent and Reliable Service. 
              </div>
            </div>
            <div className={`${styles["widget-icons"]}`}>
              <img src={Handshake} />
            </div>
          </div>
        </div>
        <br />
        <br />
       
      </section>
    </>
  );
}

export default WidgetSection;
