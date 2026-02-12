import { useState, useEffect } from "react";
import "react-responsive-modal/styles.css";
import Profile_1 from "../../../Assets/Profile_1.png";
import Form from "react-bootstrap/Form";
import { Container, Row, Col, Button } from "react-bootstrap";
import ProgressBar from "@ramonak/react-progress-bar";
import Link from "../../../MainComponents/Link";
import Back from "../../../Assets/left-arrow.png";
import FintooCheckbox from "../../../FintooCheckbox/FintooCheckbox";
import FintooButton from "../../../HTML/FintooButton";
import { CheckSession, getUserId, memberId } from "../../../../common_utilities";
import FintooProfileBack from "../../../HTML/FintooProfileBack";
import { ToastContainer, toast } from "react-toastify";
import {} from "../../../../constants";
import axios from "axios";
import { DMF_BASE_URL } from "../../../../constants";
import commonEncode from "../../../../commonEncode";
import { useDispatch, useSelector } from "react-redux";

function MaritalStatus(props) {
  const statusList = ["Married", "Unmarried"];
  var [MaStatus, SetMaStatus] = useState("");
  const user_id = memberId();
  const [userDetails, setUserDetails] = useState("");
  const [validated, setValidated] = useState(false);
  const dispatch = useDispatch();
  const showBack = useSelector((state) => state.isBackVisible);

  useEffect(() => {
    // // checksession();
    onLoadInIt();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }, []);

  const defaultValues = async () => {
    if (userDetails.marital_status != "") {
      SetMaStatus(userDetails.marital_status);
    } else {
      SetMaStatus("");
    }
  };

  useEffect(() => {
    defaultValues();
  }, [userDetails]);

  const onLoadInIt = async () => {
    var data = { user_id: getUserId() };
    try {
      var data = commonEncode.encrypt(JSON.stringify(data));
      var config = {
        method: "post",
        url: '',
        data: data,
      };
      var res = await axios(config);
      var response = commonEncode.decrypt(res.data);
      setUserDetails(JSON.parse(response)["data"]);
    } catch (e) {}
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      if (MaStatus != "") {
        ApiCall();
      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "Please select a valid option for Marital Status",
            type: "error",
          },
        });
      }
    }
    setValidated(true);
  };

  const ApiCall = async () => {
    let url = DMF_UPDATEBASICDETAILS_API_URL;
    let data_sent = JSON.stringify({
      user_id: getUserId(),
      marital_status: MaStatus,
    });
    var config = {
      method: "post",
      url: url,
      data: commonEncode.encrypt(data_sent),
    };
    var res = await axios(config);
    var response = commonEncode.decrypt(res.data);
    let response_obj = JSON.parse(response);
    let error_code = response_obj["error_code"];
    if (error_code == "100") {
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

  const handleStatusChange = (v) => {
    if (MaStatus == v) {
      SetMaStatus("");
    } else {
      SetMaStatus(v);
    }
  };

  return (
    <>
      <ToastContainer limit={1} />
      <Row className="reverse">
        <div className="col-12 col-md-6 ProfileImg">
          <div>
            <img src={process.env.REACT_APP_STATIC_URL + "media/DMF/Profile_1.svg"}  alt="ProfileImg" />
          </div>
        </div>
        <div className="col-12 col-md-6 RightPanel">
          <div className="rhl-inner">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              {showBack == true && (
                <FintooProfileBack
                  title="Marital Status"
                  onClick={() => props.onPrevious()}
                />
              )}
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
              <hr className="ProfileHr" />
              <div className="pt-4">
                {/* <hr className="ProfileHr" /> */}
                <div className="pt-2">
                  <FintooButton
                    className="d-block me-0 ms-auto"
                    type="submit"
                    title="Next"
                  />
                </div>
              </div>
            </Form>
          </div>
        </div>
      </Row>
    </>
  );
}

export default MaritalStatus;
