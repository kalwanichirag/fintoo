import styles from "./style.module.css";
function NriTaxationHeaderSection() {
  return (
    <>
      <section className={`${styles["nri-taxation-header-section"]} `}>
        <div className={`${styles["header-section-container"]}`}>
          <div className={`${styles["header-section-content"]}`}>
            <h2 className="header-section-bold-title">
              Seamless, Expert-Led Tax Management for NRIs.
            </h2>
            {/* <h3
              className={`${styles["section-sub-title"]} ${styles["fade-in"]}`}
            >
              Personalised advisory and compliance services that cover all
              aspects of NRI Taxation like Income Tax, DTAA, Foreign Exchange
              Management Act, FERA, FCRA, Companies Act and more.
            </h3> */}
            <br />
            <a
              className="text-decoration-none"
              href="#book-appointment"
            >
              <button
                className={`${styles["header-section-content-btn"]} ${styles["animatedBouncInUp"]} ${styles["bounceInUp"]}`}
              >
                GET STARTED
              </button>
            </a>
          </div>
          <div className={`${styles["header-section-image"]}`}>
            <div
              className={`${styles["header-section-image-container"]} ${styles["animated"]} ${styles["animatedFadeInUp"]} ${styles["fadeInUp"]}  `}
            >
              <img src={process.env.REACT_APP_STATIC_URL + 'media/wp/InternationalEquity/internationalEquity.svg'} alt="" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default NriTaxationHeaderSection;
