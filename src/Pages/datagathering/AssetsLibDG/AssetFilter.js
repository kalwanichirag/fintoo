import React, { useEffect, useState } from "react";
import { indianRupeeFormat } from "../../../common_utilities";
import SlidingPanel from "react-sliding-side-panel";
import CloseFilter from "../../../Assets/Images/close.png";
import FintooCheckbox from "../../../components/FintooCheckbox/FintooCheckbox";
import FintooSubCheckbox from "../../../components/FintooCheckbox/FintooSubCheckbox";

const categories = [
  {
    title: "All",
    id: 0,
    child: [],
  },
  {
    title: "Equity",
    id: 29,
    child: [
      { title: "ESOP`S", id: 34 },
      { title: "PMS", id: 32 },
      { title: "Equity Mutual Funds", id: 31 },
      { title: "Unlisted / AIF Equity", id: 33 },
      { title: "Equity Shares", id: 30 },
      { title: "US Equity", id: 123 },
      { title: "Future & Options", id: 35 },
      { title: "Others", id: 74 },
    ],
  },
  {
    title: "Shares",
    id: 1,
    child: [],
  },
  {
    title: "Gold",
    id: 42,
    child: [
      { title: "Gold ETF", id: 70 },
      { title: "Gold Mutual Fund", id: 71 },
      { title: "Physical Gold", id: 69 },
      { title: "Sovereign Gold Bonds", id: 72 },
      { title: "Others", id: 73 },
    ],
  },
  {
    title: "Mutual Funds",
    id: 2,
    child: [
      { title: "All", id: "All" },
      { title: "Internal", id: "Internal" },
      { title: "External", id: "External" },
      { title: "Manual", id: "Manual" },
    ],
  },
  {
    title: "Liquid",
    id: 40,
    child: [
      { title: "Bank Balance", id: 61 },
      // { title: "Cash Balance", id: 60 },
      { title: "Liquid Funds", id: 62 },
      { title: "Others", id: 63 },
    ],
  },
  {
    title: "Alternate",
    id: 41,
    child: [
      { title: "Art Investment", id: 64 },
      { title: "Vintage/Luxury Cars", id: 66 },
      { title: "Commodity", id: 36 },
      { title: "Cryptocurrency", id: 119 },
      { title: "Currency", id: 37 },
      { title: "Others", id: 67 },
    ],
  },
  {
    title: "Real Estate",
    id: 39,
    child: [
      { title: "Agricultural Land", id: 53 },
      { title: "Under Construction Property", id: 55 },
      { title: "Commercial", id: 52 },
      { title: "Land", id: 56 },
      { title: "Residential Premises", id: 51 },
      { title: "Others", id: 59 },
    ],
  },
  {
    title: "Debt",
    id: 38,
    child: [
      { title: "Debentures", id: 80 },
      { title: "Debt Mutual Funds", id: 77 },
      { title: "EPF", id: 117 },
      { title: "Fixed Deposit", id: 75 },
      { title: "Gratuity", id: 82 },
      { title: "Govt Bonds", id: 79 },
      { title: "Govt. Schemes", id: 76 },
      { title: "NPS", id: 118 },
      { title: "NSC/KVP", id: 84 },
      { title: "Pension Schemes", id: 85 },
      { title: "Post Office Scheme", id: 78 },
      { title: "PPF/GPF/VPF", id: 81 },
      { title: "Sukanya Samriddhi Yojana", id: 86 },
      { title: "Recurring Deposit", id: 120 },
      { title: "Others", id: 87 },
    ],
  },
  {
    title: "Others",
    id: 115,
    child: [],
  },
];

