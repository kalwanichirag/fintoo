import HDFC from "../../Assets/hdfc.png";
import NextArrow from "../../Assets/NextStep.png";
import Link from "../../MainComponents/Link";
import commonEncode from "../../../commonEncode";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { IoCompassOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import transactioncss from "./transaction.module.css";
import Tooltip from "react-tooltip";
const hanldeselectbankid = (props) => {
  let bank_id = props.data.bank_id;
  let bankid = commonEncode.encrypt(JSON.stringify(bank_id));
  
  localStorage.removeItem("selbankid");
  localStorage.setItem("selbankid", bankid);
};

function InvestSelectBank({ data, onSelect, selected }) {

  const [next, setNext] = useState("");
  const condiNavigation = () => {
    let x = localStorage.getItem("cart_data");
    let y = commonEncode.decrypt(x);
    let types = JSON.parse(y).map((v) => v.cart_purchase_type);
    types = [...new Set(types)];
    if (types.length > 1) {
      setNext("/direct-mutual-fund/MyCartAutoPay");
    } else {
      if (types[0] == 2) {
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
  return (
    <div
      className={`InvestSelectBank pointer ${
        selected ? transactioncss.selectedBank : ""
      } ${data.emandate_allow == 0 ? 'disabled-bank' : ''}`}
      onClick={()=> {
        if(data.emandate_allow != 0) {
          handleSelect();
        }
      }}
    >
      <div className="bank-details">
        <div
          style={{ padding: "1rem  .5rem" }}
          className="row bank-data align-items-center"
        >
          <div className="col-md-5 col-6 d-flex align-items-center">
            <div className={`${transactioncss.cartBankLogo}`}>
              <img
                src={`${process.env.REACT_APP_STATIC_URL}/media/bank_logo/${
                  data.bank_bse_code ? data.bank_bse_code : "img_default"
                }.png`}
              />
            </div>
            <div className="ms-2">
              <div
                title={data.bank_name}
                className={`${transactioncss.CartBankName}`}
              >
                {data.bank_name}
              </div>
              
            </div>
          </div>
          <div className={` col-md-4 col-6 `}>
            <div className={`ms-3 ${transactioncss.accountNumbersection}`}>
              <div className={`${transactioncss.bankinfohead}`}>
                Account Number
              </div>
              <div className={`${transactioncss.bankinfodata}`}>
                {data.bank_acc_no}
              </div>
            </div>
          </div>
          <div className=" col-md-3 " style={{ position: "relative" }}>
            <div className={`ms-md-3 ${transactioncss.mobileBranchName}`}>
              <div>
                <div className={`${transactioncss.bankinfohead}`}>
                  Branch Name
                </div>
                <div title={data.bank_branch} className={`${transactioncss.bankinfodata}`}>
                  {data.bank_branch}
                </div>
              </div>
              
            </div>
          </div>
        </div>
        {data.emandate_allow == 0 && <div className="mandate-support-error"><p>This bank does not support emandate</p></div>}
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

export default InvestSelectBank;