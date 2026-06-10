import { useState, useEffect } from "react";
import "react-responsive-modal/styles.css";
import Form from "react-bootstrap/Form";
import { Row, Col, Modal } from "react-bootstrap";
import FintooButton from "../../../HTML/FintooButton";
import FintooProfileBack from "../../../HTML/FintooProfileBack";
import axios from "axios";
import { RAZORPAY_API_URL } from "../../../../constants";
import { ToastContainer } from "react-toastify";
import { getMinorUserId, memberId } from "../../../../common_utilities";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProfileDetails,
} from "../../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import {
  addNewCity,
  pennydropValidation,
  getCodes,
  getUserBankDetails,
} from "../../../../FrappeIntegration-Services/services/master-api/masterApiService";

function Bank(props) {
  const dispatch = useDispatch();
  const showBack = useSelector((state) => state.isBackVisible);

  const user_id = props.value === "minor" ? getMinorUserId() : memberId();

  const [validated, setValidated] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [accountTypes, setAccountTypes] = useState([]);
  const [bankAccountType, setBankAccountType] = useState("");
  const [resd, setres] = useState("");
  const [showModal, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputStyle = {
    borderRadius: "12px",
    height: "2.5rem",
    outline: "none",
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("Bank_DETAILS"));
    if (stored) {
      setAccountNumber(stored.bank_acc_no || "");
      setIfscCode(stored.bank_ifsc_code || "");
      setBankAccountType(stored.bank_type || "");
      localStorage.removeItem("Bank_DETAILS");
    }
  }, []);

  useEffect(() => {
    init();
    window.scrollTo(0, 0);
  }, []);

  const init = async () => {
    try {
      const res = await fetchUserProfileDetails(user_id);
      const data = res?.data || {};

      setres(data.user_residential_status);
      renderBankTypes(data.user_residential_status);
      getBankDetails();
    } catch (e) {
      console.error(e);
    }
  };

  const renderBankTypes = (type) => {
    if (type === "RES") {
      setAccountTypes([
        { title: "Savings", value: "Savings" },
        { title: "Current", value: "Current" },
      ]);
    } else if (["NRI", "NRE", "NRO"].includes(type)) {
      setAccountTypes([
        { title: "NRE", value: "NRI - Repatriable (NRE)" },
        { title: "NRO", value: "NRI - Non-Repartriable (NRO)" },
      ]);
    } else {
      setAccountTypes([]);
    }
  };

  const getBankDetails = async () => {
    try {
      const res = await getUserBankDetails({ user_id });
      const data = res?.data?.[0];

      if (!data) return;

      setAccountNumber(data.bank_acc || "");
      setIfscCode(data.bank_ifsc_code || "");
      setBankAccountType(data.bank_account_type || "");
    } catch (e) {
      console.error(e);
    }
  };

  const handleError = (message) => {
    dispatch({
      type: "RENDER_TOAST",
      payload: { message, type: "error", autoClose: 3000 },
    });
  };

  const penny = async () => {
    try {
      setShow(true);

      const res = await pennydropValidation({
        bank_acc_no: accountNumber,
        bank_ifsc_code: ifscCode,
      });

      if (res.status_code === 200) {
        setTimeout(() => setShow(false), 1500);
        return res.data;
      }

      throw new Error(res.message || "Penny drop validation failed");
    } catch (err) {
      setShow(false);
      return null;
    }
  };

  const fetchBankDetails = async () => {
    if (loading) return;

    if (!accountNumber || !ifscCode || !bankAccountType) {
      handleError("Please fill all required fields");
      return;
    }

    if (!/^\d{9,18}$/.test(accountNumber)) {
      handleError("Enter valid account number (9-18 digits)");
      return;
    }

    const isValidIFSC = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode);
    if (!isValidIFSC) {
      handleError("Invalid IFSC format");
      return;
    }

    try {
      setLoading(true);

      const bankRes = await axios.get(`${RAZORPAY_API_URL}${ifscCode}`);
      const bankData = bankRes?.data;

      if (!bankData || !bankData.BANK || !bankData.BRANCH) {
        handleError("Invalid IFSC details");
        return;
      }

      await addNewCity({
        state: bankData.STATE,
        city: bankData.CITY,
      });

      const codeRes = await getCodes({
        state: bankData.STATE,
        city: bankData.CITY,
        bank_code: bankData.BANKCODE,
      });

      if (["Savings", "Current"].includes(bankAccountType)) {
        const pennyRes = await penny();
        if (!pennyRes) {
          handleError("Bank verification failed");
          return;
        }
      }

      const payload = {
        bank_user_id: user_id,
        bank_acc_no: accountNumber,
        bank_type: bankAccountType,
        bank_ifsc_code: ifscCode,
        bank_name: bankData.BANK,
        bank_branch: bankData.BRANCH,
        bank_code: bankData.BANKCODE,
        bank_city: codeRes?.data?.city_code,
        bank_state: codeRes?.data?.state_code,
        bank_bse_code: codeRes?.data?.bank_bse_code,
        bank_address: bankData.ADDRESS,
        bank_country: bankData.COUNTRY || "India",
        micr_code: bankData.MICR,
        single_survivor: "single",
        is_primary: 1,
      };

      localStorage.setItem("bankDetails", JSON.stringify(payload));

      props.setShowPanel(resd === "RES" ? "ConfirmBank" : "BankCheque");

    } catch (err) {
      console.error(err);

      if (err?.response?.status === 404) {
        handleError("Provide a valid IFSC Code.");
      } else {
        handleError("Provide valid bank details");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.currentTarget.checkValidity()) {
      fetchBankDetails();
    }

    setValidated(true);
  };

  const handleSelect = (e) => {
    setBankAccountType(e.target.value);
  };

  const handleClose = () => setShow(false);

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
          <p>Please enter the details of your bank account.</p>

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Label className="LabelName">Account Number</Form.Label>
            <Form.Control
              maxLength="18"
              placeholder="Enter your Account Number"
              className="shadow-none"
              required
              type="text"
              style={inputStyle}
              onChange={(e) => setAccountNumber(e.target.value)}
              value={accountNumber}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) e.preventDefault();
              }}
            />
            <Form.Control.Feedback type="invalid">
              Account Number Required
            </Form.Control.Feedback>

            <div className="Nominee_Identity">
              <Form.Label className="LabelName">IFSC Code</Form.Label>
              <Form.Control
                pattern="^[A-Z]{4}[0][A-Z0-9]{6}$"
                required
                placeholder="Enter the IFSC"
                className="shadow-none"
                style={inputStyle}
                value={ifscCode}
                maxLength="11"
                onChange={(e) =>
                  setIfscCode(e.target.value.toUpperCase())
                }
              />
              <Form.Control.Feedback type="invalid">
                IFSC Code Required
              </Form.Control.Feedback>
            </div>

            <div className="Nominee_Identity">
              <Form.Label className="LabelName">Account Type</Form.Label>
              <select
                className="shadow-none form-select"
                required
                value={bankAccountType}
                onChange={handleSelect}
                style={inputStyle}
              >
                <option value="">Select Account Type</option>
                {accountTypes.map((v) => (
                  <option key={v.value} value={v.value}>
                    {v.title}
                  </option>
                ))}
              </select>

              {validated && !bankAccountType && (
                <div style={{ color: "#dc3545", fontSize: "0.875rem" }}>
                  Please Select Bank Account Type
                </div>
              )}
            </div>

            <div className="fintoo-top-border mt-4 pt-4">
              <FintooButton className="d-block ms-auto me-0"
                title="Next" type="submit" />
            </div>
          </Form>
        </div>

        <Modal show={showModal} onHide={handleClose}>
          <div style={{ marginTop: "3rem" }}>
            <h4 style={{ textAlign: "center", fontWeight: "bold" }}>
              Bank Account Verification
            </h4>

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

            <p style={{ textAlign: "center", marginTop: "2rem" }}>
              We will be sending ₹1 to your bank account as a part of the
              verification process.
            </p>
          </div>
        </Modal>
      </Col>
    </Row>
  );
}

export default Bank;