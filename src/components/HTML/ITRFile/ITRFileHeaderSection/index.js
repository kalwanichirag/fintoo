import { useEffect, useState } from "react";
import styles from "./style.module.css";
import headerImg from "./assets/taxPlanningSectionImg.png";
import { IoMdVideocam } from "react-icons/io";
import { FiCheckCircle } from "react-icons/fi";
import { getUserId, removeSlash } from "../../../../common_utilities";
import { useNavigate } from "react-router-dom";
import { DATA_BELONGS_TO } from "../../../../constants";
import { Getpaymentstatus } from "../../../../FrappeIntegration-Services/services/payment-api/paymentapiService";

function ITRFileHeaderSection() {
  const [currentLocation, setCurrentLocation] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [height, setHeight] = useState(0);
  const navigate = useNavigate();
  const [checkPaymentStatus, setCheckPaymentStatus] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", listenToScroll);
    return () => window.removeEventListener("scroll", listenToScroll);
  }, []);

  const fetchPaymentStatus = async () => {
    try {
      const paymentRes = await Getpaymentstatus({
        user_id: getUserId(),
        data_belongs_to: DATA_BELONGS_TO,
      });

      const hasItrFilingPlan =
        paymentRes?.status_code === 200 &&
        paymentRes?.data?.some(
          (item) => item?.service_type === "itr_filing"
        );

      setCheckPaymentStatus(hasItrFilingPlan);
    } catch (error) {
      console.error("Payment status error:", error);
      setCheckPaymentStatus(false);
    }
  };

  const handleFilingClick = () => {
    if (window?.webengage?.track) {
      window.webengage.track("start filing clicked", {
        "cta name": "Start Filing",
        Service: "ITR Filing",
        url: window.location.href,
      });
    }

    if (checkPaymentStatus) {
      navigate(`${process.env.PUBLIC_URL}/itr-profile`);
    } else {
      document
        .getElementById("ITRVideoSection")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

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

  useEffect(() => {
    fetchPaymentStatus();
  }, []);


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
                45 Minutes Only!
              </span>
            </h3>
            <div className={styles.ITRFilingBtn}>
              <button onClick={handleFilingClick}>
                {checkPaymentStatus ? "Continue Filing" : "Start Filing"}
              </button>
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
                <button onClick={handleFilingClick}>
                  Start Filing
                </button>
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
