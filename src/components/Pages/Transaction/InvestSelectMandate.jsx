import HDFC from "../../Assets/hdfc.png";
import NextArrow from "../../Assets/NextStep.png";
import Link from "../../MainComponents/Link";
import commonEncode from "../../../commonEncode";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { IoCompassOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import transactioncss from "./transaction.module.css";
import Tooltip from "react-tooltip";
import { maskBankAccNo, indianRupeeFormat } from "../../../common_utilities";
const hanldeselectbankid = (props) => {
  let bank_id = props.data.bank_id;
  let bankid = commonEncode.encrypt(JSON.stringify(bank_id));

  localStorage.removeItem("selbankid");
  localStorage.setItem("selbankid", bankid);
};

function formatApprovedDate(raw) {
  if (!raw) return "";
  // Example input: "Feb 15 2024 10:25AM"
  // Add a space before AM/PM if missing (common in such strings)
  const fixed = raw.replace(/(AM|PM)$/i, " $1");
  const d = new Date(fixed);
  if (isNaN(d.getTime())) return raw; // fallback to raw if parsing fails
  return d.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

function InvestSelectMandate({ data, bankdata , onSelect, selected, handleConfirmSIP }) {
  const mandateStatus = JSON.parse(data.mandate_status_response || "{}");  
  const approvedDate = formatApprovedDate(mandateStatus.ApprovedDate);
  const regnDate = formatApprovedDate(mandateStatus.RegnDate);
  
  const [next, setNext] = useState("");
  const condiNavigation = () => {
    let x = localStorage.getItem("cart_data");
    let y = commonEncode.decrypt(x);
    let types = JSON.parse(y).map((v) => v.user_cart_purchase_type);
    
    types = [...new Set(types)];
    if (types.length > 1) {
      setNext("/direct-mutual-fund/MyCartAutoPay");
    } else {
      if (types[0] == "SIP") {
        setNext("/direct-mutual-fund/MyCartAutoPay");
      } else {
        setNext("/direct-mutual-fund/MyCartPaymentMode");
      }
    }
  };
  const tooltipStyle = {
    backgroundColor: "white",
  };
  useEffect(() => {
    condiNavigation();
  }, []);
  const handleSelect = () => {
    onSelect(data);
  };

  const displayStatus = (mandate_status) => {
    switch(mandate_status) {
      case "Approved":
        return <span
        style={{
          color: "#14AE5C",
          marginLeft: "5px",
          fontWeight: "500",
        }}
      >
        Approved
      </span>;
        break;
      case "Rejected":
        return <span
        style={{
          color: "#FFA500",
          marginLeft: "5px",
          fontWeight: "500",
        }}
      >
        Rejected {" "}
        <sup>
          <img
            data-tip
            data-for="waitingapproval"
            alt="inprocess"
            width={20}
            src={
              process.env.REACT_APP_STATIC_URL +
              "media/DMF/Inproceess.svg"
            }
          />
        </sup>
      </span>;
      break;
      case "Pending":
        return <span
        style={{
          color: "#FFA500",
          marginLeft: "5px",
          fontWeight: "500",
        }}
      >
        Inprocess{" "}
        <sup>
          <img
            data-tip
            data-for="waitingapproval"
            alt="inprocess"
            width={20}
            src={
              process.env.REACT_APP_STATIC_URL +
              "media/DMF/Inproceess.svg"
            }
          />
        </sup>
      </span>;
      break;
    }
  }
  return (
    <div
      className={`InvestSelectBank mb-3 pointer ${
        selected ? transactioncss.selectedBank : "pb-4"
      } ${data.mandate_status == 'Cancelled' || data.mandate_status == 'Rejected'||  data.mandate_status == 'Pending' ? 'disabled-bank' : ''}`}
      onClick={()=> {
        if(data.mandate_status == 'Approved') {
          handleSelect();
        }
      }}
    >
      
      <div className="bank-details ">
        <div
          style={{ padding: "1rem  .5rem" }}
          className="row bank-data align-items-center"
        >
          <div className="col-md-5 col-6 d-flex align-items-center">
            <div className={`${transactioncss.cartBankLogo}`}>
              <img
                src={`${process.env.REACT_APP_STATIC_URL}/media/bank_logo/${
                  bankdata.bank_bse_code ? bankdata.bank_bse_code : "img_default"
                }.png`}
              />
            </div>
            <div className="ms-2">
              <div
                title={bankdata.bank_name}
                className={`${transactioncss.CartBankName}`}
              >
                {bankdata.bank_name}
              </div>
              <div className={`${transactioncss.Bottomcarttext1} , ${transactioncss.Bottomcarttext2}`}>
                Account Number : {bankdata.bank_acc_no}
              </div>
              <div
                className={`${transactioncss.Bottomcarttext1} , ${transactioncss.Bottomcarttext2}`}
              >
                Digital Autopay Supported
                {/* {data.mandate_status == "Approved" ? `Approved on ${approvedDate}` : `Requested on ${regnDate}`} */}
                {data?.mandate_status != "N" && displayStatus(data?.mandate_status)}
              </div>
              <Tooltip id="waitingapproval" place="top" style={tooltipStyle}>
                Waiting for the mandate approval
              </Tooltip>
            </div>
          </div>
          <div className={` col-md-4 col-6 `}>
            <div className={`ms-3 ${transactioncss.accountNumbersection}`}>
              <div className={`${transactioncss.bankinfohead}`}>
                Mandate ID
              </div>
              <div className={`${transactioncss.bankinfodata}`}>
                {data.mandate_id}
              </div>
            </div>
          </div>
          <div className=" col-md-3 " style={{ position: "relative" }}>
            <div className={`ms-md-3 ${transactioncss.mobileBranchName}`}>
              {/* <div>
                <div className={`${transactioncss.bankinfohead}`}>
                  Branch Name
                </div>
                <div title={banklist.bank_branch} className={`${transactioncss.bankinfodata}`}>
                  {banklist.bank_branch}
                </div>
              </div> */}
              <div className={`${transactioncss.bankinfohead}`}>
                {data?.mandate_status == "N" ? "Branch Name" : "Maximum Limit"}
              </div>
              <div
                title={data.bank_branch}
                className={`${transactioncss.bankinfodata}`}
              >
                {data?.mandate_status == "N" ? data.bank_branch : indianRupeeFormat(data.mandate_amount, 0)}
              </div>
              {data?.mandate_status == "Pending" && <div
                style={{
                  background: "rgba(0, 224.54, 104.98, 0.09)",
                  borderRadius: 3,
                  border: "0.50px #00E169 dotted",
                  width: "max-content",
                  padding: "6px",
                  marginTop: "10px",
                  float: "right",
                  position: "absolute",
                  right: "0",
                  // bottom: "-22px",
                }}
              >
                5 - 7 days
              </div>}
            </div>
          </div>
          {selected && <div className="col-md-12">
            <div className="d-block mt-5">
            <button
              style={{ float: 'right' }}
                className={` ${transactioncss["my-btn"]}`}
                onClick={() => {
                  handleConfirmSIP();
                }}
                >
                Confirm SIP
              </button>
            </div>
          </div>}
        </div>
        {/* <div className="mobile-next d-none">
          <Link
            to={next}
            onClick={(e) => {
              hanldeselectbankid(props);
            }}
          >
            <MdOutlineArrowForwardIos style={{ color: "#042b62", fontSize: "20px" }} className=" mt-4" />
          </Link>
        </div> */}
      </div>
    </div>
  );
}

export default InvestSelectMandate;
