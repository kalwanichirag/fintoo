import BootStrapModal from "react-bootstrap/Modal";
import style from "./style.module.css";
import { useState } from "react";
import { apiCall, getParentUserId } from "../../common_utilities";
import commonEncode from "../../commonEncode";
import FintooLoader from "../FintooLoader";
import { Link } from "react-router-dom";
import * as toastr from "toastr";
import "toastr/build/toastr.css";

const DownloadModal = ({ 
  show, 
  onHide, 
  ssessiondata, 
  downloadReport, 
  summaryReport, 
  detailedReport, 
  summaryEmail, 
  detailedEmail,
  spinner,
  spinneremail,
  setSpinner,
  setSpinneremail
}) => {
  const [reportValue, setReportValue] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const handleDownloadReport = async () => {
    if (reportValue === 1) {
      // Download Report - using Summary Report
      await summaryReport();
    } else if (reportValue === 2) {
      // View Report - using Detailed Report  
      // await detailedReport();
      window.location.href = `${process.env.PUBLIC_URL}/report/intro`
    }

    onHide();
  };
  const deleteParReportCookie = (name) => {
    localStorage.removeItem(name)
  };
  return (
    <>
    <FintooLoader isLoading={isLoading} />
    <BootStrapModal show={show} centered>
      <BootStrapModal.Body>
        <div className={style.row}>
          <div className="row">
            <div className="col-12">
              <div className="row">
                {/* <div className="col-md-4">Report Type:</div> */}
                <div className="col-md-6">
                  <div className="d-flex justify-content-center">
                    <input
                      type="radio"
                      name="dwn_opt_report"
                      value={reportValue}
                      onChange={()=>{
                        setReportValue(1)
                      }}
                      checked={reportValue == 1}
                      id="DownloadReport"
                    />
                    <label for="DownloadReport"  className="ps-2 pointer">Download Report</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex justify-content-center">
                    <input
                      type="radio"
                      name="dwn_opt_report"
                      id="View_Report"
                      value={reportValue}
                      onChange={()=>{
                        setReportValue(2)
                      }}
                      checked={reportValue == 2}
                    />
                    <label for="View_Report" className="ps-2 pointer">View Report</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center">
          { reportValue == 1 &&
            <button type="button" className={style.outlineBtn} onClick={()=> handleDownloadReport()}>
                    Submit
            </button>
          }
          { reportValue == 2 &&
            <button type="button" className={style.outlineBtn} onClick={()=> handleDownloadReport()}>
              Submit
            </button>
          }
          <button type="button" className={style.outlineBtn} onClick={onHide}>
            Cancel
          </button>
        </div>
      </BootStrapModal.Body>
    </BootStrapModal>
    </>
  );
};
export default DownloadModal;
