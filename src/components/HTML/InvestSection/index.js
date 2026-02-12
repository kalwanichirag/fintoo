import { useEffect } from "react";
import { useRef } from "react";
import BoldSectionHeader from "../../BoldSectionHeader";
import styles from "./style.module.css";

const InvestSection = () => {
  const myClass = styles.card;
  const aniClass = styles.animated;
  const animated = useRef(false);

  useEffect(() => {
    // startAnimation();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;

    if (
      scrollPosition >
        document.getElementById("inv-99i-i").offsetTop -
          document.getElementById("inv-99i-i").clientHeight &&
      animated.current == false
    ) {
      animated.current = true;

      document
        .querySelectorAll("." + myClass)
        .forEach((v) => v.classList.add(aniClass));
    }
  };

  return (
    <section className={`${styles.investsection} py-5`} id="inv-99i-i">
      <div className={` ${styles.container}`}>
        {/* <h2 className='text-center'>Invest</h2> */}
        <BoldSectionHeader headerText={"Invest"} />
        <div className="row">
          <div className="col-12 col-md-6">
            <div
              className="d-md-flex align-items-center"
              style={{ height: "100%" }}
            >
              <h2 className={styles["section-title"]}>
                An Investment <br /> Option For Every Goal
              </h2>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="row">              
              <div className="col-12 col-md-5">
                <div>
                  <div className={styles.investcardlist}>
                    <div className={styles.card}>
                      <a
                        href={`${process.env.PUBLIC_URL}/stock-advisory`}
                        style={{ textDecoration: "none" }}
                      >
                        <div className={`${styles["card-stock"]}`}>
                          <div className={styles.cardinner}>
                            <h3 className={styles.cardheading}>Stock</h3>
                            <p className={styles.cardparagraph}>Maximum potential for long-term growth.</p>
                          </div>
                        </div>
                      </a>
                    </div>

                    <div className={styles.card}>
                      <a
                        href={`${process.env.PUBLIC_URL}/ipo`}
                        style={{ textDecoration: "none" }}
                      >
                        <div className={`${styles["card-IPO"]}`}>
                          <div className={styles.cardinner}>
                            <h3 className={styles.cardheading}>
                              IPO
                            </h3>
                            <p className={styles.cardparagraph}>Invest in young and growing companies.</p>
                          </div>
                        </div>
                      </a>
                    </div>
                    <div className={styles.card}>
                      <div className={`${styles["card-DMF"]}`}>
                        <a
                          href={`${process.env.PUBLIC_URL}/direct-mutual-funds`}
                          style={{ textDecoration: "none" }}
                        >
                          <div className={styles.cardinner}>
                            <h3 className={styles.cardheading}>Mutual Fund</h3>
                            <p className={styles.cardparagraph}> Best for beginners and diversification.</p>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-5">
                <div className={styles.cardextrapadding}>
                  <div className={styles.investcardlist}>
                    <div className={styles.card}>
                      <div className={`${styles["card-bond"]}`}>
                        <a
                          href={`${process.env.PUBLIC_URL}/bond-investment`}
                          style={{ textDecoration: "none" }}
                        >
                          <div className={styles.cardinner}>
                            <h3 className={styles.cardheading}>Bonds</h3>
                            <p className={styles.cardparagraph}>Offers regular and predictable income.</p>
                          </div>
                        </a>
                      </div>
                    </div>
                    <div className={styles.card}>
                      <a
                        href={`${process.env.PUBLIC_URL}/nri-desk`}
                        style={{ textDecoration: "none" }}
                      >
                        <div className={`${styles["card-NRI"]}`}>
                          <div className={styles.cardinner}>
                            <h3 className={styles.cardheading}>
                             NRI Desk
                            </h3>
                            <p className={styles.cardparagraph}>Complete financial solutions for NRIs.</p>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default InvestSection;
