import { useEffect, useState } from "react";
import { Modal as ReactModal } from "react-responsive-modal";
import { getUserId } from "../../common_utilities";
import axios from "axios";
import commonEncode from "../../commonEncode";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { DATA_BELONGS_TO, investmentEndpoints } from "../../constants";
import { getNomineeDetails } from "../../FrappeIntegration-Services/services/investment-api/investmentService";

const InfoStrip = () => {

    const location = useLocation();
    const loggedIn = useSelector((state) => state.loggedIn);

    const allowedPaths = [
        "/web/direct-mutual-fund/profile/dashboard/Nominee"
    ];

    const currentPath = window.location.pathname;

    const [showStrip, setShowStrip] = useState(false);
    const [stripTxt, setStripTxt] = useState("");

    const getNomineeInfo = async () => {

        if (!Boolean(loggedIn)) return;

        var user_id = getUserId();

        try {
            var data = { "nominee_user_id": user_id, "data_belongs_to": DATA_BELONGS_TO };
            try {
                var response = await getNomineeDetails(data);

                if (response.status_code === 200) {
                    const nomineeData = response.data;

                    if (nomineeData?.status === "success" && nomineeData?.data?.length > 0) {
                        const nomineeDetails = nomineeData.data[0];

                        if (nomineeDetails.is_nominee_details_pending && !allowedPaths.includes(currentPath)) {
                            setShowStrip(true);
                            setStripTxt(nomineeDetails.header_strip_message ?? '');
                        } else {
                            setShowStrip(false);
                        }
                    } else {
                        setShowStrip(false);
                    }
                } else {
                    console.error("Unexpected response status:", response.status);
                }
            } catch (error) {
                console.error("Error fetching nominee details:", error);
            }
            //console.log('InfoStrip nominee response', JSON.parse(response));

        } catch (e) {

        }
    };

    useEffect(() => {
        getNomineeInfo();
    }, [loggedIn, location.pathname])

    useEffect(() => {
    }, [location.pathname])

    return (
        <>
            {
                showStrip && <div style={{ width: '100%', padding: '0.5rem 0.6rem', backgroundColor: '#042b62', color: 'white', textAlign: 'center', }}>
                    {stripTxt}&nbsp;&nbsp;
                    <span >
                        <Link
                            to={
                                process.env.PUBLIC_URL +
                                "/direct-mutual-fund/profile/dashboard/Nominee"
                            }
                            style={{ color: '#f68638', textDecorationL: 'none' }}
                        >Proceed</Link>
                    </span>

                </div>
            }
        </>
    )
}

export default InfoStrip