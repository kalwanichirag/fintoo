import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Rupee from "../../Assets/Rupee.png";
import security from "../../Assets/security.png";
import BackBtn from "../../Assets/left-arrow.png";
// import Link from "../../MainComponents/Link";
import { Link } from "react-router-dom";
import Investmentfundbox from "./Investmentfundbox";
import MainLayout from "../../Layout/MainLayout";
import FintooButton from "../../HTML/FintooButton";
import transactioncss from "./transaction.module.css";
import uuid from "react-uuid";
import {
  DATA_BELONGS_TO,
  investmentEndpoints,
} from "../../../constants";
import commonEncode from "../../../commonEncode";
import axios from "axios";
import {
  CheckSession,
  apiCall,
  indianRupeeFormat,
  loginRedirectGuest,
  getSumOfProperty,
  setItemLocal,
  getItemLocal,
  getUserId,
  getCurrentUserDetails,
  getProfilePercentage,
  fetchMembers,
  isFamilySelected,
  getProfileStatusData
} from "../../../common_utilities";

import WhiteOverlay from "../../HTML/WhiteOverlay";
import { useSelector, useDispatch } from "react-redux";
import SweetAlert from "sweetalert-react";
import FintooInlineLoader from "../../FintooInlineLoader";
import { useNavigate } from "react-router-dom";
import IncompleteRegistration from "../../IncompleteRegistration";
import Modal from "react-bootstrap/Modal";
import { Modal as ReactModal } from "react-responsive-modal";
import { DeleteCart, GetCartDetails } from "../../../FrappeIntegration-Services/services/investment-api/investmentService";

const AddFund = () => {};
const CloseFund = () => {};
const cartFunds = [["sip"], ["sip", "lumpsum"]];

