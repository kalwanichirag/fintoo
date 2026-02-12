import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./style.module.css";
import WhiteOverlay from "../HTML/WhiteOverlay";
import LogoImg from "./images/logo.png";
import Logo from "../VideoBox/UAEFintoo.png"
import { AiOutlineGlobal } from "react-icons/ai";
const UAEHeader = (props) => {
  const [show, setShow] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [header, setHeader] = useState("header1");
  const location = useLocation();
  const [pageurl, setPageurl] = React.useState();
  const listenScrollEvent = (event) => {
    const headerElement = document.querySelector("." + styles.header1);
    if (headerElement) {
      if (window.scrollY > 60) {
        headerElement.classList.add(styles.header2);
      } else {
        headerElement.classList.remove(styles.header2);
      }
    }
  };
  
  useEffect(() => {
    if ("pathname" in location) {
      setPageurl(location.pathname);
    }
  }, [location]);
  useEffect(() => {
    window.addEventListener("scroll", listenScrollEvent);

    return () => window.removeEventListener("scroll", listenScrollEvent);
  }, []);

  return (
    <>
      <div className={`NDA-Space ${styles.fakeSpace} fakeSpace_rn_k9`}></div>

      {
        pageurl == "/web/nri-desk-dubai" ? (<>
          <div
            // style={{
            //   backgroundColor: "transparent",
            //   padding: "1rem",
            // }}
            // className={header}
            className={pageurl == "/web/nri-desk-dubai" ? styles.header1 : styles.FintoouaeHeader}
          >
            <WhiteOverlay show={isLoading} />
            <div className=" ">
              <div className={`container-fluid ${styles["UAE-in-container"]}`}>
                <div className={`w-100 ${styles["in-container"]}`}>
                  <div className="row align-items-center">
                    <div className="col-md-5 col-12">
                      <a className={`${styles.UAELogo}`} href="/">
                        <img
                          className={`${styles.logo}`}
                          alt="logo"
                          src={process.env.REACT_APP_STATIC_URL + "media/wp/Fintoologo_.svg"}
                        // src={process.env.REACT_APP_STATIC_URL + "media/FintooLogoUAE.png"}
                        // src="https://static.fintoo.in/wealthmanagement/wp-content/uploads/2022/09/fintoo-logo-01-e1663135457467-2048x604.png"
                        />
                      </a>
                    </div>
                      <div className="col-md-7 col-12">
                          <ul className={styles["main-navigation"]}>
                            <div className={`me-4 me-md-0 ${styles.NriBtns}`}>
                              <Link
                                className={`text-decoration-none ${styles.Btns}`}
                                to={`${process.env.PUBLIC_URL}/${window.location.host.indexOf('fintoo.ae') > -1 ? 'income-tax-filing' : 'itr-file'}`}
                              >
                                file itr
                              </Link>
                            </div>
                            <div className={`${styles.NriBtns}`}>
                              <Link
                                className={`ms-md-4 text-decoration-none ${styles.Btns}`}
                                to={`${process.env.PUBLIC_URL}/contact-us`}
                              >
                                contact us
                              </Link>
                            </div>
                            <li className={`pointer ${styles.regionselectordialog}`}>
                              <div className={styles["link-url"]}>
                                {/* <img
                        src={require("./images/global_white.png")}
                        alt=""
                        style={{ width: "27.5px" }}
                      /> */}
                                <AiOutlineGlobal className={`${styles.GlobalIcon}`} />
                                {/* Help Center */}
                              </div>
                              <div className={styles["submenu-container"]}>
                                <div
                                  className={`${styles.submenu}, ${styles.GlobalMenu}`}
                                >
                                  <div className={styles.GlobalLang}>
                                    <div className={styles.GlobalText}>
                                      Change Region{" "}
                                    </div>
                                  </div>
                                  <div className={`${styles.GloballangMenu}`}>
                                    <div className={`${styles.Country}`}>
                                      <p>Asia Pacific</p>
                                      <div>
                                        <a
                                          className={`text-decoration-none ${styles.Region}`}
                                          href="https://www.fintoo.in"
                                        >
                                          India(English)
                                        </a>
                                      </div>
                                    </div>
                                    <div className={`${styles.HRline}`}></div>
                                    <div className={`${styles.Country}`}>
                                      <p>Middle East</p>
                                      <div>
                                        <a
                                          className={`text-decoration-none ${styles.Region}`}
                                          href="https://www.fintoo.ae"
                                        >
                                          UAE(English)
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>) : (<>
          <div className={styles.FintoouaeHeader}>
            <div className="row align-items-center">
              <div className="col-12">
                <a className={`${styles.UAELogo}`} href="/">
                  <img
                    className={`${styles.UaeImg}`}
                    alt="logo"
                    src={Logo}
                  // src={process.env.REACT_APP_STATIC_URL + "media/FintooLogoUAE.png"}
                  // src="https://static.fintoo.in/wealthmanagement/wp-content/uploads/2022/09/fintoo-logo-01-e1663135457467-2048x604.png"
                  />
                </a>
              </div>
            </div>
          </div>
        </>)

      }

    </>
  );
};

export default UAEHeader;
