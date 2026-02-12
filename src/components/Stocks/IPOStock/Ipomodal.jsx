import React, { useState } from "react";
import Styles from "./style.module.css";
import { SlClose } from "react-icons/sl";
import { Link } from "react-router-dom";
function Ipomodal(props) {
  return (
    <div className={`${Styles.ipomodal}`}>
      <div className={`${Styles.Popupclose}`}>
        <SlClose onClick={props.onCloseModal} />
      </div>
      <div className="text-center">
        <div className={` ${Styles.popupTxt}`}>IPO Request Recieved</div>
        <div className={`${Styles.poplabel}`}>
          You will receive a call from us shortly <br /> to complete the
          process.
        </div>
        <div className={`${Styles.iporeqdetails}`}>
          <div className={`${Styles.ipoName}`}>Go Digit</div>
          <hr />
          <div className="pt-2 d-flex justify-content-between">
            <div className={`${Styles.ipolabel}`}>Bidding Date</div>
            <div className={`${Styles.ipodate}`}>27 Jan 2023</div>
          </div>
          <div className="d-flex justify-content-between mt-3">
            <div className={`${Styles.ipolabel}`}>Pricing Range</div>
            <div className={`${Styles.ipodate}`}>₹ 38 - 40</div>
          </div>
          <div className="d-flex justify-content-between mt-3">
            <div className={`${Styles.ipolabel}`}>Lot Size</div>
            <div className={`${Styles.ipodate}`}>3000</div>
          </div>
        </div>
        <div className={`${Styles.ipoOkbtn}`}>
          <Link to={process.env.PUBLIC_URL + "/stocks?page=ipo"}>
            <button>Ok</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Ipomodal;
