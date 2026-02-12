import { useEffect, useState } from "react";
import Styles from "./style.module.css"
import ConnetcBroker from "./ConnetcBroker";
import Demat from "./Demat";
import { useLocation } from "react-router-dom";
const NsdlcsdlInnersection = (props) => {
    const { tab, setTab } = props;
    const [pageurl, setPageurl] = useState(false);
    const location = useLocation();
    useEffect(() => {
        if ("pathname" in location) {
            setPageurl(location.pathname);
        }
    }, [location]);
    return (
        <>
            <div className={`${Styles.NsdlcsdlInnersection}`}>
                <div className="d-flex justify-content-md-center tab-box">
                    <div className="d-flex top-tab-menu m-0">
                        <div
                            className={`tab-menu-item ${tab == "Demat" ? "active" : ""}`}
                            onClick={() => setTab("Demat")}
                        >
                            <div className="tab-menu-title">Link Your Demat</div>
                        </div>
                        {/* {
                            pageurl === "/commondashboard" || pageurl === "/commondashboard/"|| pageurl === "/commondashboard/" ? null : <div
                                className={`tab-menu-item ${tab == "Broker" ? "active" : ""}`}
                                onClick={() => setTab("Broker")}
                            >
                                <div className="tab-menu-title">Connect With Broker</div>
                            </div>
                        } */}

                    </div>
                </div>
                <div className="mt-3">
                    <div className={tab == "Demat" ? "d-block" : "d-none"}>
                        <Demat ShowClose={props.onClose} showNextStep={props.onChangepopup} />
                    </div>
                    {/* <div onClick={() => {
                        setTab("Broker");
                    }} className={tab == "Broker" ? "d-block" : "d-none"}>

                        <ConnetcBroker ShowClose={props.onClose} />
                    </div> */}
                </div>

            </div>
        </>
    );
};
export default NsdlcsdlInnersection;
