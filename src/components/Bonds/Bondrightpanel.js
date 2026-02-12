import React, { useEffect, useState } from "react";
import Styles from "./Bonds.module.css";
import { useDispatch } from "react-redux";
import BondCalculator from "./BondCalculator";
import Modal from "react-responsive-modal";
function Bondrightpanel() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const onCloseModal = () => {
    setOpen(false);
  };
  const onClick = () => {
    dispatch({ type: "OPENCHATBOT", payload: true });
  };
  return (
    <div className={`${Styles.bondRightSection}`}>
      <div className={`d-md-block d-none text-center ${Styles.bondAskfintoo}`}>
        <p>
          Wise Spending is part of wise investing, and it's never too late to
          start
        </p>
        <div>
          <button onClick={onClick}>Ask Fintoo</button>
        </div>
      </div>
      <div className="d-md-block d-none">
        <BondCalculator />
      </div>
      <div className={`d-md-block d-none ${Styles.DisclaimerSection}`}>
        <div className={`${Styles.DisclaimHead}`}>Disclaimer</div>
        <div className={`pt-2 ${Styles.Disclaimtxt}`}>
          The actual calculations may vary based on actual interest Payment date
          and Reedemption payment frequency
        </div>
        <br />
        <br />
        <br />
        <br />
      </div>
      <Modal open={open} showCloseIcon={false} center>
        <div>
          <BondCalculator onCloseModal={onCloseModal}/>
        </div>
      </Modal>
      <div className="d-md-none d-block">
        <div className={`${Styles.mobileBondOptions}`}>
          {/* <button onClick={onClick}>Ask Fintoo</button> */}
          <button style={{
            outline : "none"
          }} onClick={()=>{
            setOpen(true);
          }}>Calculator</button>
        </div>
      </div>
    </div>
  );
}

export default Bondrightpanel;
