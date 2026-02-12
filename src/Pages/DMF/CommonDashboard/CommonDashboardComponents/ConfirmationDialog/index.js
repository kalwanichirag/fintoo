import React from "react";
import { Modal as ReactModal } from "react-responsive-modal";

const ConfirmationDialog = (props) => {

    const handleConfirm = () => {
        // Handle confirmation logic here
        // You can also pass data back to the Promise resolution if needed
        props.handleClose(true);
    };

    const handleCancel = () => {
        // Handle cancellation logic here
        props.handleClose(false);
    };

    return (
        <div>
            <ReactModal classNames={{
                modal: 'ModalpopupXs',
            }} open={props.isOpen} showCloseIcon={false} center animationDuration={0} closeOnOverlayClick={false} large>
                <div className="text-center">
                    <h3 className="HeaderText">{props.title}</h3>
                    <div className="">
                        <div className="p-2">
                            <p className="PopupContent" style={{ fontSize: '1.3rem', fontWeight: 'normal', }}>
                                {props.message}</p>
                        </div>
                        <div className="ButtonBx aadharPopUpFooter" style={{ display: 'flex', justifyContent: 'center' }}>
                            <button className="outlineBtn" onClick={() => {
                                handleConfirm()
                            }}>
                                Yes
                            </button>
                            <button className="ReNew" onClick={() => {
                                handleCancel()
                            }}>
                                No
                            </button>
                        </div>
                    </div>
                </div>
            </ReactModal>
        </div>
    )
}

export default ConfirmationDialog
