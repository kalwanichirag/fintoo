import React, { useEffect, useState } from "react";
import { fetchEncryptData, getParentUserId } from "../../../common_utilities";
import { Link } from "react-router-dom";
import {AiFillCheckCircle} from "react-icons/ai"
const DigiLockerSuccess = () => {
  const downloadDigiDocument = async (clientID) => {
    try {
      var payload = {
        method: "POST",
        url: '',
        data: {
          client_id: clientID,
          user_id: getParentUserId().toString(),
        },
      };
      let digi_document = await fetchEncryptData(payload);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    const currentUrl = window.location.href;
    const urlSearchParams = new URLSearchParams(currentUrl);
    const client_id = urlSearchParams.get("client_id");
    downloadDigiDocument(client_id);
  }, []);
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <div className="kyc-success-card">
        <div className="card">
          <div className="card-body">
            <div>
             <AiFillCheckCircle className="success-icon"/>
            </div>
            <h1 className="success-title">KYC Completed!</h1>
            <p className="success-message">
              Thank you for completing your KYC process.
            </p>
            <Link to="/web/datagathering/about-you#completekyc">
              <button className="custom-button">
                <label>Ok</label>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigiLockerSuccess;
