import { useEffect, useState } from "react";
import Styles from "./style.module.css";
const Stepper = ({ stepnumber, text1, text2, isActive, isNumberMatched, currentPopup, handlecColorChange, cdslNsdlResponse }) => {

  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if ((cdslNsdlResponse?.nsdl ?? []).length === 0 && (cdslNsdlResponse?.cdsl ?? []).length === 0) {
      setVerified(false)
    }
    else {
      setVerified(true)
    }
  }, [cdslNsdlResponse]);

  return (
    <>
      <div
        className={`${Styles.Stepper}   
        ${isActive ? `${Styles.boxactive} custom-boxactive` : `${Styles.boxinactive} custom-boxinactive`} 
        ${isActive
            ? stepnumber === "3" && currentPopup === 0
              ? verified
                ? `${Styles.boxactive} custom-boxactive`
                : Styles.verifiedstep
              : `${Styles.boxactive} custom-boxactive`
            : `${Styles.boxinactive} custom-boxinactive`}`
        }
      >
        <div className={`${Styles.Stepperlist}`}>
          <div className={`${Styles.progressbox} custom-progressbox`}>{stepnumber}</div>
          <div className={`${Styles.rightSection}`}>
            <div style={{ color: isActive ? "#042b62" : "#99A1B7" }} className={`${Styles.stepTitle} custom-color`}>{text1}</div>
            <div style={{ color: "#B5B5C3"}} className={`${Styles.stepsubTitle}`}>{text2}</div>
          </div>
        </div>
      </div >

      {/* <div className={`d-md-none d-block ${Styles.stepperMobile}`}>
        <div>
          <div
            className={`${Styles.boxactive}`}
          >
            <div className={`d-grid justify-content-between ${Styles.Stepperlist}`}>
              <div className={`${Styles.progressbox}`}> <span style={{ transform: 'rotate(90deg)' }}>{stepnumber}</span> </div>
            </div>
          </div >
         
        </div>
      </div> */}
    </>
  );
};
export default Stepper;
