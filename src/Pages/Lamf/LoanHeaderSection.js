import React from "react";
import styles from "./style.module.css";
import { getPublicMediaURL } from "../../common_utilities";
import { FiRefreshCcw } from "react-icons/fi";

const CardCols = (props) => {
  return (
    <div className="col">
      <div className={Boolean(props.last) == false && styles["inside-cardcols-box"]}>
        <p className={`${styles["tbl-card-heading"]} m-0`}>{props.heading}</p>
        <p className={`${styles["tbl-card-content"]} m-0 mt-2`}>{props.content}</p>
      </div>
    </div>
  );
};
function LoanHeaderSection() {
  return (
    <>
      <section className={`position-relative ${styles["header-bg-1"]}`}>
        <div
          className={`${styles["header-section"]} ${styles["loan-header-section"]}`}
        >
          <p className={`text-center ${styles["loan-landing-welcome"]}`}>
            Welcome, Ajay!!!
          </p>
          <p className={`text-center ${styles["loan-landing-welcome-note"]}`}>
            Your Loan is Active
          </p>
          <div className={`mt-md-1 ${styles["loan-header-section-container"]}`}>
            <div className="d-flex justify-content-between pb-2">
              <p className={`${styles["green-text"]} m-0`}>Active Loan</p>
              <p className={`${styles["loan-application-number"]} m-0`}>
                <strong className="me-2">Application No.</strong>123456789
              </p>
            </div>
            <div className={`d-flex py-3 position-relative ${styles["credit-limit-border"]}`}>
              <p className={`${styles["credit-limit"]} m-0 pe-3`}>
                Credit Limit
              </p>
              <p className={`${styles["credit-limit-amount"]} m-0`}>
                ₹2,85,984
              </p>
            </div>
            <div className="row pt-2">
              <CardCols heading="Amount Withdrawn" content="₹94,700" />
              <CardCols heading="Amount Available" content="₹94,700" />
              <CardCols heading="Interest Rate" content="10.5% pa" />
              <CardCols heading="SMFs Pledged" content="10" last={true} />
            </div>
          </div>
          <div className="d-flex pt-4">
            <button
              className={`${styles["dark-btn-1"]} flex-fill me-2 text-center btn-primary`}
            >
              Repay Cash
            </button>
            <button
              className={`${styles["light-btn-1"]} flex-fill ms-2 text-center btn-primary`}
            >
              Withdraw Cash
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default LoanHeaderSection;
