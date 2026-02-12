import { Link } from "react-router-dom";
import styles from "./style.module.css";

function IpoHeaderSection() {
  return (
    <>
      <section className={`${styles["header-section"]} `}>
        <div className={`${styles["header-section-background-overlay"]}`}></div>
        <div className={`${styles["header-section-container"]}`}>
          <div className={`${styles["header-section-content"]}`}>
            <h2 className="header-section-bold-title">
              Early-Stage Growth Potential in Expanding Markets.
            </h2>
            {/* <h3 className={`${styles['section-sub-title']}`}>One platform to manage all your IPO related activities.</h3> */}
            <br />
            {/* <a href={process.env.REACT_APP_MODE == "live" ? `#` : `https://www.fintoodirect.in/ipo`}>
              <button className={`${styles['header-section-content-btn']} ${styles['animatedBouncInUp']} ${styles['bounceInUp']} ${process.env.REACT_APP_MODE == `live` ? 'disabled' : ''}`} style={process.env.REACT_APP_MODE == "live" ? {cursor:"default"} : {cursor:"pointer"}}>
                {process.env.REACT_APP_MODE == "live" ? "Coming Soon" : "Explore"}
              </button>
            </a> */}
            <Link to={process.env.PUBLIC_URL + "/stocks/?page=ipo"}>
              <button className={`${styles['header-section-content-btn']} ${styles['animatedBouncInUp']} ${styles['bounceInUp']} `} style={{ cursor: "pointer" }}>
                {/* {process.env.REACT_APP_MODE == "live" ? "Coming Soon" : "Explore"} */}
                Explore
              </button>
            </Link>
          </div>
          <div className={`${styles["header-section-image"]}`}>
            <div
              className={`${styles["header-section-image-container"]} ${styles["animated"]} ${styles["animatedFadeInUp"]} ${styles["fadeInUp"]}  `}
            >
              <img
                src={
                  process.env.REACT_APP_STATIC_URL +
                  "media/wp/IPO/ipoHeadingBg.png"
                }
                alt=""
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default IpoHeaderSection;
