import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RiskMeter from "./Graph/RiskMeter";
import Splinechart from "./Graph/Splinechart";
import { Container, Row, Col, Modal } from "react-bootstrap";
import Allocation from "./Allocation.jsx";
import { useParams, Link } from "react-router-dom";
import TabData from "./TabData";
import Swal from "sweetalert2";
import information from "../../Assets/Images/information.png";
import ReactTooltip from "react-tooltip";
import {
  FaStar,
  FaShareAlt,
  FaAngleUp,
  FaAngleDown,
} from "react-icons/fa";
import { MdClose } from "react-icons/md";
import FintooShareBox from "../HTML/FintooShareBox/FintooShareBox";
import commonEncode from "../../commonEncode";
import moment from "moment";
import { toast } from "react-toastify";
import {
  FV,
  indianRupeeFormat,
  formatPrice,
  getUserId,
  fetchEncryptData,
  defaultamclogo,
  indianRupeeFormat1,
} from "../../common_utilities";
import AddToWish from "../AddToWish";
import InputSlider from "../HTML/Slider/InputSlider";
import GuestLayout from "../Layout/GuestLayout";
import FintooLoader from "../FintooLoader";
import { GetSchemeDetails } from "../../FrappeIntegration-Services/services/investment-api/investmentService.js";

const user_data = JSON.parse(localStorage.getItem("user_data") || '{}');

// GrShareOption
const successAlert = () => {
  Swal.fire({
    title: "",
    text: "Added to Wishlist!",
    icon: "success",
  });
};
const RemoveAlert = () => {
  Swal.fire({
    title: "",
    text: "Removed from Wishlist!",
    icon: "success",
  });
};

const getDimensions = (ele) => {
  const { height } = ele.getBoundingClientRect();
  const offsetTop = ele.offsetTop;
  const offsetBottom = offsetTop + height;

  return {
    height,
    offsetTop,
    offsetBottom,
  };
};

