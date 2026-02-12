import { useEffect, useRef } from "react";
import { getUserId } from "../../../common_utilities";
import BoldSectionHeader from "../../BoldSectionHeader";
import styles from "./style.module.css";

const AdvisorySection = () => {
  const myClass = styles.card;
  const aniClass = styles.animated;
  const animated = useRef(false);
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
    // incrementTimer()

    // startAnimation();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    // console.log(
    //   "app",
    //   scrollPosition,
    //   document.getElementById("oa-y-9").offsetTop -
    //     document.getElementById("oa-y-9").clientHeight,
    //   animated
    // );
    if (
      scrollPosition >
        document.getElementById("advisory-cards-i88").offsetTop -
          document.getElementById("advisory-cards-i88").clientHeight &&
      animated.current == false
    ) {
      animated.current = true;

      document
        .querySelectorAll("." + myClass)
        .forEach((v) => v.classList.add(aniClass));
    }
  };

  return (
    <section className="py-5" id="advisory-cards-i88"
      onMouseEnter={() => {
        resetTimer();
      }}
      onMouseLeave={() => {
        resetTimer();
      }}
    >
      <div>
        {/* <h2 className="text-center">Advisory</h2> */}
        <BoldSectionHeader headerText={"Advisory"} />
      </div>
      <div className={styles.cardcontainer}>
        <div className={styles.cardbox}>
          <div className={`d-flex ${styles.cardboxin}`}>
            <div className={` ${styles.card}`}>
              <a
                href={`${process.env.PUBLIC_URL}/financial-planning-page`}
                style={{ textDecoration: "none" }}
              >
                <div className={`${styles["card-fin"]}`}>
                  <div className={styles.cardinner}>
                    <h3 className={styles.cardheading}>Financial Planning</h3>
                    <p className={styles.cardparagraph}>
                    Al-Driven Financial Planning, Achieve Your Financial Goals.
                    </p>
                  </div>
                </div>
              </a>
            </div>
            <div className={styles.card}>
              <a
                href={`${process.env.PUBLIC_URL}/retirement-planning-page`}
                style={{ textDecoration: "none" }}
              >
                <div className={`${styles["card-Retire"]}`}>
                  <div className={styles.cardinner}>
                    <h3 className={styles.cardheading}>Retirement Planning</h3>
                    <p className={styles.cardparagraph}>
                      Don’t ReTire, <br />
                      Reboot… Relive… Rejoice.
                    </p>
                  </div>
                </div>
              </a>
            </div>
            <div className={styles.card}>
              <a
                href={`${process.env.PUBLIC_URL}/investment-planning-page`}
                style={{ textDecoration: "none" }}
              >
                <div className={`${styles["card-invest"]}`}>
                  <div className={styles.cardinner}>
                    <h3 className={styles.cardheading}>Investment Planning</h3>
                    <p className={styles.cardparagraph}>
                      Don’t Just SAVE Money, <br />
                      NURTURE Wealth.
                    </p>
                  </div>
                </div>
              </a>
            </div>
            <div className={styles.card}>
              <a
                href={`${process.env.PUBLIC_URL}/tax-planning-page`}
                style={{ textDecoration: "none" }}
              >
                <div className={`${styles["card-tax"]}`}>
                  <div className={styles.cardinner}>
                    <h3 className={styles.cardheading}>Tax Planning</h3>
                    <p className={styles.cardparagraph}>
                      Minimise Your Taxes,<br />
                      Maximise Your Savings.
                    </p>
                  </div>
                </div>
              </a>
            </div>
            <div className={styles.card}>
              <a
                href={`${process.env.PUBLIC_URL}/risk-management`}
                style={{ textDecoration: "none" }}
              >
                <div className={`${styles["card-risk"]}`}>
                  <div className={styles.cardinner}>
                    <h3 className={styles.cardheading}>Risk Management</h3>
                    <p className={styles.cardparagraph}>
                      What You Cannot Predict, <br />
                      You Can Insure.
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default AdvisorySection;
