import { useEffect, useState } from "react";
import { Modal as ReactModal } from "react-responsive-modal";
import { getUserId } from "../../common_utilities";
import { useNavigate } from "react-router-dom";

const NomineeInfoModal = () => {

    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const allowedPaths = [
        "/web/login"
    ];

    const currentPath = window.location.pathname;

    useEffect(() => {
        if (!getUserId() && !allowedPaths.includes(currentPath)) {
            setIsModalOpen(true);
        }
    }, []);

    const handleClose = () => {
        setIsModalOpen(false);
    };

    const handleProceed = () => {
        handleClose();
        navigate(process.env.PUBLIC_URL + "/login");
    };

    return (
        <>
            <ReactModal
                classNames={{
                    modal: "ModalpopupContentWidth",
                }}
                open={isModalOpen}
                showCloseIcon={true}
                center
                animationDuration={0}
                closeOnOverlayClick={false}
                onClose={handleClose}
            >
                <div>
                    <h3 className="text-center HeaderText">Revise and Revamp of Nomination Facilities in Mutual Funds Segment - Update</h3>
                    <div className="p-2" style={{ fontSize: "1rem" }}>
                        <p>
                            As per SEBI circular (Ref: SEBI/HO/OIAE/OIAE_IAD-3/P/ON/2025/0027), additional nominee details are now mandatory for Mutual Fund investments:
                        </p>
                        <p>
                            Mandatory details: Name, ID number, Address, Email, Mobile
                        </p>
                        <p>
                            Applies to new UCC creation and modifications from June 1, 2025
                            Please ensure all required nominee details are provided to avoid transaction rejection.
                        </p>
                        <p>
                            Attachment : <a href="https://www.bseindia.com/markets/MarketInfo/DownloadAttach.aspx?id=20250316-3&attachedId=db760397-d462-444a-bf63-d07f0f811fbb">SEBI circular on Nomination.pdf</a>
                        </p>
                        <div
                            className="ButtonBx aadharPopUpFooter"
                            style={{ display: "flex", justifyContent: "center" }}
                        >
                            <button className="ReNew" onClick={handleProceed}>
                                Proceed
                            </button>
                        </div>
                    </div>
                </div>
            </ReactModal>
        </>
    )
}

export default NomineeInfoModal