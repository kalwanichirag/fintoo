import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import { useLocation } from "react-router-dom";

const StatsSection = () => {
  const timerStarted = useRef(false);
  const autoInc = useRef(0);
  const location = useLocation();
  const [pageurl, setPageurl] = useState(false);
  
  useEffect(() => {
    if (location.pathname.indexOf("/nri-desk-dubai") > -1) {
      setPageurl(true);
    } else {
      setPageurl(false);
    }
  }, [location]);
  useEffect(() => {
    // startAnimation();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    if (document.getElementById("oa-y-9") == null) return;

    if (
      scrollPosition >
      document.getElementById("oa-y-9").offsetTop -
      document.getElementById("oa-y-9").clientHeight &&
      timerStarted.current == false
    ) {
      timerStarted.current = true;

      if (document.getElementById("b1").innerHTML * 1 === 0) {
        startAnimation()
      }

    }
  };

  const startAnimation = () => {
    // var a = 0;
    const max = 1000;
    const min = 100;

    var b1 = document.getElementById("b1").getAttribute("max") * 1;
    var b2 = document.getElementById("b2").getAttribute("max") * 1;
    var b3 = document.getElementById("b3").getAttribute("max") * 1;
    var b4 = document.getElementById("b4").getAttribute("max") * 1;

    var timer = setInterval(() => {
      document.getElementById("b1").innerHTML = Math.round(
        (autoInc.current * (b1 / min)) / 10
      );
      document.getElementById("b2").innerHTML = Math.round(
        (autoInc.current * (b2 / min)) / 10
      );
      document.getElementById("b3").innerHTML = Math.round(
        (autoInc.current * (b3 / min)) / 10
      );
      document.getElementById("b4").innerHTML =
        "" +
        Math.round((autoInc.current * (b4 / min)) / 10).toLocaleString("en-IN");

      autoInc.current = autoInc.current + 1;
      if (autoInc.current > max) {
        clearInterval(timer);
      }
    }, 1);
  };

  return (
    <section className={`${styles.section}`} id="oa-y-9">
      <br /><br /><br />
      <div className={`${styles.container} container`}>
        <div style={{ padding: "0px 0px 50px 0px" }}>
          <div className={`${styles.cards} timer-dv`}>
            <div className={styles["card-item"]}>
              <div className={styles["card-item-elem"]}>
                <p className={styles.number}>
                  <span id="b1" max="18">
                    0
                  </span>
                  <span className={styles.number}>+</span>
                </p>
                <p className={styles.label}>years in the industry</p>
              </div>
            </div>
            <div className={styles["card-item"]}>
              <div className={styles["card-item-elem"]}>
                <p className={styles.number}>
                  <span id="b2" max="250">
                    0
                  </span>
                  <span className={styles.number}>+</span>
                </p>
                <p className={styles.label}>Corporate tie-ups</p>
              </div>
            </div>
            <div className={styles["card-item"]}>
              <div className={styles["card-item-elem"]}>
                <p className={styles.number}>
                  <span id="b3" max="250">
                    0
                  </span>
                  <span className={styles.number}>Cr+</span>
                </p>
                <p className={styles.label}>Assets Under Management</p>
              </div>
            </div>

            <div className={styles["card-item"]}>
              <div className={styles["card-item-elem"]} >
                <p className={styles.number}>
                  <span id="b4" max="200000">
                    0
                  </span>
                  <span className={styles.number}>+</span>
                </p>
                <p className={styles.label}>Happy Clients</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
    </section>
  );
};

export default StatsSection;
