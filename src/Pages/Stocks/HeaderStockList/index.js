import { React, useEffect, useState } from "react";
import "./style.css";
function Headerstocklist() {
  const [showElement, setShowElement] = useState(true);
  const [stockLists, setStockLists] = useState([
    { title: "ABc", label: "657.50(-4.47%)" },
    { title: "SRTANSFIN", label: "123.50(-4.47%)" },
    { title: "TCS", label: "456.50(-4.47%)" },
    { title: "LTI", label: "761.50(-4.47%)" },
    { title: "CIPLA", label: "123.50(-4.47%)" },
    { title: "HINDALCO", label: "345.50(-4.47%)" },
    { title: "NIFYSMALL100", label: "290.50(-4.47%)" },
    { title: "WIPRO", label: "756.50(-4.47%)" },
    { title: "INFY", label: "450.50(-4.47%)" },
  ]);

  const reloadList = () => {
    setTimeout(function () {
      
      var a = stockLists.sort(() => Math.random() - 0.5);
      setStockLists([...a]);
      reloadList();
    }, 5000);
  };
  useEffect(() => {
    reloadList();
  }, []);

  return (
    <div>
      <div className="TopHeader">
        <div className="d-flex justify-content-between ps-md-5 pe-md-5">
          <>
            {stockLists.map((v, i) => (
              <div className="Demo">
                <div className={i > 2 ? "d-none d-md-block sale" : "sale"}>
                  <div className="StockName pointer">
                    <span> {v.title}</span>
                  </div>
                  <div className={i > 3 ? "StockValueRed" : "StockValueGreen"}>
                    <span>{v.label}</span>
                  </div>
                </div>
              </div>
            ))}
          </>
        </div>
      </div>
    </div>
  );
}

export default Headerstocklist;
