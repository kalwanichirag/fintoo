import React, { useState } from "react";
import { useEffect } from "react";
import Assets from "./Tab/Assets"; 
import Sector from "./Tab/Sector";

const Tabs = (props) => {
  const [activeTab, setActiveTab] = useState("tab1");
  //  Functions to handle Tab Switching
  const handleTab1 = () => {
    // update the state to tab1
    setActiveTab("tab1");
  };
  const handleTab2 = () => {
    // update the state to tab2
    setActiveTab("tab2");
  };

  const assetAlloc = props.asset_allocation || {};
  const isAssetAllocEmpty =
    !assetAlloc ||
    Array.isArray(assetAlloc) && assetAlloc.length === 0 ||
    Object.keys(assetAlloc).length === 0 ||
    (assetAlloc.equity == null &&
      assetAlloc.debt == null &&
      assetAlloc.others == null);

  useEffect(() => {
    if (!isAssetAllocEmpty && assetAlloc.equity == null) {
      setActiveTab("tab2");
    }
  }, [props.asset_allocation]);

  if (isAssetAllocEmpty) {
    return (
      <div className="AllocationTabs py-3 text-muted">
        NA
      </div>
    );
  }

  return (
    <div className="AllocationTabs py-3">
      <div className="nav-div d-flex">
        {props.asset_allocation.equity *1 !== null && (
          <div
            className={activeTab === "tab1" ? "active flex-grow-1" : "flex-grow-1"}
            onClick={handleTab1}
            style={{cursor:'pointer'}}
          >
            {/* Asset Allocation */}
            Equity {(props.asset_allocation.equity *1).toFixed(2)}%
          </div>
        )}
        {(props.asset_allocation.debt + props.asset_allocation.others) *1  !== null && (
          <div
            className={activeTab === "tab2" ? "active flex-grow-1" : "flex-grow-1"}
            onClick={handleTab2}
            style={{cursor:'pointer'}}
          >
            {/* Sector Allocation */}
            Debt & Others {(props.asset_allocation.debt + props.asset_allocation.others).toFixed(2)}%
          </div>
        )}
      </div>

      {/* <ul className="nav">
        {props.dataAssets.filter((v) => v.value > 0).length > 0 && (
          <li
            className={activeTab === "tab1" ? "active" : ""}
            onClick={handleTab1}
          >
            Equity
          </li>
        )}
        {props.dataDebts.filter((v) => v.value > 0).length > 0 && (
          <li
            className={activeTab === "tab2" ? "active" : ""}
            onClick={handleTab2}
          >
            Debt & Others
          </li>
        )}
      </ul> */}

      <div className="outlet">
        {activeTab === "tab1" ? (
          <Assets data={props.dataAssets} asset_alloc={props.sector_alloc} equity={props.asset_allocation.equity} />
        ) : (
          <Sector data={props.dataDebts} />
        )}
      </div>
    </div>
  );
};
export default Tabs;
