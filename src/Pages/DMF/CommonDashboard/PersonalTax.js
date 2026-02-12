import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import CommonDashboardLayout from "../../../components/Layout/Commomdashboard";

const PersonalTax = (props) => {
  const [returnsType, setReturnsType] = useState("xirr");
  const [selectedTab, setSelectedTab] = useState(1);
  const navigate = useNavigate();

  return (
    <CommonDashboardLayout>
       
      <p style={{
        display : 'grid',
        placeItems : 'center',
        alignItems : "center",
        height : '100vh'
      }}>Personal Tax</p>
      {/*
    
      <div
        style={{
          marginTop: "4rem",
        }}
      >
        <div className="row">
          <div className="col-md-12  float-right right-0">
            <div
              className="d-md-flex sensexNifty"
            >
              <div className="sensexnifty">
                <span className="valuetext">SENSEX</span>
                <span>54892.49</span>
                <span className="negvaluetext">▼</span>
                <span className="negvaluetext2">-214.85(-0.39%)</span>
              </div>
              <span className="sensexLine"></span>
              <div className="sensexnifty">
                <span className="valuetext">NIFTY 50</span>
                <span>54892.49</span>
                <span className="negvaluetext">▼</span>
                <span className="negvaluetext2">-60.85(-0.39%)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="Section">
          <CardBox />
        </div>
        <div className="Section">
          <DashboardSlider />
        </div>
        <div className="Section row">
          <div className="col-md-8 col-12">
            <div className="PlanBox">
              <div className="d-md-flex">
                <div className="TradeImg">
                  <img src={Trade} />
                </div>
                <div className="TradeText">
                  <div className="BigPlanText">Make Your Tax Planning Easy</div>
                  <div className="SmallPlanText">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et.
                  </div>
                </div>
                <div className="TradeNextImg">
                  <img className="pointer" src={NextImg} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 col-12">
            <div className="BlogBox">
              <div>
                <div className="NewsBOx">
                  <p
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    Blogs
                  </p>
                  <div className="d-flex justify-content-between mt-3">
                    <div className="Blogsimgbx">
                      <img src={Blog1} />
                    </div>
                    <div
                    className="BlogSection"
                    >
                      <div
                      
                        className="BlogTitle"
                      >
                        Economic Reforms, doing biz likely to take...
                      </div>
                      <div
                        className="BlogDec"
                      >
                        Lorem ipsum dolor sir amet consectetur.
                      </div>
                    </div>
                    <div>
                      <img src={NextImg} width={30}  className="mt-4 pointer"/>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between mt-5">
                    <div className="Blogsimgbx">
                    <img src={Blog2} />
                    </div>
                    <div
                    className="BlogSection"
                    >
                      <div
                      
                        className="BlogTitle"
                      >
                        Economic Reforms, doing biz likely to take...
                      </div>
                      <div
                        className="BlogDec"
                      >
                        Lorem ipsum dolor sir amet consectetur.
                      </div>
                    </div>
                    <div>
                      <img src={NextImg} width={30}  className="mt-4 pointer"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="Section d-block">
          <p className="text-bold ms-3">News</p>
          <NewsBox />
        </div>
        <p style={{ height: "2rem" }}></p>
        <div className="row d-none">
          <div className="col-12 col-md-8">
            <div className="insideTabBoxd">
              <div className="insideTabd">
                <div
                  onClick={() => setSelectedTab(1)}
                  className={`pointer ${selectedTab == 1 ? "active" : ""}`}
                >
                  <p>Mutual Funds </p>
                </div>
                <div
                  onClick={() => setSelectedTab(2)}
                  className={`pointer ${selectedTab == 2 ? "active" : ""}`}
                >
                  <p>IND Equity </p>
                </div>
                <div
                  onClick={() => setSelectedTab(3)}
                  className={`pointer ${selectedTab == 3 ? "active" : ""}`}
                >
                  <p>US Equity </p>
                </div>
                <div
                  onClick={() => setSelectedTab(4)}
                  className={`pointer ${selectedTab == 4 ? "active" : ""}`}
                >
                  <p>FD & Bonds </p>
                </div>
              </div>
            </div>
            <div className="MFData">
              <div className="d-flex justify-content-between">
                <div className="Datatext">
                  <p>Top Picks</p>
                </div>
                <div>
                  <button>Explore All</button>
                </div>
              </div>
             
              <div className="MFListItems">
                <div className="DataItem">
                  <div className="imgBox">
                    <img src={ICICI} />
                  </div>
                  <div className="Funds">
                    <div className="FundText">
                      ICICI Prudential Commodities Growth..
                    </div>
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
                <div className="DataItem">
                  <div className="imgBox">
                    <img src={HDFC} />
                  </div>
                  <div className="Funds">
                    <div className="FundText">
                      HDFC Credit Risk Debt Fund (G)
                    </div>
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
                        ₹ 500
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
                          color: "red",
                          fontWeight: "700",
                        }}
                      >
                        2.25 %{" "}
                        <span>
                          <BiDownArrowAlt />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="DataItem">
                  <div className="imgBox">
                    <img src={ICICI} />
                  </div>
                  <div className="Funds">
                    <div className="FundText">
                      IDFC Tax Advt (ELSS) Fund - Reg (G)
                    </div>
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
                <div className="DataItem">
                  <div className="imgBox">
                    <img src={TATA} />
                  </div>
                  <div className="Funds">
                    <div className="FundText">
                      Tata Digital India Fund Growth
                    </div>
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
                          color: "Red",
                          fontWeight: "700",
                        }}
                      >
                        2.25 %{" "}
                        <span>
                          <BiDownArrowAlt />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
           
            </div>
            <div className="MFData">
              <div
                className="d-flex justify-content-between"
                style={{
                  borderBottom: "1px solid #eeee",
                }}
              >
                <div className="Datatext">
                  <p>Category</p>
                </div>
              </div>
              <div className="MFListItems p-5">
                <div className="imgCenter">
                  <div className="imgBorderUS">
                    <img
                      src="data:image/png;base64,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"
                      style={{ width: 40, height: 40 }}
                    />
                  </div>
                  <div className="pt-2">
                    <div className="SliderText">Lage Cap</div>
                  </div>
                </div>
                <span className="cateLine"></span>
                <div className="imgCenter">
                  <div className="imgBorderUS">
                    <img
                      src="data:image/png;base64,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"
                      style={{ width: 40, height: 40 }}
                    />
                  </div>
                  <div className="pt-2">
                    <div className="SliderText">Mid Cap</div>
                  </div>
                </div>
                <span className="cateLine"></span>
                <div className="imgCenter">
                  <div className="imgBorderUS">
                    <img
                      src="data:image/png;base64,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"
                      style={{ width: 40, height: 40 }}
                    />
                  </div>
                  <div className="pt-2">
                    <div className="SliderText"> Small Cap</div>
                  </div>
                </div>
                <span className="cateLine"></span>
                <div className="imgCenter">
                  <div className="imgBorderUS">
                    <img
                      src="data:image/png;base64,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"
                      style={{ width: 40, height: 40 }}
                    />
                  </div>
                  <div className="pt-2">
                    <div className="SliderText"> FD & Bonds</div>
                  </div>
                </div>
                <span className="cateLine"></span>
                <div className="imgCenter">
                  <div className="imgBorderUS">
                    <img
                      src="data:image/png;base64,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"
                      style={{ width: 40, height: 40 }}
                    />
                  </div>
                  <div className="pt-2">
                    <div className="SliderText"> NFO</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="MFData">
              <div
                className="d-flex justify-content-between"
                style={{
                  borderBottom: "1px solid #eeee",
                }}
              >
                <div className="Datatext">
                  <p>AMC</p>
                </div>
              </div>
              <div className="MFListItems p-4">
                <div className="d-flex">
                  <div>
                    <img
                      style={{
                        width: "40px",
                        height: "40px",
                      }}
                      src={ICICI}
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "1em",
                        fontWeight: "600",
                        paddingTop: ".8em",
                        paddingLeft: ".4em",
                      }}
                    >
                      ICICI Preduential AMC
                    </div>
                  </div>
                </div>
                <span className="cateLine mt-0"></span>
                <div className="d-flex">
                  <div>
                    <img
                      style={{
                        width: "40px",
                        height: "40px",
                      }}
                      src={HDFC}
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "1em",
                        fontWeight: "600",
                        paddingTop: ".8em",
                        paddingLeft: ".4em",
                      }}
                    >
                      HDFC Bank AMC
                    </div>
                  </div>
                </div>
                <span className="cateLine mt-0"></span>
                <div className="d-flex">
                  <div>
                    <img
                      style={{
                        width: "40px",
                        height: "40px",
                      }}
                      src={TATA}
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "1em",
                        fontWeight: "600",
                        paddingTop: ".8em",
                        paddingLeft: ".4em",
                      }}
                    >
                      Tata Digital India AMC
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="MFData">
              <div className="row">
                <div className="col-md-6 col-lg-6 col-12 ">
                  <div className="BannerBox p-4">
                    <div className="pt-3">
                      <div
                        style={{
                          color: "#41347c",
                          fontSize: "1.4em",
                          fontWeight: "400",
                        }}
                      >
                        Check Your
                      </div>
                      <div
                        style={{
                          color: "#41347c",
                          fontSize: "1.4em",
                          fontWeight: "600",
                        }}
                      >
                        Credit Card Score
                      </div>
                      <div
                        style={{
                          color: "gray",
                          fontSize: ".8em",
                          fontWeight: "400",
                        }}
                      >
                        Lorem ipsum dolot sit amet. consectetur sit amet
                        consectetur.
                      </div>
                    </div>
                    <div></div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-6 col-12 ">
                  <div className="BannerBox p-4">
                    <div className="pt-3">
                      <div
                        style={{
                          color: "#41347c",
                          fontSize: "1.4em",
                          fontWeight: "400",
                        }}
                      >
                        Introducing
                      </div>
                      <div
                        style={{
                          color: "#41347c",
                          fontSize: "1.4em",
                          fontWeight: "600",
                        }}
                      >
                        Pension Fund Planning
                      </div>
                      <div
                        style={{
                          color: "gray",
                          fontSize: ".8em",
                          fontWeight: "400",
                        }}
                      >
                        Lorem ipsum dolot sit amet. consectetur sit amet
                        consectetur.
                      </div>
                    </div>
                    <div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="Addsection">
              <div className="d-flex">
                <div className="AddImg">
                  <img src={Bag} />
                </div>
                <div className="newsData">
                  <div className="Newstitle">Fintoo Model porfolios</div>
                  <span className="NewsBottomLine">
                    Lorem ipsum sit amet, consectetur.
                  </span>
                </div>
              </div>
              <div className="d-flex  mt-5">
                <div className="AddImg">
                  <img src={Bag} />
                </div>
                <div className="newsData">
                  <div className="Newstitle">Track all your investments</div>
                  <span className="NewsBottomLine">
                    Lorem ipsum sit amet, consectetur.
                  </span>
                </div>
              </div>
              <div className="d-flex  mt-5">
                <div className="AddImg">
                  <img src={Bag} />
                </div>
                <div className="newsData">
                  <div className="Newstitle">Check Financial Planning</div>
                  <span className="NewsBottomLine">
                    Lorem ipsum sit amet, consectetur.
                  </span>
                </div>
              </div>
              <div className="d-flex  mt-5">
                <div className="AddImg">
                  <img src={Bag} />
                </div>
                <div className="newsData">
                  <div className="Newstitle">Download Sample Report</div>
                  <span className="NewsBottomLine">
                    Lorem ipsum sit amet, consectetur.
                  </span>
                </div>
              </div>
            </div>
            <div
              className="Addsection"
              style={{
                marginTop: "7rem",
              }}
            >
              <p
                style={{
                  fontWeight: "bold",
                }}
              >
                News
              </p>
              <div>
                <div className="NewsBOx">
                  <div className="imgNews"></div>
                  <div>
                    <div className="NewsTitle">
                      Which Are The Best Stocks Below Rs 20 in India?
                    </div>
                    <div className="d-flex NewsText">
                      <div>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et.
                      </div>
                      <div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="Addsection"
              style={{
                marginTop: "3rem",
              }}
            >
              <div>
                <div className="NewsBOx">
                  <p
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    Blogs
                  </p>
                  <div className="d-flex justify-content-between mt-5">
                    <div className="Blogsimgbx"></div>
                    <div
                      style={{
                        paddingLeft: "1em",
                        maxWidth: "200px",
                      }}
                    >
                      <div
                        style={{
                          fontsize: "1em",
                          fontWeight: "700",
                        }}
                      >
                        Economic Reforms, doing biz likely to take...
                      </div>
                      <div
                        style={{
                          fontsize: ".8em",
                          color: "gray",                         
                        }}
                      >
                        Lorem ipsum dolor sir amet consectetur.
                      </div>
                    </div>
                    <div></div>
                  </div>
                  <div className="d-flex justify-content-between mt-5">
                    <div className="Blogsimgbx"></div>
                    <div
                      style={{
                        paddingLeft: "1em",
                        maxWidth: "200px",
                      }}
                    >
                      <div
                        style={{
                          fontsize: "1em",
                          fontWeight: "700",
                        }}
                      >
                        Economic Reforms, doing biz likely to take...
                      </div>
                      <div
                        style={{
                          fontsize: ".8em",
                          color: "gray",                         
                        }}
                      >
                        Lorem ipsum dolor sir amet consectetur.
                      </div>
                    </div>
                    <div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </CommonDashboardLayout>
  );
};

export default PersonalTax;
