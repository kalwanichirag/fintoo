import { useState, useRef } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import CurrencyInput from "react-currency-input-field";
import Rupee from "../Assets/Rupee.png";
import Time from "../Assets/Time.png";
import Form from "react-bootstrap/Form";
// import React, { useState } from "react";

import SimpleReactValidator from "simple-react-validator";
import { useEffect } from "react";
import moment from "moment";
import {
  apiCall,
  fetchEncryptData,
  getUserId,
  loginRedirectGuest,
  updateCartCount,
  getItemLocal,
} from "../../common_utilities";
import {
  investmentEndpoints, DATA_BELONGS_TO
} from "../../constants";
import commonEncode from "../../commonEncode";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import NumberPicker from "../HTML/NumberPicker";
import { Buffer } from "buffer";
import { useSelector, useDispatch } from "react-redux";
import WhiteOverlay from "../HTML/WhiteOverlay";
import FundPurchaseNotAllowed from "../HTML/FundPurchaseNotAllowed";
import SweetAlert from "sweetalert-react";
import { Modal } from "react-bootstrap";
import FintooButton from "../HTML/FintooButton";
import FintooDatePicker from "../HTML/FintooDatePicker";
import DmfDatePicker from "../HTML/FintooDatePicker/DmfDatePicker";
import { Modal as ReactModal } from "react-responsive-modal";
import { AddToCartDetails, GetCartDetails, UpdateCartDetails } from "../../FrappeIntegration-Services/services/investment-api/investmentService";

const user_data = JSON.parse(localStorage.getItem("user_data") || '{}');
let user_id = user_data.user_id;

