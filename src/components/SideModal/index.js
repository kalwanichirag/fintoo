import { useEffect, useState, useRef } from "react";
import Modal from 'react-bootstrap/Modal'
import ServiceCard from "../ServiceCard";
import Styles from "./style.module.css";
import "./side-modal.css";
import { imagePath } from "../../constants";


const SideModal = (props) => {
    const [open, setOpen] = useState(false);
    // const [show, setShow] = useState(props.show);

    const handleClose = () => {
        props.onClose();
    };

    return (
        <Modal show={props.show} onHide={handleClose} className={`mymodal mos1 ${props.expand ? "largefrm" : "smallfrm"}`}>
            <Modal.Body>
                <button type="button" className="mybtn-close" aria-label="Close" onClick={handleClose}>
                    <img
                        src={imagePath + "/static/media/Images/assets/img/back-arrow.svg"}
                        alt="Back Arrow"
                    />
                </button>
                {props.children}
            </Modal.Body>
        </Modal>
    );
}
export default SideModal;