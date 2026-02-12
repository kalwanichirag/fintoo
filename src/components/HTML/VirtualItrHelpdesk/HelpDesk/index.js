import styles from "./style.module.css";
import SectionHeader from "../../../SectionHeader";
import { TbUsers } from "react-icons/tb";
import {CiCalculator1} from 'react-icons/ci';
import {AiOutlineUser} from 'react-icons/ai';
import {BiMessageDetail} from 'react-icons/bi';
import {FiClipboard} from 'react-icons/fi';
import {TfiEmail} from 'react-icons/tfi';
const HelpDesk = () => {
  return (
    <section className={`${styles.TaxITRSection}`}>
      <SectionHeader
        className="text-center"
        headerText={
          "Why Use Our Virtual Help Desk To Resolve Your Tax And ITR Queries?"
        }
      />
      <div className={`mt-5 ${styles.ITRQueries}`}>
        <div className={`${styles.ITRQueriesBox}`}>
          <div className={`${styles.ImgBox}`}>
            <TbUsers />
          </div>
          <div className={`${styles.TextBox}`}>
            <div className={`${styles.SectionTitle}`}>
              REAL HUMAN, REAL EXPERTS
            </div>
            <div className={`${styles.SectionText}`}>
              Your queries will be addressed by real experts over the live chat.
            </div>
          </div>
        </div>
        <div className={`${styles.ITRQueriesBox}`}>
          <div className={`${styles.ImgBox}`}>
            <CiCalculator1 />
          </div>
          <div className={`${styles.TextBox}`}>
            <div className={`${styles.SectionTitle}`}>TAX CALCULATIONS</div>
            <div className={`${styles.SectionText}`}>
              Use our updated and reliable, online income tax calculator to
              calculate your tax amount.
            </div>
          </div>
        </div>
        <div className={`${styles.ITRQueriesBox}`}>
          <div className={`${styles.ImgBox}`}>
            <AiOutlineUser />
          </div>
          <div className={`${styles.TextBox}`}>
            <div className={`${styles.SectionTitle}`}>EXPERIENCED EXPERTS </div>
            <div className={`${styles.SectionText}`}>
              All our experts are professionally qualified and they possess the
              required experience in Tax and ITR to answer your questions and
              solve your doubts.
            </div>
          </div>
        </div>
        <div className={`${styles.ITRQueriesBox}`}>
          <div className={`${styles.ImgBox}`}>
            <BiMessageDetail />
          </div>
          <div className={`${styles.TextBox}`}>
            <div className={`${styles.SectionTitle}`}>
              WHO ALL CAN BENEFIT FROM THIS CHAT{" "}
            </div>
            <div className={`${styles.SectionText}`}>
              All individuals, entrepreneurs, businesses and companies from all
              income tax slabs and having all kinds of incomes can use our
              complimentary chat to get their queries addressed by the experts.
            </div>
          </div>
        </div>
        <div className={`mt-md-4 ${styles.ITRQueriesBox}`}>
          <div className={`${styles.ImgBox}`}>
            <FiClipboard />
          </div>
          <div className={`${styles.TextBox}`}>
            <div className={`${styles.SectionTitle}`}>
              STEP-BY-STEP GUIDANCE
            </div>
            <div className={`${styles.SectionText}`}>
              Whether your query is related to Tax or ITR, our expert will give
              you a legitimate and simplified solution. If required, the expert
              will also help you with step-by-step instructions to complete your
              tasks.
            </div>
          </div>
        </div>
        <div className={`mt-md-4 ${styles.ITRQueriesBox}`}>
          <div className={`${styles.ImgBox}`}>
            <TfiEmail />
          </div>
          <div className={`${styles.TextBox}`}>
            <div className={`${styles.SectionTitle}`}>
              IS THIS CHAT COMPLIMENTARY
            </div>
            <div className={`${styles.SectionText}`}>
              Yes, we at Fintoo are always happy to help people and clear all
              their doubts or queries related to Tax and ITR.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default HelpDesk;
