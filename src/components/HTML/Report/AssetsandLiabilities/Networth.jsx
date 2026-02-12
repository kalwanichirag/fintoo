import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import {
  ADVISORY_GET_ASSETS_SUMMARY_API,
  ADVISORY_GET_LIABILITY_DATA,
  ADVISORY_GET_NETWORTHLIABILITES_API_URL,
  ADVISORY_NETWORTHFUNDFLOW_PROJECTION_API_URL,
} from "../../../../constants";
import {
  fetchEncryptData,
  getParentUserId,
  setBackgroundDivImage,
} from "../../../../common_utilities";
import Styles from "./Networth/Networth.module.css";
import customStyles from "../../../CustomStyles";
import AssetsLibTab from "./Networth/AssetLibTab";
import NetworthProjection from "./Networth/NetworthProjection";
import { Link } from "react-router-dom";
import Select from "react-select";
import FintooLoader from "../../../FintooLoader";
import AssetNwGraph from "./Networth/AssetNwGraph";
import LibNwGraph from "./Networth/LibNwGraph";
import { ScrollToTop } from "../../../../Pages/datagathering/ScrollToTop"
import Cookies from 'js-cookie';
import { getFamilyMember } from "../../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { Advisory_Get_Liability_Data, Advisory_Get_Networthliabilites_Api_Url, Advisorynetworthfundflowprojectionapiurl, Getassetsummary } from "../../../../FrappeIntegration-Services/services/reportHub-api/reportHubService";

