import React from "react";
import { indianRupeeFormat } from "../../../common_utilities";
import { BsPencilFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";

const AssetList = (props) => {
  return (
    <div>
      {props.assetsData &&
        props.assetsData.map((asset) => (
          <div key={asset.id} className="inner-container mt-4">
            <h4>
              {asset.categorydetail}{" "}
              {asset.asset_name ? " - " + asset.asset_name : ""}{" "}
              <span style={{ fontWeight: "500" }}>
                {asset.user_asset_source == "External" && "(External)"}
                {(asset.user_asset_source == "Internal") &&
                  "(Internal)"}
                {asset.user_asset_source == "Manual" &&
                  (v.asset_sub_name_uuid == "equity_mf" ||
                    v.asset_sub_name_uuid == "debt_mf" ||
                    v.asset_sub_name_uuid == "gold_etf_mf" ||
                    v.asset_sub_name_uuid == "equity_shares") &&
                  "(Manual)"}
              </span>
            </h4>
            <div className="row">
              <div className="col-md-4">
                <div className="display-style">
                  <span>Value:</span>
                  <p
                    className="invest-show"
                    title={indianRupeeFormat(
                      parseFloat(
                        asset.user_asset_current_amount || asset.totalpurchasevalue
                      )
                    )}
                  >
                    {indianRupeeFormat(
                      parseFloat(
                        asset.user_asset_current_amount || asset.totalpurchasevalue
                      )
                    )}
                  </p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="display-style">
                  <span>Type: </span>
                  <p>
                    {asset.subcategorydetail
                      ? asset.subcategorydetail
                      : "Not added"}
                  </p>
                </div>
              </div>
              <div className="col-md-2">
                <div className="display-style">
                  <span>Member:</span>
                  <p>{asset.membername1 ? asset.membername1 : "Not added"}</p>
                </div>
              </div>
              <div className="col-md-2">
                <div className="opt-options">
                  <span>
                    <BsPencilFill
                      onClick={() => {
                        props.editAssetData(asset.id);
                      }}
                    />
                  </span>

                  {props.assetsData.length > 1 &&
                    props.session?.["data"]?.["fp_lifecycle_status"] == 2 && (
                      <span
                        onClick={() => {
                          props.handleShow();
                          props.setAssetsId(asset.id);
                        }}
                        className="opt-options-2"
                      >
                        <MdDelete />
                      </span>
                    )}
                  {props.session?.["data"]?.["fp_lifecycle_status"] == 1 && (
                    <span
                      onClick={() => {
                        props.handleShow();
                        props.setAssetsId(asset.id);
                      }}
                      className="opt-options-2"
                    >
                      <MdDelete />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default AssetList;
