import React, { useCallback, useEffect, useRef, useState } from "react";
import style from '../../style.module.css';
import Styles from '../../moneymanagement.module.css';
import Snippet from "./Snippet";
import ActiveAccounts from "../../views/AccountBalance/ActiveAccounts";
import testpdf from "./Snippet.pdf"
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Document, Page, pdfjs } from 'react-pdf';
// import "react-pdf/dist/esm/Page/TextLayer.css";

import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { apiCall, indianRupeeFormat } from "../../../../common_utilities"
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { useLocation } from 'react-router-dom';
import commonEncode from "../../../../commonEncode";
import { Link, useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import * as toastr from "toastr";
import {
    getMemberId,
    getUserId,
    removeMemberId,
    setFpUserDetailsId,
    setMemberId,
    setUserId,
    getParentUserId
} from '../../../../common_utilities';
import { CHATBOT_BASE_API_URL, CHATBOT_TOKEN_PASSWORD, CHATBOT_TOKEN_USERNAME, FINTOO_BASE_API_URL, GATEWAY_AUTH_NAME } from "../../../../constants";
import { Row, Modal } from "react-bootstrap";
import FintooInlineLoader, { CircularProgressBar, FintooLogoLoader } from "../../../../components/FintooInlineLoader";
import { useViewCheckOnce } from "../../../../Utils/Hooks/UseViewCheck";
import MonthPicker from "../MonthPicker";
import { res } from "react-email-validator";
import { fetchTrackedBankDetails, analysePastData as analysePastDataFun, getDependentEarningCount as getDependentEarningCountFun } from "../../../../FrappeIntegration-Services/services/money-management-api/moneyManagementService";
import moment from "moment";
import { SendEmail, SendWsappMsg } from "../../../../FrappeIntegration-Services/services/financial-planning-api/ndaflow";


function formatDateToMMYYYY(dateString) {
    const date = new Date(dateString);

    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedMonth}${year}`;
}

const MyAccountBalance = () => {

    const location = useLocation();
    const { state } = location;
    const navigate = useNavigate();
    // const { accountDetails, allAccountDetails } = state;
    if (!state || !state.accountNoList) {
        navigate('/money-management/overview');
        return null;
    }

    let { accountNoList } = state;

    // const { accountDetails, allAccountDetails} = state;


    const pdfURL = 'Snippet.pdf';
    const [page, setPage] = useState(1);
    const dispatch = useDispatch();
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [fileUrl, setFileUrl] = useState(null);
    const [downloadPdf, setDownloadPdf] = useState(null);
    const [wsappPdf, setWsappPdf] = useState(null);
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [token, setToken] = useState(null);
    const [callBackId, setCallBackId] = useState(null);
    const [containerHeight, setContainerHeight] = useState(500);
    const [showDownloadView, setShowDownloadView] = useState(false)
    const [totalBankAcc, setTotalBankAcc] = useState(0);
    const [totalBankbalance, setTotalBankBalance] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [dashboardData, setDashboardData] = useState("");
    useEffect(() => {
    }, [dashboardData])
    const [hiddenStates, setHiddenStates] = useState([]);
    const [accData, setAccData] = useState(null);
    const bankIdDetails = useSelector((state) => state.bankIdDetails);
    const linkedAccountData = useSelector((state) => state.linkedAccountData);
    const [currentUserIds, setCurrentUserIds] = useState([]);
    const [userContactNo, setUserContactNo] = useState([]);
    const [errorUrl, setErrorUrl] = useState(false);
    const [displayFlag, setDisplayFlag] = useState(false);
    const [feedbackReaction, setFeedbackReaction] = useState(null);
    // const [hasFeedbackData, setHasFeedbackData] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [monthFilter, setMonthFilter] = useState(null);

    const [dependentEarningCount, setDependentEarningCount] = useState(
        {
            dependents: 0,
            earning_members: 1
        }
    );

    const [filterData, setFilterData] = useState({
        startDate: null,
        endDate: new Date(),
        // minDate: new Date()
        minDate: null
    })

    const [isOpen, setIsOpen] = useState(false);

    const feedbackCheck = useRef({
        hasFeedBack: true,
        scrolledToBottom: false
    });

    useEffect(() => {
        //console.log('filterDatafilterData', filterData)
    }, [filterData])

    let total_bank_acc = 0;
    let totalBalance = 0;
    let user_details = [];
    let pdf_download_url = "";
    // let dependents = 0;
    // let earning_members = 1;

    const statementAccountsData = useSelector((state) => state.statementAccountsData);
    const userDetails = useSelector((state) => state.userDetails);
    const customerInfoData = useSelector((state) => state.customerInfoData);
    const handleLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    function findSmallestMonthDifference(data) {
        function monthDiff(dateFrom) {
            const now = new Date();
            const yearDiff = now.getFullYear() - dateFrom.getFullYear();
            const monthDiff = now.getMonth() - dateFrom.getMonth();
            const totalMonthDiff = yearDiff * 12 + monthDiff + (now.getDate() < dateFrom.getDate() ? -1 : 0);
            return Math.abs(totalMonthDiff);
        }

        let monthDifferences = data.map(item => {
            const dateFrom = new Date(item.mm_daterange_from);
            return monthDiff(dateFrom);
        });

        const smallestMonthDiff = Math.max(...monthDifferences);
        return [smallestMonthDiff, data[0].mm_daterange_from];
    }

    const monthOptions = [];
    for (let i = 1; i <= monthFilter; i++) {
        monthOptions.push(
            <option key={i} value={i}>{`Past ${i} Month${i > 1 ? 's' : ''}`}</option>
        );
    }

    const FetchTrackedBankDetailsFun = async () => {
        var myHeaders = new Headers();
        const payload = {
            user_id: user_details
        };
        try {
            const result = await fetchTrackedBankDetails(payload);
            if (result.status_code == 200) {
                // const result = await response.json();

                // if (result.error_code === "100") {

                let filteredAccounts = result.data.filter(account => accountNoList[0].includes(account.mm_account_masked_id));

                if (filteredAccounts.length === 0) {
                    const fetched_masked_ids = result.data.map((item) => item.mm_account_masked_id);
                    accountNoList = [fetched_masked_ids];

                    filteredAccounts = result.data;
                }

                const calculatedMonthFilter = findSmallestMonthDifference(filteredAccounts);

                const newMonthFilter = Math.min(calculatedMonthFilter[0], 3);

                if (newMonthFilter != monthFilter) {
                    setSelectedMonth(newMonthFilter);
                    setMonthFilter(newMonthFilter);
                }

                if (filteredAccounts.length === 1) {
                    setCurrentUserIds(filteredAccounts[0].mm_user_id);
                    user_details = filteredAccounts[0].mm_user_id;
                } else if (filteredAccounts.length === 0) {
                    navigate('/money-management/overview');
                }

                setDashboardData(filteredAccounts);

                setFilterData((prev) => ({ ...prev, minDate: new Date(calculatedMonthFilter[1]), startDate: new Date(calculatedMonthFilter[1]) }));

                return new Date(calculatedMonthFilter[1]);

                // } else {
                //     navigate('/money-management/overview');
                // }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleAnalysePastData = async (accountNoList, minimumDate, endDate, dependents, earning_members) => {
        if (endDate == null) return;
        const file_url = await analysePastData(accountNoList[0], minimumDate, endDate, dependents, earning_members);
        setDisplayFlag(true);
        if (file_url != false) {
            setFileUrl(file_url);
            setErrorUrl(false)
        } else {
            setFileUrl(false)
            setErrorUrl(true);
        }
    }


    const analysePastData = async (bank_acc, minimumDate, endDate, dependents, earning_members) => {
        setIsLoading(true);

        var myHeaders = new Headers();

        const payload = {
            // "analysis_months": parseInt(selectedMonth),
            pdf_snippet: 1,
            dependents: dependents,
            earning_members: earning_members,
            bank_accounts: bank_acc,
            // "user_id": user_details,
            user_id: getMemberIdFn(),
            // "fromDate": formatDateToMMYYYY(filterData.minDate),
            fromDate: formatDateToMMYYYY(minimumDate),
            toDate: formatDateToMMYYYY(endDate)
        };
        myHeaders.append("Content-Type", "application/json");
        // myHeaders.append("Cookie", "AWSALBTG=VmwGpjloOZHqm4zYwwgrhQHBFqgjHSadlnkk3pDv2VHCrOFU76lUNk3jvnw2J18jV4XbJnqGSOz80EIcr/iuY3e7RusDT2z5wK+pQ768CDlWOIIAjWkuVSatFsU8WKYhNR7V7TAJIR7Kmc2FcpsYP/iq+TP5rGPWnuCGQS5wqzXV; AWSALBTGCORS=VmwGpjloOZHqm4zYwwgrhQHBFqgjHSadlnkk3pDv2VHCrOFU76lUNk3jvnw2J18jV4XbJnqGSOz80EIcr/iuY3e7RusDT2z5wK+pQ768CDlWOIIAjWkuVSatFsU8WKYhNR7V7TAJIR7Kmc2FcpsYP/iq+TP5rGPWnuCGQS5wqzXV");
        try {
            const result = await analysePastDataFun(payload);
            if (result.status_code == "200") {
                // const result = await response.json();
                // if (result.error_code === "100") {
                const pdf_url = result.data.pdf_snippet_wa;
                const download_pdf = result.data.pdf_snippet;
                setDownloadPdf(download_pdf);
                pdf_download_url = download_pdf;
                setWsappPdf(pdf_url);
                // setUsername(result.data.customer_name);
                // file_url = pdf_url;
                // setFileUrl(pdf_url);
                setIsLoading(false);
                return pdf_url ? pdf_url : false;
            } else {
                setIsLoading(false);
                return false;
            }
        } catch (error) {
            console.error('Error AnalysePastData:', error);
        }


    };


    const getDependentEarningCount = async (parentId) => {
        var myHeaders = new Headers();
        const payload = {
            user_id: parentId
        };
        myHeaders.append("Content-Type", "application/json");
        try {
            const result = await getDependentEarningCountFun(payload);
            if (result.status_code == 200) {
                // const result = await response.json();
                // dependents = result.data.dependent;
                // earning_members = result.data.earning;

                setDependentEarningCount({ dependents: result.data.dependent, earning_members: result.data.earning });

                return [result.data.dependent, result.data.earning];
            } else {
                throw new Error('getDependentEarningCount error');
            }
        } catch (error) {
            console.error('Error getDependentEarningCount:', error);
        }
    };

    const SendWsappMsgFile = async () => {
        // var myHeaders = new Headers();
        // myHeaders.append("gatewayauthtoken", 'Token ' + tkn);
        // myHeaders.append("gatewayauthname", GATEWAY_AUTH_NAME);
        const payload = {
            "mobile": userContactNo,
            "whatsapp_msg": "Dear " + username + ", Thank you for trusting us with your Money Management queries. We hope you got all the answers. Stay connected and #AskFintoo any of your finance queries. We will be happy to chat with you again. Please download the attached PDF. Team Fintoo",
            "whatsapp_file_msg": "Fintoo Snippets- Expense Snapshot.pdf",
            "file_name": "Expense Snapshot",
            "file_path": wsappPdf
        };
        try {
            // const response = await fetch(FINTOO_BASE_API_URL + "restapi/sendwhatsappmsgandfile/", {
            //     method: 'POST',
            //     // headers: myHeaders,
            //     body: JSON.stringify(payload),
            // });
            const result = await SendWsappMsg(payload)
            // const result = await response.json();
            if (result.status_code === "200") {
                toastr.options.positionClass = "toast-bottom-left";
                toastr.success("Expense Snapshot shared on your WhatsApp!");
            } else {
                toastr.options.positionClass = "toast-bottom-left";
                toastr.error("Error: Failed to send an Expense Snapshot on WhatsApp.");
            }
        } catch (error) {
            console.error('Error AnalysePastData:', error);
        }


    };

    const SendMailFile = async () => {
        // var myHeaders = new Headers();
        // myHeaders.append("gatewayauthtoken", 'Token ' + tkn);
        // myHeaders.append("gatewayauthname", GATEWAY_AUTH_NAME);
        const payload = {
            "userdata": { "to": email },
            "subject": "Expense Snapshot for " + username,
            "template": "moneymanagement_thanks.html",
            "attachment": downloadPdf,
            "contextvar": { "fullname": username, "attachment_name": "Expense Snapshot" }
        };

        try {
            // const response = await fetch(FINTOO_BASE_API_URL + "restapi/sendmail/", {
            //     method: 'POST',
            //     // headers: myHeaders,
            //     body: JSON.stringify(payload),
            // });
            const result = await SendEmail(payload);
            // const result = await response.json();
            if (result.status_code === "200") {
                toastr.options.positionClass = "toast-bottom-left";
                toastr.success("Expense Snapshot shared on your Email!");
            } else {
                toastr.options.positionClass = "toast-bottom-left";
                toastr.error("Error: Failed to send an Expense Snapshot on Email.");
            }
        } catch (error) {
            console.error('Error AnalysePastData:', error);
        }
    };

    function handleNavigation() {
        navigate('/money-management/overview');
    }

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages - 1);
    };

    // const file_url_data = analysePastData(accountNoList);
    const iframeStyle = {
        width: '100%',
        height: '100vh', // Set the height to fill the viewport
        border: 'none',
    };

    // const handleDownloadClick = () => {
    //     const link = document.createElement('a');
    //     link.href = downloadPdf;
    //     link.download = 'IncomeExpenseAnalysis';

    //     // Trigger the click event of the anchor element
    //     document.body.appendChild(link);
    //     link.click();

    //     // Clean up: remove the anchor element from the document body
    //     document.body.removeChild(link);
    // };

    const handleDownloadClick = async () => {
        if (!downloadPdf) return;

        try {
            const response = await fetch(downloadPdf, { mode: "cors" });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "IncomeExpenseAnalysis.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
        }
    };




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

    useEffect(() => {
        if (filterData.endDate == null) return;

        user_details = getMemberIdFn();

        if (user_details[0] === null) return;

        setCurrentUserIds(user_details);
        let parentId = getParentUserId();

        const user_data = JSON.parse(commonEncode.decrypt(localStorage.getItem("member")));
        // const user_data = JSON.parse(commonEncode.decrypt(localStorage.getItem("allMemberUser")));


        const get_email_data = user_data.filter(item => item.parent_user_id === 0);
        const get_username_data = user_data.filter(item => item.id == user_details[0]);

        if (get_username_data.length != 0 && get_username_data[0].name) {
            if (get_username_data[0].email && get_username_data[0].mobile) {
                setEmail(get_username_data[0].email);
                setUsername(get_username_data[0].name);
                setUserContactNo(get_username_data[0].mobile);
            } else if (get_username_data[0].email) {
                setEmail(get_username_data[0].email);
                setUsername(get_username_data[0].name);
                setUserContactNo(get_email_data[0].mobile);
            } else if (get_username_data[0].mobile) {
                setEmail(get_email_data[0].email);
                setUsername(get_username_data[0].name);
                setUserContactNo(get_username_data[0].mobile);
            } else {
                setEmail(get_email_data[0].email);
                setUsername(get_username_data[0].name);
                setUserContactNo(get_email_data[0].mobile);
            }
        } else {

            const user_data2 = JSON.parse(commonEncode.decrypt(localStorage.getItem("allMemberUser")));
            const get_email_data2 = user_data2.filter(item => item.parent_user_id === 0);
            const get_username_data2 = user_data2.filter(item => item.id == user_details[0]);

            setEmail(get_email_data2[0].email);
            setUsername(get_username_data2[0].name);
            setUserContactNo(get_email_data2[0].mobile);
        }

        if (filterData.endDate == null) return;

        const processData = async () => {
            try {
                const minimumDate = await FetchTrackedBankDetailsFun();
                const result = await getDependentEarningCount(parentId);

                // if (selectedMonth != null) {
                // const file_url = await analysePastData(accountNoList[0], minimumDate);
                // setDisplayFlag(true);
                // if (file_url != false) {
                //     setFileUrl(file_url);
                //     setErrorUrl(false)
                // } else {
                //     setFileUrl(false)
                //     setErrorUrl(true);
                // }

                await handleAnalysePastData(accountNoList, minimumDate, filterData.endDate, result[0], result[1]);
                // }

            } catch (error) {
                console.error('Error:', error);
            }
        };

        processData();

        const updateContainerHeight = () => {
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
        // }, [selectedMonth]);
    }, []);

    //pdfjs.GlobalWorkerOptions.workerSrc = new URL(`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`, import.meta.url).toString();
    useEffect(() => {
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    }, []);

    useEffect(() => {
        getFeeddbackData()
    }, [])

    useEffect(() => {
        if (monthFilter > 0) {
            setSelectedMonth(monthFilter);
        }
    }, [monthFilter]);

    const getFeeddbackData = async () => {
        // try {
        //     const response = await apiCall(
        //         FINTOO_BASE_API_URL + `money_managment/feature_feedback/?user_id=${getUserId()}&module_name=Money Management`,
        //         false,
        //         false
        //     )

        //     if (response.data.length > 0) {
        //         feedbackCheck.current = { ...feedbackCheck.current, hasFeedBack: true }
        //     } else {
        //         feedbackCheck.current = { ...feedbackCheck.current, hasFeedBack: false }
        //         if (feedbackCheck.current.scrolledToBottom) {
        //             setTimeout(() => {
        //                 setShowFeedback(true)
        //             }, 3000);
        //         }
        //     }

        // } catch (error) {
        //     console.log(error)
        // }
    }

    const setFeeddbackData = async () => {
        if (!feedbackReaction) return;
        // try {
        //     const response = await apiCall(
        //         FINTOO_BASE_API_URL + `money_managment/feature_feedback/`,
        //         {
        //             "ff_name": "Money Management",
        //             "user_id": Number(getUserId()),
        //             "ff_rating": feedbackReaction,
        //             "ff_remarks": ""
        //         },
        //         false,
        //         false
        //     )
        //     setShowFeedback(false)
        // } catch (error) {
        //     console.log(error)
        // }
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------

    const pdfElementRef = useRef(null);

    const handleScroll = useCallback(() => {
        const element = pdfElementRef.current;
        if (element) {
            const { bottom } = element.getBoundingClientRect();
            const isAtBottom = Math.ceil(bottom + 50) <= Math.ceil(window.innerHeight);
            if (isAtBottom && !feedbackCheck.current.scrolledToBottom) {
                onScrollToBottom();
            }
        }
    }, [feedbackCheck]);

    const onScrollToBottom = () => {
        feedbackCheck.current = { ...feedbackCheck.current, scrolledToBottom: true }
        if (!feedbackCheck.current.hasFeedBack) {
            setTimeout(() => { setShowFeedback(true) }, 3000)
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    return (
        <>
            <div className={`${Styles.MyAccountBalanceView}`}>
                <div className="d-flex justify-content-between align-items-center">
                    {/* Left side */}
                    <div className="d-flex align-items-center">
                        <img
                            width={11}
                            className="pointer"
                            src={`${process.env.REACT_APP_STATIC_URL}media/MoneyManagement/Back.png`}
                            alt="Back-button"
                            onClick={handleNavigation}
                        />
                        <div className={`ms-3 ${Styles.title}`}>Overview</div>
                    </div>
                </div>

                <div className="ms-md-4 mt-4">
                    {dashboardData && dashboardData.length === 1 ? (
                        <div>
                            {dashboardData.map((account, index) => (
                                <div className={`${Styles.AccBalancebox}`} key={index}>
                                    <div className="d-flex">
                                        <div>
                                            <div className="d-flex align-items-center">
                                                <div>
                                                    <img width={30} className='pointer' src={`${process.env.REACT_APP_STATIC_URL + "media/bank_logo/" + account.mm_bank_logo}`} alt={account.mm_fip_name} />
                                                </div>
                                                <div className={`ms-2 ${Styles.primaryTxt}`}>{account.mm_fip_name}</div>
                                            </div>
                                            <div style={{ paddingTop: ".7rem" }} className={`${Styles.secondaryTxt}`}>Total Balance</div>
                                        </div>
                                        <div className="d-flex ms-5">
                                            <div>
                                                {/* <div>
                                                    <div className={`${Styles.accountnumber}`}>A/c {account.mm_account_masked_id}</div>
                                                </div> */}
                                                <div className={`${Styles.primaryTxt}`}>As of  {moment(account.mm_last_updated).format("LL")}
                                                    {/* ?{lastupdatedDate(account.mm_last_updated)} */}
                                                </div>
                                                <div style={{ paddingTop: '.3rem' }} className="d-flex align-items-center">
                                                    <div className={`${Styles.secondaryTxt}`}>₹ {getHiddenAmount(account.mm_total_balance)}</div>
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
                                    </div>
                                    <div className="d-md-block d-none">
                                        <div className={`${Styles.primaryTxt}`}>Account No:-</div>
                                        <div style={{ paddingTop: '.7rem' }} className={`${Styles.secondaryTxt}`}>{account.mm_account_masked_id}</div>
                                    </div>
                                </div>
                            ))}
                            <div>
                                <div style={{ borderBottom: '1px solid #C1C1C1', padding: "1rem 0" }}></div>
                            </div>
                        </div>
                    ) : (
                        <div></div>
                    )}

                    {/* Download Section */}
                    {displayFlag && !isLoading ? (
                        <div>
                            {fileUrl && !errorUrl ? (
                                <div>
                                    <div className={`${Styles.downloadview}`}>
                                        <div className={`${Styles.Headtitle}`}>
                                            Your expense snapshot is ready to download
                                        </div>
                                        <div className={`${Styles.ButtonBox}`}>

                                            <MonthPicker
                                                onInputClick={() => setIsOpen(true)}
                                                // minDate={new Date("01-01-2021")}
                                                minDate={new Date(filterData.minDate)}
                                                maxDate={new Date()}
                                                onChange={(date) => {
                                                    // if (date[1] != undefined) {
                                                    setFilterData(prev => ({ ...prev, startDate: date[0], endDate: date[1] }));
                                                    handleAnalysePastData(accountNoList, date[0], date[1], dependentEarningCount.dependents, dependentEarningCount.earning_members);
                                                    if (date[1]) {
                                                        setIsOpen(false);
                                                    }
                                                    // }
                                                }}
                                                selected={filterData.startDate}
                                                selectsRange
                                                startDate={filterData.startDate}
                                                endDate={filterData.endDate}
                                                dateFormat="MM/yyyy"
                                                showMonthYearPicker
                                                open={isOpen}
                                            />

                                            <button title="Download" className="d-flex align-items-center" onClick={handleDownloadClick} style={{ padding: '0.5rem' }}>
                                                {/* <span>Download now</span> */}
                                                <span>
                                                    <img width={25} className='pointer' src={`${process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/Download.svg"}`} alt="Download" />
                                                </span>
                                            </button>
                                            <button title="Email" className="d-flex align-items-center" onClick={SendMailFile} style={{ padding: '0.5rem' }}>
                                                {/* <span>Send on Email</span> */}
                                                <span>
                                                    <img width={25} className='pointer' src={`${process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/Mail.svg"}`} alt="Mail" />
                                                </span>
                                            </button>
                                            <button title="WhatsApp" className="d-flex align-items-center" onClick={SendWsappMsgFile} style={{ padding: '0.5rem' }}>
                                                {/* <span>Send on WhatsApp</span> */}
                                                <span>
                                                    <img width={25} className='pointer' src={`${process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/WP.svg"}`} alt="WhatsApp" />
                                                </span>
                                            </button>
                                        </div>
                                    </div>

                                    <div ref={pdfElementRef} className={`mt-5 ${Styles.PdfContainerElem}`}>
                                        {/* <div className={`mt-5 ${Styles.PdfContainerElem}`}> */}
                                        <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess} onLoadError={console.error} >
                                            {Array.apply(null, Array(numPages))
                                                .map((x, i) => i + 1)
                                                .map(page => <Page pageNumber={page} renderAnnotationLayer={false} renderTextLayer={false} />)}
                                        </Document>
                                    </div>
                                    {/* {
                                        (numPages != null) && <ViewChecker />
                                    } */}

                                </div>
                            ) : (
                                <div>
                                    <div>
                                        <div>
                                            <br></br>
                                            <div style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 500 }}>
                                                ☹️ Sorry, We couldn't create your expense snapshot!
                                            </div>
                                        </div>
                                        <br></br>
                                        <div className={`${Styles.primaryTxt}`} style={{ textAlign: 'center' }}>
                                            It seems there are not enough transactions available for the selected month period.<br />Don't worry, you can explore other months or start making transactions to unlock valuable insights!
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <br />
                            <br />
                            <br />
                            <FintooLogoLoader message={'Please wait for few minutes as we are preparing your income expense snapshot.'} />
                            {/* <CircularProgressBar percentage={80} /> */}
                            <br />
                            <br />
                            <br />
                        </div>

                    )}


                    <Modal
                        className={`${style.moneyManagementModal}`}
                        dialogClassName={`${style.moneyManagementModalDialog}`}
                        centered
                        show={showFeedback}
                    >
                        <div style={{ padding: '1rem', position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                right: '10px',
                                top: '5px',
                                fontSize: '16px',
                                fontWeight: 600,
                                textAlign: 'center',
                                color: '#22A6E3',
                                cursor: 'pointer'
                            }}
                                onClick={() => setShowFeedback(false)}
                            >
                                X
                            </div>
                            <br />
                            <p style={{
                                fontSize: '18px',
                                fontWeight: 400,
                                textAlign: 'center',
                                color: '#8F8F8F'
                            }}>
                                Your opinion matters
                            </p>
                            <br />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 3rem' }}>
                                {
                                    feedbackReaction == 1 ? <img width={50} className='pointer' src={`${process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/reaction1_active.svg"}`} alt="reaction1" /> :
                                        <img width={50} className='pointer' src={`${process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/reaction1.svg"}`} alt="reaction1" onClick={() => setFeedbackReaction(1)} />
                                }
                                {
                                    feedbackReaction == 2 ? <img width={50} className='pointer' src={`${process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/reaction2_active.svg"}`} alt="reaction2" /> :
                                        <img width={50} className='pointer' src={`${process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/reaction2.svg"}`} alt="reaction2" onClick={() => setFeedbackReaction(2)} />
                                }
                                {
                                    feedbackReaction == 3 ? <img width={50} className='pointer' src={`${process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/reaction3_active.svg"}`} alt="reaction3" /> :
                                        <img width={50} className='pointer' src={`${process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/reaction3.svg"}`} alt="reaction3" onClick={() => setFeedbackReaction(3)} />
                                }
                                {
                                    feedbackReaction == 4 ? <img width={50} className='pointer' src={`${process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/reaction4_active.svg"}`} alt="reaction4" /> :
                                        <img width={50} className='pointer' src={`${process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/reaction4.svg"}`} alt="reaction4" onClick={() => setFeedbackReaction(4)} />
                                }
                                {
                                    feedbackReaction == 5 ? <img width={50} className='pointer' src={`${process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/reaction5_active.svg"}`} alt="reaction5" /> :
                                        <img width={50} className='pointer' src={`${process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/reaction5.svg"}`} alt="reaction5" onClick={() => setFeedbackReaction(5)} />
                                }
                            </div>

                            <br />
                            <p style={{
                                fontSize: '16px',
                                fontWeight: 600,
                                textAlign: 'center',
                                color: '#22A6E3'
                            }}>
                                How did you like our Money Management service?
                            </p>
                            <div className="d-flex justify-content-between gap-3" style={{ padding: '0 1rem' }}>
                                <div className={`${style.BtnStyle2}`} style={{ width: '45%' }} onClick={() => setShowFeedback(false)}>Later</div>
                                <div className={`${style.BtnStyle}`} style={{ width: '45%' }} onClick={() => setFeeddbackData()}>Submit</div>
                            </div>
                        </div>
                    </Modal>

                </div>
            </div>
        </>
    );
};
export default MyAccountBalance;
