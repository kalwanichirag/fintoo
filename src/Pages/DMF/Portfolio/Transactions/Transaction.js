import { useState, useEffect, useRef } from "react";
import PortfolioLayout from "../../../../components/Layout/Portfolio";
import Table from "react-bootstrap/Table";

import moment from "moment";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import { useLocation } from "react-router-dom";
import {
  DATA_BELONGS_TO,
  DMF_GET_UPCOMING_TRANSACTION_API_URL,
} from "../../../../constants";
import { Link } from "react-router-dom";
import {
  getUserId,
  getItemLocal,
  fetchEncryptData,
  indianRupeeFormat,
} from "../../../../common_utilities";
import FintooButton from "../../../../components/HTML/FintooButton";
import FintooLoader from "../../../../components/FintooLoader";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import style from "../style.module.css";
import FintooCheckbox from "../../../../components/FintooCheckbox/FintooCheckbox";
import ExploreStock from "../../../../components/HTML/ExploreStock";
import SlidingPanel from "react-sliding-side-panel";
import CloseFilter from "../../../../Assets/Images/close.png";
import { HiSortAscending } from "react-icons/hi";
import FintooInlineLoader from "../../../../components/FintooInlineLoader";
import Cookies from "js-cookie";
import { getTransactionsHistory } from "../../../../FrappeIntegration-Services/services/investment-api/investmentService";

// Define missing constants
const ADVISORY_SMALLCASE_STOCKS_TRANSACTION =
  process.env.REACT_APP_FRAPPE_API_URL + "smallcase_stocks_transaction";
const ADVISORY_GET_STOCKS_HOLDINGS =
  process.env.REACT_APP_FRAPPE_API_URL + "get_stocks_holdings";
const DMF_COMPLETEDTRANSACTIONS_API_URL =
  process.env.REACT_APP_FRAPPE_API_URL + "get_completed_transactions";

