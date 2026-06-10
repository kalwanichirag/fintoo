import React, { useEffect, useRef, useState } from "react";
import Styles from "./Style.module.css";
import "./style.css";
import { FaStar } from "react-icons/fa";
import Carousel from "react-slick";
import { useSelector } from "react-redux";
import {
  CALENDLY_TOKEN,
  CRM_URL
} from "../../../constants";
import {
  apiCall,
  getItemLocal,
  getParentUserId,
  fetchData,
  fetchEncryptData,
  setItemLocal,
} from "../../../common_utilities";
import FintooLoader from "../../FintooLoader";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import { check_all_status_api, generateLead, sendMail, sendSMS } from "../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import {
  getStoredChoiceLead,
  storeChoiceLeadFromUrl,
} from "../../../Utils/leadAttribution";

function ExpertRmDetails() {
  let selectedRM = useSelector((state) => state.selectedRM);
  const selectedRMRef = useRef(selectedRM);

  useEffect(() => {
    selectedRMRef.current = selectedRM;
  }, [selectedRM]);

  const [isLoading, setIsLoading] = useState(false);
  const [sessionData, setSessionData] = useState([]);
  const [show, setShow] = useState(false);
  const [calendlydata, setCalendlyData] = useState({
    name: "",
    email: "",
    mobile: "",
    country_code: "+91",
  });
  const [formData, setFormData] = useState({
    fullname: "",
    mobile: "",
    mailid: "",
    servicename: "financial-plan",
    tags: "fin_expert_calendly",
    utm_source: 26,
    service: "100",
    lead_rm_id: "",
    incomeslab: "",
    incomeslabname: "",
    comment: "",
  });
  const [callbackDatetime, setCallbackDatetime] = useState("");
  const user_data = JSON.parse(localStorage.getItem("user_data"))
  const rmDetailRef = useRef();
  const breakPoints = [
    { width: 1, itemsToShow: 8 },
    { width: 550, itemsToShow: 1 },
    { width: 768, itemsToShow: 2 },
    { width: 1200, itemsToShow: 2 },
  ];
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    // centerMode: true,
    slidesToScroll: 1,
  };

  React.useEffect(() => {
    storeChoiceLeadFromUrl();

    function handleClickOutside(event) {
      if (rmDetailRef.current && !rmDetailRef.current.contains(event.target)) {
        closePopup();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closePopup = () => {
    document.querySelector(".outerRmBox-udim4").classList.remove("active");
    document.querySelector(".outerRmBox-udim4").classList.remove("mobile");
    document.body.classList.remove("overflow-hidden");
  };

  const isCalendlyEvent = function (e) {
    return (
      e.origin === "https://calendly.com" &&
      e.data.event &&
      e.data.event.indexOf("calendly.") === 0
    );
  };

  useEffect(() => {
    const handleCalendlyMessage = async (e) => {
      if (isCalendlyEvent(e) && e.data.payload.event) {
        try {
          const [responseEvent, responseInvitee] = await Promise.all([
            fetchData({
              url: e.data.payload.event.uri,
              method: "GET",
              headers: { Authorization: CALENDLY_TOKEN },
            }),
            fetchData({
              url: e.data.payload.invitee.uri,
              method: "GET",
              headers: { Authorization: CALENDLY_TOKEN },
            }),
          ]);

          // Handle date conversion
          let callback_datetime = "";
          if (responseEvent?.resource?.start_time) {
            const date_time = new Date(responseEvent.resource.start_time);
            callback_datetime = isNaN(date_time.getTime())
              ? "Invalid Date"
              : date_time.toLocaleString([], { hour12: true });
          }

          setCallbackDatetime(callback_datetime);
          localStorage.removeItem("calendlydata");

          let mobile = "";
          let comment = "";
          let income_slab = 7;
          const answers = responseInvitee.resource.questions_and_answers;

          let form_data = { ...formData };

          form_data = {
            ...form_data,
            fullname: responseInvitee.resource.name,
            mailid: responseInvitee.resource.email,
            lead_rm_id: selectedRMRef.current ? selectedRMRef.current.name : "",
          };

          answers.forEach((answer) => {
            if (answer.position === 2) {
              const mobileWithCountryCode = answer.answer.trim();
              let country_code = answer.answer.split(" ")[0];

              if (mobileWithCountryCode.startsWith("+")) {
                const parts = mobileWithCountryCode.split(" ");
                if (parts.length > 1) {
                  country_code = parts[0];
                  mobile = parts.slice(1).join(" ");
                } else {
                  mobile = parts[0].slice(3);
                  country_code = parts[0].slice(0, 3);
                }
              } else {
                mobile = mobileWithCountryCode;
              }

              form_data = {
                ...form_data,
                mobile: mobile,
                country_code: country_code,
              };
            }
            if (answer.position === 1) {
              income_slab = answer.answer === "More Than 1 Cr" ? 6 : 5;
              form_data = { ...form_data, incomeslab: income_slab, incomeslabname: answer.answer };
            }
            if (answer.position === 0) {
              comment = answer.answer;
              form_data = { ...form_data, comment: comment };
            }
          });

          $("#calendly").css("display", "none");
          $("#calendly1").css("display", "none");
          $(".ThanksSection").css("display", "flex");

          setFormData((prev) => ({ ...prev, ...form_data }));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    window.addEventListener("message", handleCalendlyMessage);

    return () => {
      window.removeEventListener("message", handleCalendlyMessage);
    };
  }, []);

  const thanksContinue = async () => {
    setIsLoading(!isLoading);
    storeChoiceLeadFromUrl();
    let email = formData.mailid;
    let data = {};
    data = {
      ...data,
      tagval: "minty_financial_planning",
      servicename: "financial-planning",
      plan_name: "Financial Plan",
      tags: "fin_web_FP_exp",
      lead_rm_id: selectedRM.name ? selectedRM.name : "",
    };


    let financialFormData = formData;
    financialFormData["email"] = email;
    financialFormData = {
      ...financialFormData,
      ...data,
    };

    const choiceLead = getStoredChoiceLead() || {};
    const urlParams = new URLSearchParams(window.location.search || "");
    const resolvedSource = (choiceLead.source || urlParams.get("utm_source") || "").trim();
    const resolvedCampaign = (choiceLead.campaign || urlParams.get("utm_campaign") || "").trim();
    const resolvedTag = (choiceLead.tag || urlParams.get("tags") || "").trim();

    let payload = {
      "services": ["assisted_advisory_fixed_fees"],
      "source": resolvedSource || "Website Callback",
      "tag": resolvedTag || "fin_web_FP_exp",
      "email": email,
      "full_name": formData.fullname,
      "mobile": formData.mobile,
      "rm_id": data.lead_rm_id,
      "slab": formData.incomeslabname

    }
    if (resolvedCampaign) {
      payload["campaign"] = resolvedCampaign;
    }
    if (getParentUserId()) {
      payload["user_id"] = getParentUserId()
    }
    let response = await generateLead(payload);
    if (response.status_code === "200") {
      if (user_data) {
        const result = await check_all_status_api(getParentUserId());
        if (result?.status_code === "200") {
          const {
            nda_sign_check,
            data_gethering_check,
            report_check,
            plan_uuid,
            plan_is_expired,
            opportunity_id
          } = result.data;

          setItemLocal("ndasignstatus", nda_sign_check);
          setItemLocal("datagatheringstatus", data_gethering_check);
          setItemLocal("reportstatus", report_check);
          setItemLocal("plan_is_expired", plan_is_expired);
          setItemLocal("plan_uuid", plan_uuid);
          setItemLocal("opportunity_id", opportunity_id);

          if (plan_uuid !== "fp_robo" && plan_uuid !== "") {
            if (plan_is_expired == "N" && nda_sign_check == "N") {
              window.location.href = `${process.env.PUBLIC_URL}/userflow/expert-nda`;
              return;
            }
            else {
              window.location.href = "/datagathering/about-you";
            }
          }
          else {
            window.location.href = "/datagathering/about-you";
          }

        }
        else {
          window.location.href = "/datagathering/about-you";
        }
      }
      else {

        let data1 = {
          userdata: {
            to: financialFormData.email,
          },
          subject:
            "Thank You For Requesting For A Callback. We Will Call You Shortly!",
          template: "welcome_expert_services.html",
          contextvar: {
            lead_rm_id: financialFormData.lead_rm_id,
            plan_id: "31",   // need to change plan id 
            fullname: financialFormData.fullname,
          },
        };
        await sendMail(data1);
        // await fetchEncryptData(configMailtoUser);
        let data2 = {
          userdata: {
            to: selectedRM["company_email"],
          },
          subject: "Callback",
          template: "callback_mail_to_rm_expert.html",
          contextvar: {
            fullname: selectedRM["employee_name"],
            clientname: financialFormData.fullname,
            clientmobile: financialFormData.mobile,
            clientemail: financialFormData.email,
            callbackdatetime: callbackDatetime,
          },
        };
        await sendMail(data2);
        // await fetchEncryptData(configMailtoRM);
        let content = encodeURIComponent(
          "Congratulations " +
          selectedRM["employee_name"] +
          "!,\r\nYou are selected as a Wealth Manager by our new client. Sharing the client's details for your reference.\r\nName: " +
          financialFormData.fullname +
          "\r\nContact No.: " +
          financialFormData.mobile +
          "\r\nTeam Fintoo"
        );
        let whatsapptext =
          "Congratulations " +
          selectedRM["employee_name"] +
          "! You are selected as a Wealth Manager by our new client. Sharing the client's details for your reference. Email: " +
          financialFormData.email +
          ". Contact No: " +
          financialFormData.mobile +
          ".";
        let smsdata = {
          msg: content,
          mobile: selectedRM["emp_mobile"],
          whatsapptext: whatsapptext,
          sms_api_id: "FintooWMselectionbyclient",
        };
        // let smsConfig = {
        //   method: "POST",
        //   url: DMF_SENDSMS_API_URL,
        //   data: smsdata,
        // };
        let smsResponse = await sendSMS(smsdata);
        // let smsResponse = await fetchEncryptData(smsConfig);
        if (smsResponse) {
          setIsLoading(!isLoading);
          toastr.options.positionClass = "toast-bottom-left";
          toastr.success("Callback request sent successfully");
          setTimeout(function () {
            window.location.href = "/";
          }, 1000);
        }
      }

    } else {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something went wrong");
    }
  }

  useEffect(() => {
    const user_data = JSON.parse(localStorage.getItem("user_data") || '{}');
    if (Object.keys(user_data).length > 0) {
      setCalendlyData({
        name: user_data["user_name"] || user_data["name"] || "",
        email: user_data["user_email"],
        mobile: user_data["user_mobile"],
        country_code: user_data["user_country_code"] || "+91",
      });
    }
  }, [])
  return (
    <div className={`${Styles.outerRmBox} outerRmBox-udim4`}>
      <FintooLoader isLoading={isLoading} />
      <div
        className={`${Styles.RMPersonalData} RM-Data-ildfX`}
        ref={rmDetailRef}
      >
        <div className={`d-block d-md-none ${Styles.imgclose}`}>
          <div
            onClick={() => {
              closePopup();
            }}
          >
            <img src={require("./images/cancel_1.png")} />
          </div>
        </div>
        {Object.keys(selectedRM).length > 0 && (
          <>
            {show ? (
              <div
                id="calendly"
                className={`${Styles.calendly}`}
              // style={{ display: "none" }}
              >
                <div className="text-center">
                  <div>
                    <p className={`${Styles.BooKLabel}`}>
                      Book Appointment with Expert
                    </p>
                  </div>
                  <div>
                    <p className={`${Styles.bookIntro}`}>
                      Book an introductory call with our financial Advisor to
                      know more about our offerings and advice.
                    </p>
                  </div>
                </div>
                <div
                  className="calendly-inline-widget"
                  data-url="https://calendly.com/fintoo/15-minutes-consultation-expert?embed_domain=minty.co.in&embed_type=Inline&hide_event_type_details=1&hide_gdpr_banner=1"
                  style={{ position: "relative", height: 565 }}
                  data-processed="true"
                >
                  <div className="calendly-spinner">
                    <div className="calendly-bounce1" />
                    <div className="calendly-bounce2" />
                    <div className="calendly-bounce3" />
                  </div>
                  <iframe
                    src={`https://calendly.com/fintoo/15-minutes-consultation-expert?embed_domain=minty.co.in&embed_type=Inline&hide_event_type_details=1&hide_gdpr_banner=1&name=${calendlydata.name}&email=${calendlydata.email}&a3=${calendlydata.country_code}${calendlydata.mobile}&a4=${selectedRM.employee_name}`}
                    width="100%"
                    height="100%"
                    frameBorder={0}
                  />
                </div>
              </div>
            ) : (
              <>
                <div id="RMDATA1" className={`${Styles.RmSpace} `}>
                  <div className="RMProfile text-center">
                    <div className={`${Styles.RmBox}`}>
                      {selectedRM.image == "" ? (
                        <img
                          src={
                            "https://static.fintoo.in/static/userflow/img/profile-picture.svg"
                          }
                        />
                      ) : (
                        <img
                          src={
                            CRM_URL +
                            selectedRM.image
                          }
                        />
                      )}
                    </div>
                    <div className={`mt-2 ${Styles.RMName}`}>
                      {selectedRM.employee_name}
                    </div>
                    <div className={`${Styles.RmQualification}`}>
                      <span className="ng-binding">
                        {selectedRM.designation}
                      </span>{" "}
                      <span style={{ fontWeight: 100 }}>|</span>{" "}
                      <span className={`${Styles.Education}`}>
                        {selectedRM.custom_certifications}
                      </span>
                    </div>
                  </div>
                  <div className={`d-flex mt-2 ${Styles.Rmcareer}`}>
                    <div className={`${Styles.BorderRight}`}>
                      <div className={`${Styles.textLabel}`}>Experience</div>
                      <div className={`${Styles.ValueLabel}`}>
                        {selectedRM.custom_experience}{" "}
                        <span style={{}}>Years</span>
                      </div>
                    </div>
                    <div className={`ps-4 pe-4 ${Styles.BorderRight}`}>
                      <div className={`${Styles.textLabel}`}>Location</div>
                      <div className={`${Styles.ValueLabel}`}>
                        {selectedRM.custom_location}
                      </div>
                    </div>
                    <div className="ps-3">
                      <div className={`${Styles.textLabel}`}>Rating</div>
                      <div className={`${Styles.rating}`}>
                        {/* ngIf: expert_details.rating == 5 */}
                        <div>
                          <span
                            className={`fa fa-star`}
                            style={{
                              color: `${selectedRM.custom_rating - 1 < 0 ? "gray" : "orange"
                                }`,
                            }}
                          />
                          <span
                            className={`fa fa-star`}
                            style={{
                              color: `${selectedRM.custom_rating - 2 < 0 ? "gray" : "orange"
                                }`,
                            }}
                          />
                          <span
                            className={`fa fa-star`}
                            style={{
                              color: `${selectedRM.custom_rating - 3 < 0 ? "gray" : "orange"
                                }`,
                            }}
                          />
                          <span
                            className={`fa fa-star`}
                            style={{
                              color: `${selectedRM.custom_rating - 4 < 0 ? "gray" : "orange"
                                }`,
                            }}
                          />
                          <span
                            className={`fa fa-star`}
                            style={{
                              color: `${selectedRM.custom_rating - 5 < 0 ? "gray" : "orange"
                                }`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`text-center ${Styles.aboutRm}`}
                    style={{ borderBottom: "0.3px solid rgb(227, 227, 227)" }}
                  >
                    <p className={`${Styles.labelText}`}>About Me</p>
                    <p className={`${Styles.Textinfo}`}>
                      {selectedRM.custom_description}
                    </p>
                  </div>

                  <div className={`${Styles.FeedBackCustomer}`}>
                    <p className={`text-center ${Styles.labelText}`}>
                      Customer Feedback
                    </p>
                    {selectedRM.custom_employee_service_review != null && (
                      <Carousel {...settings}>
                        {selectedRM.custom_employee_service_review
                          .slice(0, 3)
                          .map((x) => (
                            <div
                              key={`rv-${Math.random()}`}
                              className={`${Styles.item}`}
                            >
                              <div className="d-flex justify-content-between">
                                <div className="d-flex">
                                  <div>
                                    <img
                                      width={40}
                                      src="https://www.fintoo.in/static/userflow/img/profile-picture.svg"
                                      alt=""
                                    />
                                  </div>
                                  <div
                                    className={`ms-1 ${Styles.customerDetails}`}
                                  >
                                    <div className={`${Styles.customerName}`}>
                                      {x.user_name}
                                    </div>
                                    <div className={`${Styles.customerrating}`}>
                                      <div>
                                        {Array.from({ length: x.rating }).map(
                                          () => (
                                            <span
                                              className={`${Styles.checked}`}
                                            >
                                              <FaStar />
                                            </span>
                                          )
                                        )}
                                        {Array.from({
                                          length: 5 - x.rating,
                                        }).map(() => (
                                          <span
                                            className={`${Styles.Uchecked}`}
                                          >
                                            <FaStar />
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <p className={`mt-2 ${Styles.FeedbackMsg}`}>
                                  {x.review}
                                </p>
                              </div>
                            </div>
                          ))}
                      </Carousel>
                    )}
                    {selectedRM.custom_employee_service_review == null && (
                      <div className={` mt-3 ${Styles.reviewslider}`}>
                        <div>
                          <p className={`mt-2 ${Styles.Textinfo}`}>
                            No Review Available
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={`text-center ${Styles.bookAppointment}`}>
                    <button
                      onClick={() => setShow(!show)}

                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              </>
            )}
            <div
              className={`${Styles.ThanksSection} ThanksSection`}
              style={{ display: "none" }}
            >
              <div className="text-center mt-4">
                <div>
                  <img
                    style={{ width: 40 }}
                    src="https://static.fintoo.in/static/userflow/img/icons/check.png"
                    alt=""
                  />
                </div>
                <div className={`${Styles.thankyoumsg}`}>
                  Thank You For Choosing Fintoo!
                </div>
                <div className={`mt-3 ${Styles.ThanksParagraphs}`}>
                  <div>
                    We have received your request, and we are extremely
                    delighted that out of all the available options, you trusted
                    us to assist you at every step on your journey towards
                    financial planning and achieving your goals.
                  </div>
                  <div className="mt-3">
                    Now, let’s head over to your inbox , find the mail with the
                    step-by-step instructions to complete your registration
                    process, set up your account, and ultimately, start your
                    journey towards financial freedom.
                  </div>
                  <div className="mt-3">
                    In case you have any questions or need more information,
                    contact us at online@fintoo.in or +91 96998 00600.
                  </div>
                </div>
                <div className={`${Styles.teamFintoo}`}>
                  <p className="pt-4">TEAM FINTOO</p>
                </div>
                <div className={`text-center ${Styles.thanksContinue}`}>
                  <button
                    className={`${Styles.Thankscontinue}`}
                    onClick={() => thanksContinue()}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ExpertRmDetails;
