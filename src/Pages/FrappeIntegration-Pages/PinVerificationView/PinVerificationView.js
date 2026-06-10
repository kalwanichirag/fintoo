// import { sendOTP } from "@/library/services/user-management-api/userApiService";
import { useEffect, useState } from "react";
// import { showAlert } from "../Alerts/Alerts";
// import { useRouter } from "next/navigation";
// import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { OTPInput } from "../../../components/FrappeIntegration-Components/Otp";
import OTPResend from "../../../components/FrappeIntegration-Components/Otp/resendOTPComponent";
import { formatTime } from "../../../Utils/FrappeIntegration-Utils/timeUtils";
import styles from './PinVerificationView.module.css';
import { check_all_status_api, fetchUserProfileDetails, getFamilyMember, resetPin, sendOTP, userLogin, verifyOTP } from "../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import { getParentUserId, setItemLocal, setUserId } from "../../../common_utilities";
import { DATA_BELONGS_TO } from "../../../constants";
import { AutoFetchFinvuData } from "../../../FrappeIntegration-Services/services/External-api/externalApi";
import { get } from "react-scroll/modules/mixins/scroller";
import { ValidateRedirection } from "../../../FrappeIntegration-Services/services/master-api/masterApiService";

const handleGetFamilyMember = async (userId) => {
    try {
        if (userId) {
            const result = await getFamilyMember(userId);
            if (result?.status_code == 200) {
                const transformedData = result.data.map((member) => ({
                    name: member.user_name || '',
                    id: member.user_id || '',
                    parent_user_id: member.user_parent_id,
                    pan: member.pan || '',
                    mobile: member.mobile_number || '',
                    email: member.user_email || '',
                    user_email: member.user_email || '',
                    fp_user_details_id: member.user_details_id || '',
                    fdmf_is_minor: member.is_minor ? 'Y' : 'N',
                }));
                setItemLocal("member", [...transformedData]);
                setItemLocal("allMemberUser", [...transformedData]);

                const parentUser = result.data.find(member => member.user_id === getParentUserId());
                if (parentUser) {
                    const userData = localStorage.getItem("user_data");

                    if (userData) {
                        const parsedData = JSON.parse(userData);

                        parsedData.user_mobile = parentUser?.mobile_number || parsedData?.mobile_number || '';
                        parsedData.user_country_code = parentUser?.user_country_code || parsedData?.user_country_code || '';

                        localStorage.setItem("user_data", JSON.stringify(parsedData));
                    }
                }

            }
        } else {
            console.error('userId not found.');
        }
    } catch (error) {
        console.error('Error fetching members:', error);
    }
}

const hanleprofileDetails = async (userId) => {
    try {
        if (!userId) return;

        const result = await fetchUserProfileDetails(userId);
        if (result?.status_code === 200 && result.data) {
            const userDataFromProfile = result.data;
            const existingDataString = localStorage.getItem('user_data');
            const existingData = existingDataString ? JSON.parse(existingDataString) : {};

            const mergedData = { ...existingData, ...userDataFromProfile };

            localStorage.setItem('user_data', JSON.stringify(mergedData));
        }
    } catch (error) {
        console.error('Error fetching user profile details:', error);
    }
};


const handleCheckAllStatus = async (userId) => {
    try {
        if (userId) {
            const result = await check_all_status_api(userId);

            if (result?.status_code === "200") {
                const {
                    nda_sign_check,
                    data_gethering_check,
                    report_check,
                    plan_uuid,
                    plan_is_expired,
                    opportunity_id
                } = result.data;

                setItemLocal("ndasignstatus", nda_sign_check);
                setItemLocal("datagatheringstatus", data_gethering_check);
                setItemLocal("reportstatus", report_check);
                setItemLocal("plan_is_expired", plan_is_expired);
                setItemLocal("plan_uuid", plan_uuid);
                setItemLocal("opportunity_id", opportunity_id);

                if (plan_uuid !== "fp_robo" && plan_uuid !== "") {
                    if (plan_is_expired == "N" && nda_sign_check == "N") {
                        window.location.href = `${process.env.PUBLIC_URL}/userflow/expert-nda`;
                        return;
                    }
                }

            } else {
                console.error("Status check failed:", result?.message);
            }
        } else {
            console.error("User ID not found.");
        }
    } catch (error) {
        console.error("Error checking user status:", error);
    }
};

