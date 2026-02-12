import React from "react";
// import Modal from "react-responsive-modal";
import Modal from "react-bootstrap/Modal";
import CloseImg from "../Assets/cancel.png";
const Calendly = ({ setShow, show, handleClose, calendlydata, rmdetails }) => {
  return (
    <div>
      {rmdetails === undefined ? (
        <Modal centered show={show} onHide={handleClose}>
          <div id="calendly">
            <div className="CloseIcon">
              <img onClick={handleClose} src={process.env.REACT_APP_STATIC_URL + "media/DMF/cancel.svg"} />
            </div>
            <div class="text-center">
              <div>
                <p class="BooKLabel">Book Appointment with Expert  </p>
              </div>
              <div>
                <p class="bookIntro">
                  Book an introductory call with our financial Advisor to know
                  more about our offerings and advice.
                </p>
              </div>
            </div>
            <iframe
              src={`https://calendly.com/fintoo/15min-consultation?embed_domain=minty.co.in&embed_type=Inline&hide_event_type_details=1&hide_gdpr_banner=1&name=${calendlydata.name}&email=${calendlydata.email}&a3=+91${calendlydata.mobile}`}
              height="390px" width="100%"
            ></iframe>
          </div>
           
        </Modal>
      ) : (
        <Modal centered show={show} onHide={handleClose}>
           <div id="calendly">
           <div className="CloseIcon">
              <img onClick={handleClose} src={process.env.REACT_APP_STATIC_URL + "media/DMF/cancel.svg"} />
            </div>
            <div class="text-center">
              <div>
                <p class="BooKLabel">Book Appointment with Expert  </p>
              </div>
              <div>
                <p class="bookIntro">
                  Book an introductory call with our financial Advisor to know
                  more about our offerings and advice.
                </p>
              </div>
            </div>
            <iframe
               src={`https://calendly.com/fintoo/15-minutes-consultation-expert?embed_domain=minty.co.in&embed_type=Inline&hide_event_type_details=1&hide_gdpr_banner=1&name=${calendlydata.name}&email=${calendlydata.email}&a3=+91${calendlydata.mobile}&a4=${rmdetails.emp_name}`}
               height="390px" width="100%"
            ></iframe>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Calendly;
