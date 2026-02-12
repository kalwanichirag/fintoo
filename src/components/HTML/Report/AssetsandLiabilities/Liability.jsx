import React, { useEffect, useState } from "react";
import { ADVISORY_GET_LIABILITY_DATA, imagePath } from "../../../../constants";
import {
  apiCall,
  fetchEncryptData,
  numberFormat,
  rsFilter,
} from "../../../../common_utilities";
import moment from "moment";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import LiabilityMatrix from "../../../../Assets/Datagathering/Graph/LiabilityMatrix";

function Liability(props) {
  const [liabilitysectiondata, setLiabilitysectiondata] = useState("");
  const [seprateliabilty, setSeprateliabilty] = useState([]);
  const [liabilitygraphdata, setLiabilitygraphdata] = useState([]);
  const session = props.session;

  useEffect(() => {
    getliabilityApi();
  }, []);

  const getliabilityApi = async () => {
    try {
      var payload = {
        method: "post",
        url: ADVISORY_GET_LIABILITY_DATA,
        data: {
          fp_log_id: session["fp_log_id"],
          user_id: session["id"],
          fp_user_id: session["fp_user_id"],
        },
      };
      let getliabilitydata = await fetchEncryptData(payload);
      if (getliabilitydata["error_code"] == "100") {
        setSeprateliabilty(getliabilitydata["data"]["separate_liabilty"]);
        setLiabilitysectiondata(getliabilitydata["data"]["section_text"]);
        var liability_data = getliabilitydata["data"]["liabilitydata"];
        var liability_graph_data = [];
        liability_data
          .sort(function (a, b) {
            return a.category_name - b.category_name;
          })
          .reverse();
        liability_data.map((val) => {
          if (val != undefined) {
            var index = liability_graph_data.findIndex(
              (item) => item.name === val["category_name"]
            );

            if (index !== -1) {
              liability_graph_data[index].y +=
                val["liability_outstanding_amount"];
            } else {
              liability_graph_data.push({
                name: val["category_name"],
                y: val["liability_outstanding_amount"],
              });
            }
          }
        });
        setLiabilitygraphdata(liability_graph_data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <div className="lifeInsuranceHolderBoxInner ">
        {seprateliabilty && seprateliabilty.length > 0 ? (
          <div>
            <h4 className="rTitle">
              <img
                ng-src="/static/media/DG/reports/assets-liabilities/liability-statement.svg"
                className="title-icon"
                src={ imagePath + "/static/media/DG/reports/assets-liabilities/liability-statement.svg"}
              />{" "}
              Your Liability statement
            </h4>
            <div className="rContent ">
              <p
                dangerouslySetInnerHTML={{
                  __html: liabilitysectiondata ? liabilitysectiondata : "",
                }}
              ></p>
            </div>
            <div className="rTable table-responsive">
              {seprateliabilty &&
                seprateliabilty.map((val) => (
                  <div className="recomm-box ">
                    <span className="green cardBox ">
                      {val.member_id[0].name}
                    </span>
                    <table className="bgStyleTable">
                      <tbody>
                        <tr>
                          <th>Name of Liability</th>
                          <th>Sub-Category</th>
                          <th>Interest Rate (%)</th>
                          <th>EMI (₹)</th>
                          <th>Current Outstanding (₹)</th>
                          <th>End Date</th>
                        </tr>
                        {val.member_id &&
                          val.member_id.map((data) => (
                            <tr className="">
                              <td className="">{data.liability_name}</td>
                              <td className="">{data.category_name}</td>
                              <td className="">{data.liability_emi_rate}</td>
                              <td className="">
                                {numberFormat(data.liability_emi,0)}
                              </td>
                              <td className="">
                                {numberFormat(data.liability_outstanding_amount,0)}
                              </td>
                              <td className="">
                                {data.liability_end_date &&
                                  moment(data.liability_end_date).format(
                                    "DD/MM/YYYY"
                                  )}
                              </td>
                            </tr>
                          ))}

                        <tr className="bold top-line total-value">
                          <td colSpan={4}>Total Liability</td>

                          <td colSpan={2} className="">
                            {numberFormat(val.total_liablity_sum,0)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ))}
            </div>
            <div className="graphSection rGraph row justify-content-center">
              <div
                id="assetMatrix"
                className="col-md-6 d-flex justify-center aligns-center"
              >
                {/* <div className="text-center">
                  <h4>Liability Matrix</h4>
                </div> */}
                <div className="mt-4">
                  <LiabilityMatrix liabilitygraphdata={liabilitygraphdata} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-data-found text-center">
            <div className="container">
              <div className="row justify-content-center align-items-center">
                <div className="col-md-10">
                  <img
                    alt="Data not found"
                    src={ imagePath + "/static/media/DG/data-not-found.svg"}
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
                    href="/web/datagathering/assets-liabilities"
                    target="_blank"
                    className="link"
                  >
                    Complete Liabilities
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
                    onClick={() => props.settab1("tab1")}
                  >
                    <FaArrowLeft />
                    <span className="hover-text">&nbsp;Previous</span>
                  </div>
                  <div
                    className="next-btn form-arrow d-flex align-items-center"
                    onClick={() => props.settab1("tab3")}
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

export default Liability;
