import styles from "./style.module.css";
import commonStyles from "../../../Layout/Fullpage/style.module.css";
import SectionHeader from "../../../SectionHeader";
import { FaFileContract, FaUsers } from "react-icons/fa";
import {HiOutlineDocumentText} from "react-icons/hi"
import { AiOutlineFileSearch } from "react-icons/ai";
import {BsFillCalendarCheckFill} from 'react-icons/bs'
import {TbUserSearch} from 'react-icons/tb'
function OurProcess() {
  return (
    <div style={{ backgroundColor: "#E6EAEF" }}>
      <section
        className={`${styles["Our_Process"]} ${commonStyles["padding-class"]}`}
      >
        <SectionHeader headerText={"Our Process"} />
      </section>
      <div className="pb-5 pt-5">
        <div className={`${styles["card-widget-container"]}`}>
          <div className={`${styles["card-widget-item"]} mb-4`}>
            <div className={`${styles["card-widget-item-container"]}`}>
              <div className={`${styles["card-widget-item-icon"]}`}>
                <div className={`${styles["icon-container"]}`}>
                  <HiOutlineDocumentText />
                </div>
              </div>
              <div className={`${styles["card-widget-item-text-content"]}`}>
                <div>
                  <span className={`${commonStyles["widget-header-text"]}`}>
                    Share the notice copy and supporting documents
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles["card-widget-item"]} mb-4`}>
            <div className={`${styles["card-widget-item-container"]}`}>
              <div className={`${styles["card-widget-item-icon"]}`}>
                <div className={`${styles["icon-container"]}`}>
                  <FaFileContract />
                </div>
              </div>
              <div className={`${styles["card-widget-item-text-content"]}`}>
                <div>
                  <span className={`${commonStyles["widget-header-text"]}`}>
                    Recommend and finalise the plan of action
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles["card-widget-item"]} mb-4`}>
            <div className={`${styles["card-widget-item-container"]}`}>
              <div className={`${styles["card-widget-item-icon"]}`}>
                <div className={`${styles["icon-container"]}`}>
                  <AiOutlineFileSearch />
                </div>
              </div>
              <div className={`${styles["card-widget-item-text-content"]}`}>
                <div>
                  <span className={`${commonStyles["widget-header-text"]}`}>
                    Analyse the notice, documents
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles["card-widget-item"]} mb-4`}>
            <div className={`${styles["card-widget-item-container"]}`}>
              <div className={`${styles["card-widget-item-icon"]}`}>
                <div className={`${styles["icon-container"]}`}>
                  <BsFillCalendarCheckFill />
                </div>
              </div>
              <div className={`${styles["card-widget-item-text-content"]}`}>
                <div>
                  <span className={`${commonStyles["widget-header-text"]}`}>
                    Execute the plan
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles["card-widget-item"]} mb-4`}>
            <div className={`${styles["card-widget-item-container"]}`}>
              <div className={`${styles["card-widget-item-icon"]}`}>
                <div className={`${styles["icon-container"]}`}>
                  <TbUserSearch />
                </div>
              </div>
              <div className={`${styles["card-widget-item-text-content"]}`}>
                <div>
                  <span className={`${commonStyles["widget-header-text"]}`}>
                    Identify the exact reason for the issue of the notice
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles["card-widget-item"]} mb-4`}>
            <div className={`${styles["card-widget-item-container"]}`}>
              <div className={`${styles["card-widget-item-icon"]}`}>
                <div className={`${styles["icon-container"]}`}>
                  <FaUsers />
                </div>
              </div>
              <div className={`${styles["card-widget-item-text-content"]}`}>
                <div>
                  <span className={`${commonStyles["widget-header-text"]}`}>
                    Follow-up until the issue is resolved
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OurProcess;
