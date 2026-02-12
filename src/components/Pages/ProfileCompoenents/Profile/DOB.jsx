import { useState, useEffect } from "react";
import "react-responsive-modal/styles.css";
import DOB from "../../../Assets/02_date_of_birth.svg";
import Form from "react-bootstrap/Form";
import { Container, Row, Col, Button } from "react-bootstrap";
import ProgressBar from "@ramonak/react-progress-bar";
import Link from "../../../MainComponents/Link";
import Male from "../../../Assets/01_Fatca_male.png";
import FeMale from "../../../Assets/02_Fatca_female.png";
import Other from "../../../Assets/03_Fatca_other.png";
import FintooButton from "../../../HTML/FintooButton";
import FintooProfileBack from "../../../HTML/FintooProfileBack";

import {} from "../../../../constants";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  CheckSession,
  apiCall,
  successAlert,
  errorAlert,
  memberId,
  loginRedirectGuest,
  getUserId,
  getPublicMediaURL,
} from "../../../../common_utilities";
import useForm from "./useForm";
import { format } from "date-fns";
import commonEncode from "../../../../commonEncode";
import axios from "axios";
import { RiCoinsLine } from "react-icons/ri";
import { DisableIcon } from "evergreen-ui";
import { MdDisabledByDefault } from "react-icons/md";
import FintooDatePicker from "../../../HTML/FintooDatePicker";
import { fetchUserProfileDetails, updateBasicDetails } from "../../../../FrappeIntegration-Services/services/user-management-api/userApiService";