const AssetFilter = (props) => {
  const [openPanel, setOpenPanel] = useState(false);
  const [category, setCategory] = useState(0);
  const [selectedSubcategory, setSelectedSubcategory] = useState(["All"]);
  const [selectedMember, setSelectedMember] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [filterText, setFilterText] = useState("");
  const [totalacivesip, setTotalActiveSIP] = useState(0);
  const [sidePanelWidth, setSidePanelWidth] = useState(30);

  const fetchFilter = () => {
    setOpenPanel(true);
  };
  function applyFilter(e) {
    setOpenPanel(false);
    $("#no-result-msg").text("");
    var filter_name = "";
    var filterdata = [];
    var asset_datas = props.filterdata;
    if (category == 0) {
      filterdata = selectedMember.length
        ? asset_datas.filter(
            (v) => selectedMember.indexOf(v.user_asset_for) > -1
          )
        : asset_datas;
      if (filterdata.length == 0) {
        $("#no-result-msg").text("No Results Found");
      }
      filter_name = selectedMember.length ? "Member" : "";
      setFilterName(filter_name);
    } else if (category == 1) {
      var shares = [30]; // for shares
      setFilterName(filterText);
      var filterAfterCategory = asset_datas.filter(
        (v) => shares.indexOf(v.asset_sub_category_id) > -1
      );

      filterdata = selectedMember.length
        ? filterAfterCategory.filter(
            (v) => selectedMember.indexOf(v.user_asset_for) > -1
          )
        : filterAfterCategory;
      if (filterdata.length == 0) {
        $("#no-result-msg").text("No Results Found");
      }
    } else if (category == 2) {
      var mf = [77, 31, 71, 62]; // for Mutual funds
      setFilterName(filterText);
      filterAfterCategory = asset_datas.filter(
        (v) => mf.indexOf(v.asset_sub_category_id) > -1
      );

      var afterFilterData = selectedMember.length
        ? filterAfterCategory.filter(
            (v) => selectedMember.indexOf(v.user_asset_for) > -1
          )
        : filterAfterCategory;

      if (selectedSubcategory.length > 0) {
        filterdata = afterFilterData.filter((v) => {
          if (
            selectedSubcategory.includes("Internal") &&
            (v.user_asset_source == "Internal")
          ) {
            return v;
          } else if (
            selectedSubcategory.includes("External") &&
            v.user_asset_source == "External"
          ) {
            return v;
          } else if (
            selectedSubcategory.includes("Manual") &&
            v.user_asset_source == "Manual" &&
            (v.asset_sub_name_uuid == "equity_mf" || 
              v.asset_sub_name_uuid == "debt_mf" ||
              v.asset_sub_name_uuid == "gold_etf_mf" ||
              v.asset_sub_name_uuid == "equity_shares")
          ) {
            return v;
          } else if (
            selectedSubcategory.includes("All") &&
            (v.asset_sub_name_uuid == "equity_mf" ||
              v.asset_sub_name_uuid == "debt_mf" ||
              v.asset_sub_name_uuid == "gold_etf_mf" ||
              v.asset_sub_name_uuid == "equity_shares")
          ) {
            return v;
          }
        });
      } else {
        filterdata = afterFilterData;
      }

      if (filterdata.length == 0) {
        $("#no-result-msg").text("No Results Found");
      }
    } else {
      filterAfterCategory = asset_datas.filter(
        (v) => v.asset_category_id == category
      );
      setFilterName(filterText);
      var filterAfterSubCategory = selectedSubcategory.length
        ? filterAfterCategory.filter(
            (v) => selectedSubcategory.indexOf(v.asset_sub_category_id) > -1
          )
        : filterAfterCategory;

      filterdata = selectedMember.length
        ? filterAfterSubCategory.filter(
            (v) => selectedMember.indexOf(v.user_asset_for) > -1
          )
        : filterAfterSubCategory;
      if (filterdata.length == 0) {
        $("#no-result-msg").text("No Results Found");
      }
    }

    var activesip = 0;
    for (var i = 0; i < filterdata.length; i++) {
      if (
        filterdata[i]["user_asset_occurance"] == "1" &&
        (filterdata[i]["asset_sub_category_id"] == "31" ||
          filterdata[i]["asset_sub_category_id"] == "77" ||
          filterdata[i]["asset_sub_category_id"] == "71" ||
          filterdata[i]["asset_sub_category_id"] == "62")
      ) {
        activesip = Number(filterdata[i]["asset_amount"]) + activesip;
      }
    }
    var totalactivesip = activesip;
    setTotalActiveSIP(totalactivesip);
    props.setAssetsData(filterdata);
  }

  function resetFilter(e) {
    setOpenPanel(false);
    setCategory(0);
    setSelectedSubcategory([]);
    setSelectedMember([]);
    setFilterText("");
    setFilterName("");
    props.setAssetsData(props.filterdata);
    $("#no-result-msg").text("");
    var activesip = 0;
    var data = props.filterdata;
    for (var i = 0; i < data.length; i++) {
      if (
        data[i]["user_asset_occurance"] == "1" &&
        (data[i]["asset_sub_category_id"] == "31" ||
          data[i]["asset_sub_category_id"] == "77" ||
          data[i]["asset_sub_category_id"] == "71" ||
          data[i]["asset_sub_category_id"] == "62")
      ) {
        activesip = Number(data[i]["asset_amount"]) + activesip;
      }
    }
    var totalactivesip = activesip;
    setTotalActiveSIP(totalactivesip);
  }

  function calculateTotalAssets() {
    if (!props.assetsData) return 0;

    return props.assetsData.reduce((total, asset) => {
      const investedValue = parseFloat(asset.user_asset_current_amount);
      return total + investedValue;
    }, 0);
  }

  useEffect(() => {
    applyFilter();
  }, [props.filterdata]);

  useEffect(() => {
    setSelectedSubcategory([]);
    setSelectedMember([]);
  }, [category]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 768) {
        setSidePanelWidth(100);
      } else {
        setSidePanelWidth(30);
      }
    }
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div>
      {props.filterdata && props.filterdata.length > 0 && (
        <div className="mb-4 d-flex justify-content-between">
          <div className="d-flex">
            <h4 className="total-amt">
              <span
                style={{
                  fontWeight: "600",
                }}
              >
                {" "}
                Total Assets:{" "}
                <span>{indianRupeeFormat(calculateTotalAssets())} </span>
              </span>
            </h4>
            <h4 className="total-amt ms-md-5">
              <span
                style={{
                  fontWeight: "600",
                }}
              >
                Active SIP: {indianRupeeFormat(totalacivesip)}
              </span>
            </h4>
          </div>
          <div className="sorting d-inline-block">
            {filterName != "" && (
              <span
                style={{
                  // marginLeft: "26rem",
                  fontWeight: "bold",
                  marginRight: "1.5rem",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                {filterName}
                <img
                  alt="filter"
                  onClick={resetFilter}
                  width={28}
                  className="ps-2"
                  src={CloseFilter}
                //   src={process.env.REACT_APP_STATIC_URL + "media/DMF/cancel.svg"}
                />
              </span>
            )}
            <a  onClick={fetchFilter} className="color-blue font-bold sort-by">
              Filter By
              <img
                alt="filter"
               
                width={32}
                className="ps-2"
                src={imagePath + "/static/media/Images/assets/img/filter.svg"}
              />
            </a>
          </div>
          
        </div>
      )}
      {props.assetsData.length == 1 &&
            props.session?.["data"]?.["fp_lifecycle_status"] == 2 && (
              <div>
                <p style={{ color: "#F0806D", paddingRight: "20px" }}>
                  Note : In asset, there should be at least one self/spouse's
                  asset.
                </p>
              </div>
            )}
          {/* {props.assetsData.length == 1 &&
            props.session?.["data"]?.["fp_lifecycle_status"] == 1 && (
              <div>
                <p style={{ color: "#F0806D", paddingRight: "20px" }}>
                  Note: To generate the report you should have at least one
                  assets.
                </p>
              </div>
            )} */}
      <SlidingPanel
        className="Filter_Panel"
        type={"right"}
        isOpen={openPanel}
        size={sidePanelWidth}
      >
        <form id="FilterData" className="d-flex flex-column">
          <div className="ps-3 pe-3 pt-3">
            <div className="SideBar_Filter">
              <div className="filter_text">
                <p
                  style={{
                    fontSize: "1.2rem",
                  }}
                >
                  Filters
                </p>
              </div>
              <div>
                <button type="button" onClick={() => setOpenPanel(false)}>
                  <img src={CloseFilter} alt="" srcset="" />
                </button>
              </div>
            </div>
            <div style={{ marginTop: "1rem" }} className="Line"></div>
            <div className="fltr-section NSEBSE remove-border-li">
              <div className="fltr-section">
                <h4>Category</h4>
                <div className="Category_Filter">
                  <ul className="fltr-items">
                    {categories.map((v) => (
                      <li className="fltr-items-li" key={v.id}>
                        <FintooCheckbox
                          checked={category == v.id}
                          title={v.title}
                          onChange={() => {
                            setCategory(v.id), setFilterText(v.title);
                          }}
                        />
                        {/* <input type="checkbox" name="Equity" value="Equity" id="" onChange={handleCategoryChange} /> <span>Equity</span> */}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {(categories.filter((v) => v.id == category)[0]?.child.length ??
                0) > 0 && (
                <div className="fltr-section">
                  {category == "2" ? <h4>Type</h4> : <h4>Sub Category</h4>}
                  <div className="Category_Filter">
                    <ul className="fltr-items subcate">
                      {categories
                        .filter((v) => v.id == category)
                        .map((v) => (
                          <>
                            {v.child.map((x) => (
                              <li className="fltr-items-li" key={x.id}>
                                <FintooSubCheckbox
                                  checked={
                                    selectedSubcategory.indexOf(x.id) > -1
                                  }
                                  title={x.title}
                                  onChange={() => {
                                    if (
                                      selectedSubcategory.indexOf(x.id) > -1
                                    ) {
                                      setSelectedSubcategory((_a) =>
                                        _a.filter((_v) => _v != x.id)
                                      );
                                    } else {
                                      setSelectedSubcategory((_a) => [
                                        ..._a,
                                        x.id,
                                      ]);
                                    }
                                  }}
                                />
                              </li>
                            ))}
                          </>
                        ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="fltr-section">
                <h4>Members</h4>
                <div className="Category_Filter">
                  <ul className="fltr-items Memebsrs">
                    {props.memberData.map((v) => (
                      <li className="fltr-items-li " key={v.id}>
                        <FintooSubCheckbox
                          checked={selectedMember.indexOf(v.value) > -1}
                          title={v.label}
                          onChange={() => {
                            if (selectedMember.indexOf(v.value) > -1) {
                              setSelectedMember((_a) =>
                                _a.filter((_v) => _v != v.value)
                              );
                            } else {
                              setSelectedMember((_a) => [..._a, v.value]);
                            }
                          }}
                        />
                        {/* <input type="checkbox" name="Equity" value="Equity" id="" onChange={handleCategoryChange} /> <span>Equity</span> */}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 Filter_Btn_panel">
            <div>
              <button type="button" onClick={applyFilter}>
                Apply
              </button>
            </div>
            <div className="reset_btn">
              <button className="Reset" type="button" onClick={resetFilter}>
                Reset All
              </button>
            </div>
          </div>
        </form>
      </SlidingPanel>
    </div>
  );
};

export default AssetFilter;
