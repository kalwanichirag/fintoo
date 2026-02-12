import React, { useEffect, useState } from 'react';
import CommonDashboardLayout from '../../../../components/Layout/Commomdashboard';
import style from '../../style.module.css';
import SavingAccountExploreSection from '../../components/SavingAccountCommonDashboardUi/SavingAccountExploreSection';
import { Row, Modal } from "react-bootstrap";
import SavingAccountInfoSection from '../../components/SavingAccountCommonDashboardUi/SavingAccountInfoSection';
import { apiCall, getParentUserId, getPublicMediaURL } from '../../../../common_utilities';
import { Link } from 'react-router-dom';
import ScheduleDetails from './ScheduleDetails';
import { BASE_API_URL, CHATBOT_TOKEN_PASSWORD, CHATBOT_TOKEN_USERNAME } from '../../../../constants';
import commonEncode from "../../../../commonEncode";
import { pdfjs } from 'react-pdf';
import { useDispatch } from "react-redux";
import {
    getMemberId,
    getUserId,
    removeMemberId,
    setFpUserDetailsId,
    setMemberId,
    setUserId
} from '../../../../common_utilities';
import { CHATBOT_BASE_API_URL } from '../../../../constants';
import { fetchTrackedBankDetails as fetchTrackedBankDetailsFun, analysePastData as analysePastDataFun } from "../../../../FrappeIntegration-Services/services/money-management-api/moneyManagementService";
import { getAppointmentDetails } from '../../../../FrappeIntegration-Services/services/tax-planning-api/taxApiService';


const SavingAccountSection = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [totalBankAcc, setTotalBankAcc] = useState(0);
    const [totalBankbalance, setTotalBankBalance] = useState(0);
    const [allAccountNo, setAllAccountNo] = useState(null);
    const [dashboardData, setDashboardData] = useState("");
    const [containerHeight, setContainerHeight] = useState(500);
    const [userContactNo, setUserContactNo] = useState([]);
    const [token, setToken] = useState(null);
    const [currentUserIds, setCurrentUserIds] = useState([]);
    // const [user_details, setUserDetails] = useState([]);
    const dispatch = useDispatch();
    let total_bank_acc = 0;
    let totalBalance = 0;
    let accountNumbers = [];
    let user_details = [];
    let user_contact = [];




    let users = "";
    let call_id = "";

    if (localStorage.getItem("member")) {
        users = JSON.parse(commonEncode.decrypt(localStorage.getItem("member")));
        if (users[0] != undefined) {
            call_id = users[0].id;

        }

    }


    const getMemberIdFn = () => {
        const member = localStorage.getItem("member");
        if (!member) {
            return [];
        } else {
            let isFamilySelected = Boolean(localStorage.getItem("family"));
            if (!isFamilySelected) {
                const userId = getUserId();
                const userIdArray = [userId];
                return userIdArray;
            } else {
                let users = "";
                let idsArray = [];

                if (localStorage.getItem("member")) {
                    users = JSON.parse(commonEncode.decrypt(localStorage.getItem("member")))
                    idsArray = users.map(item => String(item.id));
                }
                return idsArray;
            }

        }

        return idsArray;
    };

    const [appointment, SetAppointment] = useState(
        {
            hasAppointmentData: false,
            appointmentData: []
        })

    const userid = getUserId();

    const getScheduleData = async () => {
        let users = "";
        let idsArray = [];
        if (localStorage.getItem("member")) {
            users = JSON.parse(commonEncode.decrypt(localStorage.getItem("member")));

            idsArray = users.map(item => String(item.id));
        }


        try {
            const result = await getAppointmentDetails(getMemberIdFn());
            if (result?.data.length > 0) {
                const data = result.data[0]
                if (!data) {
                    SetAppointment(prev => ({
                        ...prev,
                        hasAppointmentData: false
                    }))
                } else {
                    SetAppointment(() => ({
                        hasAppointmentData: true,
                        appointmentData: result.data.map(data => ({
                            ...data,
                            hasAppointmentData: true,
                            appointment_rescheduled_count: data.appointment_rescheduled_count,
                            appointment_id: data.name,
                            appointment_date: data.appointment_date,
                            appointment_time: data.appointment_time,
                            appointment_status: data.appointment_status,
                            appointment_link: data.appointment_link,
                            emp_name: data.emp_name,
                            emp_id: data.expert_id,
                            emp_position: data.emp_qualification,
                            emp_experience: data.emp_experience,
                            rating: data.rating,
                            imagepath: data.imagepath,
                            payment_status: data.user_pay_status,
                            appointment_status_label: data.appointment_status_label
                        })
                        )
                    }))
                }

            }
        } catch (error) {
            console.log(error)
        }
    }

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    const FetchTrackedBankDetails = async () => {
        // myHeaders.append("gatewayauthtoken", 'Token ' + tkn);
        // myHeaders.append("gatewayauthname", GATEWAY_AUTH_NAME);
        const payload = {
            user_id: user_details
        };
        try {
            const result = await fetchTrackedBankDetailsFun(payload);
            if (result?.status_code == 200) {
                const filteredAccounts = result.data;
                dispatch({ type: "SET_LINKED_ACCOUNT_DATA", payload: filteredAccounts });
                setTotalBankAcc(result.data.length);
                result.data.forEach(account => {
                    const balance = account.mm_total_balance;
                    totalBalance += balance;
                    accountNumbers.push(account.mm_account_masked_id);
                    user_contact.push(account.mm_mobile_number);
                });
                setTotalBankBalance(totalBalance);
                setDashboardData(filteredAccounts);
                setAllAccountNo(accountNumbers);
                setUserContactNo(user_contact);
            }
            // else {
            //     throw new Error('Failed to fetch data');
            // }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    // FetchTrackedBankDetails();

    useEffect(() => {
        user_details = getMemberIdFn();
        setCurrentUserIds(user_details);
        getScheduleData();


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



    return (
        <div className={`${style.ScheduleAndAccountContainer}`} style={{ marginTop: '3rem', marginBottom: '2rem' }}>
            {appointment.hasAppointmentData &&
                <ScheduleDetails appointmentData={appointment} />
            }
            <div className={`Section ${style.AccountInfoSectionContainer}`} style={{ margin: '0', width: `${appointment.hasAppointmentData ? '70%' : '100%'}` }}>
                {dashboardData && dashboardData.length > 0 ? (
                    <SavingAccountInfoSection totalBanks={totalBankAcc} totalBankBalance={totalBankbalance} dashboardData={dashboardData} accountNumbers={accountNumbers} userContactNumber={user_contact} />
                ) : (
                    <div style={{ paddingTop: `${appointment.hasAppointmentData && appointment.appointment_status != 3 ? '4.5rem' : '0'}` }}>
                        <SavingAccountExploreSection isModal={false} />
                    </div>
                )}


                <div>
                    {/* <SavingAccountExploreSection isModal={false}/> */}
                </div>

                <Modal
                    className={`${style.moneyManagementModal}`}
                    dialogClassName={`${style.moneyManagementModalDialog}`}
                    centered
                    show={isPopupOpen}
                >
                    <div>
                        <SavingAccountExploreSection isModal={true} onClose={closePopup} />
                    </div>
                </Modal>
            </div>
        </div>

    );
};

export default SavingAccountSection;
