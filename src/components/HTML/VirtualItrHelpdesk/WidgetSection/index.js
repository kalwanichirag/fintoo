import styles from "./style.module.css";
import commonStyles from "../../../Layout/Fullpage/style.module.css";
import SectionHeader from "../../../SectionHeader";
import Idea from "./images/idea.svg";
import Linechart from "./images/Linechart.svg";
import Hand from "./images/hand.png";
import Handshake from "./images/handshake.svg";
import Security from "./images/security.png";
import Zero from "./images/zero.png";
function WidgetSection() {
  return (
    <>
      <section
        className={`${styles["widget-section"]} ${commonStyles["padding-class"]} pb-5 pt-5`}
      >
        <SectionHeader className="text-center" headerText={"About Fintoo"} />
        <div className={`mt-5 ${styles["widget-section-container"]}`}>
          <div className={`${styles["widget-item"]}`}>
            <div className={`${styles["widget-icons"]}`}>
              <img src={Idea} />
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
                Bottoms-up Approach – Multi-cap & Sector agnostic portfolio. Concentrated bets of 15-25 stocks
              </div>
            </div>
            <div className={`${styles["widget-icons"]}`}>
              <img src={Handshake} />
            </div>
          </div>
        </div>
        <br />
        <br />
        <div className={`${styles["widget-section-container"]}`}>
          <div className={`${styles["widget-item"]}`}>
            <div className={`${styles["widget-icons"]}`}>
              <img src={
                process.env.REACT_APP_STATIC_URL + "media/DMF/security.png"
              } alt="" />
            </div>
            <div className={`${styles["widget-Content"]}`}>
              <h3 className={`${styles["widget-item-heading"]}`}>
                TYPE OF SECURITY & INVESTMENT HORIZON
              </h3>
              <div
                className={`${styles["widget-item-content"]} ${commonStyles["widget-content-text"]}`}
              >
                Up to 100% in Equity (cash portion may be deployed in liquid
                funds). <br />
                Horizon: 2-5 years
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
                ZERO COMMISSION INVESTMENT
              </h3>
              <div
                className={`${styles["widget-item-content"]} ${commonStyles["widget-content-text"]}`}
              >
                Ensures that we give you completely unbiased advice that only
                focuses on getting your the required returns without any kind of
                commission.
              </div>
            </div>
            <div className={`${styles["widget-icons"]}`}>
              <img src={Zero} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default WidgetSection;
