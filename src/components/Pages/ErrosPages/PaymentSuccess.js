import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Success from "../../Assets/payment_success.png";
import MainLayout from "../../Layout/MainLayout";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getItemLocal } from "../../../common_utilities";
import { get } from "react-scroll/modules/mixins/scroller";
const PaymentSuccess = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [textNew, setTextNew] = useState("");
  const [textDesc, setTextDesc] = useState("");
  const [btnText, setBtnText] = useState("View Order Summary");
  const [btnUrl, setBtnUrl] = useState(`${process.env.PUBLIC_URL}/direct-mutual-fund/portfolio/dashboard/transaction?a=Pending`);

  const onLoadInIt = async () => {
    switch(searchParams.get("a")) {
      case "NEFT":
        setTextNew("Awaiting Payment Confirmation");
        setTextDesc(`On funds clearance, you will receive an email from us.`);
        break;
      case "NetBank":
        setTextNew("Your orders are placed");
        setTextDesc("Transaction processing will take upto 3 business days");
        break;
      case "Redeem":
        setTextNew("Congratulations! Your redemption request has been successfully placed! ");
      //setTextDesc("Your redemption request is under process. You may have received an email from BSE on your registered email. Kindly authenticate the order by clicking on the link provided in the email. In-case you  do not authenticate your order, it will be rejected.")
        break;
      case "Switch":
        setTextNew("Your transaction is successful!");
        // setTextDesc("Your switch request is under process. You may have received an email from BSE on your registered email. Kindly authenticate the order by clicking on the link provided in the email. In-case you  do not authenticate your order, it will be rejected.");
        break;
      case "SWP":
          setTextNew("Your transaction is successful!");
          // setTextDesc("Your SWP request is under process. You may have received an email from BSE on your registered email. Kindly authenticate the order by clicking on the link provided in the email. In-case you  do not authenticate your order, it will be rejected.");
          break;
      case "StopSIP":
        setTextNew("SIP cancellation successful!");
        setBtnText("Go Back");
        setBtnUrl(`${process.env.PUBLIC_URL}/direct-mutual-fund/portfolio/dashboard/`);
        break;
      case "itr":
        setTextNew("Payment Successful!");
        setBtnText("Go Back");
        setBtnUrl(`${process.env.PUBLIC_URL}/itr-file`);
        break;
      case "StopSWP":
        setTextNew("SWP cancellation successful!");
        setBtnText("Go Back");
        setBtnUrl(`${process.env.PUBLIC_URL}/direct-mutual-fund/portfolio/dashboard/`);
        break;
      default:
        if (getItemLocal('lumpsum') == null || getItemLocal('lumpsum') === "") {
          setTextNew("Your orders are placed");
          setTextDesc("Transaction processing will take upto 3 business days");
        } else {
          setTextNew("Your Payment is Successful!");
          setTextDesc("You can view the status of your order on the Transactions page.");
        }
        // setTextNew("Your Payment is Successful!");
        // setTextDesc("You can view the status of your order on the Transactions page.");
        // break;
    }
  }

  useEffect(()=> {
    onLoadInIt();
    dispatch({ type: "FORCE_UPDATE_CART_COUNT", payload: true });
  },[])

  return (
    <MainLayout className="container-sm">
      <div className="PaymentSuccess">
        <div className="Res-modal ">
          <div>
            <center>
              <img
                className="img-fluid SucessImg"
                src={process.env.REACT_APP_STATIC_URL + "media/DMF/payment_success.svg"}
                alt="SuccessPayment"
                srcset=""
              />
            </center>
          </div>
          <div className="mt-4 justify-center align-content-center">
            <h5 className="text-center">{textNew}</h5>
            <p
              className="text-center"
              style={{
                color: "#a0a0a0",
                fontSize: "1em",
                // padding: "2rem",
              }}
            >
              {textDesc}
            </p>
          </div>
          <div className="ErrorBtn">
            {/* <button
              className="shadow-none outline-none continue-btn "
                // onClick={handleClose}
            >
              Download Receipt
            </button> */}
            <button
              className="shadow-none outline-none continue-btn w-30"
                onClick={localStorage.removeItem('lumpsum')}
            >
              <a href={btnUrl}>
                {btnText}
              </a>
            </button>
            {getItemLocal('cart_data').length > 0 ?
            <button
              className="shadow-none outline-none continue-btn w-30"
                onClick={localStorage.removeItem('lumpsum')}
            >
              <Link to={process.env.PUBLIC_URL + "/direct-mutual-fund/mycart"}>View Cart</Link>
            </button>:''}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PaymentSuccess;
