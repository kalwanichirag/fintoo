import styles from "./style.module.css";
import Stcok from "./images/stocks.png";
import { CiDesktop } from "react-icons/ci";
import { FiUsers } from "react-icons/fi";
import SectionHeader from "../../../SectionHeader";
import FPReportBox from "../../FPReportBox";
const FinancialReport = () => {
  return (
    <section className={`${styles.FinancialReport}`}>
      <SectionHeader
        className="text-center"
        headerText={"This Is How Your Customised Financial Report Will Look Like"}
      />
      <div className={`mt-5 ${styles.FinancialReportBox}`}>
          <FPReportBox />
      </div>
    </section>
  );
};
export default FinancialReport;
