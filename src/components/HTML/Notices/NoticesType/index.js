import styles from "./style.module.css";
import commonStyles from "../../../Layout/Fullpage/style.module.css";
import SectionHeader2 from "../../../SectionHeader";
import { AiOutlineCheckCircle } from "react-icons/ai";
function NoticesType() {
  return (
    <>
      <section
        className={`${styles["Notice-section"]} ${commonStyles["padding-class"]} pb-5 pt-5`}
      >
        <SectionHeader2
          className="text-center "
          headerText={"Type of Notices"}
        />
        <div className={`${styles["Notice-type-Section"]}`}>
          <div className={`${styles.BoxSection}`}>
            <div>
              <AiOutlineCheckCircle />{" "}
            </div>
            <div className={`${styles.BoxSectionTitle}`}>
              Section 143(1) – Intimation on Processing Your Returns
            </div>
          </div>
          <div className={`${styles.BoxSection}`}>
            <div>
              <AiOutlineCheckCircle />{" "}
            </div>
            <div className={`${styles.BoxSectionTitle}`}>
              Section 142(1) – Preliminary Inquiry of an Assessment
            </div>
          </div>
          <div className={`${styles.BoxSection}`}>
            <div>
              <AiOutlineCheckCircle />{" "}
            </div>
            <div className={`${styles.BoxSectionTitle}`}>
              Section 245 – Income Adjusted against Tax demand
            </div>
          </div>
          <div className={`${styles.BoxSection}`}>
            <div>
              <AiOutlineCheckCircle />{" "}
            </div>
            <div className={`${styles.BoxSectionTitle}`}>
              Section 148 – Income escaped assessment
            </div>
          </div>
          <div className={`${styles.BoxSection}`}>
            <div>
              <AiOutlineCheckCircle />{" "}
            </div>
            <div className={`${styles.BoxSectionTitle}`}>
              Section 139(9) – Defective Return
            </div>
          </div>
          <div className={`${styles.BoxSection}`}>
            <div>
              <AiOutlineCheckCircle />{" "}
            </div>
            <div className={`${styles.BoxSectionTitle}`}>
              Income Tax Appellate Tribunal
            </div>
          </div>
        </div>
        <div className={`text-center ${styles.BottomText} `}>
          Income Tax Appellate Tribunal (ITAT) is also one of our areas of
          expertise that enables us to file appeals against the orders of income
          tax authorities in case a taxpayer does not agree with the assessment
          order or any other order, passed by an income-tax authority
        </div>
      </section>
    </>
  );
}

export default NoticesType;
