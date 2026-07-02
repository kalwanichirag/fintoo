import React, { useState, useEffect, useRef } from "react";
import styles from "./style.module.css";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  getUserId,
  loginRedirectGuest,
  getParentUserId,
  getItemLocal,
  setItemLocal,
} from "../../../common_utilities";
import { DATA_BELONGS_TO, imagePath } from "../../../constants";
import FintooDatePicker from "../../../components/HTML/FintooDatePicker";
import moment from "moment";
import { Modal as ReactModal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import SimpleReactValidator from "simple-react-validator";
import ApplyWhiteBg from "../../../components/ApplyWhiteBg";
import HideFooter from "../../../components/HideFooter";
import HideHeader from "../../../components/HideHeader";
import FintooLoader from "../../../components/FintooLoader";
import { addUpdateITRUserDetails, fetchUserProfileDetails, generateLead, getFamilyMember, updateBasicDetails } from "../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { fetchPanStatus } from "../../../FrappeIntegration-Services/services/master-api/masterApiService";
import { Getpaymentstatus } from "../../../FrappeIntegration-Services/services/payment-api/paymentapiService";

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
  const [isOpenReKycModal, setIsOpenReKycModal] = useState(false);
  const [, forceUpdate] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userid = getUserId();
  const plan = getItemLocal("pid");

  const selectGender = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  const handleReKycModalClose = () => {
    setIsOpenReKycModal(false);
    setItrDisabled(false);
  };

  const ITRPayment = async () => {
    try {

      const paymentRes = await Getpaymentstatus({
        user_id: itrUserId,
        data_belongs_to: DATA_BELONGS_TO,
      });

      const hasItrFilingPlan =
        paymentRes?.status_code === 200 &&
        paymentRes?.data?.some(
          (item) => item?.service_type === "itr_filing"
        );

      if (!hasItrFilingPlan) {
        navigate(`${process.env.PUBLIC_URL}/itr-file`);     
      }
    } catch (error) {
      console.error("Failed to fetch payment status:", error);
    }
  };
  useEffect(() => {
    // if (getUserId() == null) {
    //   loginRedirectGuest();
    //   return;
    // }
    if (!userid) {
      loginRedirectGuest();
    }
    ITRPayment();
    document.body.classList.add("bg-color");
    onLoadInit();
    return () => {
      document.body.classList.remove("bg-color");
    };
  }, []);

  const onLoadInit = async () => {
    try {
      const GUEST_MESSAGE = "Your session has been expired. Please login to continue";
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
      const resp = await getFamilyMember(getParentUserId());
      const all = resp.data.map((v) => ({
        value: v.user_id,
        label: v.user_name || v.user_email,
        name: v.user_name ? v.user_name : v.user_email,
        id: v.user_id,
        parent_user_id: v.user_parent_id,
        pan: v.pan,
        mobile: v.mobile_number,
        email: v.user_email,
      }));
      setAllMembers([...all]);
    } catch (e) {
      console.error(e);
    }
  };

  const updateUserData = async (userId) => {
    try {
      setItrOnly(false);
      setDisabled(false);

      const result = await fetchUserProfileDetails(userId);

      if (result?.status_code !== 200) {
        setFname("");
        setLname("");
        setPan("");
        setMobile("");
        setEmail("");
        setGender("");
        setDob(null);

        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: result?.message || "Unable to fetch user details",
            type: "error",
          },
        });
        return;
      }

      const data = result?.data || {};
      const fullName = data?.user_name || "";
      const firstName = fullName.split(" ")[0] || "";
      const lastName =
        data?.last_name ||
        fullName.split(" ").slice(1).join(" ") ||
        "";

      if (data?.user_bse_registered === 1) {
        setItrOnly(true);
        setDisabled(true);
      }

      setFname(firstName);
      setLname(lastName);
      setPan(data?.user_pan || "");
      setMobile(data?.mobile || "");
      setEmail(data?.user_email || "");
      setGender(data?.user_gender || "");

      if (data?.user_dob) {
        setDob(moment(data.user_dob, "YYYY-MM-DD").toDate());
      } else {
        setDob(null);
      }
    } catch (error) {
      console.error("updateUserData error:", error);
    }
  };

  const checkPanStatus = async (inputPan) => {
    try {
      const payload = {
        pan: inputPan,
        user_id: selectedUser,
        data_belongs_to: DATA_BELONGS_TO,
      };

      const respData = await fetchPanStatus(payload);

      if (respData?.status_code === 200) {
        const name = respData?.data?.kyc_name || "";

        if (name) {
          setFname(name.split(" ")[0] || "");
          setLname(name.split(" ").slice(1).join(" ") || "");
        }

        return true;
      }

      if (respData?.status_code === 400) {
        const message = respData?.message || "";

        if (message.includes("already associated")) {
          dispatch({
            type: "RENDER_TOAST",
            payload: {
              message,
              type: "error",
            },
          });

          setItrDisabled(false);
          return false;
        }

        if (message.includes("KYC not verified")) {
          setIsOpenReKycModal(true);
          return false;
        }

        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message,
            type: "error",
          },
        });

        return false;
      }

      if (respData?.status_code === 500) {
        setIsOpenReKycModal(true);
        return false;
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const handleSubmit = async () => {
    let formValid = simpleValidator.current.allValid();
    simpleValidator.current.showMessages();
    forceUpdate(1);

    if (!formValid) return;

    try {
      setIsLoading(true);
      const isPanValid = await checkPanStatus(pan.trim().toUpperCase());

      if (!isPanValid) {
        setIsLoading(false);
        return;
      }

      const selectedMember = allMembers.find(
        (member) => String(member.value) === String(selectedUser)
      );

      const leadPayload = {
        "user_id": selectedUser,
        "source": "Website Callback",
        "tag": "itr_filing_2026",
        "email": email,
        "mobile": mobile,
        "full_name": selectedMember?.name || "",
        "services": ["itr_filing"],
        "data_belongs_to": DATA_BELONGS_TO,
      }

      const leadResponse = await generateLead(leadPayload);

      const payload = {
        user_id: selectedUser,
        pan: pan,
        email: email,
        mobile: mobile,
        gender: gender,
        dob: moment(dob).format("YYYY-MM-DD"),
        data_belongs_to: DATA_BELONGS_TO,
      };
      await updateBasicDetails(payload);

      const response = await addUpdateITRUserDetails({
        ...payload,
        itr_only: "1",
      });

      if (response?.status_code === 200) {

        if (window?.webengage?.track) {
          const originalAmount = plan?.plan_description?.original_amount || plan?.plan_amount;
          const listPrice = plan?.plan_amount || 0;
          const discount = originalAmount - listPrice;
           const params = new URLSearchParams(window.location.search);

          window.webengage.track("personal details entered", {
            url: window.location.href,
            "list price": listPrice,
            "MRP": originalAmount,
            "list discount": discount > 0 ? discount : 0,
            "plan name": plan?.plan_name || "",
            "plan id": plan?.plan_uuid || "",
            "service": plan?.service || "ITR Filing",
            "lead id": leadResponse?.data?.lead_id || "",
            "name": selectedMember?.name || "",
            "email": email,
            "utm_source": params.get("utm_source") || "",
            "phone": mobile ? `+91${mobile}` : '',
            "dob": dob ? dob: "",
            "pan card": !!pan,
            gender: gender || "",
          });
        }
 
        setItemLocal("pd", {
          ...payload,
          full_name: selectedMember?.name || "",
        });

        const paymentRes = await Getpaymentstatus({
          user_id: selectedUser,
          data_belongs_to: DATA_BELONGS_TO,
        });

        setIsLoading(false);

        const hasItrFilingPlan =
          paymentRes?.status_code === 200 &&
          paymentRes?.data?.some(
            (item) => item?.service_type === "itr_filing"
          );

        if (hasItrFilingPlan) {
          dispatch({
            type: "RENDER_TOAST",
            payload: {
              message: "You have already purchased plan for ITR filing.",
              type: "success",
            },
          });
          navigate(`${process.env.PUBLIC_URL}/itr-upload-docs`);
        } else {
          dispatch({
            type: "RENDER_TOAST",
            payload: {
              message:
                response?.message ||
                "User details updated successfully",
              type: "success",
            },
          });

          navigate(`${process.env.PUBLIC_URL}/itr-plan-subscription`);
        }

        return;
      }

      setIsLoading(false);

      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: response?.message || "Something went wrong!",
          type: "error",
        },
      });
    } catch (error) {
      setIsLoading(false);

      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "Something went wrong!",
          type: "error",
        },
      });

      console.error("handleSubmit error:", error);
    }
  };

  const handleChange = ({ value }) => {
    setSelectedUser(value);
    updateUserData(String(value));
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
      <ReactModal
        classNames={{
          modal: "ModalpopupContentWidth",
        }}
        open={isOpenReKycModal}
        showCloseIcon={true}
        center
        animationDuration={0}
        closeOnOverlayClick={false}
        onClose={handleReKycModalClose}
      >
        <div>
          <h3 className="text-center HeaderText">
            Attention !
          </h3>

          <div
            className="p-2"
            style={{ fontSize: "1.2rem" }}
          >
            <p>Dear Client,</p>

            <p>
              We regret to inform you that your KYC is not verified.
            </p>

            <p>
              Kindly complete the KYC process at your earliest
              convenience.
            </p>

            <p>
              Please{" "}
              <a
                href="https://investor-web.hdfcfund.com/kyc-verification"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleReKycModalClose}
              >
                Click Here
              </a>{" "}
              to initiate the KYC process.
            </p>

            <div
            className="ButtonBx"
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <button
                className="ReNew"
                onClick={() => {
                  handleReKycModalClose();
                  window.open(
                    "https://investor-web.hdfcfund.com/kyc-verification",
                    "_blank"
                  );
                }}
              >
                Verify KYC
              </button>

              <button
                className="ReNew"
                style={{ background: "#999" }}
                onClick={handleReKycModalClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </ReactModal>

      <FintooLoader isLoading={isLoading} />
      <div>
        <div className={`${styles.login_header}`}>
          <div
            className={`${styles.back_arrow}`}
            onClick={() => {
              navigate(`${process.env.PUBLIC_URL}/itr-plan`);
            }
            }
          >
            <img
              src={imagePath + "/static/media/Images/icons/back-arrow.svg"}
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
                    {/* <div className="row justify-content-center">
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
                    </div> */}
                    {/* <div className="row justify-content-center">
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
                    </div> */}
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
                            onChange={(e) => setPan(e.target.value.toUpperCase())}
                            onBlur={() => {
                              simpleValidator.current.showMessageFor("pan");
                              forceUpdate(1);
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
