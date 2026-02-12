import styles from "./style.module.css";
import commonStyles from "../../../Layout/Fullpage/style.module.css";
import { useViewCheckOnce } from "../../../../Utils/Hooks/UseViewCheck";
import { useRef } from "react";

function InternationalEquityAdvantagesSection() {
  // const ref1 = useRef(null)
  // const ref2 = useRef(null)
  // const isVisible2 = useViewCheckOnce(ref2)
  // const isVisible1 = useViewCheckOnce(ref1)

  return (
    <>
      <section
        className={`${styles["ie-advantages-section"]} ${commonStyles["padding-class"]}`}
      >
        <div className={`${styles["ie-advantages-section-header"]}`}>
          Advantages Of Investing In International Equity
        </div>
        <div className={`${styles.cardBox}`}>
          <a className="text-decoration-none pointer" target="_blank" href="https://www.clientam.com/sso/Login?RL=1&partnerID=Fintoo">
            <div className={`${styles.card}`}>
              <div className={`${styles.img}`}>
                <img src={process.env.REACT_APP_STATIC_URL + 'media/wp/InternationalEquity/Stocks_and_ETFs.svg'} alt="" />
              </div>
              <div className={`text-center ${styles.txtHead}`}>
                <div>Stocks and ETFs</div>
              </div>
              <div className={`text-center ${styles.txt}`}>
                <div>Invest in 5,000+ globally recognised companies.</div>
              </div>
            </div>
          </a>
          {/* <a className="text-decoration-none pointer" target="_blank" href="https://www.clientam.com/sso/Login?RL=1&partnerID=Fintoo">
            <div className={`${styles.card}`}>
              <div className={`${styles.img}`}>
                <img src={process.env.REACT_APP_STATIC_URL + 'media/wp/InternationalEquity/Stacks.svg'} alt="" />
              </div>
              <div className={`text-center ${styles.txtHead}`}>
                <div>Stacks</div>
              </div>
              <div className={`text-center ${styles.txt}`}>
                <div>Ready-to-select portfolios, curated by experts. </div>
              </div>
            </div>
          </a> */}
          <a className="text-decoration-none pointer" target="_blank" href="https://www.clientam.com/sso/Login?RL=1&partnerID=Fintoo">
            <div className={`${styles.card}`}>
              <div className={`${styles.img}`}>
                <img src={process.env.REACT_APP_STATIC_URL + 'media/wp/InternationalEquity/Funds.png'} alt="" />
              </div>
              <div className={`text-center ${styles.txtHead}`}>
                <div>Funds</div>
              </div>
              <div className={`text-center ${styles.txt}`}>
                <div>Curated large funds with reliable performance.</div>
              </div>
            </div>
          </a>
          <a className="text-decoration-none pointer" target="_blank" href="https://www.clientam.com/sso/Login?RL=1&partnerID=Fintoo">
            <div className={`${styles.card}`}>
              <div className={`${styles.img}`}>
                <img src={process.env.REACT_APP_STATIC_URL + 'media/wp/InternationalEquity/ESOP.svg'} alt="" />
              </div>
              <div className={`text-center ${styles.txtHead}`}>
                {/* <div>Cash Management</div> */}
                <div>ESOP Management</div>
              </div>
              <div className={`text-center ${styles.txt}`}>
                {/* <div>International Savings & Investment Account.</div> */}
                <div>Asset Migration for Diversification&#10;and Risk Management.</div>
              </div>
            </div>
          </a>
        </div>
        {/* <div ref={ref1} className={`${styles['ie-advantages-items-container']}`}>
                    <div className={`${styles['ie-advantages-item']} ${styles['slide-right']} ${isVisible1 ? styles['active'] : ''}`}>
                        <div className={`${styles['ie-advantages-item-icon']} `}>
                            <div className={`${styles['ie-advantages-item-icon-img-container']}`}>
                                <img className={`${styles['ie-advantages-item-icon-img']}`}  src={card1} alt="" />
                            </div>
                        </div>
                        <div className={`${styles['ie-advantages-item-heading']}`}>Diversification</div>
                        <div className={`${styles['ie-advantages-item-text']}`}>Investing in two different markets which have a minimum correlation i.e. even if one market is highly volatile, its volatility is less likely to affect the performance of the other market. This difference enables you to achieve additional stability during market volatility.</div>
                    </div>
                    <div className={`${styles['ie-advantages-item']} ${styles['slide-left']} ${isVisible1 ? styles['active'] : ''}`}>
                        <div className={`${styles['ie-advantages-item-icon']}`}>
                            <div className={`${styles['ie-advantages-item-icon-img-container']}`}>
                                <img className={`${styles['ie-advantages-item-icon-img']}`} src={card2} alt="" />
                            </div>
                        </div>
                        <div className={`${styles['ie-advantages-item-heading']}`}>More Investment Options</div>
                        <div className={`${styles['ie-advantages-item-text']}`}>Going international gives you a vast choice of investment options that may not be present in the domestic market. Eg. The US market has some of the world’s top-most technology companies, and Europe is home to engineering companies.</div>
                    </div>
                </div>
                <br />
                <div ref={ref2} className={`${styles['ie-advantages-items-container']}`}>
                    <div className={`${styles['ie-advantages-item']} ${styles['slide-right']} ${isVisible2 ? styles['active'] : ''}`}>
                        <div className={`${styles['ie-advantages-item-icon']}`}>
                            <div className={`${styles['ie-advantages-item-icon-img-container']}`} >
                                <img className={`${styles['ie-advantages-item-icon-img']}`} src={card3} alt="" />
                            </div>
                        </div>
                        <div className={`${styles['ie-advantages-item-heading']}`}>Lesser Risk</div>
                        <div className={`${styles['ie-advantages-item-text']}`}>As fundamentally strong and globally leading companies have comparatively stronger regulations and corporate governance, their chances of missing out on performance, liquidation, or corporate frauds are minimum.</div>
                    </div>
                    <div className={`${styles['ie-advantages-item']} ${styles['slide-left']} ${isVisible2 ? styles['active'] : ''}`}>
                        <div className={`${styles['ie-advantages-item-icon']}`}>
                            <div className={`${styles['ie-advantages-item-icon-img-container']}`}>
                                <img className={`${styles['ie-advantages-item-icon-img']}`} src={card4} alt="" />
                            </div>
                        </div>
                        <div className={`${styles['ie-advantages-item-heading']}`}>Difference In Currency Value</div>
                        <div className={`${styles['ie-advantages-item-text']}`}>As the value of currencies like the Dollar, Euro, and Pound is generally on the appreciating side, investing in international equities for the long term usually gives you a double benefit of appreciating currency as well as better market returns.</div>
                    </div>
                </div>
                <br /><br /> */}
      </section>
    </>
  );
}

export default InternationalEquityAdvantagesSection;
