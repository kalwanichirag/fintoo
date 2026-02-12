import styles from "./style.module.css";
import commonStyles from "../../../Layout/Fullpage/style.module.css";

function WealthContactForm({ imgSrc }) {
  return (
    <>
      <section className={`${styles["wealth-contact-section"]}`}>
        <div
          className={`${styles["wealth-contact-section-container"]} ${commonStyles["padding-class"]}`}
        >
          
          <div
            className={`${styles["wealth-contact-section-contact-form-container"]}`}
          >
            <div className={`${styles["wealth-contact-section-contact-form"]}`}>
            <span className={`${styles['form-section-title']}`}>Get in touch</span>
              <form>
                <div className={`${styles["contact-form-input-container"]}`}>
                  {" "}
                  <label
                    className={`${styles["contact-form-label"]}`}
                    htmlFor=""
                  >
                    Name*
                  </label>
                  <input
                    className={`${styles["contact-form-input"]}`}
                    type="text"
                    required
                  />
                </div>

                <div className={`${styles["contact-form-input-container"]}`}>
                  <label
                    className={`${styles["contact-form-label"]}`}
                    htmlFor=""
                  >
                    Mobile Number*
                  </label>
                  <input
                    className={`${styles["contact-form-input"]}`}
                    type="tel"
                    required
                  />
                </div>

                <div className={`${styles["contact-form-input-container"]}`}>
                  <label
                    className={`${styles["contact-form-label"]}`}
                    htmlFor=""
                  >
                    Email*
                  </label>
                  <input
                    className={`${styles["contact-form-input"]}`}
                    type="email"
                    required
                  />
                </div>

                <div className={`${styles["contact-form-input-container"]}`}>
                  <label
                    className={`${styles["contact-form-label"]}`}
                    htmlFor=""
                  >
                    {" "}
                    Annual Income*
                  </label>
                  <select
                    className={`${styles["contact-form-input"]} ${styles["select-input"]}`}
                    aria-required="true"
                    required
                  >
                    <option value="">Select Income</option>
                    <option value="1">0 to 10 Lac</option>
                    <option value="2">10 Lac to 35 Lac</option>
                    <option value="3">35 Lac to 50 Lac</option>
                    <option value="4">50 Lac to 1 Crore</option>
                    <option value="5">Above 1 Crore</option>
                  </select>
                </div>

                <div className="text-center">
                  <button className={`${styles["contact-form-btn"]}`}>
                    File ITR
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default WealthContactForm;
