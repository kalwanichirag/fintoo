import { useEffect, useState } from "react";
import { OTPInput } from "../../components/FrappeIntegration-Components/Otp";
import Cookies from "js-cookie";
import AuthModal from ".";
import HideHeader from "../../components/HideHeader";
import HideFooter from "../../components/HideFooter";
import { useNavigate } from "react-router-dom";


export const AuthPage = () => {
    

    const [pin, setPin] = useState(Array(4).fill(""));

    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get("token");
        const currentView = localStorage.getItem("auth_view");
        const verificationFlow = localStorage.getItem("verification_flow");
    
        if (token && !(currentView === "VERIFICATIONFLOW" && verificationFlow)) {
            navigate(`${process.env.PUBLIC_URL}/commondashboard`, { replace: true });
            localStorage.removeItem('auth_view');
            localStorage.removeItem('verification_flow');
        }
    }, [navigate]);
    


    return (
        <>
            <HideHeader />
            <HideFooter />
            {/* <h1>AuthPage AuthPage</h1>
            <div style={{ width: '30%' }}>
                <OTPInput length={4} isRectangular={false} otp={pin} setOtp={setPin} onComplete={() => { console.log('pin', pin) }} />
            </div> */}
            <AuthModal />
        </>
    );
};