const kyc_fp_redirection = async (lead_id) => {
    try {
        if (!lead_id) {
            console.error("Lead ID not found.");
            return false;
        }

        const result = await ValidateRedirection(lead_id);
        const message = result?.data?.message;

        if (result?.status === 200 && message?.success) {
            if (message?.redirect_to_fp === 1 || message?.redirect_to_kyc === 1) {
                return true; // redirect required
            }
        } else {
            console.error("Redirection validation failed:", result);
        }
    } catch (error) {
        console.error("Error checking user status:", error);
    }
    return false; // no redirect
};

const fetchFinvuData = async (user_id) => {
    try {
        let payload = { "user_id": user_id, data_belongs_to: DATA_BELONGS_TO };
        const result = await AutoFetchFinvuData(payload);
    } catch (error) {
        console.error("Error fetching Finvu data:", error);
    }
}

const PinVerification = ({ serCurrentView, userDetails, setIsAuthModalOpen, setview, setVerificationFlow, isLoading, setLoading }) => {

    // const router = useRouter();
    // const dispatch = useDispatch();

    const [pin, setPin] = useState(Array(4).fill(""));
    const [pinError, setPinError] = useState("");

    const verifyFinPin = async () => {
        if (!userDetails?.email) {
            toastr.error("Something went wrong, Please enter your email again.");
            setview('AUTHFLOW');
            setVerificationFlow('EMAILENTRYVIEW');
            return;
        }

        if (pin.includes("")) {
            setPinError("Please fill PIN correctly.");
            return;
        } else {
            const enteredPin = pin.join("");

            const payload = {
                email: userDetails.email,
                pin: enteredPin,
                data_belongs_to: DATA_BELONGS_TO
            }

            setLoading(true);


            const data = await userLogin(payload);

            if (data.status_code == 200 || data.error_code == 200) {
                setLoading(false);
                const { token, api_key, api_secret, expiry_time, ...userDetails } = data.data;

                Cookies.set('token', `${api_key}:${api_secret}`);
                setUserId(userDetails.user_id);
                setItemLocal("sky", `${api_key}:${api_secret}`);
                setItemLocal("token", `${api_key}:${api_secret}`);

                localStorage.setItem(
                    'user_data',
                    JSON.stringify({ ...userDetails, user_onboarding_status: false })
                );
                await handleCheckAllStatus(userDetails.user_id);
                await handleGetFamilyMember(userDetails.user_id);
                await hanleprofileDetails(userDetails.user_id);
                await fetchFinvuData(userDetails.user_id)
                const userDataString = localStorage.getItem("user_data");
                const userData = userDataString ? JSON.parse(userDataString) : {};


                let redirectUrl = `${process.env.PUBLIC_URL}/commondashboard`; // default

                if (userData.mobile_verified === false) {
                    redirectUrl = `${process.env.PUBLIC_URL}/mobile-verfication`;
                } else if (userData.user_onboarding_status === false) {
                    redirectUrl = `${process.env.PUBLIC_URL}/onboard-flow`;
                } else if (userData.user_lead_id) {
                    const kycRedirect = await kyc_fp_redirection(userData.user_lead_id);
                    if (kycRedirect) {
                        redirectUrl = `${process.env.PUBLIC_URL}/datagathering/verification-docs`;
                    }
                }

                // Perform final redirect
                window.location.href = redirectUrl;


                setItemLocal("logged_in", 1);
                setItemLocal("family", 1);
                localStorage.removeItem('auth_view');
                localStorage.removeItem('verification_flow');

            }

            if (data.status_code == 400 || data.error_code == 400) {
                setLoading(false);
                setPinError(data.message);
                return;
            }

            setLoading(false);
            return;
        }
    }

    return (
        <>
            <span className={styles.closeIcon} onClick={() => {
                setview('AUTHFLOW');
                setVerificationFlow('PINGENERATIONVIEW');
            }}>
                <i className="fa-solid fa-xmark"></i>
            </span>

            <div className={styles.header}>
                <h2 className={styles.heading}>
                    Hi {userDetails.email}
                </h2>
                <h2 className={styles.heroTitle}>Welcome Back</h2>
                {/* <p className={styles.subtext}>
                    {userDetails.email}?<button className={styles.signOutBtn} onClick={() => {
                        setview('AUTHFLOW');
                        setVerificationFlow('PINGENERATIONVIEW');
                    }}>Sign Out</button>
                </p> */}
            </div>

            <div>
                <p className={styles.centerText}>
                    Please enter Fin-Pin here
                </p>
            </div>

            <div className={styles.otpWrapper}>
                <div className={styles.marginBottom}>
                    <OTPInput length={4} isRectangular={false} otp={pin} isPin={true} setOtp={setPin} onComplete={verifyFinPin} />
                    {
                        pinError && <p className={styles.errorText}>{pinError}</p>
                    }
                </div>

                <button className={`${styles.verifyBtn} ${isLoading ? styles.disabled : styles.primary}`} onClick={verifyFinPin}>
                    Verify
                </button>
            </div>

            <div className={styles.forgotText}>
                <button className={styles.linkBtn} onClick={() => serCurrentView('RESETPIN')}>
                    Haven’t set up Fin-Pin? / Forgot Fin-Pin?
                </button>
            </div>
        </>
    )
}

