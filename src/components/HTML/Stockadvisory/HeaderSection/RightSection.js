import styles from "./style.module.css";
const RightSection = (props) => {
  return (
    <>
      <div
        className={`d-md-flex ${styles["header-section-image-container"]} ${styles.animated} ${styles.animatedFadeInUp} ${styles.fadeInUp} `}
      >
        <div className={`${styles.Rightside}`}>
        <img
        className={`${styles.heroimg}`}
                alt=""
                src={
                  process.env.REACT_APP_STATIC_URL +
                  // "media/wp/Stocks/Stockmobile.png"
                  "media/wp/Stocks/Domestic_Equity.svg "
            }
              />
          {/* <img
            alt=""
            className={`${styles.heroimg}`}
            src={
              process.env.REACT_APP_STATIC_URL+"media/wp/Stocks/Stock_mobile.png"
            }
          /> */}

          <div className={`${styles.mobileIcons}, ${styles.Appbtn}`}>
            <div>
              <a
                target="_blank"
                href="https://play.google.com/store/apps/details?id=com.financialhospital.admin.finh"
              >
                <img
                  alt="Download Fintoo app on play store"
                  src={
                    process.env.REACT_APP_STATIC_URL +
                    "media/footer/minty-android-app.png"
                  }
                />
              </a>
            </div>
            <div>
              <a
                target="_blank"
                href="https://apps.apple.com/in/app/fintoo/id1339092462"
              >
                <img
                  alt="Download Fintoo app on app store"
                  className="mt-md-4"
                  src={
                    process.env.REACT_APP_STATIC_URL +
                    "media/footer/minty-app-store.png"
                  }
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default RightSection;
