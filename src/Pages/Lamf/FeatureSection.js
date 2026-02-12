import styles from "./style.module.css";

import { getPublicMediaURL } from "../../common_utilities";

const SectionTile = (props) => {
  return (
    <div className={`col ${styles["feature-item"]} `}>
      <div className={`text-center ${styles["feature-item-box"]} `}>
        <div className={`${styles["feature-item-icon"]}`}>
          <img src={props.image} />
        </div>
        <div className={`${styles["feature-item-heading"]}`}>{props.title}</div>
        <div className={`${styles["feature-item-content"]}`}>
          {" "}
          <span>{props.subtitle}</span>{" "}
        </div>
      </div>
    </div>
  );
};
const TableCard = (props) => {
  return (
    <div
      className={`${styles["card-fake-padding"]} ${
        props?.selected == true && styles["feature-item-dark"]
      }`}
    >
      <h4 className={`${styles["card-title"]}`}>{props.title}</h4>
      <p className={`${styles["card-extra-title"]}`}>{props.interestText}</p>
      <div className="d-flex align-items-center">
        <p className={`${styles["card-range-text"]}`}>{props.interest}</p>
        <p className={`${styles["card-range-side-text"]}`}>{props.shortLine}</p>
      </div>
    </div>
  );
};

const FeatureCard = (props) => {
  return (
    <div
      className={`${styles["shadow-border"]} ${
        props.mode == "dark" && styles["dark-table-card"]
      } row`}
    >
      <div className="col-4">{props.first}</div>
      <div className="col-3">{props.second}</div>
      <div className="col-5">{props.third}</div>
    </div>
  );
};
const FeatureSection = () => {
  return (
    <>
      <section className={`py-5`}>
        <div className="container">
          <div className="text-center">
            <span className={`${styles["section-title"]}`}>
              Why choose loans against mutual funds?
            </span>
          </div>
          <br />
          <br />
          <div className={`row {styles["features-4"]} `}>
            <SectionTile
              image={getPublicMediaURL(
                "/static/media/Lamf/low-interest-rate-low-interest.png"
              )}
              title={"Low Interest Rate"}
              subtitle={"Interest rates as low as 10.75%"}
            />
            <SectionTile
              image={getPublicMediaURL(
                "/static/media/Lamf/lamf-stay-invested.png"
              )}
              title={"Stay Invested"}
              subtitle={"Your mutual funds continue to earn returns"}
            />
            <SectionTile
              image={getPublicMediaURL(
                "/static/media/Lamf/lamf-flexi-cash.png"
              )}
              title={"Flexi Cash"}
              subtitle={"Withdraw & pre-pay anytime without charges"}
            />
          </div>
        </div>
      </section>
      <section className={`py-5 ${styles["why-lamf-section"]}`}>
        <div className="container">
          <h3 className={styles["section-title"]}>
            Competitive Interest Rates
          </h3>

          <div className={styles["table-section"]}>
            <div className="row">
              <div className="col-4">
                <p className={`${styles["table-head"]}`}>Loan Type</p>
              </div>
              <div className="col-3">
                <p className={`${styles["table-head"]}`}>Interest Rate</p>
              </div>
              <div className="col-5">
                <p className={`${styles["table-head"]}`}>Key Benefit</p>
              </div>
            </div>
            <FeatureCard
              first={
                <div className="d-flex align-items-center ps-2">
                  <img
                    src={getPublicMediaURL(
                      "/static/media/Lamf/Group-1321314630.png"
                    )}
                    width={"50px"}
                    height={"50px"}
                  />
                  <p className={`ps-3 ${styles["table-content"]}`}>
                    Credit Card
                  </p>
                </div>
              }
              second={<p className={`${styles["table-content"]}`}>24-36%</p>}
              third={
                <p className={`${styles["table-content"]}`}>
                  Unsecuredloan for personal use
                </p>
              }
            />
            <FeatureCard
              first={
                <div className="d-flex align-items-center ps-2">
                  <img
                    src={getPublicMediaURL(
                      "/static/media/Lamf/Group-1321314630.png"
                    )}
                    width={"50px"}
                    height={"50px"}
                  />
                  <p className={`ps-3 ${styles["table-content"]}`}>Auto Loan</p>
                </div>
              }
              second={<p className={`${styles["table-content"]}`}>9-13%</p>}
              third={
                <p className={`${styles["table-content"]}`}>
                  Competitive rates for vechile purchases
                </p>
              }
            />
            <FeatureCard
              first={
                <div className="d-flex align-items-center ps-2">
                  <img
                    src={getPublicMediaURL(
                      "/static/media/Lamf/Group-1321314630.png"
                    )}
                    width={"50px"}
                    height={"50px"}
                  />
                  <p className={`ps-3 ${styles["table-content"]}`}>
                    Consumer Loan
                  </p>
                </div>
              }
              second={<p className={`${styles["table-content"]}`}>11-19%</p>}
              third={
                <p className={`${styles["table-content"]}`}>
                  Finanacing for appliances and gadgets
                </p>
              }
            />
            <FeatureCard
              first={
                <div className="d-flex align-items-center ps-2">
                  <img
                    src={getPublicMediaURL(
                      "/static/media/Lamf/Group-1321314630.png"
                    )}
                    width={"50px"}
                    height={"50px"}
                  />
                  <p className={`ps-3 ${styles["table-content"]}`}>
                    Loan Against Mutual Funds
                  </p>
                </div>
              }
              second={<p className={`${styles["table-content"]}`}>10.75%</p>}
              third={
                <div className="d-flex align-items-center justify-content-between">
                  <p className={`${styles["table-content"]}`}>
                    Better rates then Personal Loans
                  </p>
                  <a href="#" className={styles["lamf-apply-now"]}>
                    Apply Now
                  </a>
                </div>
              }
              mode={"dark"}
            />
            <div className={`${styles["table-last-note"]} row`}>
              <div className="col-12">
                <p className={"m-0"}>
                  Get cash @10.75% pa - Direct to your bank Account
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FeatureSection;
