import styles from "./style.module.css";
import commonStyles from "../../../Layout/Fullpage/style.module.css";
import SectionHeader from "../../../SectionHeader";
import { CiUser } from "react-icons/ci";
import { AiOutlinePieChart } from "react-icons/ai";
import {BsSafe2} from "react-icons/bs"
function HowWeWorkSection() {
  return (
    <>
      <section
        className={`${styles["how-we-work-section"]} ${commonStyles["padding-class"]} pb-5 pt-md-5`}
      >
        <div className={` ${styles["how-we-work-section-heading"]}`}>
          <SectionHeader
            className="text-center"
            headerText={"Steps For Financial Planning"}
          />
          <div className="pb-5 pt-5">
            <div className={`${styles["card-widget-container"]}`}>
              <div className={`${styles["card-widget-item"]} mb-4`}>
                <div className={`${styles["card-widget-item-container"]}`}>
                  <div className={`${styles["card-widget-item-icon"]}`}>
                    <div className={`${styles["icon-container"]}`}>
                      <CiUser />
                    </div>
                  </div>
                  <div className={`${styles["card-widget-item-text-content"]}`}>
                    <div>
                      <span className={`${commonStyles["widget-header-text"]}`}>
                        GETTING TO KNOW YOU
                      </span>
                      <div
                        className={`${styles["card-widget-item-content"]} ${commonStyles["widget-content-text"]}`}
                      >
                        As investment is an extremely personal subject, we start
                        the financial planning process by getting to know you,
                        your needs, your goals, your existing assets and
                        liabilities along with all other minute details that
                        play an important role in financial planning.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${styles["card-widget-item"]} mb-4`}>
                <div className={`${styles["card-widget-item-container"]}`}>
                  <div className={`${styles["card-widget-item-icon"]}`}>
                    <div className={`${styles["icon-container"]}`}>
                      {/* <TbSearch /> */}
                      <BsSafe2 />
                    </div>
                  </div>
                  <div className={`${styles["card-widget-item-text-content"]}`}>
                    <div>
                      <span className={`${commonStyles["widget-header-text"]}`}>
                        ANALYSING AND IDENTIFYING THE RIGHT INVESTMENT AVENUES
                      </span>
                      <div
                        className={`${styles["card-widget-item-content"]} ${commonStyles["widget-content-text"]}`}
                      >
                        As performing an in-depth analysis of all the possible
                        investment avenues involves several technicalities, we
                        ensure that we combine our experience, expertise and
                        exclusively developed AI-driven Robo Advisor to identify
                        the ones that have the potential to achieve your
                        financial goals. Going beyond just financial planning
                        our analysis also gives you effective retirement
                        planning and tax planning recommendations that give you
                        a 360 degrees financial solution and complete peace of
                        mind.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${styles["card-widget-item"]} mb-4`}>
                <div className={`${styles["card-widget-item-container"]}`}>
                  <div className={`${styles["card-widget-item-icon"]}`}>
                    <div className={`${styles["icon-container"]}`}>
                      <AiOutlinePieChart />
                    </div>
                  </div>
                  <div className={`${styles["card-widget-item-text-content"]}`}>
                    <div>
                      <span className={`${commonStyles["widget-header-text"]}`}>
                        RECOMMENDING THE RIGHT PLAN OF ACTION
                      </span>
                      <div
                        className={`${styles["card-widget-item-content"]} ${commonStyles["widget-content-text"]}`}
                      >
                        As the action is the final step of every plan, we not
                        only recommend the right investment avenues that will
                        enable you to achieve your goals, but also assist you in
                        investing in them. Moreover, we also go the extra mile
                        and take care of the performance management activities
                        like portfolio analysis and balancing in order to ensure
                        that the plan succeeds and you achieve your financial
                        goals.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HowWeWorkSection;
