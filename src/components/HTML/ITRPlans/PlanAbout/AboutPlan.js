import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import FaqAccordian from "../FaqSection/faqAccordian";
import FaqSection from "../FaqSection";
import commonEncode from "../../../../commonEncode";

function AboutPlan() {
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

  useEffect(()=> {
    onLoad();
  }, []);
  const onLoad = () => {
    var planid = JSON.parse(
      commonEncode.decrypt(localStorage.getItem("pid"))
    ).plan_id;
    var about =
      "This plan offers an extremely seamless and hassle-free way to file income tax returns for salaried individuals and people earning from house rent. It is exclusively designed to deliver comprehensive, timely and accurate tax filing assistance. Thousands of individuals trust our certified and experienced tax experts to file their income tax returns and, ultimately, stay free from all worries about any kind of error or income tax notice.";

    var service,
      why,
      doc;
      
    
    if (planid == 39) {
      about =
        "This plan offers an extremely seamless and hassle-free way to file income tax returns for salaried individuals and people earning from house rent. It is exclusively designed to deliver comprehensive, timely and accurate tax filing assistance. Thousands of individuals trust our certified and experienced tax experts to file their income tax returns and, ultimately, stay free from all worries about any kind of error or income tax notice.";
      service = [
        "Live ITR Filing by Tax Expert in 60 Min via Zoom Meeting",
        "Multiple Form 16",
        "Multiple House Property Income",
        "Multiple Other Sources Income",
        "Salary Income Below 50 Lacs",
        "No Capital Gains",
      ];
      why = [

        "Salaried employees with one or multiple Form 16",
        "Individuals having rental income from one or multiple properties",
        "Individuals having income from other sources",
        "Individuals who missed tax-saving investment declaration",
        "Salaried individuals owning one or multiple properties",
      ];
      doc = [

        "Form 16 Part A and Part B",
        "Income Tax Login Credentials",
        "Form 26AS",
        "Your Aadhaar Card",
        "Bank account details",
        "Home loan interest certificate for self-occupied and let-out property, if applicable",
      ];
    }
    if (planid == 40) {
      about =
        "Whether you have earned/incurred capital gains/losses by selling any kind of shares, mutual funds, or property, connect with our tax expert over a one-on-one live video call to save tax on capital gains and file your ITR. Along with capital gains, this plan also includes the basic ITR filing for individuals having income from salary, house property, and other sources"
      // note = "Note. This plan is not for individuals with income from intra-day trading or derivative trading.";
      service = [
 
        "Live Tax Expert Filing in 60 Min via Zoom Meeting",
        "Multiple Form 16",
        "Multiple House Property Income",
        "Multiple Other Sources Income",
        "Capital Gains/(Losses) from Mutual Funds/Shares/Property or any other capital assets",
        "Salary Arrear + Form 10E Filing",
        "Income of More than 50 Lacs",
        "Assets & Liabilities Schedule Disclosure",
      ];
      why = [
        "Salaried individuals who have earned capital gains or Incurred a capital loss",
        "Individuals who have received salary arrears",
        "Individuals who have income from Salary, House property and other sources.",
        "Income of 50 Lacs and above",
        "Individuals having foreign assets or Unlisted Equity shares.",
        "Individuals who wish to carry forward the loss from the previous years can do so after providing the required documents.",
      ];
      doc = [

        "Form 16 Part A and Part B",
        "Income Tax Login Credentials",
        "Form 26AS",
        "Your Aadhaar Card",
        "Bank account details",
        "Home loan interest certificate for self-occupied and let-out property, if applicable",
        "Capital gains statement / Global report / Profit and Loss Statement",
      ];
    }
    if (planid == 41) {
      about =
        "This plan ensures you personalized ITR Filing assistance by a dedicated tax expert who will guide you to file your income tax return efficiently and accurately. Whether you are an Indian resident or a non-resident with foreign income or income from stocks, mutual funds, or the sale of property, the tax expert will simplify all the complexities and make your ITR filing surprisingly easy. Moreover, the expert will also help you get tax relief by availing benefits from Double Taxation Avoidance Agreement (DTAA). Thus, helping you save time, energy, and mitigating the risk of receiving any kind of notice from the income tax department. "
      service = [
        
      "Live Tax Expert Filing in 60 Min via Zoom Meeting",
      "Multiple Form 16",
      "Multiple House Property Income",
      "Multiple Other Sources Income",
      "Capital Gains from Mutual Funds/Shares/Property or any other capital assets",
      "Availing Benefits of Double Taxation Avoidance Agreement",
      "Computation and Disclosure of Foreign Income and Assets",
      "Assets and Liabilities Schedule Disclosure in India",

      ];
      why = [


        "Resident of India paying taxes on income earned in India and foreign country",
        "Resident of India who earns income from overseas investments which may be subject to foreign withholding taxes",
        "Non-resident Indian paying taxes on income earned in India and foreign country",
        "Foreign citizens paying taxes on income earned in India and foreign country",


      ];
      doc = [
       
      "Form 16 Part A and Part B",
      "Income Tax Login Credentials ",
      "Form 26AS ",
      "Aadhaar Card ",
      "Bank account details",
      "Home loan interest certificate for self-occupied and let out property, if applicable",
      "Capital gains statement / Global report / Profit and Loss Statement",
      "Detail of income and taxes paid in India and foreign country",

      ];
    }
    if (planid == 42) {
      about =
      "If you are a professional or an entrepreneur with an income that falls under the presumptive tax scheme and needs to be disclosed under section 44AD and section 44ADA, then connect with our tax experts and let them easily calculate your tax liability and file your income tax returns over a one-on-one video call."
      service = [

        "Live Tax Expert Filing in 60 Min via Zoom Meeting",
        "Multiple House Property Income",
        "Multiple Other Sources Income",
        "Documents Follow Ups",
        "Tax Planning for Businesses & Professionals",
        "Calculation of Presumptive Income",
      ];
      why = [

        "Businesses with net income above 8% and gross annual turnover below Rs. 2 Crores (without audit) ",
        "Professionals with a net income at 50% or more and gross receipts under Rs. 50 Lakhs (without audit)",
        "Individual Having Income from Salary, House property and Any other income.",
      ];
      doc = [
        "Bank statements for the financial year",
        "Income Tax Login Credentials",
      ];
    }
    setDynamicData({about, service, why, doc});
  };

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
                {dynamicData.service.map((item) => (
                  <div className="d-flex align-items-center">
                    <div>
                      <img
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/wp/ITRPlan/Check.svg"
                        }
                        alt=""
                      />
                    </div>
                    <div className={`ms-3 ${styles.ServiceTxt}`}> {item}</div>
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
          <div className={`${styles.anotherPlan}`} id="Buy">
            <div className={`${styles.indextitlename}`}>
              Who Should Choose This Plan?
            </div>
            <div className={` ${styles.BuyDes}`}>
              {dynamicData.why.map((item) => (
                <div className="d-flex align-items-center">
                  <div>
                    <img
                      src={
                        process.env.REACT_APP_STATIC_URL +
                        "media/wp/ITRPlan/ITR_P1.svg "
                      }
                      alt=""
                    />
                  </div>
                  <div className={`ms-3 ${styles.ServiceTxt}`}>{item}</div>
                </div>
              ))}
            </div>
            <p className={`${styles.hrline}`}></p>
          </div>
          <div className={`${styles.anotherPlan}`} id="done">
            <div className={`${styles.indextitlename}`}>
              What Is The Process?
            </div>
            <div className={` ${styles.DoneDes}`}>
              <div className={`${styles.Process}`}>
                <ul className={`${styles.Process_line}`}>
                  {process1.map((item) => (
                    <li className="text-base text-brand-1000 font-semibold mb-0 pl-12">
                      <div>{item}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className={`${styles.hrline}`}></p>
          </div>
          <div className={`${styles.anotherPlan}`} id="Documents">
            <div className={`${styles.indextitlename}`}>
              Which Documents Are Required?
            </div>
            <div className={` ${styles.DocumentsDes}`}>
              {dynamicData.doc.map((item) => (
                <div className="d-flex align-items-center">
                  <div>
                    <img
                      src={
                        process.env.REACT_APP_STATIC_URL +
                        "media/wp/ITRPlan/ITR_P1.svg"
                      }
                      alt=""
                    />
                  </div>
                  <div className={`ms-3 ${styles.ServiceTxt}`}>{item}</div>
                </div>
              ))}
              <div></div>
            </div>
            <p className={`${styles.hrline}`}></p>
          </div>
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
