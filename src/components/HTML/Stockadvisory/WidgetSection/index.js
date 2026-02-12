import styles from "./style.module.css";
import commonStyles from "../../../Layout/Fullpage/style.module.css";
import SectionHeader from "../../../SectionHeader";
function WidgetSection() {
  return (
    <>
      <section
        className={`${styles["widget-section"]} ${commonStyles["padding-class"]} pb-5 pt-5`}
      >
        <SectionHeader
          className="text-center"
          Sty
          headerText={"Our Philosophy"}
        />
        <div className={`mt-5 ${styles["widget-section-container"]}`}>
          <div className={`${styles["widget-item"]}`}>
            <div className={`${styles["widget-icons"]}`}>
              <img
                alt=""
                src={
                  process.env.REACT_APP_STATIC_URL +
                  "media/wp/Stocks/idea.svg"
                }
              />
            </div>
            <div className={`${styles["widget-Content"]}`}>
              <h3 className={`${styles["widget-item-heading"]}`}>
                INVESTMENT PHILOSOPHY
              </h3>
              <div
                className={`${styles["widget-item-content"]} ${commonStyles["widget-content-text"]}`}
              >
                To make wealth creation simple and accessible along with
                building trust and transparency. We believe in dynamic
                monitoring of portfolio whilst avoiding Quarter on Quarter
                focus.
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
        <div className={`${styles["widget-section-container"]}`}>
          <div className={`${styles["widget-item"]}`}>
            <div className={`${styles["widget-Content"]}`}>
              <h3 className={`text-right ${styles["widget-item-heading"]}`}>
                INVESTMENT STRATEGY
              </h3>
              <div
                className={`${styles["widget-item-content"]} ${commonStyles["widget-content-text"]}`}
              >
                To generate long term returns by investing in high-quality
                companies using our well-established research proprietary
                process, comprising of sound investment tenets.
              </div>
            </div>
            <div className={`${styles["widget-icons"]}`}>
              <img
                alt=""
                src={
                  process.env.REACT_APP_STATIC_URL +
                  "media/wp/Stocks/Linechart.svg"
                }
              />
            </div>
          </div>
        </div>
        <br />
        <br />
        <div className={`${styles["widget-section-container"]}`}>
          <div className={`${styles["widget-item"]}`}>
            <div className={`${styles["widget-icons"]}`}>
              <img
                alt=""
                src={
                  process.env.REACT_APP_STATIC_URL +
                  "media/wp/Stocks/hand.png"
                }
              />
            </div>
            <div className={`${styles["widget-Content"]}`}>
              <h3 className={`${styles["widget-item-heading"]}`}>
                SHORTS & HEDGES
              </h3>
              <div
                className={`${styles["widget-item-content"]} ${commonStyles["widget-content-text"]}`}
              >
                Provides downside protection in falling markets and generates
                additional alpha.
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
        <div className={`${styles["widget-section-container"]}`}>
          <div className={`${styles["widget-item"]}`}>
            <div className={`${styles["widget-Content"]}`}>
              <h3 className={`text-right ${styles["widget-item-heading"]}`}>
                PORTFOLIO CONSTRUCT
              </h3>
              <div
                className={`${styles["widget-item-content"]} ${commonStyles["widget-content-text"]}`}
              >
                Bottoms-up Approach – Multi-cap & Sector agnostic portfolio.
                Concentrated bets of 15-25 stocks
              </div>
            </div>
            <div className={`${styles["widget-icons"]}`}>
              <img
                alt=""
                src={
                  process.env.REACT_APP_STATIC_URL +
                  "media/wp/Stocks/handshake.svg"
                }
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default WidgetSection;
