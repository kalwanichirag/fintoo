import { useEffect, useState } from "react";
// import LeftBaner from "./LeftBaner";
// import AuthFlow from "./AuthFlow";
// import PinVerificationView from "./PinVerificationView";
// import PinGenerationView from "./PinGenerationView";

import styles from "./AuthModal.module.css";
import LeftBaner from "./LeftBaner/LeftBaner";
import AuthFlow from "./AuthFlow/AuthFlow";
import PinVerificationView from "./PinVerificationView/PinVerificationView";
import PinGenerationView from "./PinGenerationView/PinGenerationView";
import Profile from "./verify-mobile-number/page";

export default function AuthModal() {

    const [view, setview] = useState(() => localStorage.getItem("auth_view") || "AUTHFLOW");
    const [verificationFlow, setVerificationFlow] = useState(() => localStorage.getItem("verification_flow") || "PINVERIFICATIONVIEW");

    // const [userDetails, setUserDetails] = useState(() => {
    //     const stored = localStorage.getItem("user_details");
    //     return stored ? JSON.parse(stored) : {
    //         email: "",
    //         user_name: "",
    //         country_code: "",
    //         mobile: "",
    //         user_id: "",
    //         user_details_id: "",
    //     };
    // });

    const [userDetails, setUserDetails] = useState({
            email: "",
            user_name: "",
            country_code: "",
            mobile: "",
            user_id: "",
            user_details_id: "",
    });

    useEffect(() => {
        localStorage.setItem("auth_view", view);
    }, [view]);

    useEffect(() => {
        localStorage.setItem("verification_flow", verificationFlow);
    }, [verificationFlow]);

    // useEffect(() => {
    //     localStorage.setItem("user_details", JSON.stringify(userDetails));
    // }, [userDetails]);


    return (
        <>
            {true && (
                <div className={styles.backdrop}>
                    {view === 'AUTHFLOW' && (
                        <div className={styles.modalContainer}
                            onClick={(e) => e.stopPropagation()}
                        >
                            
                            <div className={styles.rightPanel}>
                                <div className={styles.whiteCard}>
                                    <AuthFlow
                                        setview={setview}
                                        setVerificationFlow={setVerificationFlow}
                                        userDetails={userDetails}
                                        setUserDetails={setUserDetails}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {view === 'VERIFICATIONFLOW' && (
                        <div onClick={(e) => e.stopPropagation()}>
                            <div className={styles.verificationWrapper}>
                                <div className={styles.verificationContainer}>
                                    {verificationFlow === 'PINVERIFICATIONVIEW' && (
                                        <PinVerificationView
                                            userDetails={userDetails}
                                            setIsAuthModalOpen={() => { }}
                                            setview={setview}
                                            setVerificationFlow={setVerificationFlow}
                                        />
                                    )}
                                    {verificationFlow === 'PINGENERATIONVIEW' && (
                                        <PinGenerationView
                                            userDetails={userDetails}
                                            setIsAuthModalOpen={() => { }}
                                            setview={setview}
                                            setVerificationFlow={setVerificationFlow}
                                        />
                                    )}
                                    {/* {verificationFlow === "MOBILEVERIFICATION" && <Profile />} */}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
