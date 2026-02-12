import React, { useEffect, useState } from "react";
// import Modal from "react-responsive-modal";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Success from "./Images/01_pan_verfication.svg";
import Styles from "./style.module.css";
import Modal from 'react-bootstrap/Modal'

function IncompleteRegistration({open, onCloseModal, handleSubmit}) {
  
  return (
    <Modal

        size="lg"
        className="Modalpopup"
        show={open}
        showCloseIcon={false}
        onHide={()=> {
          onCloseModal();
        }}
        centered
      >
        <div className="text-center">
          
          <p className={`pt-3 ${Styles.HeaderText}`}>Incomplete Registration</p>
          <div>
            
          </div>
        </div>
        <div className={`${Styles.PaymentSuccess}`}>
          <div className={`${Styles.Resmodal}`}>
            <div>
              <center>
                <img
                  className={`img-fluid ${Styles.SucessImg}`}
                  src={
                    process.env.REACT_APP_STATIC_URL + "media/DMF/01_pan_verfication.svg"
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
                  onClick={handleSubmit}
              >
                  Continue
                
              </button>
            </div>
          </div>
        </div>
    </Modal>
    
  );
}

export default IncompleteRegistration;
