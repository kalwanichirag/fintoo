import { useEffect } from "react";
import {FaUserAlt} from "react-icons/fa";
import DashboardTopMenu from "../Dashboard/TopMenu";
import DashboardSidebar from "../Dashboard/Sidebar";
import MainHeader from "../MainHeader";

const ProfileInsider = (props) => {
    useEffect(()=> {
        document.body.classList.add("page-profile-inside")
    }, []);
    return (
        <>
        {/* <MainHeader /> */}
        <div id="wrapper" >
            <div className="container-fluid profile-container">
                <div id="wrapper-bx" className="d-block d-lg-flex">
                    <DashboardSidebar prog={props.prog} />
                    <div id="content-wrapper">
                        {/* <DashboardTopMenu /> */}
                        <div id="content">
                            {props.children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default ProfileInsider;
