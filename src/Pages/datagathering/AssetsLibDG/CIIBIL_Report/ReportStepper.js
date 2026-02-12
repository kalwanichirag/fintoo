import { useEffect, useState } from "react";
import Cibilreport from "./Cibil_Report.module.css";
const ReportStepper = ({ stepnumber, text1, text2, isActive, isLoading, cdslNsdlResponse }) => {

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
        className={`${Cibilreport.Stepper}  ${isActive ? Cibilreport.boxactive + " cibil_boxactive" :
         Cibilreport.boxinactive + " cibil_boxinactive"
          } ${isActive
            ? verified
              ? Cibilreport.boxactive
              : Cibilreport.boxactive
            : Cibilreport.boxinactive}`
        }
      >
        <div style={{ display: "flex", justifyContent: 'space-between', alignItems: "center" }}>
          <div className={`${Cibilreport.Stepperlist}`}>
            <div className={`${Cibilreport.progressbox} progressbox`}>{stepnumber}</div>
            <div className={`d-flex align-items-center ${Cibilreport.rightSection}`}>
              <div className={`${Cibilreport.stepTitle}`}>{text1}</div>
            </div>

          </div>
          {
            isLoading ? (
              <div style={{ marginTop: "2rem" }} className={`ms-2 ${Cibilreport.downloadSpinner}`}></div>
            ) : null
          }
        </div>
      </div >
    </>
  );
  {//console.log("isLoading", isLoading) 
  }

};
export default ReportStepper;
