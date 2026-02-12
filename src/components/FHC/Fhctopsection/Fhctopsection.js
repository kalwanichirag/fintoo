import React, { useEffect, useState } from "react";
import styles from "./Fhctopsection.module.css";
// import img3 from "./Assets/Artboard_3.png";
// import Risk from "./Assets/Risk.png";
// import mobile from "./Assets/Mobile.png";
// import Retirement from "./Assets/Retirement.png";
import SectionDB from "./Assets/Section.png";
import HeroImg from "./Assets/HeroImg.png"
function Fhctopsection() {
  const [fadeIn, setFadeIn] = useState(false);
  const [bounce, setBounce] = useState(true);
  const [sectionDBPosition, setSectionDBPosition] = useState(-500); 
  const [img3Position, setImg3Position] = useState(-800);
  const [riskPosition, setRiskPosition] = useState(-800);
  const [mobilePosition, setMobilePosition] = useState(-800); 
  // const [containerWidth, setContainerWidth] = useState(960);
  // useEffect(() => {
  //   const handleResize = () => {
  //     setContainerWidth(window.innerWidth <= 1232 ? 1055 : 960);
  //   };

  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFadeIn(true);
      setSectionDBPosition(-95); 
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const img3Timeout = setTimeout(() => {
      setImg3Position(-8.5);
    }, 1000); 

    return () => clearTimeout(img3Timeout);
  }, [fadeIn]); 

  useEffect(() => {
    const riskTimeout = setTimeout(() => {
      setRiskPosition(-9.5);
    }, 1000); 

    return () => clearTimeout(riskTimeout);
  }, [fadeIn]); 

  useEffect(() => {
    const mobileTimeout = setTimeout(() => {
      setMobilePosition(-13);
    }, 1000);

    return () => clearTimeout(mobileTimeout);
  }, [riskPosition]); 

  // useEffect(() => {
  //   const stopBounceTimeout = setTimeout(() => {
  //     setBounce(false);
  //   }, 3000);

  //   return () => clearTimeout(stopBounceTimeout);
  // }, []);

  return (
    <div className={`${styles.Fhctopsection}`}>
      <div className="">
        <div className={`text-center ${styles.fhtitlesection}`}>
          <div className={`${styles.fhctitle}`}>
            Fintoo Financial Health Check-up
          </div>
          <div className={`${styles.fhcsubtitle}`}>
            Analysis of your finances & recommendations for your financial
            growth.
          </div>
        </div>
      </div>
      <br />
      <div
       className={`d-md-block d-none ${styles.imgDiv}`}
        // style={{
        //   position: "relative",
        //   width: `1055px`,
        //   height: "800px",
        //   margin: "auto",
        //   zIndex: 100,
        //   marginTop: "-2rem",
        //   backgroundImage: `url(${SectionDB})`,
        //   backgroundSize: "contain",
        //   backgroundRepeat: "no-repeat",
        //   backgroundPosition: "center center",
        // }}
      >
        <div style={{ position: "absolute", top: "-16%", left: "0%", zIndex: -1 }}>
          <img src={process.env.REACT_APP_STATIC_URL + "media/FHC/FHC.svg"} />
        </div>
        <div
          style={{
            top: `4rem`,
            bottom: "0%",
            right: `${riskPosition}%`,
            position: "absolute",
            transition: "top 1s, right 1s",
            opacity: fadeIn ? 1 : 0,
          }}
        >
          <img
            className={`${styles.img}`}
            style={{ width: "381px" }}
            src={process.env.REACT_APP_STATIC_URL + "media/FHC/Risk.png"}
            alt="3rd"
          />
        </div>
        <div
          style={{
            top: `3rem`,
            left: `${img3Position}%`,
            position: "absolute",
            transition: "left 1s",
            opacity: fadeIn ? 1 : 0,
          }}
        >
          <img
            className={`${styles.img}`}
            style={{ width: "24rem" }}
            src={process.env.REACT_APP_STATIC_URL + "media/FHC/Artboard_3.png"}
            alt="3rd"
          />
        </div>
        <div
          style={{
            
            bottom: `20%`,
            left: `${img3Position}%`,
            position: "absolute",
            transition: "top 1s, left 1s",
            opacity: fadeIn ? 1 : 0,
          }}
        >
          <img
            className={`${styles.img}`}
            style={{ width: "24rem" }}
            src={process.env.REACT_APP_STATIC_URL + "media/FHC/Retirement.png"}
            alt="3rd"
          />
        </div>
        <div
          style={{
          
            top: `12.6rem`,
            right: `${mobilePosition}%`,
            position: "absolute",
            transition: "top 1s, right 1s",
            opacity: fadeIn ? 1 : 0,
          }}
        >
          <img
            className={`${styles.img}`}
            style={{ width: "100%" }}
            src={process.env.REACT_APP_STATIC_URL + "media/FHC/Mobile.png"}
            alt="3rd"
          />
        </div>
      </div>
      <div className="d-md-none d-block">
          <img style={{width : "100%"}} src={HeroImg} alt="HeroImg"/>
      </div>
    </div>
  );
}
// ${bounce ? styles.bounceAnimation : ""}
export default Fhctopsection;