export default function MyCart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cartList, setCartList] = useState(cartFunds);
  const [cartData, setCartData] = useState([]);
  const [cartDataCopy, setCartDataCopy] = useState([]);

  const [error, setError] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [cartValue, setCartValue] = useState(0);
  const [goingToDelete, setGoingToDelete] = useState({});
  const [openConfirm, setOpenConfirm] = useState(false);
  const [mainData, setMainData] = useState({});
  const [statusData, setStatusData] = useState({});
  const [showLoader, setShowLoader] = useState(false);
  const [isProfileIncomplete, setIsProfileIncomplete] = useState(false);
  const [status, setnomineestatus] = useState("");
  const [showPanel, setShowPanel] = useState("");
  const [profilepercent, setprofilepercent] = useState("");
  const isDisabled = true;
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  const [erroronproceed, setErrorOnProceed] = useState(
    "Please select a member from the dropdown to proceed."
  );
  const membersRef = useRef({});
  const [CartSummaryshow, SetCartsummaryShow] = useState(false);
  const [cartSum, setCartSum] = useState({ sip: 0, lumpsum: 0 });
  const userid = getUserId();
  const [text, setpopuptext] = useState("");
  const [isOpenReKycModal, setIsOpenReKycModal] = useState(false);
  const loggedIn = useSelector((state) => state.loggedIn);

  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    if (!userid) {
      loginRedirectGuest();
    } else {
      onLoadInIt();
      // fetchUsersData();
      nomineestatus();
    }
  }, [status]);

  const onLoadInIt = async () => {
    try {
      setShowLoader(true);

      if (getItemLocal("family")) {
        var new_array = [];
        var new_data = getItemLocal("member");
        new_data.forEach((element) => {
          new_array.push(element.id);
        });
      }
      var user = getUserId();
      if (user == null) return;

      var memberData = await fetchMembers();
      var newMemberObj = {};
      memberData.forEach((v) => {
        newMemberObj[v.id] = v.NAME ?? v.fdmf_email ?? "";
      });
      membersRef.current = newMemberObj;

      var payload = {
        user_id: getItemLocal("family") ? new_array : getUserId()
      }

      var res = await GetCartDetails(payload);
      var response = commonEncode.decrypt(res.data);
      const cartdStr = JSON.parse(response)["data"];
      let cartSum = getSumOfProperty(cartdStr, "cart_amount");
      if (!loggedIn) {
      setCartValue(cartSum);
      setItemLocal("cart_data", cartdStr);
      // new code
      setCartDataCopy(cartdStr);
      let _cartSum = { sip: 0, lumpsum: 0 };
      // if(cartdStr)
      for (let i = 0; i < cartdStr.length; i++) {
        if (cartdStr[i]["cart_purchase_type"] == 1) {
          _cartSum.lumpsum = _cartSum.lumpsum + cartdStr[i]["cart_amount"];
        } else {
          _cartSum.sip = _cartSum.sip + cartdStr[i]["cart_amount"];
        }
      }
      setCartSum({ ..._cartSum });
      setItemLocal("cart_amt", cartSum);

    
      // Also update guest cart count for persistence
      if (cartdStr.length > 0) {
        localStorage.setItem("guestCartCount", cartdStr.length.toString());
      }
    }

    dispatch({ type: "UPDATE_CART_COUNT", payload: cartdStr.length });
      // Dispatch global event for header component
      window.dispatchEvent(
        new CustomEvent("cartUpdated", {
          detail: { cartCount: cartdStr.length },
        })
      );

      var newA = [];
      cartdStr
        .map((v) => ({ ...v, memberName: membersRef.current[v.user_id] }))
        .forEach((v) => {
          var index = newA.findIndex(
            (x) =>
              v.cart_scheme_code == x.cart_scheme_code && v.user_id == x.user_id
          );
          if (index < 0) {
            newA.push(v);
            v.funds = [];
            v.funds.push(v);
          } else {
            newA[index].funds.push(v);
          }
        });

      // crtData.push(newA);
      setCartData([...newA]);
      setShowLoader(false);
    } catch (e) {
      setShowLoader(false);
      //
      setError(true);
    }
  };

  const reloadPage = () => {
    onLoadInIt();
  };

  const onRemoveScheme = async () => {
    setWaiting(true);
    setOpenConfirm(false);
    try {
      var payload = {
        from_cart_id: "" + goingToDelete.cart_id,
        user_id: "" + getUserId(),
      };

      const response = await DeleteCart(payload);
      if (response.error_code === 200) {
        dispatch({
          type: "RENDER_TOAST",
          payload: { message: response.message, type: "success" },
        });
      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: { message: response.message, type: "error" },
        });
      }
      setWaiting(false);
      onLoadInIt();
    } catch (e) {
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: "Something went wrong", type: "error" },
      });
      setWaiting(false);
    }
  };
  const onAddScheme = (v, keyid) => {
    var mainArray = cartData;
    var mainIndex = mainArray.findIndex(
      (x) => x.cart_scheme_code == v.cart_scheme_code
    );
    mainArray[mainIndex].funds.push({
      cart_scheme_code: mainArray[mainIndex].cart_scheme_code,
      cart_purchase_type: keyid + "",
      cart_id: "temp_" + uuid(),
    });
    setCartData([...mainArray]);
  };

  const nomineestatus = async () => {
    try {
      var res = await apiCall(DMF_NOMINEESTATUS, {
        user_id: userid,
        data_belongs_to: DATA_BELONGS_TO,
      });
      setnomineestatus(res.message);
    } catch (e) {
      console.error(e);
    }
  };

  // const fetchUsersData = async () => {
  //   try {
  //     var res = await apiCall(DMF_DATAGATHERING_API_URL, {
  //       user_id: "" + userid,
  //       data_belongs_to: DATA_BELONGS_TO,
  //     });
  //     setItemLocal("main", res.data);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  const disable = () => {
    return isDisabled;
  };

  const handleClick = async () => {
    try {
      const r = await getCurrentUserDetails();

      const p = await getProfilePercentage(r);

      setprofilepercent(p);
      if (p == 100 && status != "N") {
        navigate(
          process.env.PUBLIC_URL + "/direct-mutual-fund/MyCartSelectBank"
        );
      } else {
        setIsProfileIncomplete(true);
      }
    } catch (e) {
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: e.toString(), type: "error" },
      });
    }
  };

  const proceedToPayment = async (type = null) => {
    const r = await getCurrentUserDetails();
    const p = await getProfilePercentage(r);
    setprofilepercent(p);

    if (type == null) return;
    if (getItemLocal("family") == "1") {
      setpopuptext("Please select member from the dropdown to proceed.");
      openModal();
    }
    // else if (r.is_minor == "Y" && (getItemLocal("main").aof_status == "0" || getItemLocal("main").aof_status == "")) {
    //   // setpopuptext("Please complete your profile to access all features and enjoy a tailored experience")
    //   // openModal()
    // }
    // else if (r.is_minor !== "Y" && (status === "N" || p !== 100)) {
    //   // setpopuptext("Please complete your profile to access all features and enjoy a tailored experience")
    //   // openModal()
    // }
    else {
      if (type == "sip") {
        // SIP
        navigate(
          process.env.PUBLIC_URL + "/direct-mutual-fund/select-bank-for-sip"
        );
      } else if (type == "lumpsum") {
        // lumpsum
        navigate(
          process.env.PUBLIC_URL + "/direct-mutual-fund/select-bank-for-lumpsum"
        );
      }
    }
  };

  const handleSubmit = () => {
    if (profilepercent != 100 && !getItemLocal("family")) {
      navigate(
        process.env.PUBLIC_URL + "/direct-mutual-fund/profile/dashboard"
      );
    }
    if (status === "N" && profilepercent == 100) {
      navigate(
        process.env.PUBLIC_URL + "/direct-mutual-fund/profile/dashboard/nominee"
      );
    }
  };

  const lumsumamt = 6000;
  const SIPamt = 1000;

  return (
    <MainLayout>
      <div
        className={`${isFamilySelected() && "cls-family-selected"}`}
        style={{ background: "none" }}
      >
        <WhiteOverlay show={waiting} />
        <IncompleteRegistration
          open={isProfileIncomplete}
          onCloseModal={() => {
            setIsProfileIncomplete(false);
          }}
          // handleSubmit={() => {
          //   console.log(profilepercent == 100, "percent////")
          //   if (profilepercent != 100) {
          //     console.log("100")
          //     navigate(process.env.PUBLIC_URL + "/direct-mutual-fund/profile")
          //   }
          //   if (status === "N" && profilepercent == 100) {
          //     console.log("!=100")
          //     navigate(process.env.PUBLIC_URL + "/direct-mutual-fund/profile/dashboard/nominee")
          //   }
          //   // {status === "N" && profilepercent == 100 ? navigate(process.env.PUBLIC_URL + "/direct-mutual-fund/profile/dashboard/nominee"):navigate(process.env.PUBLIC_URL + "/direct-mutual-fund/profile")}
          //   // navigate(process.env.PUBLIC_URL + "/direct-mutual-fund/profile");
          //   // navigate(process.env.PUBLIC_URL + "/direct-mutual-fund/profile?s=NomineeDetails");
          // }}
        />

        <ReactModal
          classNames={{
            modal: "ModalpopupXs",
          }}
          open={openConfirm}
          showCloseIcon={false}
          center
          animationDuration={0}
          closeOnOverlayClick={false}
          large
        >
          <div className="text-center">
            <h3 className="HeaderText">Delete Confirmation</h3>
            <div className="">
              <div className="p-2">
                <p
                  className="PopupContent"
                  style={{ fontSize: "1.3rem", fontWeight: "normal" }}
                >
                  Are you sure you want to remove funds from the cart ?
                </p>
              </div>
              <div
                className="ButtonBx aadharPopUpFooter"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <button
                  className="outlineBtn"
                  onClick={() => {
                    onRemoveScheme();
                  }}
                >
                  Yes
                </button>
                <button
                  className="ReNew"
                  onClick={() => {
                    setOpenConfirm(false);
                  }}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </ReactModal>

        <ReactModal
          classNames={{
            modal: "ModalpopupContentWidth",
          }}
          open={isOpen}
          showCloseIcon={false}
          center
          animationDuration={0}
          closeOnOverlayClick={true}
          onClose={closeModal}
          large
        >
          <div className="text-center">
            <h3 className="HeaderText">Attention !</h3>
            <div className="">
              <div
                className="PopupImg"
                style={{ width: "40%", margin: "0 auto" }}
              >
                <img
                  style={{ width: "100%" }}
                  src={
                    process.env.PUBLIC_URL +
                    "/static/media/DMF/SelectingTeam.svg"
                  }
                />
              </div>
              <div className="p-2">
                <p
                  className="PopupContent"
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: "normal",
                    padding: "0 1rem",
                    width: "90%",
                    margin: "0 auto",
                  }}
                >
                  {text}
                </p>
              </div>
              <div
                className="ButtonBx aadharPopUpFooter"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <button
                  className="ReNew"
                  onClick={() => {
                    closeModal();
                    handleSubmit();
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </ReactModal>

        <ReactModal
          classNames={{
            modal: "ModalpopupContentWidth",
          }}
          open={isOpenReKycModal}
          showCloseIcon={true}
          center
          animationDuration={0}
          closeOnOverlayClick={true}
          large
          onClose={() => setIsOpenReKycModal(false)}
        >
          <div>
            <h3 className="text-center HeaderText">Attention !</h3>
            <div className="p-2" style={{ fontSize: "1.2rem" }}>
              <p>Dear Client,</p>
              <p>
                We regret to inform you that your KYC verification has failed
                due to certain reasons. As per the recent circular by SEBI, we
                need you to undergo the Re-KYC (Re-verification of KYC) process.
              </p>
              <p>
                Ensuring compliance with KYC norms is crucial for regulatory
                purposes and to maintain the integrity of our financial
                services. Therefore, we kindly request your cooperation in
                completing the Re-KYC process at your earliest convenience.
              </p>
              <p>
                Please{" "}
                <a
                  href="https://investor-web.hdfcfund.com/kyc-verification"
                  onClick={() => {
                    setIsOpenReKycModal(false);
                  }}
                  target="_blank"
                >
                  Click Here
                </a>{" "}
                to initiate the Re-KYC process. Your understanding and prompt
                action in this matter are greatly appreciated.
              </p>
              <div
                className="ButtonBx aadharPopUpFooter"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <button
                  className="ReNew"
                  onClick={() => {
                    setIsOpenReKycModal(false);
                    window.open(
                      "https://investor-web.hdfcfund.com/kyc-verification",
                      "_blank"
                    );
                  }}
                >
                  Re-KYC
                </button>
                <button
                  style={{ backgroundColor: "#999" }}
                  className="ReNew"
                  onClick={() => {
                    setIsOpenReKycModal(false);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </ReactModal>

        <Container>
          <div className="row justify-content-md-center">
            <div className="col-12 col-md-12 col-lg-8  ">
              <div className="MainPanel Cart">
                <div className="">
                  <div>
                    <span className="Rupeees">
                      {CartSummaryshow ? (
                        <>
                          <img
                            onClick={() => {
                              SetCartsummaryShow(false);
                            }}
                            className="BackBtn"
                            // src={BackBtn}
                            src={
                              process.env.REACT_APP_STATIC_URL +
                              "media/DMF/left-arrow.svg"
                            }
                            alt=""
                            srcset=""
                          />
                        </>
                      ) : (
                        <Link
                          to={`${process.env.PUBLIC_URL}/direct-mutual-fund/funds/all`}
                        >
                          <img
                            className="BackBtn"
                            // src={BackBtn}
                            src={
                              process.env.REACT_APP_STATIC_URL +
                              "media/DMF/left-arrow.svg"
                            }
                            alt=""
                            srcset=""
                          />
                        </Link>
                      )}
                    </span>{" "}
                  </div>
                </div>
                <div className="TransDetails TwoSpace mt-md-4">
                  <div className="AllTrans ">
                    <h4 className="tranText pb-2">
                      {CartSummaryshow ? "Cart Summary" : "All Transactions"}
                    </h4>
                    {/* <div className="GreenLine"></div> */}
                  </div>
                  <div className="d-md-none d-block mt-3">
                    {isFamilySelected() == false && (
                      <Link
                        style={{ textDecoration: "none", color: " #fff" }}
                        // to={"/direct-mutual-fund/funds/all"}
                        to={
                          process.env.PUBLIC_URL +
                          "/direct-mutual-fund/funds/all"
                        }
                        className="AddFund"
                      >
                        Add Funds
                      </Link>
                    )}
                  </div>
                </div>
              </div>
              <div className="TwoSpace">
                <div className="InvestFund">
                  <p>
                    {CartSummaryshow
                      ? "Total Payable Amount"
                      : "Investment Funds"}
                  </p>
                  {/* <p>Please note: If your SIP date is within the next 5 days, your SIP will start from the next month on the chosen date.</p> */}
                </div>
                <div className="d-md-block d-none">
                  {isFamilySelected() == false && (
                    <Link
                      style={{ textDecoration: "none", color: " #fff" }}
                      // to={"/direct-mutual-fund/funds/all"}
                      to={
                        process.env.PUBLIC_URL + "/direct-mutual-fund/funds/all"
                      }
                      className="AddFund"
                    >
                      Add Funds
                    </Link>
                  )}
                </div>
              </div>
              <FintooInlineLoader isLoading={showLoader} />
              <div className={CartSummaryshow ? "d-none" : "d-block"}>
                {cartData.length > 0 &&
                  cartData.map((v, i) => (
                    <>
                      <Investmentfundbox
                        key={v.cart_scheme_code + v.funds.length}
                        onAdd={(a, b) => onAddScheme(a, b)}
                        onRemove={(a) => {
                          setGoingToDelete({ ...a });
                          setOpenConfirm(true);
                        }}
                        schemeType={v}
                        reloadPage={() => reloadPage()}
                      />
                    </>
                  ))}
                {cartData.length == 0 && (
                  <div className="row">
                    <div className="item-continer-bx">
                      <p className="mb-0 text-center">Cart is empty!</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {cartDataCopy.length > 0 && (
              <div className="col-md-4 col-12">
                <p
                  className="d-md-block d-none"
                  style={{ height: "2.6rem" }}
                ></p>
                <div
                  className={
                    CartSummaryshow
                      ? "d-block CartAmtBox mt-md-5"
                      : "d-md-block d-none "
                  }
                >
                  <div className="TransDetails">
                    <div className="AllTrans">
                      <h4
                        className={`pb-2 d-md-block d-none ${transactioncss.cartText}`}
                      >
                        Cart Summary
                      </h4>
                    </div>
                    {cartDataCopy.filter((v) => v.cart_purchase_type == 1)
                      .length > 0 && (
                      <div className={`${transactioncss.cartPaytype}`}>
                        <div>
                          <div className={`${transactioncss.cartmode}`}>
                            Lumpsum
                          </div>
                          <div className="mt-1">
                            <div className={`${transactioncss.grayColortext}`}>
                              Amount Payable Now
                            </div>
                            <div className={`${transactioncss.payamt}`}>
                              {indianRupeeFormat(cartSum.lumpsum, 0)}
                            </div>
                          </div>
                        </div>
                        <div className={`${transactioncss.paynowBtn}`}>
                          {cartValue * 1 > 0 ? (
                            // <button className={`${transactioncss.paynowBtn}`} onClick={() => (setItemLocal("lumpsum",1),proceedToPayment('lumpsum'))}>Pay Now</button>
                            <button
                              className={`${transactioncss.paynowBtn}`}
                              onClick={() => (
                                setItemLocal("lumpsum", 1),
                                setItemLocal("lumpsum_amount", cartSum.lumpsum),
                                proceedToPayment("lumpsum")
                              )}
                            >
                              Pay Now
                            </button>
                          ) : (
                            <button disabled={true}>Pay Now </button>
                          )}
                        </div>
                      </div>
                    )}

                    {cartDataCopy.filter((v) => v.cart_purchase_type == 2)
                      .length > 0 && (
                      <div className={`${transactioncss.cartPaytype}`}>
                        <div>
                          <div className={`${transactioncss.cartmode}`}>
                            SIP
                          </div>
                          <div className="mt-1">
                            <div className={`${transactioncss.grayColortext}`}>
                              Amount Payable Now
                            </div>
                            <div className={`${transactioncss.payamt}`}>
                              {indianRupeeFormat(cartSum.sip, 0)}
                            </div>
                          </div>
                        </div>
                        <div className={`${transactioncss.paynowBtn}`}>
                          {cartValue * 1 > 0 ? (
                            <button
                              className={`${transactioncss.paynowBtn}`}
                              onClick={() => (
                                setItemLocal("sip_amount", cartSum.sip),
                                localStorage.removeItem("lumpsum"),
                                proceedToPayment("sip")
                              )}
                            >
                              Pay Now{" "}
                            </button>
                          ) : (
                            <button disabled={true}>Pay Now </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 d-flex justify-content-center align-items-center">
                    <div>
                      <img
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/DMF/security.svg"
                        }
                        alt=""
                        width={30}
                      />
                    </div>
                    <div className="ms-3 font-bold">
                      100% Safe And Secure Payment
                    </div>
                  </div>
                </div>
              </div>
            )}
            <Col className="MobileView" xs={11}>
              <div className="mb-float-button">
                {CartSummaryshow ? null : (
                  <button
                    onClick={() => {
                      SetCartsummaryShow(true);
                    }}
                  >
                    <label>Proceed to Pay</label>
                  </button>
                )}
                {/* <Link to={`${process.env.PUBLIC_URL}/direct-mutual-fund/MyCartSelectBank`}> */}

                {/* </Link> */}
              </div>
            </Col>
            {/* <div className="CartSummary">
              <div className="CartSummaryDeatils">
                <div className="CartHeading">
                  <div>Cart Summary</div>
                </div>
                <div className="HRLine"></div>
                <div className="CartCenter">
                  <p className="AmtPayText">Amount payable now</p>
                  <p
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <span className="Cart_Amt">
                      {indianRupeeFormat(cartValue * 1, 0)}
                    </span>
                  </p>
                  <div className="SecureShield">
                    <img src={
                      process.env.REACT_APP_STATIC_URL + "media/DMF/security.png"
                    } alt="" />
                  </div>
                  <p className="Safe">100% SAFE AND SECURE</p>
                </div>
                {getItemLocal("family") ?
                  <div className="CartBtn">

                    {isFamilySelected() || cartValue * 1 == 0 ? (
                      <p className="zero-para mb-0">PROCEED TO PAY</p>
                    ) : (
                     
                      <FintooButton
                        onClick={(disable, openModal)}
                        title="PROCEED TO PAY"
                      />
                    )}
                  </div>
                  : <div className="CartBtn">
                    {cartValue * 1 == 0 ? (
                      <p className="zero-para mb-0">PROCEED TO PAY</p>
                    ) : (
                      <FintooButton
                        onClick={handleClick}
                        title="PROCEED TO PAY"
                      />
                    )}
                  </div>}<div>
                </div>
              </div>
            </div> */}
          </div>
        </Container>

        <br />
        <br />
        <br />
      </div>
    </MainLayout>
  );
}
