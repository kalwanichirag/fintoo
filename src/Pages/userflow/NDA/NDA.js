import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getParentUserId, getItemLocal, apiCall, loginRedirectGuest, setBackgroundDivImage } from "../../../common_utilities";
import { CHECK_SESSION, BASE_API_URL, imagePath, DATA_BELONGS_TO } from "../../../constants";
import Styles from "./NDA.module.css";
import commonEncode from '../../../commonEncode';
import FintooLoader from '../../../components/FintooLoader';
import HideHeader from "../../../components/HideHeader";
import HideFooter from "../../../components/HideFooter";
import { Getexpertnda, getndadoc, getpricinglist } from "../../../FrappeIntegration-Services/services/payment-api/paymentapiService";

function NDA() {
  const [userNDA, setNDA] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [pricingData, setPricingData] = useState([]);
  const [taxPricingData, setTaxPricingData] = useState([]);

  useEffect(() => {

    document.getElementById('bg-about').style.background = 'url(' + imagePath +
      '/static/assets/img/bg/about.svg)' + " no-repeat right top";

    setBackgroundDivImage();

    document.body.classList.add("NDA-Page");

  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await getPlanDetails();
    };
  
    fetchData();
  }, []);
  
  // const getMemberList = async () => {
  //   setIsLoading(true)
  //   try {
  //     let url = '';
// let url = CHECK_SESSION;
  //     let data = { user_id: getParentUserId(), sky: getItemLocal("sky") };

  //     let session_data = await apiCall(url, data, true, false);
  //     if (session_data.error_code == "100") {
  //       let url = BASE_API_URL + "restapi/expertflow/expertnda/";
  //       if (session_data.data['plan_id']) {
  //         setIsLoading(false)

  //         if (session_data.data['plan_id'] == 29) {
  //           var nda_payload = { user_id: getParentUserId(), skip_accept_check: 1 }

  //           let nda_api_call = await apiCall(url, nda_payload, true, false);

  //           if (nda_api_call.error_code == "100") {

  //             setNDA(nda_api_call.data)
  //           }
  //         }
  //         else if (session_data.data['plan_id'] == 31) {
  //           var nda_payload = { user_id: getParentUserId() }
  //           let nda_api_call = await apiCall(url, nda_payload, true, false);

  //           if (nda_api_call.error_code == "100") {

  //             setNDA(nda_api_call.data)
  //           }
  //         }
  //       }

  //       else {
  //         setIsLoading(false)

  //         var nda_payload = { user_id: getParentUserId(), skip_accept_check: 1 }
  //         let nda_api_call = await apiCall(url, nda_payload, true, false);

  //         if (nda_api_call.error_code == "100") {

  //           setNDA(nda_api_call.data)
  //         }
  //       }


  //     }
  //     else {
  //       loginRedirectGuest()
  //     }




  //   } catch (e) {
  //     setIsLoading(false)

  //     console.log("err", e);
  //   }
  // };

  // 31 fp_expert
  // 29 fp_robo

  const getPlanDetails = async () => {
    try {
      setIsLoading(true);
      const pricing_data = await getpricinglist();
  
      if (pricing_data.status_code === 200) {
        const filteredPlans = pricing_data.data.filter(
          (p) => p.plan_uuid === "fp_expert" || p.plan_name === "Financial Health Checkup"
        );
        await getMemberList(filteredPlans.map((data) => data.plan_uuid));
      }
  
      setIsLoading(false);
    } catch (err) {
      console.error("Error in getPlanDetails:", err);
      setIsLoading(false);
    }
  };
  

  const getMemberList = async (pricingPlanUUIDs) => {
    try {
      const user_id = getParentUserId();
      const databelongsto = DATA_BELONGS_TO;
  
      if (pricingPlanUUIDs.includes("fp_robo") || pricingPlanUUIDs.includes("fp_expert")) {
        const nda_api_call = await Getexpertnda(user_id, databelongsto);
        if (nda_api_call.status_code === "200") {
          setNDA(nda_api_call.data);
        }
      } else {
        loginRedirectGuest();
      }
  
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.error("Error in getMemberList:", e);
    }
  };
  
  return (

    <div className={`${Styles.NDApage}`}>
      <FintooLoader isLoading={isLoading} />

      <section className="basic-details-section bg-white ">
        <div className="container-fluid">
          <div className={`${Styles.backgrounddiv} background-div`}>
            <div className={`${Styles.bg} ${Styles.active}`} id="bg-about" />
            <div className="top-wrapper">
              <Link
                to={
                  process.env.PUBLIC_URL +
                  "/userflow/payment/"
                }
                className={`${Styles.backarrow}`}
              >
                <img
                  ng-src="https://stg.minty.co.in/static/userflow/img/icons/back-arrow.svg"
                  alt="Back Arrow"
                  src="https://stg.minty.co.in/static/userflow/img/icons/back-arrow.svg"
                />
              </Link>
            </div>
          </div>

          <div className="row h-100 align-items-center  justify-content-center">
            <div className="col-md-12">
              <div className="row justify-content-center">
                <div className="col-md-10">
                  <div className={`${Styles.ndacontent}`}>
                    <div
                      className={`${Styles.rContent}`}
                      id="rcontentt"
                      style={{ textAlign: "justify", maxWidth: "100%" }}
                    >

                      <div dangerouslySetInnerHTML={{ __html: userNDA }} />

                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <HideFooter />
    </div>
  );
}

export default NDA;
