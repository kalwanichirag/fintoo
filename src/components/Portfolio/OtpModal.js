import { useEffect, useState, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import FintooBackButton from "../HTML/FintooBackButton";
import commonEncode from "../../commonEncode";
import { DATA_BELONGS_TO } from "../../constants";
import axios from "axios";
import moment from "moment";
import {
  fetchEncryptData,
  apiCall,
  getUserId,
  getItemLocal,
  getCurrentUserDetails,
} from "../../common_utilities";
import PaymentSuccess from "../Pages/ErrosPages/PaymentSuccess";
import { useNavigate } from "react-router-dom";
import otpmodal from "./otpmodal.module.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import SubmitButton from "./SubmitButton";
import { addNomineeDetails, DeactivateCart, DeleteCart, StpRegistration, SwitchOrderEntry } from "../../FrappeIntegration-Services/services/investment-api/investmentService";
import {
  Normalorderentry,
  SwpCancellation,
  SwpRegisteration,
  XsiporderEntry,
} from "../../FrappeIntegration-Services/services/master-api/masterApiService";
import { fetchUserProfileDetails, sendOTP, sendSMS, verifyOTP } from "../../FrappeIntegration-Services/services/user-management-api/userApiService";
import OTPInput from "otp-input-react";
const PortfolioOtpModal = (props) => {
  // alert("inside otp modal");
  const timer = useRef({ obj: null, counter: 120, default: 120 });
  const [count, setCount] = useState(120);
  const [useremail, setuseremail] = useState("");
  const [usermobile, setusermobile] = useState("");
  const [generateotp, setGeneratedSmsOTP] = useState("");
  const [generatedemailotp, setGeneratedEmailOTP] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [validOtp, setValidOtp] = useState(true);
  const [primaryBankId, setPrimaryBankId] = useState("");
  const [sipamount, setamount] = useState("");
  const [sipfund, setfundname] = useState("");
  const [switchfunds, setSwitchFunds] = useState(false);
  const [deletecart, setDeleteCart] = useState("");
  const [nomineeflag, setnomineeflag] = useState("");
  const [startStp, setStartStp] = useState("");
  const navigate = useNavigate();
  const [stopSIPButtonDisable, setStopSIPButtonDisable] = useState(false);
  const [keyvalue, SetKeyValue] = useState("");
  const [OTP, setOTP] = useState("");
  // const [fromfund,Setfromfundname] = useState('');
  // const [switchto ,Setswitchto] =useState('');

  // var cartId = localStorage.getItem("cartId");

  useEffect(() => {
    // Setfromfundname(localStorage.getItem('switch_from')?localStorage.getItem('switch_from'):"")
    // Setswitchto(localStorage.getItem('switch_to')?localStorage.getItem('switch_to'):"")
    onLoadInIt();
    //fetchMail();
    // fetchSms();
  }, []);

  useEffect(() => {
    if (usermobile) {
      fetchSms();
    }
    if (useremail) {
      fetchMail();
    }
  }, [usermobile, useremail]);
  const randomOTP = useRef(Math.floor(Math.random() * 90000) + 10000);

  function handleClick() {
    randomOTP.current = Math.floor(Math.random() * 90000) + 10000;
    // fetchMail(randomOTP.current);
    fetchSms(randomOTP.current);
  }

  const switchFund = async () => {
    setStopSIPButtonDisable(true);
    var trans_code = "NEW";
    var trans_id = "" + props.transaction_id.current;

    var payload = {
      user_id: getUserId(),
      trans_code: trans_code,
      transaction_id: trans_id
    }
    var response = await SwitchOrderEntry(payload);
    setSwitchFunds(response.data);
    setStopSIPButtonDisable(false);
    if (response.status_code * 1 === 200) {
      navigate(
        process.env.PUBLIC_URL + "/direct-mutual-fund/PaymentSucess?a=Switch"
      );
      deleteCart();
    } else {
      navigate(
        process.env.PUBLIC_URL + "/direct-mutual-fund/PaymentFailed?a=Switch"
      );
    }
  };

  const startSwp = async () => {
    setStopSIPButtonDisable(true);
    var trans_id = props.transaction_id.transaction_id;
    var res = await SwpRegisteration({
      trxn_id: trans_id.toString(),
      data_belongs_to: DATA_BELONGS_TO,
    });
    // var res = await apiCall(DMF_START_SWP_API_URL, {
    //   trxn_id: trans_id.toString(),
    //   data_belongs_to: DATA_BELONGS_TO,
    // });
    setStopSIPButtonDisable(false);
    if (res.status_code * 1 === 200) {
      navigate(
        process.env.PUBLIC_URL + "/direct-mutual-fund/PaymentSucess?a=SWP"
      );
    } else {
      navigate(
        process.env.PUBLIC_URL + "/direct-mutual-fund/PaymentFailed?a=swp"
      );
    }
  };

  const deleteCart = async () => {
    var cart_id_from = "" + props.value[0].cartIdRef.cart_id_from;
    var cart_id_to = "" + props.value[0].cartIdRef.cart_id_to;
    try {
      var payload = {
        method: "post",
        url: DMF_DELETE_SWP_STP_FROM_CART,
        data: {
          from_data: [
            {
              cart_id: cart_id_from,
            },
          ],
          to_data: [
            {
              cart_id: cart_id_to,
            },
          ],
        },
      };
      var res = await fetchEncryptData(payload);
      setDeleteCart(res.data);
    } catch (e) {}
  };

  const updatenominee = async () => {
    try {
      const payload = {
        user_id: getUserId(),
        data_belongs_to: DATA_BELONGS_TO,
      };

      var res = await addNomineeDetails();
      // var res = await apiCall(DMF_UPDATENOMINEE_API_URL, {
      //   user_id: getUserId(),
      //   data_belongs_to: DATA_BELONGS_TO,
      //   is_authenticated: "1",
      // });
    } catch (e) {
      console.error(e);
    }
  };

  const stopSwp = async () => {
    try {
      var trans_id = props.transaction_id.transaction_id;
      var res = await SwpCancellation({
        trxn_id: trans_id.toString(),
        data_belongs_to: DATA_BELONGS_TO,
      });
      // var res = await apiCall(DMF_STOP_SWP_API_URL, {
      //   trxn_id: trans_id.toString(),
      //   data_belongs_to: DATA_BELONGS_TO,
      // });
      if (res.status_code * 1 === 200) {
        navigate(
          process.env.PUBLIC_URL + "/direct-mutual-fund/PaymentSucess?a=Switch"
        );
      } else {
        navigate(process.env.PUBLIC_URL + "/direct-mutual-fund/PaymentFailed");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOtpChange = (e) => {
    if (e.target.value.length > 5) {
      setOtpInput("");
      setValidOtp(false);
    } else {
      setOtpInput(e.target.value);
      setValidOtp(true);
    }
  };

  const verifyOTPCode = async () => {

    try {
      const payload = {
        identifier: usermobile,
        for_otp: "mobile",
        otp: OTP
      }

      const response = await verifyOTP(payload);
      if (response.status_code == 200 || response.status_code == "200") {
        return true;
      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: { message: response.message, type: "error" },
        });
        return false;
      }
    } catch (error) {
      console.log("Error in verifyOTP:", error);
      return false;
    }

  }

  const submitOtp = async () => {

    const isVerified = await verifyOTPCode();
    if (!isVerified) {
      setValidOtp(false);
      return;
    }

    setValidOtp(true);
    if (props.onEditSubmit) {
      props.onEditSubmit();
    }
    if (props.label == "Redeem Fund") {
      normalOrderEntry();
    }
    if (props.label == "Switch Fund") {
      switchFund();
    }
    if (props.label == "Stop SIP") {
      cancelSip();
    }
    if (props.label == "Confirm SWP") {
      startSwp();
    }
    if (props.label == "Confirm STP") {
      startSTP();
    }
    if (nomineeflag == null || nomineeflag == "") {
      // updatenominee();
    }
  };
  const startSTP = async () => {
    setStopSIPButtonDisable(true);
    console.log("STP Props: ", props);
    
    try {
      let payload = {
          transaction_ids: props.stpTransactionId,
          data_belongs_to: DATA_BELONGS_TO,
          user_id: getUserId()
        };

      var response = await StpRegistration(payload);
      console.log("STP Response: ", response);
      setStartStp(response.data);
      if (response.status_code * 1 === 200) {
        await deleteCart();
        setStopSIPButtonDisable(false);
        navigate(
          process.env.PUBLIC_URL + "/direct-mutual-fund/PaymentSucess?a=stp"
        );
      } else {
        setStopSIPButtonDisable(false);
        navigate(
          process.env.PUBLIC_URL + "/direct-mutual-fund/PaymentFailed?a=stp"
        );
      }
    } catch (e) {
      setStopSIPButtonDisable(false);
      console.log("Start STP Errpr::: ", e);
    }
  };
 

  const normalOrderEntry = async () => {
    try {
      console.log("PROPS ======= ", props);
      setStopSIPButtonDisable(true);
      let x = props.transaction_id.current;
      let allRedeemKey = props.allRedeemKey;
      var payload = {
        user_id: getUserId(),
        transaction_id: x,
        trans_code: "NEW",
        data_belongs_to: DATA_BELONGS_TO,
        allRedeemKey: allRedeemKey,
      };
      var res = await Normalorderentry(payload);
      
      //await deleteCartAPI();
      await DeactivateCartAPI();
      setStopSIPButtonDisable(false);
      if (res.status_code == 200) {
        navigate(
          process.env.PUBLIC_URL + "/direct-mutual-fund/PaymentSucess?a=Redeem"
        );
      } else {
        navigate(
          process.env.PUBLIC_URL + "/direct-mutual-fund/PaymentFailed?a=Redeem"
        );
      }
    } catch (e) {
      setStopSIPButtonDisable(false);
      console.log("catch :", e);
    }
  };

  const cancelSip = async () => {
    setStopSIPButtonDisable(true);
    try {
      let transactionId = props?.detailedMfPotfolio?.sip_stp_swp_data?.sip_list?.[0].transaction_id;
      // for (const x of props?.detailedMfPotfolio?.sip_stp_swp_data?.sip_list?.[0]) {
        // if (Boolean(x.checked)) {
        //   transactionId = "" + x.transaction_id;
        //   break;
        // }
      // }
      if (!transactionId) {
        throw "Unable to get transactionId";
      }
      // return;
      var payload = {
        user_id: getUserId(),
        trxn_id: transactionId,
        trans_code: "CXL",
        data_belongs_to: DATA_BELONGS_TO,
      };
      if (props?.reason) {
        payload.reason_code = "" + props?.reason?.reason_code;
        payload.reason_text = props?.reason?.reason;
      }
      console.log("Props ============ ", props)
      var res = await XsiporderEntry(payload);
      // var res = await fetchEncryptData(payload);
      setStopSIPButtonDisable(false);
      if (res.status_code === 200) {
        stopsipmail("sucess");
        navigate(
          process.env.PUBLIC_URL + "/direct-mutual-fund/PaymentSucess?a=StopSIP"
        );
      } else {
        stopsipmail("fail");
        navigate(
          process.env.PUBLIC_URL + "/direct-mutual-fund/PaymentFailed?a=StopSIP"
        );
      }
    } catch (e) {
      setStopSIPButtonDisable(false);
      console.log("catch :", e);
    }
  };

  const stopsipmail = async (v) => {
    try {
      let user_data = await getCurrentUserDetails();

      
      var subject = "";
      var template = "";

      if (v === "sucess") {
        subject = "Confirmation: Successful Termination of SIP Process";
        template = "stop_sip.html";
      }
      if (v === "fail") {
        subject =
          "Notification Regarding Failed Stop SIP Request on BSE Platform";
        template = "stop_sip_fail.html";
      }

      var urlmail = {
        userdata: {
          to: user_data.email,
        },
        subject: subject,
        template: template,
        contextvar: {
          name: user_data.name,
          platform: "FIntoo",
          amount: sipamount,
          fundname: sipfund,
          date: moment(new Date()).format("DD/MM/YYYY"),
        },
      };

      let config = {
        method: "post",
        url: "",
        data: urlmail,
      };

      // var res = await fetchEncryptData(config);
      
    } catch (e) {
      console.log("------->", e);
    }
  };

  const deleteCartAPI = async () => {
    var cart_id = props.value[2].current;
    var payload = {
      from_cart_id: "" + cart_id,
      user_id: "" + getUserId(),
    };

    const response = await DeleteCart(payload);
  };

  const DeactivateCartAPI = async () => {
    var cart_id = props.value[2].current;
    var payload = {
      from_cart_id: "" + cart_id,
      user_id: "" + getUserId(),
    };

    const response = await DeactivateCart(payload);
  };
  
  const fetchSms = async (v) => {
    var otp = v ? v : randomOTP.current;
    setGeneratedEmailOTP(otp);
    var fromfund = localStorage.getItem("switch_from");
    var switchto = localStorage.getItem("switch_to");
    var amount = localStorage.getItem("amount");

    var keyvalue = "";

    if (props.label == "Redeem Fund") {
      keyvalue = "redeem_dmf";
    } else if (props.label == "Switch Fund") {
      keyvalue = "switch";
    } else if (props.label == "Stop SIP") {
      keyvalue = "stop_sip";
    } else if (props.label == "Confirm SWP") {
      keyvalue = "swp";
    } else if (props.label == "Confirm STP") {
      keyvalue = "stp";
    } else if (props.label == "Stop SWP") {
      keyvalue = "stop_swp";
    }
    
    if (keyvalue == "stop_swp") {
    } else {
      // let user_data = await getCurrentUserDetails();

      var from_fund = "";

      if (keyvalue == "switch" || keyvalue == "swp") {
        from_fund = fromfund;
      }
      if (keyvalue == "stp") {
        from_fund = props.value[0].scheme;
      }
      var amount_val = "";
      if (Number(amount) > 0) {
        amount_val = amount;
      }

      let fund_name_value = props.value[0]?.scheme?.replaceAll("&", "and");
      setfundname(fund_name_value);
      let from_fund_name = from_fund.replaceAll("&", "and");

      let to_fund_name = switchto ? switchto.replaceAll("&", "and") : "";
      let from_f_name =
        from_fund_name.length <= 20
          ? from_fund_name
          : from_fund_name.slice(0, 20) + "...";
      let switch_to =
        to_fund_name.length <= 20
          ? to_fund_name
          : to_fund_name.slice(0, 20) + "...";
      fund_name_value =
        fund_name_value?.length <= 20
          ? fund_name_value
          : fund_name_value?.slice(0, 20) + "...";
    }

    setamount(amount_val);

    const payload = {
      identifier: usermobile,
      for_otp: "mobile"
    }

    await sendOTP(payload);
    
  };

  const fetchMail = async (v) => {
    var otp1 = v ? v : randomOTP.current;
    setGeneratedEmailOTP(otp1);
    setOtpInput("");
    var urlmail = {
      userdata: {
        to: useremail,
      },
      subject: "Fintoo - Your one time password",
      template: "otp_message_template.html",
      contextvar: { otp: otp1 },
    };

    var data = commonEncode.encrypt(JSON.stringify(urlmail));
    var config = {
      method: "post",
      url: "",
      data: data,
    };
    // axios(config);
  };

  const onLoadInIt = async () => {
    try {
      var userid = getUserId();
      
      var responseobj = await fetchUserProfileDetails(userid);
      let user_data = responseobj.data;
      setnomineeflag(user_data.is_authenticated);
      setuseremail(user_data.user_email);
      
      setusermobile(user_data.mobile);
    } catch (e) {}
  };

  useEffect(() => {
    timer.current.counter = timer.current.default;
    startTimer();
  }, []);

  const startTimer = () => {
    timer.current.obj = setInterval(() => {
      if (timer.current.counter > 0) {
        timer.current.counter = timer.current.counter - 1;
        setCount(timer.current.counter);
      } else {
        clearInterval(timer.current.obj);
        timer.current.counter = timer.current.default;
      }
    }, 1000);
  };

  var props_data = props.value;

  return (
    <>
      <Modal.Header className="py-3">
        {props.isActive ? (
          <div>
            <div className={`${otpmodal.SIPCloseicon}`}>
              <IoIosCloseCircleOutline
                onClick={() => {
                  props.onBack();
                }}
              />
            </div>
          </div>
        ) : (
          <FintooBackButton
            onClick={() => {
              props.onBack();
            }}
          />
        )}

        <div className="modal-title">
          {props.isActive ? <>Enter OTP</> : <> Please Enter OTP</>}
        </div>
      </Modal.Header>
      <Modal.Body>
        <div>
          <div className={props.isActive ? "Stylesss" : "sssss"}>
            <div className="modal-whitepopup-box-item grey-color border-top-0 text-center">
              <p>Sent to</p>
              <p className={props.isActive ? otpmodal.userMail : null}>
                {useremail}
              </p>
              {props.isActive ? null : <p>{usermobile}</p>}
            </div>

            <div className="modal-whitepopup-box-item grey-color">
              <div className="px-md-4">
                <div
                  className={`d-flex justify-content-center flx-otp-bx ${
                    props.isActive ? otpmodal.SIPmodalotp : null
                  }`}
                > 
                  <div
                    className={`flx-item ${
                      props.isActive ? otpmodal.SIPdetails : null
                    }`}
                  >
                    <div className={props.isActive ? otpmodal.siplabel : null}>
                      Folio
                    </div>
                    <div>
                      <strong>{props?.detailedMfPotfolio?.fund_list?.[0].folio_no}</strong>
                    </div>
                  </div>
                  <div
                    className={`flx-item ${
                      props.isActive ? otpmodal.SIPdetails : null
                    }`}
                  >
                    <div className={props.isActive ? otpmodal.siplabel : null}>
                      {props.label}
                    </div>
                    <div
                      className={props.isActive ? otpmodal.SIPfundName : null}
                    >
                      <strong>{props?.detailedMfPotfolio?.fund_list?.[0].scheme}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`text-center p-4 ${
                props.isActive ? "modal-whitepopup-box-item" : null
              }`}
            >
              {props.isActive ? (
                <div className={otpmodal.labelText}>Enter OTP Here</div>
              ) : null}
              {/* <input
                type="text"
                maxLength={5}
                minLength={5}
                placeholder={props.isActive ? null : "Enter OTP here"}
                className={`bottom-border-input w-50 text-center grey-color ${
                  props.isActive ? "mt-3" : null
                }`}
                value={otpInput}
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={(e) => handleOtpChange(e)}
              /> */}
              <div className="d-flex justify-content-center align-items-center">
                  <OTPInput
                    value={OTP}
                    onChange={setOTP}
                    style={{
                      width: "auto",
                    }}
                    autoFocus
                    className="rounded rounded-otp"
                    OTPLength={6}
                    otpType="number"
                    disabled={false}
                  />
                </div>
            </div>

            <div className="text-center p-4 grey-color">
              {count == 0 && (
                <p
                  className="pointer blue-color"
                  onClick={() => {
                    startTimer();
                    handleClick();
                    setValidOtp(true);
                  }}
                >
                  {props.isActive ? "Regenerate" : "Resend"} OTP
                </p>
              )}
              {count > 0 && (
                <p>
                  {props.isActive ? "Regenerate" : "Resend"} OTP in{" "}
                  <strong>
                    {moment().startOf("day").seconds(count).format("mm:ss")}
                  </strong>
                </p>
              )}
              {validOtp ? <> </> : <p className="red-color">Invalid OTP</p>}
            </div>

            <SubmitButton
              disabled={stopSIPButtonDisable}
              title={"Submit"}
              onClick={() => {
                submitOtp();
              }}
            />
          </div>
        </div>
      </Modal.Body>
    </>
  );
};
export default PortfolioOtpModal;
