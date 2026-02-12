import React, { useEffect, useState } from "react";
import {
  apiCall,
  fetchEncryptData,
  numberFormat, setBackgroundDivImage
} from "../../../../common_utilities";
import { ADVISORY_GET_ASSETS_SUMMARY_API, imagePath } from "../../../../constants";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import AssetSummary from "../../../../Assets/Datagathering/Graph/AssetSummary";
import { Link } from "react-router-dom";
import FintooLoader from "../../../FintooLoader";

function Assetsummary(props) {
  const [assetsectiondata, setAssetsectiondata] = useState("");
  const [assetdata, setAssetdata] = useState({});
  const [phyassetdata, setPhyassetdata] = useState({});
  const [totfin, setTotfin] = useState(0);
  const [phyfin, setPhyfin] = useState(0);
  const [assetgraphdata, setAssetgraphdata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const session = props.session;
  useEffect(() => {
    getassetssummary();
    setBackgroundDivImage();
    
  }, []);
  const getassetssummary = async () => {
    try {

      var payload = {
        method: "post",
        url: ADVISORY_GET_ASSETS_SUMMARY_API,
        data: { fp_log_id: session["fp_log_id"],
        user_id: session["id"],
        fp_user_id: session["fp_user_id"], },
      };      
      let getassetssummarydata = await fetchEncryptData(payload);
      if (getassetssummarydata["error_code"] == "100") {
        setAssetsectiondata(getassetssummarydata.data.section_text);

        var asset_graph_data = [];
        var asset_data = {};
        var phy_data = {};
        var insurance_data = getassetssummarydata.data.insurance_data;
        const dataArray = Object.values(
          getassetssummarydata.data.assetSumArray
        );
        dataArray.map((val) => {
          if (val["asset_type"] == "Financial Assets" && val["total"] != 0) {
            if (val["name"] == "Equity") {
              asset_data["0"] = val;
            } else if (val["name"] == "Debt") {
              asset_data["1"] = val;
            } else if (val["name"] == "Liquid") {
              asset_data["2"] = val;
            } else if (val["name"] == "Alternate") {
              asset_data["3"] = val;
            } else if (val["name"] == "Gold") {
              asset_data["4"] = val;
            }
          } else if (
            val["asset_type"] == "Physical Assets" &&
            val["total"] != 0
          ) {
            if (val["name"] == "Real Estate") {
              phy_data["0"] = val;
            } else if (val["name"] == "Gold") {
              phy_data["1"] = val;
            }
          }
        });

        setAssetdata(Object.values(asset_data));
        setPhyassetdata(Object.values(phy_data));

        var financial_sum = [];
        var Physical_sum = [];
        Object.values(asset_data).forEach((val) => {
          if (val["total"] != 0) {
            financial_sum.push(val["total"]);
          }
        });

        Object.values(phy_data).forEach((val) => {
          if (val["total"] != 0) {
            Physical_sum.push(val["total"]);
          }
        });

        var tot_Fin = financial_sum.reduce((add, v) => {
          return add + v;
        }, 0);
        setTotfin(tot_Fin);

        var tot_Phy = Physical_sum.reduce((add, v) => {
          return add + v;
        }, 0);
        setPhyfin(tot_Phy);

        var setgraphdata = [];
        if (insurance_data["total"]) {
          setgraphdata = [
            {
              name: "Financial Assets",
              total: tot_Fin + insurance_data["total"],
            },
            { name: "Physical Assets", total: tot_Phy },
          ];
        } else {
          setgraphdata = [
            { name: "Financial Assets", total: tot_Fin },
            { name: "Physical Assets", total: tot_Phy },
          ];
        }
        asset_graph_data = setgraphdata
          .filter((val) => val["total"] !== 0)
          .map((val) => ({ name: val["name"], y: val["total"] }));

        setAssetgraphdata(asset_graph_data);
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <FintooLoader isLoading={isLoading} />
      <div>
        <div className="lifeInsuranceHolderBoxInner ">
          {(assetdata && assetdata.length > 0) ||
          (phyassetdata && phyassetdata.length > 0) ? (
            <div>
              <h4 className="rTitle">
                <img
                  className="title-icon"
                  src={imagePath + "/static/media/DG/reports/assets-liabilities/asset-summary.svg"}
                />
                Your Asset summary
              </h4>

              <div className="rContent ">
                {" "}
                <p
                  dangerouslySetInnerHTML={{
                    __html: assetsectiondata ? assetsectiondata : "",
                  }}
                ></p>
              </div>
              {assetdata && assetdata.length > 0 && (
                <>
                  <h4 className="rTitle">
                    <img
                      className="title-icon"
                      src={imagePath + "/static/media/DG/reports/assets-liabilities/asset-summary.svg"}
                    />
                    Financial Assets
                  </h4>
                  <div className="rTable table-responsive ">
                    <table className="bgStyleTable">
                      <tbody>
                        <tr>
                          <th>Category Name </th>
                          <th>Current Value (₹)</th>
                        </tr>

                        {assetdata &&
                          assetdata.map((item) => (
                            <>
                              <tr className="tabledata">
                                <td className="">{item["name"]}</td>
                                <td className="">{numberFormat(item.total,0)}</td>
                              </tr>
                            </>
                          ))}

                        <tr className="bold top-line total-value">
                          <td>Total Value</td>
                          {/* <td></td> */}

                          <td className="">{totfin && numberFormat(totfin,0)}</td>
                          {/* <td>100</td> */}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="isInsurance ">
                    * It includes Current Fund Value of ULIP &amp; Surrender
                    Value of Other Insurance
                  </p>
                </>
              )}
              {phyassetdata && phyassetdata.length > 0 && (
                <>
                  <h4 className="rTitle">
                    <img
                      className="title-icon"
                      src={ imagePath + "/static/media/DG/reports/assets-liabilities/asset-summary.svg"}
                    />
                    Physical Assets
                  </h4>
                  <div className="rTable table-responsive ">
                    <table className="bgStyleTable">
                      <tbody>
                        <tr>
                          <th>Category Name </th>
                          <th>Current Value (₹)</th>
                        </tr>
                        {phyassetdata &&
                          phyassetdata.map((item) => (
                            <>
                              <tr className="tabledata">
                                <td className="">{item.name}</td>
                                <td className="">{numberFormat(item.total,0)}</td>
                              </tr>
                            </>
                          ))}

                        <tr className="bold top-line total-value">
                          <td>Total Value</td>
                          <td className=""> {phyfin && numberFormat(phyfin,0)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              )}
              <div className="graphSection rGraph row">
                <div
                  id="assetMatrix"
                  className="col-md-12 d-flex justify-content-md-center aligns-center"
                >
                  {/* <div className="text-center">
                  <h4>Asset Matrix</h4>
                </div> */}
                  <div className="mt-4">
                    <AssetSummary assetgraphdata={assetgraphdata} />
                  </div>
                </div>
              </div>
              {/* <div className="assetMatrixBottom" style={{ height: 15 }} /> */}
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
                      Complete Assets
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
                    <Link to={process.env.PUBLIC_URL + "/report/profile"}>
                      <div className="previous-btn form-arrow d-flex align-items-center">
                        <FaArrowLeft />
                        <span className="hover-text" style={{ maxWidth: 100 }}>
                          Previous&nbsp;
                        </span>
                      </div>
                    </Link>

                    <div
                      className="next-btn form-arrow d-flex align-items-center"
                      onClick={() => props.settab("tab8")}
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
    </>
  );
}

export default Assetsummary;
