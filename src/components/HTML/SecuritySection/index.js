import styles from "./style.module.css";

import SectionHeader from "../../SectionHeader";
import { FiUsers } from "react-icons/fi";
import { BsKeyboard, BsCloud, BsShield } from "react-icons/bs";
import { useRef, useEffect } from "react";
import { getUserId } from "../../../common_utilities";
function SecuritySection({ DynamicBgColor }) {
  const interval = useRef(null);
  const timer = useRef(0);
  const startTimer = () => {
    // if idle for more than 5 mins logout
    if (timer.current >= 4) {
      clearInterval(interval.current)
      if (getUserId()) {
        window.location.href = "https://stg.minty.co.in/web/logout"
      }
    }
    else {
      timer.current = timer.current + 1
    }
  }
  const incrementTimer = () => {
    interval.current = setInterval(() => {
      startTimer()
    }, 60000);
  }
  const resetTimer = () => {
    clearInterval(interval.current)
  }
  useEffect(() => {
    // incrementTimer();
  }, []);
  return (
    <section
      className={`pb-5 pt-5 ${styles.SecuritySection}`}
      style={{ backgroundColor: `${DynamicBgColor ?? "#E6EAEF"}` }}
      onMouseEnter={() => {
        resetTimer();
      }}
      onMouseLeave={() => {
        resetTimer();
      }}
    >
      <SectionHeader headerText={"Security"} />
      <div className={`mt-3 ${styles.SecurityContentBox}`}>
        <div className={`${styles.SecurityContentCard}`}>
          <div className={`d-grid ${styles.Security}`}>
            <div className={`${styles.SecurityContentCardBox}`}>
              <div className={`${styles.SecurityContentCardImg}`}>
                <FiUsers />
              </div>
              <div>
                <div className={`${styles.SecurityContentText}`}>
                  <p className={`${styles.SecurityContentTextHead}`}>
                    Data Security
                  </p>
                  We prioritize the safety of your financial data. Before transmitting over any network, we encrypt it to ensure it’s unreadable to unauthorized parties, safeguarding its integrity at every step.
                </div>
              </div>
            </div>
            <div className={`${styles.SecurityContentCardBox}`}>
              <div className={`${styles.SecurityContentCardImg}`}>
                <BsKeyboard />
              </div>
              <div>
                <div className={`${styles.SecurityContentText}`}>
                  <p className={`${styles.SecurityContentTextHead}`}>
                    Authorized Access
                  </p>
                  We adopt a "prevention over cure" philosophy by implementing role-based access, protected with OTPs and Captcha codes, to ensure only authorized individuals can access your sensitive information.
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.SecurityContentImg}`}>
            <img
              src={
                process.env.REACT_APP_STATIC_URL +
                "media/wp/FPPlan/yoursafetyandsecuritycomefirst.webp"
              }
              alt=""
            />
          </div>
          <div className={`d-grid ${styles.Security}`}>
            <div className={`${styles.SecurityContentCardBox}`}>
              <div className={`${styles.SecurityContentCardImg}`}>
                <BsCloud />
              </div>
              <div className={`${styles.SecurityContentText}`}>
                <p className={`${styles.SecurityContentTextHead}`}>
                  Cloud Infrastructure{" "}
                </p>
                We rely on AWS Cloud infrastructure to protect your data with the highest levels of security, minimizing risks of breaches or data loss.
              </div>
            </div>
            <div className={`${styles.SecurityContentCardBox}`}>
              <div className={`${styles.SecurityContentCardImg}`}>
                <BsShield />
              </div>
              <div className={`${styles.SecurityContentText}`}>
                <p className={`${styles.SecurityContentTextHead}`}>
                  Security Audited
                </p>
                Top cybersecurity experts continuously monitor and test our systems, using thorough security assessments and penetration testing to prevent potential vulnerabilities.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SecuritySection;
{
  /* <div className={`d-grid  ${styles.SecurityContent}`}>
<div className={`d-flex  ${styles.SecurityText}`}>
  <div className={`${styles.SecurityContentIcons}`}>
    <FiUsers />
  </div>
  <div className={`${styles.SecurityContentPara}`}>
    <p>
      We Promise You Complete Secrecy And Security - Whether it is
      about your information or your investment, we believe in
      protecting both using only the best of technology and expertise.
    </p>
  </div>
</div>
<div className={`d-flex  ${styles.SecurityText}`}>
  <div className={`${styles.SecurityContentIcons}`}>
    {" "}
    <BsKeyboard />
  </div>
  <div className={`${styles.SecurityContentPara}`}>
    <p>
      Vulnerability Assessment and Penetration Testing - While being
      confident about our security measures, we also believe in
      testing them for on-ground reality.
    </p>
  </div>
</div>
</div>
<div className={`${styles.SecurityImg}`}>
<img src={Safety} />
</div>

<div className={`d-grid ${styles.SecurityContent}`}>
<div className={`d-flex  ${styles.SecurityText}`}>
  <div className={`${styles.SecurityContentIcons}`}>
    <BsCloud />
  </div>
  <div className={`${styles.SecurityContentPara}`}>
    <p>
      Cloud Infrastructure – When it’s about the security of your
      vital information, we believe that ‘the more the better.’ So, in
      addition to our privacy protection, we use AWS Cloud
      infrastructure to host all our operations in order to further
      enshield your information from any incident of information leak
      or loss.
    </p>
  </div>
</div>
<div className={`d-flex  ${styles.SecurityText}`}>
  <div className={`${styles.SecurityContentIcons}`}>
    <BsShield />
  </div>
  <div className={`${styles.SecurityContentPara}`}>
    <p>
      Data Security – Believing in ‘prevention is better than cure’,
      we have developed an exclusive role-based access control system
      that uses OTP i.e One Time Password and Captcha Code to prevent
      any unauthorised individual from accessing the information.
    </p>
  </div>
</div>
</div> */
}
