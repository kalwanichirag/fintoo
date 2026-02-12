import BorderDivider from "../BorderDivider";
import styles from "./style.module.css";

function SectionHeader({ headerText }) {

    return (
        <>
            <div  className="text-center">
                <span className={`${styles['section-title']}`}>{headerText}</span>
                <BorderDivider/>
            </div>

        </>
    )
}

export default SectionHeader
