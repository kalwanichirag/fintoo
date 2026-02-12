import { useEffect, useState } from "react";
import styles from "./style.module.css";
import headerImg from "./assets/taxPlanningSectionImg.png";
import { IoMdVideocam } from "react-icons/io";
import { FiCheckCircle } from "react-icons/fi";
import { removeSlash } from "../../../../common_utilities";
function ITRFileHeaderSection() {
  const [currentLocation, setCurrentLocation] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    window.addEventListener("scroll", listenToScroll);
    return () => window.removeEventListener("scroll", listenToScroll);
  }, []);
  const listenToScroll = () => {
    let showFrom = 350;
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    setHeight(winScroll);

    if (winScroll < showFrom) {
      isVisible && setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  };
  useEffect(() => {
    setIsVisible(false)
    setCurrentLocation(location.pathname);
  }, [location]);
  return (
    <>
      <section className={`${styles["header-section"]} `}>
        <div className={` ${styles["header-section-container"]}`}>
          <div
            className={`${styles["header-section-background-overlay"]}`}
          ></div>
          {["/web/income-tax-filing-ae", "/web/income-tax-filing"].indexOf(
            removeSlash(currentLocation)
          ) > -1 ? (
            <>
              <div
                className={`text-center w-100 d-flex justify-content-center position-absolute ${styles.HeaderTop}`}
              >
                <img
                  className={`${styles.LogoHeader}`}
                  src={process.env.REACT_APP_STATIC_URL + "media/wp/Fintoologo_.svg"}
                  alt="Fintoo logo"
                />
              </div>
            </>
          ) : (
            <></>
          )}

          <div
            className={
              ["/web/income-tax-filing-ae", "/web/income-tax-filing"].indexOf(
                removeSlash(currentLocation)
              ) > -1
                ? styles.HeaderContent
                : styles.HeaderContent1
            }
          >
            <h2 className={`${styles.HeaderTitleSection}`}>
              File Your{" "}
              <span
                style={{
                  color: "#042b62",
                  fontWeight: "700",
                }}
              >
                ITR
              </span>
            </h2>
            <h3 className={`${styles.HeadersubTitleSection}`}>
              Anywhere, Anytime
            </h3>
            <h3 className={`${styles.HeadersubTitleSection}`}>
              <span
                className={`${styles.HeadersubtextTitleSection}`}
                style={{
                  color: "#042b62",
                }}
              >
                30 Minutes Only!
              </span>
            </h3>
            <div className={`${styles.ITRFilingBtn}`}>
              <a className="text-decoration " href="#ITRVideoSection">
                <button> Start Filing</button>
              </a>
            </div>
            <div className="d-flex justify-content-center mt-md-4">
              <a
                style={{
                  scrollBehavior: "smooth",
                }}
                href="#ITRVideoSection"
              >
                <div className={`${styles.mouseicon}`}>
                  <span></span>
                </div>
              </a>
            </div>
            {isVisible ? (
              <div className={`d-md-none d-block ${styles.ITRFilingBtnMobile}`}>
                <a className="text-decoration " href="#ITRVideo">
                  <button> Start Filing</button>
                </a>
              </div>
            ) : (
              <> </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default ITRFileHeaderSection;
