import React, { useEffect, useState } from "react";
import Modal from "react-responsive-modal";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Success from "../Assets/01_pan_verfication.svg";
import Styles from "./incompletereg.module.css";
function IncompleteRegistration() {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  return (
    <div>
      <Modal
        className="Modalpopup"
        open={open}
        showCloseIcon={false}
        onClose={onCloseModal}
        center
      >
        <div className="text-center">
          <p className={`${Styles.HeaderText}`}>Incomplete Registration</p>
          <div></div>
        </div>
        <div className={`${Styles.PaymentSuccess}`}>
          <div className={`${Styles.Resmodal}`}>
            <div>
              <center>
                <img
                  className={`img-fluid ${Styles.SucessImg}`}
                  src={
                    process.env.REACT_APP_STATIC_URL +
                    "media/DMF/01_pan_verfication.svg"
                  }
                  alt="SuccessPayment"
                  srcset=""
                />
              </center>
            </div>
            <div className="mt-4 justify-center align-content-center">
              <h5 className="text-center">{}</h5>
              <p className={`text-center ${Styles.Textlabel}`}>
                Please complete your registration by clicking the continue
                button
              </p>
            </div>
            <div className={`${Styles.ErrorBtn}`}>
              <button
                className={`shadow-none outline-none  w-30 ${Styles.continuebtn}`}
                //   onClick={handleClose}
              >
                <Link to="/direct-mutual-fund/profile/dashboard">
                  {" "}
                  Continue
                </Link>
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default IncompleteRegistration;
