import { React, useEffect, useState } from "react";
import Styles from "./NSDL_CSDL/style.module.css";
import pmc from "../../../components/Layout/Portfolio/portfolio.module.css";
import Select from "react-select";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import { apiCall } from "../../../common_utilities";
import { useDispatch } from "react-redux";
function Uniquepannotfoundmodal(props) {
  const [selectedMember, setSelectedMember] = useState(0);
  const [ecasFamilyData, setECASFamilyData] = useState([]);
  const dispatch = useDispatch();
  const assignasset = async (pan_number, member_id, flag = null) => {
    try {
      if (flag == 1) {
        var data = {
          user_id: props.session.data.id,
          fp_log_id: props.session.data.fp_log_id,
          fp_user_id: props.session.data.fp_user_id,
          member_id: member_id,
          pan: pan_number,
          flag: flag,
        };
      } else if (flag == 2) {
        var data = {
          user_id: props.session.data.id,
          fp_log_id: props.session.data.fp_log_id,
          fp_user_id: props.session.data.fp_user_id,
          member_id: -1,
          pan: pan_number,
          flag: flag,
        };
      } else {
        var data = {
          user_id: props.session.data.id,
          fp_log_id: props.session.data.fp_log_id,
          fp_user_id: props.session.data.fp_user_id,
          member_id: member_id,
          pan: pan_number,
        };
      }

      var checkpan_data = { uid: props.session.data.id, pan: pan_number };
      var pan_exists = await apiCall(
        '',
        checkpan_data,
        false,
        false
      );
      if (pan_exists["error_code"] == "100") {
        if (pan_exists.data == true && flag != 1) {
          props.showuniqueUANModalclose();
          toastr.options.positionClass = "toast-bottom-left";
          toastr.error("Pan already exists.");
        } else {
          var assign_member = await apiCall(
            ADVISORY_ASSIGN_ECAS_MEMBER,
            data,
            false,
            false
          );
          if (assign_member["error_code"] == "100") {
            props.showuniqueUANModalclose();
            toastr.options.positionClass = "toast-bottom-left";
            toastr.success("Document uploaded successfully.");
            dispatch({ type: "ASSETS_UPDATE", payload: true });
          } else {
            props.showuniqueUANModalclose();
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error("Something Went Wrong.");
          }
        }
      } else {
        props.showuniqueUANModalclose();
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Something Went Wrong.");
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const filterdata = props.familyData.filter(
      (v) => v.value != 0 && v.value != props.session.data.fp_user_id
    );
    setECASFamilyData(filterdata);
  }, [props?.familyData]);

  return (
    <div>
      <div className="" style={{ padding: "0 !important" }}>
        <div className="">
          <div className="RefreshModalpopup_Heading col-11 d-flex justify-content-center">
            <span>Unique PAN Found !</span>
          </div>
          <div className={`${Styles.modalBody}`}>
            {props.familyecas.length >= 1 && (
              <>
                <div className={`${Styles.modalnoteText}`}>
                  Are you sure you want to unlink your fetched equities
                </div>
                <div className={`${Styles.modalnoteText}`}>
                  Note: Once unlinked you wont be updated on your investment
                </div>
              </>
            )}
            {props.familyecas &&
              props.familyecas.length >= 1 &&
              props.pannumbers &&
              props.pannumbers.map((pan, index) => {
                return (
                  <>
                    <div key={index} className={`${pmc.FormsFillup} w-100`}>
                      <div className="mt-md-3">
                        <div className="">
                          <span className={`text-black ${pmc.FormlableName}`}>
                            PAN *
                          </span>
                          <br />
                          <input
                            placeholder="Enter Your PAN"
                            className={`${pmc.inputs} w-100`}
                            type="text"
                            value={pan.asset_pan}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="mt-md-4">
                        <span className={`text-black ${pmc.FormlableName}`}>
                          Who Is This investment For?
                        </span>
                        {ecasFamilyData && (
                          <Select
                            style={{
                              width: "100% !Important",
                            }}
                            classNamePrefix="sortSelect"
                            isSearchable={false}
                            options={ecasFamilyData}
                            onChange={(e) => {
                              setSelectedMember(e.value);
                            }}
                            value={ecasFamilyData.filter(
                              (v) => v.value == selectedMember
                            )}
                          />
                        )}
                      </div>
                      <div className="mt-4">
                        Note : Are you sure you want to unlink your fetched
                        equities
                      </div>
                      <div className="ButtonBx d-flex justify-content-center">
                        <button
                          className="Unlink"
                          onClick={() => {
                            assignasset(
                              pan.asset_pan,
                              selectedMember
                              // props.memberdataid[
                              //   "familydata_ecas_" + pan.asset_pan
                              // ]
                            );
                          }}
                        >
                          Submit
                        </button>
                        <button
                          className="Cancel"
                          onClick={() => {
                            assignasset(
                              pan.asset_pan,
                              selectedMember,
                              // props.memberdataid[
                              //   "familydata_ecas_" + pan.asset_pan
                              // ],
                              1
                            );
                          }}
                        >
                          Skip
                        </button>
                      </div>
                    </div>
                  </>
                );
              })}

            {props.familyecas && props.familyecas.length == 0 && (
              <>
                <div className={`${pmc.FormsFillup} w-100`}>
                  <div className="col-md-12">
                    <p>
                      We have found a unique PAN that is not linked with any
                      member.
                    </p>
                    <p>
                      You can either leave it unassigned or manually assign it
                      to the respective
                    </p>
                    <p>
                      member by using the ‘Edit’ option in the ‘Assets’ section.
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <ol>
                    {props.pannumbers &&
                      props.pannumbers.map((pan) => {
                        <li>{pan.asset_pan}</li>;
                      })}
                  </ol>
                </div>
                <div className="ButtonBx d-flex justify-content-center">
                  <button
                    className="Unlink"
                    onClick={() => {
                      // assignasset(props.pannumbers, 0, 2);

                      const assetPan = props.pannumbers[0]?.asset_pan; 
                      assignasset(assetPan, 0, 2);
                    }}
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Uniquepannotfoundmodal;
