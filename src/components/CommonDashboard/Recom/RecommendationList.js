import { useEffect, useState } from "react";
import RecommendationItem from "./RecommendationItem";
import style from "./style.module.css";
import {
  apiCall,
  getUserId,
} from "../../../common_utilities";

const RecommendationList = () => {
  const userID = getUserId();
  const [stockTxnData, setStockTxnData] = useState([]);

  const fetchStockHoldings = async () => {
    // try {
    //   const url = `${ADVISORY_GET_STOCKS_HOLDINGS}?user_id=${userID}&txn_status=PENDING`;
    //   const response = await apiCall(url, "", false, false);

    //   if (response.status_code === "200") {
    //     let latestDate = null;
    //     let totalBuy = 0;
    //     let totalSell = 0;
    //     response.data.forEach((item) => {
    //       const date = new Date(item.holding_created_at)
    //       if (!latestDate || date > new Date(latestDate)) {
    //         latestDate = item.holding_created_at;
    //       }
    //       if (item.txn_type === "BUY") {
    //         totalBuy += 1;
    //       } else if (item.txn_type === "SELL") {
    //         totalSell += 1;
    //       }    
    //     });
        
    //     let data = {
    //       txn_type: "Stock Recommendation",
    //       lastDate: latestDate,
    //       buy: totalBuy,
    //       sell: totalSell
    //     };
    //     setStockTxnData([data]);
    //   } else {
    //     setStockTxnData([]);
    //   }
    // } catch (error) {
    //   console.error("Error fetching stock holdings:", error);
    //   setStockTxnData([]);
    // }
  };

  useEffect(() => {
    fetchStockHoldings();
  }, []);

  return (
    <div className={style.recommedateDetails}>
      {stockTxnData.length > 0 ? (
        <>
          <div className={`${style.RecommendationItemBox} p-3`}>
            {stockTxnData.map((stock, index) => (
              <RecommendationItem
                key={index}
                type={stock.txn_type}
                lastDate={stock.lastDate}
                buy={stock.buy}
                sell={stock.sell}
              />
            ))}
          </div>
        </>
      ) : (
        <div className={`${style.RecommendationItemBox} ${style.RecommendationEmpty} py-3`}>
          No Pending Actionable Found
        </div>
      )}
    </div>
  );
};

export default RecommendationList;
