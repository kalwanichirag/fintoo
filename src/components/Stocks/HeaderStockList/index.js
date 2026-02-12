import { React, useEffect, useRef, useState } from "react";
// import { GET_TICKERS_DATA_API_URL } from "../../../constants";
import "./style.css";
import axios from "axios";
import { Link } from "react-router-dom";
function Headerstocklist() {
  const [showElement, setShowElement] = useState(true);
  const [counter, setCounter] = useState(1);
  const [stockLists, setStockLists] = useState([]);
  const [topGainLists, setTopGainLists] = useState([]);
  const [topLossLists, setTopLossLists] = useState([]);
  const [count, setCount] = useState(0);
  const tickerTime = useRef(null);

  // const fetchTickersData = async () => {
  //   const stock_type = "nse";
  //   var res = await axios.post(GET_TICKERS_DATA_API_URL, {
  //     stock_type: stock_type,
  //   });
  //   const nifty_data = res.data.data;
  //   const top_gain = res.data.top_gain.data;
  //   const top_loss = res.data.top_loss.data;
  //   setStockLists(nifty_data);
  //   setTopGainLists(top_gain);
  //   setTopLossLists(top_loss);
  // };

  const reloadList = () => {
    clearInterval(tickerTime.current);
    tickerTime.current = setInterval(function () {
      setCounter((v) => (v > 2 ? 1 : ++v));
    }, 5000);
  };
  useEffect(() => {
    fetchTickersData();
    reloadList();
  }, []);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;

    if (scrollPosition > 50) {
      document
        .querySelector(".StockSubhead.TopHeader")
        .classList.add("fixedHeaderStock");
    } else {
      document
        .querySelector(".StockSubhead.TopHeader")
        .classList.remove("fixedHeaderStock");
    }
  };

  useEffect(() => {
    // startAnimation();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
    <div style={{ height: '70px' }}>
      <div
        className="StockSubhead TopHeader"
        onMouseEnter={() => {
          clearInterval(tickerTime.current);
        }}
        onMouseLeave={() => {
          reloadList();
        }}
      >
        <div className={`slide-item ${counter == 1 ? "active" : ""}`}>
          <div className="d-flex justify-content-between ps-md-5 pe-md-5 slide-item-text">
            {Array.isArray(stockLists) &&
              stockLists.map((v, i) => (
                <div className={i > 2 ? "d-none d-md-block Demo " : "Demo"}>
                  <div className={"sale"}>
                    <div className="StockName pointer scrolling-words-box">
                      <span
                        style={{
                          overflow: "hidden",
                          position: "relative",
                          height: "20px",
                        }}
                      >
                        {" "}
                        {v.co_name.toLocaleUpperCase()}
                      </span>
                    </div>
                    <div
                      className={
                        v.dayChangeP < 0
                          ? "StockValueRed"
                          : "StockValueGreen" && v.dayChangeP == 0
                          ? "StockValueBlack"
                          : "StockValueGreen"
                      }
                    >
                      <span>
                        {v.dayopen} ({v.dayChangeP}%)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className={`slide-item ${counter == 2 ? "active" : ""}`}>
          <div className="d-flex justify-content-between ps-md-5 pe-md-5 slide-item-text">
            {Array.isArray(topGainLists) &&
              topGainLists.map((v, i) => (
                <div className={i > 2 ? "d-none d-md-block Demo " : "Demo"}>
                  <div className={"sale"}>
                    <div className="StockName pointer scrolling-words-box">
                      <Link
                        className="text-decoration-none"
                        to={`${process.env.PUBLIC_URL}/stocks/details?stock_code=${v.nseCode}`}
                      >
                        <span
                          style={{
                            color: "White",
                            overflow: "hidden",
                            position: "relative",
                            height: "20px",
                          }}
                        >
                          {" "}
                          {v.stock_code}
                        </span>
                      </Link>
                    </div>
                    <div
                      className={
                        v.dayChangeP < 0 ? "StockValueRed" : "StockValueGreen"
                      }
                    >
                      <span>
                        {v.currentPrice} ({v.dayChangeP}%)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className={`slide-item ${counter == 3 ? "active" : ""}`}>
          <div className="d-flex justify-content-between ps-md-5 pe-md-5 slide-item-text">
            {Array.isArray(topLossLists) &&
              topLossLists.map((v, i) => (
                <div className={i > 2 ? "d-none d-md-block Demo " : "Demo"}>
                  <div className={"sale"}>
                    <div className="StockName pointer scrolling-words-box">
                      <Link
                        className="text-decoration-none"
                        to={`${process.env.PUBLIC_URL}/stocks/details?stock_code=${v.nseCode}`}
                      >
                        <span
                          style={{
                            color: "White",
                            overflow: "hidden",
                            position: "relative",
                            height: "20px",
                          }}
                        >
                          {" "}
                          {v.stock_code}
                        </span>
                      </Link>
                    </div>
                    <div
                      className={
                        v.dayChangeP < 0 ? "StockValueRed" : "StockValueGreen"
                      }
                    >
                      <span>
                        {v.currentPrice} ({v.dayChangeP}%)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Headerstocklist;
