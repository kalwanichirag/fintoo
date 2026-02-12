import styles from "./style.module.css";
import commonStyles from "../../../Layout/Fullpage/style.module.css";
function ReportsPage() {
  return (
    <>
      <section
        className={`row ${styles.ReportsPage} ${commonStyles["padding-class"]} pb-5 pt-5`}
      >
        <div className={`d-md-flex ${styles.ReportsPageBox} `}>
          <div className={` ${styles.ReportsPageImg}`}>
          <img
           alt=""
            src={
              process.env.REACT_APP_STATIC_URL +
              "media/wp/Stocks/ReportPage.svg"
            }
          />
          </div>
          <div className={` ${styles.ReportsPageContent} `}>
            <p className={`${styles.ReportsPageContentTitle} `}>
            Don’t Let Your Goal, Out Of Your Sight.
            </p>
            <p className={`${styles.ReportsPageContentText} `}>
            Manage your investments on the go and make the most of every opportunity to get closer to your goal with the Fintoo App.
            </p>
            <div className={`d-flex justify-conetnt-center ${styles.ReportsPageBtn} `}>
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
              <div className="ms-md-3">
                <a
                  target="_blank"
                  href="https://apps.apple.com/in/app/fintoo/id1339092462"
                >
                  <img
                  alt="Download Fintoo app on app store"
                  src={
                    process.env.REACT_APP_STATIC_URL +
                    "media/footer/minty-app-store.png"
                  }
                />
                </a>
              </div>
              {/* <a href="#GETREPORTS">
                <button>GET REPORTS</button>
              </a> */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ReportsPage;
