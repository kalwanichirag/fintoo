import React, { useState, useEffect, useRef } from "react";
import styles from "./style.module.css";

import refresh_captcha from "../../../Assets/Images/main/refresh_captcha.png";
import captcha from "../../../Assets/Images/main/captcha.png";
import Select from "react-select";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  getUserId,
  loginRedirectGuest,
  getParentUserId,
  apiCall,
  getItemLocal,
  setItemLocal,
} from "../../../common_utilities";
import { DATA_BELONGS_TO, imagePath } from "../../../constants";
import FintooDatePicker from "../../../components/HTML/FintooDatePicker";
import moment from "moment";
import SimpleReactValidator from "simple-react-validator";
import ApplyWhiteBg from "../../../components/ApplyWhiteBg";
import HideFooter from "../../../components/HideFooter";
import HideHeader from "../../../components/HideHeader";
import FintooLoader from "../../../components/FintooLoader";

function ITRRegister() {
  const simpleValidator = useRef(
    new SimpleReactValidator({
      validators: {
        mobile: {
          required: true,
          message: "Please provide valid mobile number",
          rule: (val) => {
            return parseInt(val) > 6000000000 && parseInt(val) < 9999999999;
          },
        },
        pan: {
          required: true,
          message: "Please provide valid pan",
          rule: (val) => {
            return /([A-Z]){5}([0-9]){4}([A-Z]){1}$/.test(val.toUpperCase());
          },
        },
      },
    })
  );
  const [allMembers, setAllMembers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [gender, setGender] = useState(null);
  const [dob, setDob] = useState(null);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [pan, setPan] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [itrDisabled, setItrDisabled] = useState(false);
  const [itrOnly, setItrOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [, forceUpdate] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userid = getUserId();

  const selectGender = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  useEffect(() => {
    // if (getUserId() == null) {
    //   loginRedirectGuest();
    //   return;
    // }
    if (!userid) {
      loginRedirectGuest();
    }


    try {
      let plan = getItemLocal("pid");
      if (!plan) navigate(`${process.env.PUBLIC_URL}/itr-file`);
    } catch {
      navigate(`${process.env.PUBLIC_URL}/itr-file`);
    }
    document.body.classList.add("bg-color");
    onLoadInit();
    return () => {
      document.body.classList.remove("bg-color");
    };
  }, []);



  const onLoadInit = async () => {
    try {
      if (getUserId() == null) {
        dispatch({
          type: "RENDER_TOAST",
          payload: { message: GUEST_MESSAGE, type: "error" },
        });
        return;
      }
      setSelectedUser(getUserId());

      await fetchMembers();

      let userId = getUserId().toString();
      await updateUserData(userId);

    } catch (e) {
      console.error(e);
    }
  };

  const fetchMembers = async () => {
    try {
      const resp = await apiCall('', {
        user_id: getParentUserId(),
        data_belongs_to: DATA_BELONGS_TO,
      });
      const all = resp.data.map((v) => ({
        name: v.NAME ? v.NAME : v.fdmf_email,
        id: v.id,
        fp_log_id: v.fp_log_id,
        parent_user_id: v.parent_user_id,
        pan: v.pan,
        mobile: v.mobile,
        email: v.fdmf_email,
        fp_user_details_id: v.fp_user_details_id,
        label: v.NAME ? v.NAME : v.fdmf_email,
        value: v.id,
      }));
      setAllMembers([...all]);
    } catch (e) {
      console.error(e);
    }
  };

  const updateUserData = async (userId) => {
    // try {
    //   setItrOnly(false);
    //   setDisabled(false);
    //   let req_data = { user_id: userId };
    //   let resp = await apiCall(
    //     TAX_GET_USER_PERSONAL_DETAILS_API_URL,
    //     req_data
    //   );
    //   if (resp["error_code"] != "100") {
    //     setFname("");
    //     setLname("");
    //     setPan("");
    //     setMobile("");
    //     setEmail("");
    //     setGender("");
    //     setDob(null);
    //     dispatch({
    //       type: "RENDER_TOAST",
    //       payload: { message: resp["message"], type: "error" },
    //     });
    //     return;
    //   }

    //   if (resp?.data["bse_reg"] == "Y") {
    //     setItrOnly(true);
    //     setDisabled(true);
    //   } else {
    //     checkPanStatus(resp?.data["pan"]);
    //   }

    //   setFname(resp?.data["name"]);
    //   setLname(resp?.data["last_name"]);
    //   setPan(resp?.data["pan"]);
    //   setMobile(resp?.data["mobile"]);
    //   setEmail(resp?.data["email"]);
    //   setGender(resp?.data["gender"].toLowerCase());

    //   if (resp.data["dob"] != "") {
    //     try {
    //       setDob(moment(resp.data["dob"], "YYYY-MM-DD").toDate());
    //     } catch (e) {
    //       setDob(moment(resp.data["dob"], "DD-MM-YYYY").toDate());
    //     }
    //   }

    // } catch (e) {
    //   console.error(e);
    // }
  };

  const checkPanStatus = async (inputPan) => {
    try {
      let url = DMF_GETPANSTATUS_API_URL;
      let reqData = {
        pan: inputPan,
        user_id: selectedUser,
        data_belongs_to: DATA_BELONGS_TO,
      };

      let respData = await apiCall(url, reqData);
      if (respData["error_code"] === "100") {
        let name =
          respData["data"]["kyc_name"] !== ""
            ? respData["data"]["kyc_name"]
            : "";
        if (name) {
          setFname(name.split(" ").slice(0, 1).join(" "));
          setLname(name.split(" ").slice(1).join(" "));
          setItrDisabled(true);
        }
      }
    } catch (err) { }
  };

  const handleSubmit = async () => {

    // let formValid = simpleValidator.current.allValid();
    // simpleValidator.current.showMessages();
    // forceUpdate(1);
    // if (formValid == false) return;
    // var dateFormat =
    //   dob.getFullYear() + "-" + (dob.getMonth() + 1) + "-" + dob.getDate();
    // let url = TAX_UPDATE_USER_DETAILS_API_URL;
    // let req_data = {
    //   user_id: "" + selectedUser,
    //   pan: "" + pan,
    //   first_name: "" + fname,
    //   last_name: "" + lname,
    //   email: "" + email,
    //   mobile: "" + mobile,
    //   gender: "" + gender.toLowerCase(),
    //   dob: "" + dateFormat,
    //   is_direct: "" + IS_DIRECT,
    //   // kyc_user_name: "" + fname + " " + lname,
    //   // kyc_verified: "" + kycVerified,
    // };
    // if (itrOnly) req_data["itr_only"] = "1";
    // setItemLocal("pd", req_data);

    // let resp_data = await apiCall(url, req_data);

    // if (resp_data["error_code"] == "100") {
    //   setIsLoading(true);
    //   const result = await apiCall(TAX_GET_USER_PAYMENT_STATUS_API_URL, { "check_payment": 1, "assessment_year": ASSESSMENT_YEAR, "user_id": selectedUser });
    //   if (result["error_code"] == "100") {
    //     setIsLoading(false);
    //     navigate(`${process.env.PUBLIC_URL}/itr-upload-docs`);
    //     dispatch({
    //       type: "RENDER_TOAST",
    //       payload: { message: result["message"], type: "success" },
    //     });
    //     return;
    //   } else {
    //     setIsLoading(false);
    //     navigate(`${process.env.PUBLIC_URL}/itr-plan-subscription`);
    //     dispatch({
    //       type: "RENDER_TOAST",
    //       payload: { message: resp_data["message"], type: "success" },
    //     });
    //     return;
    //   }
    // } else if (resp_data["error_code"] == "102") {
    //   dispatch({
    //     type: "RENDER_TOAST",
    //     payload: { message: resp_data["message"], type: "error" },
    //   });
    //   return;
    // }

    // dispatch({
    //   type: "RENDER_TOAST",
    //   payload: { message: "Something went wrong!", type: "error" },
    // });
  };

  const handleChange = async (e) => {
    try {
      setSelectedUser(e?.value);
      await updateUserData(e?.value.toString());
    } catch (e) { }
  };

  const customStyles = {
    option: (base, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...base,
        backgroundColor: isFocused ? "#ffff" : "#042b62",
        color: isFocused ? "#042b62" : "#fff",
        cursor: "pointer",
      };
    },
    menuList: (base) => ({
      ...base,
      height: "100px",
      overflowY: "scroll",
      scrollBehavior: "smooth",
      "::-webkit-scrollbar": {
        width: "4px",
        height: "0px",
      },
      "::-webkit-scrollbar-track": {
        background: "#fff",
      },
      "::-webkit-scrollbar-thumb": {
        background: "#042b62",
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: "#555",
      },
    }),
  };

  return (
    <>
      <HideFooter />
      <HideHeader />
      <ApplyWhiteBg />

      <FintooLoader isLoading={isLoading} />
      <div>
        <div className={`${styles.login_header}`}>
          <div
            className={`${styles.back_arrow}`}
            onClick={() => {
              navigate(-1);
            }
            }
          >
            <img
              src={imagePath + "/static/media/Images/userflow/icons/back-arrow.svg"}
              alt="Back Arrow"
            />
          </div>
          <a target="_self" href="/" className={`${styles.logo}`}>
            <img
              src={process.env.REACT_APP_STATIC_URL + "media/wp/Fintoologo_.svg"}
              alt="Fintoo logo"
            />
          </a>
        </div>

        <section className={`${styles.login_section}`}>
          <div className="container-fluid" style={{ paddingTop: "50px" }}>
            <div className="row ">
              <div className="col-12 col-md-7">
                <div className={`${styles.login_block}`}>
                  <h2 className={`text-center ${styles.page_header}`}>
                    Personal Details
                  </h2>
                  {/* <p className={`text-center ${styles.page_subTxt}`}>
                    Enter your details
                  </p> */}
                  <div>
                    <div className="row justify-content-center">
                      <div className="col-md-6">
                        <div className={`${styles.material} ${styles.input}`}>
                          <Select
                            style={{
                              width: "100% !Important",
                            }}
                            classNamePrefix="sortSelect"
                            isSearchable={false}
                            name="members"
                            options={allMembers}
                            onChange={(e) => {
                              handleChange(e);
                            }}
                            value={allMembers.filter(
                              (v) => v.id == selectedUser
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row justify-content-center">
                      <div className="col-md-6">
                        <div
                          className={`${styles.material} ${styles.input} ${styles.placeholder}`}
                        >
                          <input
                            type="text"
                            tabindex="1"
                            placeholder="First Name*"
                            name="FName"
                            id="FName"
                            value={fname}
                            className="default-input"
                            onChange={(e) =>
                              setFname(e.target.value.replaceAll(" ", ""))
                            }
                            onBlur={() => {
                              simpleValidator.current.showMessageFor("fname");
                            }}
                            disabled={disabled || itrDisabled}
                          />
                          {simpleValidator.current.message(
                            "fname",
                            fname?.replaceAll(" ", ""),
                            "required|alpha|max:25",
                            {
                              messages: {
                                required: "Please enter valid first name.",
                                max: "Please enter valid first name.",
                              },
                            }
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row justify-content-center">
                      <div className="col-md-6">
                        <div className={`${styles.material} ${styles.input}`}>
                          <input
                            type="text"
                            tabindex="1"
                            placeholder="Last Name*"
                            name="LName"
                            id="LName"
                            value={lname}
                            className="default-input"
                            onChange={(e) =>
                              setLname(e.target.value.replaceAll(" ", ""))
                            }
                            onBlur={() => {
                              simpleValidator.current.showMessageFor("lname");
                            }}
                            disabled={disabled || itrDisabled}
                          />
                          {simpleValidator.current.message(
                            "lname",
                            lname?.replaceAll(" ", ""),
                            "required|alpha|max:25",
                            {
                              messages: {
                                required: "Please enter valid last name.",
                                max: "Please enter valid last name.",
                              },
                            }
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row justify-content-center">
                      <div className="col-md-6">
                        <div className={`${styles.material} ${styles.input}`}>
                          <input
                            type="text"
                            tabindex="1"
                            placeholder="PAN Number*"
                            name="Pan"
                            id="Pan"
                            value={pan}
                            className="default-input"
                            onChange={(e) => setPan(e.target.value)}
                            onBlur={() => {
                              simpleValidator.current.showMessageFor("pan");
                            }}
                            disabled={disabled}
                          />
                          {simpleValidator.current.message(
                            "pan",
                            pan?.replaceAll(" ", ""),
                            "pan"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row justify-content-center">
                      <div className="col-md-3">
                        <div className={`${styles.material} ${styles.input}`}>
                          <div disabled={disabled || itrDisabled}>
                            <Select
                              style={{
                                width: "100% !Important",
                              }}
                              classNamePrefix="sortSelect"
                              isSearchable={false}
                              styles={customStyles}
                              value={selectGender.filter(
                                (v) => v.value == gender
                              )}
                              options={selectGender}
                              onChange={(e) => setGender(e.value)}
                              onBlur={() => {
                                simpleValidator.current.showMessageFor(
                                  "gender"
                                );
                              }}
                              isOptionDisabled={(option) => disabled}
                            />
                            {simpleValidator.current.message(
                              "gender",
                              gender,
                              "required",
                              {
                                messages: {
                                  required: "Please select gender.",
                                },
                              }
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 ">
                        <div
                          className={`dob8 birth-calendar ${styles.material} ${styles.input
                            } ${dob ? "m_selected" : "m_empty"} `}
                        >
                          <FintooDatePicker
                            placeholderText="dd/mm/yyyy"
                            maxDate={moment().subtract(18, "years").toDate()}
                            selected={dob}
                            onChange={(date) => {
                              setDob(date);
                            }}
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            className="default-input"
                            onBlur={() => {
                              simpleValidator.current.showMessageFor("dob");
                            }}
                            disabled={disabled}
                          />
                          {simpleValidator.current.message(
                            "dob",
                            dob,
                            "required",
                            {
                              messages: {
                                required: "Please select date of birth.",
                              },
                            }
                          )}
                        </div>
                        {/* </div> */}
                      </div>
                    </div>
                    <div className="row justify-content-center">
                      <div className="col-md-6">
                        <div className={`${styles.material} ${styles.input}`}>
                          <input
                            type="text"
                            tabindex="1"
                            placeholder="Mobile Number*"
                            name="mNumber"
                            id="mNumber"
                            value={mobile}
                            className="default-input"
                            onChange={(e) => setMobile(e.target.value)}
                            onBlur={() => {
                              simpleValidator.current.showMessageFor("mobile");
                            }}
                          />
                          {simpleValidator.current.message(
                            "mobile",
                            mobile?.replaceAll(" ", ""),
                            "mobile"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row justify-content-center">
                      <div className="col-md-6">
                        <div className={`${styles.material} ${styles.input}`}>
                          <input
                            type="mail"
                            tabindex="1"
                            placeholder="Email*"
                            name="Email"
                            id="Email"
                            value={email}
                            className="default-input"
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={() => {
                              simpleValidator.current.showMessageFor("email");
                            }}
                          />
                          {simpleValidator.current.message(
                            "email",
                            email?.replaceAll(" ", ""),
                            "required|email",
                            {
                              messages: {
                                required: "Please enter valid email.",
                              },
                            }
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row justify-content-center text-center">
                      <div class="col">
                        <div class="btn-container">
                          <input
                            // className="text-decoration-none"
                            type="submit"
                            name="login"
                            value="Save & Continue"
                            className={`d-block ${styles.default_btn}`}
                            data-loading-text="Loading..."
                            onClick={() => {
                              handleSubmit();
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <p><b>Note :</b> If you wish to edit your details please reach us at <b>support@fintoo.in</b></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`d-none d-md-block col-md-5 h100 ${styles.login_illustration}`}
              ></div>
            </div>
          </div>
        </section>

        {/* <Footer /> */}
      </div>
    </>
  );
}

export default ITRRegister;
