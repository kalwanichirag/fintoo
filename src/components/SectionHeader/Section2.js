import BorderDivider from "../BorderDivider/Border2";
import styles from "./style.module.css";

function SectionHeader2({ headerText }) {

    return (
        <>
            <div  className="text-center">
                <span className={`${styles['section-title2']}`}>{headerText}</span>
                <BorderDivider/>
            </div>

        </>
    )
}

export default SectionHeader2
