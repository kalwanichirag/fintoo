import { useEffect } from "react";
// import Header from "../Header";
import Footer from "../MainComponents/Footer";
import MainHeader from "../MainHeader";
import CheckSession from "../CheckSessionLayout";

const GuestLayout = (props) => {
    
    return (
        <>
        {/* <MainHeader /> */}
        {props.children}
        {/* <Footer /> */}
        </>
    );
}

export default GuestLayout;
