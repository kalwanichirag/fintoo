import styles from "./style.module.css";
import commonStyles from "../../../Layout/Fullpage/style.module.css";
import SectionHeader from "../../../SectionHeader";
import { FaClipboardList, FaCalculator, FaPaperPlane } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
// import One from "../../FinancialPlan/StepsFinancialPlan/images/number-one.svg";
// import Two from "../../FinancialPlan/StepsFinancialPlan/images/number-2.svg";
// import Three from "../../FinancialPlan/StepsFinancialPlan/images/number-3.svg";
// import four from "../../FinancialPlan/StepsFinancialPlan/images/Four.png";
import { useRef,useEffect } from "react";

function HowWeWorkSection() {
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
        // incrementTimer();
      }, []);
  return (
    <>
      <section
        className={`${styles["how-we-work-section"]} ${commonStyles["padding-class"]} pb-5 pt-md-5`}
        onMouseEnter={() => {
          resetTimer();
        }}
        onMouseLeave={() => {
            resetTimer();
        }}
      >
        <div className={` ${styles["how-we-work-section-heading"]}`}>
          <SectionHeader
            className="text-center"
            headerText={"Steps To Create A Perfect Retirement Plan"}
          />
          <div className={`${styles.StepsInvestmentPlanBox}`}>
            <div className={`${styles.StepsInvestmentPlanCard}`}>
              <div className={`${styles.StepsInvestmentPlanCardImg}`}>
              <img  src={process.env.REACT_APP_STATIC_URL + 'media/wp/FPPlan/number-one.svg'} alt="" />
                {/* <img src={One} /> */}
              </div>
              <div className={`${styles.StepsInvestmentPlancontent}`}>
                <div className={`${styles.StepsInvestmentPlancontenttitle}`}>
                  Planning
                </div>
                <div className={`${styles.StepsInvestmentPlanContentText}`}>
                  The first step of retirement planning is identifying the exact
                  age that you wish to retire at, the kind of lifestyle you wish
                  to pursue post your retirement, your life expectancy, and
                  ultimately the amount of retirement corpus you would need to
                  support your retired life.
                </div>
              </div>
            </div>
            <div className={`${styles.StepsInvestmentPlanCard}`}>
              <div className={`${styles.StepsInvestmentPlancontent}`}>
                <div className={`${styles.StepsInvestmentPlancontenttitle}`}>
                  Designing
                </div>
                <div className={`${styles.StepsInvestmentPlanContentText}`}>
                  This step involves identifying the most promising investment
                  options that have the potential to generate the required
                  amount of retirement corpus and creating a realistic
                  investment plan that will help you make the required
                  investments and achieve the goal amount.
                </div>
              </div>
              <div className={`${styles.StepsInvestmentPlanCardImg}`}>
              <img  src={process.env.REACT_APP_STATIC_URL + 'media/wp/FPPlan/number-2.svg'} alt="" />
                {/* <img src={Two} /> */}
              </div>
            </div>
            <div className={`${styles.StepsInvestmentPlanCard}`}>
              <div className={`${styles.StepsInvestmentPlanCardImg}`}>
              <img  src={process.env.REACT_APP_STATIC_URL + 'media/wp/FPPlan/number-3.svg'} alt="" />
                {/* <img src={Three} /> */}
              </div>
              <div className={`${styles.StepsInvestmentPlancontent}`}>
                <div className={`${styles.StepsInvestmentPlancontenttitle}`}>
                  Execution
                </div>
                <div className={`${styles.StepsInvestmentPlanContentText}`}>
                  Assisting you at every step in dedicatedly following the
                  created plan for the required tenure to successfully complete
                  the investment journey and achieve the desired goals.
                </div>
              </div>
            </div>
            <div className={`${styles.StepsInvestmentPlanCard}`}>
              <div className={`${styles.StepsInvestmentPlancontent}`}>
                <div className={`${styles.StepsInvestmentPlancontenttitle}`}>
                  Review
                </div>
                <div className={`${styles.StepsInvestmentPlanContentText}`}>
                  Regularly review the performance of the investments to ensure
                  that they are generating the expected returns, and if
                  required, make the necessary adjustments to bring the plan
                  back on track and generate the required returns.
                </div>
              </div>
              <div className={`${styles.StepsInvestmentPlanCardImg}`}>
              <img  src={process.env.REACT_APP_STATIC_URL + 'media/wp/FPPlan/Four.png'} alt="" />
                {/* <img src={four} /> */}
              </div>
            </div>
            {/* <div className="pb-5 pt-5">
            <div className={`${styles["card-widget-container"]}`}>
              <div className={`${styles["card-widget-item"]} mb-4`}>
                <div className={`${styles["card-widget-item-container"]}`}>
                  <div className={`${styles["card-widget-item-icon"]}`}>
                    <div className={`${styles["icon-container"]}`}>
                      <FaClipboardList />
                    </div>
                  </div>
                  <div className={`${styles["card-widget-item-text-content"]}`}>
                    <div>
                      <span className={`${styles["widget-header-text"]}`}>
                        CREATE YOUR RETIREMENT REQUIREMENT
                      </span>
                      <div
                        className={`${styles["card-widget-item-content"]} ${commonStyles["widget-content-text"]}`}
                      >
                        Decide the age you wish to retire at and the kind of
                        retired life you wish to live.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${styles["card-widget-item"]} mb-4`}>
                <div className={`${styles["card-widget-item-container"]}`}>
                  <div className={`${styles["card-widget-item-icon"]}`}>
                    <div className={`${styles["icon-container"]}`}>
                      <FaCalculator />
                    </div>
                  </div>
                  <div className={`${styles["card-widget-item-text-content"]}`}>
                    <div>
                      <span className={`${styles["widget-header-text"]}`}>
                        ASSESS YOUR CURRENT POSITION
                      </span>
                      <div
                        className={`${styles["card-widget-item-content"]} ${commonStyles["widget-content-text"]}`}
                      >
                        List down your current investments, understand the
                        number of years left for your retirement and let our
                        Retirement Planning Experts perform an in-depth
                        calculation of your current investments using our
                        innovative AI-Powered Tool to identify if your current
                        investments will be enough to achieve your retirement
                        goals or not.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${styles["card-widget-item"]} mb-4`}>
                <div className={`${styles["card-widget-item-container"]}`}>
                  <div className={`${styles["card-widget-item-icon"]}`}>
                    <div className={`${styles["icon-container"]}`}>
                      <BiSearch />
                    </div>
                  </div>
                  <div className={`${styles["card-widget-item-text-content"]}`}>
                    <div>
                      <span className={`${styles["widget-header-text"]}`}>
                        IDENTIFY NEW INVESTMENT AVENUES
                      </span>
                      <div
                        className={`${styles["card-widget-item-content"]} ${commonStyles["widget-content-text"]}`}
                      >
                        Based on the result of the research, our Retirement
                        Experts will identify the additional investment options
                        and create a perfect retirement plan that will
                        successfully help you to get the returns, required to
                        achieve your retirement goals. Going beyond just
                        retirement planning our analysis also gives you
                        effective tax planning and investment planning
                        recommendations that give you a 360 degrees financial
                        plan and complete peace of mind.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${styles["card-widget-item"]} mb-4`}>
                <div className={`${styles["card-widget-item-container"]}`}>
                  <div className={`${styles["card-widget-item-icon"]}`}>
                    <div className={`${styles["icon-container"]}`}>
                      <FaPaperPlane />
                    </div>
                  </div>
                  <div className={`${styles["card-widget-item-text-content"]}`}>
                    <div>
                      <span className={`${styles["widget-header-text"]}`}>
                        PUT THE PLAN INTO ACTION
                      </span>
                      <div
                        className={`${styles["card-widget-item-content"]} ${commonStyles["widget-content-text"]}`}
                      >
                        As the first step to making any plan successful is
                        implementation, our experts will help you to put the
                        plan into action and make the required investments.
                        Going further, they will also actively manage the
                        investments until you reach your desired goals.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          </div>
        </div>
      </section>
    </>
  );
}

export default HowWeWorkSection;
