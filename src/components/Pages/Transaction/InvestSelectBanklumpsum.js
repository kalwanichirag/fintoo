import HDFC from "../../Assets/hdfc.png";
import NextArrow from "../../Assets/NextStep.png";
import Link from "../../MainComponents/Link";
import commonEncode from "../../../commonEncode";
import { MdOutlineArrowForwardIos } from 'react-icons/md'
import { IoCompassOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { getItemLocal } from "../../../common_utilities";

const hanldeselectbankid = (props) => {
  let bank_id = props.banklist.name;
  let bankid = commonEncode.encrypt(JSON.stringify(bank_id));
  localStorage.removeItem('selbankid')
  localStorage.setItem('selbankid', bankid);
};

function InvestSelectBanklumpsum(props) {
  const [next, setNext] = useState("");

  const condiNavigation = () => {
    let x = localStorage.getItem("cart_data");
    let y = commonEncode.decrypt(x);
    let types = JSON.parse(y).map((v) => v.cart_purchase_type);
    types = [...new Set(types)];
    if (getItemLocal('lumpsum')) {
      setNext("/direct-mutual-fund/MyCartPaymentMode"); 
    } else {
      if (types[0] == 2) {
        setNext("/direct-mutual-fund/MyCartAutoPay");
      } else {
        setNext("/direct-mutual-fund/MyCartPaymentMode");
      }
    }
  };

  useEffect(() => {
    condiNavigation();
  }, []);

  return (
    <div className="InvestSelectBank">
      <div className="bank-details d-flex justify-content-between align-items-center">
        <div className="bank-data d-flex align-items-center">
          <div>
            <div className="SelectBankData">
              <div>
                <div className="BankLogo">
                  <img src={`${process.env.PUBLIC_URL}/static/media/bank_logo/${props.banklist.bank_bse_code ? props.banklist.bank_bse_code : 'img_default'}.png`} />
                </div>
              </div>
              <div className="bank-data-title BankName">
                <div className="InvestfundHeading mobileBankName">
                  <div>Bank</div>
                </div>
                <div className="AccountNo MobilebankNm">
                  <p>{props.banklist.bank_name}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bank-data-title bank_ac_no">
            <div className="InvestfundHeading">
              <div>Account No.</div>
            </div>
            <div className="AccountNo">
              <p>{props.banklist.bank_acc_no}</p>
            </div>
          </div>
          <div className="bank-data-title mobileBankBranch ">
            <div style={{ display: "flex" }}>
              <div>
                <div className="InvestfundHeading ">
                  <div>Branch Name</div>
                </div>
                <div className="AccountNo branchnm">
                  <p>{props.banklist.bank_branch}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mobile-next">
          <Link
            to={next}
            onClick={(e) => {
              hanldeselectbankid(props);
            }}
          >
            <MdOutlineArrowForwardIos style={{ color: "#042b62", fontSize: "20px" }} className=" mt-4" />
          </Link>
        </div>
      </div>
      
    </div>
  );
}

export default InvestSelectBanklumpsum;
