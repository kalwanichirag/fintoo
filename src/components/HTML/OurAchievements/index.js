import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import { useLocation } from "react-router-dom";

const OurAchievements = ({ isMFSnippet }) => {
  const timerStarted = useRef(false);
  const location = useLocation();
  const [pageurl, setPageurl] = useState(false);

  // ✅ all counter states
  const [counts, setCounts] = useState({
    b1: 0,
    b2: 0,
    b3: 0,
    b4: 0,
    b5: 0,
    b6: 0,
  });

  // ✅ set Dubai page check
  useEffect(() => {
    if (location.pathname.indexOf("/nri-desk-dubai") > -1) {
      setPageurl(true);
    } else {
      setPageurl(false);
    }
  }, [location]);

  // ✅ scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const target = document.getElementById("oa-y-9");
      if (!target) return;

      const scrollPosition = window.scrollY;
      if (
        scrollPosition > target.offsetTop - target.clientHeight &&
        timerStarted.current === false
      ) {
        timerStarted.current = true;

        if (isMFSnippet) {
          if (counts.b1 === 0) {
            startAnimationForMFSnippet();
          }
        } else {
          if (counts.b2 === 0) {
            startAnimation();
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [counts, isMFSnippet]);

  // ✅ generic animation function
  const animate = (targets) => {
    const totalFrames = 100;
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      setCounts((prev) => {
        const updated = { ...prev };
        for (let key in targets) {
          updated[key] = Math.min(
            targets[key],
            Math.round((frame / totalFrames) * targets[key])
          );
        }
        return updated;
      });

      if (frame >= totalFrames) {
        clearInterval(timer);
        setCounts((prev) => ({ ...prev, ...targets }));
      }
    }, 1);
  };

  // ✅ two animation setups
  const startAnimation = () => {
    animate({
      b2: 250,
      b3: 4000,
      b4: 250000,
      b5: 250000,
      b6: 3,
    });
  };

  const startAnimationForMFSnippet = () => {
    animate({
      b1: 3500,
      b2: 20,
      b3: 100,
      b4: 5000,
    });
  };

  return (
    <section className={`${styles.section}`} id="oa-y-9">
      <div className={styles.overlay}></div>
      <div className={`${styles.container} container`}>
        <div className={`text-center ${styles.GlobalText}`}>
          Global Scorecard
        </div>

        {!isMFSnippet ? (
          <div style={{ padding: "0px 0px 50px 0px" }}>
            <div className={`${styles.cards} timer-dv`}>
              <div className={styles["card-item"]}>
                <div>
                  <p className={styles.number}>
                    <span>{counts.b2}</span>
                    <span className={styles.smallfont}>+</span>
                  </p>
                  <p className={styles.label}>Corporate tie-ups</p>
                </div>
              </div>

              <div className={styles["card-item"]}>
                <div className={pageurl ? "d-none" : ""}>
                  <p className={styles.number}>
                    <span>{counts.b3}</span>
                    <span className={styles.smallfont}>+ cr</span>
                  </p>
                  <p className={styles.label}>Assets Under Tracking (AUT)</p>
                </div>
                <div className={pageurl ? "" : "d-none"}>
                  <p className={styles.number}>
                    <span>{counts.b6.toLocaleString("en-IN")}</span>
                    <span className={styles.smallfont}>+ Billion</span>
                  </p>
                  <p className={styles.label}>Assets Under Tracking (AUT)</p>
                </div>
              </div>

              <div className={styles["card-item"]}>
                <div className={pageurl ? "d-none" : ""}>
                  <p className={styles.number}>
                    <span>{counts.b4.toLocaleString("en-IN")}</span>
                    <span className={styles.smallfont}>+</span>
                  </p>
                  <p className={styles.label}>Happy Clients</p>
                </div>
                <div className={pageurl ? "" : "d-none"}>
                  <p className={styles.number}>
                    <span>{counts.b5.toLocaleString("en-IN")}</span>
                    <span className={styles.smallfont}>+</span>
                  </p>
                  <p className={styles.label}>Happy Clients</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: "0px 0px 50px 0px" }}>
            <div className={`${styles.cards} timer-dv`}>
              <div className={styles["card-item"]}>
                <div>
                  <p className={styles.number}>
                    <span>{counts.b1}</span>
                    <span className={styles.smallfont}> cr</span>
                  </p>
                  <p className={styles.label}>Assets Under Tracking (AUT)</p>
                </div>
              </div>

              <div className={styles["card-item"]}>
                <div>
                  <p className={styles.number}>
                    <span>{counts.b2}</span>
                    <span className={styles.smallfont}>+</span>
                  </p>
                  <p className={styles.label}>Years of exp</p>
                </div>
              </div>

              <div className={styles["card-item"]}>
                <div>
                  <p className={styles.number}>
                    <span>{counts.b3}</span>
                    <span className={styles.smallfont}>+</span>
                  </p>
                  <p className={styles.label}>Team size</p>
                </div>
              </div>

              <div className={styles["card-item"]}>
                <div>
                  <p className={styles.number}>
                    <span>{counts.b4.toLocaleString("en-IN")}</span>
                  </p>
                  <p className={styles.label}>No of clients</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default OurAchievements;