const PortfolioTransaction = (props) => {
  const [productTypeTab, setProductTypeTab] = useState("mf");
  const [tabSelection, setTabSelection] = useState("orderHistory");
  const [innerSelection, setInnerSelection] = useState("inprocess");
  const [openCalendar, setOpenCalendar] = useState(false);
  const [selectedDates, setSelecteDates] = useState([]);
  const [upcomingTransaction, setUpcomingTransaction] = useState([]);
  const [completedTransaction, setCompletedTransaction] = useState([]);
  const [diffDays, setDiffDays] = useState("");
  const [error, setError] = useState(false);
  const refCalendarBox = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openPanel, setOpenPanel] = useState(false);
  const [sidePanelWidth, setSidePanelWidth] = useState(30);
  const [mfTransactions, setMfTransactions] = useState([]);
  const [completedStockTxnData, setCompletedStockTxnData] = useState([]);
  const [pendingStockTxnData, setPendingStockTxnData] = useState([]);
  const [pendingStockOrders, setPendingStockOrders] = useState([]);

  const contentRef = useRef();
  const [inlineLoader, setInlineLoader] = useState(false);
  const unBlockScrollListen = useRef(true);
  const location = useLocation();
  const token = Cookies.get("token");
  const user_id = getUserId();

  const [filterState, setFilterState] = useState({
    orderType: [],
    orderStatus: [],
  });

  const formatRupee = (value) => {
    if (value == null || isNaN(value)) return "-";
    const rounded = Number(value).toFixed(2);
    return `₹${Number(rounded).toLocaleString("en-IN")}`;
  };

  const [options, setOptions] = useState({ currentPage: 1 });

  const handleOrderTypeChange = (v) => {
    let order_type = filterState.orderType;
    if (order_type.findIndex((x) => x == v) > -1) {
      order_type.splice(
        order_type.findIndex((x) => x == v),
        1
      );
    } else {
      order_type.push(v);
    }
    setFilterState({ ...filterState, orderType: order_type });
  };

  const handleOrderStatusChange = (v) => {
    let order_status = filterState.orderStatus;
    if (order_status.findIndex((x) => x == v) > -1) {
      order_status.splice(
        order_status.findIndex((x) => x == v),
        1
      );
    } else {
      order_status.push(v);
    }
    setFilterState({ ...filterState, orderStatus: order_status });
  };

  let userid = getUserId();

  function handleResize() {
    if (window.innerWidth < 768) {
      setSidePanelWidth(100);
    } else {
      setSidePanelWidth(20);
    }
  }

  const familyArray = (typeOfArray) => {
    let new_array = [];
    var new_data = getItemLocal("member");
    switch (typeOfArray) {
      case "pan":
        new_data.forEach((element) => {
          if (element.pan !== null) {
            new_array.push(element.pan);
          }
        });
        break;
      case "user_id":
        new_data.forEach((element) => {
          if (element.id !== null) {
            new_array.push(element.id.toString());
          }
        });
        break;
    }
    return new_array;
  };

  const getMfTransactions = async () => {
    try {
      let page = options.currentPage;
      const loaderFunction = page == 1 ? setIsLoading : setInlineLoader;
      loaderFunction(true);

      let fromDate = "";
      let toDate = "";
      // Use dateRange from options if available, otherwise use selectedDates
      const datesArray = options.dateRange || selectedDates;
      if (!datesArray || datesArray.length == 0) {
        fromDate = moment().subtract(30, "days").format("YYYY-MM-DD");
        toDate = moment().format("YYYY-MM-DD");
      } else {
        fromDate = moment(datesArray[0]).format("YYYY-MM-DD");
        toDate = moment(datesArray[1]).format("YYYY-MM-DD");
      }

      // Calculate diff days for display messages
      setDiffDays(moment(toDate).diff(moment(fromDate), "days") + "");

      let new_array = [];
      if (getItemLocal("family")) {
        new_array = familyArray("user_id");
      }

      let payload = {
        user_id: getItemLocal("family") ? new_array : getUserId(),
        from_date: fromDate,
        to_date: toDate,
        page: page.toString(),
        data_belongs_to: DATA_BELONGS_TO,
      };

      if (options?.orderStatus ?? [].length > 0) {
        payload.order_status_array = options.orderStatus;
      }
      if (options?.orderType ?? [].length > 0) {
        payload.order_type_array = options.orderType;
      }

      var results = await getTransactionsHistory(payload);
      loaderFunction(false);

      if (results?.status_code == 200 && Array.isArray(results?.data)) {
        if (Boolean(options.reset)) {
          setMfTransactions(results.data);
        } else {
          setMfTransactions((prev) => [...prev, ...results.data]);
        }
        unBlockScrollListen.current = true;
      } else if (Boolean(options.reset)) {
        setMfTransactions([]);
      }
    } catch (e) {
      console.error("Error while fetching mf transactions: ", e);
      toastr.options = {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-bottom-left",
        timeOut: 5000,
      };
      toastr.error("Failed to fetch transactions. Please try again.");
      setMfTransactions([]);
    } finally {
      // Ensure loading state is always reset
      setIsLoading(false);
      setInlineLoader(false);
    }
  };

  useEffect(() => {
    getMfTransactions();
  }, [options]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    if (
      unBlockScrollListen.current &&
      contentRef.current.getBoundingClientRect().bottom <= window.innerHeight
    ) {
      unBlockScrollListen.current = false;
      setOptions((prev) => ({
        ...prev,
        currentPage: prev.currentPage + 1,
        reset: false,
      }));
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        refCalendarBox.current &&
        !refCalendarBox.current.contains(event.target)
      ) {
        setOpenCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onLoadInIt = async () => {
    if (innerSelection == "inprocess") {
      getInprocessTransactions();
    } else {
      setTabSelection("upcoming");
      setInnerSelection("sip");
    }

    let userid = getUserId();
    try {
      if (getItemLocal("family")) {
        var new_array = [];
        var new_data = getItemLocal("member");
        new_data.forEach((element) => {
          new_array.push(element.id);
        });
        var stringArray = new_array.map((item) => item.toString());
      }

      setIsLoading(true);
      var upcomingData = {
        transaction_user_id: getItemLocal("family") ? stringArray : userid,
      };

      var config = {
        method: "POST",
        url: DMF_GET_UPCOMING_TRANSACTION_API_URL,
        headers: {
          Authorization: `token ${token}`,
        },
        data: {
          data_belongs_to: DATA_BELONGS_TO,
          user_id: userid,
        },
      };

      var res = await fetchEncryptData(config);

      setUpcomingTransaction(res.data);
    } catch (e) {
      console.error("Error fetching upcoming transactions:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const getInprocessTransactions = async () => {
    if (getItemLocal("family")) {
      var new_array = [];
      var new_data = getItemLocal("member");
      new_data.forEach((element) => {
        new_array.push(element.id);
      });
      var stringArray = new_array.map((item) => item.toString());
    }
    setIsLoading(true);
    try {
      // Since the original implementation is commented out, we'll just reset the loading state
      // This prevents the loader from being stuck
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      setError(true);
    }
  };

  // useEffect(() => {
  //   getCompletedTransactions();
  // }, [selectedDates]);

  const getCompletedTransactions = async () => {
    try {
      if (getItemLocal("family")) {
        var new_array = [];
        var new_data = getItemLocal("member");
        new_data.forEach((element) => {
          new_array.push(element.id);
        });
        var stringArray = new_array.map((item) => item.toString());
      }
      setIsLoading(true);
      setCompletedTransaction(true);
      let fromDate = "";
      let toDate = "";
      if (selectedDates.length == 0) {
        fromDate = moment().subtract(30, "days").format("YYYY-MM-DD");
        toDate = moment().format("YYYY-MM-DD");
      } else {
        fromDate = moment(selectedDates[0]).format("YYYY-MM-DD");
        toDate = moment(selectedDates[1]).format("YYYY-MM-DD");
      }

      var completedData = {
        user_id: getItemLocal("family") ? stringArray : userid,
        from_date: fromDate,
        to_date: toDate,
        data_belongs_to: DATA_BELONGS_TO,
      };

      setDiffDays(moment(toDate).diff(moment(fromDate), "days") + "");

      var config = {
        method: "post",
        url: DMF_COMPLETEDTRANSACTIONS_API_URL,
        data: completedData,
      };
      var res = await fetchEncryptData(config);
      setCompletedTransaction(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStockHoldings = async () => {
    try {
      // Since the original implementation is commented out, we'll just set empty arrays
      // This prevents any loading state issues
      setCompletedStockTxnData([]);
      setPendingStockTxnData([]);
    } catch (error) {
      console.error("Error fetching stock holdings:", error);
      setCompletedStockTxnData([]);
      setPendingStockTxnData([]);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setPendingStockOrders([...pendingStockTxnData]);
    } else {
      setPendingStockOrders([]);
    }
  };

  const handleSelectRow = (row) => {
    setPendingStockOrders((prev) => {
      const exists = prev.some(
        (item) => item.stock_txn_id === row.stock_txn_id
      );
      if (exists) {
        return prev.filter((item) => item.stock_txn_id !== row.stock_txn_id);
      } else {
        return [...prev, row];
      }
    });
  };

  const isAllSelected =
    pendingStockTxnData.length > 0 &&
    pendingStockOrders.length === pendingStockTxnData.length &&
    pendingStockTxnData.every((txn) =>
      pendingStockOrders.some((sel) => sel.stock_txn_id === txn.stock_txn_id)
    );

  const handleBrokerTransaction = async (
    pendingStocks = [],
    disconnect = false
  ) => {
    if (pendingStocks.length == 0) {
      return;
    }
    const userID = getUserId();
    const stockTxnData = pendingStocks.map((stock) => ({
      stock_txn_id: stock.stock_txn_id,
      stock_symbol: stock.stock_symbol,
      txn_type: stock.txn_type,
      advised_quantity: stock.advised_quantity,
      txn_order_type: stock.txn_order_type,
    }));
    setIsLoading(true);
    try {
      const payload = {
        url: ADVISORY_SMALLCASE_STOCKS_TRANSACTION,
        method: "post",
        data: {
          user_id: userID,
          stock_txn_data: stockTxnData,
          get_txn_id: true,
        },
      };

      const response = await fetchEncryptData(payload);

      if (response.status_code === "200") {
        const txnId = response.holding_txn_id;
        const token = response.token;

        const gatewayInstance = new window.scDK({
          gateway: "fintoo",
          smallcaseAuthToken: token,
          config: { amo: true },
        });

        if (disconnect) {
          gatewayInstance.init({ smallcaseAuthToken: token });
          gatewayInstance.brokerLogout({}).catch(() => {
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error("Broker disconnection failed!");
          });
          return;
        }

        gatewayInstance
          .triggerTransaction({ transactionId: txnId })
          .then(async (transactionResp) => {
            const orders = transactionResp.orderBatches?.[0]?.orders || [];
            const broker = transactionResp.orderBatches?.[0]?.broker || "";

            const finalStockTxnData = orders.map((order) => ({
              stock_symbol: order.tradingsymbol,
              txn_type: order.transactionType,
              actual_quantity: order.quantity,
              txn_order_type: order.orderType,
              avg_price: String(order.averagePrice),
              exchange_name: order.exchange,
              txn_status: order.status,
              broker_name: broker,
              order_timestamp: order.orderTimestamp,
              price: String(order.price),
            }));

            const savePayload = {
              url: ADVISORY_SMALLCASE_STOCKS_TRANSACTION,
              method: "post",
              data: {
                user_id: userID,
                stock_txn_data: finalStockTxnData,
                get_txn_id: false,
                holding_txn_id: txnId,
              },
            };

            const saveResponse = await fetchEncryptData(savePayload);

            setIsLoading(false);
            toastr.options.positionClass = "toast-bottom-left";
            if (saveResponse.status_code === "200") {
              toastr.success("Order Placed Successfully");
              await fetchStockHoldings();
            } else {
              toastr.error("Something went wrong while saving data");
            }
          })
          .catch((err) => {
            console.error("Transaction failed:", err);
            setIsLoading(false);

            const errMessage = err["message"];
            toastr.options.positionClass = "toast-bottom-left";

            switch (errMessage) {
              case "market_closed":
                toastr.error(
                  "Markets are currently closed. Please try again during market hours."
                );
                break;

              case "user_cancelled":
                break;

              case "invalid_transactionId":
                toastr.error(
                  "Invalid transaction ID. Please try initiating the transaction again."
                );
                break;

              case "transaction_in_process":
                toastr.error(
                  "A transaction is already in progress. Please wait for it to complete."
                );
                break;

              case "invalid_gateway":
                toastr.error(
                  "Invalid payment gateway selected. Please check your gateway configuration."
                );
                break;

              case "invalid_jwt":
                toastr.error(
                  "Authentication failed. Please refresh and try again."
                );
                break;

              case "invalid_elementorselector":
                toastr.error(
                  "Internal error: UI component not found. Please refresh the page."
                );
                break;

              case "invalid_user_data":
                toastr.error(
                  "Invalid user data. Please log in again and retry."
                );
                break;

              case "user_mismatch":
                toastr.error(
                  "You're logged in with a different broker account. Please use the mapped broker account."
                );
                break;

              case "transaction_expired":
                toastr.error(
                  "Transaction expired. Please start the transaction again."
                );
                break;

              case "no_compatible_browser":
                toastr.error(
                  "No compatible browser found. Please use a supported browser to continue."
                );
                break;

              case "trading_not_enabled":
                toastr.error(
                  "Your trading account is not enabled for NSE transactions."
                );
                break;

              case "internal_error":
                toastr.error(
                  "Something went wrong on our end. Please try again later."
                );
                break;

              case "init_sdk":
                toastr.error(
                  "Transaction failed to start. Please wait for SDK initialization."
                );
                break;

              case "no_order":
                toastr.error(
                  "Your smallcase is already up-to-date. No action was needed."
                );
                break;

              case "smallcase_archived":
                toastr.error(
                  "This smallcase has been archived and cannot be transacted."
                );
                break;

              case "already_subscribed":
                toastr.error("You are already subscribed to this smallcase.");
                break;

              case "order_pending":
                toastr.error(
                  "A previous order is still pending. Please wait before placing another."
                );
                break;

              case "consent_denied":
                toastr.error(
                  "You denied consent for holdings import. Please allow consent to proceed."
                );
                break;

              case "webhook_unreachable":
                toastr.error(
                  "We couldn’t fetch your broker holdings. Please try again later."
                );
                break;

              case "intent_not_enabled_for_broker":
                toastr.error(
                  "Your broker doesn’t support this feature at the moment."
                );
                break;

              default:
                toastr.error("Transaction failed. Please try again.");
                break;
            }
          });
      }
    } catch (error) {
      console.error("Error during broker transaction:", error);
      setIsLoading(false);
    }
  };

  const placeSelectedOrders = () => {
    handleBrokerTransaction(pendingStockOrders);
  };

  useEffect(() => {
    if (productTypeTab == "stock") {
      fetchStockHoldings();
    }
  }, [productTypeTab]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const stocksParam = params.get("stocks");

    if (stocksParam === "True") {
      setProductTypeTab("stock");
      setTabSelection("pendingStockHoldings");
    }
  }, [location.search]);

  const purchaseTypeMap = {
    "TST-1": "Lumpsum",
    "TST-2": "Systematic Investment Plan",
    "TST-3": "Additional Purchase",
    "TST-4": "Redemption",
    "TST-5": "Switch In",
    "TST-6": "Switch Out",
    "TST-7": "Systematic Withdrawal Plan",
    "TST-8": "Systematic Transfer In",
    "TST-9": "Systematic Transfer Out",
  };

  return (
    <PortfolioLayout>
      <p style={{ height: "1rem" }}></p>
      <FintooLoader isLoading={isLoading} />
      {/* <p style={{ height: "2rem" }}></p> */}
      <div className="row">
        <div className="col-12">
          <div className="insideTabContent" style={{ borderRadius: "16px" }}>
            {productTypeTab === "mf" && (
              <>
                <div className="insideTabBox" style={{ borderRadius: "-1px" }}>
                  <div className="insideTab">
                    <div
                      onClick={() => {
                        setTabSelection("orderHistory");
                        setInnerSelection("inprocess");
                        getInprocessTransactions();
                      }}
                      className={`pointer ${
                        tabSelection === "orderHistory" ? "active" : ""
                      }`}
                    >
                      <p>
                        <strong>Orders</strong>
                      </p>
                    </div>
                    <div
                      onClick={() => {
                        setTabSelection("upcoming");
                        setInnerSelection("sip");
                        onLoadInIt();
                      }}
                      className={`pointer ${
                        tabSelection === "upcoming" ? "active" : ""
                      }`}
                    >
                      <p>
                        <strong>Upcoming</strong>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="ptTableBx p-2 p-md-4" ref={contentRef}>
                  {tabSelection == "orderHistory" && (
                    <div
                      className={style.fltTrx}
                      style={{ justifyContent: "end" }}
                    >
                      <div className="position-relative d-flex align-items-center pointe pt-4 pt-md-0">
                        <div
                          className="resultOptionsBtn position-relative hover-dropdown pointer"
                          onClick={() => setOpenPanel((prev) => !prev)}
                        >
                          <HiSortAscending fontSize={"1.2rem"} />
                          <span>Filter</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {tabSelection == "upcoming" && (
                    <div className=" d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center opt-flt-trnx">
                        <div
                          className={`pe-5 grey-500 ${
                            innerSelection == "sip" ? "active" : ""
                          }`}
                        >
                          <span
                            className="pointer p-2"
                            onClick={() => setInnerSelection("sip")}
                          >
                            SIP
                          </span>
                        </div>
                        <div
                          className={`pe-5 grey-500 ${
                            innerSelection == "stp" ? "active" : ""
                          }`}
                        >
                          <span
                            className="pointer p-2"
                            onClick={() => setInnerSelection("stp")}
                          >
                            STP
                          </span>
                        </div>
                        <div
                          className={` grey-500 ${
                            innerSelection == "swp" ? "active" : ""
                          }`}
                        >
                          <span
                            className="pointer p-2"
                            onClick={() => setInnerSelection("swp")}
                          >
                            SWP
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {tabSelection == "orderHistory" &&
                    innerSelection == "inprocess" && (
                      <>
                        {mfTransactions.length > 0 ? (
                          <Table responsive className="ptTable mt-4">
                            <thead className="">
                              <tr>
                                <th scope="col" className="ps-0 pt-4">
                                  Fund Name
                                </th>
                                {/* <th scope="col">Order Date & Time</th> */}
                                <th scope="col">Order Date</th>
                                <th scope="col">Amount</th>
                                <th scope="col">Order Type</th>
                                <th scope="col">Payment Status</th>
                                <th scope="col">Order Status</th>
                                <th>Order Summary</th>
                              </tr>
                            </thead>
                            <tbody>
                              {mfTransactions.length > 0 &&
                                mfTransactions.map((val) => (
                                  <tr key={val.user_transaction_id}>
                                    <td
                                      scope="row"
                                      data-label="Funds"
                                      className="fundNameTd ps-0 pt-4"
                                    >
                                      <div className="fundName9">
                                        <div>
                                          <img
                                            src={`${process.env.REACT_APP_STATIC_URL}/media/companyicons/${val.amc_code}.png`}
                                            onError={(e) => {
                                              e.target.src = `${process.env.PUBLIC_URL}/static/media/companyicons/amc_icon.png`;
                                              e.onError = null;
                                            }}
                                          />
                                        </div>
                                        <div className="fundNameCon">
                                          <div className="ProcessFundName">
                                            <strong>{val.s_name}</strong>
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td scope="row" data-label="Order Date">
                                      <strong>
                                        {moment(
                                          val.user_transaction_date
                                        ).format("DD-MM-YYYY")}
                                      </strong>

                                      {/* <div
                                    style={{
                                      color: "#8d8d8d",
                                    }}
                                  >
                                    {moment(val.user_transaction_date).format(
                                      "HH:mm:ss"
                                    )}
                                  </div> */}
                                    </td>
                                    <td scope="row" data-label="Amount">
                                      <strong>
                                        {val.cart_amount > 0
                                          ? indianRupeeFormat(
                                              val.cart_amount * 1
                                            )
                                          : "-"}
                                      </strong>
                                    </td>

                                    <td scope="row" data-label="Purchase Type">
                                      <strong>
                                        {purchaseTypeMap[
                                          val.user_transaction_type
                                        ] || val.user_transaction_type}
                                      </strong>
                                    </td>

                                    <td scope="row" data-label="Payment Status">
                                      <div>
                                        <strong>
                                          {val.payment_status || "-"}
                                        </strong>
                                      </div>
                                    </td>
                                    <td scope="row" data-label="Order Status">
                                      <div>
                                        <strong>
                                          {val.order_status || "-"}
                                        </strong>
                                      </div>
                                    </td>

                                    <td scope="row">
                                      <div style={{ paddingLeft: "3rem" }}>
                                        <Link
                                          to={`${process.env.PUBLIC_URL}/direct-mutual-fund/portfolio/dashboard/transactionInfo/${val.user_transaction_id}`}
                                        >
                                          <div className="pointer">
                                            <ExploreStock />
                                          </div>
                                        </Link>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </Table>
                        ) : (
                          <></>
                        )}
                        {!isLoading && mfTransactions.length == 0 && (
                          <>
                            <div className="text-center ps-0">
                              <div className="pt-2">
                                {diffDays == "30" ? (
                                  <h2>
                                    No transaction in the last {diffDays} days.
                                  </h2>
                                ) : (
                                  <h2>
                                    No transaction in the selected date range.
                                  </h2>
                                )}
                              </div>
                              <img
                                style={{ width: "400px" }}
                                src={
                                  process.env.REACT_APP_STATIC_URL +
                                  "/media/DMF/investment.svg"
                                }
                              />
                              <div className="fin-p-txt pt-3 pb-3">
                                <p>
                                  You can now manage your Mutual Funds on Fintoo
                                  Dashboard
                                </p>
                              </div>
                              <div className="btn-add-fnds">
                                <Link
                                  to={`${process.env.PUBLIC_URL}/direct-mutual-fund/funds/all`}
                                >
                                  <FintooButton title="Add Funds" />
                                </Link>
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    )}

                  {tabSelection == "orderHistory" &&
                    innerSelection == "completed" && (
                      <>
                        <div>
                          {completedTransaction.length > 0 ? (
                            <Table responsive className="ptTable mt-4">
                              <thead>
                                <tr>
                                  <th scope="col" className="ps-0 pt-4">
                                    Funds
                                  </th>
                                  <th scope="col">NAV Date</th>
                                  <th scope="col">Amount</th>
                                  <th scope="col">NAV</th>
                                  <th scope="col">Transaction Type</th>
                                  <th scope="col">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {completedTransaction.map((item) => (
                                  <tr key={item}>
                                    <td
                                      scope="row"
                                      data-label="Funds"
                                      className="fundNameTd ps-0 pt-4"
                                    >
                                      <div className="fundName9">
                                        <div>
                                          <img
                                            src={`${process.env.REACT_APP_STATIC_URL}/media/companyicons/${item.amc_code}.png`}
                                            onError={(e) => {
                                              e.target.src = `${process.env.PUBLIC_URL}/static/media/companyicons/amc_icon.png`;
                                              e.onError = null;
                                            }}
                                          />
                                        </div>
                                        <div className="fundNameCon">
                                          <div className="CompletedFundName">
                                            <strong>{item.s_name}</strong>
                                          </div>
                                          <div className="CompletedFolioNo">
                                            Folio No.:{" "}
                                            {item.transaction_folio_no ==
                                            "new_folio"
                                              ? "New Folio"
                                              : item.transaction_folio_no}
                                            &nbsp;&nbsp;
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td scope="row" data-label="NAV Date">
                                      <strong>
                                        {moment(item.transaction_date).format(
                                          "DD-MM-YYYY"
                                        )}
                                      </strong>
                                    </td>
                                    <td scope="row" data-label="Amount">
                                      <strong>
                                        {item.amount != "-"
                                          ? indianRupeeFormat(item.amount)
                                          : "-"}
                                      </strong>
                                    </td>
                                    <td scope="row" data-label="NAV">
                                      <strong>
                                        {Math.round(
                                          (parseFloat(item.nav) +
                                            Number.EPSILON) *
                                            1000
                                        ) / 1000}
                                      </strong>
                                    </td>
                                    <td
                                      scope="row"
                                      data-label="Transaction Type"
                                    >
                                      <strong>{item.transaction_type}</strong>
                                    </td>
                                    <td scope="row" data-label="Status">
                                      <strong
                                        style={{ textTransform: "uppercase" }}
                                      >
                                        {item.bse_status == "PASS" ||
                                        item.payment_status == "1"
                                          ? "Success"
                                          : "Failed"}
                                      </strong>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          ) : null}

                          {!isLoading && completedTransaction.length == 0 && (
                            <>
                              <div className="text-center ps-0">
                                <div className="pt-2">
                                  {diffDays == "30" ? (
                                    <h2>
                                      No transaction in the last {diffDays}{" "}
                                      days.
                                    </h2>
                                  ) : (
                                    <h2>
                                      No transaction in the selected date range.
                                    </h2>
                                  )}
                                </div>
                                <img
                                  style={{ width: "400px" }}
                                  src={
                                    process.env.REACT_APP_STATIC_URL +
                                    "media/DMF/investment.svg"
                                  }
                                />
                                <div className="fin-p-txt pt-3 pb-3">
                                  <p>
                                    You can now manage your Mutual Funds on
                                    Fintoo Dashboard
                                  </p>
                                </div>
                                <div className="btn-add-fnds">
                                  <Link
                                    to={`${process.env.PUBLIC_URL}/direct-mutual-fund/funds/all`}
                                  >
                                    <FintooButton title="Add Funds" />
                                  </Link>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    )}

                  {tabSelection == "upcoming" && innerSelection == "sip" && (
                    <>
                      {upcomingTransaction.length > 0 && !isLoading ? (
                        <>
                          <div
                            className={` d-flex justify-content-between grey-500 mt-4 ${style.subTiles}`}
                          >
                            <div
                              className={`d-flex fn-tp-text-9 ps-0 pt-4 pb-3 }`}
                            >
                              <div className="pe-4 fn-right-border">
                                Monthly payable: Total SIP{" "}
                                <span className="TotalSIP">
                                  {upcomingTransaction.length}
                                </span>{" "}
                              </div>
                              <div className="ps-4">
                                Total Amount:{" "}
                                <span className="TotalSIPAmount">
                                  {indianRupeeFormat(
                                    upcomingTransaction.reduce(
                                      (acc, curr) => acc + curr.cart_amount,
                                      0
                                    )
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className="pt-4">
                              Upcoming SIPs in next 30 Days
                            </div>
                          </div>

                          <Table responsive className="ptTable mt-4">
                            <thead>
                              <tr>
                                <th cope="col" className="ps-0 pt-4">
                                  Funds
                                </th>
                                <th cope="col " className="fundDateYear">
                                  SIP Date
                                </th>
                                <th cope="col " className="pFundAmount">
                                  Amount
                                </th>
                                <th cope="col">Bank</th>
                                <th className="pFundOptions"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {upcomingTransaction.map((val) => (
                                <tr>
                                  <td
                                    scope="row"
                                    data-label="Funds"
                                    className="fundNameTd ps-0 pt-4 "
                                  >
                                    <div className="fundName9">
                                      <div>
                                        <img
                                          src={`${process.env.REACT_APP_STATIC_URL}/media/companyicons/${val.amc_code}.png`}
                                          onError={(e) => {
                                            e.target.src = `${process.env.PUBLIC_URL}/static/media/companyicons/amc_icon.png`;
                                            e.onError = null;
                                          }}
                                        />
                                      </div>
                                      <div className="fundNameCon">
                                        <div>
                                          <strong>{val.scheme_name}</strong>
                                        </div>
                                        <div>
                                          Folio No.:{" "}
                                          {val.transaction_folio_no ==
                                          "new_folio"
                                            ? "New Folio"
                                            : val.transaction_folio_no}
                                          &nbsp;&nbsp;
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td
                                    scope="row"
                                    data-label="SIP Date"
                                    className=" "
                                  >
                                    <strong>
                                      {moment(
                                        val.upcoming_transaction_date
                                      ).format("DD-MM-YYYY")}
                                    </strong>
                                  </td>
                                  <td
                                    scope="row"
                                    data-label="Amount "
                                    className=""
                                  >
                                    <strong>
                                      {indianRupeeFormat(val.cart_amount)}
                                    </strong>
                                  </td>
                                  <td
                                    scope="row"
                                    data-label="Bank"
                                    className=""
                                  >
                                    <strong>{val.bank_name}</strong>
                                    <div>
                                      {val.bank_acc_no ? (
                                        <>
                                          XXXX
                                          {val.bank_acc_no.substr(
                                            val.bank_acc_no.length - 4
                                          )}
                                        </>
                                      ) : (
                                        "-"
                                      )}
                                    </div>
                                  </td>
                                  <td scope="row" data-label="" className="">
                                    <div className="d-flex justify-content-end fintoo-small-btn-bx fnOptions7">
                                      <div className="fintoo-small-btn pointer">
                                        <span>
                                          <a
                                            href={`${process.env.PUBLIC_URL}/direct-mutual-fund/MutualFund/${val.scheme_code}`}
                                          >
                                            Invest More{" "}
                                          </a>
                                        </span>
                                      </div>
                                      {/* <div
                                    className="fintoo-small-btn pointer"
                                    onClick={() => detailsPage(val)}
                                  >
                                    <span>Transaction</span>
                                  </div> */}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </>
                      ) : (
                        !isLoading && (
                          <>
                            <>
                              <div className="text-center">
                                <div className="pb-3">
                                  <h2>No Upcoming Transactions.</h2>
                                </div>
                                <img
                                  style={{ width: "400px" }}
                                  src={
                                    process.env.REACT_APP_STATIC_URL +
                                    "/media/DMF/investment.svg"
                                  }
                                />
                                <div className="fin-p-txt pt-3 pb-3">
                                  <p>
                                    You can now manage your Mutual Funds on
                                    Fintoo Dashboard
                                  </p>
                                </div>
                                <div className="btn-add-fnds">
                                  <Link
                                    to={`${process.env.PUBLIC_URL}/direct-mutual-fund/funds/all`}
                                  >
                                    <FintooButton title="Add Funds" />
                                  </Link>
                                </div>
                              </div>
                            </>{" "}
                          </>
                        )
                      )}
                    </>
                  )}

                  {tabSelection == "upcoming" && innerSelection == "stp" && (
                    <>
                      {upcomingTransaction.length > 0 ? (
                        <>
                          <div className=" d-flex justify-content-between grey-500 mt-4">
                            <div className="d-flex fn-tp-text-9 ps-0 pt-4 pb-3">
                              <div className="pe-4 fn-right-border">
                                Monthly payable: Total STP{" "}
                                <span className="TotalSIP">
                                  {upcomingTransaction.length}
                                </span>
                              </div>
                              <div className="ps-4">
                                Total Amount:{" "}
                                <span className="TotalSIPAmount">
                                  {indianRupeeFormat(
                                    upcomingTransaction.reduce(
                                      (acc, curr) => acc + curr.cart_amount,
                                      0
                                    )
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className="pt-4">
                              Upcoming STPs in next 30 Days
                            </div>
                          </div>
                          <Table responsive className="ptTable mt-4">
                            <thead>
                              <tr>
                                <th scope="col" className="ps-0 pt-4">
                                  Funds
                                </th>
                                <th scope="col" className="fundDateYear">
                                  STP Date
                                </th>
                                <th scope="col pFundAmount">Amount</th>
                                <th scope="col">Transfer to</th>
                              </tr>
                            </thead>
                            <tbody>
                              {upcomingTransaction.map((val) => (
                                <tr>
                                  <td
                                    scope="row"
                                    data-label="Funds"
                                    className="fundNameTd ps-0 pt-4"
                                  >
                                    <div className="fundName9">
                                      <div>
                                        <img
                                          src={
                                            process.env.REACT_APP_STATIC_URL +
                                            "/media/DMF/01_icici.png"
                                          }
                                        />
                                      </div>
                                      <div className="fundNameCon">
                                        <div>
                                          <strong>{val.scheme_name}</strong>
                                        </div>
                                        <div>
                                          Folio No.:{" "}
                                          {val.transaction_folio_no ==
                                          "new_folio"
                                            ? "New Folio"
                                            : val.transaction_folio_no}
                                          &nbsp;&nbsp;
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td scope="row" data-label="STP Date">
                                    <strong>
                                      {moment(
                                        val.upcoming_transaction_date
                                      ).format("DD-MM-YYYY")}
                                    </strong>
                                  </td>
                                  <td scope="row" data-label="Amount">
                                    <strong>
                                      {indianRupeeFormat(val.cart_amount)}
                                    </strong>
                                  </td>
                                  <td scope="row" data-label="Transfer to">
                                    <div>
                                      <strong>{val.transfer_to_scheme}</strong>
                                    </div>
                                    <div>
                                      Folio No.: {val.transfer_folio_no}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </>
                      ) : (
                        <>
                          <div className="text-center">
                            <div className="pb-3">
                              <h2>No Upcoming Transactions.</h2>
                            </div>
                            <img
                              style={{ width: "400px" }}
                              src={
                                process.env.REACT_APP_STATIC_URL +
                                "/media/DMF/investment.svg"
                              }
                            />
                            <div className="fin-p-txt pt-3 pb-3">
                              <p>
                                You can now manage your Mutual Funds on Fintoo
                                Dashboard
                              </p>
                            </div>
                            <div className="btn-add-fnds">
                              <Link
                                to={`${process.env.PUBLIC_URL}/direct-mutual-fund/funds/all`}
                              >
                                <FintooButton title="Add Funds" />
                              </Link>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}

                  {tabSelection == "upcoming" && innerSelection == "swp" && (
                    <>
                      {upcomingTransaction.length > 0 ? (
                        <>
                          <div
                            className={`d-flex justify-content-between grey-500 mt-4 ${style.subTiles}`}
                          >
                            <div className="d-flex fn-tp-text-9 ps-0 pt-4 pb-3">
                              <div className="pe-4 fn-right-border">
                                Total SWP{" "}
                                <span className="TotalSIP">
                                  {upcomingTransaction.length}
                                </span>
                              </div>
                              <div className="ps-4">
                                Total Amount:{" "}
                                <span className="TotalSIPAmount">
                                  {indianRupeeFormat(
                                    upcomingTransaction.reduce(
                                      (acc, curr) => acc + curr.cart_amount,
                                      0
                                    )
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className="pt-4">
                              Upcoming SWPs in next 30 Days
                            </div>
                          </div>
                          <Table responsive className="ptTable mt-4">
                            <thead>
                              <tr>
                                <th scope="col" className="ps-0 pt-4">
                                  Funds
                                </th>
                                <th scope="col" className="fundDateYear">
                                  SWP Date
                                </th>
                                <th scope="col" className="pFundAmount">
                                  Amount
                                </th>
                                <th scope="col">Bank</th>
                              </tr>
                            </thead>
                            <tbody>
                              {upcomingTransaction.map((val) => (
                                <tr>
                                  <td
                                    scope="row"
                                    data-label="Funds"
                                    className="fundNameTd ps-0"
                                  >
                                    <div className="fundName9">
                                      <div>
                                        <img
                                          src={
                                            process.env.REACT_APP_STATIC_URL +
                                            "/media/DMF/01_icici.png"
                                          }
                                        />
                                      </div>
                                      <div className="fundNameCon">
                                        <div>
                                          <strong>{val.scheme_name}</strong>
                                        </div>
                                        <div>
                                          Folio No.:{" "}
                                          {val.transaction_folio_no ==
                                          "new_folio"
                                            ? "New Folio"
                                            : val.transaction_folio_no}
                                          &nbsp;&nbsp;
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td scope="row" data-label="SWP Date">
                                    <strong>
                                      {moment(
                                        val.upcoming_transaction_date
                                      ).format("DD-MM-YYYY")}
                                    </strong>
                                  </td>
                                  <td scope="row" data-label="Amount">
                                    <strong>
                                      {indianRupeeFormat(val.cart_amount)}
                                    </strong>
                                  </td>
                                  <td scope="row" data-label="Bank">
                                    <div>
                                      <strong>{val.bank_name} &nbsp;</strong>
                                      <div>
                                        {val.bank_acc_no ? (
                                          <>
                                            XXXX
                                            {val.bank_acc_no.substr(
                                              val.bank_acc_no.length - 4
                                            )}
                                          </>
                                        ) : (
                                          "-"
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </>
                      ) : (
                        <>
                          <div className="text-center">
                            <div className="pb-3">
                              <h2>No Upcoming Transactions.</h2>
                            </div>
                            <img
                              style={{ width: "400px" }}
                              src={
                                process.env.REACT_APP_STATIC_URL +
                                "/media/DMF/investment.svg"
                              }
                            />
                            <div className="fin-p-txt pt-3 pb-3">
                              <p>
                                You can now manage your Mutual Funds on Fintoo
                                Dashboard
                              </p>
                            </div>
                            <div className="btn-add-fnds">
                              <Link
                                to={`${process.env.PUBLIC_URL}/direct-mutual-fund/funds/all`}
                              >
                                <FintooButton title="Add Funds" />
                              </Link>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                  <FintooInlineLoader isLoading={inlineLoader} />
                </div>
              </>
            )}
            {productTypeTab === "stock" && (
              <>
                <div className="insideTabBox" style={{ borderRadius: "0" }}>
                  <div className="insideTab">
                    <div
                      onClick={() => {
                        setTabSelection("completedStockHoldings");
                      }}
                      className={`pointer ${
                        tabSelection === "completedStockHoldings"
                          ? "active"
                          : ""
                      }`}
                    >
                      <p>
                        <strong>Orders</strong>
                      </p>
                    </div>
                    <div
                      onClick={() => {
                        setTabSelection("pendingStockHoldings");
                      }}
                      className={`pointer ${
                        tabSelection === "pendingStockHoldings" ? "active" : ""
                      }`}
                    >
                      <p>
                        <strong>Actionable</strong>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="ptTableBx p-2 p-md-4" ref={contentRef}>
                  {tabSelection == "completedStockHoldings" && (
                    <>
                      {completedStockTxnData.length > 0 ? (
                        <Table responsive className="ptTable mt-4">
                          <thead className="">
                            <tr>
                              <th
                                scope="col"
                                className="ps-0 pt-4"
                                style={{ width: "15%" }}
                              >
                                Stock Name
                              </th>
                              <th scope="col" className="text-center">
                                Quantity
                              </th>
                              <th scope="col" className="text-center">
                                Transaction Type
                              </th>
                              <th scope="col" className="text-center">
                                Price
                              </th>
                              <th scope="col" className="text-center">
                                Broker
                              </th>
                              <th scope="col" className="text-center">
                                Order Placed On
                              </th>
                              <th scope="col" className="text-center">
                                Order Status
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {completedStockTxnData.length > 0 &&
                              [...completedStockTxnData]
                                .sort(
                                  (a, b) =>
                                    new Date(b.holding_created_at) -
                                    new Date(a.holding_created_at)
                                )
                                .map((val) => (
                                  <tr key={val.stock_txn_id}>
                                    <td
                                      scope="row"
                                      data-label="Funds"
                                      className="fundNameTd ps-0 pt-4"
                                    >
                                      <div className="fundName9">
                                        <div className="ProcessFundName">
                                          <strong>
                                            {val.stock_full_name ??
                                              val.stock_symbol}
                                          </strong>
                                        </div>
                                      </div>
                                    </td>
                                    <td scope="row" className="text-center">
                                      <strong>
                                        {val.actual_quantity ?? "-"}
                                      </strong>
                                    </td>
                                    <td scope="row" className="text-center">
                                      <strong
                                        className={`${style.transactionType} ${
                                          val.txn_type.toLowerCase() == "buy"
                                            ? style.transactionType_green
                                            : val.txn_type.toLowerCase() ==
                                              "sell"
                                            ? style.transactionType_red
                                            : ""
                                        }`}
                                      >
                                        {val.txn_type}
                                      </strong>
                                    </td>
                                    <td scope="row" className="text-center">
                                      <strong>
                                        {formatRupee(val.avg_price) ?? "-"}
                                      </strong>
                                    </td>
                                    <td scope="row" className="text-center">
                                      <strong>{val.broker_name ?? "-"}</strong>
                                    </td>
                                    <td scope="row" className="text-center">
                                      <strong>
                                        {val.holding_txn_date
                                          ? moment(val.holding_txn_date).format(
                                              "MMM DD, YYYY hh:mm A"
                                            )
                                          : "-"}
                                      </strong>
                                    </td>
                                    <td scope="row" className="text-center">
                                      <div>
                                        <strong>{val.txn_status}</strong>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                          </tbody>
                        </Table>
                      ) : (
                        <></>
                      )}
                      {!isLoading && completedStockTxnData.length == 0 && (
                        <>
                          <div className="text-center ps-0">
                            <div className="pt-2">
                              {diffDays == "30" ? (
                                <h2>No order placed.</h2>
                              ) : (
                                <h2>No order placed.</h2>
                              )}
                            </div>
                            <img
                              style={{ width: "400px" }}
                              src={
                                process.env.REACT_APP_STATIC_URL +
                                "/media/DMF/investment.svg"
                              }
                            />
                          </div>
                        </>
                      )}
                    </>
                  )}

                  {tabSelection == "pendingStockHoldings" && (
                    <>
                      <div className="text-end mb-3">
                        {pendingStockOrders.length > 0 && (
                          <button
                            className="resultOptionsBtn"
                            onClick={() => placeSelectedOrders()}
                          >
                            Place Selected Orders
                          </button>
                        )}
                      </div>
                      {pendingStockTxnData.length > 0 ? (
                        <Table responsive className="ptTable mt-4">
                          <thead className="">
                            <tr>
                              <th scope="col" className="text-center">
                                <input
                                  type="checkbox"
                                  checked={isAllSelected}
                                  onChange={handleSelectAll}
                                />
                              </th>
                              <th scope="col">Stock</th>
                              <th scope="col" className="text-center">
                                Type
                              </th>
                              <th scope="col" className="text-center">
                                Quantity
                              </th>
                              <th scope="col" className="text-center">
                                Recommended On
                              </th>
                              <th scope="col" className="text-center">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {pendingStockTxnData.length > 0 &&
                              [...pendingStockTxnData]
                                .sort(
                                  (a, b) =>
                                    new Date(b.holding_created_at) -
                                    new Date(a.holding_created_at)
                                )
                                .map((val) => (
                                  <tr key={val.stock_txn_id}>
                                    <td scope="row" className="text-center">
                                      <input
                                        type="checkbox"
                                        checked={pendingStockOrders.some(
                                          (item) =>
                                            item.stock_txn_id ===
                                            val.stock_txn_id
                                        )}
                                        onChange={() => handleSelectRow(val)}
                                      />
                                    </td>
                                    <td
                                      scope="row"
                                      data-label="Funds"
                                      className="fundNameTd ps-0 pt-4"
                                    >
                                      <div className="fundName9">
                                        <div className="ProcessFundName">
                                          <strong>
                                            {val.stock_full_name ??
                                              val.stock_symbol}
                                          </strong>
                                        </div>
                                      </div>
                                    </td>
                                    <td scope="row" className="text-center">
                                      <strong
                                        className={`${style.transactionType} ${
                                          val.txn_type.toLowerCase() == "buy"
                                            ? style.transactionType_green
                                            : val.txn_type.toLowerCase() ==
                                              "sell"
                                            ? style.transactionType_red
                                            : ""
                                        }`}
                                      >
                                        {val.txn_type}
                                      </strong>
                                    </td>
                                    <td scope="row" className="text-center">
                                      <strong>
                                        {val.advised_quantity ?? "-"}
                                      </strong>
                                    </td>
                                    <td scope="row" className="text-center">
                                      <strong>
                                        {val.holding_created_at
                                          ? moment(
                                              val.holding_created_at
                                            ).format("MMM DD, YYYY hh:mm A")
                                          : "-"}
                                      </strong>
                                    </td>
                                    <td scope="row" className="text-center">
                                      <button
                                        className="resultOptionsBtn"
                                        onClick={() =>
                                          handleBrokerTransaction([val])
                                        }
                                      >
                                        Place Order
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                          </tbody>
                        </Table>
                      ) : (
                        <></>
                      )}
                      {!isLoading && pendingStockTxnData.length == 0 && (
                        <>
                          <div className="text-center ps-0">
                            <div className="pt-2">
                              {diffDays == "30" ? (
                                <h2>No order placed.</h2>
                              ) : (
                                <h2>No order placed.</h2>
                              )}
                            </div>
                            <img
                              style={{ width: "400px" }}
                              src={
                                process.env.REACT_APP_STATIC_URL +
                                "/media/DMF/investment.svg"
                              }
                            />
                          </div>
                        </>
                      )}
                    </>
                  )}
                  <FintooInlineLoader isLoading={inlineLoader} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <SlidingPanel
        className="Filter_Panel"
        type={"right"}
        isOpen={openPanel}
        size={sidePanelWidth}
        backdropClicked={() => setOpenPanel(false)}
      >
        <div id="FilterData" className="d-flex flex-column">
          <div className="ps-3 pe-3 pt-3">
            <div className="SideBar_Filter">
              <div className="filter_text">Filters</div>
              <div>
                <button type="button" onClick={() => setOpenPanel(false)}>
                  <img src={CloseFilter} alt="" srcset="" />
                </button>
              </div>
            </div>
            <div style={{ marginTop: "1rem" }} className="Line"></div>
          </div>
          <div className="p-3" style={{ flexGrow: "1", overflow: "auto" }}>
            <div className="fltr-section" style={{ paddingTop: "0" }}>
              {/* <h4>Sort</h4> */}

              <div className="fund_Option">
                <div
                  className="d-flex align-items-center position-relative"
                  style={{ cursor: "pointer" }}
                  ref={refCalendarBox}
                >
                  <div
                    className="grey-500 pe-3"
                    onClick={() => setOpenCalendar(true)}
                  >
                    {selectedDates.length == 2
                      ? `${moment(selectedDates[0]).format(
                          "DD-MM-YYYY"
                        )} To ${moment(selectedDates[1]).format("DD-MM-YYYY")}`
                      : "Select Date Range"}
                  </div>
                  <div onClick={() => setOpenCalendar(true)}>
                    <img
                      src={
                        process.env.REACT_APP_STATIC_URL +
                        "/media/DMF/calendar-323.svg"
                      }
                      width="20px"
                      alt="calendar"
                    />
                  </div>
                  {openCalendar && (
                    <div
                      className="range-calendar"
                      style={{ top: "105px", left: "10px", width: "85%" }}
                    >
                      <Calendar
                        maxDate={new Date()}
                        onChange={(dates) => {
                          if (dates) {
                            setSelecteDates(dates);
                            // Auto-close when both dates are selected
                            if (
                              Array.isArray(dates) &&
                              dates.length === 2 &&
                              dates[0] &&
                              dates[1]
                            ) {
                              setOpenCalendar(false);
                            }
                          }
                        }}
                        selectRange={true}
                        returnValue="range"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="fltr-section">
              <h4>Order Type</h4>
              <div className="Category_Filter">
                <ul className="fltr-items">
                  <li className="fltr-items-li fltr-items-li-w50">
                    <FintooCheckbox
                      checked={filterState.orderType.includes("SIP")}
                      title={"SIP"}
                      onChange={() => handleOrderTypeChange("SIP")}
                    />
                  </li>
                  <li className="fltr-items-li fltr-items-li-w50">
                    <FintooCheckbox
                      checked={filterState.orderType.includes("ADD")}
                      title={"Lumpsum"}
                      onChange={() => handleOrderTypeChange("ADD")}
                    />
                  </li>
                  <li className="fltr-items-li fltr-items-li-w50">
                    <FintooCheckbox
                      title={"Redeem"}
                      checked={filterState.orderType.includes("R")}
                      onChange={() => handleOrderTypeChange("R")}
                    />
                  </li>
                  <li className="fltr-items-li fltr-items-li-w50">
                    <FintooCheckbox
                      title={"SWP"}
                      checked={filterState.orderType.includes("SWP")}
                      onChange={() => {
                        handleOrderTypeChange("SWP");
                      }}
                    />
                  </li>
                  <li className="fltr-items-li fltr-items-li-w50">
                    <FintooCheckbox
                      title={"Switch"}
                      checked={filterState.orderType.includes("SWITCH")}
                      onChange={() => {
                        handleOrderTypeChange("SWITCH");
                      }}
                    />
                  </li>
                  <li className="fltr-items-li fltr-items-li-w50">
                    <FintooCheckbox
                      title={"STP"}
                      checked={filterState.orderType.includes("STP")}
                      onChange={() => {
                        handleOrderTypeChange("STP");
                      }}
                    />
                  </li>
                </ul>
              </div>
            </div>

            <div className="fltr-section">
              <h4>Payment Status</h4>
              <div className="Category_Filter">
                <ul className="fltr-items">
                  <li className="fltr-items-li fltr-items-li-w50">
                    <FintooCheckbox
                      title={"Success"}
                      checked={filterState.orderStatus.includes("success")}
                      onChange={() => handleOrderStatusChange("success")}
                    />
                  </li>
                  <li className="fltr-items-li fltr-items-li-w50">
                    <FintooCheckbox
                      title={"Pending"}
                      checked={filterState.orderStatus.includes("pending")}
                      onChange={() => handleOrderStatusChange("pending")}
                    />
                  </li>
                  <li className="fltr-items-li fltr-items-li-w50">
                    <FintooCheckbox
                      title={"Failed"}
                      checked={filterState.orderStatus.includes("failed")}
                      onChange={() => handleOrderStatusChange("failed")}
                    />
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="p-3 Filter_Btn_panel">
            <div>
              <button
                onClick={() => {
                  // Configure toastr
                  toastr.options = {
                    closeButton: true,
                    progressBar: true,
                    positionClass: "toast-bottom-left",
                    timeOut: 5000,
                  };

                  // Validate date range if selected
                  if (selectedDates && selectedDates.length === 2) {
                    const startDate = moment(selectedDates[0]).startOf("day");
                    const endDate = moment(selectedDates[1]).startOf("day");
                    const today = moment().startOf("day");

                    // Check if end date is before start date
                    if (endDate.isBefore(startDate)) {
                      toastr.error("End date cannot be before start date");
                      return;
                    }

                    // Check if dates are in future
                    if (startDate.isAfter(today) || endDate.isAfter(today)) {
                      toastr.error("Cannot select future dates");
                      return;
                    }
                  }

                  setOpenPanel(false);
                  setOptions((prev) => ({
                    ...prev,
                    reset: true,
                    currentPage: 1,
                    ...filterState,
                    dateRange: selectedDates,
                  }));
                  window.scrollTo(0, 0);
                }}
              >
                Apply
              </button>
            </div>
            <div style={{ paddingLeft: "5%" }}>
              <button
                className="Reset"
                type="button"
                onClick={() => {
                  setSelecteDates([]);
                  setFilterState({
                    orderStatus: [],
                    orderType: [],
                  });
                  setOpenPanel(false);
                  setOptions({
                    reset: true,
                    currentPage: 1,
                    orderStatus: [],
                    orderType: [],
                    dateRange: [],
                  });
                  window.scrollTo(0, 0);
                }}
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      </SlidingPanel>
    </PortfolioLayout>
  );
};

export default PortfolioTransaction;
