import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HideFooter from "../../../components/HideFooter";
import HideHeader from "../../../components/HideHeader";
import PhoneVerificationView from "./PhoneVerificationView/PhoneVerificationView";

export default function VerifyMobileNumber() {
    

    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem("user_data");

        if (userData) {

            const parsed = JSON.parse(userData);
            if (parsed.mobile_verified) {
                navigate(`${process.env.PUBLIC_URL}/commondashboard`, { replace: true });
                return;
            }
        }
    }, []);

    return (
        <>
            <HideHeader />
            <HideFooter />
            <PhoneVerificationView />
        </>
    );
}
