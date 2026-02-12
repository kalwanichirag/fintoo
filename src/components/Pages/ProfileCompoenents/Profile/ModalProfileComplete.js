import { Modal } from "react-bootstrap";
import FintooButton from "../../../HTML/FintooButton";
import { useSearchParams } from "react-router-dom";

const ModalProfileComplete = ({showModal, setShowModal, condition,handleChange,handleChange1}) => {
  const [searchParams] = useSearchParams();
  // const minorValue = searchParams.get('minor');
  const urlParams = new URLSearchParams(window.location.search);
  const minorParam = urlParams.get('minor');
  
  return (
    <Modal
      backdrop="static"
      size="lg"
      centered
      show={showModal}
      className="profile-popups sign-popup"
      onHide={() => {
        setShowModal(false);
      }}
    >
      {/* <Modal.Header closeButton>
        <Modal.Title id="example-custom-modal-styling-title">Passport front</Modal.Title>
        </Modal.Header> */}
      <Modal.Body>
        <div className="modal-body-box">
          <h2 className="pt-3 pb-0 text-center">Profile Completed</h2>
          {condition === true && (
            <>
              <div className="pt-3 pb-3 ">
                <div className="img-box9 pt-4 inv-sign-border text-center">
                  <img
                    className="img-fluid inv-img-86"
                    src={
                      process.env.REACT_APP_STATIC_URL +
                      "media/DMF/temp_img_8865.svg"
                    }
                  />
                </div>
              </div>
              <h3 className="pt-2 pb-0 text-center ">
                Hi, congratulations your profile has been completed
              </h3>
              <div className="pb-3 pt-2">
                <FintooButton
                  onClick={() => handleChange()}
                  title={"Start Investment"}
                />
              </div>
            </>
          )}
          {condition === false && (
            <>
              <div className="pt-3 pb-3 ">
                <div className="img-box9 pt-4 inv-sign-border text-center">
                  <img
                    className="img-fluid inv-img-iqc"
                    src={
                      process.env.REACT_APP_STATIC_URL +
                      "media/DMF/temp_img_548.svg"
                    }
                  />
                </div>
              </div>
            {minorParam === '1' ?(
              <h3 className="pt-2 pb-0 text-center ">
              Congratulations on completing your profile creation! <br />Account verification for minor or NRI clients will take 24 hours. Once verified, we'll notify you through your registered email. Meanwhile, feel free to explore other Fintoo products.
              </h3>
              ):(
              <h3 className="pt-2 pb-0 text-center ">
                Hi, congratulations your profile has been completed. <br /> We
                require 24 to 48 hours for KYC verification. Meanwhile, you can
                explore other Fintoo products.
              </h3>
              )}
              <div className="pb-3 pt-3">
                <FintooButton
                  onClick={() => {
                    handleChange1();
                  }}
                  title={"Continue"}
                />
              </div>
            </>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalProfileComplete;
