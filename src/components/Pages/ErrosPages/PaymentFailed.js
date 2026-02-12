import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Fail from "../../Assets/failed_Payment.png";
import MainLayout from "../../Layout/MainLayout";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";

const PaymentFailed = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [textNew, setTextNew] = useState("");
  const [textDesc, setTextDesc] = useState("");
  const [btnUrl, setBtnUrl] = useState(`${process.env.PUBLIC_URL}/direct-mutual-fund/mycart`);
  const dispatch = useDispatch();

  const onLoadInIt = async () => {
    if (searchParams.get("a") == "Switch" || searchParams.get("a") == "Redeem" || searchParams.get("a") == "NEFT" || searchParams.get("a") == "StopSIP" || searchParams.get("a") == "swp" || searchParams.get("a") == "Mandate" || searchParams.get("a") == "stp" ) {
      dispatch({ type: "FORCE_UPDATE_CART_COUNT", payload: true });
      setTextNew("Oops! Something went wrong.");
      setTextDesc("Please retry or try again after sometime.");
    }else if(searchParams.get("a") == "itr"){
      dispatch({ type: "FORCE_UPDATE_CART_COUNT", payload: true });
      setTextNew("Your Payment Failed !");
      setTextDesc("Please try again or use a different payment method.");
      setBtnUrl(`${process.env.PUBLIC_URL}/itr-plan-upgrade`);
    }
    else {
      dispatch({ type: "FORCE_UPDATE_CART_COUNT", payload: true });
      setTextNew("Your Payment Failed !");
      setTextDesc("Please try again or use a different payment method.");
    }
    if (searchParams.get("a") == "StopSIP" || searchParams.get("a") == "swp") {
      setBtnUrl(`${process.env.PUBLIC_URL}/direct-mutual-fund/portfolio/dashboard/fund`);
    }
  }

  useEffect(()=> {
    onLoadInIt();
  },[])

  return (
    <MainLayout className="container-sm">
      <div className="PaymentSuccess">
        <div className="Res-modal">
          <div>
            <center>
              <img
                className="img-fluid SucessImg"
                src={process.env.REACT_APP_STATIC_URL + "media/DMF/failed_Payment.svg"}
                alt="FailPayment"
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
                fontSize: "17px",
                // padding: "2rem",
              }}
            >
              {textDesc}
            </p>
          </div>
          <center>
            <button className="shadow-none outline-none continue-btn ">
              <a href={btnUrl}>
              Re-Initiate
              </a>
            </button>
          </center>
        </div>
      </div>
    </MainLayout>
  );
};

export default PaymentFailed;
