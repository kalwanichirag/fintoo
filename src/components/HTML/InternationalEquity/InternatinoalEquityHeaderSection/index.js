import styles from "./style.module.css";
import * as animationData from "./assets/arrowAnimation.json";
import Lottie from "react-lottie";

function InternationalEquityHeaderSection() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const settings = {
    dots: false,
    fade: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2500,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
      <section className={`${styles["header-section"]} `}>
        <div className={`${styles["header-section-background-overlay"]}`}></div>
        <div className={`${styles["header-section-container"]}`}>
          <div className={`${styles["header-section-content"]}`}>
            <h2 className={`${styles["header-section-title"]}`}>
              Take Your Portfolio From
            </h2>
            <span className={`${styles["header-section-title2"]}`}>
              National{" "}
              <span
                className={`${styles["header-section-title"]} ${styles["lottie-arrow-container"]}`}
              >
                <span className={`${styles["lottie-arrow"]}`}>
                  <Lottie options={defaultOptions} />
                </span>
                To
              </span>{" "}
              International.
            </span>
            {/* <h3 className={`${styles["section-sub-title"]}`}>
              Experience the benefits of international investing with
              exceptional safety, affordability, and ease.
            </h3> */}
            <br />
            <br />

            <div style={{ width: 'fit-content', textAlign: 'center' }}>
              <a
                className="text-decoration-none"
                href="https://www.clientam.com/sso/Login?RL=1&partnerID=Fintoo"
                target="_blank"
              >
                <button
                  className={`${styles["header-section-content-btn"]} ${styles["animatedBouncInUp"]} ${styles["bounceInUp"]}`}
                >
                  START INVESTING
                </button>
              </a>
              <p style={{
                marginLeft: '0px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginTop: '20px',
                cursor: 'pointer'
              }}
              >
                <a href="#calendlySection" style={{
                  color: '#042b62',
                  textDecoration: 'underline'
                }}>Consult our Global Advisor</a></p>
            </div>

          </div>
          <div className={`${styles["header-section-image"]}`}>
            <div className={`${styles["header-section-image-container"]} `}>
              <div className={`${styles["outer-image-conteiner"]}`}>
                <img style={{ width: "90%" }} src={process.env.REACT_APP_STATIC_URL + 'media/wp/InternationalEquity/internationalEquity.svg'} alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default InternationalEquityHeaderSection;
