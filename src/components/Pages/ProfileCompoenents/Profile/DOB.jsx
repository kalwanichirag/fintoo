import { useState, useEffect } from "react";
import "react-responsive-modal/styles.css";
import { Row, Col } from "react-bootstrap";
import FintooButton from "../../../HTML/FintooButton";
import { ToastContainer } from "react-toastify";
import moment from "moment";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import { getUserId, getPublicMediaURL } from "../../../../common_utilities";
import FintooDatePicker from "../../../HTML/FintooDatePicker";
import {
  fetchUserProfileDetails,
  updateBasicDetails
} from "../../../../FrappeIntegration-Services/services/user-management-api/userApiService";

import commonEncode from "../../../../commonEncode";

function Dob(props) {
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState(null);
  const [errors, setErrors] = useState({});
  const [adhardob, setAdharDob] = useState(false);
  const [disableGender, setDisableGender] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    try {
      const reqReq = localStorage.getItem("req");

      if (reqReq && commonEncode) {
        const response = JSON.parse(commonEncode.decrypt(reqReq));
        const responseGender = response?.data?.gender;
        const responseDob = response?.data?.dob;

        if (responseDob && responseGender) {
          setAdharDob(true);

          const genderMap = {
            M: "Male",
            F: "Female"
          };

          setGender(genderMap[responseGender] || "Other");
          setDisableGender(true);

          const parsedDob = moment(responseDob, "YYYY-MM-DD").toDate();
          setDob(parsedDob);
          return;
        }
      }

      onLoadInIt();
    } catch (err) {
      console.error("Prefill error", err);
      onLoadInIt();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const onLoadInIt = async () => {
    try {
      const responseobj = await fetchUserProfileDetails(getUserId());

      if (Number(responseobj?.status_code) === 200) {
        const apiDob = responseobj?.data?.user_dob;

        if (apiDob) {
          const dobDate = moment(apiDob, "YYYY-MM-DD").toDate();
          setDob(dobDate);
        } else {
          setDob(null);
        }

        setGender(responseobj?.data?.user_gender || "");
      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: { message: responseobj?.message, type: "error" }
        });
      }
    } catch (e) {
      console.error("Error fetching profile", e);
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: "Failed to load profile", type: "error" }
      });
    }
  };

  const onChangeValue = (event) => {
    if (disableGender) return;
    setGender(event.target.value);
  };

  const handleChange = (date) => {
    setDob(date);
    setErrors({});
  };

  const calculateAge = (dobString) => {
    if (!dobString) return null;

    const dobDate = new Date(dobString);
    const today = new Date();

    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < dobDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleSubmit = async () => {
    const newErrors = {};

    if (!dob) {
      newErrors.dob = "This field is required";
    }

    if (!gender) {
      newErrors.gender = "Please select the gender";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (dob > moment().subtract(18, "years").toDate()) {
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: "User cannot be Minor", type: "error" }
      });
      return;
    }

    const payload = {
      user_id: getUserId(),
      dob: format(new Date(dob), "yyyy-MM-dd"),
      gender
    };

    try {
      const respData = await updateBasicDetails(payload);

      if (Number(respData?.status_code) === 200) {
        const age = calculateAge(payload.dob);

        if (window.webengage?.user) {
          window.webengage.user.setAttribute(
            "gender",
            payload.gender?.toLowerCase()
          );
          window.webengage.user.setAttribute("we_birth_date", payload.dob);
          if (age !== null) {
            window.webengage.user.setAttribute("age", age);
          }
        }

        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "User Details Updated Successfully!",
            type: "success"
          }
        });

        setTimeout(() => {
          props.onNext();
        }, 800);
      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: respData?.message || "Update failed",
            type: "error"
          }
        });
      }
    } catch (err) {
      console.error("Update error", err);
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: "Something went wrong", type: "error" }
      });
    }
  };

  return (
    <>
      <ToastContainer limit={1} />
      <Row className="reverse">
        <div className="ProfileImg col-12 col-md-6">
          <div>
            <img
              src={getPublicMediaURL("static/media/DMF/02_date_of_birth.svg")}
              alt="DOB"
            />
          </div>
        </div>

        <div className="RightPanel col-12 col-md-6">
          <div className="rhl-inner">
            <h4>Date of Birth</h4>
            <p>Enter your date of birth as per your Aadhar.</p>

            <Row>
              <Col className="p-2">
                <div className={`dob8 birth-calendar ${dob ? "m_selected" : "m_empty"}`}>
                  <FintooDatePicker
                    disabled={adhardob}
                    maxDate={moment().subtract(18, "years").toDate()}
                    selected={dob ?? null}
                    onChange={handleChange}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
                {errors.dob && <p className="error">{errors.dob}</p>}
              </Col>
            </Row>

            <hr className="ProfileHr" />

            <div className="VerifyDetails">
              <h4>Gender</h4>
              <p>Select your gender</p>

              <div className="DobNext" style={{ marginTop: "0rem" }}>
                <div className="gs-bx">
                  <div className="GenderSelect" onChange={onChangeValue}>

                    {["Male", "Female", "Other"].map((g) => (
                      <div key={g} className="w-33 text-center">
                        <input
                          style={{ display: "none" }}
                          id={g}
                          type="radio"
                          value={g}
                          name="gender"
                          checked={gender === g}
                          onChange={onChangeValue}
                        />
                        <label
                          htmlFor={g}
                          className={gender === g ? "ColorChange active" : "ColorChange"}
                        >
                          <img
                            src={getPublicMediaURL(
                              `/static/media/DMF/0${g === "Male" ? 1 : g === "Female" ? 2 : 3}_Fatca_${g.toLowerCase()}.svg`
                            )}
                            alt={g}
                          />
                          <div className="GenderName">
                            <span>{g}</span>
                          </div>
                        </label>
                      </div>
                    ))}

                  </div>
                </div>

                {errors.gender && <p className="error">{errors.gender}</p>}

                <div className="fintoo-top-border pt-4 mt-4">
                  <FintooButton
                    className="d-block me-0 ms-auto"
                    onClick={handleSubmit}
                    title="Next"
                  />
                </div>

              </div>
            </div>
          </div>
        </div>
      </Row>
    </>
  );
}

export default Dob;