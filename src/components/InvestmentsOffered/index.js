import React, { useState } from "react";
import styles from "./style.module.css";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { Link as ScrollLink } from "react-scroll";
import Content from "./Content";
const InvestmentsOffered = () => {
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
  return (
    <>
      <div className="container mt-md-5 mt-3">
        <h2 className="text-center">Types Of Investments Offered </h2>
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
                      {
                        isActive(0) ? <>
                          <AiOutlineMinus />
                        </> : <>
                          <AiOutlinePlus />
                        </>
                      }
                    </div>
                  </div>
                </div>
                <Content activeIndex={isActive(0)}>
                  <div className={`${styles.BottomBox}`}>
                    A perfect hybrid blend of a human advisor touch, powered
                    with a digital platform to cater to HNIs who need exclusive
                    Do-It-For-You services.
                    <div className="pt-3">
                      <ScrollLink
                        to="ContactUs" // Specify the target section's id here
                        smooth={true} // Enable smooth scrolling
                        duration={500} // Set the scrolling duration (in milliseconds)
                        style={{
                          color: "#fff",
                          fontweight: "bold",
                          fontSize: "1.2rem",
                          cursor: "pointer"
                        }}
                      >
                        Book Appointment
                      </ScrollLink>
                    </div>
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
                    {
                        isActive(2) ? <>
                          <AiOutlineMinus />
                        </> : <>
                          <AiOutlinePlus />
                        </>
                      }
                    </div>
                  </div>
                </div>
                <Content activeIndex={isActive(2)}>
                  <div className={`${styles.BottomBox}`}>
                    A comprehensive range of equity investment options supported
                    by an expert advisory to enhance effectiveness and
                    profitability.
                    <div className="pt-3">
                      <ScrollLink
                        to="ContactUs" // Specify the target section's id here
                        smooth={true} // Enable smooth scrolling
                        duration={500} // Set the scrolling duration (in milliseconds)
                        style={{
                          color: "#fff",
                          fontweight: "bold",
                          fontSize: "1.2rem",
                          cursor: "pointer"
                        }}
                      >
                        Book Appointment
                      </ScrollLink>
                    </div>
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
                    {
                        isActive(1) ? <>
                          <AiOutlineMinus />
                        </> : <>
                          <AiOutlinePlus />
                        </>
                      }
                    </div>
                  </div>
                </div>
                <Content activeIndex={isActive(1)}>
                  <div className={`${styles.BottomBox}`}>
                    Guided investments in fixed-income generating investment
                    options like corporate bonds, government securities,
                    treasury bills, commercial paper, etc.
                    <div className="pt-3">
                      <ScrollLink
                        to="ContactUs" // Specify the target section's id here
                        smooth={true} // Enable smooth scrolling
                        duration={500} // Set the scrolling duration (in milliseconds)
                        style={{
                          color: "#fff",
                          fontweight: "bold",
                          fontSize: "1.2rem",
                          cursor: "pointer"
                        }}
                      >
                        Book Appointment
                      </ScrollLink>
                    </div>
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
                    {
                        isActive(3) ? <>
                          <AiOutlineMinus />
                        </> : <>
                          <AiOutlinePlus />
                        </>
                      }
                    </div>
                  </div>
                </div>
                <Content activeIndex={isActive(3)}>
                  <div className={`${styles.BottomBox}`}>
                    Discovering exclusive opportunities that cater to a niche
                    market and have the potential to deliver higher alpha.
                    <div className="pt-3">
                      <ScrollLink
                        to="ContactUs" // Specify the target section's id here
                        smooth={true} // Enable smooth scrolling
                        duration={500} // Set the scrolling duration (in milliseconds)
                        style={{
                          color: "#fff",
                          fontweight: "bold",
                          fontSize: "1.2rem",
                          cursor: "pointer"
                        }}
                      >
                        Book Appointment
                      </ScrollLink>
                    </div>
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
                    {
                        isActive(4) ? <>
                          <AiOutlineMinus />
                        </> : <>
                          <AiOutlinePlus />
                        </>
                      }
                    </div>
                  </div>
                </div>
                <Content activeIndex={isActive(4)}>
                  <div className={`${styles.BottomBox}`}>
                    Capability to provide tailored protection and risk
                    management solutions to mitigate the risk exposures.
                    <div className="pt-3">
                      <ScrollLink
                        to="ContactUs" // Specify the target section's id here
                        smooth={true} // Enable smooth scrolling
                        duration={500} // Set the scrolling duration (in milliseconds)
                        style={{
                          color: "#fff",
                          fontweight: "bold",
                          fontSize: "1.2rem",
                          cursor: "pointer"
                        }}
                      >
                        Book Appointment
                      </ScrollLink>
                    </div>
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
                    {
                        isActive(5) ? <>
                          <AiOutlineMinus />
                        </> : <>
                          <AiOutlinePlus />
                        </>
                      }
                    </div>
                  </div>
                </div>
                <Content activeIndex={isActive(5)}>
                  <div className={`${styles.BottomBox}`}>
                    Delivering comprehensive tax planning solutions that include
                    individual taxation, business taxation, NRI taxation,
                    domestic taxation, capital gain taxation, and advance
                    taxation.
                    <div className="pt-3">
                      <ScrollLink
                        to="ContactUs" // Specify the target section's id here
                        smooth={true} // Enable smooth scrolling
                        duration={500} // Set the scrolling duration (in milliseconds)
                        style={{
                          color: "#fff",
                          fontweight: "bold",
                          fontSize: "1.2rem",
                          cursor: "pointer"
                        }}
                      >
                        Book Appointment
                      </ScrollLink>
                    </div>
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
                    {
                        isActive(6) ? <>
                          <AiOutlineMinus />
                        </> : <>
                          <AiOutlinePlus />
                        </>
                      }
                    </div>
                  </div>
                </div>
                <Content activeIndex={isActive(6)}>
                  <div className={`${styles.BottomBox}`}>
                    Expertise in providing exclusive and novel investment opportunities through unique sourcing and value-creation vantages.
                    <div className="pt-3">
                      <ScrollLink
                        to="ContactUs" // Specify the target section's id here
                        smooth={true} // Enable smooth scrolling
                        duration={500} // Set the scrolling duration (in milliseconds)
                        style={{
                          color: "#fff",
                          fontweight: "bold",
                          fontSize: "1.2rem",
                          cursor: "pointer"
                        }}
                      >
                        Book Appointment
                      </ScrollLink>
                    </div>
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
                    {
                        isActive(7) ? <>
                          <AiOutlineMinus />
                        </> : <>
                          <AiOutlinePlus />
                        </>
                      }
                    </div>
                  </div>
                </div>
                <Content activeIndex={isActive(7)}>
                  <div className={`${styles.BottomBox}`}>
                    Expertise in identifying and advising beneficial investment opportunities across global markets.
                    <div className="pt-3">
                      <ScrollLink
                        to="ContactUs" // Specify the target section's id here
                        smooth={true} // Enable smooth scrolling
                        duration={500} // Set the scrolling duration (in milliseconds)
                        style={{
                          color: "#fff",
                          fontweight: "bold",
                          fontSize: "1.2rem",
                          cursor: "pointer"
                        }}
                      >
                        Book Appointment
                      </ScrollLink>
                    </div>
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
export default InvestmentsOffered;
