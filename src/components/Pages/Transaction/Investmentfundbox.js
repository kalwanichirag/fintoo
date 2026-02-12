import { React, useEffect, useState, useRef } from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import HDFC from "../../Assets/hdfc.png";
import Close from "../../Assets/cart_Close.png";
import { Form, Row, Toast } from "react-bootstrap";
import information from "../../Assets/information.png";
import Delete from "../../Assets/Dashboard/delete_Gray.png";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { BiInfoCircle } from "react-icons/bi";
import ReactTooltip from "react-tooltip";
import styled from "styled-components";
import transactioncss from "./transaction.module.css";

import moment from "moment";
import NumberPicker from "../../HTML/NumberPicker";
import axios from "axios";
import commonEncode from "../../../commonEncode";
import WhiteOverlay from "../../HTML/WhiteOverlay";
import {
  fetchEncryptData,
  getUserId,
  indianRupeeFormat,
  isFamilySelected,
} from "../../../common_utilities";
import {
  AddToCartDetails,
  UpdateCartDetails,
} from "../../../FrappeIntegration-Services/services/investment-api/investmentService";
import { useDispatch } from "react-redux";
import SimpleReactValidator from "simple-react-validator";
import { memo } from "react";
import Swal from "sweetalert2";
import DmfDatePicker from "../../HTML/FintooDatePicker/DmfDatePicker";
import FintooDatePicker from "../../HTML/FintooDatePicker";
import Select from "react-select";
import customStyles from "../../CustomStyles";
function Investmentfundbox(props) {
  const re = /^[0-9\b]+$/;
  const dispatch = useDispatch();

  const [dob, setDob] = useState(null);
  const Info = styled(ReactTooltip)`
    max-width: 278px;
    padding-top: 9px;
  `;
  const InfoMessage = styled.p`
    font-size: 13px;
    line-height: 1.4;
    text-align: left;
  `;
  const [sipAmount, setSipAmount] = useState(0);
  const [amount1, setAmount1] = useState();
  const [sipTenure, setSipTenure] = useState(0);

  const [schemeType, setSchemeType] = useState(props.schemeType);
  const [keyIds, setKeyIds] = useState([]);
  const [sipObj, setSipObj] = useState({});
  const [lumpObj, setLumpObj] = useState({});
  const [showSipBox, setShowSipBox] = useState(true);
  const [show, setShow] = useState(false);
  const [updateSipCart, setUpdateSipCart] = useState(0);
  const [updateLumpsumCart, setUpdateLumpsumCart] = useState(0);
  const [availableFunds, setAvailableFunds] = useState([]);
  const [error, setError] = useState({});
  const [, forceUpdate] = useState();
  const [, forceUpdate_] = useState();
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const isAfterThreeThirty =
    currentHour > 15 || (currentHour === 15 && currentMinutes >= 30);

  useEffect(() => {
    document.body.classList.add("SortSelect");
    return () => {
      document.body.classList.remove("SortSelect");
    };
  }, []);

  const options = [
    { value: "new_folio", label: "New Folio" },
    ...(lumpObj?.folios || []).map((x) => ({
      value: x,
      label: x,
    })),
  ];

  const sipOptions = [
    { value: "new_folio", label: "New Folio" },
    ...(sipObj?.folios || []).map((x) => ({
      value: x,
      label: x,
    })),
  ];

  const handleChange = (selectedOption) => {
    setLumpObj({ ...lumpObj, cart_folio_no: selectedOption?.value });
    setUpdateLumpsumCart((v) => ++v);
  };

  const handleSipChange = (selectedOption) => {
    setUpdateSipCart((v) => ++v);
    setSipObj({ ...sipObj, cart_folio_no: selectedOption?.value });
  };

  const SIPValidator = useRef(
    new SimpleReactValidator({
      validators: {
        elssAmountSIP: {
          message: "SIP amount should be a multiple of 500.",
          rule: (val, params, validator) => {
            return val % 500 === 0;
          },
          messageReplace: (message, params) =>
            message.replace(":values", this.helpers.toSentence(params)),
          required: true,
        },
      },
    })
  );

  const LumpValidator = useRef(
    new SimpleReactValidator({
      validators: {
        elssAmountLumpsum: {
          message: "Lumpsum amount should be a multiple of 500.",
          rule: (val, params, validator) => {
            return val % 500 === 0;
          },
          messageReplace: (message, params) =>
            message.replace(":values", this.helpers.toSentence(params)),
          required: true,
        },
      },
    })
  );

  useEffect(() => {
    setKeyIds([...schemeType.funds.map((v) => v.user_cart_purchase_type)]);
  }, []);

  useEffect(() => {
    var af = [];
    var sipObj_ = {};
    var lumpObj_ = {};
    props.schemeType.funds.forEach((v) => {
      af.push(v.user_cart_purchase_type);
      switch (v.user_cart_purchase_type) {
        case "SIP":
          v.min_sip_investment = 1;
          v.min_lumpsum_investment = 1;
          sipObj_ = {
            ...sipObj,
            folios: v.folios,
            cart_amount: v.user_cart_amount,
            cart_tenure: v.user_cart_tenure,
            cart_sip_start_date: v.user_cart_sip_start_date,
            cart_folio_no: v.user_cart_folio_no || "new_folio",
            cart_id: v.name,
            min_sip_investment: v.min_sip_investment,
            min_lumpsum_investment: v.min_lumpsum_investment,
            scheme_name: v.scheme_name,
            sip_allowed: v.sip_allowed,
            purchase_available: v.purchase_available
          };
          break;
        case "P":
          v.min_sip_investment = 1;
          v.min_lumpsum_investment = 1;
          lumpObj_ = {
            ...lumpObj,
            folios: v.folios,
            cart_amount: v.user_cart_amount,
            cart_folio_no: v.user_cart_folio_no || "new_folio",
            cart_id: v.name,
            min_sip_investment: v.min_sip_investment,
            min_lumpsum_investment: v.min_lumpsum_investment,
            scheme_name: v.scheme_name,
            sip_allowed: v.sip_allowed,
            purchase_available: v.purchase_available
          };
          break;
      }
    });
    setSipObj({ ...sipObj_ });
    setLumpObj({ ...lumpObj_ });
    setAvailableFunds([...af]);
  }, [props?.schemeType.funds]);

  useEffect(() => {
    if (updateSipCart == 0) return;
    setTimeout(() => {
      handleSipSubmit();
    }, 200);
  }, [updateSipCart]);

  useEffect(() => {
    SIPValidator.current.showMessages();
    forceUpdate(1);
  }, [sipObj]);

  useEffect(() => {
    LumpValidator.current.showMessages();
    forceUpdate_(1);
  }, [lumpObj]);

  useEffect(() => {
    if (updateLumpsumCart == 0) return;
    setTimeout(() => {
      handleLumpSubmit();
    }, 200);
  }, [updateLumpsumCart]);

  const handleChange1 = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setAmount1(value);
  };

  const [isOpened, setIsOpened] = useState(true);
  const [isRemoveFund, setIsRemoveFund] = useState(true);

  useEffect(() => {
    if (Object.keys(error).length) {
      var a = error;
      var b = Object.keys(a).map((v) => a[v]);
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: (
            <>
              {b.map((v) => (
                <p key={"cartmsg-" + v}>{v}</p>
              ))}
            </>
          ),
          type: "error",
        },
      });
    }
  }, [error]);

  const handleSipSubmit = async () => {
    if (document.querySelector(".srv-validation-message")) return;
    try {
      var formValid = SIPValidator.current.allValid();
      SIPValidator.current.showMessages();
      forceUpdate(1);
      if (formValid == false) return;

      setShow(true);
      var response;
      if (sipObj.cart_id) {
        var payload = {
          // url: CART_UPDATE_URL,
          // method: 'post',
          // data: {
          user_id: "" + getUserId(),
          cart_id: "" + sipObj.cart_id,
          cart_amount: "" + sipObj.cart_amount,
          cart_tenure: "" + sipObj.cart_tenure,
          cart_folio_no: "" + sipObj.cart_folio_no,
          cart_sip_start_date: moment(sipObj.cart_sip_start_date).format(
            "DD/MM/YYYY"
          ),
          // },
        };
        response = await UpdateCartDetails(payload);
      } else {
        var payload = {
          // url: CART_ADD_URL,
          // method: 'post',
          // data: {
          cart_scheme_code: props.schemeType.user_cart_mf_scheme_code,
          cart_amount: "" + sipObj.cart_amount * 1,
          cart_tenure: parseInt(sipObj.cart_tenure, 10),
          cart_sip_start_date: moment(sipObj.cart_sip_start_date).format(
            "DD/MM/YYYY"
          ),
          user_id: getUserId(),
          cart_purchase_type: "SIP",
          transaction_type: "SIP",
          dividend_option: "0",
          cart_folio_no: "" + sipObj.cart_folio_no,
          // },
        };
        response = await AddToCartDetails(payload);
      }

      if (response.status_code * 1 === 200) {
        // navigate(process.env.PUBLIC_URL + "/direct-mutual-fund/mycart");
        dispatch({
          type: "RENDER_TOAST",
          payload: { message: response.message, type: "success" },
        });
        props.reloadPage();
      } else {
        // navigate(process.env.PUBLIC_URL + "/direct-mutual-fund/mycart");

        dispatch({
          type: "RENDER_TOAST",
          payload: { message: response.message, type: "error" },
        });
      }
      setShow(false);
    } catch (e) {
      setShow(false);
    }
  };

  const handleLumpSubmit = async () => {
    if (document.querySelector(".srv-validation-message")) return;
    try {
      var formValid = LumpValidator.current.allValid();
      LumpValidator.current.showMessages();
      forceUpdate_(1);
      if (formValid == false) return;

      setShow(true);
      var response;
      if (lumpObj.cart_id) {
        var payload = {
          // url: CART_UPDATE_URL,
          // data: {
          user_id: "" + getUserId(),
          cart_id: "" + lumpObj.cart_id,
          cart_amount: "" + lumpObj.cart_amount,
          cart_folio_no: "" + lumpObj.cart_folio_no,
          // },
          // method: 'post'
        };
        // response = await fetchEncryptData(payload);
        response = await UpdateCartDetails(payload);
      } else {
        var payload = {
          // url: CART_ADD_URL,
          // data: {
          cart_scheme_code: props.schemeType.user_cart_mf_scheme_code,
          cart_amount: "" + lumpObj.cart_amount,
          user_id: getUserId(),
          cart_purchase_type: "P",
          transaction_type: "ADD",
          cart_sip_start_date: moment(lumpObj.cart_sip_start_date).format(
            "DD/MM/YYYY"
          ),
          dividend_option: "0",
          cart_folio_no: "" + lumpObj.cart_folio_no,
          // },
          // method: 'post'
        };
        // response = await fetchEncryptData(payload);
        response = await AddToCartDetails(payload);
      }

      if (response.status_code * 1 === 200) {
        // navigate(process.env.PUBLIC_URL + "/direct-mutual-fund/mycart");
        dispatch({
          type: "RENDER_TOAST",
          payload: { message: response.message, type: "success" },
        });
        props.reloadPage();
      } else {
        // navigate(process.env.PUBLIC_URL + "/direct-mutual-fund/mycart");
        dispatch({
          type: "RENDER_TOAST",
          payload: { message: d.message, type: "error" },
        });
      }
      setShow(false);
    } catch (e) {
      setShow(false);
      console.error("error", e);
    }
  };
  // const tenOrElevenDaysFromToday = new Date();
  //    tenOrElevenDaysFromToday.setDate(tenOrElevenDaysFromToday.getDate() + (isAfterThreeThirty ? 11 : 10));

  //   let selectedDate;
  //   if (sipObj.cart_sip_start_date) {
  //       const cartSipStartDate = new Date(sipObj.cart_sip_start_date);
  //       selectedDate = cartSipStartDate >= tenOrElevenDaysFromToday ? cartSipStartDate : tenOrElevenDaysFromToday;
  //   } else {
  //       selectedDate = tenOrElevenDaysFromToday;
  //   }
  return (
    <>
      <div
        className="InvestFundbox"
        style={{
          height: isOpened ? "MyCartBox" : "",
        }}
      >
        <WhiteOverlay show={show} />
        <Container>
          <Row>
            <div class="transaction-warning">
              Cut-off Time: {props.schemeType.funds[0].cut_offtime}
            </div>
            <div className="d-flex">
              <div className="FundName flex-fill">
                <div>
                  <img
                    src={`${process.env.REACT_APP_STATIC_URL}/media/companyicons/${props.schemeType.funds[0].amc_code}.png`}
                  />
                </div>
                <div className="FundHead">
                  <h4>{props.schemeType.funds[0].scheme_name}</h4>
                </div>
              </div>
              {isFamilySelected() && (
                <div>
                  <span className="badge badge-secondary">
                    {props.schemeType.memberName}
                  </span>
                </div>
              )}
            </div>

            <>
              <>
                {availableFunds.map((v) => (
                  <>
                    {/* SIP box */}
                    {v == "SIP" && Object.keys(sipObj).length > 0 && (
                      <div className="cart-details">
                        <div className="cart-data col-11">
                          <div className="cart-data-demo-mode col-2">
                            <div className="cart-title">Mode</div>
                            <div className="cart-ietm-title SIP_cart">SIP</div>
                          </div>
                          <div className="cart-data-demo">
                            <div className="cart-title">Amount</div>
                            <div
                              className={`cart-ietm-title ${
                                "cart_amount" in error ? "error-b" : ""
                              }`}
                            >
                              <input
                                autoComplete="off"
                                className={`Rupee-icon w-100 `}
                                value={sipObj.cart_amount}
                                type="text"
                                name="Amount"
                                onChange={(e) => {
                                  if (
                                    (e.target.value === "" ||
                                      re.test(e.target.value)) &&
                                    e.target.value.length <= 10
                                  ) {
                                    setSipObj({
                                      ...sipObj,
                                      cart_amount: e.target.value,
                                    });
                                  }
                                  forceUpdate(1);
                                }}
                                onBlur={() => handleSipSubmit()}
                              />
                            </div>
                            {sipObj.scheme_name?.toLowerCase().indexOf("elss") >
                            -1
                              ? SIPValidator.current.message(
                                  "amount",
                                  sipObj.cart_amount,
                                  `required|min:${props?.schemeType.funds[0].sip_minimum_investment},num|elssAmountSIP`,
                                  {
                                    messages: {
                                      required: `Min Sip Investment ${props?.schemeType.funds[0].sip_minimum_investment}`,
                                      min: `Min Sip Investment ${props?.schemeType.funds[0].sip_minimum_investment}`,
                                    },
                                  }
                                )
                              : SIPValidator.current.message(
                                  "amount",
                                  sipObj.cart_amount,
                                  `required|min:${props?.schemeType.funds[0].sip_minimum_investment},num`,
                                  {
                                    messages: {
                                      required: `Min Sip Investment ${props?.schemeType.funds[0].sip_minimum_investment}`,
                                      min: `Min Sip Investment ${props?.schemeType.funds[0].sip_minimum_investment}`,
                                    },
                                  }
                                )}
                          </div>
                          <div className="cart-data-demo mobile-space">
                            <div className="cart-title">Start Date </div>
                            <div className="cart-ietm-title">
                              <div
                                className={`sip-datepicker sip-datepicker-0 dob8 ${
                                  dob ? "m_selected" : "m_empty"
                                }`}
                              >
                                <FintooDatePicker
                                  selected={
                                    sipObj.cart_sip_start_date
                                      ? new Date(sipObj.cart_sip_start_date)
                                      : null
                                  }
                                  // selected={selectedDate}
                                  showMonthDropdown
                                  showYearDropdown={false}
                                  dropdownMode="select"
                                  onChange={(date) => {
                                    setSipObj({
                                      ...sipObj,
                                      cart_sip_start_date:
                                        moment(date).format("YYYY-MM-DD"),
                                    });
                                    setUpdateSipCart((v) => ++v);
                                  }}
                                  minDate={
                                    Number(moment().format("H.mm")) >= 15.3
                                      ? moment().add(11, "day").toDate()
                                      : moment().add(10, "day").toDate()
                                  } // Set minimum date as today
                                  maxDate={
                                    Number(moment().format("H.mm")) >= 15.3
                                      ? moment()
                                          .add(11, "day")
                                          .add(2, "months")
                                          .toDate()
                                      : moment()
                                          .add(10, "day")
                                          .add(2, "months")
                                          .toDate()
                                  } // Set maximum date as end of the current year
                                  dateFormat="dd/MM/yyyy"
                                  investmentFundBox
                                  mycartDateCss
                                  filterDate={(date) => {
                                    if (date.getDate() > 28) {
                                      return false;
                                    }
                                    return true;
                                  }}
                                />
                              </div>
                            </div>
                            {SIPValidator.current.message(
                              "cart_sip_start_date",
                              sipObj.cart_sip_start_date,
                              `required`,
                              {
                                messages: {
                                  required: "Add SIP Date",
                                },
                              }
                            )}
                          </div>
                          <div className="cart-data-demo">
                            <div className="cart-title">
                              Tenure (in years){" "}
                              <sup style={{ cursor: "pointer" }}>
                                <BiInfoCircle
                                  style={{ fontSize: "16px", outline: "none" }}
                                  data-tip
                                  data-for="SIPTenure"
                                  data-event-off
                                  data-title=""
                                  src={
                                    process.env.REACT_APP_STATIC_URL +
                                    "media/DMF/information.png"
                                  }
                                />
                              </sup>
                              <Info id="SIPTenure" place="top">
                                <InfoMessage>
                                  Generally, an SIP carries an end date after 1
                                  Year, 3 Years or 5 Years of investment. The
                                  investor can hence, withdraw the amount
                                  invested whenever he wishes or as per his
                                  financial goals.
                                </InfoMessage>
                              </Info>
                            </div>
                            <div
                              className={`cart-ietm-title ${
                                "cart_tenure" in error ? "error-b" : ""
                              }`}
                            >
                              <input
                                autoComplete="off"
                                className=" w-100"
                                value={sipObj.cart_tenure}
                                maxLength={2}
                                minLength={1}
                                type="text"
                                name="tenure"
                                onChange={(e) => {
                                  if (
                                    (e.target.value === "" ||
                                      re.test(e.target.value)) &&
                                    e.target.value * 1 <= 30
                                  ) {
                                    setSipObj({
                                      ...sipObj,
                                      cart_tenure: e.target.value,
                                    });
                                  }
                                  forceUpdate();
                                }}
                                onBlur={() => handleSipSubmit()}
                              />
                            </div>
                            {SIPValidator.current.message(
                              "startTenure",
                              sipObj.cart_tenure,
                              "required|min:1,num",
                              {
                                messages: {
                                  required: `Add SIP Tenure`,
                                  min: "Min 1",
                                },
                              }
                            )}
                          </div>
                          <div className="cart-data-demo mobile-space">
                            <div className="cart-title">
                              {(sipObj?.folios ?? []).length > 0
                                ? "Folio (Select Folio)"
                                : "Folio"}
                              <sup style={{ cursor: "pointer" }}>
                                <BiInfoCircle
                                  style={{ fontSize: "14px", outline: "none" }}
                                  data-tip
                                  data-for="Folio"
                                  data-event-off
                                  data-title=""
                                  src={
                                    process.env.REACT_APP_STATIC_URL +
                                    "media/DMF/information.png"
                                  }
                                />
                              </sup>
                              <Info id="Folio" place="top">
                                <InfoMessage>
                                  Folio number is a unique number identifying
                                  your account with the fund. Like a bank
                                  account number.
                                </InfoMessage>
                              </Info>
                            </div>
                            <div
                              className={`${transactioncss.cartIetmTitle} ${
                                "cart_folio_no" in error ? "error-b" : ""
                              }`}
                            >
                              <Select
                                className="shadow-none border-0"
                                classNamePrefix="sortSelect"
                                styles={customStyles}
                                options={sipOptions}
                                onChange={handleSipChange}
                                value={sipOptions.find(
                                  (option) =>
                                    option.value === sipObj?.cart_folio_no
                                )}
                                placeholder="Select SIP Folio"
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="mycart-options">
                            <img
                              className="delete-icon"
                              style={{}}
                              src={
                                process.env.REACT_APP_STATIC_URL +
                                "media/DMF/delete_Gray.png"
                              }
                              onClick={() => {
                                //
                                if (sipObj.cart_id) {
                                  props.onRemove({ cart_id: sipObj.cart_id });
                                } else {
                                  props.reloadPage();
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Lumpsum box */}
                    {v == "P" && Object.keys(lumpObj).length > 0 && (
                      <>
                        <div className="cart-details boxContent">
                          <div className="cart-data col-lg-7 col-12">
                            <div className="cart-data-demo-mode col-2">
                              <div className="cart-title">Mode</div>
                              <div className="cart-ietm-title SIP_cart">
                                Lumpsum
                              </div>
                            </div>
                            <div className="cart-data-demo">
                              <div className="cart-title">Amount</div>
                              <div
                                className={`cart-ietm-title ${
                                  "cart_amount_l" in error ? "error-b" : ""
                                }`}
                              >
                                <input
                                  autoComplete="off"
                                  className="Rupee-icon w-100"
                                  value={lumpObj.cart_amount}
                                  type="text"
                                  name="Amount"
                                  onChange={(e) => {
                                    if (
                                      (e.target.value === "" ||
                                        re.test(e.target.value)) &&
                                      e.target.value.length <= 10
                                    ) {
                                      setLumpObj({
                                        ...lumpObj,
                                        cart_amount: e.target.value,
                                      });
                                    }
                                    forceUpdate_();
                                  }}
                                  onBlur={() => handleLumpSubmit()}
                                />
                              </div>
                              {lumpObj.scheme_name
                                ?.toLowerCase()
                                .indexOf("elss") > -1
                                ? LumpValidator.current.message(
                                    "amount",
                                    lumpObj.cart_amount,
                                    `required|min:${props?.schemeType.funds[0].lumpsum_minimum_investment},num|elssAmountLumpsum`,
                                    {
                                      messages: {
                                        required: `Min Lumpsum Investment ${props?.schemeType.funds[0].lumpsum_minimum_investment}`,
                                        min: `Min Lumpsum Investment ${props?.schemeType.funds[0].lumpsum_minimum_investment}`,
                                      },
                                    }
                                  )
                                : LumpValidator.current.message(
                                    "amount",
                                    lumpObj.cart_amount,
                                    `required|min:${props?.schemeType.funds[0].lumpsum_minimum_investment},num`,
                                    {
                                      messages: {
                                        required: `Min Lumpsum Investment ${props?.schemeType.funds[0].lumpsum_minimum_investment}`,
                                        min: `Min Lumpsum Investment ${props?.schemeType.funds[0].lumpsum_minimum_investment}`,
                                      },
                                    }
                                  )}
                            </div>
                            <div className="cart-data-demo mobile-space">
                              <div className="cart-title">
                                {(lumpObj?.folios ?? []).length > 0
                                  ? "Folio (Select Folio)"
                                  : "Folio"}
                                <sup style={{ cursor: "pointer" }}>
                                  <BiInfoCircle
                                    style={{
                                      fontSize: "16px",
                                      outline: "none",
                                    }}
                                    data-tip
                                    data-for="Folio"
                                    data-event-off
                                    data-title=""
                                    src={
                                      process.env.REACT_APP_STATIC_URL +
                                      "media/DMF/information.png"
                                    }
                                  />
                                </sup>
                                <Info id="Folio" place="top">
                                  <InfoMessage>
                                    Folio number is a unique number identifying
                                    your account with the fund. Like a bank
                                    account number.
                                  </InfoMessage>
                                </Info>
                              </div>
                              <div
                                className={`${transactioncss.cartIetmTitle} ${
                                  "cart_folio_no_l" in error ? "error-b" : ""
                                }`}
                              >
                                <Select
                                  className="shadow-none border-0"
                                  classNamePrefix="sortSelect"
                                  options={options}
                                  styles={customStyles}
                                  onChange={handleChange}
                                  value={options.find(
                                    (option) =>
                                      option.value === lumpObj?.cart_folio_no
                                  )}
                                  placeholder="Select Folio"
                                />
                              </div>
                            </div>
                            <div>
                              <div className="mycart-options">
                                <img
                                  className="delete-icon"
                                  style={{
                                    marginTop: "2.6rem",
                                    marginLeft: "1em",
                                  }}
                                  src={
                                    process.env.REACT_APP_STATIC_URL +
                                    "media/DMF/delete_Gray.png"
                                  }
                                  onClick={() => {
                                    "";
                                    if (lumpObj.cart_id) {
                                      props.onRemove({
                                        cart_id: lumpObj.cart_id,
                                      });
                                    } else {
                                      props.reloadPage();
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                ))}

                <div className="AddLumsum">
                  {/* <p>{v.cart_purchase_type}</p> */}
                  {Object.keys(sipObj).length > 0 &&
                    Object.keys(lumpObj).length == 0 && (
                      <>
                        {sipObj.purchase_available == "true" ? (
                          <p>
                            <span
                              onClick={() => {
                                var a = availableFunds;
                                a.push("P");
                                setAvailableFunds([...a]);
                                setLumpObj({
                                  cart_amount: "",
                                  min_lumpsum_investment:
                                    sipObj.min_lumpsum_investment,
                                  min_sip_investment: sipObj.min_sip_investment,
                                  folios: sipObj.folios,
                                  cart_folio_no: sipObj.cart_folio_no,
                                  scheme_name: sipObj.scheme_name,
                                });
                              }}
                            >
                              Add Lumpsum +
                            </span>
                          </p>
                        ) : (
                          <p>
                            <span
                              onClick={() => {
                                dispatch({
                                  type: "RENDER_TOAST",
                                  payload: {
                                    message:
                                      "The AMC has temporarily stopped Lumpsum for this fund. You’ll be able to invest once it opens again.",
                                    type: "error",
                                  },
                                });
                              }}
                            >
                              Add Lumpsum +
                            </span>
                          </p>
                        )}
                      </>
                    )}
                  {Object.keys(lumpObj).length > 0 &&
                    Object.keys(sipObj).length == 0 && (
                      <>
                        {lumpObj.sip_allowed == "true" ? (
                          <p>
                            <span
                              onClick={() => {
                                var a = availableFunds;
                                a.push("SIP");
                                setAvailableFunds([...a]);
                                setSipObj({
                                  cart_amount: "",
                                  min_lumpsum_investment:
                                    lumpObj.min_lumpsum_investment,
                                  min_sip_investment:
                                    lumpObj.min_sip_investment,
                                  folios: lumpObj.folios,
                                  cart_folio_no: lumpObj.cart_folio_no,
                                  scheme_name: lumpObj.scheme_name,
                                });
                              }}
                            >
                              Add SIP +
                            </span>
                          </p>
                        ) : (
                          <p>
                            <span
                              onClick={() => {
                                dispatch({
                                  type: "RENDER_TOAST",
                                  payload: {
                                    message: "The AMC has temporarily stopped SIPs for this fund. You’ll be able to invest once it opens again.",
                                    type: "error",
                                  },
                                });
                              }}
                            >
                              Add SIP +
                            </span>
                          </p>
                        )}
                      </>
                    )}
                </div>
              </>
            </>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default memo(Investmentfundbox);
