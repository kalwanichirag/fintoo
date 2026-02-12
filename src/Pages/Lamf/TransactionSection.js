import styles from "./style.module.css";

import { getPublicMediaURL } from "../../common_utilities";

const FeatureCard = (props) => {
  return (
    <div className={`${styles["shadow-border"]} container`}>
      <div className="row">
        <div className="col-6">{props.first}</div>
        <div className="col-4">{props.second}</div>
        <div className="col-2">{props.third}</div>
      </div>
    </div>
  );
};

const SectionTile = (props) => {
  return (
    <div className={`col ${styles["feature-item"]} `}>
      <div className={`text-center ${styles["feature-item-box"]} `}>
        <div className={`${styles["feature-item-heading"]}`}>{props.title}</div>
        <div className={`${styles["feature-item-content"]}`}>
          {" "}
          <span>{props.subtitle}</span>{" "}
        </div>
      </div>
    </div>
  );
};
const TransactionSection = () => {
  return (
    <>
      <section className={`py-5`}>
        <div className="container">
          <div className={`${styles["transaction-box"]}`}>
            <h3 className={styles["section-title"]}>Transactions</h3>
            <div className="row">
              <div className="col">
                <div
                  className={`${styles["upcomming-transactions"]} text-center`}
                >
                  <p className={styles["ut-container-heading"]}>
                    Upcoming transaction
                  </p>
                  <div className={styles["ut-inner-container"]}>
                    <div className={styles["empty-header"]}></div>
                    <div className={styles["ut-inner-content"]}>
                      <div className="">
                        <div className="mb-4">
                          <img
                            src={getPublicMediaURL(
                              "/static/media/Lamf/Group-1321314648.png"
                            )}
                            width={80}
                            height={80}
                          />
                        </div>
                        <p className={`${styles["interest-text"]} m-0 my-3`}>
                          Interest Payment
                        </p>
                        <div className="mb-4">
                          <p
                            className={`m-auto d-inline ${styles["green-text-1"]}`}
                          >
                            Auto Debit
                          </p>
                        </div>
                      </div>
                      <div className="d-flex my-3">
                        <div className={`${styles["right-border-text"]} w-50`}>
                          <img
                            width={25}
                            height={25}
                            src={getPublicMediaURL(
                              "/static/media/Lamf/calendar-icon.png"
                            )}
                          />
                          <p
                            className={`${styles["text-inner-content-1"]} mt-2`}
                          >
                            07-Aug-2024
                          </p>
                        </div>
                        <div className="w-50">
                          <img
                            width={25}
                            height={25}
                            src={getPublicMediaURL(
                              "/static/media/Lamf/amount-icon.png"
                            )}
                          />
                          <p
                            className={`${styles["text-inner-content-1"]} mt-2`}
                          >
                            ₹4600
                          </p>
                        </div>
                      </div>
                      <div
                        className={`${styles["text-inner-content-1"]} ${styles["text-inner-fake-border"]} mt-2 my-3`}
                      >
                        <p className="m-0">From HDFC Bank</p>
                        <p className="m-0">****1234</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className={styles["transaction-list"]}>
                  <p className={styles["rt-heading"]}>Recent Transactions</p>
                  <FeatureCard
                    first={
                      <div className="d-flex align-items-center">
                        <img
                          src={getPublicMediaURL(
                            "/static/media/Lamf/Group-1321314630.png"
                          )}
                          width={"40px"}
                          height={"40px"}
                        />
                        <p className={`ps-3 ${styles["table-content"]}`}>
                          Interest Payment
                        </p>
                      </div>
                    }
                    second={
                      <p className={`${styles["table-content"]}`}>
                        07-Aug-2024
                      </p>
                    }
                    third={<p className={`${styles["table-content"]}`}>₹890</p>}
                  />
                  <FeatureCard
                    first={
                      <div className="d-flex align-items-center">
                        <img
                          src={getPublicMediaURL(
                            "/static/media/Lamf/Group-1321314630.png"
                          )}
                          width={"40px"}
                          height={"40px"}
                        />
                        <p className={`ps-3 ${styles["table-content"]}`}>
                          Interest Payment
                        </p>
                      </div>
                    }
                    second={
                      <p className={`${styles["table-content"]}`}>
                        07-Aug-2024
                      </p>
                    }
                    third={<p className={`${styles["table-content"]}`}>₹890</p>}
                  />
                  <FeatureCard
                    first={
                      <div className="d-flex align-items-center">
                        <img
                          src={getPublicMediaURL(
                            "/static/media/Lamf/Group-1321314630.png"
                          )}
                          width={"40px"}
                          height={"40px"}
                        />
                        <p className={`ps-3 ${styles["table-content"]}`}>
                          Interest Payment
                        </p>
                      </div>
                    }
                    second={
                      <p className={`${styles["table-content"]}`}>
                        07-Aug-2024
                      </p>
                    }
                    third={<p className={`${styles["table-content"]}`}>₹890</p>}
                  />
                  <FeatureCard
                    first={
                      <div className="d-flex align-items-center">
                        <img
                          src={getPublicMediaURL(
                            "/static/media/Lamf/Group-1321314630.png"
                          )}
                          width={"40px"}
                          height={"40px"}
                        />
                        <p className={`ps-3 ${styles["table-content"]}`}>
                          Interest Payment
                        </p>
                      </div>
                    }
                    second={
                      <p className={`${styles["table-content"]}`}>
                        07-Aug-2024
                      </p>
                    }
                    third={<p className={`${styles["table-content"]}`}>₹890</p>}
                  />
                  <p className="text-center pt-3 "><a href="" className={styles["rt-viewall-link"]}>View All Transaction</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`py-5`}>
        <div className="container">
          <div className="text-center">
            <span className={`${styles["section-title"]}`}>
            Benefits
            </span>
          </div>
          <br />
          <br />
          <div className={`row {styles["features-4"]} `}>
            <SectionTile
              
              title={"Low Interest Rate"}
              subtitle={"Interest rates as low as 10.75%"}
            />
            <SectionTile
              
              title={"Stay Invested"}
              subtitle={"Your mutual funds continue to earn returns"}
            />
            <SectionTile
              
              title={"Flexi Cash"}
              subtitle={"Withdraw & pre-pay anytime without charges"}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default TransactionSection;
