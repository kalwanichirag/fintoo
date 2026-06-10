import { useState, useEffect } from "react";
import "react-responsive-modal/styles.css";
import Form from "react-bootstrap/Form";
import { Row, Col } from "react-bootstrap";
import FintooButton from "../../../HTML/FintooButton";
import FintooProfileBack from "../../../HTML/FintooProfileBack";
import { getUserId } from "../../../../common_utilities";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import FintooCheckbox from "../../../FintooCheckbox/FintooCheckbox";
import { fetchUserProfileDetails, updateBasicDetails } from "../../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { GetOccupationList, GetSlabList } from "../../../../FrappeIntegration-Services/services/master-api/masterApiService";

const STATUS_CODE = {
  SUCCESS: 200,
};

const TOAST_TYPE = {
  SUCCESS: "success",
  ERROR: "error",
};

function Occupation(props) {
  const user_id = getUserId();
  const [validated, setValidated] = useState(false);
  const [userDetails, setUserDetails] = useState("");
  const [occupation, setOccupation] = useState([]);
  const [incSlabs, setIncSlab] = useState([]);
  const [occupationId, setOccupationId] = useState("");
  const [incomeId, setIncomeId] = useState("");
  const [MaStatus, SetMaStatus] = useState("");
  const dispatch = useDispatch();
  const showBack = useSelector((state) => state.isBackVisible);
  const statusList = ["Married", "Unmarried"];

  const onLoadInIt = async () => {
    try {
      const response = await fetchUserProfileDetails(user_id);
      setUserDetails(response?.data || {});
    } catch (e) {
      console.error("Error loading user details:", e);
    }
  };

  const defaultValues = () => {
    if (!userDetails) {
      setIncomeId("");
      setOccupationId("");
      SetMaStatus("");
      return;
    }

    setIncomeId(userDetails.user_income_slab_id || userDetails.income_slab_id || "");
    setOccupationId(userDetails.user_occupation_id || "");
    SetMaStatus(userDetails.user_marital_status || "");
  };

  useEffect(() => {
    defaultValues();
  }, [userDetails]);

  const getIncomeSlabs = async () => {
    try {
      const res = await GetSlabList();
      setIncSlab(res.data);
    } catch (e) {
      console.error("Error fetching income slabs:", e);
    }
  };

  const getOccupations = async () => {
    try {
      const responseobj = await GetOccupationList();
      setOccupation(responseobj.data);
    } catch (e) {
      console.error("Error fetching occupations:", e);
    }
  };

  useEffect(() => {
    localStorage.removeItem("req");
    onLoadInIt();
    getOccupations();
    getIncomeSlabs();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }, []);

  const handleStatusChange = (v) => {
    SetMaStatus(MaStatus === v ? "" : v);
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    
    if (form.checkValidity() === true) {
      if (occupationId && incomeId && occupationId !== "0" && incomeId !== "0" && MaStatus) {
        ApiCall();
      } else {
        let message = "";
        if (!occupationId && !incomeId && !MaStatus) {
          message = "Please select Marital Status, Occupation & Income Slab";
        } else if (!incomeId || incomeId === "0") {
          message = "Please select Income Slab";
        } else if (!occupationId || occupationId === "0") {
          message = "Please select Occupation";
        } else if (!MaStatus) {
          message = "Please select Marital Status";
        }
        
        dispatch({
          type: "RENDER_TOAST",
          payload: { message, type: TOAST_TYPE.ERROR },
        });
      }
    }
    setValidated(true);
  };
  
  const ApiCall = async () => {
    const payload = {
      user_id: getUserId(),
      occupation: occupationId,
      income_slab_id: incomeId,
      marital_status: MaStatus
    };
    
    const responseObj = await updateBasicDetails(payload);
    const errorCode = responseObj["status_code"];
    
    if (errorCode === STATUS_CODE.SUCCESS) {
      const incomeSlabLabel = incSlabs.find(w => w.slab_id === incomeId)?.slab_description || "";
      
      if (window.webengage?.user) {
        if (incomeSlabLabel) {
          window.webengage.user.setAttribute("Income Slab", incomeSlabLabel);
        }
        window.webengage.user.setAttribute("marital_status", MaStatus);
      }
      
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "User details updated successfully.",
          type: TOAST_TYPE.SUCCESS,
        },
      });
      
      setTimeout(() => {
        props.onNext();
      }, 3500);
    } else {
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: responseObj["message"], type: "error" },
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
                    value={incomeId}
                    onChange={(event) => setIncomeId(event.target.value)}
                  >
                    <option value="0">Select</option>
                    {incSlabs && incSlabs.map((w) => (
                      <option
                        key={w.slab_id}
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
              </div>
            </div>
          </Form>
        </div>
      </Row>
    </>
  );
}

export default Occupation;
