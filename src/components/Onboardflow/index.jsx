"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Modal as ReactModal } from "react-responsive-modal";
import { fetchData, getItemLocal, getParentUserId, getUserId, setItemLocal } from "../../common_utilities";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import { useEffectAfterInitialRender } from "../../Utils/Hooks/LifeCycleHooks";

import styles from "./style.module.css";
import { GET_OCCUPATION_LIST, UPDATEBASICDETAILS } from "../../constants";
import { getFamilyMember, fetchUserProfileDetails, getOccupationList, updateBasicDetails, generateLead, check_all_status_api } from "../../FrappeIntegration-Services/services/user-management-api/userApiService";
import HideHeader from "../HideHeader";
import HideFooter from "../HideFooter";
import { getStoredChoiceLead } from "../../Utils/leadAttribution";

function get100YearsAgoDate() {
  const today = new Date();
  today.setFullYear(today.getFullYear() - 100);
  return today.toISOString().split("T")[0];
}

function getTodayDate() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

function calculateAge(dob) {
  if (!dob) return 0;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age;
}

function formatDate(inputDate) {
  const date = new Date(inputDate);

  if (isNaN(date)) {
    return;
  }


  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

export default function UseFlowInputs({ onContinue }) {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userData);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [occupationOptions, setoccupationList] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      gender: null,
      fullName: "",
      dob: "",
      occupation: null,
      retirementAge: "",
      lifeExpectancy: "",
    },
  });

  const watchDOB = watch("dob");
  const watchRetireAge = watch("retirementAge");
  const watchLifeExpectancy = watch("lifeExpectancy");
  const navigate = useNavigate();

  useEffect(() => {
    setValue("age", calculateAge(watchDOB));
  }, [watchDOB, setValue]);

  useEffectAfterInitialRender(() => {
    if (watchRetireAge && watchLifeExpectancy) {
      trigger(["retirementAge", "lifeExpectancy"]);
    }
  }, [watchRetireAge, watchLifeExpectancy]);

  // const getUserDetails = async()=>{

  // }

  const user_data = JSON.parse(localStorage.getItem("user_data") || '{}');
  const userId = getParentUserId();

  const handleGetFamilyMember = async () => {
    try {

      const result = await getFamilyMember(userId);

      if (result?.status_code == 200) {
        const transformedData = result.data.map((member) => ({
          name: member.user_name || '',
          id: member.user_id || '',
          parent_user_id: member.user_parent_id,
          pan: member.pan || '',
          mobile: member.mobile_number || '',
          email: member.user_email || '',
          user_email: member.user_email || '',
          fp_user_details_id: member.user_details_id || '',
          fdmf_is_minor: member.is_minor ? 'Y' : 'N',
          user_age: member.user_age
        }));

        setItemLocal("member", [...transformedData]);
        setItemLocal("allMemberUser", [...transformedData]);

        // ✅ find parent user
        const parentUser = result.data.find(member => member.user_id === getParentUserId());
        if (parentUser) {
          const userData = localStorage.getItem("user_data");

          if (userData) {
            const parsedData = JSON.parse(userData);

            // ✅ update all relevant fields
            parsedData.user_name = parentUser?.user_name || parsedData?.user_name || '';
            parsedData.user_email = parentUser?.user_email || parsedData?.user_email || '';
            parsedData.user_mobile = parentUser?.mobile_number || parsedData?.user_mobile || '';
            parsedData.user_country_code = parentUser?.user_country_code || parsedData?.user_country_code || '';
            parsedData.user_pan = parentUser?.pan || parsedData?.user_pan || '';
            parsedData.user_dob = parentUser?.user_dob || parsedData?.user_dob || '';
            parsedData.user_gender = parentUser?.user_gender || parsedData?.user_gender || '';
            parsedData.user_occupation = parentUser?.occupation || parsedData?.user_occupation || '';
            parsedData.user_retirement_age = parentUser?.retirement_age || parsedData?.user_retirement_age || '';
            parsedData.user_life_expectancy = parentUser?.life_expectancy || parsedData?.user_life_expectancy || '';

            // ✅ save back
            localStorage.setItem("user_data", JSON.stringify(parsedData));
          }
        }
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleCheckAllStatus = async (userId) => {
    try {
      if (userId) {
        const result = await check_all_status_api(userId);

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
              return true;
            }
          }
          return false;
        } else {
          console.error("Status check failed:", result?.message);
          return false;
        }
      } else {
        console.error("User ID not found.");
        return false;
      }
    } catch (error) {
      console.error("Error checking user status:", error);
      return false;
    }
  };

  const onSubmit = async (data) => {
    const userDetailsPayload = {
      user_id: user_data.user_id,  // still using user_id from storage
      name: data.fullName,
      dob: (formatDate(data.dob)).split('-').join('-'),
      gender: data.gender?.value || '',
      occupation: data.occupation?.value,
      retirement_age: data.retirementAge,
      life_expectancy_age: data.lifeExpectancy,
    };

    try {
      const result = await updateBasicDetails(userDetailsPayload);

      if (result.status_code == 200) {
        const choiceLead = getStoredChoiceLead() || {};
        const urlParams = new URLSearchParams(window.location.search || "");
        const resolvedSource = (choiceLead.source || urlParams.get("utm_source") || "").trim();
        const resolvedCampaign = (choiceLead.campaign || urlParams.get("utm_campaign") || "").trim();
        const resolvedTag = (choiceLead.tag || urlParams.get("tags") || "").trim();


        let payload = {
          "source": resolvedSource || "Website Callback",
          "email": user_data.user_email,
          "full_name": userDetailsPayload.name,
          "services": ["robo_advisory_499_plan"],
        }
        if (resolvedCampaign) {
          payload.campaign = resolvedCampaign;
        }
        if (resolvedTag) {
          payload.tag = resolvedTag;
        }
        await generateLead(payload);

        const age = calculateAge(userDetailsPayload.dob);

        if (window.webengage && window.webengage.user) {
          webengage.user.setAttribute("gender", userDetailsPayload.gender?.toLowerCase());
          webengage.user.setAttribute("we_birth_date", userDetailsPayload.dob);
          webengage.user.setAttribute("fullName", userDetailsPayload.name);
          webengage.user.setAttribute("we_first_name", userDetailsPayload.name);
          webengage.user.setAttribute("age", age);
        }
        await handleGetFamilyMember();

        const redirected = await handleCheckAllStatus(user_data.user_id);
        if (redirected) return;

        reset();
        window.location.href = process.env.PUBLIC_URL + "/commondashboard";
        setItemLocal("logged_in", 1);
        setItemLocal("family", 1);
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success(result.message);
        handleClose();
        return;
      } else {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error(result.message);
      }
    } catch (error) {
      console.log('updateBasicDetails error', error);
    }
  };


  const occupationListFun = async () => {
    // const result = await getOccupationList();

    const result = await getOccupationList()
    if (result.status_code == 200) {
      const mappedOptions = result.data.map((item) => ({
        value: item.occupation_id,
        label: item.occupation_name,
      }));
      const existingDataString = localStorage.getItem('user_data');
      const existingData = existingDataString ? JSON.parse(existingDataString) : {};
      const updatedData = { ...existingData };
      localStorage.setItem('user_data', JSON.stringify(updatedData));
      setoccupationList(mappedOptions);
    }
    else if (result.status_code == 401) {
      router.push('/verify-mobile-number');
    }
  }


  const hanleprofileDetails = async () => {
    try {

      const result = await fetchUserProfileDetails(getParentUserId());
      if (result?.status_code === 200 && result.data) {
        const userDataFromProfile = result.data;

        reset({
          gender: userDataFromProfile.user_gender
            ? genderOptions.find((opt) => opt.value === userDataFromProfile.user_gender)
            : null,
          fullName: userDataFromProfile.user_name || "",
          dob: userDataFromProfile.user_dob ? formatDate(userDataFromProfile.user_dob) : "",
          occupation: userDataFromProfile.user_occupation_id
            ? occupationOptions.find((opt) => opt.value === userDataFromProfile.user_occupation_id)
            : null,
          retirementAge: userDataFromProfile.user_retirement_age || "",
          lifeExpectancy: userDataFromProfile.user_life_expectancy || "",
        });
      }
    } catch (error) {
      console.error('Error fetching user profile details:', error);
    }
  };


  const genderOptions = [
    { value: "Male", label: "🙋🏻‍♂️ Male" },
    { value: "Female", label: "🙋🏻‍♀️ Female" },
    { value: "Other", label: "🏳️‍🌈 Other" },
  ];


  const allowedPaths = [
    "/login"
  ];

  const currentPath = window.location.pathname;

  useEffect(() => {
    if (!getUserId() && !allowedPaths.includes(currentPath)) {
      setIsModalOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsModalOpen(!isValid ? true : false);
    // disabled={!isValid}
  };

  useEffect(() => {
    occupationListFun();
    hanleprofileDetails(); 1
  }, [])

  const buttonStyle = {
    padding: '0.5rem 2rem',
    backgroundColor: '#042b62',
    color: '#fff',
    outline: 'none',
    border: 'none',
    fontWeight: 'bold',
    borderRadius: '4px',
    margin: "auto",
    gridColumn: '1 / -1',
    display: 'flex',
    justifyContent: 'center'
  };

  return (
    <>
      <HideHeader />
      <ReactModal
        classNames={{
          modal: "OnbaordModalpopupContentWidth",
        }}
        open={isModalOpen}
        showCloseIcon={false}
        center
        animationDuration={0}
        closeOnOverlayClick={false}
        onClose={handleClose}
      >
        <div className="text-center"> <h2>Onboard with us</h2>
          <p>Let us craft a personalized financial advisory experience just for you.</p></div>
        <hr />
        <form
          onSubmit={handleSubmit(onSubmit, (formErrors) => {
            const firstErrorKey = Object.keys(formErrors)[0];
            const errorElement = document.querySelector(`[name="${firstErrorKey}"]`);

            if (errorElement) {
              errorElement.focus();
              errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
            }

            toastr.options.positionClass = "toast-bottom-left";
            toastr.error(formErrors[firstErrorKey]?.message);
          })}
          className={`${styles.formContainer}`}
        >
          <div className="row">
            {/* Full Name */}
            <div className="col-12 col-md-6 mb-3">
              <label htmlFor="fullName" className={`${styles.formtitle} mb-3 d-block`}>
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                className="form-control shadow-none"
                placeholder="Enter your full name"
                {...register("fullName", {
                  required: "Please enter your full name.",
                  pattern: {
                    value: /^(?! )[A-Za-z\s]+$/,
                    message: "Enter letters only, no space at start.",
                  },
                })}
              />
              {errors.fullName && (
                <div className={styles.errorMessage}>{errors.fullName.message}</div>
              )}
            </div>

            {/* Gender */}
            <div className="col-12 col-md-6 mb-3">
              <label className={`${styles.formtitle} mb-3 d-block`}>Gender</label>
              <Controller
                name="gender"
                control={control}
                rules={{ required: "Please select a gender." }}
                render={({ field }) => (
                  <Select
                    {...field}
                    classNamePrefix="react-select"
                    options={genderOptions}
                    placeholder="Select"
                  />
                )}
              />
              {errors.gender && (
                <div className={styles.errorMessage}>{errors.gender.message}</div>
              )}
            </div>

            {/* Date of Birth */}
            <div className="col-12 col-md-6 mb-3">
              <label htmlFor="dob" className={`${styles.formtitle} mb-3 d-block`}>
                Date of Birth
              </label>
              <input
                id="dob"
                type="date"
                className="form-control shadow-none"
                min={get100YearsAgoDate()}
                max={getTodayDate()}
                {...register("dob", {
                  required: "Please select your date of birth.",
                  validate: (value) => {
                    const age = calculateAge(value);
                    return age >= 18 || "You must be at least 18 years old to register.";
                  },
                })}
              />
              {errors.dob && (
                <div className={styles.errorMessage}>{errors.dob.message}</div>
              )}
            </div>

            {/* Occupation */}
            <div className="col-12 col-md-6 mb-3">
              <label className={`${styles.formtitle} mb-3 d-block`}>Occupation</label>
              <Controller
                name="occupation"
                control={control}
                rules={{ required: "Please select your occupation." }}
                render={({ field }) => (
                  <Select
                    {...field}
                    classNamePrefix="react-select"
                    options={occupationOptions}
                    placeholder="Select Occupation"
                  />
                )}
              />
              {errors.occupation && (
                <div className={styles.errorMessage}>{errors.occupation.message}</div>
              )}
            </div>

            {/* Retirement Age */}
            <div className="col-12 col-md-6 mb-3">
              <label htmlFor="retirementAge" className={`${styles.formtitle} mb-3 d-block`}>
                Retirement Age
              </label>
              <input
                id="retirementAge"
                type="number"
                className="form-control shadow-none"
                placeholder="Enter Retirement age"
                {...register("retirementAge", {
                  required: "Please enter a valid retirement age.",
                  valueAsNumber: true,
                  min: { value: 18, message: "Retirement age must be at least 18 years." },
                  max: { value: 100, message: "Retirement age cannot exceed 100 years." },
                  validate: {
                    positive: (v) => v > 0 || "Please enter value more than 0",
                    lessThanExpectancy: (v) =>
                      !watchLifeExpectancy || v < watchLifeExpectancy ||
                      "Please enter retirement age less than life expectancy age",
                  },
                })}
              />
              {errors.retirementAge && (
                <div className={styles.errorMessage}>{errors.retirementAge.message}</div>
              )}
            </div>

            {/* Life Expectancy */}
            <div className="col-12 col-md-6 mb-4">
              <label htmlFor="lifeExpectancy" className={`${styles.formtitle} mb-3 d-block`}>
                Life Expectancy Age
              </label>
              <input
                id="lifeExpectancy"
                type="number"
                className="form-control shadow-none"
                placeholder="Enter Life Expectancy age"
                {...register("lifeExpectancy", {
                  required: "Please enter a valid life expectancy.",
                  valueAsNumber: true,
                  min: { value: 18, message: "Life expectancy must be at least 18 years." },
                  max: { value: 100, message: "Life expectancy cannot exceed 100 years." },
                  validate: {
                    positive: (v) => v > 0 || "Please enter value more than 0",
                    greaterThanRetire: (v) =>
                      !watchRetireAge || v > watchRetireAge ||
                      "Please enter value more than retirement age",
                  },
                })}
              />
              {errors.lifeExpectancy && (
                <div className={styles.errorMessage}>{errors.lifeExpectancy.message}</div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="d-flex justify-content-center align-items-center">
            <button
              type="submit"
              style={{
                ...buttonStyle,
                opacity: isValid ? 1 : 0.6,
                cursor: isValid ? "pointer" : "not-allowed",
              }}
              disabled={!isValid}
            >
              Continue
            </button>
          </div>
        </form>

      </ReactModal>
      <HideFooter />
    </>
  )
}
