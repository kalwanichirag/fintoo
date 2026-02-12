import { useState, useEffect } from "react";
import styles from "./style.module.css";
import { IoMdVideocam } from "react-icons/io";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { HiArrowSmRight } from "react-icons/hi";
import { apiCall, fetchEncryptData, getUserId, loginRedirectGuest, setItemLocal } from "../../../../common_utilities";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UaePrice = () => {
  const [plans, setPlans] = useState({});
  const [aedAmount, setAmountAED] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    onLoadInit();
    return () => {};
  }, []);

  useEffect(() => {
    // Replace 'YOUR_API_KEY' with your actual API key
    const API_KEY = 'qo5P3syl1NavkNzoOPPRljfROvX5EBvshoP5OjwE';

    const convertCurrency = async () => { 
      try {
        const response = await axios.get("https://v6.exchangerate-api.com/v6/6f615f8cbdb274481e65cb95/latest/INR"
          // "https://api.freecurrencyapi.com/v1/latest?apikey=qo5P3syl1NavkNzoOPPRljfROvX5EBvshoP5OjwE"
          // `https://v6.exchangeratesapi.io/latest?base=INR&symbols=AED&access_key=${API_KEY}`
        );
        // const data = response.data.conversion_rates.AED;
        const exchangeRate = response.data.conversion_rates.AED;

        const convertedAmount = exchangeRate;
        setAmountAED(convertedAmount);
        sessionStorage.setItem('aed_rate', convertedAmount);

      } catch (error) {
        console.error('Error converting currency:', error);
      }
    };

    convertCurrency();
  }, []);

  const onLoadInit = async () => {
    try {
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
    
      setItemLocal('pid', plans[pid])
      navigate(`${process.env.PUBLIC_URL}/itr-profile`);
    
  }

  return (
    <>
      <div id="ITRVideoSection"></div>
      <section className={`${styles.ITRVideoSection}`}>
        <div className={`${styles.ITRCardssectioncontainer}`}>
          <h2 className="d-flex justify-between align-items-center ">
            <span className={`${styles.icon}`}>
              <IoMdVideocam />
            </span>{" "}
           <span className={`${styles.PlanText}`}> <span className={`${styles.DiffText}`}>LIVE</span> &nbsp; ITR Filing Plans for Individuals</span>
          </h2>
          <div className={`${styles.ITRplanCards}`}>
            <div className={`${styles.Plancards}`}>
              <p className={`${styles.plantype}`}>
                {plans && plans[0]?.plan_name}
              </p>
             
              <div className={`${styles.PlanPrice}`}>
              AED {(plans && plans[0]?.plan_amount*aedAmount).toFixed(2)}{" "}
                {/* <sup>
                  &#8377; <span>2499</span>{" "}
                </sup> */}
              </div>
              <div className={`${styles.borderBtm}`}></div>
              <div className={`${styles.PlanFeatures}`}>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  Live Tax Expert Filing in 60 Min via Zoom Meeting
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
                  Salary Income Below 50 Lacs
                </div>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  No Capital Gains
                </div>
              </div>
              <div className={`${styles.PlanBuy}`}>
                <button
                  className="text-decoration-none"
                  onClick={() => {
                    if(getUserId() == null) {
                      loginRedirectGuest();
                    } 
                    else{
                    handleClick(0);
                    }
                  }}
                >
                  Buy Now
                </button>
              </div>
              <div className={`${styles.PlanMoreDetails}`}>
                <a
                  className="text-decoration-none pointer"
                  onClick={() => {
                    handleClick(0);
                    navigate(`${process.env.PUBLIC_URL}/itr-plan?country=UAE`);
                  }}
                >
                  Know More <HiArrowSmRight />
                </a>
              </div>
            </div>
            <div className={`${styles.Plancards}`}>
              {/* <div className={`${styles.popularTag}`}>Most Popular</div> */}

              <p className={`${styles.plantype}`}>
                {plans && plans[1]?.plan_name}
                {/* <span className={`${styles.Premium}`}> (Premium)</span>{" "} */}
              </p>
             
              <div className={`${styles.PlanPrice}`}>
              AED  {(plans && plans[1]?.plan_amount*aedAmount).toFixed(2)}{" "}
                {/* <sup>
                  &#8377; <span>4999</span>{" "}
                </sup> */}
              </div>
              <div className={`${styles.borderBtm}`}></div>
              <div className={`${styles.PlanFeatures}`}>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  Live Tax Expert Filing in 60 Min via Zoom Meeting
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
                  Capital Gains from MF/Shared/Property or any other capital
                  assets
                </div>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  ESOPS / RSU Computation
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
                  Salary Income More than 50 Lacs
                </div>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  Assets & Liabilities Schedule Disclosure
                </div>
              </div>
              <div className={`${styles.PlanBuy}`}>
                <button
                  className="text-decoration-none "
                  onClick={() => {
                    if(getUserId() == null) {
                      loginRedirectGuest();
                    } 
                    else{
                      handleClick(1);
                    }
                  }}
                >
                  Buy Now
                </button>
              </div>
              <div className={`${styles.PlanMoreDetails}`}>
                <a
                  className="text-decoration-none pointer"
                  onClick={() => {
                    handleClick(1);
                    navigate(`${process.env.PUBLIC_URL}/itr-plan?country=UAE`);
                  }}
                >
                  Know More <HiArrowSmRight />
                </a>
              </div>
            </div>
            <div className={`${styles.Plancards}`}>
              <p className={`${styles.plantype}`}>
                {plans && plans[2]?.plan_name}
              </p>
             
              <div className={`${styles.PlanPrice}`}>
            AED  {(plans && plans[2]?.plan_amount*aedAmount).toFixed(2)}
                {/* <sup>
                  &#8377; <span>7999</span>{" "}
                </sup> */}
              </div>
              <div className={`${styles.borderBtm}`}></div>
              <div className={`${styles.PlanFeatures}`}>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  Live Tax Expert Filing in 60 Min via Zoom Meeting
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
                  Capital Gains from MF/Shared/Property or any other capital assets
                </div>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  ESOPS / RSU Computation
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
                <button
                  className="text-decoration-none "
                  onClick={() => {
                    if(getUserId() == null) {
                      loginRedirectGuest();
                    } 
                    else{
                      handleClick(2);
                    }
                    
                  }}
                >
                  Buy Now
                </button>
              </div>
              <div className={`${styles.PlanMoreDetails}`}>
                <a
                  className="text-decoration-none pointer"
                  onClick={() => {
                    handleClick(2);
                    navigate(`${process.env.PUBLIC_URL}/itr-plan?country=UAE`);
                  }}
                >
                  Know More <HiArrowSmRight />
                </a>
              </div>
            </div>
            <div className={`${styles.Plancards}`}>
              <p className={`${styles.plantype}`}>
                {plans && plans[3]?.plan_name}
              </p>
             
              <div className={`${styles.PlanPrice}`}>
             AED {(plans && plans[3]?.plan_amount*aedAmount).toFixed(2)}{" "}
                {/* <sup>
                  &#8377; <span>4999</span>{" "}
                </sup> */}
              </div>
              <div className={`${styles.borderBtm}`}></div>
              <div className={`${styles.PlanFeatures}`}>
                <div className="d-flex">
                  <span className={`${styles.Check}`}>
                    <IoIosCheckmarkCircleOutline />{" "}
                  </span>{" "}
                  Live Tax Expert Filing in 60 Min via Zoom Meeting
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
                  <button
                    className="text-decoration-none"
                    onClick={() => {
                      if(getUserId() == null) {
                        loginRedirectGuest();
                      } 
                      else{
                        handleClick(3);
                      }
                      

                    }}

                  >
                    Buy Now
                  </button>
              </div>
              <div className={`${styles.PlanMoreDetails}`}>
                <a
                  className="text-decoration-none pointer "
                  onClick={() => {
                    handleClick(3);
                    navigate(`${process.env.PUBLIC_URL}/itr-plan?country=UAE`)
                  }}
                >
                  Know More <HiArrowSmRight />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default UaePrice;
