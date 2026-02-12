import { useEffect, useState } from "react";
import Styles from "./style.module.css";
const MobileStepper = ({ stepnumber, isActive, currentPopup, cdslNsdlResponse }) => {
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if ((cdslNsdlResponse?.nsdl??[]).length === 0 && (cdslNsdlResponse?.cdsl??[]).length === 0) {
      setVerified(false)
    }
    else {
      setVerified(true)
    }
  }, [cdslNsdlResponse]);
  return (

    <>

      <div className={`d-md-none d-block ${Styles.stepperMobile}`}>
        <div>
          <div
            className={`${Styles.Stepper}  ${isActive ? Styles.boxactive : Styles.boxinactive
              } ${isActive
                ? stepnumber === "3" && currentPopup === 1
                  ? verified
                    ? Styles.boxactive
                    : Styles.verifiedstep
                  : Styles.boxactive
                : Styles.boxinactive}`
            }
          >
            <div className={`d-grid justify-content-between ${Styles.Stepperlist}`}>
              <div className={`${Styles.progressbox}`}> <span style={{ transform: 'rotate(90deg)' }}>{stepnumber}</span> </div>
            </div>
          </div >

        </div>
      </div>
    </>
  );
};
export default MobileStepper;
