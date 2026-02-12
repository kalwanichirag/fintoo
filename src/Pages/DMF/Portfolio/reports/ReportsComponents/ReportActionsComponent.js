import Styles from "../../report.module.css";
import React, { useEffect, useRef, useState } from "react";
import { apiCall, getCurrentUserDetails, getUserId } from "../../../../../common_utilities";
import axios from "axios";
import { DATA_BELONGS_TO } from "../../../../../constants";
import { useDispatch } from "react-redux";

function ReportActionsComponent(props) {
  const dispatch = useDispatch();
  const [fileCG, setFileCG] = useState();
  const cgDownloadRef = useRef();

  const ExcelReport = async () => {
    try {
      let usrdetails = await getCurrentUserDetails();

      let data = {
        user_id: getUserId(),
        data_belongs_to: DATA_BELONGS_TO,
        fund_registrar: "all",
        report_type: "csv",
        user_pan: usrdetails['pan']
      }
     
      // let url = DMF_EXCEL_REPORT;
      let url = '';
      let response = await apiCall(url, data, true, true);

     
      if (response['error_code'] == '100') {
        const excelResponse = await fetch(response.data);
        const blobData = await excelResponse.blob();
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "Excel report generated Sucessfully...",
            type: "success",
            autoClose: 3000,
          },
        });
        const url = window.URL.createObjectURL(blobData);
        const link = document.createElement('a');
        link.href = url;

        link.setAttribute('download', 'Summary_Report.xlsx'); 
        document.body.appendChild(link);
        link.click();
        
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
        cgDownloadRef.current.removeAttribute("disabled");
       
      }
    }
    catch (e) {
      console.log("catch", e);
    }


  }


  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }} className={`${Styles.categoriesDateAndActionsContainer}`}>
      <div className={`${Styles.textLight1}`}>
        {/* Report Generated on <span className={`${Styles.ReportLabel}`}>31/11/2023</span> */}
      </div>
      <div className={`${Styles.textGrayNormal}`}>
        Share Now <span>
          <span className={`${Styles.reportActionsShare}`} style={{ position: 'relative' }}> <img width={15} src={
            process.env.PUBLIC_URL +
            "/static/media/DMF/Report/share.svg"
          } alt="" />
            <div className={`${Styles.reportActionsPopOver}`}>
              <div className={`${Styles.reportPopOverAction}`}>
                <img width={15} src={
                  process.env.PUBLIC_URL +
                  "/static/media/DMF/Report/email.svg"
                } alt="" style={{ cursor: 'pointer' }} />
                <div>Share via Mail</div>
              </div>
              <div className={`${Styles.reportPopOverAction}`}>
                <img width={15} src={
                  process.env.PUBLIC_URL +
                  "/static/media/DMF/Report/whatsapp.svg"
                } alt="" style={{ cursor: 'pointer' }} />
                <div>Whatsapp</div>
              </div>
            </div>
          </span>
        </span> | Download Report <span>
          <span className={`${Styles.reportActionsShare}`} style={{ position: 'relative' }}> <img width={15} src={
            process.env.PUBLIC_URL +
            "/static/media/DMF/Report/download.svg"
          } alt="" />
            <div className={`${Styles.reportActionsPopOver}`}>
              <div className={`${Styles.reportPopOverAction}`}>
                <span className="pointer" style={{ textDecoration: 'none' }} onClick={ExcelReport}>
                  <img width={15} src={
                    process.env.PUBLIC_URL +
                    "/static/media/DMF/Report/Excel.svg"
                  } alt="" style={{ cursor: 'pointer' }} />
                </span>
                <div>Excel</div>
              </div>
              <div className={`${Styles.reportPopOverAction}`} >
                <span href="/path/to/download/report" style={{ textDecoration: 'none' }}>
                  <img width={15} src={
                    process.env.PUBLIC_URL +
                    "/static/media/DMF/Report/pdf.svg"
                  } alt="" style={{ cursor: 'pointer' }} />
                </span>

                <div>PDF</div>
              </div>
            </div>

          </span>

        </span>
      </div>
    </div>
  );
}

export default ReportActionsComponent;
