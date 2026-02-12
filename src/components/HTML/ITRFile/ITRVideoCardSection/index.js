import { useState, useEffect } from "react";
import styles from "./style.module.css";
import { IoMdVideocam } from "react-icons/io";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { HiArrowSmRight } from "react-icons/hi";
import {
  apiCall,
  setItemLocal,
  loginRedirectGuest,
  getUserId,
  removeSlash,
  createCookie,
  deleteCookie,
} from "../../../../common_utilities";

import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

function WidgetSection() {
  const [plans, setPlans] = useState({});
  const userid = getUserId();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { pathname } = useLocation();
  const location = useLocation();
  const [pageurl, setPageurl] = useState();
  const [dynamicClass, setDynamicClass] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  useEffect(() => {
    if (pathname.indexOf("/itr_file_landing") > -1) {
      setDynamicClass(styles["newpagelinks"]);
    }
  }, [pathname]);

  useEffect(() => {
    onLoadInit();
    return () => { };
  }, []);
  //For Know More Hide Fintoo.ae

  useEffect(() => {
    setCurrentLocation(location.pathname);
  }, [location]);

  const numberFormat = (value) =>
    new Intl.NumberFormat("en-IN", {
      // style: 'currency',
      currency: "INR",
    }).format(value);

  const onLoadInit = async () => {
    try {

      if(window.location.href.includes("itr_2024") == false) {
        deleteCookie("itr-page");
      }

      if (getUserId() && localStorage.getItem('isGuest')) {
        localStorage.removeItem('isGuest');
        navigate(`${process.env.PUBLIC_URL}/itr-profile`);
        return;
      }
      // let url = TAX_GET_TAX_PLANS_API_URL;
      // let data = {};
      // let respData = await apiCall(url, data);

      // if (respData["error_code"] == "100") {
      //   let data = respData["data"];
      //   setPlans(data);
      // }
    } catch (e) {
      console.log(e);
    }
  };

  const handleClick = (pid) => {
    setItemLocal("pid", plans[pid]);
    check2024();
    navigate(`${process.env.PUBLIC_URL}/itr-profile`);
  };

  const check2024 = () => {
    if(window.location.href.includes("itr_2024")) {
      createCookie("itr-page", "itr_2024", 20);
    }
  }

  const handleClickGuest = (pid) => {
    setItemLocal("pid", plans[pid]);
    let curr_url = window.location.href.split("?");
    let redirect_params = "";
    if (curr_url.length > 1) {
      redirect_params = "?" + curr_url[1];
    }
    localStorage.setItem('isGuest', 1);
    check2024();
    loginRedirectGuest("itr", `${window.location.origin}${process.env.PUBLIC_URL}/itr-profile`);
  };

  return (
    <>
      <p id="ITRVideoSection" style={{
        marginTop: "10rem"
      }}></p>
      <section className={`${styles.ITRVideoSection}`}>
        <div className={`${styles.ITRCardssectioncontainer}`}>
          <h2
            className={`d-flex justify-content-center align-items-center  ${styles.title}`}
          >
            <span className={`d-none d-md-block ${styles.icon}`}>
              <IoMdVideocam />
            </span>{" "}
            <span className={`${styles.PlanText}`}>
              <span className={`${styles.DiffText}`}>LIVE</span> ITR Filing is
              now easy and convenient.
            </span>
          </h2>

          <div>
            <h3 className={styles.subtitle}>
              Choose The Plan According To Your Source Of Income, Residential
              Status, And Requirements.
            </h3>
            {/* <p className="text-center" style={{
              color: "red",
              fontSize: "1.0rem",
              fontWeight: "500"
            }}>
              Missed filing your return before 31st July 2023? You can file a belated income tax return.
              Please note that filing your income tax return under section 139(4) after the due date will attract penalties as per section 234F of the Income Tax Act. The penalty amount of Rs. 1000/- or Rs. 5000/- will be levied based on the income slab.
            </p> */}
          </div>

          <div className={`${styles.ITRplanCards}`}>
            <div className={`${styles.Plancards}`}>
              <div className={`${(styles.SavingPrice)}`}>
                &#8377; 400 Saving
              </div>
              <p className={`${styles.plantype}`}>
                {plans && plans[0]?.plan_name}
              </p>
              <div className={`${styles.SlashPrice}`}>
                Normally &#8377; 2400
              </div>
              <div className={`${styles.PlanPrice}`}>
                &#8377; {numberFormat(plans && plans[0]?.plan_original_price)}{" "}
              </div>
              <div className={`${styles.borderBtm}`}></div>
              <div className={`${styles.PlanFeatures}`}>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  Live Tax Expert Filing in 30 Min via Zoom Meeting
                </div>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  Multiple form 16
                </div>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  Multiple House Property
                </div>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  Multiple Other Sources Income
                </div>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  No Capital Gains
                </div>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  Disclosure of Shares Held in Unlisted Companies
                </div>
              </div>
              <div className={`${styles.PlanBuy}`}>
                {[
                  "/web/income-tax-filing-ae",
                  "/web/income-tax-filing",
                ].indexOf(removeSlash(currentLocation)) > -1 ? (
                  <>
                    <button
                      className="text-decoration-none"
                      onClick={() => {
                        if (getUserId() == null) {
                          handleClickGuest(0);
                        } else {
                          handleClick(0);
                        }
                      }}
                    >
                      Buy Now
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="text-decoration-none"
                      onClick={() => {
                        if (getUserId() == null) {
                          handleClickGuest(0);
                        } else {
                          handleClick(0);
                        }
                      }}
                    >
                      Buy Now
                    </button>
                  </>
                )}
              </div>
              {["/web/income-tax-filing-ae", "/web/income-tax-filing"].indexOf(
                removeSlash(currentLocation)
              ) > -1 ? (
                <></>
              ) : (
                <>
                  <div className={`${dynamicClass} ${styles.PlanMoreDetails}`}>
                    <a
                      className="text-decoration-none pointer"
                      onClick={() => {
                        setItemLocal("pid", plans[0]);
                        check2024();
                        navigate(`${process.env.PUBLIC_URL}/itr-plan`);
                      }}
                    >
                      Know More <HiArrowSmRight />
                    </a>
                  </div>
                </>
              )}
            </div>
            <div className={`${styles.Plancards}`}>
              {/* <div className={`${styles.popularTag}`}>Most Popular</div> */}
              <div className={`${(styles.SavingPrice)}`}>
                &#8377; 700 Saving
              </div>
              <p className={`${styles.plantype}`}>
                {plans && plans[1]?.plan_name}
                {/* <span className={`${styles.Premium}`}> (Premium)</span>{" "} */}
              </p>
              <div className={`${styles.SlashPrice}`}>
                Normally &#8377; 4200
              </div>
              <div className={`${styles.PlanPrice}`}>
                &#8377; {numberFormat(plans && plans[1]?.plan_original_price)}{" "}
              </div>
              <div className={`${styles.borderBtm}`}></div>
              <div className={`${styles.PlanFeatures}`}>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  Live Tax Expert Filing in 30 Min via Zoom Meeting
                </div>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  Multiple form 16
                </div>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  Multiple House Property
                </div>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  Multiple Other Sources Income
                </div>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  Capital Gains from MF/Share/Property or any other capital
                  assets
                </div>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  Salary Arrear + Form 10E Filing
                </div>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  Assets & Liabilities Schedule Disclosure
                </div>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  Disclosure of Shares Held in Unlisted Companies
                </div>
              </div>
              <div className={`${styles.PlanBuy}`}>
                {[
                  "/web/income-tax-filing-ae",
                  "/web/income-tax-filing",
                ].indexOf(removeSlash(currentLocation)) > -1 ? (
                  <>
                    <button
                      className="text-decoration-none"
                      onClick={() => {
                        if (getUserId() == null) {
                          handleClickGuest(1);
                        } else {
                          handleClick(1);
                        }
                      }}
                    >
                      Buy Now
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="text-decoration-none"
                      onClick={() => {
                        if (getUserId() == null) {
                          handleClickGuest(1);
                        } else {
                          handleClick(1);
                        }
                      }}
                    >
                      Buy Now
                    </button>
                  </>
                )}
              </div>
              {["/web/income-tax-filing-ae", "/web/income-tax-filing"].indexOf(
                removeSlash(currentLocation)
              ) > -1 ? (
                <></>
              ) : (
                <>
                  <div className={`${dynamicClass} ${styles.PlanMoreDetails}`}>
                    <a
                      className="text-decoration-none pointer"
                      onClick={() => {
                        setItemLocal("pid", plans[1]);
                        check2024();
                        navigate(`${process.env.PUBLIC_URL}/itr-plan`);
                      }}
                    >
                      Know More <HiArrowSmRight />
                    </a>
                  </div>
                </>
              )}
            </div>
            <div className={`${styles.Plancards}`}>
              <div className={`${(styles.SavingPrice)}`}>
                &#8377; 1200 Saving
              </div>
              <p className={`${styles.plantype}`}>
                {plans && plans[2]?.plan_name}
              </p>
              <div className={`${styles.SlashPrice}`}>
                Normally &#8377; 7200
              </div>
              <div className={`${styles.PlanPrice}`}>
                &#8377; {numberFormat(plans && plans[2]?.plan_original_price)}{" "}
              </div>
              <div className={`${styles.borderBtm}`}></div>
              <div className={`${styles.PlanFeatures}`}>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  Live Tax Expert Filing in 30 Min via Zoom Meeting
                </div>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  Multiple form 16
                </div>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  Multiple House Property
                </div>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  Multiple Other Sources Income
                </div>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  Capital Gains from MF/Share/Property or any other capital
                  assets
                </div>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  Availing Benefits of Double Taxation Avoidance Agreement
                </div>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  Computation & Disclosure of Foreign Income
                </div>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  Assets & Liabilities Schedule Disclosure in India
                </div>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  Assets Disclosure in Foreign Countries
                </div>
              </div>

              <div className={`${styles.PlanBuy}`}>
                {[
                  "/web/income-tax-filing-ae",
                  "/web/income-tax-filing",
                ].indexOf(removeSlash(currentLocation)) > -1 ? (
                  <>
                    <button
                      className="text-decoration-none"
                      onClick={() => {
                        if (getUserId() == null) {
                          handleClickGuest(2);
                        } else {
                          handleClick(2);
                        }
                      }}
                    >
                      Buy Now
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="text-decoration-none"
                      onClick={() => {
                        if (getUserId() == null) {
                          handleClickGuest(2);
                        } else {
                          handleClick(2);
                        }
                      }}
                    >
                      Buy Now
                    </button>
                  </>
                )}
              </div>
              {["/web/income-tax-filing-ae", "/web/income-tax-filing"].indexOf(
                removeSlash(currentLocation)
              ) > -1 ? (
                <></>
              ) : (
                <>
                  <div className={`${dynamicClass} ${styles.PlanMoreDetails}`}>
                    <a
                      className="text-decoration-none pointer"
                      onClick={() => {
                        setItemLocal("pid", plans[2]);
                        check2024();
                        navigate(`${process.env.PUBLIC_URL}/itr-plan`);
                      }}
                    >
                      Know More <HiArrowSmRight />
                    </a>
                  </div>
                </>
              )}
            </div>
            <div className={`${styles.Plancards}`}>
              <div className={`${(styles.SavingPrice)}`}>
                &#8377; 700 Saving
              </div>
              <p className={`${styles.plantype}`}>
                {plans && plans[3]?.plan_name}
              </p>
              <div className={`${styles.SlashPrice}`}>
                Normally &#8377; 4200
              </div>
              <div className={`${styles.PlanPrice}`}>
                &#8377; {numberFormat(plans && plans[3]?.plan_original_price)}{" "}
              </div>
              <div className={`${styles.borderBtm}`}></div>
              <div className={`${styles.PlanFeatures}`}>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  Live Tax Expert Filing in 30 Min via Zoom Meeting
                </div>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  Multiple form 16
                </div>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  Multiple House Property
                </div>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  Multiple Other Sources Income
                </div>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  Documents Follow Ups
                </div>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  Tax Planning for Businessess & Professionals
                </div>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  Calculation of Presumptive Income
                </div>
              </div>

              <div className={`${styles.PlanBuy}`}>
                {[
                  "/web/income-tax-filing-ae",
                  "/web/income-tax-filing",
                ].indexOf(removeSlash(currentLocation)) > -1 ? (
                  <>
                    <button
                      className="text-decoration-none"
                      onClick={() => {
                        if (getUserId() == null) {
                          handleClickGuest(3);
                        } else {
                          handleClick(3);
                        }
                      }}
                    >
                      Buy Now
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="text-decoration-none"
                      onClick={() => {
                        if (getUserId() == null) {
                          handleClickGuest(3);
                        } else {
                          handleClick(3);
                        }
                      }}
                    >
                      Buy Now
                    </button>
                  </>
                )}
              </div>
              {["/web/income-tax-filing-ae", "/web/income-tax-filing"].indexOf(
                removeSlash(currentLocation)
              ) > -1 ? (
                <></>
              ) : (
                <>
                  <div className={`${dynamicClass} ${styles.PlanMoreDetails}`}>
                    <a
                      className="text-decoration-none pointer "
                      onClick={() => {
                        setItemLocal("pid", plans[3]);
                        check2024();
                        navigate(`${process.env.PUBLIC_URL}/itr-plan`);
                      }}
                    >
                      Know More <HiArrowSmRight />
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={`${styles.gstText}`}>
            GST and applicable taxes will be charged extra.
          </div>
        </div>
      </section>
    </>
  );
}

export default WidgetSection;
