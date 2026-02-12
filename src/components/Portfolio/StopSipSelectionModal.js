import { Modal } from "react-bootstrap";
import FintooBackButton from "../HTML/FintooBackButton";
import FintooCheckbox from "../FintooCheckbox/FintooCheckbox";
import React from "react";
import { indianRupeeFormat, fetchEncryptData, getItemLocal } from "../../common_utilities";
import Table from "react-bootstrap/Table";
import style from "./otpmodal.module.css";
import Swal from "sweetalert2";
import { MaintenanceStatus } from "../../FrappeIntegration-Services/services/investment-api/investmentService";
import moment from "moment";
import axios from "axios";
import { CrmAPIEndPoints } from "../../constants";

const StopSipSelectionModal = ({ detailedMfPotfolio, setDetailedMfPotfolio, setOpenModalByName }) => {

  const toggleTrnxCheckbox = (v) => {
    setDetailedMfPotfolio(prev => {

      return {
        ...prev,
        sip_stp_swp_data: {
          ...prev.sip_stp_swp_data,
          sip_list: prev?.sip_stp_swp_data?.sip_list?.map(x => {

            return {
              ...x,
              checked:
                x.transaction_id === v.transaction_id
                  ? !Boolean(x.checked)
                  : x.checked
            };
          })
        }
      };
    });

  }


  const toggleeditTrnxCheckbox = (v) => {
    setDetailedMfPotfolio(prev => ({
      ...prev,
      sip_stp_swp_data: {
        ...prev.sip_stp_swp_data,
        sip_list: prev.sip_stp_swp_data.sip_list.map(x => ({
          ...x,
          editsipchecked: x.transaction_id === v.transaction_id ? !(Boolean(x.editsipchecked)) : x.editsipchecked
        }))
      }
    }));
  }

  const checkMaintenanceStatus = async (type) => {
    try {
      var config = {
        method: "get",
        url: CrmAPIEndPoints.MAINTENANCE_DETAILS
      };
      const maintenance_status = await axios(config);

      const dataArray = Array.isArray(maintenance_status?.data)
        ? maintenance_status.data
        : Array.isArray(maintenance_status?.data?.data)
          ? maintenance_status.data.data
          : [];

      const activeItem =
        dataArray.find(
          (item) =>
            item?.maintenance_for === type && Number(item?.is_active) === 1
        ) || {};

      return activeItem;
    } catch (e) {
      console.error("Error fetching maintenance status:", e);
      throw e; // Rethrow to indicate failure
    }
  };

  return (
    <>
      <Table responsive className="trx-tbl8">
        <thead>
          <tr>
            <th>SIP Amount</th>
            <th>SIP Date</th>
            {/* <th>Start Date</th> */}
            <th>End Date</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {(detailedMfPotfolio?.sip_stp_swp_data?.sip_list ?? []).map((v) => (<React.Fragment key={'k-' + v.transaction_id}>
            {/* {(detailedMfPotfolio?.fund_list ?? []).map((v) => (<React.Fragment key={'k-' + v.transaction_id}> */}
            <tr>
              <td>{indianRupeeFormat(v.cart_amount)}</td>
              <td>
                {moment(v.sip_start_date, "YYYY-MM-DD").format("Do")}
              </td>


              {/* <td>{moment(v.sip_start_date).format("DD-MM-YYYY")}</td> */}
              <td>{moment(v.sip_end_date).format("DD-MM-YYYY")}</td>
              <td scope="row" data-label="">
                <div className={`${style.SIPButtons}`}>
                  <div className="d-md-block d-none">
                    <button style={{ display: "none" }} onClick={() => {
                      toggleeditTrnxCheckbox(v)
                    }}>Edit SIP</button>
                    <button style={{ display: "none" }} onClick={() => {

                    }}>Skip SIP</button>

                    {getItemLocal("family") != 1 && v.cart_deleted == "N" ? (
                      <button
                        onClick={async () => {
                          const isMaintenanceDown = await checkMaintenanceStatus('maintenance');
                          if (Object.keys(isMaintenanceDown).length > 0) {
                            Swal.fire(isMaintenanceDown.description);
                            return;
                          }

                          let date1 = moment(v.sip_start_date, "YYYY-MM-DD")
                            .month(moment().month())
                            .year(moment().year());
                          let date2 = date1.clone().add(1, "month");
                          let days1 = date1.diff(moment(), "days");
                          let days2 = date2.diff(moment(), "days");

                          // if ((days1 > 0 && days1 <= 9) || (days2 > 0 && days2 <= 9)) {
                          //   Swal.fire({
                          //     title: "",
                          //     text: "Your SIP installment is due within the next 9 days. Please try placing the cancel request later.",
                          //     icon: "error",
                          //   });
                          //   return;
                          // }
                          toggleTrnxCheckbox(v);
                          setOpenModalByName("stop");
                        }}
                      >Stop SIP</button>
                    ) : (
                      <button className="disabled">Stop SIP</button>
                    )}

                  </div>
                  <div className="d-md-none d-block w-100">
                    <center>
                      <button onClick={() => {

                      }}>Manage SIP</button>
                    </center>
                  </div>
                </div>
              </td>
            </tr>
          </React.Fragment>))}

        </tbody>
      </Table>
    </>
  );
};
export default StopSipSelectionModal;
