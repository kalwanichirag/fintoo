import { Modal } from "react-bootstrap";
import FintooButton from "../../../HTML/FintooButton";

const ModalProfileError = ({showModalfalse, popupTitleError, popupDescError,handleChange,handleChange1}) => {
  return (
    <Modal
      backdrop="static"
      size="lg"
      centered
      show={showModalfalse}
      className="profile-popups sign-popup"
    >
      <Modal.Body>
        <div className="modal-body-box">
          <h2 className="pt-3 pb-0 text-center">{popupTitleError}</h2>

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
            <h3 className="pt-2 pb-0 text-center ">{popupDescError}</h3>
            <div className="pb-3 pt-3">
              <FintooButton
                onClick={() => {
                  handleChange1();
                }}
                title={"Continue"}
              />
            </div>
          </>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default ModalProfileError;
