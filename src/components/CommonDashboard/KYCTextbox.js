import React, { useEffect, useState } from "react";
import {
  fetchData,
  fetchEncryptData,
  getItemLocal,
  getParentUserId,
} from "../../common_utilities";
import BootStrapModal from "react-bootstrap/Modal";
import style from "./style.module.css";
import FintooLoader from "../FintooLoader";



const KYCTextbox = () => {
  const [kycDone, setKycDone] = useState(false);
  const [fpDone, setFPDone] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [sessiondata,setSessionData] = useState([])
  const [isLoading, setIsLoading] = useState(false);


  const getDocument = async () => {
    // try {
    //   var payload = {
    //     method: "POST",
    //     url: CHECK_SESSION,
    //     data: { user_id: getParentUserId(), sky: getItemLocal("sky") },
    //   };
    //   let session_data = await fetchEncryptData(payload);
    //   if (session_data["error_code"] == "100") {
    //     setSessionData(session_data.data)
    //     if (session_data.data.plan_payment_status == "1") {
    //       setPaymentDone(true);
    //     }
        
    //       const staticDate = new Date("10/01/2023")   // this date added for handle old user (1st Oct 2023)
    //       const plan_date = new Date(session_data.data.plan_date)
    //       if(plan_date>staticDate){
    //         var payload = {
    //           method: "POST",
    //           url: ADVISORY_GET_DOCUMENTS_API,
    //           data: {
    //             user_id: session_data.data.id,
    //             fp_log_id: session_data.data.fp_log_id,
    //           },
    //         };
    //         let get_document = await fetchEncryptData(payload);
    //         let showPopup = 0;
    //         if (get_document["error_code"] == "100") {
    //           if(session_data.data.plan_id=="31" && session_data.data.plan_payment_status=="1"){
    //             setFPDone(false);
    //             showPopup = 1;
    //           }
    //           const currentDate = new Date();
    //           for (const doc of get_document.data) {
    //             if (doc.doc_type === 167 || doc.doc_type === 168) {
    //               setKycDone(true);
    //             }
    //             const docAddedDate = new Date(doc.doc_added);
    //             if (docAddedDate < staticDate){
    //               if (doc.doc_type === 154 || doc.doc_type === 134){
    //                   setFPDone(true);
    //                   showPopup = 1;
    //               }
    //             }
    //             else{
    //                 if (doc.doc_type === 164) {
    //                   docAddedDate.setFullYear(docAddedDate.getFullYear() + 1);
    //                   if (docAddedDate > currentDate) {
    //                       setFPDone(true);
    //                       showPopup = 1;
    //                   }
    //                 }
    //             }
    //           }
    //           if (showPopup == 0) {
    //             setFPDone(true);
    //           }
    //         }
    //         else{
    //           setFPDone(false);
    //           setKycDone(false);
    //         }
    //         setKycDone(true); // remove this line after digi locker working
    //       }
    //       else{
    //         setFPDone(true);
    //         setKycDone(true);
    //       }
         
        
    //   }
    // } catch (e) {
    //   console.log(e);
    // }
  };

  const proceedFp = async ()=>{
    setIsLoading(true)
    // try{
    //   let fpBody = {
    //     user_id: sessiondata["id"].toString(),
    //     fp_log_id: sessiondata["fp_log_id"].toString(),
    //     flag: "fp",
    //   };
    //   let config = {
    //     method: "POST",
    //     url: ADVISORY_EXPERT_FP_DOC,
    //     data: fpBody,
    //   };
    //   let response = await fetchData(config);
    //   if (response["error_code"] == "100") {
    //     var b64FileString = response["data"]["b64_file_string"];
    //     let signDeskConfig = {
    //       method: "POST",
    //       url: ADVISORY_SIGNDESK_API_CALL,
    //       data: {
    //         user_id: sessiondata["id"],
    //         fp_log_id: sessiondata["fp_log_id"],
    //         file_content: b64FileString,
    //       },
    //     };
    //     let signDeskResponse = await fetchData(signDeskConfig);
    //     if (signDeskResponse["error_code"] == "100") {
    //       let widgetURL =
    //         signDeskResponse["details"]["signer_info"][0]["invitation_link"];
    //         setIsLoading(false)
    //         window.open(
    //           widgetURL,
    //           "_blank"
    //         );
    //     }
    //   }
    // }
    // catch (e){
    //   console.log(e)
    // }
  }
  useEffect(() => {
    getDocument();
  }, []);
  return (
    <>
    <FintooLoader isLoading={isLoading}/>
    <div>
      {paymentDone == true && (fpDone == false || kycDone == false) && (
        <div className="ExpirePopup">
          <div className="d-md-flex align-items-center">
            <div className="p-2 contentText">
              In order to access your report, please{" "}
              {!fpDone && (
                <>
                  accept your <a className="pointer custom-color" style={{color:"#0D6EFD",textDecoration:"none"}} onClick={()=> proceedFp()} >FP Agreement</a>{" "}
                </>
              )}
              {!fpDone && !kycDone && "and "}
              {!kycDone && (
                <>
                  complete your{" "}
                  <a
                    style={{textDecoration:"none"}}
                    className="custom-color"
                    href={
                      process.env.PUBLIC_URL +
                      "/datagathering/about-you/#completekyc"
                    }
                  >
                    KYC
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    
    </>
  );
};

export default KYCTextbox;
