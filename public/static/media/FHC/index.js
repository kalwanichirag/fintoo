import React, { useState, useRef } from "react";
import { useEffect } from "react";
import styles from "./WhatExpect.module.css";
import Trackmoney from "./Trackmoney.png";
import Elock from "./Elock.png";
import Recom from "./Recom.svg";
import Deep_Insights from "./3_Deep_Insights.png";
function WhatExpect() {
  return (
    <>
      <div className={`${styles.WhatExpect}`}>
        <div className={`${styles.title}`}>What can I expect?</div>
      </div>
      <div className={`${styles.WhatExpectbox}`}>
        <div
          className={`d-grid  ${styles.expectBoxwhite} ${styles.expectBoxwhite1}`}
        >
          <div className="d-flex justify-content-center">
            <img
              style={{ width: "100%" }}
              src={
                process.env.REACT_APP_STATIC_URL + "media/FHC/GOAL_SETTING.png"
              }
            />
          </div>
          <div
            style={{
              paddingBottom: "4rem",
            }}
            className={`${styles.expectDesc}`}
          >
            <div className={`${styles.expecttitle}`}>
              Goal Setting & Monitoring
            </div>
            <div className={`${styles.expecttitleinfo}`}>
              Gain clarity on your financial path through goal analysis. Let us
              help you define and achieve your aspirations.
            </div>
          </div>
        </div>
        <div 
         style={{
          zIndex: "1000",
          backgroundImage: `url(${Trackmoney})`, 
          backgroundSize: "200px", 
          backgroundRepeat: "no-repeat", 
          backgroundPosition: "center right", 
        }}
        className={`${styles.expectBoxwhite} ${styles.expectBoxwhite2}`}>
          <div  style={{
              width: "366px",
            }} className={`${styles.expectDesc}`}>
            <div className={`${styles.expecttitle}`}>Track your money</div>
            <div className={`${styles.expecttitleinfo}`}>
              Streamline your income and expenses, unlock insights, and
              transform your spending habits.
            </div>
          </div>
        </div>
        <div  style={{
          zIndex: "1000",
          backgroundImage: `url(${Deep_Insights})`, 
          backgroundSize: "200px", 
          backgroundRepeat: "no-repeat", 
          backgroundPosition: "center right", 
        }} className={`${styles.expectBoxwhite} ${styles.expectBoxwhite3}`}>
          <div  style={{
              width: "366px",
            }} className={`${styles.expectDesc}`}>
            <div className={`${styles.expecttitle}`}>Deep Insights</div>
            <div className={`${styles.expecttitleinfo}`}>
              Gain insights into your existing investments and take actions for
              more profit.
            </div>
          </div>

        </div>
        <div
          style={{
            zIndex: "1000",
            backgroundImage: `url(${Elock})`, 
            backgroundSize: "200px", 
            backgroundRepeat: "no-repeat", 
            backgroundPosition: "bottom right", 
          }}
          className={`${styles.expectBoxwhite} ${styles.expectBoxwhite4}`}
        >
          <div
            style={{
              paddingTop : "5rem",
              width: "366px",
            }}
            className={`${styles.expectDesc}`}
          >
            <div className={`${styles.expecttitle}`}>E-locker</div>
            <div className={`${styles.expecttitleinfo}`}>
              A secure e-locker to save your important documents so you don’t
              have to worry about losing them in the pile
            </div>
          </div>
        </div>
        <div
          style={{
            zIndex: "1000",
            backgroundImage: `url(${Recom})`, 
            backgroundSize: "contain", 
            backgroundRepeat: "no-repeat", 
            backgroundPosition: "center right", 
          }}
          className={`${styles.expectBoxwhite} ${styles.expectBoxwhite5}`}
        >
          <div  style={{
              width: "366px",
            }} className={`${styles.expectDesc}`}>
            <div className={`${styles.expecttitle}`}>
              Customised <br /> Recommendations
            </div>
            <div className={`${styles.expecttitleinfo}`}>
              Discover personalised recommendations across diverse asset
              classes, income and expense management strategies, all designed to
              help you achieve your financial goals and navigate loan
              restructuring efficiently.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default WhatExpect;
