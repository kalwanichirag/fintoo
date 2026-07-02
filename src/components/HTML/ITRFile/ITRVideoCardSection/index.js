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
import axios from "axios";
import { X_CRM_ACCESS_TOKEN, X_CRM_USER } from "../../../../constants";
import { beginItrSignupJourney } from "../../../../Utils/Webengage/itrSignupTracking";

function WidgetSection() {
  const [plans, setPlans] = useState([]);
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

  const trackPlanClick = (eventName, plan) => {
    const mrp = Number(plan?.plan_description?.original_amount) || 0;
    const listPrice = Number(plan?.plan_amount) || 0;

    if (window?.webengage?.track) {
      window.webengage.track(eventName, {
        url: window.location.href,
        "list price": listPrice,
        MRP: mrp,
        "list discount": mrp - listPrice,
        "plan name": plan?.plan_name || "",
        "plan id": plan?.name || plan?.plan_id || plan?.plan_uuid || "",
        Service: plan?.service || "ITR Filing",
      });
    }
  };

  const onLoadInit = async () => {
    try {
      if (!window.location.href.includes("itr_2024")) {
        deleteCookie("itr-page");
      }

      if (getUserId() && localStorage.getItem("isGuest")) {
        localStorage.removeItem("isGuest");
        navigate(`${process.env.PUBLIC_URL}/itr-profile`);
        return;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_CRM_BASE_URL}/get_plan_category_list`,
        {
          headers: {
            "X-CRM-Access-Token": X_CRM_ACCESS_TOKEN,
            "X-CRM-User": X_CRM_USER,
          },
        }
      );

      const plansData = response?.data?.data || [];

      const itrPlans = plansData.filter(
        (plan) => plan.service === "ITR Filing"
      );

      const formattedPlans = itrPlans.map((plan) => ({
        ...plan,
        plan_description: plan.plan_description
          ? JSON.parse(plan.plan_description)
          : null,
      }))
        .sort((a, b) => Number(a.plan_amount) - Number(b.plan_amount));
      setPlans(formattedPlans);
    } catch (e) {
      console.log("Plan API Error:", e);
    }
  };

  const handleClick = (plan) => {
    setItemLocal("pid", plan);
    check2024();
    navigate(`${process.env.PUBLIC_URL}/itr-profile`);
  };

  const check2024 = () => {
    if(window.location.href.includes("itr_2024")) {
      createCookie("itr-page", "itr_2024", 20);
    }
  }

  const handleClickGuest = (plan) => {
    setItemLocal("pid", plan);
    localStorage.setItem("isGuest", 1);
    check2024();

    loginRedirectGuest(
      "itr",
      `${window.location.origin}${process.env.PUBLIC_URL}/itr-profile`
    );
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

          <div className={styles.ITRplanCards}>
            {plans?.map((plan, index) => {
              const originalAmount = plan?.plan_description?.original_amount || 0;
              const planAmount = plan?.plan_amount || 0;
              const savingAmount = originalAmount - planAmount;

              return (
                <div className={styles.Plancards} key={plan.name}>
                  <div className={styles.SavingPrice}>
                    ₹ {savingAmount} Saving
                  </div>

                  <p className={styles.plantype}>
                    {plan?.plan_name}
                  </p>

                  <div className={styles.SlashPrice}>
                    Normally ₹ {numberFormat(originalAmount)}
                  </div>

                  <div className={styles.PlanPrice}>
                    ₹ {numberFormat(planAmount)}
                  </div>

                  <div className={styles.borderBtm}></div>

                  <div className={styles.PlanFeatures}>
                    {plan?.plan_description?.description?.map(
                      (feature, featureIndex) => (
                        <div className="d-flex" key={featureIndex}>
                          <span className={styles.Check}>
                            <IoIosCheckmarkCircleOutline />
                          </span>
                          {feature}
                        </div>
                      )
                    )}
                  </div>

                  <div className={styles.PlanBuy}>
                    <button
                      className="text-decoration-none"
                      onClick={() => {
                        trackPlanClick("buy now clicked", plan);
                        if (getUserId() == null) {
                          beginItrSignupJourney(plan);
                          handleClickGuest(plan);
                        } else {
                          handleClick(plan);
                        }
                      }}
                    >
                      Buy Now
                    </button>
                  </div>

                  {![
                    "/web/income-tax-filing-ae",
                    "/web/income-tax-filing",
                  ].includes(removeSlash(currentLocation)) && (
                      <div
                        className={`${dynamicClass} ${styles.PlanMoreDetails}`}
                      >
                        <a
                          className="text-decoration-none pointer"
                          onClick={() => {
                            trackPlanClick("know more clicked", plan);
                            setItemLocal("pid", plan);
                            check2024();
                            navigate(
                              `${process.env.PUBLIC_URL}/itr-plan`
                            );
                          }}
                        >
                          Know More <HiArrowSmRight />
                        </a>
                      </div>
                    )}
                </div>
              );
            })}
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
