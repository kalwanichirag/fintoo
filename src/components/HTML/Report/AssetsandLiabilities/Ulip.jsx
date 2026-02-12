import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { imagePath } from "../../../../constants";
import { numberFormat, rsFilter } from "../../../../common_utilities";
import moment from "moment";

function Ulip(props) {
  const [insurancedata, setInsurancedata] = useState([]);
  const [insurancescreendata, setInsurancescreendata] = useState("");
  const [totalpremiumamt, setTotalpremiumamt] = useState(0);

  const session = props.session;
  useEffect(() => {
    getcurrentinsuranceApi();
  }, []);

  const getcurrentinsuranceApi = async () => {
    try {
      var payload = {
        method: "post",
        // url: ADVISORY_GET_CURRENTINSURANCE_API,
        url: '',
        data: { fp_log_id: session["fp_log_id"], user_id: session["id"] },
      };
 
      let getcurrinsurdata = await fetchEncryptData(payload);
      if (getcurrinsurdata["error_code"] == "100") {
        var insurancedataAll = [];
        var insuranceulip = [];

        setInsurancescreendata(
          getcurrinsurdata["rpdata_screendata"]["field1"]
        );
        insurancedataAll = getcurrinsurdata["data"];
        
        insurancedataAll.map((divs) => {
          if (divs["insurance_category_id"] == 44) {
            insuranceulip.push(divs);
          }
          setInsurancedata(insuranceulip);

          const totalpremiumamt = insuranceulip.reduce((total, val) => {
            const insurance_premium_amount = val["insurance_premium_amount"] || 0;
            return total + parseInt(insurance_premium_amount);
          }, 0);
          
          setTotalpremiumamt(totalpremiumamt);
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div>
      <div className="pageHolder currentInsurancePolicies ">
        {insurancedata && insurancedata.length > 0 ? (
          <>
            <h4 className="rTitle"  style={{}}>
              <img
                className="title-icon"
                src={ imagePath + "/static/media/DG/reports/current-investments/current-insurance-policies.svg"}
              />{" "}
              ULIP
            </h4>
            <div className="rContent " style={{}}>
            <p dangerouslySetInnerHTML={{ __html: insurancescreendata?insurancescreendata:'' }}></p>
            </div>
            <div className="table-responsive rTable" style={{}}>
              <table className="bgStyleTable asset-table">
                <tbody>
                  <tr>
                    <th>Policy name</th>
                    <th>Type</th>
                    <th>Name of Holder</th>
                    <th>Policy Start Date</th>
                    <th>Policy End Date</th>
                    <th>Sum Assured (₹)</th>
                    <th>Premium Payable (₹)</th>
                    <th>Premium Frequenc</th>
                  </tr>
                  {insurancedata &&
                    insurancedata.map((val) => (
                      <tr className="" style={{}}>
                        <td className="">{val.insurance_name}</td>
                        <td className="">{val.category_name}</td>
                        <td className="">{val.insurance_member_name}</td>
                        <td className="">{moment(val.insurance_purchase_date).format("DD/MM/YYYY")}</td>
                        <td className="">{moment(val.insurance_policy_enddate).format("DD/MM/YYYY")}</td>
                        <td className="">{numberFormat(val.insurance_sum_assured,0)}</td>
                        <td className="">{numberFormat(val.insurance_premium_amount,0)}</td>
                        <td className="">{val.payment_mode}</td>
                      </tr>
                    ))}

                  <tr className="bold top-line total-value">
                    <td colSpan={6}>Total</td>
                    <td className="">{numberFormat(totalpremiumamt,0)}</td>
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div
            className="no-data-found text-center"
            style={{}}
          >
            <div className="container">
              <div className="row justify-content-center align-items-center">
                <div className="col-md-10">
                  <img
                    alt="Data not found"
                    src={imagePath + "/static/media/DG/data-not-found.svg"}
                  />
               
                  <p>
                    Since you missed to fill in the required information which
                    is needed here, we are not able to show you this section.
                    Kindly click on below button to provide all the necessary
                    inputs. Providing all the information as asked will ensure
                    more accurate financial planning report. Once you fill in
                    the data, same will be reflected here.
                  </p>
                  <a
                    href="/web/datagathering/insurance"
                    target="_blank"
                    className="link"
                  >
                    Complete Insurance
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="row py-2">
          <div className=" text-center">
            <div>
              <div className="btn-container">
                <div className="d-flex justify-content-center">
                  <div
                    className="previous-btn form-arrow d-flex align-items-center"
                    onClick={() => props.settab("tab11")}
                  >
                    <FaArrowLeft />
                    <span className="hover-text">&nbsp;Previous</span>
                  </div>
                  {/* <button className="default-btn gradient-btn save-btn">
                                  Save & Add More
                                </button> */}
                  <div
                    className="next-btn form-arrow d-flex align-items-center"
                    onClick={() => props.settab1("tab2")}
                  >
                    <span className="hover-text" style={{ maxWidth: 100 }}>
                      Next&nbsp;
                    </span>
                    <FaArrowRight />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ulip;
