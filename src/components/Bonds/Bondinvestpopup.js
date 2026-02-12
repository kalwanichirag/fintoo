import React from 'react'
import { SlClose } from "react-icons/sl";
import { Link } from "react-router-dom";
import Styles from '../Stocks/IPOStock/style.module.css'
function Bondinvestpopup(props) {
  return (
    <div className={`${Styles.ipomodal}`}>
    <div className={`${Styles.Popupclose}`}>
      <SlClose onClick={props.onCloseModal} />
    </div>
    <div className="text-center">
      <div className={` ${Styles.popupTxt}`}>Bond Request Recieved</div>
      <div className={`${Styles.poplabel}`}>
        You will receive a call from us shortly <br /> to complete the
        process.
      </div>
      <div className={`${Styles.iporeqdetails}`}>
        <div className={`${Styles.ipoName}`}>Andhra Pradesh Region Development Authority</div>
        <hr />
        <div className="pt-2 d-flex justify-content-between">
          <div className={`${Styles.ipolabel}`}>Face alue</div>
          <div className={`${Styles.ipodate}`}>₹ 10,00,000</div>
        </div>
        <div className="d-flex justify-content-between mt-3">
          <div className={`${Styles.ipolabel}`}>YTM</div>
          <div className={`${Styles.ipodate}`}>8.05%</div>
        </div>
        <div className="d-flex justify-content-between mt-3">
          <div className={`${Styles.ipolabel}`}>Credit Rating</div>
          <div className={`${Styles.ipodate}`}>AAA</div>
        </div>
        <div className="d-flex justify-content-between mt-3">
          <div className={`${Styles.ipolabel}`}>Maturity Date</div>
          <div className={`${Styles.ipodate}`}>31st July 2028</div>
        </div>
      </div>
      <div className={`${Styles.ipoOkbtn}`}>
        <div onClick={props.onCloseModal}>
          <button>Ok</button>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Bondinvestpopup