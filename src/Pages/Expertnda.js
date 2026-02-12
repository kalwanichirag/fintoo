import React, { useEffect, useRef, useState } from "react";
import Styles from "./Expertfp.module.css";
import HideHeader from "../components/HideHeader";
import HideFooter from "../components/HideFooter";
import { Link } from "react-router-dom";
import FintooLoader from "../components/FintooLoader";
import commonEncode from "../commonEncode";
import {
  apiCall,
  getItemLocal,
  getParentUserId,
  getUserId, loginRedirectGuest, fetchData, getFpLogId, setFplogid,
  setItemLocal,
} from "../common_utilities";
import { useNavigate } from "react-router-dom";
import { Getexpertnda, getndadoc, Getpaymentstatus } from "../FrappeIntegration-Services/services/payment-api/paymentapiService";
import Cookies from "js-cookie"
import { Expertfinflowgetrmemail, SendEmail, SendSMs } from "../FrappeIntegration-Services/services/financial-planning-api/ndaflow";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import { check_all_status_api } from "../FrappeIntegration-Services/services/user-management-api/userApiService";
import { DATA_BELONGS_TO } from "../constants";
const Expertnda = () => {

  const user_data = JSON.parse(localStorage.getItem("user_data") || '{}');

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [termsError, setTermsMsg] = useState("");
  const [isTermsChecked, setTerms] = useState(false);
  const sessionRef = useRef(null);
  const [expertNDA, setExpertNDA] = useState("");
  const [plan_uuid, setPlanuuid] = useState("");
  const [fullName, setFullName] = useState(user_data ? user_data.user_name : "");

  const handleCheckAllStatus = async () => {
    ;
    try {
        if (user_data) {
            const result = await check_all_status_api(getParentUserId());

            if (result?.status_code === "200") {
                const {
                  plan_uuid
                } = result?.data;

                setPlanuuid(plan_uuid);
            } else {
                console.error("Status check failed:", result?.message);
            }
        } else {
            console.error("User ID not found.");
        }
    } catch (error) {
        console.error("Error checking user status:", error);
    }
};

  useEffect(() => {
    getSessiondata();
    handleCheckAllStatus();
    // getExpertNDAData();
  }, []);

  const Tokendata = Cookies.get("token") || null;

  const getSessiondata = ()=>{
    if(Tokendata) {
      getExpertNDAData()
    } else{
      loginRedirectGuest()
    }
  }

  

  // const getSessionData = async () => {

  //   try {
  //     let url = '';
// let url = CHECK_SESSION;
  //     let data = { user_id: getParentUserId(), sky: getItemLocal("sky") };

  //     var session_data = await apiCall(url, data, true, false);

  //     if (session_data.error_code == "102") {
  //       loginRedirectGuest();
  //     } else {
  //       sessionRef.current = session_data.data;

  //       if (session_data.data['fp_lifecycle_status'] == "0" ||
  //         session_data.data["fp_lifecycle_status"] == "" ||
  //         !session_data.data["fp_lifecycle_status"]) {
  //         getExpertNDAData();
  //       }
  //       else {
  //         window.location.href = '/web/datagathering/about-you/';
  //       }
  //     }
  //   } catch (e) {
  //     console.log("err", e);
  //   }
  // };

  // const getFullname = async () => {
  //   try {
  //     var payload = {
  //       url: AUTH_URL,
  //       method: "GET"
  //     };

  //     var auth_resp = JSON.parse(commonEncode.decrypt(await fetchData(payload)));
  //     if (auth_resp.error_code == "0") {
  //       var auth_user_details = auth_resp.data['user_details'];

  //       if (auth_user_details["last_name"]) {
  //         setFullName(auth_user_details['first_name'] + " " + auth_user_details['last_name']);
  //       } else {
  //         setFullName(auth_user_details['first_name']);
  //       }
  //     }
  //   } catch (e) {
  //     console.log("err", e);
  //   }
  // }

  const getExpertNDAData = async () => {
    // getFullname();

    try {
    const user_id = getParentUserId();
      const databelongsto = DATA_BELONGS_TO;
      var response =  await Getexpertnda(user_id, databelongsto);

      if (response.status_code == "200") {
        setExpertNDA(response['data']);
      } else{
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success(response.message);
        navigate(process.env.PUBLIC_URL + '/datagathering/about-you/');
      }
    } catch (e) {
      console.log("err", e);
    }

  }

  const handleCheckboxClick = (e) => {
    var checked = e.target.checked;

    if (checked == false) {
      setTermsMsg("Please agree to proceed");
    } else {
      setTermsMsg("");
    }
    setTerms(e.target.checked);
  };

  const handleSubmit = (event) => {

    event.preventDefault();
    event.stopPropagation();

    if (isTermsChecked == false) {
      setTermsMsg("Please agree to proceed");
    }
    else if (isTermsChecked && termsError == '') {
      agreeOnNda();
    }

  };

  // const agreeOnNda = async () => {

  //   try {
  //     var config = {
  //       method: "POST",
  //       url: ADVISORY_UPDATE_CURRENT_STEP,
  //       data: {
  //         step: 1,
  //         fp_log_id: sessionRef.current["fp_log_id"],
  //       },
  //     };

  //     let lc_response = await fetchData(config);

  //     if (lc_response["error_code"] == "100") {
  //       var fp_lifecycle_status = 1;
  //       sessionStorage.setItem("showNDAcompletionToast", "1");

  //       await updateAuthData({ fp_lifecycle_status: 1, nda_flag: "1" });
  //     } else {
  //       console.log(lc_response);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  const agreeOnNda = async (payload) => {

    try {
        var fppayload = {
         user_id : getParentUserId(),
         plan_uuid : plan_uuid
        }

        let fp_response = await getndadoc(fppayload);

        if (fp_response.status_code == "200") {
          var nda_attachment = [fp_response['data']['file_url']];

          try {
            const  user_id = getParentUserId();
            // let rm_response = await Expertfinflowgetrmemail();
            
            const payload = {
              user_id: getParentUserId(),
              data_belongs_to: DATA_BELONGS_TO
            }
            const res = await Getpaymentstatus(payload)
          
            var rm_email = res?.data?.rm_data?.emp_email || '';
            var rm_name = res?.data?.rm_data?.emp_name || '';
            var rm_mobile = res?.data?.rm_data?.emp_mobile || '';
            // var rm_designation = rm_response?.data?.expert_designation || '';

            // var emailDataUser = {
            //   "userdata": { "to": user_data?.user_email },
            //   "subject": "Non-Disclosure Agreement From Fintoo",
            //   "template": "NDA_completed.html",
            //   "attachment": nda_attachment,
            //   "contextvar": {
            //     "encodeduserid": btoa('00' + user_data?.user_id),
            //     "fullname": fullName,
            //     "id": user_data?.user_id,
            //     "fp_log_id": sessionRef.current['fp_log_id'],
            //     "rm_email": rm_email,
            //     "rm_name": rm_name,
            //     "rm_mobile": rm_mobile,
            //     "rm_designation": rm_designation
            //   }
            // }
           

            //send email to RM
             var emaildataRm = {
              "userdata": { "to": rm_email },
              "subject": " NDA confirmation from Client!",
              "template": "NDA_completed_rm.html",
              "attachment_files": nda_attachment,
              "contextvar": {
                "encodeduserid": btoa('00' + user_id),
                "fullname": fullName,
                "client_email": user_data?.user_email,
                "client_mobile": user_data?.user_mobile,
                "id": user_id,
                // "fp_log_id": sessionRef.current['fp_log_id'],
                // "link": "login-to-module/?" + "uKey=" + btoa(user_id) + "&authtoken=" + btoa(master_psw)
                "link": ""
              }
            };
            let rm_email_resp = await SendEmail(emaildataRm);

            var smsdata = {
              "msg": "Dear " + fullName + ",\r\nThank you for accepting the NDA. Once again we would like to assure you that we completely understand the importance of data and its security is always our topmost priority. For any help or query, please feel free to get in touch with your Wealth Manager; Name: " + rm_name + "\r\nPhone: " + rm_mobile + "\r\Email: " + rm_email + "\r\nTeam Fintoo",
              "whatsapptext": "Dear " + fullName + ",\nThank you for accepting the NDA. Once again we would like to assure you that we completely understand the importance of data and its security is always our topmost priority. For any help or query, please feel free to get in touch with your Wealth Manager; Name: " + rm_name + " Phone: " + rm_mobile + " Email: " + rm_email,
              "mobile": user_data?.user_mobile,
              "sms_api_id": "FintooNDAAccepted"
            };

            let sms_resp = await SendSMs(smsdata);
            if (sms_resp.sms.success == true) {
              
              if (rm_mobile != "") {
                var smsdata = {
                  msg:
                    "Dear " +
                    rm_name +
                    ",\r\nOur client, " +
                    fullName +
                    " has accepted the NDA. Request you to initiate the next step.\r\nTeam Fintoo",
                  mobile: rm_mobile,
                  whatsapptext:
                    "Dear " +
                    rm_name +
                    ", Our client, " +
                    fullName +
                    " has accepted the NDA. Request you to initiate the next step.",
                  sms_api_id: "FintooNDAAcceptedWM",
                };
                let sms_rm_resp = await SendSMs(smsdata);
                // if (sms_rm_resp.sms.success == true) {
                //   navigate(process.env.PUBLIC_URL + '/datagathering/about-you/');
                // }
                navigate(process.env.PUBLIC_URL + '/datagathering/about-you/');
              } else {
                navigate(process.env.PUBLIC_URL + '/datagathering/about-you/');
              }
            } 
            else{
              navigate(process.env.PUBLIC_URL + '/datagathering/about-you/');
            }

          } catch (e) {
            console.log("error: ", e);
          }

        }
    

    } catch (e) {
      console.error(e);
    }
  }

  return (

    <div className={`${Styles.ExpertNda}`}>
      <HideHeader />
      {/* <FintooLoader isLoading={isLoading} /> */}
      <div className={`${Styles.whitebox}`}>
        <div className="container-fluid">
          {/* <div className={`${Styles.backlink}`}>
            <Link to={process.env.PUBLIC_URL + "/datagathering/about-you"}>
              <div className={`${Styles.backarrow}`}>
                <img src="https://static.fintoo.in/static/userflow/img/icons/back-arrow.svg" />
              </div>
            </Link>
          </div> */}
          <div className="row">
            <div className="col-md-12">
              <div className="row ">
                <div className="col-md-6 mt-5 h-100">
                  <h3 className={`${Styles.ndacontent}`}>
                    Non Disclosure Agreement
                  </h3>
                  <p className={`${Styles.ndahighlight}`}><span>**</span> &nbsp;In order to continue with expert plan, please accept this agreement.</p>

                  <div className="h-100 mt-5">
                    <p
                      className={`${Styles.fpcontent}`}
                    >
                      <div dangerouslySetInnerHTML={{ __html: expertNDA }} />
                    </p>
                  </div>

                  <div
                    className={`checkbox-container position-relative ${Styles.expertNdaCheckbox}`} >

                    <input
                      type="checkbox"
                      name=""
                      tabIndex="1"
                      className="custom-checkbox"
                      id="terms"
                      checked={isTermsChecked}
                      onChange={handleCheckboxClick}
                    />
                    <label
                      htmlFor="terms"
                      style={{
                        paddingTop: "2px",
                        fontSize: "15px",
                      }}
                    >
                      I accept the &nbsp;
                      <Link
                        className={`${Styles.LinkTerms}`} style={{
                          fontWeight: "500",
                        }}
                        to={process.env.PUBLIC_URL + "/terms-conditions"}
                      >
                        Terms & Conditions</Link>*
                      <br></br>
                      <span className="error">{termsError}</span>

                    </label>

                    <button
                      style={{
                        width: "max-content"
                      }}
                      type={"button"}
                      className={`${Styles.Proceedbtn}`}
                      onClick={handleSubmit}
                    >
                      Proceed
                    </button>
                  </div>

                  <div></div>
                </div>

                <div className={`col-md-6 d-md-block d-none  ${Styles.ExpertNdaimg}`}>
                  <img class="w-100"
                    src={process.env.PUBLIC_URL + "/static/media/login-illustration.svg"}
                    alt="Fintoo Invest logo"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <HideFooter />
    </div>
  );
}

export default Expertnda;

// expertnda
// expertfpdoc
// expertfinflowgetrmemail  (rm details for mail)
// sendmail
// sendsmsApi


 
// expertnd - user_id - htm content
// expertfpdoc - FP document saved Successfully

// {
//   "user_id": "259487",
//   "fp_log_id": "12716",
//   "flag": "nda",
//   "emp_name": "test tet"
// }

// expertfinflowgetrmemail 
// Successfully Retreieved the email - fp_log_id: 12716 - Query param

// 
// https://stg.minty.co.in/restapi/sendsmsApi/

// {
//   "msg": "Dear Mihir Shah,\r\nOur client, test tet has accepted the NDA. Request you to initiate the next step.\r\nTeam Fintoo",
//   "mobile": 7304545462,
//   "whatsapptext": "Dear Mihir Shah, Our client, test tet has accepted the NDA. Request you to initiate the next step.",
//   "sms_api_id": "FintooNDAAcceptedWM"
// }
 
