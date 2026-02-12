import React, { useEffect, useState } from "react";
import Styles from "./Networth.module.css";
import AssetNwGraph from "./AssetNwGraph";
import LibNwGraph from "./LibNwGraph";
import { fetchEncryptData } from "../../../../../common_utilities";
import { ADVISORY_GET_ASSETS_SUMMARY_API, ADVISORY_GET_LIABILITY_DATA } from "../../../../../constants";
const NetworthRightSection = (props) => {

    const [sessionData, setSessionData] = useState(props.sessionData);
    const [assetData, setAssetData] = useState([]);
    const [liabilityData, setLiabilityData] = useState([]);
    const [assetTotal, setAssetTotal] = useState(0);
    const [liabilityTotal, setLiabilityTotal] = useState(0);

    const asset_colors = {
        0:"#00bca4",
        1:"#aebc1d",
        2:"#005165",
        3:"#3d8b37",
        4:"#9b0061",
        5:"#7FFFD4",
        6:"#FF9655"
    }

    const liability_color = {
      0:"#588036",
      1:"#e1b624",
      2:"#042b62",
      3:"#f88221",
      4:"#f9411f",
      5:"#9400D3",
      6:"#4B0082",
      7:"#800000",
    };
    useEffect(() => {
      setSessionData(props.sessionData);
      if (props.sessionData) {
        getAssetDetails(props.sessionData);
        getLiabilityDetails(props.sessionData);
      }
    }, [props?.sessionData]);

    const getAssetDetails = async (session_data) => {
      try {
        var payLoad = {
          method: "post",
          url: ADVISORY_GET_ASSETS_SUMMARY_API,
          data: {
            fp_log_id: session_data["fp_log_id"],
            user_id: session_data["id"],
            fp_user_id: session_data["fp_user_id"],
          },
        };
        let response = await fetchEncryptData(payLoad);
        if (response["error_code"] == "100") {
          let assetSumArray = response["data"]["assetSumArray"];
          let totalSum = 0
          let assetData = {};
          Object.entries(assetSumArray).forEach(([key,value])=>{
            if (value['total'] != 0) {
                if (key == 'equity') {
                    assetData['0'] = value;
                } else if (key == 'debt') {
                    assetData['1'] = value;
                } else if (key == 'liquid') {
                    assetData['2'] = value;
                } else if (key == 'alternate') {
                    assetData['3'] = value;
                } else if (key == 'gold') {
                    assetData['4'] = value;
                } else if (key == 'realEstate') {
                    assetData['5'] = value;
                } else if (key == 'gold-physical') {
                    if('4' in assetData){
                        let gold_data = assetData['4']
                        value.total +=gold_data.total;
                        value.percentage += gold_data.percentage
                        assetData['4'] = value;
                    } else {
                        assetData['4'] = value;
                    }
                }
                totalSum+=value.total;
            }
          })
          if(Object.keys(response["data"]["insurance_data"]).length > 0){
            assetData['6'] = response["data"]["insurance_data"];
          }
          setAssetData(assetData);
          setAssetTotal(totalSum);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getLiabilityDetails = async (session_data) => {
      try {
        var payLoad = {
          method: "post",
          url: ADVISORY_GET_LIABILITY_DATA,
          data: {
            fp_log_id: session_data["fp_log_id"],
            user_id: session_data["id"],
            fp_user_id: session_data["fp_user_id"],
          },
        };
        let response = await fetchEncryptData(payLoad);
        if (response["error_code"] == "100") {
            let liabilityData = response["data"]["liabilitydata"];
            let liabilityGraphData = []
            let total = 0
            liabilityData.sort(function (a, b) { return a.category_name - b.category_name }).reverse();
            liabilityData.map((liability,index)=>{
                if(liability!=undefined){
                    const index = liabilityGraphData.findIndex(item => item.name === liability['category_name']);
                    if(index!==-1){
                        liabilityGraphData[index].y += liability['liability_outstanding_amount'];
                    } else {
                        liabilityGraphData.push({ 'name': liability['category_name'], 'y': liability['liability_outstanding_amount'] });
                    }
                    total+= liability["liability_outstanding_amount"]
                }
            })
            setLiabilityData(liabilityGraphData);
            setLiabilityTotal(total);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const formatIndianRupee = (number) => {
      if (number >= 1e7) {
        return (number / 1e7).toFixed(1) + " Cr";
      } else if (number >= 1e5) {
        return (number / 1e5).toFixed(1) + " L";
      } else if (number >= 1e3) {
        return (number / 1e3).toFixed(1) + " K";
      } else {
        return number.toString();
      }
    };

    return (
        <>
            <div className={`w-100 ${Styles.dd}`}>
                {Object.keys(assetData).length > 0 && (
                    <div className={`${Styles.AssetlibPie}`}>
                        <div className={`${Styles.label}`}>Assets</div>
                        <div className="d-md-flex align-items-center">
                            <div className={`${Styles.pieGraph}`}> {/* Make this div take the available space */}
                                <AssetNwGraph containerId="assetChartContainer" data={assetData} total={formatIndianRupee(assetTotal)}/>
                            </div>
                            <div className={`${Styles.Assetlist}`}>
                                {Object.values(assetData).map((asset,index)=>{
                                    return(
                                        <div key={index}>
                                            <span className={`${Styles.colorCircle}`} style={{ backgroundColor: asset_colors[index] }}></span> {asset.name} :
                                            <span className={`${Styles.AssetLIbsVal}`}> {formatIndianRupee(asset.total)}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}
                {liabilityData.length > 0 && (
                    <div className={`mt-2 ${Styles.AssetlibPie}`}>
                        <div className={`${Styles.label}`}>Liabilities</div>
                        <div className="d-md-flex align-items-center">
                            <div className={`${Styles.pieGraph}`}> {/* Make this div take the available space */}
                                <LibNwGraph containerId="libChartContainer" data={liabilityData} total={formatIndianRupee(liabilityTotal)}/>
                            </div>
                            <div className={`mt-md-4 ${Styles.Liblist}`}>
                                {liabilityData.map((liability,index)=>{
                                    return(
                                        <div>
                                            <span className={`${Styles.colorCircle}`} style={{ backgroundColor: liability_color[index] }}></span> {liability.name} : <span className={`${Styles.AssetLIbsVal}`}> {formatIndianRupee(liability.y)}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default NetworthRightSection;