function TabData(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const maxInvestment = Number(props?.fundData?.fund_detail?.sip_maximum_investment) || 0;

  const minInvestment = Number(props?.fundData?.fund_detail?.sip_minimum_investment) || 0;
  

  const sipAmountMultiplier = Number(props?.fundData?.fund_detail?.sip_amount_multiplier) > 0 ? Number(props?.fundData?.fund_detail?.sip_amount_multiplier) : 1;
  const lumpsumAmountMultiplier = Number(props?.fundData?.fund_detail?.lumpsum_amount_multiplier) > 0 ? Number(props?.fundData?.fund_detail?.lumpsum_amount_multiplier) : 1;
  const stpAmountMultiplier = Number(props?.fundData?.fund_detail?.stp_amount_multiplier) || 0;
  const swpAmountMultiplier = Number(props?.fundData?.fund_detail?.swp_amount_multiplier) || 0;

  const simpleValidator = useRef(
    new SimpleReactValidator({
      validators: {
        elssAmountSIP: {
          message: `SIP amount should be a multiple of ${sipAmountMultiplier}.`,
          rule: (val) => {
            const num = Number(val);
            return num && num % sipAmountMultiplier === 0;
          },
          required: true,
        },

        minAmount: {
          message: `SIP amount must be at least ${minInvestment}`,
          rule: (val) => {
            const num = Number(val);
            return num >= minInvestment;
          },
          required: true,
        },

        maxAmount: {
          message:
            maxInvestment > 0
              ? `SIP amount must be less than or equal to ${maxInvestment}`
              : "",
          rule: (val) => {
            const num = Number(val);
            if (!maxInvestment || isNaN(maxInvestment)) return true;
            return num <= maxInvestment;
          },
          required: true,
        },
      },
    })
  );
  const lumpsumValidator = useRef(
    new SimpleReactValidator({
      validators: {
        elssAmountLumpsum: {
          message: `Lumpsum amount should be a multiple of ${lumpsumAmountMultiplier}.`,
          rule: (val, params, validator) => {
            return val % lumpsumAmountMultiplier === 0;
          },
          messageReplace: (message, params) =>
            message.replace(":values", this.helpers.toSentence(params)),
          required: true,
        },
      },
    })
  );

  const [, forceUpdate] = useState();
  const [, forceUpdateLumpsum] = useState();

  const [value, setValue] = useState("");
  const [type, setType] = useState("sip");
  const [isReinvest, setIsReinvest] = useState(false);
  const [isPerpetual, setIsPerpetual] = useState(false);
  const [nextPage, setNextPage] = useState("mycart");
  const [isLoading, setIsLoading] = useState(false);
  const [schemeName] = useState(props?.fundData?.Overview?.scheme_name);
  const [minAmount, setMinAmount] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [erroronproceed, setErrorOnProceed] = useState(
    "Please select a member from the dropdown to proceed."
  );
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (props.type) {
      setType(props.type);
    }
  }, [props?.type]);

  const cartIdRef = useRef(null);

  const handleChange = (e) => {
    e.preventDefault();
    const { value = "" } = e.target;
    const parsedValue = value.replace(/[^\d]/gi, "");
    //
    setValue(parsedValue);
  };
  const handleOnBlur = (e) => {
    simpleValidator.current.showMessageFor("currencyInput");
    simpleValidator.current.showMessageFor("sipAmount");
  };

  const [value2, setValue2] = useState("");

  const NumberChange = (e) => {
    e.preventDefault();
    const { value = "" } = e.target;
    const parsedValue = value.replace(/[^\d]/gi, "");
    setValue2(parsedValue);
  };
  const handleOnBlur2 = (e) => {
    lumpsumValidator.current.showMessageFor("currencyInput");
    lumpsumValidator.current.showMessageFor("lumpsumAmount");
  };

  const [startDate, setStartDate] = useState('');

  const [year, setYear] = useState("");
  // function handleChangeNumber(event) {
  //   const enteredValue = parseInt(event.target.value);
  //   if (!isNaN(enteredValue) && enteredValue <= 30) {
  //     setYear(enteredValue);
  //   }
  // }
  function handleChangeNumber(event) {
    const inputValue = event.target.value;
    if (inputValue === "" || (/^\d+$/.test(inputValue) && parseInt(inputValue) <= 30)) {
      setYear(inputValue === "" ? "" : parseInt(inputValue));
    }
  }


  useEffect(() => {
    if (schemeName.includes("ELSS")) {
      setMinAmount(true);
    }
  }, []);

  useEffect(() => {
    if (year * 1 === 30) {
      setIsPerpetual(true);
    } else {
      setIsPerpetual(false);
    }
  }, [year]);

  const [shake, setShake] = useState(false);

  const handleSubmit = async (submitType) => {
    try {
      if (getItemLocal("family")) {
        openModal();
      } else {
        var formValid = null;
        let valid = true;
        if (type == "sip") {
          console.log("sipAmountMultiplier >>>>>>>. ", sipAmountMultiplier);
          console.log("lumpsumAmountMultiplier >>>>>>>. ", lumpsumAmountMultiplier);
          formValid = simpleValidator.current.allValid();
          simpleValidator.current.showMessages();
          forceUpdate(1);
        } else {
          formValid = lumpsumValidator.current.allValid();
          lumpsumValidator.current.showMessages();
          forceUpdateLumpsum(1);
        }
        if (formValid == true && valid == true) {
          // all done add to cart here
          setIsLoading(true);
          // check if login

          if (user_id == null) {
            // if (getUserId() == null) {
            guestAddToCart();
            return;
          }

          var step1 = await addToCart();
          var step2 = null;

          if (step1.status_code === 200) {
            dispatch({
              type: "RENDER_TOAST",
              payload: { message: "Added to cart successfully", type: "success" },
            });
            step2 = await updateCart(step1.data[0].cart_id);
          } else if (step1.status_code === 409) {
            // this code is to handle the case when the cart is already created
            // and the user is trying to add the same scheme again
            // dispatch({
            //   type: "RENDER_TOAST",
            //   payload: { message: step1.message, type: "info" },
            // });

            var payload = {
              // data: { 
              user_id: getUserId(),
              data_belongs_to: DATA_BELONGS_TO
              // },
              // method: "post",
              // url: GET_CART_DETAILS,
            };

            var cartItems = await GetCartDetails(payload);

            var getCurrentCart = cartItems.data.filter(
              (v) => v.name === step1.data.cart_id
            );

            if (getCurrentCart.length === 1) {
              let getCurrentCart1 = getCurrentCart[0];

              if (getCurrentCart1.cart_purchase_type === "P") {

                if (getCurrentCart1.cart_amount === value2 * 1) {
                  throw step1.message;
                  // throw new Error(step1.message);

                } else {
                  step2 = await updateCart(step1.data.cart_id, true);
                }
              } else {
                if (
                  getCurrentCart1.cart_amount === value * 1 &&
                  getCurrentCart1.cart_tenure === "" + year &&
                  getCurrentCart1.cart_sip_start_date ===
                  moment(startDate).format("DD/MM/YYYY").toString()
                ) {
                  // return { message: step1.message }
                  throw step1.message;

                } else {
                  step2 = await updateCart(step1.data.cart_id, true);
                }
              }
            }
          }
          if (step2.status_code === 200 && step2.message === "Cart updated successfully!") {
            if (submitType === 1) {
              navigate("/direct-mutual-fund/mycart");
            }
          } else {
            throw step2.message;
          }

          setIsLoading(false);
        }
      }
    } catch (e) {
      setIsLoading(false);
      dispatch({
        type: "RENDER_TOAST",
        // payload: { message: e.toString(), type: "error" },
        payload: { message: "Error", type: "error" },
      });
      console.error(e);
    }
  };

  const addToCart = () => {
    return new Promise(async (resolve, reject) => {
      try {

        var payload = {};
        if (type == "sip") {
          payload = {
            data_belongs_to: DATA_BELONGS_TO,
            transaction_type: "SIP",
            cart_scheme_code: props.fundData.Overview.scheme_code,
            cart_amount: "" + value * 1,
            cart_tenure: Number(year),
            cart_sip_start_date: moment(startDate).format("DD/MM/YYYY"),
            user_id: getUserId(),
            cart_purchase_type: "SIP",
            // cart_folio_no: "new_folio",
            // cart_units: "1",
            // cart_sip_start_date: moment(startDate).format("YYYY-MM-DD"),
            // dividend_option: "" + isReinvest * 1,
          };
        } else {
          payload = {
            data_belongs_to: DATA_BELONGS_TO,
            transaction_type: "ADD",
            cart_scheme_code: props.fundData.Overview.scheme_code,
            cart_amount: "" + value2 * 1,
            user_id: getUserId(),
            cart_purchase_type: "P",
            cart_sip_start_date: moment().format("DD/MM/YYYY"),
            // dividend_option: "0",
          };
        }

        var response = await AddToCartDetails(payload);

        // var message = response.message;
        resolve(response);
        // setIsLoading(false);
      } catch (e) {
        reject(e);
      }
    });
  };

  const updateCart = (cartId = null, replace = null) => {

    if (cartId === null) return;
    return new Promise(async (resolve, reject) => {
      try {

        var payload1 = {
          user_id: getUserId(),
          data_belongs_to: DATA_BELONGS_TO,
        };

        var response = await GetCartDetails(payload1);

        var cartCount = response.data.length;

        var updateData = response.data.filter((v) => v.name == cartId)[0];

        var payload = {
          user_id: getUserId(),
          cart_id: "" + updateData.name,
          // cart_scheme_code: updateData.scheme_code,
          // cart_purchase_type: "" + updateData.user_cart_purchase_type,
          // cart_folio_no: updateData.user_cart_folio_no ?? "new_folio",
          cart_amount: "" + updateData.user_cart_amount,
        };
        // try {
        //   if ('folios' in updateData && Array.isArray(updateData.folios) && updateData.folios.length > 0) {
        //     payload.data.cart_folio_no = "" + updateData.folios[0];
        //   }
        // } catch {
        //   payload.data.cart_folio_no = "new_folio";
        // }
        // const params = new URLSearchParams(window.location.search);
        // const foliono = params.get("folio_no");
        // if (foliono) {
        //   payload.cart_folio_no = atob(foliono);
        // }

        if (updateData.user_cart_purchase_type == "SIP") {
          // sip
          payload["cart_tenure"] = String(updateData["user_cart_tenure"]);
          payload["cart_sip_start_date"] = "" + moment(updateData["user_cart_sip_start_date"]).format("DD/MM/YYYY");

          // payload["user_cart_purchase_type"] = updateData["user_cart_purchase_type"];
        }

        if (replace === true) {
          if (updateData.user_cart_purchase_type === "SIP") {
            payload.cart_amount = "" + value * 1;
            payload.cart_tenure = "" + year;
            payload.cart_sip_start_date =
              "" + moment(startDate).format("DD/MM/YYYY");
          } else {
            payload.cart_amount = "" + value2 * 1;
          }
        }

        var response = await UpdateCartDetails(payload);

        dispatch({ type: "UPDATE_CART_COUNT", payload: cartCount });
        if (replace === true && response.status_code === 200) {
          dispatch({
            type: "RENDER_TOAST",
            payload: { message: response.message, type: "success" },
          });
        }
        resolve(response);
      } catch (e) {
        reject(e);
      }
    });
  };

  const guestAddToCart = () => {
    var payload = {};

    if (type == "sip") {

      payload = {
        // url: CART_ADD_URL,
        // data: {
        cart_scheme_code: props.fundData.Overview.scheme_code,
        cart_amount: "" + value * 1,
        user_id: user_id,
        cart_purchase_type: "SIP",
        // dividend_option: "" + isReinvest * 1,
        data_belongs_to: DATA_BELONGS_TO,
        transaction_type: "SIP",
        cart_tenure: Number(year),
        cart_date: moment(startDate).format("DD/MM/YYYY"),
      };

    } else {
      payload = {
        cart_scheme_code: props.fundData.Overview.scheme_code,
        cart_amount: "" + value2 * 1,
        user_id: user_id,
        cart_purchase_type: "P",
        // dividend_option: "0",
        data_belongs_to: DATA_BELONGS_TO,
        transaction_type: "ADD",
        cart_date: moment().format("DD/MM/YYYY"),
      };
    }

    localStorage.setItem(
      "saveHistory",
      JSON.stringify({ url: investmentEndpoints.ADD_TO_CART_API_URL, data: payload })
    );
    loginRedirectGuest();
  };

  useEffect(() => {
    props.onAmountChange({ amount: value, type });
  }, [value]);

  useEffect(() => {
    props.onAmountChange({ amount: value2, type });
  }, [value2]);

  useEffect(() => {
    if (type === "sip") {
      props.onAmountChange({ amount: value, type });
    } else {
      props.onAmountChange({ amount: value2, type });
    }
  }, [type]);

  const sipEnabled =
    type === "sip" &&
    props?.fundData?.Overview?.sip_allowed === "true" &&
    props?.fundData?.fund_detail?.sip_flag === "true" &&
    Number(props?.fundData?.fund_detail?.sip_minimum_investment) > 0;

  const lumpsumEnabled =
    type === "lumpsum" &&
    props?.fundData?.Overview?.is_purchase_available === "true" &&
    props?.fundData?.fund_detail?.lumpsum_flag === "true" &&
    Number(props?.fundData?.fund_detail?.lumpsum_minimum_investment) > 0;

  const isEnabled = sipEnabled || lumpsumEnabled;

  return (
    <div className="App">
      <WhiteOverlay show={isLoading} />
      {/* <SweetAlert
          show={openConfirm}
          title="Please Note"
          text="Your SIP date is within the next 5 days, your SIP will start from the next month on the chosen date."
          onConfirm={() => {
            setOpenConfirm(false);
          }}
      /> */}
      <Tabs
        className="Tabs fin-cal-tab calc-tab-box"
        defaultIndex={1}
        selectedIndex={Number(type === "lumpsum")}
      >
        <TabList className="calc-tablist">
          <Tab onClick={() => setType("sip")}>
            <div className="SIPLum" style={{ background: type == 'sip' ? '#042b62' : 'white', color: type == 'sip' ? 'white' : 'black', borderBottom: type == 'sip' ? '4px solid #f68638' : '4px solid white' }}>
              <span></span> <span>SIP</span>
            </div>
          </Tab>
          <Tab onClick={() => setType("lumpsum")}>
            <div className="SIPLum" style={{ background: type == 'lumpsum' ? '#042b62' : 'white', color: type == 'lumpsum' ? 'white' : 'black', borderBottom: type == 'lumpsum' ? '4px solid #f68638' : '4px solid white' }}>
              <span></span> <span>Lumpsum</span>
            </div>
          </Tab>
        </TabList>
        <div className="calc-panel-box">
          <TabPanel className="calc-tablist-panel">
            {/* {(props.fundData.Overview.sip == "true" || props.fundData.Overview.sip == "") & props.fundData.fund_detail.sip_minimum_investment * 1 > 0 ? ( */}
            {(props.fundData?.Overview?.sip_allowed === "true" || props.fundData?.Overview?.sip_allowed === "") &&
              props.fundData?.fund_detail?.sip_minimum_investment * 1 > 0 ? (

              <div className="calc-tablist-panel-item">
                <div
                  style={{
                    display: "flex",
                    borderBottom: "1px solid #d8d8d8",
                    paddingBottom: "0.5rem",
                  }}
                >
                  <label className="Input_Rupee" for="name">
                    ₹
                  </label>
                  <input
                    // prefix={prefix}
                    type="text"
                    className="txt-gray-colored amount-input-box"
                    name="currencyInput"
                    id="currencyInput"
                    value={value}
                    placeholder="0"
                    onChange={handleChange}
                    // onBlur={handleOnBlur}
                    autoComplete="off"
                    maxLength={10}
                  />
                </div>
                  {simpleValidator.current.message(
                    "sipAmount",
                    value === null || value === undefined ? "" : String(value),
                    "required|minAmount|maxAmount|elssAmountSIP"
                  )}
                <table className="w-100">
                  <tr>
                    <td className="w-50">
                      <div className="Plan">
                        <div className="Plan_SIP" style={{ display: "grid" }}>
                          <span>SIP Tenure (years)</span>
                          <span className="Total_amnt">
                            <div>
                              <img
                                className="Time"
                                src={
                                  process.env.REACT_APP_STATIC_URL +
                                  "media/DMF/Time.svg"
                                }
                                alt=""
                              />
                            </div>
                            <div>
                              <span>
                                <input
                                  className="Value txt-gray-colored"
                                  max="2"
                                  type="text"
                                  name="year"
                                  onChange={handleChangeNumber}
                                  value={year}
                                  id=""
                                  maxlength={2}
                                  // onBlur={() => {
                                  //   simpleValidator.current.showMessageFor(
                                  //     "year"
                                  //   );
                                  //   simpleValidator.current.showMessageFor(
                                  //     "fakeYear"
                                  //   );
                                  // }}
                                  autoComplete="off"
                                />
                                {simpleValidator.current.message(
                                  "year",
                                  year,
                                  "required"
                                )}
                                {simpleValidator.current.message(
                                  "fakeYear",
                                  year,
                                  "numeric|min:1,num",
                                  {
                                    messages: {
                                      min: "The year field is required",
                                    },
                                  }
                                )}
                              </span>
                            </div>
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="w-50">
                      <div className="Plan">
                        <div className="Plan_SIP" style={{ display: "grid" }}>
                          <span>Start Date</span>
                          <span className="Total_amnt">
                            <div>
                              <img
                                className="Time"
                                src={
                                  process.env.REACT_APP_STATIC_URL +
                                  "media/DMF/Time.svg"
                                }
                                alt=""
                              />
                            </div>
                            <div className="DatePick">
                              <span className="sip-datepicker">

                                <FintooDatePicker
                                  selected={startDate ? new Date(startDate) : null}
                                  onChange={(date) => date ? setStartDate(moment(date).format("YYYY-MM-DD")) : setStartDate('')}
                                  minDate={Number(moment().format('H.mm')) >= 15.30 ? moment().add(11, 'day').toDate() : moment().add(10, 'day').toDate()} // Set minimum date as today
                                  maxDate={Number(moment().format('H.mm')) >= 15.30 ? moment().add(11, 'day').add(2, 'months').toDate() : moment().add(10, 'day').add(2, 'months').toDate()} // Set maximum date as end of the current year
                                  dateFormat="dd/MM/yyyy"
                                  showMonthDropdown={false}
                                  showYearDropdown={false}
                                  filterDate={(date) => {
                                    if (date.getDate() > 28) {
                                      return false;
                                    }
                                    return true;
                                  }}
                                // calendarIcon={<img width={'20px'} src={require('./Images/calendar73.svg')} />}
                                />


                                {/* <NumberPicker
                                  startDate={startDate}
                                  showMonth={true}
                                  onChange={(v) => {
                                    var today = moment()
                                      .startOf("day")
                                      .valueOf();
                                    var a = moment()
                                      .startOf("month")
                                      .add(v - 1, "days")
                                      .valueOf();
                                    const dateDiff = a - today;
                                    const daysDiff = Math.round(
                                      dateDiff / (1000 * 3600 * 24)
                                    );
                                    if (daysDiff > 0 && daysDiff <= 5) {
                                      setStartDate(
                                        moment(a)
                                          .add(1, "month")
                                          .format("YYYY-MM-DD")
                                      );
                                      setOpenConfirm(true);
                                    } else {
                                      setStartDate(
                                        a < today
                                          ? moment(a)
                                            .add(1, "month")
                                            .format("YYYY-MM-DD")
                                          : moment(a).format("YYYY-MM-DD")
                                      );
                                    }
                                  }}
                                /> */}


                                {simpleValidator.current.message(
                                  "startDate",
                                  startDate,
                                  "required"
                                )}
                              </span>
                            </div>
                            {/* <img className="Time" src={Time} alt="" /> */}
                            {/* <span className="Value"> 20th June</span> */}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <div className="years d-flex noselect cr-pointer">
                        <div className="shadow-none">
                          {["checkbox"].map((type) => (
                            <div key={`default-${type}`} className="mb-3">
                              <Form.Check
                                className="shadow-none"
                                type={type}
                                id={`default-${type}`}
                                label="Perpetual (30 Years)"
                                checked={isPerpetual}
                                onClick={(e) => {
                                  if (e.target.checked == true) {
                                    setYear("30");
                                  } else {
                                    setYear("");
                                  }
                                  setIsPerpetual((v) => !v);
                                }}
                              />
                            </div>
                          ))}
                        </div>
                        <span></span>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            ) : (
              <FundPurchaseNotAllowed text={"SIP not allowed in this fund"} />
            )}
          </TabPanel>
          <TabPanel className="calc-tablist-panel">
            {(props.fundData?.Overview?.is_purchase_available === "true" || props.fundData?.Overview?.is_purchase_available === "") &&
              props.fundData?.fund_detail?.sip_minimum_investment * 1 > 0 ? (
            // {props?.fundData?.fund_detail?.lumpsum_minimum_investment * 1 > 0 ? (
              <div className="calc-tablist-panel-item LumpSumData">
                <div
                  style={{
                    display: "flex",
                    borderBottom: "1px solid #d8d8d8",
                    paddingBottom: "0.5rem",
                  }}
                >
                  <label className="Input_Rupee" for="name">
                    ₹
                  </label>
                  <input
                    type="text"
                    className="amount-input-box"
                    name="currencyInput"
                    id="currencyInput"
                    value={value2}
                    placeholder="0"
                    onChange={NumberChange}
                    // onBlur={handleOnBlur2}
                    autoComplete="off"
                    maxLength={10}
                  />
                </div>
                {minAmount
                  ? lumpsumValidator.current.message(
                    "currencyInput",
                    value2,
                    "required|elssAmountLumpsum"
                  )
                  : lumpsumValidator.current.message(
                    "currencyInput",
                    value2,
                    "required"
                  )}
                {props?.fundData?.fund_detail?.lumpsum_minimum_investment * 1 > 0 &&
                  lumpsumValidator.current.message(
                    "lumpsumAmount",
                    value2,
                    `numeric|min:${props?.fundData?.fund_detail?.lumpsum_minimum_investment * 1
                    },num`
                  )}
              </div>
            ) : (
              <FundPurchaseNotAllowed
                text={"Lumpsum not allowed in this fund"}
              />
            )}
          </TabPanel>
        </div>
        {
          <div className="Right_Btn calc-buttons-d">
            <button
              disabled={!isEnabled}
              onClick={() => {
                const userId = localStorage.getItem("dXNlcmlk");

                if (!userId) {
                  navigate("/login");
                } else {
                  handleSubmit(1);
                }
              }}
              className={`fin-cal-button ${shake ? `shake` : ""}`}
            >
              Invest Now
            </button>

            <button
              disabled={!isEnabled}
              onClick={() => {
                const userId = localStorage.getItem("dXNlcmlk");

                if (!userId) {
                  navigate("/login");
                } else {
                  handleSubmit(2);
                }
              }}
              className="AddCart fin-cal-button"
            >
              Add to Cart
            </button>

          </div>
        }
      </Tabs>


      {/* <Modal
        backdrop="static"
        size="md"
        centered
        show={isOpen}
        className="profile-popups sign-popup"
        onHide={() => {
          closeModal(false);
        }}
      >
        <Modal.Body>
          <div className="modal-body-box p-3">
            <center>
              <h5>
                <b>{erroronproceed}</b>
              </h5>
            </center>
            <>
              <div className="pt-3 pb-3 ">
                <div className="img-box9 pt-4 inv-sign-border text-center">
                  <img
                    className="img-fluid inv-img-86 w-25"
                    src={
                      process.env.PUBLIC_URL +
                      "/static/media/image_2023_06_28T10_28_11_913Z.png"
                    }
                  />
                </div>
              </div>
              <div className=" pt-3">
                <FintooButton
                  onClick={() => {
                    closeModal(false);
                  }}
                  title={"Continue"}
                />
              </div>
            </>
          </div>
        </Modal.Body>
      </Modal> */}

      < ReactModal
        classNames={{
          modal: 'ModalpopupContentWidth',
        }} open={isOpen} showCloseIcon={false} center animationDuration={0} closeOnOverlayClick={true} onClose={closeModal} large
      >
        <div className="text-center">
          <h3 className="HeaderText">Attention !</h3>
          <div className="">
            <div className="PopupImg" style={{ width: '40%', margin: '0 auto' }}>
              <img style={{ width: '100%' }}
                src={process.env.PUBLIC_URL + "/static/media/DMF/SelectingTeam.svg"} />
            </div>
            <div className="p-2">
              <p className="PopupContent" style={{ fontSize: '1.3rem', fontWeight: 'normal', padding: '0 1rem', width: '90%', margin: '0 auto' }}>
                Please select member from the dropdown to proceed.</p>
            </div>
            <div className="ButtonBx aadharPopUpFooter" style={{ display: 'flex', justifyContent: 'center' }}>
              <button className="ReNew" onClick={() => {
                closeModal(false);
              }}>
                Continue
              </button>
            </div>
          </div>
        </div>
      </ReactModal>
    </div>
  );
}

export default TabData;
