import React from "react";
import { useNavigate } from "react-router-dom";
import Style from "./style.module.css";
const RecommendationItem = ({ type, lastDate, buy, sell }) => {
  const navigate = useNavigate();
  const formattedLastDate = new Date(lastDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const iconsList = {
    "Stock Recommendation": "📈",
  };

  const renderContent = () => {
    if (buy == null || sell == null) {
      return <div></div>;
    }

    const buyText = `${buy} ${buy === 1 ? "stock" : "stocks"}`;
    const sellText = `${sell} ${sell === 1 ? "stock" : "stocks"}`;

    if (buy > 0 && sell > 0) {
      return (
        <div>
          {buyText} to{" "}
          <span
            className={`${Style.transactionType} ${Style.transactionType_green}`}
          >
            BUY
          </span>
          , {sellText} to{" "}
          <span
            className={`${Style.transactionType} ${Style.transactionType_red}`}
          >
            SELL
          </span>
        </div>
      );
    }

    if (buy > 0) {
      return (
        <div>
          {buyText} to{" "}
          <span
            className={`${Style.transactionType} ${Style.transactionType_green}`}
          >
            BUY
          </span>
        </div>
      );
    }

    if (sell > 0) {
      return (
        <div>
          {sellText} to{" "}
          <span
            className={`${Style.transactionType} ${Style.transactionType_red}`}
          >
            SELL
          </span>
        </div>
      );
    }

    return <div>No stocks to Buy or Sell</div>;
  };

  return (
    <div className=" mb-2 p-3 rounded bg-light">
      <div style={{ margin: "5px" }}>
        <div></div>
        <div style={{ fontWeight: "600", fontSize: "21px", float: "left" }}>
          {" "}
          {iconsList[type]} {type}
        </div>
        <div
          style={{
            color: "grey",
            fontSize: "16px",
            fontWeight: "bold",
            float: "right",
          }}
        >
          {formattedLastDate}
        </div>
        <br />
        <div style={{ margin: "25px 0" }}>{renderContent()}</div>
      </div>
      <div
        className={Style.btn1}
        onClick={() =>
          navigate(
            `${process.env.PUBLIC_URL}/direct-mutual-fund/portfolio/dashboard/transaction/?stocks=True`
          )
        }
      >
        View
      </div>
    </div>
  );
};

export default RecommendationItem;
