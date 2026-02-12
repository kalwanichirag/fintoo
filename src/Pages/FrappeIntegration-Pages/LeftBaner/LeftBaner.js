import styles from "./LeftBaner.module.css";

import BGgraphic2 from "../Images/registration/BGgraphic2.svg"
import BGgraphic4 from "../Images/registration/BGgraphic4.svg"
import BGgraphic1 from "../Images/registration/BGgraphic1.svg"
import screenBanner from "../Images/registration/AuthScreenBanner.png"

export default function LeftBaner() {


    return (
        <div className={styles.container}>
            <img
                src={BGgraphic2}
                alt="Top Left"
                className={styles.bgImageTopLeft}
            />
            <img
                src={BGgraphic1}
                alt="Top Right"
                className={styles.bgImageTopRight}
            />
            <img
                src={BGgraphic4}
                alt="Bottom Right"
                className={styles.bgImageBottomRight}
            />
            <img
                src={BGgraphic1}
                alt="Bottom Left"
                className={styles.bgImageBottomLeft}
            />
            <div className={styles.bannerWrapper}>
                <img src={screenBanner} alt="AuthScreenBanner" className={styles.bannerImage} />
                <div className={styles.textContainer}>
                    <h2 className={styles.heading}>Fast, Efficient and Productive</h2>
                </div>
            </div>
        </div>
    );
}
