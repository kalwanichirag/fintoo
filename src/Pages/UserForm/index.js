import React, { useRef } from "react";
import Fullpage from "../../components/Layout/Fullpage";
import BasicInfoSection from "./UserFormSection";
import HideFooter from "../../components/HideFooter";
import HideHeader from "../../components/HideHeader";

const UserForm = () => {

    return (
        <Fullpage>
            <HideFooter />
            <HideHeader />
            <BasicInfoSection />
        </Fullpage>
    );
}

export default UserForm;
