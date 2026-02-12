import React, { useEffect, useState } from "react";
import { apiCall } from "../../common_utilities";
// import { ADVISORY_NIFTY_SENSEX_DATA_API_URL } from "../../constants";
import RenewPopupTextbox from "./RenewPopupTextbox";
import KYCTextbox from "./KYCTextbox";

const NiftySensex = (props) => {
  const [sensexdata, setSensexData] = useState({});
  const [niftydata, setNiftyData] = useState({});
  useEffect(() => {
    getniftysensex();
  }, []);

  const getniftysensex = async () => {
    // try {
    // let payload_data = JSON.stringify({ stock_type: "nse" });
    // let res = await apiCall(
    //   ADVISORY_NIFTY_SENSEX_DATA_API_URL,
    //   payload_data,
    //   false,
    //   false
    // );
    // if (res["error_code"] == 100) {
    //   let data = res.data;
    //   for (let i = 0; i < data.length; i++) {
    //     if (data[i].co_name == "Nifty 50") {
    //       console.log("uibdiueb", data[i]);
    //       data[i]["niftyVal"] = (
    //         data[i]["dayopen"] - data[i]["dayclose"]
    //       ).toFixed(2);
    //       setNiftyData(data[i]);
    //     }
    //     if (data[i].co_name == "BSE Sensex") {
    //       data[i]["sensexVal"] = (
    //         data[i]["dayopen"] - data[i]["dayclose"]
    //       ).toFixed(2);
    //       setSensexData(data[i]);
    //     }
    //   }
    //   setTimeout(() => {
    //     getniftysensex();
    //   }, 900000); // 15 min
    // } else {
    //   setSensexData({});
    //   setNiftyData({});
    // }
    // } catch {}
  };

  return (
    <div
      className={`col-md-12  float-right right-0 ${
        process.env.REACT_APP_MODE == "live" ? "d-none" : ""
      }`}
    >
      <div className="d-md-flex justify-content-md-between justify-content-md-center">
        {props.renewpopup === 2 ? (
          <div className="RenewMsgbox">
            <RenewPopupTextbox showpopup={true} />
          </div>
        ) : (
          ""
        )}
        {props.renewpopup != 2 && 
        <div className="RenewMsgbox">{<KYCTextbox />}</div>
        }

        <div className="d-md-flex sensexNifty">
          <div className="sensexnifty">
            <span className="valuetext">SENSEX</span>
            <span>
              {sensexdata &&
                sensexdata.co_name === "BSE Sensex" &&
                sensexdata.dayopen}
            </span>
            {sensexdata && sensexdata.sensexVal < 0 && (
              <>
                <span className="negvaluetext">▼</span>
                <span className="negvaluetext2">
                  {sensexdata.sensexVal}({sensexdata.dayChangeP}%)
                </span>
              </>
            )}
            {sensexdata && sensexdata.sensexVal > 0 && (
              <>
                <span className="posvaluetext">▲</span>
                <span className="posvaluetext2">
                  {sensexdata.sensexVal}({sensexdata.dayChangeP}%)
                </span>
              </>
            )}
          </div>
          <span className="sensexLine"></span>
          <div className="sensexnifty">
            <span className="valuetext">NIFTY 50</span>
            <span>
              {niftydata &&
                niftydata.co_name === "Nifty 50" &&
                niftydata.dayopen}
            </span>
            {niftydata && niftydata.niftyVal < 0 && (
              <>
                <span className="negvaluetext">▼</span>
                <span className="negvaluetext2">
                  {niftydata.niftyVal}({niftydata.dayChangeP}%)
                </span>
              </>
            )}
            {niftydata && niftydata.niftyVal > 0 && (
              <>
                <span className="posvaluetext">▲</span>
                <span className="posvaluetext2">
                  {niftydata.niftyVal}({niftydata.dayChangeP}%)
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NiftySensex;
