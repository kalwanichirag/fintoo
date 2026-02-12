import styles from "./style.module.css";

function BorderDivider() {

    return (
        <>
            <div className={`mt-2 ${styles['heading-separetor-container']}`}>
                <div className={`${styles['heading-separetor']}`}>
                    <div className={`${styles['border-divider']}`}></div>
                </div>
            </div>

        </>
    )
}

export default BorderDivider
