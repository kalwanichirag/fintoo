import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { ADVISORY_REALESTATE_INVESTMENT_API, imagePath } from "../../../../constants";
import { fetchEncryptData, numberFormat } from "../../../../common_utilities";

function Realestate(props) {
  const [realestatedata, setRealestatedata] = useState([]);
  const [screenheader, setScreenheader] = useState("");

  const session = props.session;
  useEffect(() => {
    getrealestateInvestmentApi();
  }, []);

  const getrealestateInvestmentApi = async () => {
    try {

      var payload = {
        method: "post",
        url: ADVISORY_REALESTATE_INVESTMENT_API,
        data: { fp_log_id: session["fp_log_id"], user_id: session["id"] },
      };
      let getrealestatedata = await fetchEncryptData(payload);
      if (getrealestatedata["error_code"] == "100") {
        setScreenheader(getrealestatedata.screen_header1);
        setRealestatedata(getrealestatedata.data);

      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div>
      <div className="pageHolder currentDebtPolicies ">
        {realestatedata && realestatedata.length > 0 ? (
          <div>
            <h4 className="rTitle">
              <img
                className="title-icon"
                src={imagePath + "/static/media/DG/reports/current-investments/real-estate.svg"}
              />
              Your Real Estate Summary
            </h4>
            <div className="rContent ">
              <p
                dangerouslySetInnerHTML={{
                  __html: screenheader ? screenheader : "",
                }}
              ></p>
            </div>
            <div className="table-responsive rTable">
              {realestatedata &&
                realestatedata.map((val) => (
                  <div className="recomm-box ">
                    <span className="green cardBox ">
                      {val.member_id[0].nameofUser}
                    </span>
                    <div className="table-responsive rTable ">
                    <table className="bgStyleTable asset-table">
                      <tbody>
                        <tr>
                          <th>Name of Assets</th>
                          <th>Sub - Category</th>
                          <th>Residential Type</th>
                          <th>Mortgage or Freehold</th>
                          <th>Invested Amount (₹)</th>
                          <th>Current Value (₹)</th>
                          <th>Absolute Return (%)</th>
                        </tr>
                        {val.member_id &&
                          val.member_id.map((data) => (
                            <tr className="tabledata">
                              <td className="">{data.asset_name}</td>
                              <td className="">{data.category_name}</td>
                              <td className="">{data.residential_type}</td>
                              <td className="">{data.asset_type}</td>
                              <td className="">{numberFormat(data.asset_purchase_amount,0)}</td>
                              <td className=""> {numberFormat(data.asset_amount,0)}</td>
                              <td className="">{data.absolute_return}</td>
                            </tr>
                          ))}

                        <tr className="bold top-line total-value">
                          <td colSpan={4}>Total</td>
                          <td className="">{numberFormat(val.total_purchase_amount,0)}</td>
                          <td className="">{numberFormat(val.total_current_amount,0)}</td>
                          <td className="">{val.total_absolute_val}</td>
                        </tr>
                      </tbody>
                    </table>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div
            className="no-data-found text-center"
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
                    href="/web/datagathering/assets-liabilities"
                    target="_blank"
                    className="link"
                  >
                    Complete asset
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
                    onClick={() => props.settab("tab10")}
                  >
                    <FaArrowLeft />
                    <span className="hover-text">&nbsp;Previous</span>
                  </div>
                  {/* <button className="default-btn gradient-btn save-btn">
                                  Save & Add More
                                </button> */}
                  <div
                    className="next-btn form-arrow d-flex align-items-center "
                    onClick={() => props.settab("tab12")}
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

export default Realestate;
