import styles from "./style.module.css";
import { VscCircleFilled } from "react-icons/vsc";
const AssistedUAESection = () => {
  return (
    <>
      <div className={`${styles.BgColor}`}>
        <section className={`${styles.GraphBox}`}>
          <div className={`container ${styles.container}`}>
            <div className={`${styles.ExpertBox}`}>
              <div className="row">
                <div className="col-md-6 col-12">
                  <h2>
                    Expert Advice For <br /> Extra Performance
                  </h2>
                  <div>
                    <p>
                      Boost your annual returns with the help of Fintoo’s
                      Premium Wealth Management Service.
                    </p>
                  </div>
                  <div className={`${styles.BookBtn}`}>
                    <a href="#GETREPORTS">
                      <button>Book free 30 mins call</button>
                    </a>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className={`${styles.imgHeading}`}>
                    <div className={`d-flex align-items-center ${""}`}>
                      <div className={`${styles.Icons}`}>
                        <span className={`${styles.blue}`}>
                          <VscCircleFilled />
                        </span>
                      </div>
                      <div className={`ps-2 ${styles.RightData}`}>
                        <div className={`${styles.Portfolio}`}>
                          Fintoo's Model Portfolio
                        </div>
                        <div className={`${styles.value}`}>23.19%</div>
                      </div>
                    </div>
                    <div className={`d-flex mt-4 ${""}`}>
                      <div className={`${styles.Icons}`}>
                        <span className={`${styles.Black}`}>
                          <VscCircleFilled />
                        </span>
                      </div>
                      <div className={`ps-2 ${styles.RightData}`}>
                        <div className={`${styles.Portfolio}`}>
                          Nifty 500 (Total Return)
                        </div>
                        <div className={`${styles.value}`}>9.95%</div>
                      </div>
                    </div>
                  </div>
                  {/* <div>
                  <img
                    className="img-fluid"
                    src="https://www.fintoo.in/wealthmanagement/wp-content/uploads/2022/12/graph.png"
                  />
                </div> */}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className={`${styles.TimePeriod}`}>
          <div className={`ps-4 pb-4 ${styles.Dates}`}>Time Period : 3/1/2017 to 13/2/2023</div>
        </div>
      </div>
    </>
  );
};
export default AssistedUAESection;
