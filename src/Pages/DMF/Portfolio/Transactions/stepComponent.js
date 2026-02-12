import React, { useState, useEffect, useRef, Fragment } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  DATA_BELONGS_TO,
  DMF_GET_MF_TRANSACTIONS_API_URL
} from "../../../../constants";
import {
  getUserId,
  getItemLocal,
  fetchEncryptData,
  indianRupeeFormat,
  fetchData,
} from "../../../../common_utilities";
import moment from "moment";
import style from "./style.module.css";
import { getTransactionsHistory } from "../../../../FrappeIntegration-Services/services/investment-api/investmentService";

const StepMessageComponent = ({ status, message }) => {
  const statusColor =
    status === "PENDING"
      ? { primary: "orange", secondary: "#ffa50014" }
      : { primary: "red", secondary: "#ff000008" };

  return (
    <div
      className={`${style.stepMessageContainer}`}
      style={{
        border: `1px solid ${statusColor.primary}`,
        background: `${statusColor.secondary}`,
      }}
    >
      {message}
    </div>
  );
};

const Step = ({
  stepNo,
  data,
  isLast,
  lineColorStatus,
  mergeStepData,
  bankName,
  successDatetime,
  installmentDate,
}) => {
  const getAnimationNameForBubble = (status) => {
    switch (status ?? "".toLowerCase()) {
      case "autocreate":
      // return 'bubble_autopatcreate_key_frame'
      case "approved":
      // return 'bubble_approved_key_frame'
      case "success":
        return "bubble_success_key";
      case "installment":
        return "bubble_installment_key";
      case "pending":
        return "bubble_pending_key";
      case "failed":
        return "bubble_failed_key";
      default:
        return "";
    }
  };

  const getBubbleContent = (status) => {
    // return '✓';
    switch (status ?? "".toLowerCase()) {
      case "autocreate":
      case "approved":
      case "success":
      case "installment":
        return "✓";
      case "pending":
        return "!";
      case "failed":
        return "𐄂";
      default:
        return "✓";
    }
  };

  return (
    <div
      className={`${style.stepContainer} ${
        mergeStepData?.status == "onhold" ? "" : style.status_found_box
      }`}
    >
      <div className={`${style.stepElementsContainer}`}>
        <div style={{ position: "relative" }}>
          <div
            style={{
              marginLeft: `${isLast ? "1px" : ""}`,
              paddingLeft: `${isLast ? "1px" : ""}`,
            }}
            className={`${
              mergeStepData?.status == "onhold" ? "" : style.status_found
            } ${style.bubble} ${
              style[getAnimationNameForBubble(mergeStepData?.status)]
            }`}
          ></div>
          <div
            style={{ padding: `${isLast ? "0 0 2px 2px " : ""}` }}
            className={`${style.bubble_content}`}
          >
            {getBubbleContent(mergeStepData?.status)}
          </div>
        </div>
        {!isLast ? (
          <div style={{ width: "2px", flex: "1", background: "#D3D3D3" }}>
            <div
              className={`${style.line} ${
                style[
                  getAnimationNameForBubble(mergeStepData?.status) + "_line"
                ]
              }`}
              style={{
                animationDelay: `${stepNo == 0 ? "0s" : `${stepNo * 2}s`}`,
              }}
            ></div>
          </div>
        ) : null}
      </div>
      <div style={{ padding: `0 0 ${isLast ? "0" : "3rem"} 0` }}>
        <div className={`${style.stepText}`}>{data.statusText}</div>
        <div className={`${style.stepBankname}`}>{data.statusDetails}</div>
      </div>
    </div>
  );
};

