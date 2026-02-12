import BorderDivider from "../BorderDivider";
import styles from "./style.module.css";

const BoldSectionHeader = ({ headerText }) => (
    <h2 className={`${styles['section-title']} text-center mb-4`}>
        <span>{headerText}</span>
        {/* <BorderDivider/> */}
    </h2>
)

export default BoldSectionHeader;
