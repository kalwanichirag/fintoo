import React, { useState,useRef,useEffect } from "react";
import styles from "./style.module.css";
import { AiOutlinePlus } from "react-icons/ai";
import Content from "./Content";
import SectionHeader from "../../../SectionHeader";
import { getUserId } from "../../../../common_utilities";
const AdvisorySection = () => {
  const [open, setOpen] = useState(0);
  const [activeIndex, SetActiveIndex] = useState(null);

  const updateAccordionIndex = (idx) => {
    if (activeIndex === idx) {
      return SetActiveIndex(() => null);
    } else {
      return SetActiveIndex(() => idx);
    }
  };

  const isActive = (idx) => activeIndex === idx;
  const interval = useRef(null);
  const timer = useRef(0);
  const startTimer = () =>{
      // if idle for more than 5 mins logout
      if(timer.current>=4){
        clearInterval(interval.current)
          if(getUserId()){
            window.location.href="https://stg.minty.co.in/web/logout"
          }
        }
        else{
          timer.current=timer.current+1
        }
    }
  const incrementTimer =() =>{
      interval.current = setInterval(() => {
          startTimer()
      }, 60000);
  }
  const resetTimer = () =>{
      clearInterval(interval.current)
  }
  useEffect(() => {
      // incrementTimer();
    }, []);
  return (
    <>
    
      <div className="container mt-md-0 mt-5"
        onMouseEnter={() => {
          resetTimer();
        }}
        onMouseLeave={() => {
            resetTimer();
        }}
      >
      <SectionHeader
            className="text-center"
            headerText={"Let’s Turn Your Idle Savings Into Profitable Investments With Our 360 Degree Investment Solutions."}
          />
        <div className={`mt-5 row ${styles.investBox}`}>
          <div className="col-md-6">
            <div className="mb-4">
              <div
                style={{
                  position: "relative",
                }}
                className={`${""}`}
              >
                <div className={`${styles.investType}`}>
                  <div
                    onClick={() => updateAccordionIndex(0)}
                    className={`d-md-flex pointer ${styles.topBox}`}
                  >
                    <div className={`${styles.investTxt}`}>
                      Private Wealth Management
                    </div>
                    <div className={`ms-4 ${styles.Icons}`}>
                      <AiOutlinePlus />
                    </div>
                  </div>
                </div>
                <Content activeIndex={isActive(0)}>
                  <div className={`${styles.BottomBox}`}>
                  A perfect hybrid blend of a human advisor touch, powered with a digital platform to cater to HNIs who need exclusive Do-It-For-You services. 
                  
                  </div>
                </Content>
              </div>
            </div>
            <div className="mb-4">
              <div className={`${""}`}>
                <div className={`${styles.investType}`}>
                  <div
                    onClick={() => updateAccordionIndex(2)}
                    className={`d-md-flex pointer ${styles.topBox}`}
                  >
                    <div className={`${styles.investTxt}`}>
                      Equity Offerings
                    </div>
                    <div className={`ms-4 ${styles.Icons}`}>
                      <AiOutlinePlus />
                    </div>
                  </div>
                </div>
                <Content activeIndex={isActive(2)}>
                  <div className={`${styles.BottomBox}`}>
                  A comprehensive range of equity investment options supported by an expert advisory to enhance effectiveness and profitability.
                  </div>
                </Content>
              </div>
            </div>
            <div className="mb-4">
              <div className={`${""}`}>
                <div className={`${styles.investType}`}>
                  <div
                    onClick={() => updateAccordionIndex(1)}
                    className={`d-md-flex pointer ${styles.topBox}`}
                  >
                    <div className={`${styles.investTxt}`}>
                      {" "}
                      Debt Investments
                    </div>
                    <div className={`ms-4 ${styles.Icons}`}>
                      <AiOutlinePlus />
                    </div>
                  </div>
                </div>
                <Content activeIndex={isActive(1)}>
                  <div className={`${styles.BottomBox}`}>
                  Guided investments in fixed-income generating investment options like corporate bonds, government securities, treasury bills, commercial paper, etc.
                  </div>
                </Content>
              </div>
            </div>
            <div className="mb-4">
              <div className={`${""}`}>
                <div className={`${styles.investType}`}>
                  <div
                    onClick={() => updateAccordionIndex(3)}
                    className={`d-md-flex pointer ${styles.topBox}`}
                  >
                    <div className={`${styles.investTxt}`}>
                      Alternate Investments
                    </div>
                    <div className={`ms-4 ${styles.Icons}`}>
                      <AiOutlinePlus />
                    </div>
                  </div>
                </div>
                <Content activeIndex={isActive(3)}>
                  <div className={`${styles.BottomBox}`}>
                  Discovering exclusive opportunities that cater to a niche market and have the potential to deliver higher alpha.
                  </div>
                </Content>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-4">
              <div className={`${""}`}>
                <div className={`${styles.investType}`}>
                  <div
                    onClick={() => updateAccordionIndex(4)}
                    className={`d-md-flex pointer ${styles.topBox}`}
                  >
                    <div className={`${styles.investTxt}`}>Risk Management</div>
                    <div className={`ms-4 ${styles.Icons}`}>
                      <AiOutlinePlus />
                    </div>
                  </div>
                </div>
                <Content activeIndex={isActive(4)}>
                  <div className={`${styles.BottomBox}`}>
                  Capability to provide tailored protection and risk management solutions to mitigate the risk exposures.
                  
                  </div>
                </Content>
              </div>
            </div>
            <div className="mb-4">
              <div className={`${""}`}>
                <div className={`${styles.investType}`}>
                  <div
                    onClick={() => updateAccordionIndex(5)}
                    className={`d-md-flex pointer ${styles.topBox}`}
                  >
                    <div className={`${styles.investTxt}`}>Tax Management</div>
                    <div className={`ms-4 ${styles.Icons}`}>
                      <AiOutlinePlus />
                    </div>
                  </div>
                </div>
                <Content activeIndex={isActive(5)}>
                  <div className={`${styles.BottomBox}`}>
                  Delivering comprehensive tax planning solutions that include individual taxation, business taxation, NRI taxation, domestic taxation, capital gain taxation, and advance taxation.
                  
                  </div>
                </Content>
              </div>
            </div>
            <div className="mb-4">
              <div className={`${""}`}>
                <div className={`${styles.investType}`}>
                  <div
                    onClick={() => updateAccordionIndex(6)}
                    className={`d-md-flex pointer ${styles.topBox}`}
                  >
                    <div className={`${styles.investTxt}`}>
                    Innovative Products
                    </div>
                    <div className={`ms-4 ${styles.Icons}`}>
                      <AiOutlinePlus />
                    </div>
                  </div>
                </div>
                <Content activeIndex={isActive(6)}>
                  <div className={`${styles.BottomBox}`}>
                  Expertise in providing exclusive and novel investment opportunities through unique sourcing and value-creation vantages.
                  </div>
                </Content>
              </div>
            </div>
            <div className="mb-4">
              <div className={`${""}`}>
                <div className={`${styles.investType}`}>
                  <div
                    onClick={() => updateAccordionIndex(7)}
                    className={`d-md-flex pointer ${styles.topBox}`}
                  >
                    <div className={`${styles.investTxt}`}>
                    Offshore Investing
                    </div>
                    <div className={`ms-4 ${styles.Icons}`}>
                      <AiOutlinePlus />
                    </div>
                  </div>
                </div>
                <Content activeIndex={isActive(7)}>
                  <div className={`${styles.BottomBox}`}>
                  Expertise in identifying and advising beneficial investment opportunities across global markets.     
                  </div>
                </Content>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AdvisorySection;
