import SectionHeader from "../../SectionHeader";
import styles from "./style.module.css";
import commonStyles from "../../Layout/Fullpage/style.module.css";
import { useCalendlyEventListener, InlineWidget } from "react-calendly";
// import TaxData from "./TaxData.json";
import { fetchData, getUserId } from "../../../common_utilities";
import { useEffect, useState } from "react";
import Calendar from "./Calendar";
import UserVerification from "./UserVerification";
import ThankyouSection from "../../ThankyouSection";
import { useDispatch, useSelector } from "react-redux";
import commonEncode from "../../../commonEncode";

function VerificationSection({ isWP,eventCode, eventUrl, serviceName, planId, extraParams, logo, addIncomSlabAndComment, pageName }) {

    const loggedIn = useSelector((state) => state.loggedIn);

    const [currAppointmentView, setCurrAppointmentView] = useState('VERIFICATION');
    const [show, SetShow] = useState(false);

    const dispatch = useDispatch();

    const handleClose = () => {
        SetShow(false);
        Boolean(loggedIn) == false ? setCurrAppointmentView('VERIFICATION') : setCurrAppointmentView('CALENDLY');

        dispatch({
            type: "SET_LEAD_DATA", payload: {
                fullname: "",
                mobile: "",
                email: ""
            }
        });
    }

    const handleLoggedInCase = () => {
        setTimeout(() => {
            assignUserData()
        }, 2000)
    }

    const assignUserData = () => {
        const userid = getUserId();

        let member = JSON.parse(commonEncode.decrypt(localStorage.getItem("member")));
        let users = JSON.parse(commonEncode.decrypt(localStorage.getItem("allMemberUser")));

        const membertUserData = member.filter(data => data.id == userid)[0];
        const currentUserData = users.filter(data => data.id == userid)[0]

        dispatch({
            type: "SET_LEAD_DATA", payload: {
                fullname: membertUserData?.name,
                mobile: currentUserData?.mobile,
                email: currentUserData?.email
            }
        });

        setCurrAppointmentView('CALENDLY');
    }

    useEffect(() => {
        Boolean(loggedIn) == false ? setCurrAppointmentView('VERIFICATION') : handleLoggedInCase();
    }, [loggedIn])

    return (
        <>
            {
                currAppointmentView === 'VERIFICATION' && <UserVerification logo={logo} setCurrAppointmentView={setCurrAppointmentView} />
            }
            {
                currAppointmentView === 'CALENDLY' && <div className={`${styles["appointment-section-iframe"]}`}>
                    <div
                        className="calendly-inline-widget"
                        style={{
                            width: "100%",
                        }}
                    >
                        {/* <Calendar extraParams={extraParams} eventCode={eventCode} url={`https://calendly.com/fintoo/test-clone-clone?hide_event_type_details=1`} serviceName={serviceName} planId={planId} SetShow={SetShow} /> */}
                        <Calendar isWP={isWP} extraParams={extraParams} eventCode={eventCode} url={eventUrl} serviceName={serviceName} planId={planId} SetShow={SetShow} addIncomSlabAndComment={addIncomSlabAndComment} pageName={pageName} />
                    </div>
                </div>
            }

            {show && <ThankyouSection onClose={() => handleClose()} />}
        </>
    );
}

export default VerificationSection;
