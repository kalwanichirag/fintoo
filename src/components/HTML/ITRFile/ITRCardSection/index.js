import styles from "./style.module.css";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { HiArrowSmRight } from "react-icons/hi";
const ITRCardSection = () => {
  return (
    <section className={`${styles.ITRCards}`}>
      <div className={`${styles.ITRCardssectioncontainer}`}>
        <h2>ITR Filing Plans for Individuals</h2>
        <div className={`${styles.ITRplanCards}`}>
          <div className={`${styles.Plancards}`}>
            <p className={`${styles.plantype}`}>Salary / House rent income</p>

            <div className={`${styles.PlanPrice}`}>
              &#8377; 1299{" "}
              <sup>
                &#8377; <span>4199</span>{" "}
              </sup>
            </div>
            <div className={`${styles.PlanFeatures}`}>
              <div>
                <span className={`${styles.Check}`}>
                  <IoIosCheckmarkCircleOutline />{" "}
                </span>{" "}
                Salary less than 50 Lacs
              </div>
              <div>
                <span className={`${styles.Check}`}>
                  <IoIosCheckmarkCircleOutline />{" "}
                </span>{" "}
                Salary less than 50 Lacs
              </div>
              <div>
                <span className={`${styles.Check}`}>
                  <IoIosCheckmarkCircleOutline />{" "}
                </span>{" "}
                Salary less than 50 Lacs
              </div>
              <div>
                <span className={`${styles.Check}`}>
                  <IoIosCheckmarkCircleOutline />{" "}
                </span>{" "}
                Salary less than 50 Lacs
              </div>
              <div className={`${styles.Unheck}`}>
                <span>
                  <MdCancel />{" "}
                </span>{" "}
                Salary less than 50 Lacs
              </div>
              <div className={`${styles.Unheck}`}>
                <span>
                  <MdCancel />{" "}
                </span>{" "}
                Salary less than 50 Lacs
              </div>
            </div>
            <div className={`${styles.PlanBuy}`}>
              <button>Buy Now</button>
            </div>
            <div className={`${styles.PlanMoreDetails}`}>
              <a className="text-decoration-none " href="#">
                Know More <HiArrowSmRight />
              </a>
            </div>
          </div>
          <div className={`${styles.Plancards}, ${styles.mostPopular}`}>
            <div className={`${styles.popularTag}`}>Most Popular</div>

            <p className={`${styles.plantype}`}>
              Salary / House rent income{" "}
              <span className={`${styles.Premium}`}>(Premium)</span>{" "}
            </p>

            <div className={`${styles.PlanPrice}`}>
              &#8377; 2999{" "}
              <sup>
                &#8377; <span>4199</span>{" "}
              </sup>
            </div>
            <div className={`${styles.borderBtm}`}></div>
            <div className={`${styles.PlanFeatures}`}>
              <div>
                <span className={`${styles.Check}`}>
                  <IoIosCheckmarkCircleOutline />{" "}
                </span>{" "}
                Salary less than 50 Lacs
              </div>
              <div>
                <span className={`${styles.Check}`}>
                  <IoIosCheckmarkCircleOutline />{" "}
                </span>{" "}
                Salary less than 50 Lacs
              </div>
              <div>
                <span className={`${styles.Check}`}>
                  <IoIosCheckmarkCircleOutline />{" "}
                </span>{" "}
                Salary less than 50 Lacs
              </div>
              <div>
                <span className={`${styles.Check}`}>
                  <IoIosCheckmarkCircleOutline />{" "}
                </span>{" "}
                Salary less than 50 Lacs
              </div>
              <div className={`${styles.Unheck}`}>
                <span>
                  <MdCancel />{" "}
                </span>{" "}
                Salary less than 50 Lacs
              </div>
              <div className={`${styles.Unheck}`}>
                <span>
                  <MdCancel />{" "}
                </span>{" "}
                Salary less than 50 Lacs
              </div>
            </div>
            <div className={`${styles.PlanBuy}`}>
              <button>Buy Now</button>
            </div>
            <div className={`${styles.PlanMoreDetails}`}>
              <a className="text-decoration-none " href="#">
                Know More <HiArrowSmRight />
              </a>
            </div>
          </div>
          <div className={`${styles.Plancards}`}>
            <p className={`${styles.plantype}`}>Capital gains income </p>

            <div className={`${styles.PlanPrice}`}>
              &#8377; 3999{" "}
              <sup>
                &#8377; <span>7999</span>{" "}
              </sup>
            </div>
            <div className={`${styles.borderBtm}`}></div>
            <div className={`${styles.PlanFeatures}`}>
              <div>
                <span className={`${styles.Check}`}>
                  <IoIosCheckmarkCircleOutline />{" "}
                </span>{" "}
                Salary less than 50 Lacs
              </div>
              <div>
                <span className={`${styles.Check}`}>
                  <IoIosCheckmarkCircleOutline />{" "}
                </span>{" "}
                Salary less than 50 Lacs
              </div>
              <div>
                <span className={`${styles.Check}`}>
                  <IoIosCheckmarkCircleOutline />{" "}
                </span>{" "}
                Salary less than 50 Lacs
              </div>
              <div>
                <span className={`${styles.Check}`}>
                  <IoIosCheckmarkCircleOutline />{" "}
                </span>{" "}
                Salary less than 50 Lacs
              </div>
              <div className={`${styles.Unheck}`}>
                <span>
                  <MdCancel />{" "}
                </span>{" "}
                Salary less than 50 Lacs
              </div>
              <div className={`${styles.Unheck}`}>
                <span>
                  <MdCancel />{" "}
                </span>{" "}
                Salary less than 50 Lacs
              </div>
            </div>
            <p style={{
              height : ".9rem"
            }}></p>
            <div className={`${styles.PlanBuy}`}>
              <button>Buy Now</button>
            </div>
            <div className={`${styles.PlanMoreDetails}`}>
              <a className="text-decoration-none " href="#">
                Know More <HiArrowSmRight />
              </a>
            </div>
          </div>
          <div className={`${styles.Plancards}`}>
            <p className={`${styles.plantype}`}>Foregin income</p>

            <div className={`${styles.PlanPrice}`}>
              &#8377; 7999{" "}
              <sup>
                &#8377; <span>8499</span>{" "}
              </sup>
            </div>
            <div className={`${styles.borderBtm}`}></div>
            <div className={`${styles.PlanFeatures}`}>
              <div>
                <span className={`${styles.Check}`}>
                  <IoIosCheckmarkCircleOutline />{" "}
                </span>{" "}
                Salary less than 50 Lacs
              </div>
              <div>
                <span className={`${styles.Check}`}>
                  <IoIosCheckmarkCircleOutline />{" "}
                </span>{" "}
                Salary less than 50 Lacs
              </div>
              <div>
                <span className={`${styles.Check}`}>
                  <IoIosCheckmarkCircleOutline />{" "}
                </span>{" "}
                Salary less than 50 Lacs
              </div>
              <div>
                <span className={`${styles.Check}`}>
                  <IoIosCheckmarkCircleOutline />{" "}
                </span>{" "}
                Salary less than 50 Lacs
              </div>
              <div className={`${styles.Unheck}`}>
                <span>
                  <MdCancel />{" "}
                </span>{" "}
                Salary less than 50 Lacs
              </div>
              <div className={`${styles.Unheck}`}>
                <span>
                  <MdCancel />{" "}
                </span>{" "}
                Salary less than 50 Lacs
              </div>
            </div>
            <p style={{
              height : ".9rem"
            }}></p>
            <div className={`${styles.PlanBuy}`}>
              <button>Buy Now</button>
            </div>
            <div className={`${styles.PlanMoreDetails}`}>
              <a className="text-decoration-none " href="#">
                Know More <HiArrowSmRight />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ITRCardSection;
