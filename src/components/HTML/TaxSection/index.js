import { useEffect, useRef } from "react";
import BoldSectionHeader from "../../BoldSectionHeader";

import styles from "./style.module.css";

const TaxSection = () => {
  const myClass = styles.card;
  const aniClass = styles.animated;
  const animated = useRef(false);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    // startAnimation();
  }, []);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;

    if (
      scrollPosition >
      document.getElementById("tx-df-rt9").offsetTop -
      document.getElementById("tx-df-rt9").clientHeight &&
      animated.current == false
    ) {
      animated.current = true;

      document
        .querySelectorAll("." + myClass)
        .forEach((v) => v.classList.add(aniClass));
    }
  };

  return (
    <section className={`${styles.investsection} py-5`} id="tx-df-rt9">
      <div className={`container ${styles.container}`}>
        {/* <h2 className='text-center'>Invest</h2> */}
        <BoldSectionHeader headerText={"Tax"} />
        <div className="row">
          <div className="col-12 col-md-6">
            <div className="row">
              <div className="col-12 col-md-6">
                <div className={styles.investcardlist}>
                  {/* <div className={styles.card}>
                    <a href={`${process.env.PUBLIC_URL}/virtual-itr-helpdesk`} style={{ textDecoration: 'none' }}>
                      <div className={`${styles["card-ITR"]}`}>
                        <div className={styles.cardinner}>
                          <h3 className={styles.cardheading}>File your ITR</h3>
                          <p className={styles.cardparagraph}>
                          Smart, simple, and stress-free way to file your ITR.
                          </p>
                        </div>
                      </div>
                    </a>

                  </div> */}
                  <div className={styles.card}>
                    <a href={`${process.env.PUBLIC_URL}/nri-taxation`} style={{ textDecoration: 'none' }}>
                      <div className={`${styles["card-NRI"]}`}>
                        <div className={styles.cardinner}>
                          <h3 className={styles.cardheading}>NRI Taxation</h3>
                          <p className={styles.cardparagraph}>
                          Efficiently manage NRI taxation with effective expert guidance.
                          </p>
                        </div>
                      </div>
                    </a>

                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className={styles.cardextrapadding}>
                  <div className={styles.investcardlist}>
                    <div className={styles.card}>

                      <a href={`${process.env.PUBLIC_URL}/notices`} style={{ textDecoration: 'none' }}>
                        <div className={`${styles["card-Notices"]}`}>
                          <div className={styles.cardinner}>
                            <h3 className={styles.cardheading}>Notices</h3>
                            <p className={styles.cardparagraph}>
                            Get effective resolutions for all types of income tax notices.
                            </p>
                          </div>
                        </div>
                      </a>
                    </div>
                    {/* <div className={styles.card}>
                      <div className={`${styles["card-fin"]}`}>
                        <div className={styles.cardinner}>
                          <h3 className={styles.cardheading}>Mutual Funds</h3>
                          <p className={styles.cardparagraph}>
                            Contrary to popular not simply random text.
                          </p>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div
              className="d-flex align-items-center"
              style={{ height: "100%" }}
            >
              <h2 className={styles["section-title"]}>
              Minimise Your Taxes, <br />
              Maximise Your Savings.              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default TaxSection;
