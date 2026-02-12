import React from "react";
import { useEffect, useState, useRef } from "react";
import Styles from "./Style.module.css";
import { apiCall, getItemLocal, getUserId, getParentUserId, loginRedirectGuest } from "../../../common_utilities";
import { ADVISORY_INVOICE_API_URL, BASE_API_URL, CHECK_SESSION, DATA_BELONGS_TO, STATIC_URL, imagePath } from "../../../constants";
import FintooLoader from "../../../components/FintooLoader";
import { indianRupeeFormat } from "../../../common_utilities";
import { Getbillingdetails, GetInvoiceList } from "../../../FrappeIntegration-Services/services/payment-api/paymentapiService";


function Invoice() {
  const [invoicekey, setInvoiceKey] = useState('')
  const [invoice, setInvoice] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const userid = getParentUserId();
  const interval = useRef(null);
  useEffect(() => {
    get_invoice_list()
  }, [])

  useEffect(() => {
    setIsLoading(true)
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    if (!userid) {
      setIsLoading(false)
      loginRedirectGuest();
    }
    else {
      setIsLoading(false)
    }
  }, []);

  const get_invoice_list = async () => {
    try {

      let invoice_data_dict = await GetInvoiceList(getParentUserId(), DATA_BELONGS_TO);
      // let invoice_data_dict = await apiCall(ADVISORY_INVOICE_API_URL, payload_data, true, false);
      if (invoice_data_dict.status_code === 200) {
        setInvoice(invoice_data_dict.data)
      }
    }
    catch {
    }
  }

  return (
    <div>
      <FintooLoader isLoading={isLoading} />

      <div className={`col-md-12 ${Styles.InvoiceBox}`}

      >
        <h4>Completed Payments</h4>
        <div className={`${Styles.TableBox}`}>
          <table className={`${Styles.defaulttable}`}>
            <thead>
              <tr>
                <th style={{ width: "20%" }}>Service</th>
                <th style={{ width: "20%" }}>Plan Name</th>
                <th style={{ width: "20%" }}>Amount</th>
                <th style={{ width: "20%" }}>Invoice Date</th>
                <th style={{ width: "20%" }} className="text-center">Download</th>
              </tr>
            </thead>
            <tbody>
              {invoice.length > 0 ? (
                invoice.map((item, index) => (
                  <tr key={item.name || index}>
                    <td>Financial Planning</td>
                    {/* <td>{item.service_name_c || '-'}</td> */}
                    <td><span>{item.custom_plan_name || '-'}</span></td>
                    <td>{indianRupeeFormat(item.grand_total)}</td>
                    <td>{item.posting_date}</td>
                    <td className="text-center">
                        <a
                          href={item.invoice_file_url}
                          className="download"
                          download
                        >
                          <img
                            className="download-icon"
                            alt="Download"
                            src={`${process.env.REACT_APP_STATIC_URL}/media/download.svg`}
                          />
                        </a>
                      
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No Invoices.</td>
                </tr>
              )}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Invoice;