import { useEffect, useRef, useState } from "react";
import Styles from "../../moneymanagement.module.css";
import { Modal } from "react-bootstrap";
import { indianRupeeFormat } from "../../../../common_utilities";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import commonEncode from "../../../../commonEncode";
import * as toastr from "toastr";
import { CHATBOT_BASE_API_URL} from "../../../../constants";
import { stopTrackingBank } from "../../../../FrappeIntegration-Services/services/money-management-api/moneyManagementService";
import moment from "moment";

function DotNavigation({ count, onClick }) {
  const [selectedDot, setSelectedDot] = useState(0);

  const handleDotClick = (index) => {
    setSelectedDot(index);
    onClick(index);
  };

  const dots = [];

  for (let i = 0; i < count; i++) {
    dots.push(
      <div key={i} className={`dot ${selectedDot === i ? 'selected' : ''}`} onClick={() => handleDotClick(i)} style={{ width: '10px', aspectRatio: '1', borderRadius: '50%', backgroundColor: `${selectedDot === i ? '#042b62' : '#D9D9D9'}`, cursor: 'pointer' }}></div>
    );
  }

  return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
    {dots}
  </div>;
}


const ActiveAccounts = () => {
  const [hiddenStates, setHiddenStates] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [token, setToken] = useState(null);
  const [hasFetchedData, setHasFetchedData] = useState(false);
  const userDetails = useSelector((state) => state.userDetails);
  const linkedAccountData = useSelector((state) => state.linkedAccountData);
  const [accounts, setAccounts] = useState([]);
  const navigate = useNavigate();
  const [singleconsentId, setSingleConsentId] = useState("");
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  let users = JSON.parse(commonEncode.decrypt(localStorage.getItem("member")));
  const call_id = users[0].id;

  const parentRef = useRef(null);

  useEffect(() => {
    if (linkedAccountData && linkedAccountData.length > 0) {

      // Flatten the array of arrays into a single array of account objects
      const flattenedAccounts = linkedAccountData.flat();


      // Map the flattened accounts to the format expected by your application

      const updatedAccounts = flattenedAccounts.map((account) => {
        return {
          bankLogo: account.mm_bank_logo,
          mm_fip_name: account.mm_fip_name,
          mm_account_masked_id: account.mm_account_masked_id,
          mm_last_updated: account.mm_last_updated,
          mm_total_balance: account.mm_total_balance,
          mm_consent_id: account.mm_consent_id,
          mm_user_id: account.mm_user_id
        };
      });
      setAccounts(updatedAccounts);
    } else {
      console.log("No linked account data available.");
    }
  }, [linkedAccountData]); //

  useEffect(() => {
    setHiddenStates(Array(accounts.length).fill(true));
  }, [accounts, singleconsentId]);
  // const handleToggle = (index) => {
  //     setHiddenStates((prevStates) => {
  //         const newStates = [...prevStates];
  //         newStates[index] = !newStates[index];
  //         return newStates;
  //     });
  // };

  const handleToggle = (index) => {
    const newHiddenStates = [...hiddenStates];
    newHiddenStates[index] = !newHiddenStates[index];
    setHiddenStates(newHiddenStates);
  };

  // const getHiddenAmount = (index, account) => {
  //     return hiddenStates[index] ? '******' : account.currentBalance;
  // };

  const getHiddenAmount = (index, account) => {
    if (hiddenStates[index]) {
      return "******";
    } else {
      const currentBal = indianRupeeFormat(account.mm_total_balance);
      const currentBalWithoutRupee = currentBal.replace("₹", "");
      // currentBal.replace("₹ ", "");
      return currentBalWithoutRupee; // Display actual balance when not hidden
    }
  };

  // function handleNavigation(accountDetails) {
  //     const history = useHistory();
  //     history.push({
  //         pathname: '${process.env.PUBLIC_URL}/money-management/overview',
  //         state: { accountDetails: accountDetails }
  //     });
  // }

  function handleNavigation(accountNoList) {
    navigate("/money-management/dashboard", {
      state: { accountNoList: [accountNoList] },
    });
  }

  const lastupdatedDate = (lastUpdatedTime) => {
    const date = new Date(lastUpdatedTime);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    // const hour = date.getHours();
    // const minute = date.getMinutes();

    const addOrdinalSuffix = (day) => {
      if (day > 3 && day < 21) return `${day}th`;
      switch (day % 10) {
        case 1: return `${day}st`;
        case 2: return `${day}nd`;
        case 3: return `${day}rd`;
        default: return `${day}th`;
      }
    };

    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    // const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    // const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedDateTime = `${addOrdinalSuffix(day)} ${months[monthIndex]} ${year}`;

    return formattedDateTime;
  };



  const unlinkAccount = async (consentData) => {
    // var myHeaders = new Headers();
    // const tkn = await getJWTToken();
    // myHeaders.append("gatewayauthtoken", 'Token '+tkn);
    // myHeaders.append("gatewayauthname", GATEWAY_AUTH_NAME);
    const payload = {
      user_id: consentData.account.mm_user_id,
      consentId: consentData.account.mm_consent_id
    };
    try {
      const result = await stopTrackingBank(payload);
      if (result.status_code == 200) {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success("Bank Unlinked Successfully");
        handleClose();
        window.location.reload();
      } else {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Error: Revoking consent.");
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // return (
  //     <div>Hi</div>

  // );

  const handleDotClick = (index) => {
    const childElement = parentRef.current.children[index];
    if (childElement) {
      childElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className={`${Styles.AccHeadtitle}`}>Active Accounts</div>

        <div className={`${Styles.AccHeadtitle}`} style={{ textDecorationLine: 'underline' }}>
          <Link style={{ color: '#042b62' }} to={`${process.env.PUBLIC_URL}/money-management/map-transactions`}>View all Transactions</Link></div>
      </div>
      <br />
      <div>
        {accounts.length > 0 ? (
          <>
            <div>
              <div ref={parentRef} className={`${Styles.activeAccList}`} style={{ overflow: 'unset' }}>
                {accounts.map((account, index) => (
                  <div key={index} className={`mt-4 ${Styles.ActiveAccounts}`}>
                    <div className={`${Styles.accountsBox}`}>
                      <div className={`${Styles.ActiveAccountsBox}`}>
                        <div
                          className={`${Styles.accDeatils}`}
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <div>
                            <img
                              width={30}
                              className="pointer"
                              src={`${process.env.REACT_APP_STATIC_URL + "media/bank_logo/" + account.bankLogo
                                }`}
                              alt={account.mm_fip_name}
                            />
                          </div>
                          <div className={`ms-2 ${Styles.bank_name}`}>
                            {account.mm_fip_name}
                          </div>
                          <div style={{ marginLeft: "auto", paddingRight: "10px" }}>
                            <img
                              width={11}
                              className="pointer"
                              src={`${process.env.REACT_APP_STATIC_URL +
                                "media/MoneyManagement/Back.png"
                                }`}
                              alt="Back-button"
                              style={{ transform: "scaleX(-1)" }}
                              onClick={() =>
                                handleNavigation([account.mm_account_masked_id])
                              }
                            />
                          </div>
                        </div>

                        <div className={`d-flex ${Styles.totalBalance}`}>
                          <div className={`${Styles.totalBalAmt}`}>
                            ₹ {getHiddenAmount(index, account)}
                          </div>
                          <div className="ms-4 mt-1">
                            <img
                              className="pointer"
                              onClick={() => {
                                handleToggle(index);
                              }}
                              src={`${process.env.REACT_APP_STATIC_URL
                                }media/MoneyManagement/${hiddenStates[index]
                                  ? "ph_eye-closed-duotone.svg"
                                  : "OpenEye.svg"
                                }`}
                              alt={hiddenStates[index] ? "Close View" : "Open View"}
                            />
                          </div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="mt-3">
                            <div className={`${Styles.accountNumber}`}>
                              {account.mm_account_masked_id}
                            </div>
                            {/* <div className={`${Styles.todaytime}`}>{account.lastUpdated}</div> */}
                            <div className={`${Styles.primaryTxt}`}>
                              As of  {moment(account.mm_last_updated).format("LL")}
                              {/* {lastupdatedDate(account.mm_last_updated)} */}
                            </div>
                          </div>
                          <div className={`${Styles.UnlinkBtn}`}>
                            <button
                              onClick={() => {
                                setShow(true);
                                setSingleConsentId({ account });

                              }}
                            >

                              <div>
                                <img
                                  className="pointer"
                                  src={`${process.env.REACT_APP_STATIC_URL +
                                    "media/MoneyManagement/ion_unlink.svg"
                                    }`}
                                  alt="Close View"
                                />
                              </div>
                              <div>Unlink</div>

                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>

        ) : (
          <div>No accounts</div>
        )}
      </div>
      {/* // Modal Confirm */}
      <Modal
        className="popupmodal p-2"
        centered
        show={show}
        onHide={handleClose}
      >
        <Modal.Header style={{ display: "block" }} className="ModalHead">
          <div
            style={{
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
            className="text-center"
          >
            Please Confirm
          </div>
        </Modal.Header>
        <div className=" p-4 d-grid place-items-center align-item-center">
          <div className=" HeaderModal">
            <div
              style={{
                fontSize: "1rem",
                textAlign: "center",
                fontWeight: "400",
              }}
            >
              <div>
                Are you sure you want to permanently unlink your bank account?
                This action is irreversible and you won't be able to track you
                expenses in future.
              </div>
              <div className="mt-1" style={{ fontWeight: "500" }}>
                Are you sure you want to unlink?
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center pb-5">
          <button
            style={{
              background: "transparent",
              outline: "0",
              border: "0",
              padding: ".5rem 1.9rem",
              border: "1px solid #042b62",
              color: "#042b62",
              borderRadius: "25px",
              fontSize: "1.1rem",
              fontWeight: "500",
            }}
            onClick={handleClose}
            className="outline-btn m-2"
          >
            No
          </button>
          <button
            style={{
              background: " #042b62",
              outline: "0",
              border: "0",
              padding: ".5rem 1.9rem",
              border: "1px solid #042b62",
              color: "#fff",
              borderRadius: "25px",
              fontSize: "1.1rem",
              fontWeight: "500",
            }}
            onClick={() => unlinkAccount(singleconsentId)}
            className="outline-btn m-2"
          >
            Yes
          </button>
        </div>
      </Modal>
    </div>
  );
};
export default ActiveAccounts;
