import { useState, useEffect, useRef } from "react";
import "react-responsive-modal/styles.css";
import Link from "../../../MainComponents/Link";
import Profile_1 from "../../../Assets/06_banking_app.svg";
import BankConfirm from "../../../Assets/13_penny_dropped.png";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Container, Row, Col } from "react-bootstrap";
import ProgressBar from "@ramonak/react-progress-bar";
import "../Fatca/style.css";
import Back from "../../../Assets/left-arrow.png";
import { Modal, Button } from "react-bootstrap";
import FintooButton from "../../../HTML/FintooButton";
import FintooProfileBack from "../../../HTML/FintooProfileBack";
import axios from "axios";
import {
  RAZORPAY_API_URL,
} from "../../../../constants";
import commonEncode from "../../../../commonEncode";
import { ToastContainer, toast } from "react-toastify";
import {
  CheckSession,
  getMinorUserId,
  memberId,
} from "../../../../common_utilities";
import { useDispatch, useSelector } from "react-redux";
import { useLoaderData } from "react-router-dom";
import { fetchUserProfileDetails } from "../../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { addNewCity, pennydropValidation, getCodes, getUserBankDetails } from "../../../../FrappeIntegration-Services/services/master-api/masterApiService";

function Bank(props) {
  const [validated, setValidated] = useState(false);
  const [bankdata, setbankdate] = useState("");
  const [bankDetails, setBankDetails] = useState([]);
  var [razorpayDetails, setRazorpayDetails] = useState([]);
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [userDetails, setUserDetails] = useState("");
  const [accountTypes, setAccountTypes] = useState([]);
  const [bankAccountType, setBankAccountType] = useState(0);
  const [addbank, setaddbank] = useState({});
  const showBack = useSelector((state) => state.isBackVisible);
  const [userresponse, setuserresponse] = useState("");
  const [bankId, setBankId] = useState("");
  const dispatch = useDispatch();
  const [responsebank, setresponse] = useState("");
  const [resd, setres] = useState("");
  const user_id = props.value == "minor" ? getMinorUserId() : memberId();
  var bank_id_user = "";
  var local_id = "";


  var retrievedData = localStorage.getItem("Bank_DETAILS");
  var retrievedObject = JSON.parse(retrievedData);

  useEffect(() => {
    localStorage.removeItem("Bank_DETAILS");
    if (retrievedObject != null) {
      setAccountNumber(retrievedObject.bank_acc_no);
      setBankAccountType(retrievedObject.bank_type);
      setIfscCode(retrievedObject.bank_ifsc_code);
    }
  }, []);

  const razorRef = useRef();
  if (localStorage.getItem("YmFua19pZA==")) {
    bank_id_user = localStorage.getItem("YmFua19pZA==");

    if (bank_id_user != "") {
      local_id = commonEncode.decrypt(bank_id_user);
    } else {
      local_id = "";
    }
  }

  // useEffect(() => {
  //   if (local_id != "") {
  //     getbankdetails();
  //   }
  //   getBankDetails();
  // }, [responsebank, bankid]);

  const getBankDetails = async () => {

    var payload = {
      user_id: user_id
    }

    var response = await getUserBankDetails(payload);
    
    var accno   = response?.data?.[0]?.bank_acc;
    var acctype = response?.data?.[0]?.bank_acc_type_id;
    var accifsc = response?.data?.[0]?.bank_ifsc_code;
    var bankid  = response?.data?.[0]?.bank_id;
    localStorage.setItem(
      "YmFua19pZA==",
      commonEncode.encrypt(bankid + "")
    );

    setuserresponse(response);

    if (accno != null && acctype != null && accifsc != null) {
      setAccountNumber(accno);
      setIfscCode(accifsc);
      setBankAccountType(acctype);
      setBankId(bankid);
    }
  };

  useEffect(() => {
    onLoadInIt();
    // // checksession();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }, [resd]);

  useEffect(() => {
    if (localStorage.getItem("bankType") !== null) {
      let a = localStorage.getItem("bankType");
      setBankAccountType(a);
    }
  }, [accountTypes]);

  const onLoadInIt = async () => {
    
    try {
      var response = await fetchUserProfileDetails(user_id);

      setUserDetails(response.data);
      setres(response.data.user_residential_status);
      renderBankTypes(response.data.user_residential_status);
      getBankDetails();
    } catch (e) {
      
    }
  };
  let resi = resd;

  let navDynamicNext = "";
  let navDynamicPrev = "";
  if (resi == "RES") {
    navDynamicNext = "ConfirmBank";
    navDynamicPrev = "Bank";
  } else if (resi== 'NRE' || resi == 'NRO' || resi == 'NRI') {
    navDynamicNext = "BankCheque";
    navDynamicPrev = "Bank";
  }
  localStorage.setItem(
    "bmF2RHluYW1pY05leHQ=",
    commonEncode.encrypt(navDynamicNext)
  );
  localStorage.setItem(
    "bmF2RHluYW1pY1ByZXY=",
    commonEncode.encrypt(navDynamicPrev)
  );

  const renderBankTypes = (n) => {
    switch (n) {
      case "RES":
        setAccountTypes([
          { title: "Savings", value: "BTM-1" },
          { title: "Current", value: "BTM-2" },
        ]);
        break;
      case "NRI":
        setAccountTypes([
          { title: "NRE", value: "BTM-3" },
          { title: "NRO", value: "BTM-4" },
        ]);
        break;
      default:
        setAccountTypes([]);
    }
  };

  const fetchBankDetails = async () => {
    try {
      const r = await axios.get(RAZORPAY_API_URL + ifscCode);

      var payload = {
          state: r.data.STATE,
          city: r.data.CITY,
        }
      const r1 = await addNewCity(payload);
      
      if (r1.status_code == 200 || r1.state_code == 201) {
        // when city already exist error
        var payload = {
          "state": r.data.STATE,
          "city": r.data.CITY,
          "bank_code": r.data.BANKCODE
        }
        const r2 = await getCodes(payload);

        // penny drop here
        let pennyResponse = null;
        try {
          if (bankAccountType == "BTM-1" || bankAccountType == "BTM-2") {
            pennyResponse = await penny();
          }
        } catch {
          throw pennyResponse;
        }
       
        const urlAddData = {
          bank_user_id: user_id,
          bank_acc_no: accountNumber,
          bank_type: bankAccountType,
          bank_ifsc_code: ifscCode,
          bank_name: r.data.BANK,
          is_primary: 1,
          bank_branch: r.data.BRANCH,
          bank_code: r.data.BANKCODE,
          bank_city: r2.data.city_code,
          bank_state: r2.data.state_code,
          bank_bse_code: r2.data.bank_bse_code,
          bank_address: r.data.ADDRESS,
          bank_country: "India",
          micr_code: r.data.MICR,
          single_survivor: "single"
        };
        
        localStorage.setItem("bankDetails", JSON.stringify(urlAddData));
        props.setShowPanel(navDynamicNext);
       
      } 
    } catch (err) {console.log("error----->", err);
      if (
        err &&
        "response" in err &&
        "status" in err.response &&
        err.response.status == 404
      ) {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "Provide a valid IFSC Code.",
            type: "error",
            autoClose: 3000,
          },
        });
      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "Provide valid bank details",
            type: "error",
            autoClose: 3000,
          },
        });
      }
    }
    return;

    if (resF.status == 404) {
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "Please provide a valid IFSC Code.",
          type: "error",
          autoClose: 3000,
        },
      });
    }
    var configRP = {
      method: "get",
      url: RAZORPAY_API_URL + ifscCode,
    };
    var resRP = await axios(configRP);
    var responseRP = resRP.data;

    if (resRP.statusText == "OK") {
      if (
        responseRP.CITY == "NA" ||
        responseRP.ADDRESS == "NA" ||
        responseRP.CENTRE == "NA" ||
        responseRP.DISTRICT == "NA"
      ) {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "Please check your IFSC Code.",
            type: "error",
            autoClose: 3000,
          },
        });
      } else {
        setRazorpayDetails(responseRP);
      }
    }

    if (resd == 1) {
      var bankDetailsData = { id_number: accountNumber, ifsc: ifscCode };
      var data = commonEncode.encrypt(JSON.stringify(bankDetailsData));

      var config = {
        method: "post",
        url: DMF_GETPENNYDROP_API_URL,
        data: data,
      };

      var res = await axios(config);
      var responsePD = commonEncode.decrypt(res.data);
      razorRef.current = JSON.parse(responsePD).data;

      if (Boolean(JSON.parse(responsePD)["error_code"]) == true) {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: JSON.parse(responsePD)["message"],
            type: "error",
            autoClose: 3000,
          },
        });
      } else {
        var bankDetailsRP = responseRP;
        var stateString = bankDetailsRP.STATE;
        var cityString = bankDetailsRP.CITY;

        var stateCodeCityCode = {
          state: stateString,
          city: cityString,
        };

        var data = commonEncode.encrypt(JSON.stringify(stateCodeCityCode));

        var config = {
          method: "post",
          url: DMF_ADD_CITIES_API_URL,
          data: data,
        };

        var res = await axios(config);
        var response = commonEncode.decrypt(res.data);
        var response_Obj = JSON.parse(response);

        if (
          response_Obj.error_code == 100 ||
          response_Obj.message == "City already exists!"
        ) {
          var data = commonEncode.encrypt(JSON.stringify(stateCodeCityCode));

          var config = {
            method: "post",
            url: DMF_GETCODES_API_URL,
            data: data,
          };

          var res = await axios(config);
          var response = commonEncode.decrypt(res.data);
          if (response.error_code == "100") {
            setBankDetails(responsePD);
          }
          var response_obj_cityStateCode = JSON.parse(response);
          var urladddata = {
            bank_user_id: user_id,
            bank_acc_no: accountNumber,
            bank_type: bankAccountType + "",
            bank_ifsc_code: ifscCode,
            bank_name: responseRP.BANK,
            is_primary: "0",
            bank_branch: responseRP.BRANCH,
            bank_code: responseRP.BANKCODE,
            bank_city: response_obj_cityStateCode.message.city_code,
            bank_state: response_obj_cityStateCode.message.state_code,
            bank_address: responseRP.ADDRESS,
            bank_country: "94",
            micr_code: responseRP.MICR,
            single_survivor: "single",
          };
          if (bankAccountType == 3 || bankAccountType == 4) {
            if (responsebank == "" && userresponse == "") {
              {
                var data = commonEncode.encrypt(JSON.stringify(urladddata));
                var config = {
                  method: "post",
                  url: DMF_ADDBANK_API_URL,
                  data: data,
                };

                var res = await axios(config);
                var response = commonEncode.decrypt(res.data);

                var response_obj = JSON.parse(response);

                let bank_id = parseInt(response_obj.data);

                const req = commonEncode.encrypt(JSON.stringify(bank_id));
                localStorage.setItem("YmFua19pZA==", req);

                let error_code = response_obj.error_code;
                if (error_code == "102") {
                  dispatch({
                    type: "RENDER_TOAST",
                    payload: {
                      message: response_obj.message,
                      type: "error",
                      autoClose: 3500,
                    },
                  });
                } else if (error_code == "100") {
                  dispatch({
                    type: "RENDER_TOAST",
                    payload: {
                      message: "Bank Account Saved!",
                      type: "success",
                      autoClose: 3000,
                    },
                  });
                  if (resd == 1) {
                    setBankDetails(JSON.parse(responsePD));
                  }

                  handleShow();
                  setTimeout(() => {
                    props.onNext(navDynamicNext);
                    handleClose();
                  }, 4000);
                }
              }
            } else {
              if (responsebank != "" || userresponse != "") {
                updateBank();
                handleShow();
                setTimeout(() => {
                  props.onNext(navDynamicNext);
                  handleClose();
                }, 4000);
              }
            }
          }
          localStorage.setItem("Bank_DETAILS", JSON.stringify(urladddata));
          handleShow();
          setTimeout(() => {
            props.onNext(navDynamicNext);
            handleClose();
          }, 4000);
        }
      }
    } else {
      // ******** NRO NRE DUE TO PENNYDROP
      var bankDetailsRP = responseRP;
      var stateString = bankDetailsRP.STATE;
      var cityString = bankDetailsRP.CITY;

      var stateCodeCityCode = {
        state: stateString,
        city: cityString,
      };

      var data = commonEncode.encrypt(JSON.stringify(stateCodeCityCode));

      var config = {
        method: "post",
        url: DMF_ADD_CITIES_API_URL,
        data: data,
      };

      var res = await axios(config);
      var response = commonEncode.decrypt(res.data);
      var response_Obj = JSON.parse(response);

      if (
        response_Obj.error_code == 100 ||
        response_Obj.message == "City already exists!"
      ) {
        var data = commonEncode.encrypt(JSON.stringify(stateCodeCityCode));

        var config = {
          method: "post",
          url: DMF_GETCODES_API_URL,
          data: data,
        };

        var res = await axios(config);
        var response = commonEncode.decrypt(res.data);
        if (response.error_code == "100") {
          setBankDetails(responsePD);
        }
      }

      var response_obj_cityStateCode = JSON.parse(response);
      var urladddata = {
        bank_user_id: user_id,
        bank_acc_no: accountNumber,
        bank_type: bankAccountType + "",
        bank_ifsc_code: ifscCode,
        bank_name: responseRP.BANK,
        is_primary: "0",
        bank_branch: responseRP.BRANCH,
        bank_code: responseRP.BANKCODE,
        bank_city: response_obj_cityStateCode.message.city_code,
        bank_state: response_obj_cityStateCode.message.state_code,
        bank_address: responseRP.ADDRESS,
        bank_country: "94",
        micr_code: responseRP.MICR,
        single_survivor: "single",
      };
      var data = commonEncode.encrypt(JSON.stringify(urladddata));
      var config = {
        method: "post",
        url: DMF_ADDBANK_API_URL,
        data: data,
      };

      var res = await axios(config);
      var response = commonEncode.decrypt(res.data);

      var response_obj = JSON.parse(response);

      let bank_id = parseInt(response_obj.data);

      const req = commonEncode.encrypt(JSON.stringify(bank_id));
      localStorage.setItem("YmFua19pZA==", req);

      let error_code = response_obj.error_code;
      if (error_code == "102") {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: response_obj.message,
            type: "error",
            autoClose: 3500,
          },
        });
      } else if (error_code == "100") {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "Bank Account Saved!",
            type: "success",
            autoClose: 3000,
          },
        });
      }

      setTimeout(() => {
        props.onNext(navDynamicNext);
        handleClose();
      }, 4000);
    }
  };


  const penny = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        handleShow();
        var payload = { bank_acc_no: accountNumber, bank_ifsc_code: ifscCode };

        var res = await pennydropValidation(payload);

        if (res.status_code == 200) {
          let responseobj = res.data.ifsc_code;
          setTimeout(() => {
            handleClose();
            resolve(responseobj);
          }, 2000);
        } else {
          throw "Invalid bank details";
        }
        
      } catch (e) {
        handleClose();
        reject(e);
      }
    });
  };

  const MyFunction = async () => {
    try {
      var penyresponse = await penny();

      var bank_id = JSON.stringify(bankid);
      if (local_id != "") {
        var bank_id = local_id;
      }

      if (Object.keys(penyresponse).length > 0) {
        var bankreq = {
          bank_id: bank_id,
          bank_user_id: user_id,
          bank_acc_no: accountNumber,
          bank_type: bankAccountType + "",
          bank_ifsc_code: ifscCode,
          bank_name: penyresponse.bank_name,
          is_primary: "0",
          is_active: "1",
          bank_code: razorRef.current.ifsc_details.bank_code,
        };
        return bankreq;
      }
    } catch (err) {
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "Invalid bank details!",
          type: "error",
          autoClose: 3000,
        },
      });
    }
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      fetchBankDetails();
    }
    setValidated(true);
  };

  const [showModal, setShow] = useState(false);

  const updateBank = async () => {
    var payload = await MyFunction();

    let post_data = commonEncode.encrypt(JSON.stringify(payload));

    // try {
    //   var config = {
    //     method: "post",
    //     url: DMF_UPDATEBANK_API_URL,
    //     data: post_data,
    //   };
    //   var res = await axios(config);
    //   var response = commonEncode.decrypt(res.data);
    //   var response_obj = JSON.parse(response);

    //   let error_code = response_obj.error_code;

    //   if (error_code == "100") {
    //     dispatch({
    //       type: "RENDER_TOAST",
    //       payload: { message: "Bank saved successfully.", type: "success" },
    //       autoClose: 3000,
    //     });
    //     handleShow();
    //     setTimeout(() => {
    //       props.onNext(navDynamicNext);
    //       handleClose();
    //     }, 4000);
    //   } else {
    //     dispatch({
    //       type: "RENDER_TOAST",
    //       payload: { message: response_obj.message, type: "error" },
    //       autoClose: 3000,
    //     });
    //   }
    // } catch (e) {
    //   e.errorAlert();
    // }
  };

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const [label, setLabel] = useState("");

  const handleSelect = (e) => {
    setBankAccountType(e.target.value + "");
  };
  return (
    <Row className="reverse">
      <ToastContainer limit={1} />
      <Col className="ProfileImg ">
        <div>
          <img
            src={
              process.env.REACT_APP_STATIC_URL + "media/DMF/06_banking_app.svg"
            }
            alt=""
          />
        </div>
      </Col>
      <Col className=" RightPanel ">
        <div className="rhl-inner">
          {showBack == true && (
            <div className={props.value === "minor" ? "my-btn-disabled " : ""}>
              <FintooProfileBack
                title="Bank Details"
                onClick={() => props.onPrevious()}
              />
            </div>
          )}
          <p className="">Please enter the details of your bank account.</p>

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Label className="LabelName" htmlFor="inputText">
              Account Number
            </Form.Label>
            <Form.Control
              controlId="validationCustom05"
              maxLength="18"
              placeholder="Enter your Account Number "
              className="shadow-none"
              required
              style={{
                borderRadius: "12px",
                height: "2.5rem",
                outline: "none",
              }}
              type="text"
              onChange={(event) => {
                setAccountNumber(event.target.value);
              }}
              value={accountNumber}
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
            ></Form.Control>
            <Form.Control.Feedback type="invalid">
              Account Number Required
            </Form.Control.Feedback>

            <div className="Nominee_Identity">
              <Form.Label className="LabelName" htmlFor="inputText">
                IFSC Code
              </Form.Label>
              <Form.Control
                pattern="^[A-Z]{4}[0][A-Z0-9]{6}$"
                required
                placeholder="Enter the IFSC"
                aria-label="Default select example"
                className="shadow-none"
                style={{
                  borderRadius: "12px",
                  height: "2.5rem",
                  outline: "none",
                }}
                onChange={(event) =>
                  setIfscCode(event.target.value.toUpperCase())
                }
                feedback="You must agree before submitting."
                feedbackType="invalid"
                value={ifscCode}
                maxLength="11"
              ></Form.Control>
              {ifscCode.length > 0 ? (
                <Form.Control.Feedback type="invalid">
                  Invalid IFSC code
                </Form.Control.Feedback>
              ) : (
                <Form.Control.Feedback type="invalid">
                  IFSC Code Required
                </Form.Control.Feedback>
              )}
            </div>
            <div className="Nominee_Identity">
              <Form.Label className="LabelName" htmlFor="inputText">
                Account Type
              </Form.Label>

              <select
                controlId="validationCustom02"
                className="shadow-none form-select"
                required
                placeholder="Select Your Bank Type"
                aria-label="Default select example"
                style={{
                  borderRadius: "12px",
                  height: "2.5rem",
                  outline: "none",
                }}
                onChange={handleSelect}
                value={bankAccountType}
              >
                <option value="">Select Account Type</option>
                {accountTypes.map((v) => (
                  <option value={v.value}>{v.title}</option>
                ))}
              </select>
              <Form.Control.Feedback type="invalid">
                Please Select Bank Account Type
              </Form.Control.Feedback>
            </div>
            <div className="fintoo-top-border mt-4 pt-4">
              <FintooButton
                className="d-block ms-auto me-0"
                title={"Next"}
                type="submit"
              />
            </div>
          </Form>
        </div>

        <Modal show={showModal} onHide={handleClose}>
          <div style={{ marginTop: "3rem" }}>
            <div>
              <h4 style={{ textAlign: "center", fontWeight: "bold" }}>
                Bank Account Verification
              </h4>
            </div>
            <div
              style={{
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                marginTop: "1.5rem",
              }}
            >
              <img
                style={{ width: "200px" }}
                src={
                  process.env.REACT_APP_STATIC_URL +
                  "media/DMF/13_penny_dropped.png"
                }
                alt=""
              />
            </div>
            <div
              style={{
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                marginTop: "2rem",
              }}
            >
              <p
                style={{
                  textAlign: "match-parent",
                  fontSize: "20px",
                  width: "23rem",
                  fontWeight: "500",
                  color: "gray",
                }}
              >
                We will be sending ₹1 to your bank account as a part of the verification process.
              </p>
            </div>
            <div></div>
          </div>
        </Modal>
      </Col>
    </Row>
  );
}

export default Bank;
