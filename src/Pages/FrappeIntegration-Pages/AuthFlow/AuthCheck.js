import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const AuthCheck = () => {
    const navigate = useNavigate();

    // useEffect(() => {
    //     const token = Cookies.get("token");

    //     // if (!token) {
    //     //     navigate(`${process.env.PUBLIC_URL}/login`, { replace: true });
    //     //     return;
    //     // }

    //     const userData = localStorage.getItem("user_data");

    //     if (userData) {
    //         try {
    //             const parsed = JSON.parse(userData);
    //             if (!parsed.mobile_verified) {
    //                 navigate(`${process.env.PUBLIC_URL}/verify-mobile-number`, { replace: true });
    //                 return;
    //             }
    //         } catch (err) {
    //             console.error("Invalid JSON in localStorage user_data");
    //             navigate(`${process.env.PUBLIC_URL}/login`, { replace: true });
    //         }
    //     } else {
    //         navigate("/login", { replace: true });
    //     }
    // }, [navigate]);

    // return null;
}
export default AuthCheck;