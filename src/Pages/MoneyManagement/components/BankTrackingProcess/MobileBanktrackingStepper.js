import { useEffect, useState } from "react";
import Styles from "../../moneymanagement.module.css";
const MobileBanktrackingStepper = ({ stepnumber, isActive, currentPopup }) => {
  const [verified, setVerified] = useState(false);
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
export default MobileBanktrackingStepper;
