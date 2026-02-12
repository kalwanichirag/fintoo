import { useEffect, useState } from "react";
import Styles from '../../moneymanagement.module.css';
const Trackbankstepper = ({ stepnumber, text1, text2, isActive, currentPopup, processcount }) => {
    const [verified, setVerified] = useState(false);

    return (
        <>
            <div
                className={`${Styles.Stepper}  ${isActive ? Styles.boxactive : Styles.boxinactive
                    } ${isActive
                        ? stepnumber === "3" && currentPopup === 0
                            ? verified
                                ? Styles.boxactive
                                : Styles.verifiedstep
                            : Styles.boxactive
                        : Styles.boxinactive}`
                }
            >
                <div className={`${Styles.Stepperlist}`}>
                    <div className={`${Styles.progressbox}`}>{stepnumber}</div>
                    <div className={`${Styles.rightSection}`}>
                        <div className={`${Styles.stepTitle} 
                        ${isActive ? Styles.textactive : Styles.textinactive
                            }
                        `}>{text1}</div>
                        <div className={`${Styles.stepsubTitle}`}>{text2}</div>
                    </div>
                </div>
            </div >
        </>
    );
};
export default Trackbankstepper;
