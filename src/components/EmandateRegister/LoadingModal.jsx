import { useState } from "react";
import { Modal } from "react-bootstrap";
import Bankbalance from "../../Pages/datagathering/BankCashbalance/Bankbalance.module.css";
import transactioncss from "../Pages/Transaction/transaction.module.css";
import commonEncode from "../../commonEncode";
import axios from "axios";
import FintooLoader from "../FintooLoader";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  apiCall,
  getItemLocal,
  getUserId,
  errorAlert,
} from "../../common_utilities";
import { DATA_BELONGS_TO } from "../../constants";
import { PlaceOrder } from "../../FrappeIntegration-Services/services/investment-api/investmentService";
const LoadingModal = ({ showModal, setShowModal, mandatelink, mandateid, bank_id }) => {

  const MandateId = getItemLocal("mandateid");
  const BankID = getItemLocal("bank_id");

  const [openModalByName, setOpenModalByName] = useState("");

  const [progress, setProgress] = useState(0);

  const size = 150;
  const trackWidth = 10;
  const indicatorWidth = 10;
  const trackColor = `#f0f0f0`;
  const indicatorColor = `#042b62`;
  const indicatorCap = `round`;
  const spinnerMode = false;
  const spinnerSpeed = 1;

  const center = size / 2;
  const radius =
    center - (trackWidth > indicatorWidth ? trackWidth : indicatorWidth);
  const dashArray = 2 * Math.PI * radius;
  const dashOffset = dashArray * ((100 - progress) / 100);
  const [loader, setloader] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userid = getUserId();
  const placeorder = async () => {
    if(window.location.href.includes("placeorder=1")) {
      let data = {
        user_id: userid,
        bank_id: BankID ? BankID : atob(bank_id),
        mandate_type: "N",
        payment_mode: "mandate",
        payment_type: "mandate",
        mandate_id:  MandateId ? MandateId : mandateid,
        data_belongs_to: DATA_BELONGS_TO,
        purchase_type: "sip"
      };
      setloader(true);
      var res = await PlaceOrder(data);
      if (res.status_code == 200) {
        setloader(false);
        dispatch({ type: "FORCE_UPDATE_CART_COUNT", payload: true });
        navigate(`${process.env.PUBLIC_URL}/direct-mutual-fund/PaymentSucess`);
      } else {
        navigate(
          process.env.PUBLIC_URL + "/direct-mutual-fund/PaymentFailed?a=Mandate"
        );
      } 
    } else {
      navigate(process.env.PUBLIC_URL + "/direct-mutual-fund/profile/dashboard/bankaccount");
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: 'Your newly added bank mandate is under process.', type: "success" },
      });
    }
  };

  return (
    <>
      {/* Verification Link Generated Popup */}
      <Modal
        className="popupmodal2 Consent_Denied_popup"
        centered
        show={showModal}
        // onHide={() => {
        //     setShowModal(false);
        //     // closeTimerAndNext();
        // }}
      >
        <Modal.Header className="text-center">
          <div
            className="modal-title text-center  w-100"
            style={{ fontWeight: "bold" }}
          >
            Verification Link Generated
          </div>
        </Modal.Header>
        <div className={`p-4 d-grid place-items-center align-item-center`}>
          <div className={`${Bankbalance.ApprovedConsentData}`}>
            <div>
              <img
                src={
                  process.env.REACT_APP_STATIC_URL +
                  "media/DMF/Verification_Successful.svg"
                }
                className={`${transactioncss.DataSuccessimg}`}
              />
            </div>
          </div>
          <div className=" HeaderModal">
            <div className={`${transactioncss.modalDescription}`}>
              Please click on below button and follow instructions from your
              bank to setup the auto-pay
            </div>
          </div>
          <div className={`${transactioncss.VerifyButtons}`}>
            <button
              onClick={() => {
                window.open(mandatelink, "Popup", "width=800,height==800");
                placeorder();
              }}
            >
              Verify
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default LoadingModal;
