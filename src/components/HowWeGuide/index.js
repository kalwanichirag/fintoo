import styles from "./style.module.css";
import {FiTarget} from 'react-icons/fi';
import {HiUser} from 'react-icons/hi';
import {IoIosCheckmarkCircleOutline} from 'react-icons/io';
import {AiOutlineFileSearch} from 'react-icons/ai'
const HowWeGuide = () => {
  return (
    <>
      <section>
        <div className={`container ${styles.container}`}>
          <h2 className={`${styles["h2"]} text-center`}>
            How We Guide You Through The Journey To Financial Freedom?
          </h2>
          <div className="row">
            <div className={`col-md-6 col-12 ${styles.cardBox}`}>
              <div className={` ${styles.iconBox}`}>
                <HiUser />
              </div>
              <div className="text-center">
                <h3 className={`${styles.Text}`}>DEDICATED ACCOUNT MANAGER</h3>
                <p className={`${styles.TextData}`}>
                  You are given a dedicated financial advisor who will
                  personally guide you at every step of the journey to achieve
                  your financial goals.
                </p>
              </div>
            </div>
            <div className={`col-md-6 col-12 ${styles.cardBox}`}>
              <div className={` ${styles.iconBox}`}>
                <FiTarget />
              </div>
              <div className="text-center">
                <h3 className={`${styles.Text}`}>ENVISION YOUR GOALS</h3>
                <p className={`${styles.TextData}`}>
                Using a carefully developed funneling method, we help you identify your ideal goals and set them in the right order according to their priority levels.
                </p>
              </div>
            </div>
            <div className={`col-md-6 col-12 ${styles.cardBox}`}>
              <div className={` ${styles.iconBox}`}>
                <IoIosCheckmarkCircleOutline />
              </div>
              <div className="text-center">
                <h3 className={`${styles.Text}`}>EVALUATE YOUR FINANCES</h3>
                <p className={`${styles.TextData}`}>
                In order to create an effective financial plan for the future, we start with analyzing your current financial position and also make logical assumptions about the future.
                </p>
              </div>
            </div>
            <div className={`col-md-6 col-12 ${styles.cardBox}`}>
              <div className={` ${styles.iconBox}`}>
                <AiOutlineFileSearch />
              </div>
              <div className="text-center">
                <h3 className={`${styles.Text}`}>MAKE A ROADMAP</h3>
                <p className={`${styles.TextData}`}>
                Combining the learnings from the analysis, we prepare a completely personalized step-by-step financial plan that will form a bridge between your current financial position and your dream financial destination.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default HowWeGuide;
