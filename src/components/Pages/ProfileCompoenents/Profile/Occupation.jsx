import { useState, useEffect } from "react";
import "react-responsive-modal/styles.css";
import Link from "../../../MainComponents/Link";
import Profile_1 from "../../../Assets/Profile_1.png";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Container, Row, Col } from "react-bootstrap";
import ProgressBar from "@ramonak/react-progress-bar";
import Back from "../../../Assets/left-arrow.png";
import FintooButton from "../../../HTML/FintooButton";
import FintooProfileBack from "../../../HTML/FintooProfileBack";
import { CheckSession, getUserId, memberId } from "../../../../common_utilities";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import commonEncode from "../../../../commonEncode";
import {} from "../../../../constants";
import { useDispatch, useSelector } from "react-redux";
import FintooCheckbox from "../../../FintooCheckbox/FintooCheckbox";
import { fetchUserProfileDetails, updateBasicDetails } from "../../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { GetOccupationList, GetSlabList } from "../../../../FrappeIntegration-Services/services/master-api/masterApiService";


function Occupation(props) {
  const user_id = getUserId();
  const [validated, setValidated] = useState(false);
  const [userDetails, setUserDetails] = useState("");
  const [occupation, setOccupation] = useState([]);
  const [incSlabs, setIncSlab] = useState([]);
  const dispatch = useDispatch();
  const [occupationId, setOccupationId] = useState("");
  const [incomeId, setIncomeId] = useState("");
  const allUserData = localStorage.getItem("user");
  const showBack = useSelector((state) => state.isBackVisible);
  const userData = JSON.parse(allUserData);
  const statusList = ["Married", "Unmarried"];
  const [MaStatus, SetMaStatus] = useState("");

  const onLoadInIt = async () => {
    try {
      var response = await fetchUserProfileDetails(user_id);
      setUserDetails(response?.data ? response.data : {});
    } catch (e) {
      e.errorAlert();
    }
  };

  const defaultValues = async () => {
    // Check if userDetails exists before accessing its properties
    if (!userDetails) {
      setIncomeId("");
      setOccupationId("");
      SetMaStatus("");
      return;
    }

    if (userDetails.income_slab_id != "") {
      setIncomeId(userDetails.income_slab_id);
    } else {
      setIncomeId("");
    }
    if (userDetails.user_occupation_id != "") {
      setOccupationId(userDetails.user_occupation_id);
    } else {
      setOccupationId("");
    }
    if (userDetails.user_marital_status != "") {
      SetMaStatus(userDetails.user_marital_status);
    } else {
      SetMaStatus("");
    }
  };

  useEffect(() => {
    defaultValues();
  }, [userDetails]);

  const getIncomeSlabs = async () => {
    try {
      
      var res = await GetSlabList();
      var responseInc = res.data;
      setIncSlab(responseInc);
    } catch (e) {
      e.errorAlert();
    }
  };

  const getOccupations = async () => {
    try {
      var responseobj = await GetOccupationList();
      setOccupation(responseobj.data);
    } catch (e) {
      e.errorAlert();
    }
  };

  useEffect(() => {
    localStorage.removeItem("req");
    // // checksession();
    onLoadInIt();
    getOccupations();
    getIncomeSlabs();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }, []);

  const handleStatusChange = (v) => {
    if (MaStatus == v) {
      SetMaStatus("");
    } else {
      SetMaStatus(v);
    }
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    
    if (form.checkValidity() === true) {
      if (
        occupationId != "" &&
        incomeId != "" &&
        occupationId != "0" &&
        incomeId != "0" &&
        MaStatus != ""
      ) {
        ApiCall();
      } else {
        if (!occupationId && !incomeId && !MaStatus) {
          dispatch({
            type: "RENDER_TOAST",
            payload: {
              message: "Please select Marital Status,Occupation & Income Slab",
              type: "error",
            },
          });
        } else if (incomeId == "" || incomeId == "0") {
          dispatch({
            type: "RENDER_TOAST",
            payload: {
              message: "Please select Income Slab",
              type: "error",
            },
          });
        } else if (occupationId == "" || occupationId == "0") {
          dispatch({
            type: "RENDER_TOAST",
            payload: {
              message: "Please select Occupation",
              type: "error",
            },
          });
        } else if (MaStatus == "") {
          dispatch({
            type: "RENDER_TOAST",
            payload: {
              message: "Please select Marital Status",
              type: "error",
            },
          });
        }
      }
    }
    setValidated(true);
  };
  
  const ApiCall = async () => {
    
    var payload = {
      user_id: getUserId(),
      occupation: occupationId,
      income_slab_id: incomeId,
      marital_status: MaStatus
    }
    var response_obj = await updateBasicDetails(payload);
    let error_code = response_obj["status_code"];
    if (error_code == 200) {
      let incomeSlabLabel = "";
      incSlabs.forEach((w) => {
        if (w.slab_id === incomeId) {
          incomeSlabLabel = w.slab_description;
        }
      });
      if (window.webengage && window.webengage.user) {
        if (incomeSlabLabel) {
          window.webengage.user.setAttribute("Income Slab", incomeSlabLabel);
        }
        window.webengage.user.setAttribute("marital_status", MaStatus);
      }
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "User details updated successfully.",
          type: "success",
        },
      });
      setTimeout(() => {
        props.onNext();
      }, 3500);
    } else {
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: response_obj["message"], type: "error" },
      });
    }
  };

  return (
    <>
      <ToastContainer limit={2} />
      <Row className="reverse">
        <div className="col-12 col-md-6 ProfileImg">
          <div>
            <img src={process.env.REACT_APP_STATIC_URL + "media/DMF/Profile_1.svg"}  alt="ProfileImg" />
          </div>
        </div>
        <div className="col-12 col-md-6 RightPanel">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <div>
              {showBack == true && (
                <FintooProfileBack
                  title=" "
                  onClick={() => props.onPrevious()}
                />
              )}
              <div className="fintoo-bottom-border pb-4 ">
                <h4>Marital Status</h4>
              <p>Select your current relationship status.</p>
              <Row style={{ width: "100%" }}>
                <Col className=" p-2">
                  <div className="fi-list">
                    {statusList.map((v) => (
                      <>
                        <div className="fi-list-item">
                          <FintooCheckbox
                            checked={MaStatus == v}
                            title={v}
                            onChange={() => handleStatusChange(v)}
                          />
                        </div>
                      </>
                    ))}
                  </div>
                </Col>
              </Row>
              </div>
              <div className="fintoo-bottom-border pb-4 ">
                <h4>Occupation</h4>
                <p className="mb-4">
                  Please select your current occupation from the below options.
                </p>
                <Form.Select
                  aria-label="Default select example"
                  className="shadow-none"
                  style={{
                    borderRadius: "10px",
                    height: "3rem",
                    outline: "none",
                  }}
                  required
                  value={occupationId}
                  onChange={(event) => setOccupationId(event.target.value)}
                >
                  <option value="0">Select</option>
                  {occupation && occupation.map((v) => (
                    <option
                      selected={v.occupation_id == userDetails.user_occupation_id}
                      value={v.occupation_id}
                    >
                      {v.occupation_name}
                    </option>
                  ))}
                </Form.Select>
              </div>

              <div className="VerifyDetails pt-4">
                <h4>Income</h4>
                <div className=" fintoo-bottom-border pb-4 ">
                  <p className="mb-4">
                    Please select your income slab as per your current ITR
                    filling.
                  </p>
                  <Form.Select
                    required
                    className="shadow-none"
                    aria-label="Default select example"
                    style={{
                      borderRadius: "10px",
                      outline: "none",
                      height: "3rem",
                    }}
                    onChange={(event) => setIncomeId(event.target.value)}
                  >
                    <option value="0">Select</option>
                    {incSlabs && incSlabs.map((w) => (
                      <option
                        selected={
                          userDetails && w.slab_id == userDetails.user_income_slab_id
                        }
                        value={w.slab_id}
                      >
                        {w.slab_description}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </div>

              <div className="pt-4">
                <FintooButton
                  className="d-block me-0 ms-auto"
                  type="submit"
                  title="Next"
                />
                {/* onClick={() => props.onNext()} */}
              </div>
            </div>
          </Form>
        </div>
      </Row>
    </>
  );
}

export default Occupation;