const MutualFund = () => {
  const [productDetail, setProductDetail] = useState([]);
  const [show5funds, setShow5Funds] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [compareArray, setCompareArray] = useState([]);
  const [showShare, setShowShare] = useState(false);
  const [breakWord, setBreakWord] = useState(0);
  const [error, setError] = useState(false);

  const [calculatorData, setCalculatorData] = useState({ amount: 0, expectedDuration: 3, expectedReturns: 40, investedAmount: 0 });
  const schemeslug = useParams();
  const scheme_slug = schemeslug.slug;

  const riskArray = [
    { type: "Low Risk", value: 0.07 },
    { type: "Low to Moderate Risk", value: 0.24 },
    { type: "Moderate Risk", value: 0.5 },
    { type: "Moderately High risk", value: 0.58 },
    { type: "High Risk", value: 0.78 },
    { type: "Very High Risk", value: 0.95 },
  ];
  const header = document.querySelector(".sticky");
  const getHeaderHeight = () => {
    return header.offsetHeight;
  };
  const scrollTo = (targetElement) => {
    // Calculate the header height dynamically
    const headerHeight = getHeaderHeight() + 89;

    // Calculate the target element's position relative to the viewport
    const elementPosition = targetElement.getBoundingClientRect().top;

    // Calculate the scroll position, considering the header height
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

    // Scroll to the calculated position smoothly
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };
  document.querySelectorAll(".header_link").forEach((button) => {
    button.addEventListener("click", () => {
      const sectionId = button.getAttribute("data-section-id");
      const targetElement = document.getElementById(sectionId);
      if (targetElement) {
        scrollTo(targetElement);
      }
    });
  });
  const navigate = useNavigate();
  var lowUnit, highUnit, lowUnitPercent, highUnitPercent, exitloadper;

  React.useEffect(function () {
    window.scrollTo(0, 0);
    document.body.classList.add("page-mutualfund-details");
    onLoadInIt();
    return () => {
      document.body.classList.remove("page-mutualfund-details");
    };
  }, []);

  const onLoadInIt = async () => {
    setIsLoading(true);
    try {
      var urldata = {
        scheme_code: scheme_slug,
        ...(user_data?.user_id ? { user_id: user_data.user_id } : {})
      };
      var res = await GetSchemeDetails(urldata);
      var response = res.data;

      if (res.message === "success") {
        setProductDetail([response]);
        loadDataForCalculator(response);
        setIsInWishlist(response.wishlist_key);
      }
    } catch (e) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", isSticky);
    return () => {
      window.removeEventListener("scroll", isSticky);
    };
  }, []);
  useEffect(() => {
    window.addEventListener("scroll", isStickyNav);
    return () => {
      window.removeEventListener("scroll", isStickyNav);
    };
  }, []);
  /* Method that will fix header after a specific scrollable */
  const isSticky = (e) => { };

  const isStickyNav = (e) => {
    const header = document.querySelector(".sticky ");
    if (header) {
      const scrollTop = window.scrollY;
      scrollTop >= 259
        ? header.classList.add("fixed_top_Nav")
        : header.classList.remove("fixed_top_Nav");
    }
  };
  const [visibleSection, setVisibleSection] = useState(null);
  const [mobilePurchase, setMobilePurchase] = useState("SIP");

  const OverviewRef = useRef(null);
  const FundDetailsRef = useRef(null);
  const CompareRef = useRef(null);
  const AssetAlloRef = useRef(null);
  const TopHoldRef = useRef(null);
  const RiskMeasureRef = useRef(null);
  const OthersRef = useRef(null);

  const sectionRefs = [
    { section: "Overview", ref: OverviewRef },
    { section: "FundDetails", ref: FundDetailsRef },
    { section: "Compare", ref: CompareRef },
    { section: "AssetAllo", ref: AssetAlloRef },
    { section: "TopHold", ref: TopHoldRef },
    { section: "RiskMeasure", ref: RiskMeasureRef },
    { section: "Others", ref: OthersRef },
  ];

  useEffect(() => {
    function handleResize() {
      var ww = window.innerWidth;

      switch (true) {
        case ww < 780.1:
          setBreakWord(100);
          break;
        case ww < 1280.1:
          setBreakWord(100);
          break;
        case ww < 1920.1:
          setBreakWord(100);
          break;
        default:
          setBreakWord(100);
          break;
      }
    }
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;
      const selected = sectionRefs.find(({ section, ref }) => {
        const ele = ref.current;
        if (ele) {
          const { offsetBottom, offsetTop } = getDimensions(ele);
          return scrollPosition > offsetTop && scrollPosition < offsetBottom;
        }
      });
      if (document.querySelector("header") == null) return;

      if (document.querySelector(".sticky.fixed_top_Nav") != null) {
        document.querySelector(".sticky.fixed_top_Nav").style.top =
          document.querySelector("header").getBoundingClientRect().height +
          "px";
      }
      document.querySelectorAll(".dv-fixed-menu").forEach((v) => {
        v.classList.remove("selected");
      });
      if (selected && selected.section) {
        document
          .querySelector(".dv-" + selected.section)
          .classList.add("selected");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [style, setStyle] = useState("cont");
  const [isInWishlist, setIsInWishlist] = useState(null);


  const changeStyle = () => {
    setIsInWishlist(!isInWishlist);
    setStyle("cont3");
  };
  React.useEffect(() => {
    if (isInWishlist === true) {
    } else if (isInWishlist === false) {
    }
  }, [isInWishlist]);

  const handleChooseCompare = (v) => {
    var newArray = compareArray;
    if (newArray.findIndex((x) => x.scheme_code == v.scheme_code) > -1) {
      newArray.splice(newArray.indexOf(v), 1);
    } else {
      if (Array.isArray(newArray) && newArray.length < 2) {
        newArray.push(v);
      } else {
        if ((!toast.isActive('limitexceed'))) {
          toast.error("You cannot select more than two funds.", {
            position: "bottom-left",
            toastId: "limitexceed"

          });
        }

      }
    }
    setCompareArray([...newArray]);
  };

  const openComparePage = () => {
    var mainSchemeCode = productDetail[0].Overview.scheme_code;
    localStorage.setItem(
      "schemecode",
      [mainSchemeCode, ...compareArray.map((v) => v.scheme_code)].join(",")
    );
    navigate("/direct-mutual-fund/Compare");
  };
  const loadDataForCalculator = (p) => {

    if (Boolean(p?.Overview?.return_3yr)) {
      setCalculatorData(prev => ({ ...prev, expectedDuration: 3, expectedReturns: Math.round(p?.Overview?.return_3yr * 1) }));
      // setExpectedReturns(Math.round(p[0].Overview.return_3yr * 1));
      // setExpectedDuration(3);
    } else if (Boolean(p?.Overview?.return_1yr)) {
      setCalculatorData(prev => ({ ...prev, expectedDuration: 1, expectedReturns: Math.round(p?.Overview?.return_1yr * 1) }));
      // setExpectedReturns(Math.round(p[0].Overview.return_1yr * 1));
      // setExpectedDuration(1);
    }
  };
  const onAmountChange = (v) => {
    setCalculatorData(prev => ({ ...prev, amount: Number(v.amount), type: v.type }));
  };
  useEffect(() => {
    let newData = calculatorData;
    // if (newData.amount == 0) return;
    if (newData.type == "sip") {
      newData.expectedResult = FV(
        newData.expectedReturns / 100 / 12,
        newData.expectedDuration * 12,
        newData.amount * -1,
        null,
        1
      );
      newData.investedAmount = Number(newData.amount) * newData.expectedDuration * 12;
      newData.estReturns = Math.round(
        Number(newData.expectedResult) - 12 *
        newData.expectedDuration *
        newData.amount
      );
    } else {
      newData.expectedResult = FV(
        newData.expectedReturns / 100,
        newData.expectedDuration,
        null,
        newData.amount * -1,
        0
      );
      newData.investedAmount = newData.amount;
      newData.estReturns = Math.round(Number(newData.expectedResult) - newData.amount);
    }
    setCalculatorData({ ...newData });
  }, [calculatorData?.amount, calculatorData?.expectedReturns, calculatorData?.expectedDuration, calculatorData?.type]);

  const [showBuyModal, setShowBuyModal] = useState(false);

  return (
    <GuestLayout>
      <div className="classList h-100 mf-detail-dv">
        <Container>
          <Row>
            <span className="Rupeees">
              <Link to={`/direct-mutual-fund/funds/all`}>
                <img
                  className="BackBtn"
                  style={{ marginLeft: 0 }}
                  src={process.env.REACT_APP_STATIC_URL + "media/DMF/left-arrow.svg"}
                  alt=""
                  srcset=""
                />
              </Link>
            </span>
            <div className="col-12">
              {error && (
                <h2 style={{ display: "flex", justifyContent: "center" }}>
                  404 NO DATA FOUND.
                </h2>
              )}
              {/* <FintooInlineLoader isLoading={isLoading} /> */}
              <FintooLoader isLoading={isLoading} />
            </div>
            {!isLoading && productDetail.map((item, index) => (
              < >
                <div className="LeftSection col-12 col-md-8">

                  <div className="pe-lg-2">
                    <div className="HeaderFix">
                      <Row>
                        <Col sm={9}>
                          <div className="headerbx">
                            <span>
                              <img
                                id="amc_img"
                                style={{ width: "40px", height: "40px" }}
                                className="amc_logo rounded-circle"
                                // src={`${process.env.REACT_APP_STATIC_URL}/media/companyicons/${item.Overview?.amc_code}.png`}
                                src={
                                  item?.Overview?.amc_code
                                    ? `${process.env.REACT_APP_STATIC_URL}/media/companyicons/${item.Overview.amc_code}.png`
                                    : defaultamclogo()
                                }

                                alt=""
                                // onError={() => {
                                //   document.getElementById('amc_img').setAttribute('src', defaultamclogo());
                                // }}
                                onError={(e) => {
                                  e.target.src = defaultamclogo();
                                }}

                              />
                            </span>
                            <h4 className="FundName">
                              {item?.Overview?.scheme_name
                                ? item.Overview.scheme_name.length > breakWord
                                  ? item.Overview.scheme_name.substr(0, breakWord) + "..."
                                  : item.Overview.scheme_name
                                : "--"}
                            </h4>
                          </div>
                          <Row className="">
                            <Col sm={6} className="title-bottom-bx">
                              <div className="title-bottom tb-gap">
                                <p>{item.Overview.fintoo_category_name}</p>
                                <p>|</p>
                                <p>{item.Overview.scheme_risk_value}</p>
                                <p>|</p>
                                <p className="bottom-starrating-container">
                                  <p>{item.Overview.scheme_star_rating}</p>
                                  <p>
                                    <FaStar style={{ color: "#FFBF00" }} />
                                  </p>
                                </p>
                              </div>
                            </Col>
                            <Col sm={6} className="title-bottom-bx">
                              <div className="row title-bottom title-bottom-rt">
                                <div className="col-6 FunSubDetails">
                                  <p className="Text">Corpus</p>
                                  <p className="fundCrVal">
                                    {/* {item?.Overview?.aum_total ? formatPrice(
                                      item.Overview.aum_total.toFixed(2)
                                    ) : ""} */}
                                    {item?.Overview?.aum_total
                                      ? formatPrice(Number(item.Overview.aum_total).toFixed(2))
                                      : ""}
                                  </p>
                                  <p className="Text">
                                    {item.Overview.aum_date !== null ? (
                                      <i>
                                        (As on{" "}
                                        {moment(item.Overview.aum_date).format(
                                          "DD-MM-YYYY"
                                        )}
                                        )
                                      </i>
                                    ) : (
                                      <i>( NA )</i>
                                    )}
                                  </p>
                                </div>
                                <div className="col-6 FunSubDetails">
                                  <p className="Text">Exp. ratio</p>
                                  <p className="fundCrVal">
                                    {/* {item.Overview.exp_ratio}% */}
                                    {item.Overview.exp_ratio
                                      ? `${item.Overview.exp_ratio}%`
                                      : ""}

                                  </p>
                                  <p className="Text">
                                    {item.Overview.exp_ratio_date !== null ? (
                                      <i>
                                        (As on{" "}
                                        {moment(
                                          item.Overview.exp_ratio_date
                                        ).format("DD-MM-YYYY")}
                                        )
                                      </i>
                                    ) : (
                                      <i>( NA )</i>
                                    )}
                                  </p>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </Col>
                        <Col sm={3}>
                          <div className=" mobileNav">
                            <div className="box-88">
                              <div className="LatestNavText">
                                <p style={{ textAlign: "right" }}>Latest Nav</p>
                              </div>
                              <div className="ValueFund">
                                <span className="FundPrice">
                                  {indianRupeeFormat1(item.Overview.navrs)}
                                </span>
                                <span className="DiffLine"></span>
                                <span
                                  className="FundPlusminusVal"
                                  style={{
                                    color:
                                      item.Overview.netchange < 0
                                        ? "red"
                                        : "green" &&
                                          item.Overview.netchange == 0
                                          ? "black"
                                          : "green",
                                  }}
                                >
                                  {item.Overview.netchange > 0 ? "+" : ""}
                                  {item.Overview.netchange}%
                                </span>
                              </div>
                            </div>

                            <div className="FundIcon">
                              <div
                                className="changeColor"
                                onClick={() => {
                                  setShowShare((v) => !v);
                                }}
                              >
                                {showShare ? (
                                  <MdClose
                                    style={{ fontSize: "20px" }}
                                    className={"cont"}
                                  />
                                ) : (
                                  <FaShareAlt
                                    style={{ fontSize: "18px" }}
                                    className={"cont"}
                                  />
                                )}
                              </div>
                              {showShare && <FintooShareBox />}

                              <div
                                className="changeColor"
                                onClick={changeStyle}
                              >
                                <AddToWish
                                  value={isInWishlist}
                                  scheme_slug={item.Overview.scheme_slug}
                                  scheme_code={item.Overview.scheme_code}
                                />
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                    <div className="sticky ">
                      <h4 className="FundName ">
                        {item?.Overview?.scheme_name?.length > breakWord
                          ? item.Overview.scheme_name.substr(0, breakWord) +
                          "..."
                          : item.Overview.scheme_name}
                      </h4>
                      <div
                        className="header stckymenu d-none d-md-block"
                        ref={OverviewRef}
                      >
                        <button
                          type="button"
                          className={`dv-fixed-menu dv-Overview header_link ${visibleSection === "Overview" ? "selected" : ""
                            }`}
                          onClick={() => {
                            scrollTo(OverviewRef.current);
                          }}
                        >
                          Overview
                        </button>
                        <button
                          type="button"
                          className={`dv-fixed-menu dv-FundDetails header_link ${visibleSection === "FundDetails" ? "selected" : ""
                            }`}
                          onClick={() => {
                            scrollTo(FundDetailsRef.current);
                          }}
                        >
                          Fund&nbsp;Details
                        </button>
                        <button
                          type="button"
                          className={`dv-fixed-menu dv-Compare header_link ${visibleSection === "Compare" ? "selected" : ""
                            }`}
                          onClick={() => {
                            scrollTo(CompareRef.current);
                          }}
                        >
                          Compare
                        </button>
                        <button
                          type="button"
                          className={`dv-fixed-menu dv-AssetAllo header_link ${visibleSection === "AssetAllo" ? "selected" : ""
                            }`}
                          onClick={() => {
                            scrollTo(AssetAlloRef.current);
                          }}
                        >
                          Asset&nbsp;Allocation
                        </button>
                        <button
                          type="button"
                          className={`dv-fixed-menu dv-TopHold header_link ${visibleSection === "TopHold" ? "selected" : ""
                            }`}
                          onClick={() => {
                            scrollTo(TopHoldRef.current);
                          }}
                        >
                          Top&nbsp;Holdings
                        </button>
                        <button
                          type="button"
                          className={`dv-fixed-menu dv-RiskMeasure header_link ${visibleSection === "RiskMeasure" ? "selected" : ""
                            }`}
                          onClick={() => {
                            scrollTo(RiskMeasureRef.current);
                          }}
                        >
                          Risk&nbsp;Measures
                        </button>
                        <button
                          type="button"
                          className={`dv-fixed-menu dv-Others header_link ${visibleSection === "Others" ? "selected" : ""
                            }`}
                          onClick={() => {
                            scrollTo(OthersRef.current);
                          }}
                        >
                          Others
                        </button>
                      </div>
                    </div>
                    <div className="">
                      <div className="content details-section">
                        <div
                          className="section"
                          id="Overview"
                          ref={OverviewRef}
                        >
                          <div className="overviewDetails">
                            <div className="row">
                              <div className="col-12 col-md-6 colleft1">
                                <div className="px-lg-2">
                                  <p className="bxheader-name">Nav Trend</p>
                                  <div className="Cagr">
                                    <div className="NavVal">
                                      <p className="ow-subtitle">6 Months</p>
                                      <p className="RsVal">
                                        {" "}
                                        {item.Overview["6M_nav"] === "" ||
                                          item.Overview["6M_nav"] === null
                                          ? "-"
                                          : "" +
                                          indianRupeeFormat1(
                                            (
                                              1 * item.Overview["6M_nav"]
                                            ).toFixed(2)
                                          )}
                                      </p>
                                    </div>
                                    <div className="NavVal">
                                      <p className="ow-subtitle">1 Year</p>
                                      <p className="RsVal">
                                        {" "}
                                        {item.Overview["1Y_nav"] === "" ||
                                          item.Overview["1Y_nav"] === null
                                          ? "-"
                                          : "" +
                                          indianRupeeFormat1(
                                            (
                                              1 * item.Overview["1Y_nav"]
                                            ).toFixed(2)
                                          )}
                                      </p>
                                    </div>
                                    <div className="NavVal">
                                      <p className="ow-subtitle">3 Years</p>
                                      <p className="RsVal">
                                        {" "}
                                        {item.Overview["3Y_nav"] === "" ||
                                          item.Overview["3Y_nav"] === null
                                          ? "-"
                                          : "" +
                                          indianRupeeFormat1(
                                            (
                                              1 * item.Overview["3Y_nav"]
                                            ).toFixed(2)
                                          )}
                                      </p>
                                    </div>
                                    <div className="NavVal">
                                      <p className="ow-subtitle">5 Years </p>
                                      <p className="RsVal">
                                        {" "}
                                        {item.Overview["5Y_nav"] === "" ||
                                          item.Overview["5Y_nav"] === null
                                          ? "-"
                                          : "" +
                                          indianRupeeFormat1(
                                            (
                                              1 * item.Overview["5Y_nav"]
                                            ).toFixed(2)
                                          )}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="col-12 col-md-6 colright1">
                                <div className="px-lg-2">
                                  <p className="bxheader-name">
                                    Performance History (CAGR)
                                  </p>
                                  <div className="Cagr">
                                    <div className="NavVal">
                                      <p className="ow-subtitle">3 M</p>
                                      <p className="RsVal">
                                        {" "}
                                        {/* {item.Overview["3M_ret"]}% */}
                                        {Number(item.Overview["3M_ret"]).toFixed(2)}%
                                      </p>
                                    </div>
                                    <div className="NavVal">
                                      <p className="ow-subtitle">6 M</p>
                                      <p className="RsVal">
                                        {" "}
                                        {/* {item.Overview["6M_ret"]}% */}
                                        {Number(item.Overview["6M_ret"]).toFixed(2)}%
                                      </p>
                                    </div>
                                    <div className="NavVal">
                                      <p className="ow-subtitle">1 Y</p>
                                      <p className="RsVal">
                                        {" "}
                                        {/* {item.Overview["1Y_ret"]}% */}
                                        {Number(item.Overview["1Y_ret"]).toFixed(2)}%
                                      </p>
                                    </div>
                                    <div className="NavVal">
                                      <p className="ow-subtitle">3 Y</p>
                                      <p className="RsVal">
                                        {" "}
                                        {/* {item.Overview["3Y_ret"]}% */}
                                        {Number(item.Overview["3Y_ret"]).toFixed(2)}%
                                      </p>
                                    </div>
                                    <div className="NavVal">
                                      <p className="ow-subtitle">5 Y</p>
                                      <p className="RsVal">
                                        {" "}
                                        {/* {item.Overview["5Y_ret"]}% */}
                                        {Number(item.Overview["5Y_ret"]).toFixed(2)}%
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="OverGraph">
                            <Splinechart Overview={item?.Overview} />
                          </div>
                        </div>
                        <div
                          className="section"
                          id="FundDetails"
                          ref={FundDetailsRef}
                        >
                          <div>
                            <h4 className="section-heading">Fund Details</h4>
                            <div className="BottomLine"></div>
                            <div className="FundDetail">
                              <div className="inner-item-details">
                                <div className="inner-item-details-top-bx">
                                  <span>
                                    <img
                                      src={
                                        process.env.REACT_APP_STATIC_URL +
                                        "media/DMF/saving-money.svg"
                                      }
                                      alt="Fund House"
                                    />
                                  </span>{" "}
                                  <span className="mobileFund">Fund House</span>
                                </div>
                                <div className="inner-item-details-top-bx">
                                  <p className="FundNames">
                                    {item.Overview.amc_name}
                                  </p>
                                </div>
                              </div>
                              <div className="inner-item-details">
                                <div className="inner-item-details-top-bx">
                                  <span>
                                    <img
                                      src={
                                        process.env.REACT_APP_STATIC_URL +
                                        "media/DMF/launch_date.svg"
                                      }
                                      alt="Launch Date"
                                      width={"30px"}
                                    />
                                  </span>{" "}
                                  <span className="mobileFund">
                                    Launch Date
                                  </span>
                                </div>
                                <div className="inner-item-details-top-bx">
                                  <p className="FundNames">
                                    {moment(
                                      item.Overview?.scheme_inception_date
                                    ).format("DD-MM-YYYY")}
                                  </p>
                                </div>
                              </div>
                              <div className="inner-item-details">
                                <div className="inner-item-details-top-bx">
                                  <span>
                                    <img
                                      src={
                                        process.env.REACT_APP_STATIC_URL +
                                        "media/DMF/lock.svg"
                                      }
                                      alt="Lock-in-Period"
                                    />
                                  </span>{" "}
                                  <span className="mobileFund">
                                    Lock-in-Period
                                  </span>
                                </div>
                                <p className="FundNames">
                                  {item.Overview?.scheme_lock_period * 1 > 0 ?
                                    item.Overview?.scheme_lock_period + " Years"
                                    : "No lock-in"}
                                </p>
                              </div>
                              <div className="inner-item-details">
                                <div className="inner-item-details-top-bx">
                                  <span>
                                    <img
                                      src={
                                        process.env.REACT_APP_STATIC_URL +
                                        "media/DMF/benchmark.svg"
                                      }
                                      alt="Scheme Benchmark"
                                    />
                                  </span>{" "}
                                  <span className="mobileFund">
                                    Scheme Benchmark
                                  </span>
                                </div>
                                <div>
                                  <p className="FundNames">
                                    {item.fund_detail?.scheme_benchmark &&
                                      item.fund_detail?.scheme_benchmark.trim() !== ""
                                      ? item.fund_detail.scheme_benchmark
                                      : "-"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="BottomLine"></div>
                            <div className="FundDetail">
                              <div className="inner-item-details">
                                <div className="inner-item-details-top-bx">
                                  <span>
                                    <img
                                      src={
                                        process.env.REACT_APP_STATIC_URL +
                                        "media/DMF/pay-day.svg"
                                      }
                                      alt="Min SIP Invt"
                                      width={"30px"}
                                    />
                                  </span>{" "}
                                  <span className="mobileFund">
                                    Min SIP Invt
                                  </span>
                                </div>
                                <p className="FundNames">
                                  {" "}
                                  {Boolean(
                                    item.fund_detail.sip_minimum_investment * 1
                                  )
                                    ? indianRupeeFormat1(
                                      item.fund_detail.sip_minimum_investment * 1,
                                      0
                                    )
                                    : "-"}
                                </p>
                              </div>
                              <div className="inner-item-details">
                                <div className="inner-item-details-top-bx">
                                  <span>
                                    <img
                                      src={
                                        process.env.REACT_APP_STATIC_URL +
                                        "media/DMF/01_min_lumpsump.svg"
                                      }
                                      alt="Min Lumpsum Invt"
                                      width={"30px"}
                                    />
                                  </span>{" "}
                                  <span className="mobileFund">
                                    Min Lumpsum Invt
                                  </span>
                                </div>
                                <p className="FundNames">
                                  {indianRupeeFormat1(
                                    item.fund_detail.lumpsum_minimum_investment
                                  )}
                                </p>
                              </div>
                              <div className="inner-item-details">
                                <div className="inner-item-details-top-bx">
                                  <span>
                                    <img
                                      src={
                                        process.env.REACT_APP_STATIC_URL +
                                        "media/DMF/schme_type.svg"
                                      }
                                      alt="Scheme Type"
                                    />
                                  </span>{" "}
                                  <span className="mobileFund">
                                    Scheme Type
                                  </span>
                                </div>
                                <p className="FundNames">
                                  {item.Overview?.scheme_type_code}
                                </p>
                              </div>
                              <div className="inner-item-details">
                                <div className="inner-item-details-top-bx">
                                  <span>
                                    <img
                                      src={
                                        process.env.REACT_APP_STATIC_URL +
                                        "media/DMF/exit_load.svg"
                                      }
                                      alt="Exit Load"
                                    />
                                  </span>
                                  <span className="mobileFund">
                                    Exit Load
                                    {item?.fund_detail?.exit_loads?.length > 1 && (
                                      <sup>
                                        <span className="info">
                                          <img
                                            style={{
                                              width: "12px",
                                              height: "12px",
                                              marginLeft: "10px",
                                            }}
                                            data-tip
                                            data-for="ExitLoad"
                                            data-event-off
                                            data-title=""
                                            src={information}
                                          />
                                        </span>
                                      </sup>
                                    )}
                                  </span>

                                  <ReactTooltip
                                    id="ExitLoad"
                                    place="top"
                                    className="Tool"
                                    effect="solid"
                                    style={{
                                      height: "200px !important",
                                    }}
                                  >
                                    <ol className="NameData">
                                      {/* {item.fund_detail.additional_exit_loads} */}
                                      {item?.fund_detail?.additional_exit_loads?.length > 0
                                        ? item?.fund_detail?.additional_exit_loads?.replace(
                                          "0.0000%",
                                          "Nil"
                                        )
                                        : "-"}
                                      {/* {item.fund_detail.additional_exit_loads.replace("0.0000%","Nil")} */}
                                    </ol>
                                  </ReactTooltip>
                                </div>
                                <div>
                                  <p className="FundNames">
                                    {item?.fund_detail?.exit_loads?.length > 0 ? (
                                      (() => {
                                        const exitLoad = item.fund_detail.exit_loads[0];

                                        const value = Number(exitLoad.exit_load_value);

                                        // Map numeric unit → readable text
                                        const unitMap = {
                                          0: "days",
                                          1: "months",
                                          2: "years",
                                        };

                                        const unit =
                                          unitMap[Number(exitLoad.exit_break_point_unit)] || "";

                                        const breakpoint =
                                          exitLoad.exit_high_break_point > 0
                                            ? exitLoad.exit_high_break_point
                                            : exitLoad.exit_low_break_point;

                                        if (value === 0) return "Nil";

                                        return (
                                          <>
                                            {value}%{" "}
                                            <span className="Text" style={{ fontWeight: 100 }}>
                                              if redeemed within {breakpoint} {unit}
                                            </span>
                                          </>
                                        );
                                      })()
                                    ) : (
                                      "-"
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="BottomLine"></div>
                          </div>
                        </div>
                        <div className="section" id="Compare" ref={CompareRef}>
                          <div className="Table_Compare ">
                            <div
                              className="Table_compare_Opt section-heading"
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span className="header_NM">
                                  Compare with Other Funds
                                </span>
                              </div>
                              <div style={{ float: "right", color: "gray" }}>
                                <button
                                  // disabled={compareArray?.length == 0}
                                  disabled={!compareArray?.length}
                                  onClick={() => openComparePage()}
                                  className="fundComp"
                                >
                                  Compare
                                </button>
                              </div>
                            </div>
                            <table id="DMF_table" className="">
                              <tr>
                                <th
                                  style={{
                                    textAlign: "center",
                                    paddingLeft: "3rem",
                                  }}
                                >
                                  Funds Name
                                </th>
                                <th>1Y(%)</th>
                                <th>3Y(%)</th>
                                <th>5Y(%)</th>

                                <th>AUM (in Cr.)</th>
                              </tr>
                              {item.compare.map((v) => (
                                <tr>
                                  <td>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                      <span className="fund-checkbx">
                                        <input
                                          checked={
                                            compareArray.findIndex(
                                                (x) =>
                                                  x.scheme_code == v.scheme_code
                                              ) > -1
                                          }
                                          type="checkbox"
                                          name=""
                                          id=""
                                          value={v.scheme_slug}
                                          onChange={(e) => {
                                            handleChooseCompare(v);
                                          }}
                                        />
                                      </span>
                                      <span className="fund_amc">
                                        <a
                                          href={
                                            v.scheme_slug != ""
                                              ? process.env.PUBLIC_URL +
                                              "/direct-mutual-fund/MutualFund/" +
                                              v.scheme_slug
                                              : process.env.PUBLIC_URL +
                                              "/direct-mutual-fund/MutualFund/" +
                                              v.scheme_code
                                          }
                                          style={{
                                            textDecoration: "none",
                                            color: "#042b62",
                                          }}
                                        >
                                          {v.scheme_name}
                                        </a>
                                      </span>
                                    </div>
                                  </td>
                                  <td>{(v.scheme_1_year_ret * 1).toFixed(2)} %</td>
                                  <td>{(v.scheme_3_year_ret * 1).toFixed(2)} %</td>
                                  <td>{(v.scheme_5_year_ret * 1).toFixed(2)} %</td>

                                  <td>
                                    {isNaN(Number(v?.total))
                                      ? "-"
                                      : formatPrice(Number(v.total).toFixed(2))}
                                  </td>

                                </tr>
                              ))}
                            </table>
                          </div>
                          <div className="Mobile_Compare_Opt">
                            <div className="Mobile_Table">
                              <div className="table-left">
                                <table>
                                  <tr>
                                    <th>Fund Name</th>
                                  </tr>
                                  {item.compare.map((v) => (
                                    <tr>
                                      <td style={{ whiteSpace: "nowrap" }}>
                                        <span>
                                          <input
                                            type="checkbox"
                                            name=""
                                            id=""
                                            style={{ marginRight: "10px" }}
                                            checked={
                                              compareArray.findIndex(
                                                (x) =>
                                                  x.scheme_code == v.scheme_code
                                              ) > -1
                                            }
                                            value={v.scheme_code}
                                            onChange={(e) => {
                                              handleChooseCompare(v);
                                            }}
                                          />
                                        </span>
                                        <span>{v.scheme_name}</span>
                                      </td>
                                    </tr>
                                  ))}
                                </table>
                              </div>
                              <div className="table-center">
                                <table>
                                  <tr className="tablr_Head">
                                    <th>1Y(%)</th>
                                    <th>3Y(%)</th>
                                    <th>5Y(%)</th>

                                    <th>AUM (in Cr.)</th>
                                  </tr>
                                  {item.compare.map((v) => (
                                    <tr>
                                      <td>{(v.return_1yr * 1).toFixed(2)} %</td>
                                      <td>{(v.return_3yr * 1).toFixed(2)} %</td>
                                      <td>{(v.return_5yr * 1).toFixed(2)} %</td>

                                      <td>
                                        {v.total == null
                                          ? "-"
                                          : formatPrice(Number(v.total).toFixed(2))}
                                      </td>
                                    </tr>
                                  ))}
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="section"
                          id="AssetAllo"
                          ref={AssetAlloRef}
                        >
                          <h4 className="section-heading">Allocation</h4>
                          <div className="BottomLine"></div>
                          <Allocation
                            dataAssets={[
                              {
                                title: "Large cap",
                                value: item.asset_allocation.large_cap,
                                color: "#008FFB",
                              },
                              {
                                title: "Mid cap",
                                value: item.asset_allocation.mid_cap,
                                color: "#00E396",
                              },
                              {
                                title: "Small cap",
                                value: item.asset_allocation.small_cap,
                                color: "#FEB019",
                              },
                              {
                                title: "Others",
                                value: item.asset_allocation.other_capital,
                                color: "#8F00FF",
                              },
                            ]}
                            dataDebts={[
                              {
                                title: "A",
                                value: item.asset_allocation.credit_qual_a,
                                color: "#008FFB",
                              },
                              {
                                title: "AA",
                                value: item.asset_allocation.credit_qual_aa,
                                color: "#00E396",
                              },
                              {
                                title: "AAA",
                                value: item.asset_allocation.credit_qual_aaa,
                                color: "#FEB019",
                              },
                              {
                                title: "B",
                                value: item.asset_allocation.credit_qual_b,
                                color: "#8F00FF",
                              },
                              {
                                title: "BB",
                                value: item.asset_allocation.credit_qual_bb,
                                color: "#009933",
                              },
                              {
                                title: "BBB",
                                value: item.asset_allocation.credit_qual_bbb,
                                color: "#993333",
                              },
                            ]}
                            sector_alloc={item.sector_allocation}
                            asset_allocation={item.asset_allocation}
                          />
                        </div>
                        <div
                          className="Top_Holdings section"
                          id="TopHold"
                          ref={TopHoldRef}
                        >
                          <div className="Holdings_table">
                            <h4>Holdings</h4>
                            {item?.top_holdings?.length === 0 ? (
                              <p>NA</p>
                            ) : (
                            <table className="Table_Hold">
                              <tr>
                                <th>Name</th>
                                <th>Sector</th>
                                <th>Asset class</th>
                                <th>Assets</th>
                              </tr>
                              {item.top_holdings
                                .filter((v, i) =>
                                  show5funds ? (i < 5 ? true : false) : true
                                )
                                .map((val) => (
                                  <tr>
                                    <td>
                                      <div className="icon-text-bxline">
                                        <img
                                          src={
                                            process.env.REACT_APP_STATIC_URL +
                                            "media/02_All_stocks_Blue.svg"
                                          }
                                          alt="Aditya Biral Sun Life Liquid Fund"
                                        />
                                        <p className="Nm">{val.comp_name}</p>
                                      </div>
                                    </td>
                                    <td>
                                      {val?.sector_name?.trim() ? val.sector_name : "Others"}
                                    </td>
                                    <td>{val.fintoo_category_name}</td>
                                    <td>
                                      {Number(val.periodic_hold).toFixed(1)}%
                                    </td>
                                  </tr>
                                ))}
                            </table>
                             )}
                            {item?.top_holdings?.length > 5 &&
                              show5funds === true && (
                                <p
                                  onClick={() => setShow5Funds(false)}
                                  className="Checkall"
                                  style={{
                                    color: "#042b62",
                                    // fontSize: "17px",
                                    fontWeight: "900",
                                  }}
                                >
                                  {/* View All <FaAngleDown /> */}
                                  View all
                                </p>
                              )}
                            {item?.top_holdings?.length > 5 &&
                              show5funds === false && (
                                <p
                                  onClick={() => {
                                    setShow5Funds(true);
                                    scrollTo(TopHoldRef.current);
                                  }}
                                  className="Checkall"
                                  style={{
                                    color: "#042b62",
                                    // fontSize: "17px",
                                    fontWeight: "900",
                                  }}
                                >
                                  {/* Show Less <FaAngleUp /> */}
                                  View less
                                </p>
                              )}
                          </div>
                          <div className="Mobile_Holdings">
                            {item.top_holdings
                              .filter((v, i) =>
                                show5funds ? (i < 5 ? true : false) : true
                              )
                              .map((val) => (
                                <div className="Top_Holding_List">
                                  <div>{val.comp_name}</div>
                                  <div className="RangeData">
                                    <div className="range-outer">
                                      <div
                                        className="range-inner"
                                        style={{
                                          width: val.periodic_hold + "%",
                                        }}
                                      ></div>
                                    </div>
                                    <div>
                                      <span
                                        style={{
                                          float: "right",
                                          color: "gray",
                                        }}
                                      >
                                        {val.periodic_hold}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            <br />
                            {item?.top_holdings?.length > 5 &&
                              show5funds === true && (
                                <p
                                  onClick={() => setShow5Funds(false)}
                                  className="check"
                                  style={{
                                    color: "gray",
                                    fontSize: "17px",
                                    fontWeight: "900",
                                  }}
                                >
                                  View All <FaAngleDown />
                                </p>
                              )}
                            {item?.top_holdings?.length > 5 &&
                              show5funds === false && (
                                <p
                                  onClick={() => setShow5Funds(true)}
                                  className="check"
                                  style={{
                                    color: "gray",
                                    fontSize: "17px",
                                    fontWeight: "900",
                                  }}
                                >
                                  Show Less <FaAngleUp />
                                </p>
                              )}
                          </div>
                        </div>
                        <div
                          className="section"
                          id="RiskMeasure"
                          ref={RiskMeasureRef}
                        >
                          <div className="Risk_mesures">
                            <table className="Table_Hold">
                              <tr>
                                <th>Risk Measures (%)</th>
                                <th>Mean</th>
                                <th>Beta</th>
                                <th>Alpha</th>
                              </tr>
                              <tr>
                                <td>{item.risk_measure.scheme_name}</td>
                                <td>
                                  {item.risk_measure.mean_3yr !== null
                                    ? (1 * item.risk_measure.mean_3yr).toFixed(
                                      2
                                    )
                                    : "-"}
                                </td>
                                <td>
                                  {item.risk_measure.beta_3yr !== null
                                    ? (1 * item.risk_measure.beta_3yr).toFixed(
                                      2
                                    )
                                    : "-"}
                                </td>
                                <td>
                                  {item.risk_measure.alpha_3yr !== null
                                    ? (1 * item.risk_measure.alpha_3yr).toFixed(
                                      2
                                    )
                                    : "-"}
                                </td>
                              </tr>
                              <tr>
                                <td>Rank within category</td>
                                <td>{item.rank_list.avMean_rank}</td>
                                <td>{item.rank_list.avBeta_rank}</td>
                                <td>{item.rank_list.avAlpha_rank}</td>
                              </tr>
                            </table>
                          </div>
                        </div>
                        <div className="section" id="Others" ref={OthersRef}>
                          <div className="OthersPanel">
                            <h4 className="section-heading">Others</h4>
                            <hr />
                            <div className="other-detail-main-box">
                              <div className="d-flex">
                                <span>
                                  <img
                                    src={
                                      item?.Overview?.amc_code
                                        ? `${process.env.REACT_APP_STATIC_URL}/media/companyicons/${item.Overview.amc_code}.png`
                                        : defaultamclogo()
                                    }
                                    alt="Canara Robeco Mutual Fund"
                                    onError={(e) => {
                                      e.target.src = defaultamclogo();
                                    }}
                                  />

                                  {/* <img
                                    src={`${process.env.REACT_APP_STATIC_URL}/media/companyicons/${item.Overview?.amc_code}.png`}
                                    alt="Canaera Robeco Mutual Fund"
                                  /> */}
                                </span>
                                <span className="Nm">
                                  {item.Overview.scheme_name}
                                </span>
                              </div>

                              <div className="Other_Detail">
                                <div
                                  className="Other_First"
                                  style={{ display: "grid" }}
                                >
                                  <span>Date of Incorporation</span>
                                  <span>
                                    {moment(item.Overview.scheme_inception_date).format(
                                      "DD-MM-YYYY"
                                    )}
                                  </span>
                                </div>
                                <span className="Vertical_Line"></span>
                                <div
                                  className="Other_First"
                                  style={{ display: "grid" }}
                                >
                                  <span>Total AUM</span>
                                  <span>
                                    {item?.Overview?.aum_total ? formatPrice(
                                      item.Overview.aum_total
                                    ) : ""}
                                  </span>
                                </div>
                              </div>
                              <hr />
                              <div className="RegName">
                                <p
                                  style={{ color: "gray", marginBottom: 0 }}
                                  className="fund-bx-title"
                                >
                                  Registrar Name
                                </p>
                                <span className="UserNM">
                                  {/* {item.others.rt_name} */}
                                  {item.others?.[0]?.rta_name || "--"}
                                </span>
                              </div>
                              <div className="FundMangerName">
                                <p
                                  style={{ color: "gray", marginBottom: 0 }}
                                  className="fund-bx-title"
                                >
                                  Fund Manager{" "}
                                </p>
                                <div style={{ display: "flex" }}>
                                  <span className="UserNM">
                                    {/* {item.others.managers} */}
                                    {item.others?.[0]?.managers || "--"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bottom-spacer" />
                    </div>
                  </div>
                </div>

                <div className="RightSection col-12 col-md-4">
                  <div className="RightSide SIP_Lumpsum ps-lg-2" id="fin-calc">
                    {productDetail?.length > 0 && (
                      <TabData
                        fundData={productDetail[0]}
                        onAmountChange={(v) => onAmountChange(v)}
                      />
                    )}
                  </div>
                  <div className="RightSide ps-lg-2">
                    <div id="Calc_Amt_Range">
                      <p>Calculate amount (Rs)</p>
                      <div className="return">
                        <div className="Amtreturn">
                          <div> Expected Return</div>
                          <div style={{ color: "#042b62" }}>
                            {calculatorData.expectedReturns}%
                          </div>
                        </div>
                        <InputSlider
                          min={0}
                          max={100}
                          onChange={(v) => setCalculatorData(prev => ({ ...prev, expectedReturns: v }))}
                          value={calculatorData?.expectedReturns}
                        />
                      </div>
                      <div className="invest">
                        <div className="Amtreturn">
                          <div> Expected Investment Duration</div>
                          <div style={{ color: "#042b62" }}>
                            {calculatorData.expectedDuration} Yrs
                          </div>
                        </div>
                        <InputSlider
                          min={0}
                          max={100}
                          onChange={(v) => setCalculatorData(prev => ({ ...prev, expectedDuration: v }))}
                          value={calculatorData?.expectedDuration}
                        />
                      </div>
                    </div>
                    <div className="amnt">
                      <div className="Box_Value">
                        <div className="IM">
                          <span className="TextNam">Invested Amount</span>
                          <div style={{ display: "grid" }}>
                            <span>
                              <span
                                style={{
                                  color: "#fff",
                                  fontSize: "18px",
                                  fontWeight: "600",
                                }}
                              >
                                {(formatPrice(calculatorData.investedAmount))}
                                {/* {indianRupeeFormat(formatPrice(calculatorData.investedAmount))} */}
                              </span>
                            </span>
                          </div>
                        </div>
                        <div className="Est_Re">
                          <span className="TextNam">Est. Returns</span>
                          <span
                            style={{
                              color: "#fff",
                              fontSize: "18px",
                              fontWeight: "600",
                              wordBreak: "break-all",
                              overflow: "hidden",
                              width: "100%",
                              display: "block",
                            }}
                          >
                            {formatPrice(calculatorData?.estReturns ?? 0)}
                          </span>
                        </div>
                      </div>
                      <div className="Total_Val">
                        <span>Total Value</span>
                        <span className="Total_amnt">
                          <span className="Value">
                            {formatPrice(Math.round(calculatorData?.expectedResult))}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="riskGraph">
                      <h5>Risk Meter</h5>
                      <div className="risk_Meter ">
                        {productDetail?.length && (
                          <h5>{productDetail[0]["Overview"]["scheme_risk_value"]}</h5>
                        )}
                        <div>
                          {/* <p>{riskArray.filter((v)=> v.type === productDetail[0]['Overview']['risk'])[0]['value']}</p> */}
                          {/* {productDetail?.length && (
                            <RiskMeter
                              key={"riskmeter"}
                              value={
                                riskArray.filter(
                                  (v) =>
                                    v.type ===
                                    productDetail[0]["Overview"]["risk"]
                                )[0]["value"]
                              }
                            />
                          )} */}
                          {productDetail?.length > 0 && (
                            <RiskMeter
                              key="riskmeter"
                              value={
                                (
                                  riskArray.find(
                                    (v) => v.type === productDetail?.[0]?.Overview?.scheme_risk_value
                                  )?.value ?? 0
                                )
                              }
                            />
                          )}

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ))}
          </Row>
        </Container>

        <Modal
          className="white-modal frm-buy-mobile"
          show={showBuyModal}
          onHide={() => setShowBuyModal(false)}
        >
          <Modal.Header closeButton className="py-3">
            <div className="modal-title">{mobilePurchase.toUpperCase()}</div>
          </Modal.Header>
          <Modal.Body>
            <p>&nbsp;</p>
            <h3>
              {productDetail?.length > 0
                ? productDetail[0]["Overview"]["scheme_name"]
                : ""}
            </h3>
            <TabData
              type={mobilePurchase}
              fundData={productDetail[0]}
              onAmountChange={(v) => onAmountChange(v)}
            />
          </Modal.Body>
        </Modal>

        <div className="mobile-purchase-btns d-flex d-md-none">
          <div>
            <button
              onClick={() => {
                setMobilePurchase("sip");
                setShowBuyModal(true);
              }}
            >
              SIP
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                setMobilePurchase("lumpsum");
                setShowBuyModal(true);
              }}
            >
              Lumpsum
            </button>
          </div>
        </div>
      </div>
    </GuestLayout>
  );
};

export default MutualFund;