function Dob(props) {
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState(null);
  const [errors, setErrors] = useState({});
  const userid = memberId();
  const [user_dob, setuser_dob] = useState("");
  const dispatch = useDispatch();
  const allUserData = localStorage.getItem("user");
  const userData = JSON.parse(allUserData);
  const showBack = useSelector((state) => state.isBackVisible);
  const [msg, setmessage] = useState("");
  const [userdob, setuserdob] = useState(false);
  const [adhardob, setAdharDob] = useState(false);
  const [disableGender, setDisableGender] = useState(false);
  const req_req = localStorage.getItem("req");

  useEffect(() => {
    const req_req = localStorage.getItem("req");

    if (req_req != null) {
      const response = JSON.parse(commonEncode.decrypt(req_req));

      const response_gender = response.data.gender;
      const response_dob = response.data.dob;
      // setAdharDob(response_dob)
      if (response_dob != null && response_gender != null) {
        setAdharDob(true)

        // setDob(moment(response_dob, "YYYY-MM-DD").toDate());
        setuserdob(true);

        if (response_gender == "M") {
          setGender("Male");
          setDisableGender(true);
        } else if (response_gender == "F") {
          setGender("Female");
          setDisableGender(true);
        } else {
          setGender("Other");
          setDisableGender(true);
        }
      }
    } else {
      onLoadInIt();
    }

    // // checksession();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }, []);

  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }, []);

  const onLoadInIt = async () => {
    // props.dispatch({
    //   type: "SET_PROGRESS",
    //   payload: Math.round((1 / 18) * 100),
    // });
    try {

      var responseobj = await fetchUserProfileDetails(getUserId());
      
      if(responseobj.status_code == 200){
        if (responseobj?.data?.user_dob != "" && responseobj?.data?.user_dob != null) {
          const formattedDob = responseobj.data.user_dob.split("-").reverse().join("-");
          let x = moment(formattedDob, "DD/MM/YYYY").toDate();
          setDob(x);
        } else {
          setDob(null);
        }

        setGender(responseobj.data["user_gender"]);
        var api_message = responseobj["message"];

      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: { message: api_message, type: "error" },
        });
      }
    } catch (e) {
      console.log("Error in fetching user profile details", e);
    }
  };

  function onChangeValue(event) {
    if (disableGender === true) return false;
    setGender(event.target.value);
  }
  const [isActive, setActive] = useState("true");

  const handleToggle = () => {
    setActive(!isActive);
  };

  const handleChange = (v) => {
    setDob(v);
    setErrors({});
  };

  const calculateAge = (dobString) => {
    if (!dobString) return null;

    const dob = new Date(dobString);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < dob.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleSubmit = async () => {
    if (!dob) {
      errors.dob = "This field is required";
      setErrors({ ...errors });
      return;
    } else if (dob > moment().subtract(18, "years").toDate()) {
      errorAlert("User cannot be Minor");
      return;
    } else {
      setErrors({});
    }
    if(gender == undefined){
      errors.gender = "Please select the gender";
      setErrors({ ...errors });
      return;
    }

    var payload = {
      user_id: getUserId(),
      dob: format(new Date(dob), "yyyy-MM-dd"),
      gender: gender
    }
    var respData = await updateBasicDetails(payload);

    if (respData["status_code"] == 200) {
      const formattedDob = payload.dob;
      const age = calculateAge(formattedDob);

      webengage.user.setAttribute("gender", payload.gender?.toLowerCase());
      webengage.user.setAttribute("we_birth_date", formattedDob);

      if (age !== null) {
        webengage.user.setAttribute("age", age);
      }

      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "User Details Updated Successfully!",
          type: "success",
        },
      });

      setTimeout(() => {
        props.onNext();
      }, 4000);
    } else {
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: respData["message"],
          type: "error",
        },
      });
      return;
    }
    // props.dispatch({
    //   type: "SET_PROGRESS",
    //   payload: Math.round((2 / 18) * 100),
    // });
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
        <div className=" RightPanel col-12 col-md-6">
          <div className="rhl-inner">
            {/* title="Date of Birth" */}
              <h4>Date of Birth</h4>
                {/* <FintooProfileBack
                title="Date of Birth"
                onClick={() => props.onPrevious()}
              /> */}
            <div>
              <p>Enter your date of birth as per your Aadhar.</p>
              <Row>
                <Col className=" p-2">
                  <div
                    className={`dob8 birth-calendar ${
                      dob ? "m_selected" : "m_empty"
                    }`}
                  >
                    <FintooDatePicker
                      disabled={adhardob}
                      maxDate={moment().subtract(18, "years").toDate()}
                      selected={dob ?? null}
                      onChange={(date) => handleChange(date)}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      dateFormat="dd/MM/yyyy"
                      // readOnly={req_req != null}
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
                      <div className="w-33 text-center" style={{ display: "" }}>
                        <input
                          style={{ display: "none" }}
                          id="Male"
                          type="radio"
                          value="Male"
                          name="gender"
                          checked={gender === "Male"}
                          onChange={(e) => {}}
                        />
                        <label
                          onClick={handleToggle}
                          htmlFor="Male"
                          className={
                            gender === "Male"
                              ? "ColorChange active"
                              : "ColorChange"
                          }
                        >
                          <img
                            src={getPublicMediaURL(
                              "/static/media/DMF/01_Fatca_male.svg"
                            )}
                            style={{
                              fontSize: "60px",
                            }}
                            alt="Male"
                          />
                          <div className="GenderName">
                            <span>Male</span>
                          </div>
                        </label>
                      </div>
                      <div className="w-33 text-center" style={{ display: "" }}>
                        <input
                          style={{ display: "none" }}
                          id="FeMale"
                          type="radio"
                          value="Female"
                          name="gender"
                          checked={gender === "Female"}
                          onChange={(e) => {}}
                        />
                        <label
                          htmlFor="FeMale"
                          className={
                            gender === "Female"
                              ? "ColorChange active"
                              : "ColorChange"
                          }
                        >
                          <img
                            src={getPublicMediaURL(
                              "/static/media/DMF/02_Fatca_female.svg"
                            )}
                            style={{
                              fontSize: "60px",
                            }}
                            alt="Female"
                          />
                          <div className="GenderName">
                            <span>Female</span>
                          </div>
                        </label>
                      </div>
                      <div className="w-33 text-center" style={{ display: "" }}>
                        <input
                          style={{ display: "none" }}
                          id="other"
                          type="radio"
                          value="Other"
                          name="gender"
                          checked={gender === "Other"}
                          onChange={(e) => {}}
                        />
                        <label
                          htmlFor="other"
                          className={
                            gender === "Other"
                              ? "ColorChange active"
                              : "ColorChange"
                          }
                        >
                          <img
                            src={getPublicMediaURL(
                              "/static/media/DMF/03_Fatca_other.svg"
                            )}
                            style={{
                              fontSize: "60px",
                            }}
                            alt="other"
                          />
                          <div className="GenderName">
                            <span>Other</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                  {errors.gender && <p className="error">{errors.gender}</p>}

                  {/* <hr className="ProfileHr" /> */}
                  <div className="fintoo-top-border pt-4 mt-4 ">
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
        </div>
      </Row>
    </>
  );
}

// const mapStateToProps = (state) => ({
//   progressValue: state.progressValue,
//   progressTitle: state.progressTitle,
// });

// export default connect(mapStateToProps)(Dob);
export default Dob;
