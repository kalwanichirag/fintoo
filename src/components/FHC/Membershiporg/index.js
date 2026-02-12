import React, { useState, useRef } from "react";
import { useEffect } from "react";
import styles from "./membershiporg.module.css";
function Membershiporg() {
  return (
    <>
      <div className={`${styles.MembershiporgFirst} ${styles.Membershiporg}`}>
        <div className={`${styles.Membershiporgbox} `}>
          <div className={`${styles.Membershiporgboxes}`}>
            <div className={`${styles.orgTitle}`}>2,00,000+</div>
            <div className={`${styles.orgDesc}`}>
              Happy Clients
            </div>
          </div>
        </div>
        <div className={`${styles.Membershiporgbox} `}>
          <div className={`${styles.Membershiporgboxes}`}>
            <div className={`${styles.orgTitle}`}>5,000 Cr+</div>
            <div className={`${styles.orgDesc}`}>
              Asset Under Tracking (AUT)
            </div>
          </div>

        </div>
        <div className={`${styles.Membershiporgbox} `}>
          <div className={`${styles.Membershiporgboxes}`}>
            <div className={`${styles.orgTitle}`}>250+</div>
            <div className={`${styles.orgDesc}`}>
              Corporate tie-ups
            </div>
          </div>
        </div>
      </div>
      <div className={`${styles.Membershiporg}`}>
        <div className={`${styles.Membershiporgbox} `}>
          <div className={`${styles.orgTitle}`}>Regulated</div>
          <div className={`${styles.orgDesc}`}>
            Our services and Financial Advisers adhere to full regulation and
            qualification under SEBI RIA guidelines.
          </div>
        </div>
        <div className={`${styles.Membershiporgbox} `}>

          <div className={`${styles.orgTitle}`}>Safe & Secure</div>
          <div className={`${styles.orgDesc}`}>
            We use advanced security protocols and secure platforms to protect
            your data, ensuring it's safe with us!
          </div>
        </div>
        <div className={`${styles.Membershiporgbox} `}>
          <div className={`${styles.orgTitle}`}>Quick & Easy to Use</div>
          <div className={`${styles.orgDesc}`}>
            Explore a personalized report crafted for your financial landscape
            and effortlessly gain valuable insights into financial situation.
          </div>
        </div>
      </div>
    </>
  );
}

export default Membershiporg;
