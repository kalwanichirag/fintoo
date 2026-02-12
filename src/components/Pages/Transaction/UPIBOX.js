import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Link from "../../MainComponents/Link";
import FintooCheckbox from "../../FintooCheckbox/FintooCheckbox";
import FintooBackButton from "../../HTML/FintooBackButton";
import PaymentApprove from "../ErrosPages/PaymentApprove";
import {
  apiCall,
  getItemLocal,
  getUserId,
  errorAlert,
  loginRedirectGuest,
  maskBankAccNo,
} from "../../../common_utilities";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import FintooLoader from "../../../components/FintooLoader";
import { DATA_BELONGS_TO } from "../../../constants";
import {
  Cancelorder,
  PlaceOrder,
  SuccessOrder,
} from "../../../FrappeIntegration-Services/services/investment-api/investmentService";
import { PaymentGatewayResponse } from "../../../FrappeIntegration-Services/services/master-api/masterApiService";

const upiRegex = new RegExp(/^[a-zA-Z0-9.-]{2,256}@[a-zA-Z][a-zA-Z]{2,64}$/);

function UPIBOX(props) {
  const userid = getUserId();
  const mandateType = getItemLocal("mandateType");
  const bankid = getItemLocal("selbankid");
  const [isOpened, setIsOpened] = useState(false);
  const [checked, setChecked] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [upiId, setUpiId] = useState("");
  const [loader, setloader] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [htmlResponse, setHtmlResponse] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const interval = useRef(null);
  const btnRef = useRef();
  const dispatch = useDispatch();
  const [confirmorderdata, setConfirmorderData] = useState("");

  useEffect(() => {
    setChecked(props.save_upi_id);
    if (props.save_upi_id == true) {
      setUpiId(props.upi_id);
    }

    return () => {
      clearInterval(interval.current);
    };
  }, [props.upi_id, props.save_upi_id]);

  useEffect(() => {}, [props.upi_id, props.save_upi_id]);

  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    if (!userid) {
      loginRedirectGuest();
    }
  }, []);

  const handleShow = async () => {
    setloader(true);
    checkErrors(upiId);
    if (Object.keys(errors).length > 0) {
      return;
    }
    btnRef.current.setAttribute("disabled", "disabled");
    let data = {
      user_id: userid,
      bank_id: bankid,
      mandate_type: mandateType,
      upi_id: upiId,
      data_belongs_to: DATA_BELONGS_TO,
      purchase_type: getItemLocal("lumpsum") ? "lumpsum" : "sip",
    };
    if (checked == true) {
      data["save_upi_id"] = "Y";
    } else {
      data["save_upi_id"] = "N";
    }

    var res = await PlaceOrder(data);
    if (res != "") {
      setloader(false);
    }
    if (res.status_code == 200) {
      setShow(true);
      setHtmlResponse(res.data.html);
      setTransactionId(res.data.transaction_data);
      interval.current = setInterval(() => {
        checkPayment(res.data.order_id, res.data.transaction_data);
      }, 10000);
      const trxnIdArray = res.data.transaction_data.map((item) => ({
        cart_amount: item.cart_amount,
        trxn_id: item.trxn_id,
        cart_id: item.cart_id,
      }));
      allTranxId.current = trxnIdArray;
      
      setConfirmorderData(res.data.transaction_data);

      btnRef.current.removeAttribute("disabled");
    } else {
      btnRef.current.removeAttribute("disabled");
      errorAlert(res.message);
    }
  };

  const checkPayment = async (orderId, transaction_data) => {
    var res = await PaymentGatewayResponse({
      user_id: userid,
      order_id: orderId,
      data_belongs_to: DATA_BELONGS_TO,
    });

    let status = "";
    let paymentAwaiting = "0";
    // res = {
    //   error_code: "100",
    //   message: "Success",
    //   data: { status: "Success", message: "APPROVED ( UPI )" },
    // }; // comment later

    if (res.status_code == 200) {
      clearInterval(interval.current);
      interval.current = null;

      if (res.data.message.toUpperCase().includes("APPROVED ( UPI )")) {
        status = "Y";
        let data = {
          user_id: userid,
          bank_id: bankid,
          transaction_data: transaction_data,
          payment_status: status,
          payment_awaiting: paymentAwaiting,
          upi_id: upiId,
          payment_mode: "upi",
          data_belongs_to: DATA_BELONGS_TO,
        };
        var res = await SuccessOrder(data);
        // var res = await apiCall(DMF_SUCCESSORDER_API_URL, data);

        if (res.status_code == 200) {
          dispatch({ type: "UPDATE_CART_COUNT", payload: 0 });
          // Clear guest cart count on successful payment
          localStorage.removeItem("guestCartCount");
          navigate(
            `${process.env.PUBLIC_URL}/direct-mutual-fund/PaymentSucess`
          );
        }
      } else {
        status = "D";
        navigate(`${process.env.PUBLIC_URL}/direct-mutual-fund/PaymentFailed`);
      }

      // if (status == "Y") {

      // }
    }
  };

  function toggle() {
    setIsOpened((wasOpened) => !wasOpened);
  }

  const cancelPayment = async (transaction_data = "") => {
    setloader(true);
    setShow(false);
    if (transaction_data == "") {
      transaction_data = transactionId;
    }
    navigate(`${process.env.PUBLIC_URL}/direct-mutual-fund/PaymentFailed`);
    try {
      let data = {
        user_id: userid,
        bank_id: bankid,
        trxn_data: transaction_data,
        data_belongs_to: DATA_BELONGS_TO,
      };
      if (checked == true) {
        data["upi_id"] = upiId;
      }
      var res = await Cancelorder(data);
      // var res = await apiCall(DMF_CANCELORDER_API_URL, data);
      setloader(false);
      if (res.status_code == 200) {
        // Calcel Order mail API call
        navigate(`${process.env.PUBLIC_URL}/direct-mutual-fund/PaymentFailed`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpiChange = (e) => {
    setUpiId(e.target.value.replace(/\s+/g, ""));
    checkErrors(e.target.value.replace(/\s+/g, ""));
  };

  const handleInputChange = (event) => {
    if (event.key == " " || event.key == "Spacebar") {
      event.preventDefault();
    }
  };

  const checkErrors = (val) => {
    if (upiRegex.test(val) == false) {
      setErrors({ ...errors, upiError: "Please enter valid UPI ID" });
      btnRef.current.setAttribute("disabled", "disabled");
    } else {
      setErrors({});
      btnRef.current.removeAttribute("disabled");
    }
  };


  const confirmOrder = async (confirmorderdataObj) => {

    let success_order_payload = {
      user_id: userid,
      bank_id: bankid,
      transaction_data: confirmorderdataObj,
      upi_id: upiId,
      payment_mode: "upi",
      payment_status: "pending",
      data_belongs_to: DATA_BELONGS_TO,
    };
    var res = await SuccessOrder(success_order_payload);

    if (res.status_code == 200) {
      dispatch({ type: "UPDATE_CART_COUNT", payload: 0 });
      navigate(
        `${process.env.PUBLIC_URL}/direct-mutual-fund/PaymentSucess?a=UPI`
      );
    }
  };

  return (
    <>
      <div className="UPIBox">
        <div className="paymentgatewayoption">
          <FintooLoader isLoading={loader} />
          <Container>
            <div className="row">
              <div className="col-1 col-sm-1 col-lg-1">
                <div className="select-bank">
                  <FintooCheckbox
                    checked={props.selectedType.bank_id == props.thisTypeName}
                    className=""
                    onChange={() => {
                      props.onClick();
                      setChecked(false);
                    }}
                  />
                </div>
              </div>
              <div className="col-4 col-sm-4 col-lg-4">
                <div
                  className="BankName"
                  style={{
                    lineHeight: "20px",
                  }}
                >
                  <div className="AccountLabel">Bank</div>
                  <div
                    className="AccountNo"
                    style={{
                      whiteSpace: "nowrap",
                    }}
                  >
                    {props.selectedType.bank_name}
                  </div>
                </div>
                <div
                  className="AccountDetails"
                  style={{
                    lineHeight: "20px",
                  }}
                >
                  <div className="AccountLabel">Account No.</div>
                  <div className="AccountNo">
                    {maskBankAccNo(props.selectedType.bank_acc_no)}
                  </div>
                </div>
              </div>
            </div>
          </Container>
          {props.selectedType.bank_id == props.thisTypeName && (
            <div className="boxContent">
              <hr />
              <Container>
                <Row>
                  <Col>
                    <div className="AccountDetails">
                      <h4
                        style={{ whiteSpace: "normal", lineHeight: "0.8rem" }}
                      >
                        UPI ID for {props.selectedType.bank_name}{" "}
                        {maskBankAccNo(props.selectedType.bank_acc_no)}
                      </h4>
                      <div
                        className="AccountLabel"
                        style={{ whiteSpace: "normal", lineHeight: "0.8rem" }}
                      >
                        Order will fail if UPI ID is not linked to this bank
                        account
                      </div>
                    </div>
                    <div></div>
                  </Col>
                </Row>
              </Container>
              <Container>
                <Row className="mb-grid">
                  <Col className="col-9">
                    <div className="UPIID">
                      <input
                        type="text"
                        name="UPIID"
                        maxLength={50}
                        value={upiId}
                        onChange={handleUpiChange}
                        onKeyDown={handleInputChange}
                      />
                      {errors.upiError && (
                        <span className="error center">{errors.upiError}</span>
                      )}
                    </div>
                    <div></div>
                  </Col>
                  <Col className="col-3">
                    <div>
                      <button
                        ref={btnRef}
                        className="PayNow"
                        type="button"
                        disabled={upiRegex.test(upiId) == false}
                        onClick={handleShow}
                      >
                        Pay Now
                      </button>
                    </div>
                  </Col>
                </Row>
                <div>
                  <Row className="mb-grid mt-3 text-left">
                    <Col className="col-12">
                      <div className="text-left">
                        <FintooCheckbox
                          title=" Save UPI ID for future transactions"
                          checked={checked}
                          onChange={() => setChecked((v) => !v)}
                        />
                      </div>
                      <div></div>
                    </Col>
                  </Row>
                </div>
              </Container>
            </div>
          )}
        </div>
      </div>
      <Modal className="NomineeModal" centered show={show}>
        <div className="d-flex justify-center p-4">
          <div> {/* <FintooBackButton onClick={handleClose} /> */}</div>
          <div
            className="DeleteBank text-center pb-3 w-100"
            style={{
              borderBottom: "1px solid #eeee",
            }}
          >
            <div
              style={{
                fontWeight: "700",
              }}
            >
              Please Approve the Payment
            </div>
          </div>
        </div>
        <div className="d-grid justify-content-center align-items-center">
          <div>
            <p
              className="text-center "
              style={{
                fontWeight: "500",
                color: "gray",
              }}
            >
              Open your UPI app to approve the payment request.
            </p>
          </div>
          <div className="RoundOTP d-flex justify-content-center align-items-center p-4">
            <PaymentApprove />
          </div>
          <div>
            <p
              className="text-center pt-4"
              style={{
                fontWeight: "600",
              }}
            >
              Please approve the payment request before it times out.
            </p>
          </div>
          <div className="">
            <p
              className="text-center pt-2"
              style={{
                fontWeight: "500",
                fontSize: ".8em",
                color: "gray",
              }}
            >
              Note : Please do not go back or refresh the page.
            </p>
          </div>
          <div>
            <div
              style={{
                background: "#042b6214",
                padding: "1rem",
                textAlign: "center",
              }}
            >
              <div style={{ color: "#042b62", fontSize: "1.2rem" }}>
                The confirmation of payment is experiencing a delay beyond the
                usual timeframe. Would you prefer to proceed with a manual
                confirmation?
              </div>
              <br />
              <span
                style={{
                  width: "fitContent",
                  background: "#042b62",
                  color: "white",
                  textAlign: "center",
                  fontSize: "1.2rem",
                  padding: "0.5rem 1.1rem",
                  borderRadius: "30px",
                  margin: "0 auto",
                  cursor: "pointer",
                }}
                onClick={() => {
                  confirmOrder(confirmorderdata);
                }}
              >
                Confirm
              </span>
            </div>
          </div>
          <div className="mt-5 pb-4">
            <p
              className="text-center"
              style={{
                color: "#042b62",
                fontWeight: "600",
                cursor: "pointer",
              }}
              onClick={() => {
                cancelPayment("");
              }}
            >
              Cancel Payment
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default UPIBOX;
