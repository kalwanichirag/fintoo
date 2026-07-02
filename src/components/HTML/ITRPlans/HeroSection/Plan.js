import React from "react";
import styles from "./Style.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getUserId, loginRedirectGuest } from "../../../../common_utilities";

function Plan(props) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const numberFormat = (value) =>
    new Intl.NumberFormat("en-IN", {
      currency: "INR",
    }).format(value);

  const planDescription =
    props?.planDetails?.plan_description?.plan_desc || "";

  const originalAmount =
    props?.planDetails?.plan_description?.original_amount || 0;

  const planAmount =
    props?.planDetails?.plan_amount || 0;

  return (
    <div className={styles.ITRPlanSection}>
      <div className="row">
        <div className={`col-12 col-md-6 ${styles.LeftSection}`}>
          <p className={styles.planName}>
            {props?.planDetails?.plan_name}
          </p>

          <p className={styles.planDes}>
            {planDescription}
          </p>
        </div>

        <div className="col-12 col-md-6">
          <div className={`${styles.PlanBox} ${styles.RightSection}`}>
            <p className={styles.planName}>
              {props?.planDetails?.plan_name}
            </p>

            <div className={styles.PriceSection}>
              {searchParams.get("country") === "UAE" ? (
                <div className={styles.planPrice}>
                  AED{" "}
                  {(
                    sessionStorage.getItem("aed_rate") *
                    planAmount
                  ).toFixed(2)}
                </div>
              ) : (
                <>
                  <div className={styles.planPrice}>
                    ₹ {numberFormat(planAmount)}
                  </div>

                  <div
                    className={styles.planpricemax}
                    style={{
                      textDecoration: "line-through",
                      opacity: 0.7,
                    }}
                  >
                    ₹ {numberFormat(originalAmount)}
                  </div>
                </>
              )}
            </div>

            <div className={styles.PlanBuy}>
              <button
                onClick={() => {
                  if (getUserId()) {
                    navigate(
                      `${process.env.PUBLIC_URL}/itr-profile`
                    );
                  } else {
                    localStorage.setItem("isGuest", 1);

                    loginRedirectGuest(
                      "itr",
                      `${window.location.origin}${process.env.PUBLIC_URL}/itr-profile`
                    );
                  }
                }}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Plan;