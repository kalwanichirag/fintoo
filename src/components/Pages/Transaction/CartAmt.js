import React from "react";
import Rupee from "../../Assets/Rupee.png";
import { memo } from "react";
import { getItemLocal } from "../../../common_utilities";

function CartAmt(props) {
  let cartAmt;
  cartAmt = getItemLocal("cart_amt");

  if (!cartAmt) {
    cartAmt = props.cartAmt ? props.cartAmt : 0;
  }

  return (
    <div>
      {/* <div className="CartSummary">
        <div className="CartSummaryDeatils">
          <div className="CartHeading">
            <h4>Total payable</h4>
          </div>
          <div className="HRLine"></div>
          <div className="CartCenter">
            <p className="AmtPayText">Amount payable now</p>
            <div
              style={{
                textAlign: "center",
              }}
            >
              <span className="Rupeees">
                <img src={Rupee} alt="" srcset="" />
              </span>{" "}
              <span className="Cart_Amt">30 ,00, 000</span>
            </div>
            <div className="SecureShield">
              <img src={security} alt="" />
            </div>
            <p className="Safe">100% SAFE AND SECURE</p>
          </div>
        </div>
      </div> */}
      {/* {console.log(getItemLocal('lums_amount'),"^^^^^^^6",getItemLocal('sip_smount'))} */}

      <div className="CartAmtBox totalPayable">
        <div className="CartSummary">
          <div className="CartSummaryDeatils">
            <div className="CartHeading">
              <div>Total Payable</div>
            </div>
            <div className="HRLine"></div>
            <div className="CartCenter">
              <p className="AmtPayText">Amount payable now</p>
              <p
                style={{
                  textAlign: "center",
                }}
              >
                <span className="Rupeees">₹</span>{" "}
                <span className="Cart_Amt">{getItemLocal('lumpsum')?getItemLocal('lumpsum_amount'):getItemLocal('sip_smount')}</span>
              </p>
              <div className="SecureShield">
                <img
                  className="BackBtn"
                  src={
                    process.env.REACT_APP_STATIC_URL + "media/DMF/security.png"
                  }
                  alt="BackBtn"
                />
              </div>
              <p className="Safe">100% SAFE AND SECURE</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(CartAmt);
