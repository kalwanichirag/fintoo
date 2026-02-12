import styles from "./style.module.css";
import SectionHeader from "../../../SectionHeader";
import One from "./assets/number-one.svg";
import Two from "./assets/number-2.svg";
import Three from "./assets/number-3.svg";
import Four from "./assets/Four.png";
const WhyInvestSection = () => {
  return (
    <section className={`${styles.StepsInvestmentPlanSection}`}>
      <div className={`${styles.StepsInvestmentPlanHederText}`}>
        <SectionHeader
          className="text-center"
          headerText={"Why Restrict Your Global Dreams With Local Investments?"}
        />
        <p className={`text-center ${styles.subtxt}`}>Take your investments beyond boundaries and explore opportunities beyond expectations.</p>
        <div className={`${styles.InvestCard}`}>
          <div className={`${styles.cards}`}>
            <div className={`${styles.header}`}>Explore Opportunities Across The Globe</div>
            <div className={`${styles.aaaa}`}></div>
            <div className={`${styles.ParaTxt}`}>
            Spot and benefit by grabbing exceptional opportunities across all the markets and sectors of the world.
            </div>
          </div>
          <div className={`${styles.cards}`}>
            <div className={`${styles.header}`}>Grow With The Fastest Growing Companies</div>
            <div className={`${styles.aaaa}`}></div>
            <div className={`${styles.ParaTxt}`}>
            Experience exceptional growth by investing in the most famous, reputed, and established brands in the world.

            </div>
          </div>
          <div className={`${styles.cards}`}>
            <div className={`${styles.header}`}>Start Small… <br /> Grow Big 
            <br />
            {/* <br /> */}
            </div>
            <div className={`${styles.aaaa}`}></div>
            <div className={`${styles.ParaTxt}`}>
            Think investing in global stocks would require a lot of capital? Don’t worry. You can start by buying fractions of stocks with limited capital.
            </div>
          </div>
        </div>
      </div>
  
    </section>
  );
};
export default WhyInvestSection;


// import styles from "./style.module.css";
// import commonStyles from "../../../Layout/Fullpage/style.module.css";
// import cardImg1 from './assets/cardImg1.png'
// import cardImg2 from './assets/cardImg2.png'
// import cardImg3 from './assets/cardImg3.png'
// import cardImg4 from './assets/cardImg4.png'
// import cardImg5 from './assets/cardImg5.png'

// function WhyInvestSection() {

//     return (
//         <>
//             <section className={`${styles['why-invest-section']} ${commonStyles['padding-class']}`}>
//                 <div className={`${styles['why-invest-section-header']}`}>Why Invest With Fintoo</div>
//                 <div className={`${styles['why-invest-section-items-container']}`}>
//                     <div className={`${styles['why-invest-section-item']} ${styles['flex-item-left']}`}>
//                         <div className={`${styles['why-invest-section-item-icon']}`}>
//                             <div style={{ width: '50px' }}>
//                                 <img style={{ width: '100%' }} src={cardImg2} alt="" />
//                             </div>
//                         </div>
//                         <div>
//                             <div className={`${styles['why-invest-section-item-heading']}`}>
//                                 {/* Powered By Stockal */}
//                             </div>
//                             <div className={`${styles['why-invest-section-item-content']}`}>
//                             Create your account and start investing in the world’s top-most companies in just minutes.
//                             </div>
//                         </div>
//                     </div>
//                     <div className={`${styles['why-invest-section-item']} ${styles['flex-item-right']}`}>
//                         <div>
//                             <div className={`${styles['why-invest-section-item-heading']}`}>
//                             Investment Support
//                             </div>
//                             <div className={`${styles['why-invest-section-item-content']}`}>
//                             Get access to in-depth research and analysis that will help you make wise and beneficial decisions.
//                             </div>
//                         </div>
//                         <div className={`${styles['why-invest-section-item-icon']}`}>
//                             <div style={{ width: '50px' }}>
//                                 <img style={{ width: '100%' }} src={cardImg3} alt="" />
//                             </div>
//                         </div>
//                     </div>
//                     <div className={`${styles['why-invest-section-item']} ${styles['flex-item-left']}`}>
//                         <div className={`${styles['why-invest-section-item-icon']}`}>
//                             <div style={{ width: '50px' }}>
//                                 <img style={{ width: '100%' }} src={cardImg4} alt="" />
//                             </div>
//                         </div>
//                         <div>
//                             <div className={`${styles['why-invest-section-item-heading']}`}>
//                             Real-Time Updates
//                             </div>
//                             <div className={`${styles['why-invest-section-item-content']}`}>
//                             No matter the time-zone difference. Get real-time stock prices and a lag-free investment process.
//                             </div>
//                         </div>
//                     </div>
//                     <div className={`${styles['why-invest-section-item']} ${styles['flex-item-right']}`}>
//                         <div>
//                             <div className={`${styles['why-invest-section-item-heading']}`}>
//                             Instant Updates
//                             </div>
//                             <div className={`${styles['why-invest-section-item-content']}`}>
//                             Never miss an important update related to your investments with instant alerts and notifications.
//                             </div>
//                         </div>
//                         <div className={`${styles['why-invest-section-item-icon']}`}>
//                             <div style={{ width: '50px' }}>
//                                 <img style={{ width: '100%' }} src={cardImg5} alt="" />
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <br /><br />
//             </section>
//         </>

//     )
// }

// export default WhyInvestSection
