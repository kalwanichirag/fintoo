
import styles from "./style.module.css";

const SetApartSection = () => {

    return (
        <section className={`${styles.SetApartSectionSection}`}>
            <div className={`text-center ${styles.GlobalText2}`} style={{ paddingBottom: '0' }}>
                What Sets Us Apart?
            </div>
            <br />
            <div className={styles.flipCardContainer}>
                <div className={styles.flipCard}>
                    <div className={styles.flipCardInner}>
                        <div className={styles.flipCardFront}>
                            <div className={styles.flipCardFrontIcon}>
                                <i className="fa-solid fa-arrow-right"></i>
                            </div>
                            Unbiased Advisory
                        </div>
                        <div className={styles.flipCardBack}>Virtuous and unbiased advisory while catering to fiduciary matters.</div>
                    </div>
                </div>
                <div className={styles.flipCard}>
                    <div className={styles.flipCardInner}>
                        <div className={styles.flipCardFront}>
                            <div className={styles.flipCardFrontIcon}>
                                <i className="fa-solid fa-arrow-right"></i>
                            </div>
                            Data Privacy & Security
                        </div>
                        <div className={styles.flipCardBack}>Adherence to privacy, data security, and transparency with end-to-end encryption technology.</div>
                    </div>
                </div>
                <div className={styles.flipCard}>
                    <div className={styles.flipCardInner}>
                        <div className={styles.flipCardFront}>
                            <div className={styles.flipCardFrontIcon}>
                                <i className="fa-solid fa-arrow-right"></i>
                            </div>
                            AI-Driven Portfolio Analysis
                        </div>
                        <div className={styles.flipCardBack}>A tech-driven system that performs real-time portfolio analysis to identify suitable opportunities.</div>
                    </div>
                </div>
                <div className={styles.flipCard}>
                    <div className={styles.flipCardInner}>
                        <div className={styles.flipCardFront}>
                            <div className={styles.flipCardFrontIcon}>
                                <i className="fa-solid fa-arrow-right"></i>
                            </div>
                            In-House Research Desk
                        </div>
                        <div className={styles.flipCardBack}>A robust in-house research team for real-time and dynamic portfolio monitoring.</div>
                    </div>
                </div>
                <div className={styles.flipCard}>
                    <div className={styles.flipCardInner}>
                        <div className={styles.flipCardFront}>
                            <div className={styles.flipCardFrontIcon}>
                                <i className="fa-solid fa-arrow-right"></i>
                            </div>
                            Zero Commission-Based Solutions
                        </div>
                        <div className={styles.flipCardBack}>A fee-only advisory ensuring unbiased advice spanning diversified investment solutions.</div>
                    </div>
                </div>
            </div>
            <br /><br />
        </section>
    );
};

export default SetApartSection;
