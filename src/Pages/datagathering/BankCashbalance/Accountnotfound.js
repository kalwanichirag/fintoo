import React, { useEffect, useRef, useState } from "react";
import Bankbalance from "../BankCashbalance/Bankbalance.module.css";
import HideFooter from "../../../components/HideFooter";
import HideHeader from "../../../components/HideHeader";
import { Link } from "react-router-dom";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { CHECK_SESSION } from "../../../constants";
import { apiCall, getCookie, getItemLocal, getUserId } from "../../../common_utilities";
import commonEncode from "../../../commonEncode";

const Accountnotfound = (props) => {
  const [session, setSession] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    const checksession = async () => {
      try {
        let url = '';
// let url = CHECK_SESSION;
        let data = { user_id: getUserId(), sky: getItemLocal("sky") };
        let session_data = await apiCall(url, data, true, false);

        if (session_data["error_code"] == "100") {
          setSession(session_data);
          let payload = JSON.parse(commonEncode.decrypt(getCookie("payload")));
          let userId = payload.userId.replace(/[^0-9]/g, "");
          setUser(userId)
        }
      } catch (e) {
        console.log("Error", e);
      }
    };

    // checksession();
  }, []);

  return (
    <div>
      <HideHeader />
      <div
        className={`white-modal fn-redeem-modal   ${Bankbalance.BanklistData}`}
      >
        <div className={`${Bankbalance.Accountnotfound}`}>
          <div className={`row ${Bankbalance.AccHeader}`}>
            <div className="col-md-4 col-2">
              <Link
                to={
                  process.env.PUBLIC_URL +
                  "/datagathering/assets-liabilities/bank-list"
                }
              >
                <IoChevronBackCircleOutline
                  className={`btn-fintoo-back ${Bankbalance.backIcon}`}
                />
              </Link>
            </div>
            <div
              className={`col-md-8 col-9 ps-4 pb-md-4 pb-2 pb-md-4 pb-2 ${Bankbalance.TextHeader}`}
            >
              Couldn't Find An Account
            </div>
          </div>
          <div className={`${Bankbalance.bankaccnotfounfinfo}`}>
            {session && (
              <p className={`${Bankbalance.text}`}>
                We could not find any account with your mobile number{" "}
                <span>+91 {user}</span>
              </p>
            )}
            <div className={`mt-md-5 md-4 ${Bankbalance.AccountnotfoundDeatils}`}>
              <p className={`${Bankbalance.ReasonAccnotfind}`}>
                This could be due to either
              </p>
              <div className={`${Bankbalance.ListAccnotfind}`}>
                <ul>
                  <li>
                    {" "}
                    The bank may be experiencing some technical difficulties -
                    please try again after some time.
                  </li>
                  <li>
                    Your account with the bank is a Joint account - Banks only
                    support this functionality in individual account.
                  </li>
                </ul>
              </div>
            </div>

          </div>
          <div className={`${Bankbalance.alternateOption}`}>
            <Link
              className="text-decoration-none text-black"
              to={
                process.env.PUBLIC_URL +
                "/datagathering/assets-liabilities/bank-account-mobile-number"
              }
            >
              <button>Use Another Number</button>
            </Link>
            <div className={`${Bankbalance.ExitBtn}`}>
              <Link
                className="text-decoration-none"
                to={
                  process.env.PUBLIC_URL +
                  "/datagathering/assets-liabilities/"
                }
              >
                Exit
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-10 mt-md-5">
          <div
            className={`pt-md-5 me-md-5 me-4 ${Bankbalance.thirdPartySection}`}
          >
            Powered by RBI regulated Account Aggregator{" "}
            <img
              src={process.env.REACT_APP_STATIC_URL + "media/DG/Finvu.png"}
              width={"60px"}
            />
          </div>
        </div>
      </div>
      <HideFooter />
    </div>
  );
};

export default Accountnotfound;
