import React, { useEffect, useState } from "react";
import Modal from "react-responsive-modal";
import BootStrapModal from "react-bootstrap/Modal";
import style from "./style.module.css";
import FintooLoader from "../FintooLoader";

import { fetchData } from "../../common_utilities";
import { Link } from "react-router-dom";


const KYCPopup = (props) => {
  const [modalStep, setModalStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
    <FintooLoader isLoading={isLoading}/>
    <div>
      <BootStrapModal
        className="Modalpopup"
        show={props.show}
        onHide={()=> {
          props.onHide();
        }}
        centered
      >
       <BootStrapModal.Header closeButton>
          <h2 className="text-center w-100">Attention !!</h2>
        </BootStrapModal.Header>
        <BootStrapModal.Body>
          <div className="p-2">
            <p className="PopupContent">
              In order to access your report, please{" "}
              {!props.kycDone && (
                <>
                  complete your{" "}
                  <Link
                    style={{textDecoration:"none"}}
                    to={
                      process.env.PUBLIC_URL +
                      "/datagathering/my-document"
                    }
                  >
                    KYC
                  </Link>{" "}
                  by uploading your <b>PAN</b> and <b>Aadhar</b> Details
                </>
              )}
            </p>
          </div>
        </BootStrapModal.Body>
      </BootStrapModal>
    </div>
    </>
    
  );
};

export default KYCPopup;
