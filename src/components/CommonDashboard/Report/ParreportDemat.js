import { useEffect, useState } from "react";
import Styles from "../../../Pages/datagathering/AssetsLibDG/NSDL_CSDL/style.module.css";
import Demat from "../../../Pages/datagathering/AssetsLibDG/NSDL_CSDL/Demat";
import { useLocation } from "react-router-dom";
const ParreportDemat = (props) => {
    // const { tab, setTab } = props;
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
                            className={`tab-menu-item active`}
                        // onClick={() => setTab("Demat")}
                        >
                            <div style={{
                                fontSize: "1.1rem",
                                color: "#042b62",
                                fontWeight: "600",
                                paddingBottom: ".4rem",
                                borderBottom: "3px solid #042b62",
                                textTransform: "uppercase"
                            }} className="tab-menu-title custom-link-dmat-heading-text">Link Your Demat</div>
                        </div>
                    </div>
                </div>
                <div className="mt-3">
                    <div>
                        <Demat
                            setInvestmentTypeView={props.setInvestmentTypeView}
                            onClose={() => {
                                props.onpopupclose();
                            }} showNextStep={props.onChangepopup} />
                    </div>
                </div>

            </div>
        </>
    );
};
export default ParreportDemat;