const StepComponent = () => {
  const [error, setError] = useState(false);
  const [mfTransactionsteps, setMfTransactionSteps] = useState([]);
  const transaction_id = useParams().transaction_id;
  const [mergeStepData, setMergeStepData] = useState([{}, {}, {}, {}]);

  const transactionSteps = async () => {
    try {
      let payload = {
        user_id: "" + getUserId(),
        transaction_id: parseInt(transaction_id) || 0,
        data_belongs_to: DATA_BELONGS_TO
      };

      var results = await getTransactionsHistory(payload);
      
      if (
        results?.status_code == 200 &&
        Array.isArray(results?.data)
      ) {
        setMfTransactionSteps(results.data);
        let transactionData = results.data[0];
        let newMergeStepData = [...mergeStepData];

        switch (transactionData?.cart_purchase_type) {
          case 'P':
            // newMergeStepData[0]["status"] = "approved";

            if (transactionData?.bse_status.toLowerCase() == "pass") {
              newMergeStepData[0]["status"] = "approved";
            }else if (transactionData?.bse_status.toLowerCase() == "") {
              newMergeStepData[0]["status"] = "pending";
            }else if (transactionData?.bse_status.toLowerCase() == "fail") {
              newMergeStepData[0]["status"] = "failed";
            }

            if (transactionData?.bse_payment_status.toLowerCase() == "success") {
              newMergeStepData[1]["status"] = "approved";
            } else if (transactionData?.bse_payment_status.toLowerCase() == "pending") {
              if (transactionData?.bse_order_status.toLowerCase() == "valid") {
                if (transactionData?.bse_order_status_remark.toLowerCase() == "allotment done") {
                  newMergeStepData[1]["status"] = "approved";
                }else{
                  newMergeStepData[1]["status"] = "pending";
                }
              } else {
                newMergeStepData[1]["status"] = "pending";
              }
            }else if (transactionData?.bse_payment_status.toLowerCase() == "failure") {
              newMergeStepData[1]["status"] = "failed";
            }

            if (transactionData?.bse_order_status.toLowerCase() == "valid") {
              if (transactionData?.bse_order_status_remark.toLowerCase() == "allotment done") {
                newMergeStepData[2]["status"] = "approved";
              }else{
                newMergeStepData[2]["status"] = "pending";
              }
            }else if (transactionData?.bse_order_status.toLowerCase() == "") {
              if (transactionData?.bse_status.toLowerCase() == "fail") {
                newMergeStepData[2]["status"] = "failed";
              }else{
                newMergeStepData[2]["status"] = "pending";
              }
            }else if (transactionData?.bse_order_status.toLowerCase() == "invalid") {
              newMergeStepData[2]["status"] = "failed";
            } else if (transactionData?.bse_order_status.toLowerCase() == "pending") {
              newMergeStepData[2]["status"] = "pending";
            }

            break;
          case 'SIP':
            if (transactionData.transaction_mandate_id) {
              newMergeStepData[0]["status"] = "approved";
            } else {
              newMergeStepData[0]["status"] = "failed";
            }
            newMergeStepData[1]["status"] = "onhold";
            newMergeStepData[2]["status"] = "onhold";
            newMergeStepData[3]["status"] = "onhold";

            if (transactionData?.mandate_status.toLowerCase() == "approved") {
              newMergeStepData[1]["status"] = "approved";
            }else if(transactionData?.mandate_status.toLowerCase() == "failed") {
              newMergeStepData[1]["status"] = "failed";
            } else if(transactionData?.mandate_status.toLowerCase() == "pending") {
              newMergeStepData[1]["status"] = "pending";
            } else if(transactionData?.mandate_status.toLowerCase() == "") {
              if (transactionData.transaction_mandate_id) {
                newMergeStepData[1]["status"] = "pending";
              } else {
                newMergeStepData[1]["status"] = "failed";
              }
            }

            if (transactionData?.order_status.toLowerCase() == "success") {
              newMergeStepData[2]["status"] = "approved";
            } else if (transactionData?.order_status.toLowerCase() == "pending") {
              newMergeStepData[2]["status"] = "pending";
            } else if (transactionData?.order_status.toLowerCase() == "failed") {
              newMergeStepData[2]["status"] = "failed";
            }
            
            if (transactionData?.payment_status.toLowerCase() == "success") {
              newMergeStepData[3]["status"] = "approved";
            }else if (transactionData?.payment_status.toLowerCase() == "pending") {
              newMergeStepData[3]["status"] = "pending";
            }else if (transactionData?.payment_status.toLowerCase() == "failed") {
              newMergeStepData[3]["status"] = "failed";
            }
            break;
          case 'R':
            newMergeStepData[0]["status"] = "approved";

            if (transactionData?.bse_status.toLowerCase() == "pass") {
              newMergeStepData[1]["status"] = "approved";
            }else if (transactionData?.bse_status.toLowerCase() == "") {
              newMergeStepData[1]["status"] = "pending";
            }else if (transactionData?.bse_status.toLowerCase() == "fail") {
              newMergeStepData[1]["status"] = "failed";
            }

            if (transactionData?.bse_order_status.toLowerCase() == "valid") {
              if (transactionData?.bse_order_status_remark.toLowerCase() == "allotment done") {
                newMergeStepData[2]["status"] = "approved";
              }else{
                newMergeStepData[2]["status"] = "pending";
              }
            }else if (transactionData?.bse_order_status.toLowerCase() == "") {
              if (transactionData?.bse_status.toLowerCase() == "fail") {
                newMergeStepData[2]["status"] = "failed";
              }else{
                newMergeStepData[2]["status"] = "pending";
              }
            }else if (transactionData?.bse_order_status.toLowerCase() == "invalid") {
              newMergeStepData[2]["status"] = "failed";
            }

            break;
          case 'SI':
            newMergeStepData[0]["status"] = "approved";

            if (transactionData?.bse_status.toLowerCase() == "pass") {
              newMergeStepData[1]["status"] = "approved";
            }else if (transactionData?.bse_status.toLowerCase() == "") {
              newMergeStepData[1]["status"] = "pending";
            }else if (transactionData?.bse_status.toLowerCase() == "fail") {
              newMergeStepData[1]["status"] = "failed";
            }

            if (transactionData?.bse_order_status.toLowerCase() == "valid") {
              newMergeStepData[2]["status"] = "approved";
            }else if (transactionData?.bse_order_status.toLowerCase() == "") {
              if (transactionData?.bse_status.toLowerCase() == "fail") {
                newMergeStepData[2]["status"] = "failed";
              }else{
                newMergeStepData[2]["status"] = "pending";
              }
            }else if (transactionData?.bse_order_status.toLowerCase() == "invalid") {
              newMergeStepData[2]["status"] = "failed";
            }
            break;

          case 'SO':
            newMergeStepData[0]["status"] = "approved";

            if (transactionData?.bse_status.toLowerCase() == "pass") {
              newMergeStepData[1]["status"] = "approved";
            }else if (transactionData?.bse_status.toLowerCase() == "") {
              newMergeStepData[1]["status"] = "pending";
            }else if (transactionData?.bse_status.toLowerCase() == "fail") {
              newMergeStepData[1]["status"] = "failed";
            }

            if (transactionData?.bse_order_status.toLowerCase() == "valid") {
              newMergeStepData[2]["status"] = "approved";
            }else if (transactionData?.bse_order_status.toLowerCase() == "") {
              if (transactionData?.bse_status.toLowerCase() == "fail") {
                newMergeStepData[2]["status"] = "failed";
              }else{
                newMergeStepData[2]["status"] = "pending";
              }
            }else if (transactionData?.bse_order_status.toLowerCase() == "invalid") {
              newMergeStepData[2]["status"] = "failed";
            }
            break;
          case 'SWP':
            newMergeStepData[0]["status"] = "approved";
            if (transactionData?.bse_status.toLowerCase() == "pass") {
              newMergeStepData[1]["status"] = "approved";
            }else if (transactionData?.bse_status.toLowerCase() == "") {
              newMergeStepData[1]["status"] = "pending";
            }else if (transactionData?.bse_status.toLowerCase() == "fail") {
              newMergeStepData[1]["status"] = "failed";
            }

            if (transactionData?.bse_order_status.toLowerCase() == "valid") {
              newMergeStepData[2]["status"] = "approved";
            }else if (transactionData?.bse_order_status.toLowerCase() == "") {
              if (transactionData?.bse_status.toLowerCase() == "fail") {
                newMergeStepData[2]["status"] = "failed";
              }else{
                newMergeStepData[2]["status"] = "pending";
              }
            }else if (transactionData?.bse_order_status.toLowerCase() == "invalid") {
              newMergeStepData[2]["status"] = "failed";
            }
            break;
          case 'STI':
              newMergeStepData[0]["status"] = "approved";
              newMergeStepData[1]["status"] = "onhold";
              newMergeStepData[2]["status"] = "onhold";
              if (transactionData?.order_status.toLowerCase() == "success") {
                newMergeStepData[0]["status"] = "approved";
                newMergeStepData[1]["status"] = "approved";
                newMergeStepData[2]["status"] = "approved";
              }
              if (transactionData?.order_status.toLowerCase() == "failed") {
                newMergeStepData[0]["status"] = "approved";
                newMergeStepData[1]["status"] = "failed";
                newMergeStepData[2]["status"] = "failed";
              }
              if (transactionData?.order_status.toLowerCase() == "pending") {
                newMergeStepData[0]["status"] = "approved";
                newMergeStepData[1]["status"] = "pending";
              }
              break;
          case 'STO':
              newMergeStepData[0]["status"] = "approved";
              newMergeStepData[1]["status"] = "onhold";
              newMergeStepData[2]["status"] = "onhold";
              if (transactionData?.order_status.toLowerCase() == "success") {
                newMergeStepData[0]["status"] = "approved";
                newMergeStepData[1]["status"] = "approved";
                newMergeStepData[2]["status"] = "approved";
              } else if (
                transactionData?.order_status.toLowerCase() == "failed"
              ) {
                newMergeStepData[0]["status"] = "approved";
                newMergeStepData[1]["status"] = "failed";
                newMergeStepData[2]["status"] = "failed";
              }
              if (transactionData?.order_status.toLowerCase() == "pending") {
                newMergeStepData[0]["status"] = "approved";
                newMergeStepData[1]["status"] = "pending";
              }
              break;
        }
        
        setMergeStepData([...newMergeStepData]);
      } else {
        if (results?.status_code == 404) {
          setMfTransactionSteps([]);
        }
      }
    } catch (e) {
      console.error("Something went wrong");
    }
  };

  useEffect(() => {
    try {
      document
        .querySelector(`.${style["status_found_blink"]}`)
        .classList.remove(style["status_found_blink"]);
    } catch {}
    try {
      let ele = document.querySelectorAll(`.${style["status_found"]}`);
      ele.forEach((v, i) => {
        if (i == ele.length - 1) {
          v.classList.add(style["status_found_blink"]);
        }
      });
      ele = document.querySelectorAll(
        `.${style["status_found_box"]} .${style["line"]}`
      );
      ele.forEach((v, i) => {
        v.style.animationDelay = 2 * i + "s";
        // v.style.border = "solid 2px";
      });
    } catch {}
  }, [mergeStepData]);

  useEffect(() => {
    transactionSteps();
  }, []);

  const showOrderNote = (mergeStepData) => {
    try {
      // check for failed order
      if (mergeStepData.some((v) => v?.status == "failed")) {
        return false;
      } else if (mergeStepData.every((v) => v?.status == "approved")) {
        return false;
      } else {
        return true;
      }
      // return true;
    } catch {
      return true;
    }
  };

  return (
    <>
      <br />
      {mfTransactionsteps.length > 0 &&
        mfTransactionsteps.map((val) => {
          return (
            <Fragment key={val.cart_purchase_type + "_purchasetype"}>
              {(val.cart_purchase_type == 'SIP') && (
                <div className={`${style["step-main-container"]}`}>
                  <Step
                    mergeStepData={mergeStepData[0]}
                    data={{ statusText: "Auto-pay Created",
                        statusDetails: val.bank_name + " (XXXXXX" + (val.bank_acc_no ? val.bank_acc_no.substr(val.bank_acc_no.length - 4) : "") + ")", }}
                  />
                  <Step
                    mergeStepData={mergeStepData[1]}
                    data={{
                      statusText: "Auto-pay Approved"
                    }}
                  />
                  <Step
                    mergeStepData={mergeStepData[2]}
                    data={{
                      statusText: "SIP Registration Success at BSE",
                    }}
                  />
                  <Step
                    mergeStepData={mergeStepData[3]}
                    data={{
                      statusText: "Payment of 1st SIP Installment",
                      statusDetails: val.order_status === "INVALID"
                      ? val.order_status_remark
                        ? `Reason: ${val.order_status_remark}`
                        : ""
                      : val.order_status_remark
                      ? `Status: ${val.order_status_remark}`
                      : "",
                    }}
                    isLast={true}
                  />
                </div>
              )}

              {(val.cart_purchase_type == 'P') && (
                <div className={`${style["step-main-container"]}`}>
                  <Step
                    mergeStepData={mergeStepData[0]}
                    data={{ statusText: "Lumpsum Order placed" }}
                  />
                  <Step
                    mergeStepData={mergeStepData[1]}
                    data={{
                      statusText: "Payment confirmed by BSE",
                    }}
                  />
                  
                  <Step
                    isLast={true}
                    mergeStepData={mergeStepData[2]}
                    data={{
                      statusText: "Units allotted by AMC",
                      statusDetails: val.order_status === "INVALID"
                      ? val.order_status_remark
                        ? `Reason: ${val.order_status_remark}`
                        : ""
                      : val.order_status_remark
                      ? `Status: ${val.order_status_remark}`
                      : "",
                    }}
                  />
                </div>
              )}

              {(val.cart_purchase_type == 'R') && (
                <div className={`${style["step-main-container"]}`}>
                  <Step
                    mergeStepData={mergeStepData[0]}
                    data={{ statusText: "Redeem Order Placed" }}
                  />
                  <Step
                    mergeStepData={mergeStepData[1]}
                    data={{
                      statusText: "Redeem Order Placed At BSE",
                    }}
                  />
                  <Step
                    isLast={true}
                    mergeStepData={mergeStepData[2]}
                    data={{
                      statusText: "Amount Credited To Your Bank",
                      statusDetails:val.order_status === "INVALID"
                      ? val.order_status_remark
                        ? `Reason: ${val.order_status_remark}`
                        : ""
                      : val.order_status_remark
                      ? `Status: ${val.order_status_remark}`
                      : "",
                    }}
                  />
                </div>
              )}
              {(val.cart_purchase_type == 'SI') && (
                <div className={`${style["step-main-container"]}`}>
                  <Step
                    mergeStepData={mergeStepData[0]}
                    data={{ statusText: "Switch Order Placed" }}
                  />
                  <Step
                    mergeStepData={mergeStepData[1]}
                    data={{
                      statusText: "Switch order placed at BSE",
                    }}
                  />
                  <Step
                    isLast={true}
                    mergeStepData={mergeStepData[2]}
                    data={{
                      statusText: "Switch success",
                      statusDetails: val.order_status === "INVALID"
                      ? val.order_status_remark
                        ? `Reason: ${val.order_status_remark}`
                        : ""
                      : val.order_status_remark
                      ? `Status: ${val.order_status_remark}`
                      : "",
                    }}
                  />
                </div>
              )}
              {(val.cart_purchase_type == 'S0') && (
                <div className={`${style["step-main-container"]}`}>
                  <Step
                    mergeStepData={mergeStepData[0]}
                    data={{ statusText: "Switch Order Placed" }}
                  />
                  <Step
                    mergeStepData={mergeStepData[1]}
                    data={{
                      statusText: "Switch order placed at BSE",
                    }}
                  />
                  <Step
                    isLast={true}
                    mergeStepData={mergeStepData[2]}
                    data={{
                      statusText: "Switch success",
                      statusDetails: val.order_status === "INVALID"
                      ? val.order_status_remark
                        ? `Reason: ${val.order_status_remark}`
                        : ""
                      : val.order_status_remark
                      ? `Status: ${val.order_status_remark}`
                      : "",
                    }}
                  />
                </div>
              )}
              {(val.cart_purchase_type == 'SWP') && (
                <div className={`${style["step-main-container"]}`}>
                  <Step
                    mergeStepData={mergeStepData[0]}
                    data={{ statusText: "SWP order placed" }}
                  />
                  <Step
                    mergeStepData={mergeStepData[1]}
                    data={{
                      statusText: "SWP order placed at BSE",
                    }}
                  />
                  <Step
                    isLast={true}
                    mergeStepData={mergeStepData[2]}
                    data={{
                      statusText: "SWP success",
                      statusDetails: val.order_status === "INVALID"
                      ? val.order_status_remark
                        ? `Reason: ${val.order_status_remark}`
                        : ""
                      : val.order_status_remark
                      ? `Status: ${val.order_status_remark}`
                      : "",
                    }}
                  />
                </div>
              )}
              {(val.cart_purchase_type == 'STI') && (
                <div className={`${style["step-main-container"]}`}>
                  <Step
                    mergeStepData={mergeStepData[0]}
                    data={{ statusText: "STP Order Placed" }}
                  />
                  <Step
                    mergeStepData={mergeStepData[1]}
                    data={{
                      statusText: "STP Order Under Process At BSE",
                    }}
                  />
                  <Step
                    isLast={true}
                    mergeStepData={mergeStepData[2]}
                    data={{
                      statusText: "STP Order Success",
                      statusDetails: val.order_status === "INVALID"
                      ? val.order_status_remark
                        ? `Reason: ${val.order_status_remark}`
                        : ""
                      : val.order_status_remark
                      ? `Status: ${val.order_status_remark}`
                      : "",
                    }}
                  />
                </div>
              )}
              {(val.cart_purchase_type == 'STO') && (
                <div className={`${style["step-main-container"]}`}>
                  <Step
                    mergeStepData={mergeStepData[0]}
                    data={{ statusText: "STP Order Placed" }}
                  />
                  <Step
                    mergeStepData={mergeStepData[1]}
                    data={{
                      statusText: "STP Order Under Process At BSE",
                    }}
                  />
                  <Step
                    isLast={true}
                    mergeStepData={mergeStepData[2]}
                    data={{
                      statusText: "STP Order Success",
                      statusDetails: val.order_status === "INVALID"
                      ? val.order_status_remark
                        ? `Reason: ${val.order_status_remark}`
                        : ""
                      : val.order_status_remark
                      ? `Status: ${val.order_status_remark}`
                      : "",
                    }}
                  />
                </div>
              )}
              {mergeStepData.filter(v=> v.status == "pending").length > 0 && <StepMessageComponent
                status={"PENDING"}
                message={
                  "It takes 4-5 working days for the AMC to confirm orders."
                }
              />}
            </Fragment>
          );
        })}
      {/* <div>
                <Step stepNo={0} data={{ statusText: 'Payment failed', status: 'FAILED' }} lineColorStatus={'FAILED'} />
                <Step stepNo={1} data={{ statusText: 'Failed', status: 'FAILED' }} isLast={true} />
                {
                    <StepMessageComponent status={'FAILED'} message={'If amount was debited from your account, it will be reverted within 4-5 working days'} />
                }
            </div> */}
    </>
  );
};

export default StepComponent;
