import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { apiCall, fetchEncryptData, getParentUserId, numberFormat, rsFilter } from "../../../../common_utilities";
import { ScrollToTop } from "../../../../Pages/datagathering/ScrollToTop"
import { DATA_BELONGS_TO, imagePath } from "../../../../constants";
import { GetAssetRecommendation } from "../../../../FrappeIntegration-Services/services/financial-planning-api/dgreport";
function Fintoorecommends(props) {
  const [recommdata, setRecommdata] = useState({});
  const [recommdataoi, setRecommdataoi] = useState([]);
  const [recommdataoc, setRecommdataoc] = useState([]);
  const [itot, setItot] = useState(0);
  const [ctot, setCtot] = useState(0);
  const [recommsectiondata, setRecommsectiondata] = useState("");

  const session = props.session;

  useEffect(() => {
    getfintoorecommApi();

    // var notes_div = document.getElementsByClassName("notes_sec_div")[0];

  }, []);

  const getfintoorecommApi = async () => {
    try {
      
      let getfintoorec = await GetAssetRecommendation(getParentUserId(),DATA_BELONGS_TO);
      if (getfintoorec["status_code"] == "200") {
        setRecommdata(getfintoorec["data"]);
        if (getfintoorec["data"]) {
          var current_asset_allocation_arr =
            getfintoorec["data"]["current_asset_allocation"];

          var ideal_asset_allocation_arr = Object.values(
            getfintoorec["data"]["ideal_asset_allocation"]
          );

          if (current_asset_allocation_arr) {
            setRecommsectiondata(getfintoorec["data"]["section_text"]["settings_description_data"]);
            var recomm_data_o_i = [];
            var recomm_data_o_c = [];
            ideal_asset_allocation_arr.forEach((val) => {
              switch (val.name) {
                case "Equity":
                  recomm_data_o_i["0"] = val;
                  recomm_data_o_c["0"] = current_asset_allocation_arr["equity"];
                  break;
                case "Debt":
                  recomm_data_o_i["1"] = val;
                  recomm_data_o_c["1"] = current_asset_allocation_arr["debt"];
                  break;
                case "Real Estate":
                  recomm_data_o_i["2"] = val;
                  recomm_data_o_c["2"] =
                    current_asset_allocation_arr["realEstate"];
                  break;
                case "Liquid":
                  recomm_data_o_i["3"] = val;
                  recomm_data_o_c["3"] = current_asset_allocation_arr["liquid"];
                  break;
                case "Alternate":
                  recomm_data_o_i["4"] = val;
                  recomm_data_o_c["4"] =
                    current_asset_allocation_arr["alternate"];
                  break;
                case "Gold MF/ETF/SGB":
                  recomm_data_o_i["5"] = val;
                  recomm_data_o_c["5"] = current_asset_allocation_arr["gold"];
                  break;
                default:
                  break;
              }
            });
            setRecommdataoi(recomm_data_o_i);
            setRecommdataoc(recomm_data_o_c);
            var i_tot = 0;
            recomm_data_o_i.map((val) => (i_tot = i_tot + val.amt));
            var c_tot = 0;
            recomm_data_o_c.map((val) => (c_tot = c_tot + val.amt));
            setItot(i_tot);
            setCtot(c_tot);

            
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <div className="asset-recomm ">
        {recommdata && Object.keys(recommdata).length > 0 ? (
          <>
            <h1
              className="rTitle text-center"
              style={{ paddingTop: 20, fontSize: "26px" }}
            >
              Fintoo Recommends
            </h1>
            <h4 className="rTitle mt-3">
              <img
                alt=""
                src={imagePath + "/static/media/DG/reports/assets-liabilities/asset-allocation.svg"}
              />
              Asset Allocation:
            </h4>

            <div className="">
              <div className="row">
                <div className="col-md-6">
                  <div className="recomm-box ">
                    <div className="green cardBox d-flex">
                      <div>
                        {" "}
                        <img
                          alt=""
                          src={imagePath + "/static/media/DG/reports/assets-liabilities/current-asset-allocation.svg"}
                        />
                      </div>
                      <div> Ideal Asset Allocation</div>
                    </div>
                    <div className="rContent ">
                      <p
                        dangerouslySetInnerHTML={{
                          __html: recommsectiondata.field2
                            ? recommsectiondata.field2
                            : "",
                        }}
                      ></p>
                    </div>
                    <div className="rTable table-responsive">
                      <table className="bgStyleTable">
                        <tbody>
                          <tr>
                            <th>Particular</th>
                            <th>Percentage (%)</th>
                            <th>Amount (₹)</th>
                          </tr>
                          {recommdataoi &&
                            recommdataoi.map((data,index) => (
                              <tr key={index} className="tabledata">
                                <td className="">{data.name}</td>
                                <td className="">{data.per}</td>
                                <td className="">{numberFormat(data.amt,0)}</td>
                              </tr>
                            ))}

                          <tr className="bold top-line total-value">
                            <td>Total Asset</td>
                            <td>100</td>
                            <td className="">{numberFormat(itot,0)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="recomm-box">
                    <div className="green cardBox d-flex">
                      <div>
                        {" "}
                        <img
                          alt=""
                          src={ imagePath + "/static/media/DG/reports/assets-liabilities/ideal-asset-allocation.svg"}
                        />
                      </div>
                      <div> Current Asset Allocation</div>
                    </div>
                    <div className="rContent ">
                      <p
                        dangerouslySetInnerHTML={{
                          __html: recommsectiondata.field1
                            ? recommsectiondata.field1
                            : "",
                        }}
                      ></p>
                    </div>
                    <div className="rTable table-responsive">
                      <table className="bgStyleTable">
                        <tbody>
                          <tr>
                            <th>Particular</th>
                            <th>Percentage (%)</th>
                            <th>Amount (₹)</th>
                            <th>Variance (₹)</th>
                          </tr>
                          {recommdataoc &&
                            recommdataoc.map((data,index) => (
                              <tr key={index} className="tabledata">
                                <td className="">{data.name}</td>
                                <td className="">{data.per}</td>
                                <td className="">{numberFormat(data.amt,0)}</td>
                                {data.amount_diff >= 0 && (
                                  <td style={{ color: "green" }} className=" ">
                                    {numberFormat(data.amount_diff,0)}
                                  </td>
                                )}

                                {data.amount_diff < 0 && (
                                  <td style={{ color: "red" }} className=" ">
                                    ({numberFormat(Math.abs(data.amount_diff),0)})
                                  </td>
                                )}
                              </tr>
                            ))}

                          <tr className="bold top-line total-value">
                            <td>Total Asset</td>
                            <td>100</td>
                            <td className="">{numberFormat(ctot,0)}</td>
                            <td />
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div style={{ height: 20, width: 100 }}>&nbsp;</div>
                <div className="container">
                  <div className="notes_sec_div">
                    <div className="notes_head_div">
                      <i />
                      <span>Notes</span>
                    </div>
                    <div className="notes_text_div">
                      <div className="rContent ">
                        <p
                          dangerouslySetInnerHTML={{
                            __html: recommsectiondata.field4
                              ? recommsectiondata.field4
                              : "",
                          }}
                        ></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="no-data-found text-center">
            <div className="container">
              <div className="row justify-content-center align-items-center">
                <div className="col-md-10">
                  <img
                    alt="Data not found"
                    src={ imagePath + "/static/media/DG/data-not-found.svg" }
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
                    Complete Assets-liabilities
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
                    onClick={() => 
                      {
                        ScrollToTop();
                        props.settab1("tab3")
                      }
                    }
                  >
                    <FaArrowLeft />
                    <span className="hover-text">&nbsp;Previous</span>
                  </div>
                  <div
                    className="next-btn form-arrow d-flex align-items-center"
                    onClick={() => 
                      {
                        ScrollToTop();
                        props.settab1("tab5")
                      }
                    }
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

export default Fintoorecommends;
