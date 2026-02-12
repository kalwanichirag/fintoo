import { useEffect, useState } from "react";
import equityImg from "../../../../Assets/Images/DMF/01_equity.png";
import debtImg from "../../../../Assets/Images/DMF/02_debt.png";
import realEstateImg from "../../../../Assets/Images/DMF/03_real_estate.png";
import liquidImg from "../../../../Assets/Images/DMF/04_liquid.png";
import alternateImg from "../../../../Assets/Images/DMF/05_alternate.png";
import goldImg from "../../../../Assets/Images/DMF/06_gold.png";
import otherImg from "../../../../Assets/Images/DMF/07_other.png";
import style from "./style.module.css";
import Carousel from "react-elastic-carousel";

const getImg = (title) => {
  switch (title) {
    case "Equity":
      return process.env.REACT_APP_STATIC_URL + "media/DMF/01_equity.svg";
    case "Debt":
      return process.env.REACT_APP_STATIC_URL + "media/DMF/02_debt.png";
    case "Real Estate":
      return process.env.REACT_APP_STATIC_URL + "media/DMF/03_real_estate.png";
    case "Liquid":
      return process.env.REACT_APP_STATIC_URL + "media/DMF/04_liquid.svg";
    case "Alternate":
      return process.env.REACT_APP_STATIC_URL + "media/DMF/05_alternate.png";
    case "Gold":
      return process.env.REACT_APP_STATIC_URL + "media/DMF/06_gold.png";
    case "Other":
      return process.env.REACT_APP_STATIC_URL + "media/DMF/07_other.png";
    default:
      return process.env.REACT_APP_STATIC_URL + "media/DMF/01_equity.svg";
  }
};

const getFormattedValue = (value) => {
  if (value < 0) {
    return 0;
  }
  if (value > 100) {
    return 100;
  }
  return Math.round(value * 100) / 100;
};

const ProgressStats = ({ data, onSelect, selectedTab }) => {
  const [selectedIndex, setSelectedIndex] = useState("");
  const tabArray = [
    { title: "Mutual Fund", index: 1 },
    { title: "Stocks", index: 12 },
    { title: "US Equity", index: 11 },
    { title: "Unlisted/AIF Equity", index: 10 },
    { title: "FD / Bonds", index: 3 },
    { title: "Govt. Scheme", index: 4 },
    { title: "Real Estate", index: 5 },
    { title: "Alternate", index: 6 },
    { title: "Gold", index: 7 },
    { title: "Liquid", index: 8 },
    { title: "Insurance", index: 2 },
    // { title: "Others", index: 9 },
  ];

  useEffect(() => {
    if (isNaN(selectedTab) == false) {
      //setSelectedIndex(tabArray[Number(selectedTab) - 1]['title']);
      setSelectedIndex(selectedTab);
    }
  }, []);

  const breakPoints = [
    { width: 1, itemsToShow: 2 },
    { width: 550, itemsToShow: 5 },
    { width: 768, itemsToShow: 5 },
    { width: 1200, itemsToShow: 5 },
    { width: 1500, itemsToShow: 5 },
  ];

  return (
    <div className={`${style.progressStatsContiner} pt-2`}>
      <Carousel
        breakPoints={breakPoints}
        initialActiveIndex={
          tabArray.findIndex((_v) => _v.index == selectedTab) ?? 0
        }
        itemsToShow={5}
      >
        {tabArray.map((v) => (
          <div
            className={`${style.progressStatElem} ${
              selectedIndex == v.index ? style.selectedItem : ""
            }`}
            onClick={() => {
              setSelectedIndex(v.index);
              onSelect(v.index);
            }}
          >
            <img style={{ width: "29px" }} src={getImg(v.title)} alt="" />
            <h6 className={`${style.progressStatElemTitle}`}>{v.title}</h6>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ProgressStats;
