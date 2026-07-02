import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import FaqAccordian from "../FaqSection/faqAccordian";
import FaqSection from "../FaqSection";
import commonEncode from "../../../../commonEncode";

function AboutPlan(props) {
  const [dynamicData, setDynamicData] = useState({about: '', service: [], why: [], doc: []});

  const process1 = [
    "Select Plan",
    "Complete registration",
    "Upload the required documents",
    "Schedule a one-on-one video call with the tax expert",
    "Connect with the tax expert",
    "LIVE preparation of your tax computation and ITR",
    "Review your tax computation",
    "File your ITR and get e verification",
  ];

  useEffect(() => {
    if (!props?.planDetails) return;

    setDynamicData({
      about:
        props.planDetails?.plan_description?.plan_desc || "",
      service:
        props.planDetails?.plan_description?.description || [],
      why:
        props.planDetails?.plan_description?.why || [],
      doc:
        props.planDetails?.plan_description?.doc || [],
    });
  }, [props.planDetails]);

  const IndexList = [
    { id: 1, text: "What Does This Plan Offer?", reflink: "#aboutplan" },
    { id: 2, text: "What Does This Plan Include?", reflink: "#Service" },
    { id: 3, text: "Who Should Choose This Plan?", reflink: "#Buy" },
    { id: 4, text: "What Is The Process?", reflink: "#done" },
    { id: 5, text: "Which Documents Are Required?", reflink: "#Documents" },
    { id: 6, text: "FAQs", reflink: "#faq" },
  ];

  const [activeId, setActiveId] = useState();
  const activeClassName = useRef("");

  useEffect(()=>{
    activeClassName.current = styles.Active;
    window.addEventListener('scroll', handleScroll);
    return ()=> {
      window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleScroll = () => {
    if(activeClassName.current == '') return;
    const scrollPosition = window.scrollY + 150;
    const selected = IndexList.find((v) => {
      const ele = document.querySelector(v.reflink);
      if (ele) {
        const { offsetBottom, offsetTop } = getDimensions(ele);
        return scrollPosition > offsetTop && scrollPosition < offsetBottom;
      }
    });
    if(selected != undefined && Object.keys(selected).length > 0) {
      document.querySelectorAll('.sidebar-links-itr').forEach((v)=> {
        v.classList.remove(activeClassName.current);
      });
      document.querySelector(selected.reflink + '-link').classList.add(activeClassName.current);
    }

  }

  const getDimensions = (ele) => {
    const { height } = ele.getBoundingClientRect();
    const offsetTop = ele.offsetTop;
    const offsetBottom = offsetTop + height;
  
    return {
      height,
      offsetTop,
      offsetBottom,
    };
  };

  return (
    <div className={`row ${styles.PlanAboutSection}`}>
      <div className={`col-12 col-md-3 d-none d-md-block ${styles.LeftSection}`}>
        <div className={`${styles.PlanIndex}`}>
          {IndexList.map((val) => (
            <div
              className={`${styles.planlist}`}
              onClick={() => setActiveId(val.id)}
            >
              <a
                className={`sidebar-links-itr ${
                  activeId === val.id ? styles.Active : styles.Inactive
                }`}
                href={val.reflink}
                id={val.reflink.replace("#", '') + '-link'}
              >
                {" "}
                {val.text}{" "}
              </a>
            </div>
          ))}
          {/* <div className={`${styles.planlist}`}>
            <a href="#Service"></a>
          </div>
          <div className={`${styles.planlist}`}>
            <a href="#Buy">Who Should Buy</a>
          </div>
          <div className={`${styles.planlist}`}>
            <a href="#done">How it's Done</a>
          </div>
          <div className={`${styles.planlist}`}>
            <a href="#Documents">Documents Required</a>
          </div>
          <div className={`${styles.planlist}`}>
            <a href="#faq">FAQs</a>
          </div> */}
        </div>
      </div>
      <div className={`col-md-8 col-12 ${styles.RightSection}`}>
        <div className={`${styles.IndexContent}`}>
          <div className={`${styles.abtPlan}`} id="aboutplan">
            <div className={`${styles.indextitlename}`}>
              What Does This Plan Offer?
            </div>

            <div className={`${styles.titleDes}`}>{dynamicData.about}</div>
            {/* <h3>
              <b>{note}</b>
            </h3> */}
            <p className={`${styles.hrline}`}></p>
          </div>
          <div className={`${styles.anotherPlan}`} id="Service">
            <div className={`${styles.indextitlename}`}>
              What Does This Plan Include?
            </div>
            <div className="d-flex justify-content-between">
              <div className={`${styles.titleDes}`}>
                {dynamicData?.service?.map((item, index) => (
                  <div
                    className="d-flex align-items-center"
                    key={index}
                  >
                    <div>
                      <img
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/wp/ITRPlan/Check.svg"
                        }
                        alt=""
                      />
                    </div>
                    <div className={`ms-3 ${styles.ServiceTxt}`}>
                      {item}
                    </div>
                  </div>
                ))}
              </div>
              <div className="d-none d-md-block">
                <img
                  src={
                    process.env.REACT_APP_STATIC_URL +
                    "media/wp/ITRPlan/AboutPlan.png"
                  }
                  alt=""
                />
              </div>
            </div>
            <p className={`${styles.hrline}`}></p>
          </div>
          {dynamicData?.why?.length > 0 && (
            <div className={`${styles.anotherPlan}`} id="Buy">
              <div className={`${styles.indextitlename}`}>
                Who Should Choose This Plan?
              </div>

              <div className={styles.BuyDes}>
                {dynamicData.why.map((item, index) => (
                  <div
                    className="d-flex align-items-center"
                    key={index}
                  >
                    <div>
                      <img
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/wp/ITRPlan/ITR_P1.svg"
                        }
                        alt=""
                      />
                    </div>

                    <div className={`ms-3 ${styles.ServiceTxt}`}>
                      {item}
                    </div>
                  </div>
                ))}
              </div>

              <p className={`${styles.hrline}`}></p>
            </div>
          )}
          <div className={`${styles.anotherPlan}`} id="done">
            <div className={`${styles.indextitlename}`}>
              What Is The Process?
            </div>
            <div className={` ${styles.DoneDes}`}>
              <div className={`${styles.Process}`}>
                <ul className={`${styles.Process_line}`}>
                  {process1?.map((item, index) => (
                    <li
                      key={index}
                      className="text-base text-brand-1000 font-semibold mb-0 pl-12"
                    >
                      <div>{item}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className={`${styles.hrline}`}></p>
          </div>
          {dynamicData?.doc?.length > 0 && (
            <div
              className={`${styles.anotherPlan}`}
              id="Documents"
            >
              <div className={`${styles.indextitlename}`}>
                Which Documents Are Required?
              </div>

              <div className={styles.DocumentsDes}>
                {dynamicData.doc.map((item, index) => (
                  <div
                    className="d-flex align-items-center"
                    key={index}
                  >
                    <div>
                      <img
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/wp/ITRPlan/ITR_P1.svg"
                        }
                        alt=""
                      />
                    </div>

                    <div className={`ms-3 ${styles.ServiceTxt}`}>
                      {item}
                    </div>
                  </div>
                ))}
              </div>

              <p className={`${styles.hrline}`}></p>
            </div>
          )}
          <div className={`${styles.anotherPlan}`} id="faq">
            <div className={` mb-5 ${styles.indextitlename}`}>FAQ</div>
            <div className={`${styles.FaqAccordian}`}>
              <FaqSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPlan;
