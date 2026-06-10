import { useEffect, useState, useRef } from "react";
import ProfileInsiderLayout from "../../../components/Layout/ProfileInsiderLayout";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Profilebank from "./ProfileBank";
import { useNavigate } from "react-router-dom";
import "react-responsive-modal/styles.css";
import BankConfirm from "../../../components/Assets/13_penny_dropped.png";
import Form from "react-bootstrap/Form";
import "../../../components/Pages/ProfileCompoenents/Fatca/style.css";
import { Modal } from "react-bootstrap";
import FintooButton from "../../../components/HTML/FintooButton";
import FintooProfileBack from "../../../components/HTML/FintooProfileBack";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import { MdDelete } from "react-icons/md";
import SimpleReactValidator from "simple-react-validator";
import { canvasPreview } from "../../../components/FintooCrop/canvasPreview";
import styled from "styled-components";
import Styles from "./style.module.css";
import { fetchUserProfileDetails, deteleBankDetails } from "../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { addNewCity, pennydropValidation, getCodes, getUserBankDetails, addBank, BseClientRegistration, FatcaUpload } from "../../../FrappeIntegration-Services/services/master-api/masterApiService";
import {
  RAZORPAY_API_URL,
  SUPPORT_EMAIL,
  DATA_BELONGS_TO,
} from "../../../constants";
import commonEncode from "../../../commonEncode";
import { ToastContainer, toast } from "react-toastify";
import { getUserId, fetchEncryptData, isFamilySelected } from "../../../common_utilities";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Mandate_limit from "../../../components/Pages/Transaction/Mandate_limit";
import axios from "axios";
function ProfileInsiderBankAccount(props) {
  const aspect = 16 / 9;
  const scale = 1;
  const imgRef = useRef(null);
  const inputFileUpload = useRef(null);
  const [, forceUpdate] = useState();
  const [crop, setCrop] = useState({
    unit: "%",
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  });
  const [bankBseCode, getBankBseCode] = useState({});
  const [imgSrc, setImgSrc] = useState("");
  const [completedCrop, setCompletedCrop] = useState(null);
  const [preview, setPreview] = useState(false);
  const previewCanvasRef = useRef(null);
  const [rotateValue, setRotateValue] = useState(0);
  const [stepCount, setStepCount] = useState(0);
  const [accountTypes, setAccountTypes] = useState([]);
  const [selectedAccountType, setSelectedAccountType] = useState("");
  const [requiredDataLoaded, setRequiredDataLoaded] = useState(false);
  const [searchParams] = useSearchParams();
  const user_id = getUserId();
  const params = new URLSearchParams(window.location.search);
  const [selectedBankId, setSelectedBankId] = useState(params.get("bank_id") ?? "");
  const options = accountTypes.map((v) => ({
    value: v.value,
    label: v.title,
  }));


  const UploadInput = styled("input")({
    display: "none",
  });
  
  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    if (isFamilySelected()) {
      setTimeout(() => {
        navigate(process.env.PUBLIC_URL + "/direct-mutual-fund/mycart");
      }, 300);
    } else {
      onLoadInIt();
    }
  }, []);

  const addBankStepCount = useSelector((state) => state.addBankStepCount);

  useEffect(() => {
    if (completedCrop != null) {
      canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
      // // checksession();
    }
  }, [completedCrop]);

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        aspect,
        width,
        height
      ),
      width,
      height
    );

    setCrop(crop);
  };

  const convertBase = () => {
    return new Promise((resolve, reject) => {
      previewCanvasRef.current.toBlob(async (blob) => {
        try {
          let file = new File([blob], "fileName.jpg", { type: "image/jpeg" });

          let bank_id = localStorage.getItem("bank_id_dynamic");
          // console.clear();
          let formdata = new FormData();
          formdata.append("cheque_file", file);
          formdata.append("bank_user_id", 1 * userid);
          formdata.append("bank_id", bank_id);
          formdata.append("no_enc_key", "AAAA");
          let config = {
            method: "POST",
            url: '',
            data: {
              data: formdata,
            },
          };
          return
          var res = await fetchEncryptData(config);
          let responseobj = res.data;
          let error_code = responseobj.error_code;
          if (error_code == "102") {
            dispatch({
              type: "RENDER_TOAST",
              payload: { message: responseobj.message, type: "error" },
              autoClose: 3000,
            });
            onRemoveUploaded();
          } else if (error_code == "100") {
            dispatch({
              type: "RENDER_TOAST",
              payload: { message: responseobj.message, type: "success" },
              autoClose: 3000,
            });
          }
        } catch (e) { }
      }, "image/jpeg");
    });
  };
  const onRemoveUploaded = () => {
    inputFileUpload.current.value = "";
    setImgSrc("");
    setPreview(false);
  };
  const [showResults, setShowResults] = useState(true);

  const handleRemove = (index) => { };

  function AddBank() {
    setShowResults(false);

    setStepCount(userBanks.length >= 5 ? 0 : 1);
    
    renderBankTypes(userDetails.current.user_residential_status);
  }
  function AddBanks() {
    setShowResults(true);
  }
  function Chequeupload() {
    setStepCount(2);
  }
  function ConfirmBank() {
    setStepCount(3);
  }
  function BackBTn() {
    setStepCount(0);
  }

  useEffect(() => {
    BackBTn();
  }, [addBankStepCount]);

  function BackBTn1() {
    setStepCount(1);
  }
  function BackBTn2() {
    setStepCount(2);
  }

  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (simpleValidator.current.allValid()) {
      const form = event.currentTarget;
      if (form.checkValidity() === true) {
        fetchPennydroData();
        // fetchAddBankData();
      }
      setValidated(true);
    } else {
      simpleValidator.current.showMessages();
      forceUpdate(1);
    }
  };
  const [showModal, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const navigate = useNavigate();
  const [userBanks, setUserBanks] = useState([]);
  const [pennydrop, setpennydrop] = useState({});
  const userDetails = useRef();
  const [accountNumber, setAccountNumber] = useState("");
  const [IFSCCode, setIFSCCode] = useState("");
  const dispatch = useDispatch();
  const showBack = useSelector((state) => state.isBackVisible);
  const [isopen, setisopen] = useState(false);
  const simpleValidator = useRef(new SimpleReactValidator());
  const handleSelect = (e) => {
    setSelectedAccountType(e.target.value + "");
  };

  useEffect(() => {
    if (searchParams.get('add') == 1 && requiredDataLoaded == true) {
      handleOnClick();
    } else {
      setStepCount(0);
    }
  }, [searchParams, requiredDataLoaded]);


  const onLoadInIt = async () => {

    try {
      let payload = {
        user_id: user_id,
        data_belongs_to: DATA_BELONGS_TO
      };

      var res = await getUserBankDetails(payload);

      var res_data = res.data;
      const sortedData = res_data
        .map((item) => item)
        .sort((a, b) => new Date(a.creation) - new Date(b.creation));
      setUserBanks(sortedData);
    } catch (e) { }
    try {
      var res = await fetchUserProfileDetails(user_id);
      
      userDetails.current = res.data;
      setRequiredDataLoaded(true);
    } catch (e) { }
  };

  const fetchPennydroData = async () => {
    try {

      var payload = { bank_acc_no: accountNumber, bank_ifsc_code: IFSCCode };
      var res = await pennydropValidation(payload);

      if (res.data.length == 0) {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "Invalid Account Details",
            type: "error",
            autoClose: 3000,
          },
        });
      }

      var response = res.data;
      if (Boolean(response.error_code) == true) {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: response.message,
            type: "error",
            autoClose: 3000,
          },
        });
      } else {

        const resF = await axios.get(RAZORPAY_API_URL + IFSCCode);
        var pennydrop_obj = response;
        setpennydrop(resF);

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

        var responseRP = resF.data;

        if (resF.statusText == "OK") {
          var razorpay = responseRP;
        } else {
          console.warn("error");
        }
        var bankDetailsRP = responseRP;
        var bankDetails = response;

        localStorage.setItem(
          "bankDetails",
          commonEncode.encrypt(JSON.stringify(response))
        );
        localStorage.setItem(
          "accountNumber",
          commonEncode.encrypt(accountNumber)
        );

        var payload = {
          "state": resF.data.STATE,
          "city": resF.data.CITY
        }
        const r2 = await getCodes(payload);

        var urladddata = {
          bank_user_id: user_id,
          bank_acc_no: accountNumber,
          bank_type: selectedAccountType,
          bank_ifsc_code: IFSCCode,
          bank_name: resF.data.BANK,
          is_primary: "0",
          bank_branch: resF.data.BRANCH,
          bank_city: r2.data.city_code,
          bank_state: r2.data.state_code,
          bank_address: resF.data.ADDRESS,
          bank_country: "India",
          micr_code: resF.data.MICR,
          single_survivor: getAccountHoldingNatureId(userDetails.current.user_residential_status),
          bank_code: resF.data.BANKCODE,
        };
        
        localStorage.setItem(
          "sendData",
          commonEncode.encrypt(JSON.stringify(urladddata))
        );
        localStorage.setItem(
          "bankDetails",
          commonEncode.encrypt(JSON.stringify(response))
        );
        localStorage.setItem(
          "bankType",
          userDetails.current.user_residential_status + ""
        );
        let bank_id = localStorage.getItem("bank_id_dynamic");

        if (bank_id != null) {
          updateBank();
        } else {

          var res = await addBank(urladddata);
          var response_obj = res;
          let bank_id_dynamic = response_obj.data;
         
          localStorage.setItem("bank_id_dynamic", bank_id_dynamic.bank_id);

          let error_code = response_obj.error_code;

          if (error_code == "102") {
            dispatch({
              type: "RENDER_TOAST",
              payload: { message: response_obj.message, type: "error" },
              autoClose: 3000,
            });
            return;
          } else if (error_code == "100") {
            dispatch({
              type: "RENDER_TOAST",
              payload: {
                message: "Bank Account Saved!",
                type: "success",
                autoClose: 3000,
              },
            });
            handleShow();
            setTimeout(() => {
              handleClose();
            }, 3000);
          }
        }
        if (userDetails.current.user_residential_status == "RES") {
          // indian
          setTimeout(() => {
            setStepCount(3);
            handleClose();
          }, 3000);
        } else if (userDetails.current.user_residential_status == "NRI") {
          // NRI
          setTimeout(() => {
            handleClose();
            setStepCount(2);
          }, 3000);
        } else {
          // NRO
        }
      }
    } catch (e) {
      console.log("error in pennydropp", e);
    }
  };

  function checkBankNumber() {
    if (userBanks.length >= 5) {
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "You can only add up up to 5 bank accounts.",
          type: "error",
        },
      });
    }
  }

  const setGetBankBseCode = async () => {
    try {
      let config1 = {
        method: "POST",
        url: DMF_GETBANK_BSECODE_API_URL,
        data: {
          bank_code: pennydrop.data.BANKCODE,
        },
      };
      var res = await fetchEncryptData(config1);

      var response = res.bank_bse_code;

      getBankBseCode(response);
    } catch (e) { }
  };

  useEffect(() => {
    setGetBankBseCode();
  }, [pennydrop.data]);

  let confirmBankData = {};

  const deleteBank = async () => {

    var bank_id = localStorage.getItem("bank_id_dynamic");
    var payload = {
      user_id: getUserId(),
      bank_id: bank_id
    }

    var response = await deteleBankDetails(payload);

    let status_code = response.error_code;

    if (status_code == 200) {
      localStorage.removeItem("bankDetails");
      localStorage.removeItem("sendData");
      props.onPrevious("Bank");
    }
  };

  const updateBank = async () => {
    var data = {};
    let bank_id = localStorage.getItem("bank_id_dynamic");
    
    var stateString = pennydrop.data.STATE;
    var cityString = pennydrop.data.CITY;
    var bankcodeString = pennydrop.data.BANKCODE;
    var payload = {
      "state": stateString,
      "city": cityString,
      "bank_code": bankcodeString
    }
    var res = await getCodes(payload);
    var response = res;
    var response_obj_cityStateCode = response;

    data["bank_user_id"] = user_id;
    data["bank_ifsc_code"] = IFSCCode;
    data["bank_name"] = pennydrop.data.BANK;
    data["is_primary"] = "0";
    data["bank_branch"] = pennydrop.data.BRANCH;
    data["bank_city"] = response_obj_cityStateCode.data.city_code;
    data["bank_state"] = response_obj_cityStateCode.data.state_code;
    data["bank_address"] = pennydrop.data.ADDRESS;
    data["bank_country"] = "94";
    data["micr_code"] = pennydrop.data.MICR;
    data["single_survivor"] = getAccountHoldingNatureId(userDetails.current.user_residential_status);
    data["bank_code"] = pennydrop.data.BANKCODE;
    data["bank_acc_no"] = accountNumber;
    data["bank_type"] = selectedAccountType;
    try {
      
      var res = await addBank(data);
      var response_obj = res;

      if (response_obj.status_code == 200) {
        // handleShow();
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "Bank added successfully.",
            type: "success",
          },
          autoClose: 3000,
        });
        localStorage.removeItem("pennydrop");
        localStorage.removeItem("sendData");
        localStorage.removeItem("bank_id_dynamic");
        localStorage.removeItem("accountNumber");
        localStorage.removeItem("IFSCCode");
        clientRegistration();
      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: { message: "Error", type: "error" },
          autoClose: 3000,
        });
      }
    } catch (e) { }
  };

  const getAccountHoldingNatureId = (residentialStatus) => {
    switch (residentialStatus) {
      case "RES":
        return "Single";
      case "NRI":
        return "Either or survivor";
      case "NRO":
        return "Either or survivor";
      default:
        return "Single";
    }
  };

  const renderBankTypes = (n) => {
    switch (n) {
      case "RES":
        setAccountTypes([
          { title: "Savings", value: "Savings" },
          { title: "Current", value: "Current" },
        ]);
        break;
      case "NRI":
        setAccountTypes([
          { title: "NRE", value: "NRI - Repatriable (NRE)" },
          { title: "NRO", value: "NRI - Repatriable (NRO)" },
        ]);
        break;
      default:
        setAccountTypes([]);
    }
  };

  const clientRegistration = async () => {
    var payload = {
      user_id: user_id,
      data_belongs_to: DATA_BELONGS_TO
    }

    var response = await BseClientRegistration(payload);

    let status_code = response.status_code;
    if (status_code == 200) {
      FATCAUpload();
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: "Bank Account Added succefully!", type: "success" },
        autoClose: 3000,
      });
      // window.location.reload(true);
      navigate(process.env.PUBLIC_URL + "/direct-mutual-fund/profile/dashboard/bankaccount");
      onLoadInIt();
    } else {
      fetchMailPar();
      deleteBank();
      setisopen(true);

      // setTimeout(() => {
      //   props.onNext();
      // }, 1000);
    }
  };

  const FATCAUpload = async () => {
    var payload = {
      user_id: user_id,
      data_belongs_to: DATA_BELONGS_TO
    }
    var res = await FatcaUpload(payload);
    if (res.status_code == 200) {
      toast.success("User details updated successfully.", {
        position: toast.POSITION.BOTTOM_LEFT,
        autoClose: 2000,
      });
      
    } else {
      toast.success("User details updated successfully", {
        position: toast.POSITION.BOTTOM_LEFT,
        autoClose: 2000,
      });
      // setTimeout(() => {
      //   props.onNext();
      // }, 1000);
    }
  };

  const fetchMailPar = async () => {
    try {
      var urlmail = {
        userdata: {
          to: userDetails.current.user_email,
        },
        subject: "Bank Verification Failed!",
        template: "bank_rejection_dmf.html",
        contextvar: {
          name: userDetails.current.user_name,
          SUPPORT_EMAIL: SUPPORT_EMAIL,
          // report_link: resp.pdf_report_link,
        },
      };

      // var data = commonEncode.encrypt(JSON.stringify(urlmail));
      
    } catch (e) {
      console.log("------->", e);
    }
  };

  const handleOnClick = () => {
    checkBankNumber();
    setIFSCCode("");
    setSelectedAccountType("");
    AddBank();
  };


  return (
    <>
      {selectedBankId ? <Mandate_limit selectedBankId={selectedBankId} setSelectedBankId={setSelectedBankId} /> :
        <ProfileInsiderLayout>
          <ToastContainer />
          <div
            style={{ margin: "auto" }}
            className={`ProfileDashboard `}
          >
            {/* ${stepCount == 0 ? Styles.BankListData : null} */}
            <div className="ml-10 md:mt-14 mt-4 p-2 md:p-3 rounded-3xl">
              <div className="text-label-info">
                <Row>
                  <Col xs={12} lg={12}>
                    <Row>
                      <Col>
                        {stepCount == 0 ? (
                          <>
                            <div className="d-flex gap-1 align-items-center mb-md-0 mb-3">
                              <div className="">
                                <span
                                  className="pointer"
                                  onClick={() => {
                                    navigate(-1);
                                  }}
                                >
                                  <img
                                    className="BackBtn"
                                    src={
                                      process.env.REACT_APP_STATIC_URL +
                                      "media/DMF/left-arrow.svg"
                                    }
                                    alt="Back"
                                    srcset=""
                                    width={20}
                                  />
                                </span>
                              </div>
                              <div
                                className={`col-12 ${Styles.banktitle1}`}
                              >
                                List Of Banks
                              </div>
                            </div>
                            {/*
                         */}
                          </>
                        ) : (
                          <></>
                        )}
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <p className="Hrline"></p>
              </div>
              {stepCount == 0 && (
                <div>
                  <div className="mt-4">
                    <button
                      style={{
                        backgroundColor: "#042b62",
                        color: "#fff",
                        outline: "0",
                        border: "0",
                        borderRadius: "20px",
                        padding: ".3rem 1.2rem",
                        float: "right",
                        fontWeight: "500",
                      }}
                      onClick={() => {
                        localStorage.removeItem("pennydrop");
                        localStorage.removeItem("sendData");
                        localStorage.removeItem("bank_id_dynamic");
                        localStorage.removeItem("accountNumber");
                        localStorage.removeItem("IFSCCode");
                        navigate('?add=1');
                      }}
                    >
                      + Add Bank
                    </button>
                  </div>
                  <br />
                  {userBanks.map((item) => (
                    <Profilebank
                      key={item.bank_id}
                      userBanks={item}
                      // hideDelete={item.is_primary*1 === 1}
                      hideDelete={Boolean(item.bank_is_primary * 1 === 1)}
                      onRemove={() => handleRemove(item.bank_id)}
                      setSelectedBankId={setSelectedBankId}
                    />
                  ))}
                </div>
              )}

              {stepCount == 1 && (
                <Row>
                  <Col className="ProfileImg overflo">
                    <div>
                      <img
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/DMF/06_banking_app.svg"
                        }
                        alt=""
                      />
                    </div>
                  </Col>
                  <Col className=" RightPanel">
                    <div className="rhl-inner">
                      <FintooProfileBack
                        title="Bank Details"
                        onClick={() => {
                          // BackBTn();
                          // forceUpdate(1);
                          navigate(-1);
                        }}
                      />

                      <p className="">
                        Please enter the details of your bank account.
                      </p>

                      <Form
                        noValidate
                        validated={validated}
                        onSubmit={handleSubmit}
                      >
                        <Form.Label className="LabelName" htmlFor="inputText">
                          Account Number
                        </Form.Label>

                        <Form.Control
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          controlId="validationCustom05"
                          placeholder="Enter your Account Number "
                          className="shadow-none"
                          required
                          style={{
                            borderRadius: "12px",
                            height: "2.5rem",
                            outline: "none",
                          }}
                          classname="MobileBank"
                          type="text"
                          maxLength="18"
                          onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                        />
                        {simpleValidator.current.message(
                          "accountNumber",
                          accountNumber,
                          "required"
                        )}

                        <div className="Nominee_Identity">
                          <Form.Label className="LabelName" htmlFor="inputText">
                            IFSC Code
                          </Form.Label>

                          <Form.Control
                            value={IFSCCode}
                            pattern="^[A-Z]{4}[0][A-Z0-9]{6}$"
                            onChange={(e) =>
                              setIFSCCode(e.target.value.toUpperCase())
                            }
                            placeholder="Enter the IFSC"
                            aria-label="Default select example"
                            className="shadow-none"
                            maxlength="11"
                            style={{
                              borderRadius: "12px",
                              height: "2.5rem",
                              outline: "none",
                            }}
                          />

                          {simpleValidator.current.message(
                            "IFSC Code",
                            IFSCCode,
                            "required|min:11"
                          )}
                        </div>
                        <div className="Nominee_Identity">
                          <Form.Label className="LabelName" htmlFor="inputText">
                            Account Type
                          </Form.Label>
                          {/* <Select
                        classNamePrefix="sortSelect"
                        placeholder="Select Your Bank Type"
                        options={options}
                        onChange={(option) => handleSelect(option ? option.value : null)}
                        value={options.find(option => option.value === selectedAccountType) || null}
                        styles={customStyles}
                        // isClearable
                      /> */}
                          <Form.Select
                            className="custom-select shadow-none"
                            controlId="validationCustom02"
                            placeholder="Select Your Bank Type"
                            aria-label="Default select example"
                            style={{
                              borderRadius: "12px",
                              height: "2.5rem",
                              outline: "none",
                            }}
                            onChange={handleSelect}
                            value={selectedAccountType}
                          >
                            <option value="">--select--</option>
                            {accountTypes.map((v) => (
                              <option value={v.value}>{v.title}</option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Account Type Required
                          </Form.Control.Feedback>
                        </div>
                        <div className=" mt-4 pt-4">
                          <FintooButton
                            type="submit"
                            className="d-block ms-auto me-0"
                            title={"Next"}
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
                            src={BankConfirm}
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
                    {/*Cheque Upload */}
                  </Col>
                </Row>
              )}

              {/* Cheque Upload */}
              {stepCount == 2 && (
                <Row>
                  <div className="ProfileImg col-12 col-md-6 ">
                    <div>
                      <img
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/DMF/06_banking_app.svg"
                        }
                        alt=""
                      />
                    </div>
                  </div>
                  <div className=" RightPanel col-12 col-md-6">
                    <div className="rhl-inner">
                      <FintooProfileBack
                        title="Upload Bank Details"
                        onClick={() => {
                          BackBTn1();
                          setStepCount(1);
                          handleClose();
                        }}
                      />

                      <p className="">
                        Please upload a clear photograph or a scanned copy of your
                        cheque leaf in JPEG, JPG or PNG format.
                      </p>
                      <div className="VerifyDetails">
                        <label className="LabelName form-label">
                          Upload Cheque Leaf
                        </label>

                        <div className="">
                          <Col className=" ">
                            <div
                              style={{
                                display: imgSrc.trim() == "" ? "block" : "none",
                              }}
                            >
                              <UploadInput
                                onChange={(e) => onSelectFile(e)}
                                accept="image/*"
                                id="inputFileUpload"
                                ref={inputFileUpload}
                                type="file"
                              />
                              <div className="dlc-bx-upload px-0 px-md-5">
                                <div className="dlc-bx">
                                  <div className="pnf-img-bx" role="button">
                                    <label htmlFor="inputFileUpload" role="button">
                                      <img
                                        src={require("../../../Assets/Images/file-upload.svg")}
                                      />
                                      <p>Upload</p>
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div
                              style={{
                                display:
                                  Boolean(preview) == false && imgSrc.trim() != ""
                                    ? "block"
                                    : "none",
                              }}
                            >
                              <div className="whitebg-rounded">
                                <ReactCrop
                                  crop={crop}
                                  onChange={(_, percentCrop) =>
                                    setCrop(percentCrop)
                                  }
                                  onComplete={(c) => setCompletedCrop(c)}
                                >
                                  <img
                                    ref={imgRef}
                                    alt="Crop me"
                                    src={imgSrc}
                                    onLoad={onImageLoad}
                                    style={{
                                      maxHeight: "245px",
                                      transform: `rotate(${rotateValue}deg)`,
                                    }}
                                  />
                                </ReactCrop>
                              </div>

                              <div>
                                <div className="pt-4 mycrop-bx">
                                  <div className="in-mycrop-1">
                                    <div className="">
                                      <p>
                                        <strong>Rotate</strong>
                                      </p>
                                      <input
                                        type="range"
                                        min={-180}
                                        max={180}
                                        value={rotateValue}
                                        onChange={(e) =>
                                          setRotateValue(e.target.value)
                                        }
                                      />
                                    </div>
                                    <p className="mycrop-rotate-num">
                                      {rotateValue}
                                    </p>
                                  </div>
                                  <div>
                                    <FintooButton
                                      onClick={() => {
                                        canvasPreview(
                                          imgRef.current,
                                          previewCanvasRef.current,
                                          completedCrop,
                                          scale,
                                          rotateValue
                                        );
                                        convertBase();
                                        setPreview(true);
                                      }}
                                      title={"Crop"}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div
                              style={{
                                display: Boolean(preview) ? "block" : "none",
                              }}
                            >
                              <div className="fileContainer d-flex justify-content-center align-items-center img-preview-n">
                                <span onClick={() => onRemoveUploaded()}>
                                  <MdDelete />
                                </span>
                                <canvas
                                  ref={previewCanvasRef}
                                  style={{
                                    objectFit: "contain",
                                    maxHeight: "270px",
                                    maxWidth: "90%",
                                  }}
                                />
                              </div>

                              <div>
                                <FintooButton
                                  className={`d-block me-0 ms-auto`}
                                  onClick={ConfirmBank}
                                  title={"Next"}
                                />
                              </div>
                            </div>
                          </Col>
                        </div>
                      </div>
                      <br />
                    </div>
                  </div>
                </Row>
              )}

              {/* Confirm Bank Details */}
              {stepCount == 3 && (
                <Row>
                  <div className="ProfileImg col-12 col-md-6">
                    <div>
                      <img
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/DMF/06_banking_app.svg"
                        }
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="RightPanel col-12 col-md-6">
                    <div className="rhl-inner">
                      {showBack == true && (
                        <FintooProfileBack
                          title="Bank Account Details"
                          onClick={() => {
                            BackBTn2();
                            deleteBank();
                            setStepCount(1);
                            handleClose();
                          }}
                        />
                      )}

                      <p className="">Confirm Your Bank Details</p>

                      <div className="ConfBank">
                        <div className="BankConfrmDetails">
                          <div>
                            <img
                              src={`${process.env.PUBLIC_URL}/static/media/bank_logo/${bankBseCode}.png`}
                            />
                          </div>
                          <div style={{ marginLeft: "10px" }}>
                            <span className="BankCnfmName">
                              {pennydrop.data.BANK}
                            </span>
                            <p>
                              <small>{pennydrop.data.ADDRESS}</small>
                            </p>

                            <table className="w-100 bank-tbl">
                              <tr>
                                <td>
                                  <span className="CofmAccountNM">
                                    Account No.{" "}
                                  </span>
                                </td>
                                <td>
                                  <span
                                    value={IFSCCode}
                                    onChange={(e) =>
                                      setAccountNumber(e.target.value)
                                    }
                                  >
                                    {accountNumber}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <span className="CofmIfscCode">IFSC </span>
                                </td>
                                <td>
                                  <span
                                    value={IFSCCode}
                                    onChange={(e) => setIFSCCode(e.target.value)}
                                  >
                                    {IFSCCode}
                                  </span>
                                </td>
                              </tr>
                            </table>
                          </div>
                        </div>

                        <div
                          className="Nominee_Identity_Last"
                          style={{ float: "right" }}
                        >
                          <FintooButton
                            onClick={() => {
                              clientRegistration();
                              dispatch({
                                type: "RENDER_TOAST",
                                payload: {
                                  message: "Bank Account Added succefully!",
                                  type: "success",
                                },
                                autoClose: 3000,
                              });

                              setTimeout(() => {
                                // window.location.reload(true);
                                handleClose();
                              }, 1000);
                            }}
                            title="Confirm Bank"
                          />
                        </div>
                      </div>
                      <div>
                        {/* <div onClick={openModal}>Click here to open the modal</div> */}
                        <Modal
                          backdrop="static"
                          size="lg"
                          centered
                          show={isopen}
                          className="profile-popups sign-popup"
                          onHide={() => {
                            closeModal(false);
                          }}
                        >
                          <Modal.Body>
                            <div className="modal-body-box">
                              {/* <center><h5><b>{erroronproceed}</b></h5></center> */}
                              <center>
                                <center>
                                  {" "}
                                  <h5>
                                    <b>Bank Addition Failed for BSE Verification</b>
                                  </h5>
                                </center>
                                &nbsp; &nbsp; &nbsp;
                                {/* <div></div> */}
                                <p className="">
                                  We wanted to inform you that there was an issue
                                  with the addition of your bank details in the BSE
                                  (Bombay Stock Exchange) system. Regrettably, the
                                  addition process has failed due to some errors in
                                  the data provided. To successfully complete the
                                  verification process, please add your bank details
                                  again. If you have any questions or need
                                  assistance, please don't hesitate to reach out to
                                  us at support@fintoo.in.
                                </p>
                                <p className="">Thank you for your cooperation.</p>
                              </center>

                              {/* <center><p><h3> We regret to inform you that your bank verification has encountered errors in the provided data. To successfully complete the verification process, please add your bank details again. If you have any questions or need assistance, please don't hesitate to reach out to us at support@fintoo.in.</h3></p></center> */}
                              <div>
                                <div className="pt-3 pb-3 ">
                                  {/* <div className="img-box9 pt-4 inv-sign-border text-center">
                        <img
                          className="img-fluid inv-img-86"
                          // src={require("../../../../Assets/Images/temp_img_8865.jpg")}
                        />
                          </div> */}
                                </div>
                                <div className="pb-3 pt-3">
                                  <FintooButton
                                    onClick={() => {
                                      // closeModal();
                                      // setisopen(false)
                                      setTimeout(() => {
                                        localStorage.removeItem("bank_id_dynamic");
                                        handleClose();
                                        if (window.location.href.includes("goto=cart")) {
                                          navigate(process.env.PUBLIC_URL + "/direct-mutual-fund/MyCartSelectBank");
                                        } else {
                                          // window.location.reload(true);
                                          navigate(process.env.PUBLIC_URL + "/direct-mutual-fund/profile/dashboard/bankaccount");
                                        }
                                      }, 1000);
                                    }}
                                    title={"Continue"}
                                  />
                                </div>
                              </div>
                            </div>
                          </Modal.Body>
                        </Modal>
                      </div>
                    </div>
                  </div>
                </Row>
              )}
            </div>
          </div>
        </ProfileInsiderLayout>
      }
    </>
  );
}
export default ProfileInsiderBankAccount;