const ResetPin = ({ userDetails, setIsAuthModalOpen, setview, setVerificationFlow, isLoading, setLoading }) => {
    // const router = useRouter();
    // const dispatch = useDispatch();

    const [pin, setPin] = useState(Array(4).fill(""));
    const [pinError, setPinError] = useState("");
    const [pin2, setPin2] = useState(Array(4).fill(""));
    const [pin2Error, setPin2Error] = useState("");
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [otpError, setOtpError] = useState("");
    const [isOTPView, setIsOTPView] = useState(false);

    const setFinPin = async () => {

        if (pin.includes("") || pin2.includes("")) {

            if (pin.includes("") || pin2.includes("")) {
                if (pin.includes("")) {
                    setPinError("Please fill PIN correctly.");
                }
                if (pin2.includes("")) {
                    setPin2Error("Please fill PIN correctly.");
                }
                return
            }

            return;
        } else if (pin.join("") !== pin2.join("")) {
            setPin2Error("PIN is different.");
            return;
        } else {
            try {

                const payload = {
                    identifier: userDetails.email,
                    for_otp: "email"
                }
                setLoading(true);
                const data = await sendOTP(payload);
                setLoading(false);

                if (data.status_code == 200 || data.error_code == 200) {
                    setIsOTPView(true);
                } else {
                    toastr.options.positionClass = "toast-bottom-left";
                    toastr.error('Something went wrong, please try again.');
                }

            } catch (error) {
                console.error('Failed to check email:', error);
            } finally {

            }

        }
    }

    const VerifyEmailCode = async () => {
        if (otp.includes("")) {
            setOtpError("Please fill OTP correctly.");
            return;
        } else {
            const enteredOtp = otp.join("");
            try {
                const payload = {
                    identifier: userDetails.email,
                    for_otp: "email",
                    otp: enteredOtp
                }

                setLoading(true);

                const data = await verifyOTP(payload);

                if (data.status_code == 200 || data.error_code == 200) {

                    const enteredPin = pin.join("");

                    const payload = {
                        email: userDetails.email,
                        pin: enteredPin
                    }

                    setLoading(true);

                    const data = await resetPin(payload);

                    if (data.status_code == 200 || data.error_code == 200) {
                        const { token, api_key, api_secret, expiry_time, ...userData } = data.data;
                        Cookies.set('token', `${api_key}:${api_secret}`);
                        setUserId(userData.user_id);
                        setItemLocal("sky", `${api_key}:${api_secret}`);
                        setItemLocal("token", `${api_key}:${api_secret}`);


                        localStorage.setItem(
                            'user_data',
                            JSON.stringify({ ...userData, user_onboarding_status: false })
                        );

                        await handleGetFamilyMember(userData.user_id);
                        await fetchFinvuData(userData.user_id)

                        window.location.href = process.env.PUBLIC_URL + "/commondashboard";


                        setItemLocal("logged_in", 1);
                        setItemLocal("family", 1);
                        localStorage.removeItem('auth_view');
                        localStorage.removeItem('verification_flow');
                        return;

                    } else {
                        toastr.options.positionClass = "toast-bottom-left";
                        toastr.error(data.message);
                        setLoading(false);
                    }

                } else {
                    setOtpError(data.message);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Failed to check email:', error);
            } finally {

            }

        }

    };

    const resedEmailOTP = async () => {

        setOtp(Array(6).fill(""));
        setOtpError("");

        try {

            const payload = {
                identifier: userDetails.email,
                for_otp: "email"
            }
            setLoading(true);
            const data = await sendOTP(payload);
            setLoading(false);

            if (data.status_code == 200 || data.error_code == 200) {
                return;
            }

        } catch (error) {
            console.error('Failed to check email:', error);
        } finally {

        }
    };

    return (
        <>
            <span className={styles.closeIcon} onClick={() => {
                setview('AUTHFLOW');
                setVerificationFlow('PINGENERATIONVIEW');
            }}>
                <i className="fa-solid fa-xmark"></i>
            </span>
            <div className={styles.header}>
                <h2 className={styles.heading}>
                    Reset Fin-Pin
                </h2>
                <h2 className={styles.heroTitle}>
                    Secure Your Access
                </h2>
            </div>

            <div>
                <p className={styles.centerText}>
                    {
                        isOTPView ? 'Enter OTP sent on your email' : 'Enter your new Fin-Pin'
                    }
                </p>
            </div>

            <div className={styles.otpWrapper}>
                {
                    !isOTPView ?
                        <div>
                            <div className={styles.marginBottom}>
                                <label className={styles.label} htmlFor="email">New Fin-Pin</label>
                                <OTPInput length={4} isRectangular={false} otp={pin} isPin={true} setOtp={setPin} onComplete={() => { }} />
                                {
                                    pinError && <p className={styles.errorText}>{pinError}</p>
                                }
                            </div>
                            <div className={styles.marginBottom}>
                                <label className={styles.label} htmlFor="email">Confirm New Fin-Pin</label>
                                <OTPInput length={4} isRectangular={false} otp={pin2} isPin={true} setOtp={setPin2} onComplete={setFinPin} ID={'two'} />
                                {
                                    pin2Error && <p className={styles.errorText}>{pin2Error}</p>
                                }
                            </div>
                        </div>
                        :
                        <div className={styles.marginBottom}>
                            <label className={styles.label} htmlFor="email">OTP</label>
                            <OTPInput length={6} isRectangular={false} otp={otp} setOtp={setOtp} onComplete={VerifyEmailCode} />
                            {
                                otpError && <p className={styles.errorText}>{otpError}</p>
                            }
                            <OTPResend resendTime={120} resendFunction={resedEmailOTP}>
                                {({ counter, isClickable, handleResend }) => (
                                    <div className={styles.resendContainer}>
                                        {
                                            !isClickable && <span className={styles.resendCountdown}>
                                                <span className={styles.resendText}>Resend in</span>{counter > 0 ? `(${formatTime(counter)}s)` : ""}
                                            </span>
                                        }
                                        <span
                                            className={`${styles.linkBtn} ${!isClickable && styles.resendDisabled}`}
                                            onClick={handleResend}
                                        >
                                            {isClickable ? "Resend" : ""}
                                        </span>
                                    </div>
                                )}
                            </OTPResend>
                        </div>
                }
                <button className={`${styles.resetBtn} ${isLoading ? styles.disabled : styles.primary}`} onClick={() => { isOTPView ? VerifyEmailCode() : setFinPin() }}>
                    {
                        isOTPView ? 'Submit' : 'Send OTP'
                    }
                </button>
            </div>
        </>
    )
}

export default function PinVerificationView({ userDetails, setIsAuthModalOpen, setview, setVerificationFlow, setUserDetailsFlow }) {

    const [currentView, serCurrentView] = useState('PINVERIFICATION');
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (!userDetails?.email) {
            setview('AUTHFLOW');
            setVerificationFlow('EMAILENTRYVIEW');
        }
    }, [userDetails]);

    return (
        <>
            {/* <div className="relative card w-[80%] lg:w-[40%] md:w-[40%] py-10 flex items-center justify-center "> */}
            <div className={styles.cardWrapper}>
                {
                    currentView == "PINVERIFICATION" && <PinVerification serCurrentView={serCurrentView} userDetails={userDetails} setIsAuthModalOpen={setIsAuthModalOpen} setview={setview} setVerificationFlow={setVerificationFlow} isLoading={isLoading} setLoading={setLoading} />
                }
                {
                    currentView == "RESETPIN" && <ResetPin userDetails={userDetails} setIsAuthModalOpen={setIsAuthModalOpen} setview={setview} setVerificationFlow={setVerificationFlow} isLoading={isLoading} setLoading={setLoading} />
                }
            </div>
        </>
    );
}
