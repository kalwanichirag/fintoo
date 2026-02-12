import React, { useEffect, useState } from 'react';
import style from '../../style.module.css';
import { indianRupeeFormat } from "../../../../common_utilities";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as toastr from "toastr";

import {
  getMemberId,
  getUserId,
  removeMemberId,
  setFpUserDetailsId,
  setMemberId,
  setUserId
} from '../../../../common_utilities';



const SavingAccountInfoSection = (props) => {
  const [allAccData, setAllAccData] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const totalBanks = props.totalBanks;
  const totalBankBalance = props.totalBankBalance;
  const dashboardData = props.dashboardData;
  const userContactNumber = props.userContactNumber;
  let user_details = "";

  const getMemberIdFn = () => {
    let isFamilySelected = Boolean(localStorage.getItem("family"));
    if (!isFamilySelected) {
      const userId = getUserId();
      const userIdArray = [userId];
      return userIdArray;
      // } else {
      //     let users = JSON.parse(commonEncode.decrypt(localStorage.getItem("member")));
      //     const idsArray = users.map(item => String(item.id));
      //     return idsArray;
    }
  };

  const indianRupeesWithoutRupees = (balance) => {
    const currentBal = indianRupeeFormat(balance);
    const currentBalWithoutRupee = currentBal.replace('₹', '');
    return currentBalWithoutRupee;
  };

  function handleNavigationToBankOverview() {
    navigate('/money-management/bank-tracking-overview');
  };

  async function handleNavigationToDashboard(accountNo) {
    // await FetchAccountTransactionsAPI(user_details, accountNo);
    dispatch({ type: "SET_FETCH_TXN_DATA_ACCOUNT", payload: accountNo });
    navigate(`/money-management/map-transactions`);
    // window.location.href = `${process.env.PUBLIC_URL}/money-management/map-transactions`;

  };

  function handleNavigationToOverview() {
    navigate('/money-management/overview');
  };

  const handleClick = (accountNo) => {
    // Your click handling logic goes here
    navigate("/money-management/dashboard", {
      state: { accountNoList: [accountNo] },
    });
  };
  const formatBalance = (balance) => {
    if (balance >= 10000000) {
      return (balance / 10000000).toFixed(1) + 'Cr';
    } else if (balance >= 100000) {
      return (balance / 100000).toFixed(1) + 'L';
    } else if (balance >= 1000) {
      return (balance / 1000).toFixed(1) + 'K';
    } else {
      return indianRupeesWithoutRupees(balance);
    }
  };

  const handleAccountClick = (account) => {
    if (props.onAccountClick) {
      props.onAccountClick(account)
    } else {
      handleNavigationToDashboard([account.mm_account_masked_id])
    }
  }

  useEffect(() => {
    user_details = getMemberIdFn();
  });

  return (
    <div className="">
      <div className="">
        <div className="">
          <div className={`GoalText ${props.headingColor ? "" : "default-grey"}`} style={{ marginBottom: "1rem", marginLeft: "0", color: `${props.headingColor ? props.headingColor : ""}`, }}>
            Account Balance
          </div>
          <div className={`autoAdvisory lifeInsurance ${style.savingAccountInfoSectionContainer}`}>
            <div className={`${style.SavingAccountInfoSectionAmountsMainContainer}`}>
              <div className={`${style.SavingAccountInfoSectionAmountsContainer}`}>
                <div className={`${style.SavingAccountInfoSectionTotalAmountContainer}`}>
                  <div>
                    <div className="TextLabel">Total Balance</div>
                    <div className="valueLabel">
                      &#8377;{" "}
                      <span className="bigBalue">
                        {formatBalance(totalBankBalance)}
                      </span>
                    </div>
                  </div>
                  {!Boolean(props.hideAddBtn) && (
                    <div className={`${style.showOverviewContainer}`} onClick={() => handleNavigationToOverview()} >
                      {"Show Overview >"}
                    </div>
                  )}
                </div>
                <div className="ms-lg-3 ms-0 d-flex justify-content-end">
                  <div className="d-md-grid d-flex align-items-center w-100 gap-2 gap-md-0 gap-lg-0">
                    <div className="TextLabel">Active Accounts</div>
                    <div className="valueLabel">
                      <span>{totalBanks.toString().padStart(2, "0")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`${style.SavingAccountInfoSectionBanksListOuterContainer}`}
              style={{ position: "relative" }}
            >
              <div
                className={`${style.SavingAccountInfoSectionBanksListContainerGradElem}`}
              ></div>
              {dashboardData.length > 0 ? (
                <div
                  className={`${style.SavingAccountInfoSectionBanksListContainer}`}
                >
                  {dashboardData.map((account, index) => (
                    <div
                      style={{
                        cursor: "pointer",
                        // padding: "1.8rem 1rem 1.7rem 1rem",
                      }}
                      onClick={() => handleAccountClick(account)}
                      className={`${style.SavingAccountInfoSectionBanksListItem
                        } ${props.activeBank == account.mm_account_masked_id &&
                        style.SavingAccountInfoSectionBanksListItemActive
                        }`}
                    >
                      <div
                        className={`${style.SavingAccountInfoSectionBanksListItemDataContainer}`}
                      >
                        <div
                          className={`${style.SavingAccountInfoSectionBanksListItemDataBankImg}`}
                          style={{
                            backgroundImage: `url(${process.env.REACT_APP_STATIC_URL +
                              "media/bank_logo/" +
                              account.mm_bank_logo
                              })`,
                          }}
                        ></div>
                        <div>
                          <div>{account.mm_fip_name}</div>
                          <div
                            style={{
                              color: "#042b62",
                              fontSize: "0.875rem",
                              fontStyle: "normal",
                              fontWeight: 400,
                            }}
                          >
                            Acc no: {account.mm_account_masked_id}
                          </div>
                        </div>
                      </div>
                      <div>{">"}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>No accounts</div>
              )}
            </div>
            {
              !Boolean(props.hideAddBtn) && (
                  <div className={`${style.addAccountBtnContainer}`}>
                    <div
                      className={`${style.btn1}`}
                      onClick={handleNavigationToBankOverview}
                    >
                      {"Add Account >"}
                    </div>
                  </div>
                )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingAccountInfoSection;
