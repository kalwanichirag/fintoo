import React, { useEffect, useRef, useState } from "react";
import Styles from '../../moneymanagement.module.css';
import Snippet from "./Snippet";
import ActiveAccounts from "../../views/AccountBalance/ActiveAccounts";
import testpdf from "./Snippet.pdf"
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { pdfjs } from 'react-pdf';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { indianRupeeFormat } from "../../../../common_utilities"
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import commonEncode from "../../../../commonEncode";
import {
    getMemberId,
    getUserId,
    removeMemberId,
    setFpUserDetailsId,
    setMemberId,
    setUserId
} from '../../../../common_utilities';
import { CHATBOT_BASE_API_URL, CHATBOT_TOKEN_PASSWORD, CHATBOT_TOKEN_USERNAME, GATEWAY_AUTH_NAME } from "../../../../constants";
import OverviewCharts from "../../views/AccountBalance/OverviewCharts";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import { fetchTrackedBankDetails as fetchTrackedBankDetailsFun, analysePastData as analysePastDataFun, autoUpdateAccountTransactions } from "../../../../FrappeIntegration-Services/services/money-management-api/moneyManagementService";


const MyDashBoard = () => {
    const pdfURL = 'Snippet.pdf';
    const navigate = useNavigate();
    const [hiddenStates, setHiddenStates] = useState([]);
    const [page, setPage] = useState(1);
    const dispatch = useDispatch();
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [fileUrl, setFileUrl] = useState(null);
    const [callBackId, setCallBackId] = useState(null);
    const [containerHeight, setContainerHeight] = useState(500);
    const [showDownloadView, setShowDownloadView] = useState(false)
    const [totalBankAcc, setTotalBankAcc] = useState(0);
    const [totalBankbalance, setTotalBankBalance] = useState(0);
    const [allAccountNo, setAllAccountNo] = useState(null);
    const [allLastUpdatedDates, setAllLastUpdatedDates] = useState([]);
    const bankIdDetails = useSelector((state) => state.bankIdDetails);
    const linkedAccountData = useSelector((state) => state.linkedAccountData);
    const [dashboardData, setDashboardData] = useState("");
    const [currentUserIds, setCurrentUserIds] = useState([]);

    const syncBtnRef = useRef(null)
    let total_bank_acc = 0;
    let totalBalance = 0;
    let accountNumbers = [];
    let accountLastUpdatedDates = [];
    let user_details = [];


    // const { data } = props.location.state;
    const statementAccountsData = useSelector((state) => state.statementAccountsData);
    const userDetails = useSelector((state) => state.userDetails);
    const customerInfoData = useSelector((state) => state.customerInfoData);
    const handleLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };
    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    let users = JSON.parse(commonEncode.decrypt(localStorage.getItem("member")));
    const call_id = users[0].id;
    let accountNoList;
    // let file_url;

    // if (statementAccountsData.length === 1) {
    // const singleAccount = statementAccountsData[0];
    // accountNoList = [singleAccount.accountNo];
    // } else {
    // accountNoList = statementAccountsData.map(account => account.accountNo);
    // }

    const getMemberIdFn = () => {
        let isFamilySelected = Boolean(localStorage.getItem("family"));
        if (!isFamilySelected) {
            const userId = getUserId();
            const userIdArray = [userId];
            return userIdArray;
        } else {
            let users = JSON.parse(commonEncode.decrypt(localStorage.getItem("member")));
            const idsArray = users.map(item => String(item.id));
            return idsArray;
        }
    };

    const analysePastData = async (bank_acc) => {
        // const call_id = await getCallbackId();
        // myHeaders.append("gatewayauthtoken", 'Token '+tkn);
        // myHeaders.append("gatewayauthname", GATEWAY_AUTH_NAME);
        const payload = {
            analysis_months: 6,
            analyse_mode: 1,
            pdf_snippet: 1,
            dependents: 2,
            earning_members: 1,
            bank_accounts: bank_acc,
            user_id: call_id
        };
        // myHeaders.append("Content-Type", "application/json");
        // myHeaders.append("Cookie", "AWSALBTG=VmwGpjloOZHqm4zYwwgrhQHBFqgjHSadlnkk3pDv2VHCrOFU76lUNk3jvnw2J18jV4XbJnqGSOz80EIcr/iuY3e7RusDT2z5wK+pQ768CDlWOIIAjWkuVSatFsU8WKYhNR7V7TAJIR7Kmc2FcpsYP/iq+TP5rGPWnuCGQS5wqzXV; AWSALBTGCORS=VmwGpjloOZHqm4zYwwgrhQHBFqgjHSadlnkk3pDv2VHCrOFU76lUNk3jvnw2J18jV4XbJnqGSOz80EIcr/iuY3e7RusDT2z5wK+pQ768CDlWOIIAjWkuVSatFsU8WKYhNR7V7TAJIR7Kmc2FcpsYP/iq+TP5rGPWnuCGQS5wqzXV");
        try {

            const result = await analysePastDataFun(payload);
            if (result.status_code == 200) {
                const pdf_url = result.data.pdf_snippet_wa;
                // file_url = pdf_url;
                return pdf_url;
            } else {
                throw new Error('Failed to AnalysePastData');
            }
        } catch (error) {
            console.error('Error AnalysePastData:', error);
        }


    };

    const handleOpenEyeClick = async () => {
        try {
            setShowDownloadView(true);
            const file_url = await analysePastData(accountNoList);
            // Proceed with the code that needs to execute after analysePastData completes successfully
            // For example:
            // Update the state with the file URL
            setFileUrl(file_url);
        } catch (error) {
            console.error('Error occurred during analysePastData:', error);
            // Handle errors if necessary
        }
    };

    const handleSyncNowClick = async () => {
        syncBtnRef.current.classList.add(Styles.syncBtn);
        user_details = getMemberIdFn();
        setCurrentUserIds(user_details);
        var myHeaders = new Headers();
        const payload = {
            user_ids: user_details
        };
        try {
            autoUpdateAccountTransactions(payload).then(async result => {
                if (result["status_code"] == 200) {
                    // const result = await response.json();

                    if (result["data"].length == 0) {
                        toastr.options.positionClass = "toast-bottom-left";
                        toastr.success("Data already fetched");
                        syncBtnRef.current.classList.remove(Styles.syncBtn);
                        return;
                    }
                    const payload = {
                        "user_id": user_details
                    };
                    try {
                        const result = await fetchTrackedBankDetailsFun(payload);
                        if (result["status_code"] == 200) {
                            // const result = await response.json();
                            const filteredAccounts = result["data"];
                            dispatch({ type: "SET_LINKED_ACCOUNT_DATA", payload: filteredAccounts });
                            // if (result.error_code === "100") {
                            if (result["data"].length === 0) {
                                navigate('/commondashboard');
                            }
                            let totalBalance = 0;
                            const accountNumbers = [];
                            const accountLastUpdatedDates = [];
                            result["data"].forEach(account => {
                                const balance = account.mm_total_balance;
                                totalBalance += balance;
                                accountNumbers.push(account.mm_account_masked_id);
                                accountLastUpdatedDates.push(account.modified);
                            });
                            setTotalBankBalance(totalBalance);
                            setDashboardData(filteredAccounts);
                            setAllAccountNo(accountNumbers);
                            setAllLastUpdatedDates(accountLastUpdatedDates);
                            syncBtnRef.current.classList.remove(Styles.syncBtn);

                            toastr.options.positionClass = "toast-bottom-left";
                            toastr.success("Sync completed!");
                            // } else {
                            //     navigate('/commondashboard');
                            // }
                        } else {
                            syncBtnRef.current.classList.remove(Styles.syncBtn);
                        }
                    } catch (error) {
                        syncBtnRef.current.classList.remove(Styles.syncBtn);
                        console.error('Error fetching data:', error);
                    }

                } else {
                    syncBtnRef.current.classList.remove(Styles.syncBtn);
                }
            })
                .catch(error => {
                    syncBtnRef.current.classList.remove(Styles.syncBtn);
                    console.error('Error occurred:', error);
                });
        } catch (error) {
            syncBtnRef.current.classList.remove(Styles.syncBtn);
            console.error('Error occurred:', error);
        }
    };



    // const generatePdfUrl = async (accountNoList) => {
    //     try {
    //       // Fetch or generate PDF binary data based on account numbers
    //       const pdfData = await analysePastData(accountNoList);

    //       // Convert the binary data to a data URL
    //       const dataUrl = `data:application/pdf;base64,${btoa(String.fromCharCode.apply(null, new Uint8Array(pdfData)))}`;

    //       return dataUrl;
    //     } catch (error) {
    //       console.error('Error generating PDF data:', error);
    //       return null;
    //     }
    //   };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    // const file_url_data = analysePastData(accountNoList);
    const iframeStyle = {
        width: '100%',
        height: '100vh', // Set the height to fill the viewport
        border: 'none',
    };

    function handleNavigation(accountDetails) {
        navigate('/money-management/dashboard', { state: { accountNoList: [accountDetails] } });
    }

    function handleNavigationTrackAccount() {
        // navigate('/money-management/track-bank-account');
        window.location.href = `${process.env.PUBLIC_URL}/money-management/bank-tracking-overview`

    }

    function handleNavigationMainDashboard() {
        navigate('/commondashboard');
    }


    const getHiddenAmount = (totalBankbalance) => {
        if (hiddenStates) {
            return '******';
        } else {
            const currentBal = indianRupeeFormat(totalBankbalance);
            const currentBalWithoutRupee = currentBal.replace('₹', '');
            // currentBal.replace("₹ ", "");
            return currentBalWithoutRupee; // Display actual balance when not hidden
        }
    };

    const handleToggle = () => {
        setHiddenStates(!hiddenStates); // Toggle the boolean value
    };

    // const getLatestLastUpdatedDate = (UpdatedDateList) => {
    //     // Convert the strings to Date objects
    //     const dateObjects = UpdatedDateList.map(dateString => new Date(dateString));

    //     // Find the maximum date
    //     const latestDate = new Date(Math.max(...dateObjects));

    //     // Return a formatted date string
    //     return latestDate.toLocaleString(); // Adjust the formatting as needed
    // };

    const getLatestLastUpdatedDate = (UpdatedDateList) => {
        // Convert the strings to Date objects
        const dateObjects = UpdatedDateList.map(dateString => new Date(dateString));

        // Find the maximum date
        const latestDate = new Date(Math.max(...dateObjects));

        // Format the latest date
        const formattedLatestDate = lastupdatedDate(latestDate);

        return formattedLatestDate;
    };

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






    useEffect(() => {
        user_details = getMemberIdFn();
        setCurrentUserIds(user_details);
        const FetchTrackedBankDetails = async () => {
            // myHeaders.append("gatewayauthtoken", 'Token '+tkn);
            // myHeaders.append("gatewayauthname", GATEWAY_AUTH_NAME);
            const payload = {
                "user_id": user_details
            };
            try {
                const result = await fetchTrackedBankDetailsFun(payload);
                if (result["status_code"] == 200) {
                    const filteredAccounts = result.data;
                    dispatch({ type: "SET_LINKED_ACCOUNT_DATA", payload: filteredAccounts });
                    // if (result.error_code === "100") {
                    if (result.data.length === 0) {
                        navigate('/commondashboard');
                    }
                    setTotalBankAcc(result.data.length);
                    result.data.forEach(account => {
                        // Check if account.currentBalance is a valid number
                        const balance = account.mm_total_balance;
                        totalBalance += balance;
                        accountNumbers.push(account.mm_account_masked_id);
                        accountLastUpdatedDates.push(account.modified);

                    });
                    setTotalBankBalance(totalBalance);
                    setDashboardData(filteredAccounts);
                    setAllAccountNo(accountNumbers);
                    setAllLastUpdatedDates(accountLastUpdatedDates);

                    // } else {
                    //     navigate('/commondashboard');
                    // }

                } else {
                    navigate('/commondashboard');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        // FetchTrackedBankDetails();

        const processData = async () => {
            try {
                await FetchTrackedBankDetails();
            } catch (error) {
                console.error('Error:', error);
            }
        };

        processData();
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@2.8.335/build/pdf.worker.min.js`;
        const updateContainerHeight = () => {
            // Adjust the height based on the screen width
            const newHeight = window.innerWidth < 768 ? 500 : 2000;
            setContainerHeight(newHeight);
        };

        // Initial adjustment
        updateContainerHeight();

        // Listen for window resize events
        window.addEventListener('resize', updateContainerHeight);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('resize', updateContainerHeight);
        };
    }, []);
    // const TotalBal = 133332.21;

    return (
        <>
            <div className={`${Styles.MyAccountBalanceView}`}>
                <div className="d-flex ">
                    <div>
                        <img width={11} className='pointer' src={`${process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/Back.png"}`} alt="Back-button" onClick={() => handleNavigationMainDashboard()} />
                    </div>
                    <div className={`ms-3 ${Styles.title}`}>Dashboard</div>
                </div>
                <div className="mt-4">
                    <div className={`${Styles.AccBalancebox}`}>
                        <div className={`${Styles.AccBalanceboxContainer}`}>
                            <div>
                                <div className="d-flex align-items-center">
                                    <div className={`${Styles.primaryTxt}`}>{totalBankAcc} Bank Accounts</div>
                                </div>
                                <div style={{ paddingTop: ".7rem" }} className={`${Styles.secondaryTxt}`}>Total Balance</div>
                            </div>
                            <div className="d-flex">
                                <div>
                                    <div className={`${Styles.primaryTxt}`}>As of {getLatestLastUpdatedDate(allLastUpdatedDates)}</div>
                                    <div style={{ paddingTop: '.3rem' }} className="d-flex align-items-center">
                                        <div className={`${Styles.secondaryTxt}`}>₹ {getHiddenAmount(totalBankbalance)}</div>
                                        <div className="ms-3 pt-1">
                                            <img
                                                className='pointer'
                                                onClick={() => {
                                                    handleToggle();
                                                }}
                                                src={`${process.env.REACT_APP_STATIC_URL}media/MoneyManagement/${hiddenStates ? 'ph_eye-closed-duotone.svg' : 'OpenEye.svg'}`}
                                                alt={hiddenStates ? 'Close View' : 'Open View'}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                <div ref={syncBtnRef} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#042b62', borderRadius: '30px', color: 'white', padding: '0.3rem 0.8rem', cursor: 'pointer', fontSize: '1.1rem' }} onClick={handleSyncNowClick}>
                                    <i className={`fa-solid fa-rotate ${Styles.rotateAnimetion}`}></i> Sync Now
                                </div>
                            </div>
                        </div>
                        <div>
                            {allAccountNo && allAccountNo.length > 0 ? (
                                <div className={`${Styles.buttonsBox}`}>
                                    <button onClick={() => handleNavigationTrackAccount()}>+ Track another bank account</button>
                                    <button onClick={() => handleNavigation(allAccountNo)}>View overall report</button>
                                </div>
                            ) : (
                                <div></div>
                            )}
                        </div>

                    </div>
                    <div style={{ borderBottom: '1px solid #C1C1C1', padding: "1rem 0" }}></div>
                    {showDownloadView && (
                        <div>
                            <div className={`${Styles.downloadview}`}>
                                <div className={`${Styles.Headtitle}`}>
                                    Your money management report is ready to download
                                </div>
                                <div className={`${Styles.ButtonBox}`}>
                                    <button className="d-flex align-items-center">
                                        <span>Download now</span>
                                        <span>
                                            <img width={30} className='pointer ms-2' src={`${process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/Download.svg"}`} alt="Download" />
                                        </span>
                                    </button>
                                    <button className="d-flex align-items-center">
                                        <span>Send on Email</span>
                                        <span>
                                            <img width={30} className='pointer ms-2' src={`${process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/Mail.svg"}`} alt="Mail" />
                                        </span>
                                    </button>
                                    <button className="d-flex align-items-center"><span>Send on WhatsApp</span>
                                        <span>
                                            <img width={30} className='pointer ms-2' src={`${process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/WP.svg"}`} alt="WhatsApp" />
                                        </span> </button>
                                </div>
                            </div>
                            {fileUrl && (
                                <div style={{ height: containerHeight }} className="w-100 mt-5 pdfView">
                                    <Worker workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`}>
                                        <Viewer fileUrl={fileUrl} onLoadSuccess={handleLoadSuccess} />
                                    </Worker>
                                    {/* <div> */}


                                    {/* <iframe
                                    title="PDF Viewer"
                                    src={`https://docs.google.com/gview?url=${fileUrl}&embedded=true`}
                                    style={iframeStyle}
                                ></iframe> */}
                                    {/* <object
                                    data={fileUrl}
                                    type="application/pdf"
                                    width="100%"
                                    height={containerHeight}
                                ></object> */}

                                    {/* </div> */}
                                </div>
                            )}
                        </div>
                    )}
                    <div>
                        {dashboardData ? (
                            <div>
                                <div className={`${Styles.dashboardInfoDataContainer}`} >
                                    <div className={`${Styles.OverviewChartsContainer}`} >
                                        <OverviewCharts />
                                    </div>
                                    {/* <div className={`${Styles.OverviewActiveAccountsContainer}`} style={{ backgroundImage: `url(${process.env.REACT_APP_STATIC_URL}media/MoneyManagement/overviewBg.svg)`, minHeight: '360px' }}> */}
                                    <div className={`${Styles.OverviewActiveAccountsContainer}`} style={{ minHeight: '360px' }}>
                                        <div className={`${Styles.OverviewActiveContentContainer}`}>
                                            <div className={`${Styles.RobbonElem}`}>
                                                Coming soon!
                                                <img
                                                    className={`${Styles.RobbonElemPoint}`}
                                                    src={`${process.env.REACT_APP_STATIC_URL}media/MoneyManagement/rArrow.svg`}
                                                />
                                            </div>
                                            <br />
                                            <div className={`${Styles.OverviewActiveContentTxt}`}>
                                                Creating a budget is a roadmap to financial journey which helps you to track and manage your income an expenses. Don't miss out!
                                            </div>
                                        </div>

                                        <div className={`${Styles.OverviewActiveAccountsContainerBg}`}>
                                            <img
                                                style={{ height: '100%' }}
                                                src={`${process.env.REACT_APP_STATIC_URL}media/MoneyManagement/overviewBg.svg`}
                                            />
                                        </div>

                                    </div>
                                </div>
                                <div style={{ paddingTop: '1.5rem' }}>
                                    <ActiveAccounts />
                                </div>

                            </div>

                        ) : (
                            <div></div>
                        )}

                        {/* Here to put code */}
                    </div>
                </div>

            </div>

        </>
    );
};
export default MyDashBoard;
