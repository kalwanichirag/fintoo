import styles from "./style.module.css"
function HeaderSection() {
  return (
    <>
      <section className={`${styles["header-section"]} `}>
        <div className={`${styles["header-section-container"]}`}>
          <div className={`${styles["header-section-content"]}`}>
            <h2 className={`${styles["header-section-title"]}`}>
              Complimentary Chat <br /> With Tax Experts.
            </h2>
            {/* <h3 className={`${styles["section-sub-title"]}`}>
              Ask all your doubts and queries related to Tax and ITR to the
              experts at and get the right solution for your problem.
            </h3> */}
            <br />
            <a href="#Asknow" className="text-decoration-none">
              <button
                className={`${styles["header-section-content-btn"]} ${styles["animatedBouncInUp"]} ${styles["bounceInUp"]}`}
              >
                ASK NOW
              </button>
            </a>
          </div>
          <div className={`${styles["header-section-image"]}`}>
            <div
              className={`${styles["header-section-image-container"]} ${styles["animated"]} ${styles["animatedFadeInUp"]} ${styles["fadeInUp"]}  `}
            >
              <img
                alt=""
                style={{ width: "100%" }}
                src={
                  process.env.REACT_APP_STATIC_URL + "media/wp/chatbot-1.png"
                }
              />
             
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HeaderSection;
