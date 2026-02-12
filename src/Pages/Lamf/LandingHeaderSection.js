import React from "react";
import styles from "./style.module.css";
import { getPublicMediaURL } from "../../common_utilities";
import { FiRefreshCcw } from "react-icons/fi";

function LandingHeaderSection() {
  return (
    <>
      <section className={`${styles["header-section"]} `}>
        <div className={`mt-md-1 ${styles["header-section-container"]}`}>
          <div className={`${styles["header-section-content"]}`}>
            <h2 className={`${styles["header-section-title"]}`}>
              Unlock the Value of Your Mutual Funds
            </h2>
            <p className={`${styles["section-sub-title"]}`}>
              Get instant loans against your mutual fund investments at 10.75%
            </p>
            <div className={styles["credit-limit-box"]}>
              <div className="d-flex justify-content-between">
                <p><strong>Your Eastimated Credit Limit</strong></p>
                <p>Updated 15d ago</p>
              </div>
              <div className="d-flex align-items-end my-4">
                <p className={`m-0 pe-4 ${styles["credit-limit"]}`}>₹ 55</p>
                <p className={`m-0 mb-2`}><FiRefreshCcw /> Refresh Limit</p>
              </div>
              <div className="d-flex">
                <button className={`${styles["dark-btn"]} flex-fill me-2 text-center btn-primary`}>Recalculate Limit</button>
                <button className={`${styles["light-btn"]} flex-fill ms-2 text-center btn-primary`}>See how we do it</button>
              </div>
            </div>
          </div>
          <div className={`${styles["header-section-image"]}`}>
            <div
              className={`${styles["header-section-image-container"]} ${styles["animated"]} ${styles["animatedFadeInUp"]} ${styles["fadeInUp"]}  `}
            >
              <img
                style={{ width: "100%" }}
                src={getPublicMediaURL(
                  "/static/media/Lamf/why-choose-loan-against-mf.png"
                )}
                alt=""
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default LandingHeaderSection;
