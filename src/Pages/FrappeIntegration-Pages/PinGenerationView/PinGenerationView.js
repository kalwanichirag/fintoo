import { useEffect, useState } from "react";
// import { showAlert } from "../Alerts/Alerts";
// import { useRouter } from "next/navigation";
// import { useDispatch } from "react-redux";
import { OTPInput } from "../../../components/FrappeIntegration-Components/Otp";
import OTPResend from "../../../components/FrappeIntegration-Components/Otp/resendOTPComponent";
import { formatTime } from "../../../Utils/FrappeIntegration-Utils/timeUtils";
import styles from './PinGenerationView.module.css';
import { check_all_status_api, fetchUserProfileDetails, resetPin, sendOTP, userLogin, userRegister, verifyOTP } from "../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import Cookies from "js-cookie";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import { setItemLocal, setUserId } from "../../../common_utilities";
import { useNavigate } from "react-router-dom";

export default function PinGenerationView({ userDetails, setIsAuthModalOpen, setview, setVerificationFlow, setUserDetailsFlow }) {

    const navigate = useNavigate();

    const [pin, setPin] = useState(Array(4).fill(""));
    const [pinError, setPinError] = useState("");
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (!userDetails?.email) {
            setview('AUTHFLOW');
            setVerificationFlow('EMAILENTRYVIEW');
        }
    }, [userDetails]);

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

    const setFinPin = async () => {

        if (pin.includes("")) {
            setPinError("Please fill PIN correctly.");
            return;
        } else {
            const enteredPin = pin.join("");

            const payload = {
                email: userDetails.email,
                pin: enteredPin
            }

            setLoading(true);

            const data = await userRegister(payload);
            if (data.status_code == 200 || data.error_code == 200) {
                
                webengage.user.login(data.data.user_lead_id);
                webengage.user.setAttribute("we_email", data.data.user_email);
                const { token, api_key, api_secret, expiry_time, ...userData } = data.data;

                Cookies.set('token', `${api_key}:${api_secret}`);
                setUserId(userData.user_id);
                setItemLocal("sky", `${api_key}:${api_secret}`);
                setItemLocal("token", `${api_key}:${api_secret}`);
                setItemLocal("member", []);
                setItemLocal("allMemberUser", []);
                await handleCheckAllStatus(userData.user_id);
                localStorage.setItem(
                    'user_data',
                    JSON.stringify({
                        mobile_verified: false,
                        user_email: userData.user_email,
                        user_id: userData.user_id,
                        user_name: userData.user_name,
                        user_mobile: userData.user_mobile,
                        user_onboarding_status: false
                    })
                );

                navigate(`${process.env.PUBLIC_URL}/mobile-verfication`);
                // setVerificationFlow("MOBILEVERIFICATION")


            } else {

                toastr.options.positionClass = "toast-bottom-left";
                toastr.error(data.message);
                setLoading(false);
                setview('AUTHFLOW');
                setVerificationFlow('PINGENERATIONVIEW');
                return;
            }
        }
    }

    const isPinComplete = !pin.includes("") && pin.join("").length === 4;

    return (
        <>
            <div className={`${styles.card} ${styles.cardWrapper}`}>
                <div className={styles.header}>
                    <img
                        src={process.env.REACT_APP_STATIC_URL + "media/wp/Fintoologo_.svg"}
                        alt="Bottom Left"
                    />
                    <h2 className={styles.title}>
                        Set New Fin-Pin
                    </h2>
                </div>

                <div>
                    <p className={styles.subtitle}>
                        {/* we value security pin helps keep your investments and other data safe and secure */}
                        Your security is our priority. Your PIN safeguards your investments and personal data.
                    </p>
                </div>

                <div className={styles.inputWrapper}>
                    <div className={styles.marginBottom}>
                        <OTPInput length={4} isRectangular={false} otp={pin} isPin={true} setOtp={setPin} onComplete={setFinPin} />
                        {
                            pinError && <p className={styles.errorText}>{pinError}</p>
                        }
                    </div>

                    <button
                        className={`${styles.fullButton} ${!isPinComplete || isLoading ? styles.disabled : styles.primary}`}
                        onClick={setFinPin}
                        disabled={!isPinComplete || isLoading}
                    >
                        SET PIN
                    </button>

                </div>

                {/* <div className={styles.footer}>
                    <span>{userDetails.email}</span>
                    <button className={styles.signOutBtn} onClick={() => {
                        setview('AUTHFLOW');
                        setVerificationFlow('PINGENERATIONVIEW');
                    }}>
                        Sign Out
                    </button>
                </div> */}
            </div>
        </>
    )
}
