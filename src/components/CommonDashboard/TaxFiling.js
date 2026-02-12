import React, { useState, memo } from "react";
import creditreport from "./CreditScore/Creditreport.module.css";
import Nsdlcsdl from "./../../Pages/datagathering/AssetsLibDG/NSDL_CSDL/Nsdlcsdl";
import moment from "moment";
import { Link } from "react-router-dom";

const TaxFiling = (props) => {
  const [partreportPopup, setParReportpopup] = useState(false);


  return (
    <>
      <div className={`${creditreport.CreditReportboxs}`}>
        <div
          className={` ${creditreport.Texttitle} ${creditreport.creditmeter} mt-0 pt-4 custom-color`}
        >
          <>
            <div style={{ color: "#042b62", width:'30%' }}>
              <p
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#042b62 !important",
                }}
                className=""
              >
                Tax Planning
              </p>

              <p style={{ fontSize: ".9rem" }}>
                Optimize your tax planning with expert advice! Schedule a
                consultation now and get personalized guidance to maximize your
                savings.
              </p>
              <div className={`mt-2 ${creditreport.refreshbtn}`}>
                <Link
                  className="rounded-action-buttons"
                  to={`${process.env.PUBLIC_URL}/tax-planning-page`}
                >
                  Schedule Now
                </Link>
              </div>
            </div>

            
          </>
        </div>
      </div>

      {partreportPopup ? (
        <>
          <Nsdlcsdl />
        </>
      ) : null}
    </>
  );
};
export default TaxFiling;
