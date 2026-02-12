import React, { useState } from "react";
import style from "../style.module.css";
import Styles from "../moneymanagement.module.css";
import { Link } from "react-router-dom";
const Header = ({ title, decscription, props, Banklogoshow, isMobileNumberDes, onBackClick, mobileNumberStyle, mobileNumberDesc, mobNo }) => {
  return (
    <div className="d-md-block">
      <div className="d-flex align-items-center">

        <div className="ms-5 d-flex align-items-center">
          <div>
            {Banklogoshow && (
              <div>
                <img width={50} src={process.env.REACT_APP_STATIC_URL +
                  Banklogoshow} alt="bank_logo" />
              </div>
            )}
          </div>
          <div className={`${Banklogoshow ? "ms-3" : null}`}>
            <div className={`${Styles.title}`}>{title}</div>
            <div className={`${Styles.decscription} ${isMobileNumberDes || mobileNumberDesc ? "d-none" : "d-block" }`}>{decscription}</div>
            {
              isMobileNumberDes && (
                <div className={`${Styles.decscription}`}>You will receive a 6-digit code on your phone number <span style={{
                  color: "#042b62",
                  fontWeight: "500"
                }}>+91-{mobNo}</span> from Finvu</div>
              )
            }
            {
              mobileNumberDesc && (
                <div className={`${Styles.decscription}`}>Verify your bank account by OTP sent to you on your phone number <span style={{
                  color: "#042b62",
                  fontWeight: "500"
                }}>+91-{mobNo}</span></div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;