function Networth(props) {

  const fp_user_id = getParentUserId();

  const [showProjection, setShowProjection] = useState(false);
  const [allMembers, setAllMembers] = useState([]);
  const [selectedOption, setSelectedOption] = useState({
    label: "All Member",
    value: 0,
    id: 0,
    user_id: getParentUserId(),
    user_parent_id: getParentUserId(),
    user_details_id: getParentUserId(),

  });

  const [isLoading, setIsLoading] = useState(false);

  const [currentNetworth, setCurrentNetworth] = useState(0);
  const [assetValue, setAssetValue] = useState(0);
  const [liabilityValue, setLiabilityValue] = useState(0);
  const [assetData, setAssetData] = useState([]);
  const [liabilityData, setLiabilityData] = useState([]);
  const [networthProjection, setNetworthProjection] = useState([]);
  const [assetTotal, setAssetTotal] = useState(0);
  const [liabilityTotal, setLiabilityTotal] = useState(0);
  const token = Cookies.get('token');

  const asset_colors = {
    0: "#00bca4",
    1: "#aebc1d",
    2: "#005165",
    3: "#3d8b37",
    4: "#9b0061",
    5: "#7FFFD4",
    6: "#FF9655",
  };

  const liability_color = {
    0: "#588036",
    1: "#e1b624",
    2: "#042b62",
    3: "#f88221",
    4: "#f9411f",
    5: "#9400D3",
    6: "#4B0082",
    7: "#800000",
  };

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedOption?.value & selectedOption?.value!=0) return;
  
      await getCurrentNetworthDataByUser(selectedOption.value);
      await getAssetDetailsByUser(selectedOption.value);
      await getLiabilityDetailsByUser(selectedOption.value);
    };
    fetchData();
  }, [selectedOption]);
  
  const toggleProjection = () => {
    setShowProjection(!showProjection);
  };

  const formatToIndianRupee = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // const formatIndianRupee = (number) => {
  //   if (number >= 1e7) {
  //     return (number / 1e7).toFixed(3) + " Cr";
  //   } else if (number >= 1e5) {
  //     return (number / 1e5).toFixed(2) + " L";
  //   } else if (number >= 1e3) {
  //     return (number / 1e3).toFixed(1) + " K";
  //   } else {
  //     return number.toString();
  //   }
  // };

  const formatIndianRupee = (number) => {
    if (isNaN(number)) return "0";
  
    let formattedValue = "";
    let suffix = "";
  
    if (number >= 1e7) {
      formattedValue = (number / 1e7).toFixed(3);
      suffix = " Cr";
    } else if (number >= 1e5) {
      formattedValue = (number / 1e5).toFixed(2);
      suffix = " L";
    } else if (number >= 1e3) {
      formattedValue = (number / 1e3).toFixed(1);
      suffix = " K";
    } else {
      formattedValue = number.toString();
    }
  
    // ✅ Remove unnecessary trailing zeros and decimal point
    formattedValue = parseFloat(formattedValue).toString();
  
    return `${formattedValue}${suffix}`;
  };
  

  const session = props.session;

  useEffect(() => {
    setBackgroundDivImage();
    fetchMembers();
    getCurrentNetworthData();
    getAssetDetails();
    getLiabilityDetails();
    getNetworthProjection();
  }, []);

  const fetchMembers = async () => {
    try {
      const userId = getParentUserId();
      const response = await getFamilyMember(userId);
      let all = response.data.map((member) => ({
        label: member.user_name ? member.user_name : member.user_email,
        value: member.user_id,
        user_id: member.user_id,
        user_parent_id: member.user_parent_id ? member.user_parent_id : member.user_id,
        user_details_id: member.user_details_id
      }));
      all.unshift({
        label: "All Member",
        value: 0,
        id: 0,
        user_details_id: getParentUserId(),
        user_id: getParentUserId(),
        user_parent_id: getParentUserId(),
      });
      setAllMembers([...all]);
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentNetworthData = async () => {
    try {
      // var payload = {
      //   method: "GET",
      //   url: `${ADVISORY_GET_NETWORTHLIABILITES_API_URL}?user_id=${selectedOption.user_parent_id}&user_asset_for=${selectedOption.user_id}&filter_type=all`,
      //   headers: {
      //     Authorization: `token ${token}`
      //   }
      // };
      let response = await Advisory_Get_Networthliabilites_Api_Url(selectedOption.user_parent_id, fp_user_id, filter_type);
      // let response = await fetchEncryptData(payload);
      if (response.status_code == "200") {
        setCurrentNetworth(response["data"]["networth_sum"]);
        setAssetValue(response["data"]["asset_data"]);
        setLiabilityValue(response["data"]["liability_sum"]);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentNetworthDataByUser = async (fp_user_id) => {
    try {
      let filter_type = "member_id";
      if (fp_user_id == 0) {
        filter_type = "all";
      }
      // var payload = {
      //   method: "GET",
      //   headers: {
      //     Authorization: `token ${token}`
      //   },
      //   url: `${ADVISORY_GET_NETWORTHLIABILITES_API_URL}?user_id=${selectedOption.user_parent_id}&user_asset_for=${fp_user_id}&filter_type=${filter_type}`,

      // };
      let response = await Advisory_Get_Networthliabilites_Api_Url(selectedOption.user_parent_id, fp_user_id, filter_type);
      if (response.status_code == "200" && response.data) {
        setCurrentNetworth(response["data"]["networth_sum"]);
        setAssetValue(response["data"]["asset_data"]);
        setLiabilityValue(response["data"]["liability_sum"]);
        setIsLoading(false);
      }else{
        setCurrentNetworth(0);
        setAssetValue(0);
        setLiabilityValue(0);
        setIsLoading(false);
      }
    } catch (error) {
      setCurrentNetworth(0);
      setAssetValue(0);
      setLiabilityValue(0);
      setIsLoading(false);
    }
  };

  // const processAssetData = (assetSumArray) => {
  //   let totalSum = 0;
  //   // let assetData = {};

  //   Object.entries(assetSumArray).forEach(([key, value]) => {
  //     if (value["total"] !== 0) {
  //       const assetKeys = [
  //         "equity",
  //         "debt",
  //         "liquid",
  //         "alternate",
  //         "gold",
  //         "realEstate",
  //         "gold-physical",
  //       ];

  //       const assetKeyIndex = assetKeys.indexOf(key);
  //       if (assetKeyIndex !== -1) {
  //         if (key === "gold-physical") {
  //           // let goldData = assetData["4"];
  //           let goldData = assetSumArray["gold-physical"];
  //           console.log("+++++++++++++++++++++++++ goldData: ", goldData);
  //           value.total += goldData.total;
  //           value.percentage += goldData.percentage;
  //         }
  //         assetData[assetKeyIndex.toString()] = value;
  //         // totalSum += value.total;
  //       }
  //     }
  //   });

  //   return { assetData, totalSum };
  // };

  const processAssetData = (assetSumArray = {}) => {
    const assetKeys = [
      "equity",
      "debt",
      "liquid",
      "alternate",
      "gold",
      "realEstate",
      "gold-physical",
    ];
  
    const assetData = {};
    let totalSum = 0;
  
    // Merge gold-physical into gold before filtering
    // if (assetSumArray["gold"] && assetSumArray["gold-physical"]) {
    //   assetSumArray["gold"].total += assetSumArray["gold-physical"].total || 0;
    //   assetSumArray["gold"].percentage += assetSumArray["gold-physical"].percentage || 0;
    // }
  
    assetKeys.forEach((key, index) => {
      const item = assetSumArray[key];
  
      // skip undefined or zero totals
      if (!item || item.total === 0) return;
  
      assetData[index.toString()] = {
        name: item.name,
        total: item.total,
        percentage: item.percentage || 0,
        asset_type: item.asset_type || "",
      };
  
      totalSum += item.total;
    });
  
    return { assetData, totalSum };
  };
  

  // const getAssetDetails = async (fp_user_id) => {
  //   try {
  //     let filter_type = "member_id";
  //     if (fp_user_id == 0) {
  //       filter_type = "all";
  //     }

  //     // let payLoad = {
  //     //   method: "GET",
  //     //   url: `${ADVISORY_GET_ASSETS_SUMMARY_API}?user_id=${selectedOption.user_parent_id}&user_asset_for=${fp_user_id}&filter_type=${filter_type}`,
  //     //   headers: {
  //     //     Authorization: `token ${token}`
  //     //   }
  //     // };

  //     // let response = await fetchEncryptData(payLoad);
  //     let response = await Getassetsummary(selectedOption.user_parent_id, fp_user_id, filter_type);
  //     console.log("+++++++++++++++++++ response: ", response);
  //     if (response["status_code"] == 200) {
  //       let { assetData } = processAssetData(
  //         response["data"]["assetSumArray"]
  //       );

  //       if (response["data"]["insurance_data"] && Object.keys(response["data"]["insurance_data"]).length > 0) {
  //         assetData["6"] = response["data"]["insurance_data"];
  //       }

  //       setAssetData(assetData);
  //       console.log("+++++++++++++++++++++++ totalSum: ", response["data"]["totalSum"], totalSum);
  //       setAssetTotal(response["data"]["totalSum"]);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const getAssetDetails = async (fp_user_id) => {
    try {
      let filter_type = fp_user_id === 0 ? "all" : "member_id";
      const response = await Getassetsummary(selectedOption.user_parent_id, fp_user_id, filter_type);
  
      if (response?.status_code === 200 && response?.data) {
        const { assetSumArray, totalSum, insurance_data } = response.data;
        const { assetData } = processAssetData(assetSumArray);
  
        if (insurance_data && Object.keys(insurance_data).length > 0) {
          assetData["6"] = insurance_data;
        }
  
        setAssetData(assetData);
        setAssetTotal(totalSum || 0);
      } else {
        setAssetData([]);
        setAssetTotal(0);
      }
    } catch (error) {
      console.error("Error in getAssetDetails:", error);
      setAssetData([]);
      setAssetTotal(0);
    }
  };
  

  // const getAssetDetailsByUser = async (fp_user_id) => {
  //   try {
  //     let filter_type = "member_id";
  //     if (fp_user_id == 0) {
  //       filter_type = "all";
  //     }

  //     // let payLoad = {
  //     //   method: "GET",
  //     //   url: `${ADVISORY_GET_ASSETS_SUMMARY_API}?user_id=${selectedOption.user_parent_id}&user_asset_for=${fp_user_id}&filter_type=${filter_type}`,
  //     //   headers: {
  //     //     Authorization: `token ${token}`
  //     //   }
  //     // };

  //     let response = await Getassetsummary(selectedOption.user_parent_id, fp_user_id, filter_type);
  //     console.log("+++++++++++++++++++ response 2: ", response);

  //     // let response = await fetchEncryptData(payLoad);

  //     if (response["status_code"] == 200) {
  //       let { assetData } = processAssetData(
  //         response["data"]["assetSumArray"]
  //       );
  //       // console.log("+++++++++++++++++++ total sum +++: ", totalSum);

  //       if (Object.keys(response["data"]["insurance_data"]).length > 0) {
  //         assetData["6"] = response["data"]["insurance_data"];
  //       }

  //       setAssetData(assetData);
  //       // console.log("+++++++++++++++++++++++ totalSum 2: ", totalSum);
  //       setAssetTotal(response["data"]["totalSum"]);
  //     }else{setAssetData([]);
  //       console.log("+++++++++++++++++++++++ totalSum 3: ", 0);
  //       setAssetTotal(0);}
  //   } catch (error) {
  //     setAssetData([]);
  //     console.log("+++++++++++++++++++++++ totalSum 4: ", 0);
  //     setAssetTotal(0);
  //   }
  // };

  const getAssetDetailsByUser = async (fp_user_id) => {
    try {
      let filter_type = fp_user_id === 0 ? "all" : "member_id";
      const response = await Getassetsummary(selectedOption.user_parent_id, fp_user_id, filter_type);
  
      if (response?.status_code === 200 && response?.data) {
        const { assetSumArray, totalSum, insurance_data } = response.data;
        const { assetData } = processAssetData(assetSumArray);
  
        // Add insurance data if available
        if (insurance_data && Object.keys(insurance_data).length > 0) {
          assetData["6"] = insurance_data;
        }
  
        setAssetData(assetData);
        setAssetTotal(totalSum || 0);
      } else {
        setAssetData([]);
        setAssetTotal(0);
      }
    } catch (error) {
      console.error("Error in getAssetDetailsByUser:", error);
      setAssetData([]);
      setAssetTotal(0);
    }
  };
  

  const processLiabilityData = (liabilityData) => {
    let liabilityGraphData = [];
    let total = 0;

    liabilityData
      .sort((a, b) => b.category_name - a.category_name)
      .forEach((liability) => {
        if (liability !== undefined) {
          const index = liabilityGraphData.findIndex(
            (item) => item.name === liability["category_name"]
          );
          if (index !== -1) {
            liabilityGraphData[index].y +=
              liability["user_liability_outstanding_amount"] || liability["liability_outstanding_amount"] || 0;
          } else {
            liabilityGraphData.push({
              name: liability["category_name"],
              y: liability["user_liability_outstanding_amount"] || liability["liability_outstanding_amount"] || 0,
            });
          }
          total += liability["user_liability_outstanding_amount"] || liability["liability_outstanding_amount"] || 0;
        }
      });

    return { liabilityGraphData, total };
  };

  const getLiabilityDetails = async (fp_user_id) => {
    try {
      let filter_type = "member_id";
      if (fp_user_id == 0) {
        filter_type = "all";
      }
      // let payLoad = {
      //   method: "GET",
      //   url: `${ADVISORY_GET_LIABILITY_DATA}?user_id=${selectedOption.user_parent_id}&user_liability_for=${fp_user_id}&filter_type=${filter_type}`,
      //   headers: {
      //     Authorization: `token ${token}`
      //   }
      // };
      let response = await Advisory_Get_Liability_Data(selectedOption.user_parent_id, fp_user_id, filter_type);
      // let response = await fetchEncryptData(payLoad);
      if (response["status_code"] == 200) {
        if (response.data.graph_data && response.data.graph_data.length > 0) {
          setLiabilityData(response.data.graph_data);
          setLiabilityTotal(response.data.sumliability || 0);
        } else {
          let { liabilityGraphData, total } = processLiabilityData(
            response.data.liabilitydata
          );

          setLiabilityData(liabilityGraphData);
          setLiabilityTotal(total);
        }
      }else{setLiabilityData([]);
        setLiabilityTotal(0);}
    } catch (error) {
      setLiabilityData([]);
      setLiabilityTotal(0);
    }
  };

  const getLiabilityDetailsByUser = async (fp_user_id) => {
    try {
      let filter_type = "member_id";
      if (fp_user_id == 0) {
        filter_type = "all";
      }

      // let payLoad = {
      //   method: "GET",
      //   url: `${ADVISORY_GET_LIABILITY_DATA}?user_id=${selectedOption.user_parent_id}&user_liability_for=${fp_user_id}&filter_type=${filter_type}`,
      //   headers: {
      //     Authorization: `token ${token}`
      //   }
      // };

      let response = await Advisory_Get_Liability_Data(selectedOption.user_parent_id, fp_user_id, filter_type);
      if (response.status_code == "200" && response.data) {
        setLiabilityData(response.data.graph_data);
        setLiabilityTotal(response.data.sumliability || 0);
      }else{
        setLiabilityData([]);
        setLiabilityTotal(0);
      }
    } catch (error) {
      setLiabilityData([]);
      setLiabilityTotal(0);
    }
  };

  const getNetworthProjection = async () => {
    try {
      // let payLoad = {
      //   method: "GET",
      //   url: `${ADVISORY_NETWORTHFUNDFLOW_PROJECTION_API_URL}?user_id=${selectedOption.user_parent_id}`,
      //   headers: {
      //     Authorization: `token ${token}`
      //   },
      //   data: {

      //   },
      // };

      let response = await Advisorynetworthfundflowprojectionapiurl(selectedOption.user_parent_id)
      // let response = await fetchEncryptData(payLoad);
      if (response["status_code"] == 200) {
        setNetworthProjection(response["data"])
      }else{setNetworthProjection([])}
    } catch (error) {
      setNetworthProjection([])
    }
  };

  const getpercentage = (ideal, current) => {
    if (current > 0) {
      var halfamt = (current * 50) / 100;
    } else {
      halfamt = 0;
    }

    if (ideal > 0) {
      var percentage = (halfamt / ideal) * 100;
    } else {
      var percentage = 99.9;
    }

    if (percentage > 98.5) {
      percentage = 98.5;
    }
    if (percentage < 6) {
      percentage = 6;
    }
    return percentage;
  };

  const getcolor = (ideal) => {
    if (ideal > 50) {
      return "#042b62";
    } else {
      return "red";
    }
  };

  return (
    <div>
      <FintooLoader isLoading={isLoading} />
      <div className="">
        {showProjection ? (
          <>
            <div>
              <NetworthProjection
                onBackClick={() => setShowProjection(false)}
                networthProjection={networthProjection}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <div className={`mt-5 ${Styles.NetworthAssLib}`}>
                <div className={`${Styles.netwBox}`}>
                  <div className={`${Styles.dd}`}>
                    <div className={`${Styles.selectBg}`}>
                      <div className="mb-0 mt-2" style={{ fontWeight: "bold" }}>
                        Select Family Member *
                      </div>
                      <Select
                        classNamePrefix="sortSelect"
                        isSearchable={true}
                        styles={customStyles}
                        options={allMembers}
                        value={selectedOption}
                        onChange={handleSelectChange}
                      />
                    </div>
                    <div
                      className={`d-md-flex justify-content-md-between d-grid ${Styles.CurrentNw}`}
                    >
                      <div>
                        <div>Current Networth</div>
                        <div style={{
                          color: currentNetworth < 0 ? "red" : ""
                        }} className={`${Styles.currnwamt}`}>
                          {formatToIndianRupee(currentNetworth)}
                        </div>
                      </div>
                      <div className={`${Styles.NwBtn}`}>
                        <button onClick={toggleProjection}>
                          View Projection
                        </button>
                      </div>
                    </div>
                    <div
                      className={`d-md-flex justify-content-md-between d-grid ${Styles.CurrentNw}`}
                    >
                      <div className={`${Styles.assetLibval}`}>
                        <div className="text-center">Assets</div>
                        <div className={`${Styles.amt}`}>
                          {formatToIndianRupee(assetValue)}
                        </div>
                      </div>
                      <div
                        className={`ms-md-5 mt-md-0 mt-3 ${Styles.assetLibval}`}
                      >
                        <div className="text-center">Liabilities</div>
                        <div className={`${Styles.amt}`}>
                          {formatToIndianRupee(liabilityValue)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className={`ms-md-5`}>
                    <div className={`w-100 ${Styles.dd}`}>
                      {Object.keys(assetData).length > 0 ? (
                        <div className={`${Styles.AssetlibPie}`}>
                          <div className={`${Styles.label}`}>Assets</div>
                          <div className="d-md-flex align-items-center">
                            <div className={`${Styles.pieGraph}`}>
                              {" "}
                              <AssetNwGraph
                                containerId="assetChartContainer"
                                data={assetData}
                                total={formatIndianRupee(assetTotal)}
                              />
                            </div>
                            <div className={`${Styles.Assetlist}`}>
                              {Object.values(assetData).map((asset, index) => {
                                return (
                                  <div key={index}>
                                    <div className="d-flex">
                                      <div style={{
                                        width: ""
                                      }} className="d-flex">
                                        <div>
                                          <span
                                            className={`${Styles.colorCircle}`}
                                            style={{
                                              backgroundColor: asset_colors[index],
                                            }}
                                          ></span>
                                        </div>
                                        <div>
                                          {asset.name}
                                        </div>
                                      </div>
                                      <div className="ms-2" style={{ whiteSpace: "nowrap" }}>
                                        <span className={`${Styles.AssetLIbsVal}`}>
                                          {" "}
                                          : {formatIndianRupee(asset.total)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className={`${Styles.AssetlibPie} mt-2`}>
                          <div
                            style={{
                              padding: "3.3rem",
                            }}
                            className="text-center"
                          >
                            <div className="w-100" style={{ fontSize: "20px" }}>
                              No Assets
                            </div>
                          </div>
                        </div>
                      )}
                      {liabilityData.length > 0 ? (
                        <div className={`mt-2 ${Styles.AssetlibPie}`}>
                          <div className={`${Styles.label}`}>Liabilities</div>
                          <div className="d-md-flex align-items-center">
                            <div className={`${Styles.pieGraph}`}>
                              {" "}
                              <LibNwGraph
                                containerId="libChartContainer"
                                data={liabilityData}
                                total={formatIndianRupee(liabilityTotal)}
                              />
                            </div>
                            <div className={`mt-md-4 ${Styles.Liblist}`}>
                              {liabilityData.map((liability, index) => {
                                return (
                                  <div className="d-flex">
                                    <div style={{
                                      width: ""
                                    }} className="d-flex">
                                      <div>
                                        <span
                                          className={`${Styles.colorCircle}`}
                                          style={{
                                            backgroundColor: liability_color[index],
                                          }}
                                        ></span>

                                      </div>
                                      <div>
                                        {liability.name}
                                      </div>
                                    </div>
                                    <div className="ms-2" style={{ whiteSpace: "nowrap" }}>
                                      <span className={`${Styles.AssetLIbsVal}`}>
                                        {" "}
                                        :  {formatIndianRupee(liability.y)}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className={`${Styles.AssetlibPie} mt-2`}>
                          <div
                            style={{
                              padding: "3.3rem",
                            }}
                            className="text-center"
                          >
                            <div className="w-100" style={{ fontSize: "20px" }}>
                              No Liabilities
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${Styles.AssetLibSection}`}>
                <AssetsLibTab />
              </div>
            </div>
          </>
        )}

        <div className="row py-2">
          <div className=" text-center">
            <div>
              <div className="btn-container">
                <div className="d-flex justify-content-center">
                  <Link to={process.env.PUBLIC_URL + "/report/profile"}>
                    <div
                      className="previous-btn form-arrow d-flex align-items-center"
                      onClick={() => {
                        ScrollToTop();
                        props.settab1("tab2")
                      }
                      }
                    >
                      <FaArrowLeft />
                      <span className="hover-text">&nbsp;Previous</span>
                    </div>
                  </Link>
                  <div
                    className="next-btn form-arrow d-flex align-items-center"
                    onClick={() => {
                      ScrollToTop();
                      props.settab1("tab4")
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

export default Networth;
