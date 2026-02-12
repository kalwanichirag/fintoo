import React, { useState } from "react";
import CommonDashSlider from "react-elastic-carousel";
import Trade from "../../Assets/Images/CommonDashboard/Trade.png";
import ICICI from "../../Assets/Images/CommonDashboard/ICICIBank.png";
import { BiUpArrowAlt, BiDownArrowAlt } from "react-icons/bi";
const breakPoints = [
  { width: 1, itemsToShow: 1 },
  { width: 550, itemsToShow: 4 },
  { width: 768, itemsToShow: 4 },
  { width: 1200, itemsToShow: 4 },
];

function InvestmentBox() {
  const [slide, setSlide] = useState({
    activeObject: null,
    objects: [
      {
        id: 1,
        FundText: "ICICI Prudential Commodities Growth..",
        buttonText: "Add Goals",
        Images: process.env.REACT_APP_STATIC_URL + "media/DMF/ICICIBank.png",
      },
      {
        id: 2,
        FundText: "HDFC Credit Risk Debt Fund (G)",
        buttonText: "Add Income",
        Images: process.env.REACT_APP_STATIC_URL + "media/DMF/ICICIBank.png",
      },
      {
        id: 3,
        FundText: "IDFC Tax Advt(ELSS) Fund - Reg(G)",
        buttonText: "Add Assets",
        Images: process.env.REACT_APP_STATIC_URL + "media/DMF/ICICIBank.png",
      },
      {
        id: 4,
        FundText: "TATA Digital India Fund Direct Growth",
        buttonText: "Book Appointment",
        Images: process.env.REACT_APP_STATIC_URL + "media/DMF/ICICIBank.png",
      },
      {
        id: 5,
        FundText: "TATA Digital India Fund Direct Growth",
        buttonText: "Book Appointment",
        Images: process.env.REACT_APP_STATIC_URL + "media/DMF/ICICIBank.png",
      },
      {
        id: 6,
        FundText: "TATA Digital India Fund Direct Growth",
        buttonText: "Book Appointment",
        Images: process.env.REACT_APP_STATIC_URL + "media/DMF/ICICIBank.png",
      },
    ],
  });
  function toggleActiveStyles(id) {
    return slide.activeObject === id ? "active" : "inactive";
    // return 'active';
  }
  function toggleActive(id) {
    // 
    setSlide({ ...slide, activeObject: id });
  }
  // 
  return (
    <div>
      <CommonDashSlider
        itemsToShow={4}
        autoPlaySpeed={1500}
        autoTabIndexVisibleItems={true}
        breakPoints={breakPoints}
      >
        {slide.objects.map(
          ({ id, FundText, title, Images, buttonText, elements }) => (
            <div className="MFListItems"   key={'dd-' + id}>
              <div
              
                className={`DataItem ${toggleActiveStyles(id)}`}
                onClick={() => toggleActive(id)}
              >
                <div className="imgBox">
                  {/* <Images width={"60px"} height={"60px"} /> */}
                  <img src={Images} />
                </div>
                <div className="Funds">
                  <div className="FundText">{FundText}</div>
                </div>
                <div className="d-flex justify-content-between p-3">
                  <div>
                    <div
                      style={{
                        fontSize: ".7em",
                        color: "gray",
                        fontWeight: "600",
                      }}
                    >
                      NAV
                    </div>
                    <div
                      style={{
                        fontSize: "1em",
                        color: "gray",
                        fontWeight: "700",
                      }}
                    >
                      ₹ 445
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: ".7em",
                        color: "gray",
                        fontWeight: "600",
                      }}
                    >
                      1 YEAR
                    </div>
                    <div
                      style={{
                        fontSize: "1em",
                        color: "#9ac04f",
                        fontWeight: "700",
                      }}
                    >
                      2.25 %{" "}
                      <span>
                        <BiUpArrowAlt />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </CommonDashSlider>
    </div>
  );
}

export default InvestmentBox;
