import { Modal as ReactModal } from "react-responsive-modal";

const SelectMemberModal = ({ isOpen, onClose }) => {
  return (<ReactModal
    classNames={{
      modal: "ModalpopupContentWidth",
    }}
    open={isOpen}
    showCloseIcon={false}
    center
    animationDuration={0}
    closeOnOverlayClick={true}
    onClose={onClose}
    large
  >
    <div className="text-center">
      <h3 className="HeaderText">Attention !</h3>
      <div className="">
        <div className="PopupImg" style={{ width: "40%", margin: "0 auto" }}>
          <img
            style={{ width: "100%" }}
            src={process.env.PUBLIC_URL + "/static/media/DMF/SelectingTeam.svg"}
          />
        </div>
        <div className="p-2">
          <p
            className="PopupContent"
            style={{
              fontSize: "1.3rem",
              fontWeight: "normal",
              padding: "0 1rem",
              width: "90%",
              margin: "0 auto",
            }}
          >
            Please select member from the dropdown to proceed.
          </p>
        </div>
        <div
          className="ButtonBx aadharPopUpFooter"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <button
            className="ReNew"
            onClick={() => {
              onClose();
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  </ReactModal>);
};

export default SelectMemberModal;
