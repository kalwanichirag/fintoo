import React, { useEffect, useState } from "react";
import { apiCall, fetchEncryptData,fetchData, getParentUserId } from "../../../../common_utilities";
import moment from "moment";
import * as toastr from "toastr";
import { Buffer } from "buffer";
import Form from "react-bootstrap/Form";
import commonEncode from "../../../../commonEncode";
import { Modal } from "react-bootstrap";
import Select from "react-select";
import FintooLoader from "../../../../components/FintooLoader";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { imagePath } from "../../../../constants";
const ConnectWithBroker = (props) => {
  const [equityHoldingsData, setEquityHoldingsData] = useState([]);
  const [brokerId, setBrokerID] = useState({
    fp_member_id:"",
    fp_holding_auth_id: "",
    fp_holding_id: "",
  });
  const [unlinkId, setUnlinkID] = useState({
    user_id: "",
    user_specific_id:"",
    fp_log_id: "",
  });
  const [refreshId, setRefreshID] = useState({
    user_id: "",
    fp_log_id: "",
  });
  const [allMembers, setAllMembers] = useState([]);
  const [memberLength, setMembeLength] = useState(0);
  const [selectedMember, setSelectedMember] = useState(null);
  const [modalType, setModalType] = useState(0);
  const [memberError, setMemberError] = useState("");
  const [holdingToken, setHoldingToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [linkholdingsshow, setLinkHoldingsShow] = useState(false);
  const handleShow = () => setShow(true);
  const linkHoldingsShow = () => setLinkHoldingsShow(true);
  const handleClose = () => setShow(false);
  const linkHoldingsClose = () => setLinkHoldingsShow(false);
  const dispatch = useDispatch();
  const connectWithBroker = useSelector(state => state.connectWithBroker);
  const trggerEquityHolding = useSelector(state => state.trggerEquityHolding);
  const navigate = useNavigate();
  const [brokerData, setBrokerData] = useState([]);


  useEffect(() => {
    if (connectWithBroker === true) {
      connectwithbroker();
      dispatch({
        type: "CONNECT_WITH_BROKER",
        payload: false,
      });
    }
  }, [connectWithBroker]);

  const scrollToTop = () => {
    window.scroll({ top: 0 });
  };

  const getfpfamilydata = async () => {
    try {
      var family_payload = await apiCall(
        BASE_API_URL +
        "restapi/getfpfamilydata/" +
        "?parent_user_id=" +
        Buffer.from(
          commonEncode.encrypt(props.session.data.id.toString())
        ).toString("base64") +
        "&fp_log_id=" +
        Buffer.from(
          commonEncode.encrypt(props.session.data.fp_log_id.toString())
        ).toString("base64") +
        "&web=1"
      );
      var member_array = [];
      member_array.push({
        value: props.session.data.fp_user_id,
        label:
          "Self - " +
          props.session.data.user_details.first_name +
          " " +
          props.session.data.user_details.last_name,
      });
      if (family_payload.error_code == "100") {
        var members = family_payload["data"];
        setMembeLength(members.length);
        if (members.length > 0) {
          member_array.push({ value: 0, label: "Family" });
        }
        members.map((member) => {
          member_array.push({
            value: member.id,
            label:
              member.relationname +
              "-" +
              member.first_name +
              " " +
              member.last_name,
          });
        });
      }
      setAllMembers(member_array);
    } catch (e) {
      console.log(e);
    }
  };

  const getConnectedBroker = async (onload) => {
    // try {
    //   var paylod = {
    //     url: ADVISORY_FETCH_CONNECTED_BROKER,
    //     method: "post",
    //     data: {
    //       user_id: getParentUserId(),
    //       fp_log_id: props.session.data.fp_log_id?props.session.data.fp_log_id:"",
    //     },
    //   };
    //   const fetchdata = await fetchEncryptData(paylod);
    //   if (fetchdata.error_code == "100") {
    //     setBrokerData(fetchdata.data);
    //     setEquityHoldingsData(fetchdata.equity_holdings);
    //     dispatch({
    //       type: "ASSETS_UPDATE",
    //       payload: true,
    //     });
    //   }

    //   if (!onload) makeconnection(fp_holding_auth_id);
    // } catch (e) {
    //   console.log(e);
    // }
  };

  const [sessionId, setUserSessionId] = useState("");
  const { v4: uuidv4 } = require("uuid");
  const refreshData = async (newDat) => {
    const rid = uuidv4();
    const ts = new Date().toISOString();
    const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ")
    const date1=  new Date(newDat.updated_datetime)
    const date2 = new Date(currentDate)    
    const timeDiff = date2.getTime() - date1.getTime();
    const thirtyDaysInMilliseconds = 1 * 24 * 60 * 60 * 1000;
    const isGapAtLeast1Days = timeDiff >= thirtyDaysInMilliseconds;
    if (isGapAtLeast1Days == true)
    {
      const loginPayload = {
        header: {
          rid: rid,
          ts: ts,
          channelId: "finsense",
        },
        body: {
          userId: "channel@fintoo",
          password: "85a333fb49044c7e91611a0d962ff8ba",
        },
      };

      toastr.options.positionClass = "toast-bottom-left";
      toastr.success("Sit Back and relax while we fetch your holdings");

      const url =
        "https://fintoo.fiulive.finfactor.co.in/finsense/API/V2/User/Login";
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginPayload),
      };

      const loginResponse = await fetch(url, options);

      if (loginResponse.status === 200) {
        const responseData = await loginResponse.json();
        const token = responseData.body.token;
        newDat.token = token
        try {
          let fir_request_payload = {
            header: {
              rid: rid,
              ts: ts,
              channelId: "finsense",
            },
            body: {
              custId: newDat.cust_id,
              consentId: newDat.consent_id,
              consentHandleId: newDat.consent_handle,
              dateTimeRangeFrom: newDat.daterange_from,
              dateTimeRangeTo: newDat.daterange_to,
            },
          };

          const requestBody = JSON.stringify(fir_request_payload);

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: requestBody,
          };

          fetch("https://fintoo.fiulive.finfactor.co.in/finsense/API/V2/FIRequest", requestOptions)

            .then((response) => response.json())
            .then((data) => {
              newDat.sId = data.body.sessionId
              newDat.retryCount = 0
              setUserSessionId(data.body.sessionId);
              FIStatus(newDat)
            })
            .catch((error) => {
              console.log("OTP API Error:", error);
            });
        } catch (e) {
          console.log("OTP error", e);
        }
      }
    }
    else {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Holdings can only be refreshed after 24 hours.");
    }
  };

  const FIStatus = async (newDat) => {
    try {
      const customHeaders = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${newDat.token}`,
      };
      const payload = {
        url: `https://fintoo.fiulive.finfactor.co.in/finsense/API/V2/FIStatus/${newDat.consent_id}/${newDat.sId}/${newDat.consent_handle}/${newDat.cust_id}`,
        headers: customHeaders,
        method: "get",
      };

      const r = await fetchData(payload);

      if (r.body.fiRequestStatus === "READY") {
        FIPfmDataReport(
          newDat
        );
      } 
      else if (r.body.fiRequestStatus === "FAILED") {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Failed to Fetch your holdings");
        navigate(`${process.env.PUBLIC_URL}/datagathering/assets-liabilities/`);
      }
      else {
        if (newDat.retryCount < 5) {
          setTimeout(() => FIStatus({...newDat, retryCount: newDat.retryCount + 1}), 15000);
        } else {
          toastr.options.positionClass = "toast-bottom-left";
          toastr.error("Financial Information (FI) Status is PENDING / REJECTED");
          navigate(`${process.env.PUBLIC_URL}/datagathering/assets-liabilities/`);
        }
      }
    } catch (error) {
      console.error("OTP error", error);
    }
  };

  const FIPfmDataReport = async (
    newDat
  ) => {
    try {
      let customHeaders = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + newDat.token,
      };

      let payload = {
        url: `https://fintoo.fiulive.finfactor.co.in/finsense/API/V2/Consent/${newDat.consent_id}`,
        headers: customHeaders,
        method: "get",
      };

      const r = await fetchData(payload);
      if (r.body.status == "ACTIVE") {
        try {
          let customHeaders = {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + newDat.token,
          };
          // let payload = {
          //   url: `https://fintoo.fiulive.finfactor.co.in/finsense/API/V2/FIPfmDataReport/${newDat.consent_handle}/${newDat.sId}`,
          //   headers: customHeaders,
          //   method: "get",
          // };

          // let payload = {
          //   url: `https://fintoo.fiulive.finfactor.co.in/finsense/API/V2/Consent/${newDat.consent_id}`,
          //   headers: customHeaders,
          //   method: "get",
          // };

          let payload = {
            url: `https://fintoo.fiulive.finfactor.co.in/finsense/API/V2/FIDataFetch/${newDat.consent_handle}/${newDat.sId}`,
            headers: customHeaders,
            method: "get",
          };

          const userData = await fetchData(payload);
          const member_id = newDat.member_id
          const member_name = newDat.member_name
          const pan = newDat.pan
          const mobile = newDat.mobile_number
          const user_id = newDat.user_id
          const user_specific_id = newDat.user_specific_id
          const fp_log_id = newDat.fp_log_id
          const consent_id = newDat.consent_id
          const consent_handle = newDat.consent_handle
          const daterange_from = newDat.daterange_from
          const daterange_to = newDat.daterange_to
          const retirement_date = newDat.retirement_date

          var userProfile = userData.body[0].fiObjects
          var userpanExist = userProfile.filter((v)=>
            v.Profile.Holders.Holder[0].pan == pan
          )
          if (userpanExist.length > 0) {
            var holdings = userpanExist.flatMap(v=>v.Summary.Investment.Holdings.Holding)
          }
          else{
            var holdings = []
          }
          const modifiedData = holdings.map(item => {
            return {
              user_id: user_id,
              member_id: member_id,
              issuerName: item.issuerName,
              isin: item.isin,
              isinDescription: item.isinDescription,
              units: item.units,
              lastTradedPrice: item.lastTradedPrice,
              fp_log_id: fp_log_id,
              retirement_date :moment(retirement_date).format("YYYY-MM-DD"),
              pan:pan,
              mobile: mobile,
            };
          });

          const assetGetPayload = {
            "filter_id": "0",
            "user_id": user_id,
            "fp_log_id": fp_log_id
          }
          try {
              const res = await apiCall(
                '',
                modifiedData,
                true,
                false
              );
              if (res["error_code"] == "100") {
                try {
                  let cdslnsdlpayload = {
                    url: '',
                    data: {
                      user_specific_id:user_specific_id,
                      member_id: member_id,
                      user_id: "" + user_specific_id,
                      pan:pan,
                      fp_log_id: "" + fp_log_id,
                      member_name: member_name,
                      mobile_number: mobile,
                      cust_id: mobile + "@finvu",
                      consent_id: consent_id,
                      consent_handle: consent_handle,
                      daterange_from: daterange_from,
                      daterange_to: daterange_to,
                      holding_isactive: 1,
                      updated_datetime: new Date().toISOString().slice(0, 19).replace("T", " "),
                      updateFlag:1
                      // created_datetime: new Date().toISOString().slice(0, 19).replace("T", " "),
                    },
                    method: "post",
                  };
                  const r = await fetchData(cdslnsdlpayload);
                  if (r["error_code"] == "100") {
                    const response = await apiCall(
                      '',
                      assetGetPayload,
                      true,
                      false
                    );
                    if (response["error_code"] == "100") {
                      dispatch({
                        type: "ASSETS_UPDATE",
                        payload: true,
                      });
                      dispatch({
                        type: "TRIGGER_EQUITY_HOLDING",
                        payload: true,
                      });
                      toastr.options.positionClass = "toast-bottom-left";
                      toastr.success("Data fetched successfully");
                      scrollToTop();
                      // setTimeout(() => {
                      //   props.onProceedClick();
                      // }, 3000);
                    }
                  }
                } catch (e) {
                  console.log("Error Occured ===>>> ", e);
                }
              }
            
          } catch (e) {
            console.log("Error Occured ===>>> ", e);
          }
        } catch (e) {
          console.log("OTP error", e);
        }
      } else {
        navigate(`${process.env.PUBLIC_URL}/datagathering/assets-liabilities/`);
      }
    } catch (e) {
      console.log("OTP error", e);
    }
  };
  
  const makeconnection = async (
    holdingId,
    disconnect = false,
    outodel = false
  ) => {
    // try {
    //   var paylod = {
    //     url: ADVISORY_CONNECTED_WITH_BROKER,
    //     method: "post",
    //     data: {
    //       authId: holdingId,
    //     },
    //   };
    //   const data = await fetchEncryptData(paylod);
    //   if (data.error_code == "100") {
    //     const txnId = JSON.parse(data["data"])["data"]["transactionId"];
    //     const gatewayInstance = new scDK({
    //       gateway: "fintoo",
    //       smallcaseAuthToken: data["token"],
    //       config: {
    //         amo: true,
    //       },
    //     });

    //     if (disconnect) {
    //       gatewayInstance.init({ smallcaseAuthToken: data["token"] });
    //       gatewayInstance
    //         .brokerLogout({})
    //         .then(function () {
    //           if (!outodel) {
    //             setModalType(0);
    //             // window.location.href = window.location.href;
    //             dispatch({
    //               type: "ASSETS_UPDATE",
    //               payload: true,
    //             });
    //           }
    //         })
    //         .catch(function () {
    //           toastr.options.positionClass = "toast-bottom-left";
    //           toastr.error("Broker disconnection failed!");
    //         });
    //     }
    //     if (!disconnect) {
    //       setIsLoading(false);
    //       gatewayInstance
    //         .triggerTransaction({
    //           transactionId: txnId,
    //         })
    //         .then(async function (resp) {
    //           setHoldingToken(resp.smallcaseAuthToken);
    //           var config = {
    //             url: ADVISORY_FETCH_HOLDING,
    //             method: "post",
    //             data: {
    //               token: resp.smallcaseAuthToken,
    //               user_id: props.session.data.id,
    //               fp_log_id: props.session.data.fp_log_id,
    //               fp_user_id: props.session.data.fp_user_id,
    //               check: "1",
    //             },
    //           };
    //           const check_asset_flag = await fetchEncryptData(config);
    //           if (check_asset_flag["data"] == "0") {
    //             setModalType(1);
    //           } else {
    //             continuefetching(props.session.data.fp_user_id,resp.smallcaseAuthToken);
    //           }
    //         })
    //         .catch((err) => console.error(err));
    //     }
    //   }
    // } catch (e) {
    //   console.log(e);
    // }
  };

  const continuefetching = async (assignuid,holding_token) => {
    try {
      var config = {
        url: ADVISORY_FETCH_HOLDING,
        method: "post",
        data: {
          token:holding_token != undefined ?holding_token: holdingToken,
          user_id: props.session.data.id,
          fp_log_id: props.session.data.fp_log_id,
          fp_user_id: props.session.data.fp_user_id,
          check: "0",
          assignuid: assignuid,
        },
      };
      const asset_save_data = await fetchEncryptData(config);
      toastr.options.positionClass = "toast-bottom-left";
      toastr.success(asset_save_data["message"]);

      if (asset_save_data["data"] != "") {
        setIsLoading(false);
        makeconnection(asset_save_data["data"], true);
      } else {
        window.location.href = window.location.href;
      }
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  const connectwithbroker = () => {
    setIsLoading(true);
    setTimeout(function () {
      makeconnection("", false);
    }, 2000);
  };

  const disconnectbroker = async (member_id,authId, id) => {
    try {
      var config = {
        url: ADVISORY_DISCONNECT_BROKER,
        method: "post",
        data: {
          fp_member_id:member_id,
          user_id: props.session.data.id,
          fp_log_id: props.session.data.fp_log_id,
          authId: authId,
        },
      };
      const res_data = await fetchEncryptData(config);
      if (res_data.error_code == "100") {
        handleClose();
        getConnectedBroker(true);
        setIsLoading(false);

        toastr.options.positionClass = "toast-bottom-left";
        toastr.success(res_data["message"]);
      } else {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error(res_data["message"]);
      }
      // window.location.href = window.location.href;
    } catch (e) {
      console.log(e);
    }
  };
  


  const unlinkyourholdings = async (data) => {
    try {
      var config = {
        url: ADVISORY_UNLINK_HOLDINGS,
        method: "post",
        data: {
          user_id: data.user_id,
          fp_log_id: data.fp_log_id,
          user_specific_id: data.user_specific_id
        },
      };
      const res_data = await fetchEncryptData(config);
      setIsLoading(false);
      if (res_data.error_code == "100") {
        dispatch({type: "OTHERINVESTMENT_UPDATE",payload: true});
        dispatch({type: "ASSETS_UPDATE",payload: true});
        linkHoldingsClose();
        getConnectedBroker(true);
        toastr.options.positionClass = "toast-bottom-left";
        scrollToTop();
        toastr.success(res_data["message"]);
      } else {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error(res_data["message"]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (e) => {
    setMemberError("");
    setSelectedMember(e.value);
  };
  const skipHolding = () => {
    if (memberLength > 0) {
      continuefetching(0);
    } else {
      continuefetching(props.session.data.fp_user_id);
    }
  };
  const linkHolding = () => {
    if (selectedMember == null) {
      setMemberError("This field is required");
    } else {
      setMemberError("");
      continuefetching(selectedMember);
    }
  };
  const deleteHolding = () => {
    setIsLoading(true);
    disconnectbroker(brokerId.fp_member_id,brokerId.fp_holding_auth_id, brokerId.fp_holding_id);
  };

  const deletelinkedHolding = () => {
    setIsLoading(true);
    unlinkyourholdings({user_specific_id: unlinkId.user_specific_id,user_id: unlinkId.user_id,fp_log_id: unlinkId.fp_log_id});
  };

  // useEffect(() => {
  //   getConnectedBroker(true);
  //   getfpfamilydata();
  // }, []);

  useEffect(() => {
    if (props.filterBroker === true) {
      // connectwithbroker();
      // dispatch({
      //   type: "CONNECT_WITH_BROKER",
      //   payload: false,
      // });
      setEquityHoldingsData(props.filteredHoldingsData);
      setBrokerData([]);
      props.handleFilterBroker(false);
    }else{
      getConnectedBroker(true);
    }
    getfpfamilydata();

  }, []);

  useEffect(() => {
    if (props.filterBroker === true) {
      setEquityHoldingsData(props.filteredHoldingsData);
      setBrokerData([]);
    }
    else{
      getConnectedBroker(true);
    }
    getfpfamilydata();

  }, [props.filterBroker, props.filteredHoldingsData]);

  useEffect(() => {
    // getConnectedBroker(true);
    // dispatch({
    //   type: "TRIGGER_EQUITY_HOLDING",
    //   payload: false,
    // });
    if (props.filterBroker === true && props.filteredHoldingsData.length > 0) {
      setEquityHoldingsData(props.filteredHoldingsData);
      setBrokerData([]);
    }else{

      getConnectedBroker(true);
    }
  }, [trggerEquityHolding]);


  return (
    <div style={{ overflow: 'auto' }}>
      <FintooLoader isLoading={isLoading} />

      <div>
        {/* <div
          style={{
            fontWeight: "bold",
            fontSize: 15,
          }}
          onClick={() => {
            connectwithbroker();
          }}
          className="linkholdings_btn pointer"
        >
          Link Account
        </div> */}
      </div>
      <table className="bgStyleTable text-center">
        <tbody>
          <tr>
            <th>Name</th>
            <th>Fetched From</th>
            <th>Type</th>
            <th>Connected On</th>
            <th>Updated On</th>
            <th>Action</th>
          </tr>
          {brokerData && brokerData.length > 0 || equityHoldingsData && equityHoldingsData.length > 0 ? (
            <>
              {
                brokerData.map((broker) => (
                  <tr>
                    <td>
                      {broker.fp_holding_broker_assign_id == "0"
                        ? "Family"
                        : broker.first_name + " " + broker.last_name}
                    </td>
                    <td>
                      {broker.fp_broker_name == "kite"
                        ? "Zerodha"
                        : broker.fp_broker_name}
                    </td>
                    <td>-</td>
                    {
                      broker.fp_holding_created_datetime != null ? (
                        <td>{moment(broker.fp_holding_created_datetime).format("DD/MM/YYYY")}</td>
                      ) : (
                        <td>-</td>
                      )
                    }
                    {
                      broker.fp_holding_updated_datetime != null ? (
                        <td>{moment(broker.fp_holding_updated_datetime).format("DD/MM/YYYY")}</td>
                      ) : (
                        <td>-</td>
                      )
                    }
                    <td>
                      <button
                        className="default-btn"
                        // style={{
                        //   marginRight: 0,
                        //   padding: 0,
                        //   margin: 0,
                        // }}
                        onClick={() => {
                          setBrokerID({
                            ...brokerId,
                            fp_member_id:broker.fp_holding_broker_assign_id,
                            fp_holding_auth_id: broker.fp_holding_auth_id,
                            fp_holding_id: broker.fp_holding_id,
                          });
                          handleShow();
                        }}
                      >
                        Unlink
                      </button>
                    </td>
                  </tr>
                ))
              }
              {
                equityHoldingsData.map((equity) => (
                  <tr>
                    <td>
                      {equity.member_name}
                    </td>
                    <td>
                      Finvu
                    </td>
                    <td>
                      CDSL
                    </td>
                    <td>
                      {moment(equity.created_datetime).format(
                        "DD/MM/YYYY"
                      )}
                    </td>
                    <td>
                      {moment(equity.updated_datetime).format(
                        "DD/MM/YYYY"
                      )}
                    </td>
                    <td  style={{
                      padding :"10px 0",
                      width : "250px"
                    }}>
                      <button
                        className="default-btn"
                        // style={{
                        //   marginRight: 0,
                        //   padding: 0,
                        //   margin: 0,
                        // }}
                        onClick={() => {
                          setUnlinkID({
                            ...unlinkId,
                            user_id: equity.user_id,
                            user_specific_id:equity.user_specific_id,
                            fp_log_id: equity.fp_log_id,
                          });
                          linkHoldingsShow();
                        }}
                      >
                        Unlink
                      </button>
                      <button className="ms-1 default-btn"
                        onClick={() => {
                          refreshData({
                            user_specific_id: equity.user_specific_id,
                            member_id: equity.member_id,
                            member_name: equity.member_name,
                            user_id: equity.user_id,
                            pan:equity.pan,
                            fp_log_id: equity.fp_log_id,
                            consent_id: equity.consent_id,
                            consent_handle: equity.consent_handle,
                            daterange_from: equity.daterange_from,
                            daterange_to: equity.daterange_to,
                            cust_id: equity.cust_id,
                            retirement_date: equity.retirement_date,
                            mobile_number: equity.mobile_number,
                            created_datetime: equity.created_datetime,
                            updated_datetime:equity.updated_datetime
                          });
                        }}
                        >
                        Refresh
                      </button>
                    </td>
                  </tr>
                ))
              }
            </>
          ) : (
            <tr>
              <td colSpan={6}>No broker connected.</td>
            </tr>
          )}
        </tbody>
      </table>
      {modalType == 1 && (
        <Modal
          style={{
            minWidth: "50%",
          }}
          className="popupmodal"
          centered
          show
        >
          <Modal.Header className="ModalHead d-flex">
            <div className="text-center w-100">Link Your Stocks </div>
            <div className="">
              <img
                onClick={() => {
                  setModalType(0);
                }}
                className="pointer"
                src={imagePath + "/static/media/Images/cancel_white.svg"}
                width={40}
              />
            </div>
          </Modal.Header>
          <div className=" p-4 d-grid place-items-center align-item-center">
            <div
              style={{
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
              <img
                className="pointer"
                src={imagePath + "/static/media/Images/assets/img/Data_fetch_icon.svg"}
                // width={40}
                width={200}
              />
            </div>
            <div className=" HeaderModal mt-2">
              <form noValidate="novalidate" name="goldassetform">
                <div className="row py-md-2">
                  <div className="col-12">
                    <div className="material">
                      <Form.Label>Memeber*</Form.Label>
                      <Select
                        classNamePrefix="sortSelect"
                        isSearchable={false}
                        styles={props.customModalStyle}
                        options={allMembers}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        value={allMembers.filter(
                          (v) => v.value == selectedMember
                        )}
                      />
                    </div>

                    <p className="error">{memberError}</p>
                  </div>
                </div>
                <div className="d-flex justify-content-center mt-4">
                  <button
                    type="button"
                    className="btn LInkOTPBTn"
                    onClick={() => {
                      linkHolding();
                    }}
                  >
                    Link
                  </button>
                  {memberLength > 0 && (
                    <button
                      type="button"
                      className="btn LInkOTPBTn"
                      onClick={() => {
                        skipHolding();
                      }}
                    >
                      Skip
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </Modal>
      )}
      <Modal className="popupmodal" centered show={show} onHide={handleClose}>
        <Modal.Header className="ModalHead">
          <div className="text-center">Confirmation</div>
        </Modal.Header>
        <div className=" p-5 d-grid place-items-center align-item-center">
          <div className=" HeaderModal">
            <div
              style={{
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
              Are you sure you want to disconnect?
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center pb-5">
          <button
            onClick={() => {
              deleteHolding();
            }}
            className="outline-btn m-2"
          >
            Yes
          </button>

          <button
            onClick={() => {
              handleClose();
            }}
            className="outline-btn m-2"
          >
            No
          </button>
        </div>
      </Modal>

      <Modal className="popupmodal" centered show={linkholdingsshow} onHide={linkHoldingsClose}>
        <Modal.Header className="ModalHead">
          <div className="text-center" style={{fontWeight : "bold"}}>Kindly Confirm</div>
        </Modal.Header>
        <div className=" p-4 d-grid place-items-center align-item-center">
          <div className=" HeaderModal">
            <div
              style={{
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
             <div className="pt-2"> <b>Are you sure you want to unlink your fetched equities</b></div>
              <div style={{fontSize :".9rem"}} className="pt-1">Note: Once unlinked you won't be updated on your investment</div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center pb-5">


          <button
            onClick={() => {
              linkHoldingsClose();
            }}
            className="outline-btn m-2"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              deletelinkedHolding();
            }}
            className="outline-btn m-2"
          >
            Unlink
          </button>
        </div>
      </Modal>

    </div>
  );
};

export default ConnectWithBroker;
