import styles from "./LeftBaner.module.css";


export default function LeftBaner() {


    return (
        <div className={styles.container}>
          <img src="/static/media/erasebg-transformed.png" alt="Dashboard Mockup" className={styles.mockupImage} />
            <div className={styles.bannerWrapper}>
                <div className={styles.textContainer}>
                    <h2 className={styles.heading}>Your Money Simplified.</h2>
                    <p className={styles.description}>Track your net worth, manage investments, and plan your goals—all in one powerful dashboard designed for smarter financial decisions.</p>
                </div>
            </div>
        </div>
    );
}
