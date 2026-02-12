import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import HDFC from "../../../components/Assets/Dashboard/hdfc.png";
import Female from "../../../components/Assets/Dashboard/female.png";
// import IoIosMore from "react-icons/io";
import { RiDeleteBinLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import { indianRupeeFormat } from "../../../common_utilities";
import MandateTable from "./Profile.bank.module.css"
import MandateStepcomponet from "./Mandatestatus/MandateStepcomponet";
import Styles from './Mandatestatus/style.module.css'
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
function ManadateData(props) {
  const statusList = ['Pending', 'Cancelled', 'Approved', 'Rejected']
  const [toggle, setToggle] = useState(false);

  return (
    <>
      <div className={`${Styles.mandateStatusbox}`}>
        <div className="row align-items-center">
          <div className="col-4">{props.mandateDetail.mandate_id}</div>
          <div className="col-4 text-md-center">{indianRupeeFormat(props?.mandateDetail?.mandate_amount, 0)}</div>
          <div className="col-4 text-center " style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div>
              {props.mandateDetail.mandate_status == "Pending" && (
                <div
                  className=""
                  style={{
                    color: "gray",
                  }}
                >
                  In progress
                </div>
              )}
              {props.mandateDetail.mandate_status == "Rejected" && (
                <div
                  className=""
                  style={{
                    color: "gray",
                  }}
                >
                  Rejected
                </div>
              )}
              {props.mandateDetail.mandate_status == "Approved" && (
                <div
                  className=""
                  style={{
                    color: "gray",
                  }}
                >
                  Approved
                </div>
              )}
              {props.mandateDetail.mandate_status == "Cancelled" && (
                <div
                  className=""
                  style={{
                    color: "gray",
                  }}
                >
                  Failed
                </div>
              )}
            </div>
            <span style={{
              color: "#042b62",
              fontSize: "1.2rem",
              fontWeight: "500",
              cursor: "pointer",
              paddingLeft: "1rem"
            }} >
              {toggle ? (
                <IoIosArrowUp onClick={() => setToggle(!toggle)} />
              ) : <IoIosArrowDown onClick={() => setToggle(!toggle)} />
              }

            </span>
          </div>
        </div>

        {toggle && (
          <>
            <br />
            <div style={{ borderTop: ".8px solid rgba(0, 0, 0, 0.10)", padding: "1rem 0" }}></div>
            <div className="mt-2 ms-2">
              <MandateStepcomponet data={props.mandateDetail} status={props.mandateDetail.mandate_status ?? "Pending"} />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default ManadateData;
