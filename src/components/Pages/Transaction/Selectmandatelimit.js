import commonEncode from "../../../commonEncode";
import { useEffect, useState } from "react";
import transactioncss from "./transaction.module.css";
import { Link } from "react-router-dom";
import { transcode } from "buffer";
import { getUserId, maskBankAccNo } from "../../../common_utilities";
import { GetCartDetails } from "../../../FrappeIntegration-Services/services/investment-api/investmentService";
import { DATA_BELONGS_TO } from "../../../constants";
function Selectmandatelimit(props) {
  const [next, setNext] = useState("");

  const condiNavigation = async () => {
    
    try {
      var payload = {
        user_id: getUserId(),
        data_belongs_to: DATA_BELONGS_TO
      }
      let cart_response = await GetCartDetails(payload);
      let types = cart_response?.data?.map((v) => v.cart_purchase_type);
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
    } catch (err) {
      console.error("condiNavigation====>", err);
    }
  };

  useEffect(() => {
    condiNavigation();
  }, []);

  return (
    <div style={{ backgroundColor: "#FBFBFB" }} className="InvestSelectBank">
      <div className="bank-details">
        <div
          style={{ padding: ".5rem  .5rem" }}
          className="d-md-flex justify-content-between bank-data align-items-center"
        >
          <div className=" d-flex align-items-center">
            <div className={`${transactioncss.cartBankLogo}`}>
              <img
                width={30}
                src={`${process.env.REACT_APP_STATIC_URL}/media/bank_logo/${
                  props.banklist.bank_bse_code
                    ? props.banklist.bank_bse_code
                    : "img_default"
                }.png`}
              />
            </div>
            <div className="ms-2">
              <div
                title={props.banklist.bank_name}
                className={`${transactioncss.CartmandateBankName}`}
              >
                <div
                  className={`${transactioncss.cartbanksName}`}
                  title={props.banklist.bank_name}
                >
                  {props.banklist.bank_name}{" "}
                </div>
                <div
                  className="ms-2"
                  style={{
                    color: "rgba(0, 0, 0, 0.60)",
                    fontSize: ".9rem",
                    fontWeight: "400",
                  }}
                >
                  (Digital Autopay Supported)
                </div>
              </div>
            </div>
          </div>
          <div className="me-3">
            <div className="">
              <div className={`${transactioncss.bankinfodata}`}>
                {maskBankAccNo(props.banklist.bank_acc_no)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Selectmandatelimit;
