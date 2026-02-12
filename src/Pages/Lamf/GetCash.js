import { useEffect, useState } from "react";
import { getPublicMediaURL } from "../../common_utilities";
import styles from "./style.module.css";

const GetCash = () => {
  const [listIndex, setListIndex] = useState(1);
  useEffect(()=> {
    startAnimation();
  }, []);
  const startAnimation = () => {
    setListIndex(prev=> (prev >= 4 ? 1 : prev + 1));
    setTimeout(()=> {
      startAnimation();
    }, [3000]);
  }
  return (
    <>
      <section className={`py-5 ${styles["getcash-section"]}`}>
        <div className="container">
          <div className={`d-flex ${styles["get-cash-container"]} `}>
            <div className="flex-grow-1">
              <p className={`${styles["getcash-title"]} m-0`}>Get cash</p>
              <p className={`${styles["getcash-subtitle"]} m-0`}>
                at 10.75% Pa
              </p>
              <div
                className={`d-flex align-items-center ${styles["getcash-apply-box"]}`}
              >
                <p className="m-0 flex-grow-1 ps-2">
                  <strong>Direct to your bank account</strong>
                </p>
                <a href="#" className={styles["getcash-apply-now"]}>
                  Apply Now
                </a>
              </div>
            </div>
            <div className={styles["getcash-left-image"]}>
              <img
                src={getPublicMediaURL(
                  "/static/media/Lamf/bank-money-drop-icon.png"
                )}
                width={400}
              />
            </div>
          </div>
        </div>
      </section>
      <section className="py-5">
        <div className="container">
          <div className={`${styles["features-points-box"]}`}>
            <div class="text-center">
              <p className={`m-0 text-capitalize ${styles["section-title"]}`}>
                get cash against your mutual fund
              </p>
              <p className={`m-0 ${styles["section-main-bold-text"]}`}>in 4 easy steps</p>
            </div>
            <div className="row">
              <div className="col-4">
                <ul className={`${styles["feature-list-points"]}`}>
                  <li className={listIndex == 1 && styles["point-open"]}>
                    <p className={styles["point-heading"]}>
                      Step One
                    </p>
                    <p className={styles["point-subhead"]}>
                      Import mutual fund holdings to calculate credit limit
                    </p>
                  </li>
                  <li className={listIndex == 2 && styles["point-open"]}>
                    <p className={styles["point-heading"]}>
                      Step Two
                    </p>
                    <p className={styles["point-subhead"]}>
                      Import mutual fund holdings to calculate credit limit
                    </p>
                  </li>
                  <li className={listIndex == 3 && styles["point-open"]}>
                    <p className={styles["point-heading"]}>
                      Step Three
                    </p>
                    <p className={styles["point-subhead"]}>
                      Import mutual fund holdings to calculate credit limit
                    </p>
                  </li>
                  <li className={listIndex == 4 && styles["point-open"]}>
                    <p className={styles["point-heading"]}>
                      Step Four
                    </p>
                    <p className={styles["point-subhead"]}>
                      Import mutual fund holdings to calculate credit limit
                    </p>
                  </li>
                </ul>
              </div>
              <div className={`col-8 ${styles["feature-images"]}`}>
                <div>
                  {listIndex == 1 && <img
                    src={getPublicMediaURL(
                      "static/media/Lamf/animation-image-1.png"
                    )}
                  />}
                  {listIndex == 2 && <img
                    src={getPublicMediaURL(
                      "static/media/Lamf/animation-image-2.png"
                    )}
                  />}
                  {listIndex == 3 && <img
                    src={getPublicMediaURL(
                      "static/media/Lamf/animation-image-3.png"
                    )}
                  />}
                  {listIndex == 4 && <img
                    src={getPublicMediaURL(
                      "static/media/Lamf/animation-image-4.png"
                    )}
                  />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default GetCash;
