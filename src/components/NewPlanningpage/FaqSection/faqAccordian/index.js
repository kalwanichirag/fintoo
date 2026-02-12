import { useState } from "react";
import FaqAccordianContent from "./FaqAccordionContent";;
import style from "./style.module.css";

const Plus = () => {
  return (
    <svg width="60" height="60" viewBox="0 0 81 81" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40.3285" cy="40.5785" r="39.6957" fill="#F7F7F7" />
      <path d="M49.0599 40.5807H31.5938M40.3268 49.3138L40.3268 31.8477" stroke="#786F77" stroke-width="1.58783" stroke-linecap="round" />
    </svg>

  )
}

const Minus = () => {
  return (
    <svg width="60" height="60" viewBox="0 0 81 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40.3285" cy="39.7543" r="39.6957" fill="#004FBF" />
      <path d="M49.0598 30.9805L31.6299 48.4827M49.096 48.4465L31.5938 31.0166" stroke="white" stroke-width="1.58783" stroke-linecap="round" />
    </svg>


  )
}

function FaqAccordian() {
  const [activeIndex, SetActiveIndex] = useState(null);

  const updateAccordionIndex = (idx) => {
    if (activeIndex === idx) {
      return SetActiveIndex(() => null);
    } else {
      return SetActiveIndex(() => idx);
    }
  };

  const isActive = (idx) => activeIndex === idx;

  return (
    <>
      <div className={style["accordian-item-container"]}>
        <div className={style["accordian-item"]}>
          <div
            className={`${style["accordian-header"]} `}
            onClick={() => updateAccordionIndex(0)}
            style={isActive(0) ? { color: "#042b62" } : { color: "black" }}
          >
            {" "}
            <span>
              What is a Certified Financial Advisor?
            </span>{" "}
            {isActive(0) ? <Minus /> : <Plus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(0)}>
            <div>
              <p className="m-0">
                A Certified Financial Advisor (CFA) is a financial professional who has achieved the highest level of expertise and credentialing in the field. CFAs are rigorously trained and have passed a series of exams administered by the CFA Institute, covering areas such as investment management, ethics, and economics. They are trusted experts in finance who provide clients with comprehensive financial planning, investment advice, and strategies to achieve their financial goals. The CFA designation signifies a commitment to excellence, ethics, and a deep understanding of the intricacies of financial markets, making CFA invaluable guides for individuals and organizations seeking financial success.
              </p>
            </div>
          </FaqAccordianContent>
        </div>
        <div className={style["accordian-item"]}>
          <div
            className={`${style["accordian-header"]}`}
            onClick={() => updateAccordionIndex(2)}
            style={isActive(2) ? { color: "#042b62" } : { color: "black" }}
          >
            <span>What is the Role of a Financial Advisor?</span>{" "}
            {isActive(2) ? <Minus /> : <Plus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(2)}>
            <div>
              <p className="m-0">
                The role of a financial advisor is to guide clients in managing their finances effectively. This includes creating personalized financial plans, managing investments, planning for retirement, optimizing tax strategies, and ensuring adequate risk management through insurance. Advisors also provide education, monitor progress, and adapt strategies to meet changing goals and circumstances, ensuring clients achieve financial stability and long-term success.
              </p>
            </div>
          </FaqAccordianContent>
        </div>
        <div className={style["accordian-item"]}>
          <div
            className={`${style["accordian-header"]}`}
            onClick={() => updateAccordionIndex(3)}
            style={isActive(3) ? { color: "#042b62" } : { color: "black" }}
          >
            <span>
              What Exactly Does a Financial Advisor Do?
            </span>{" "}
            {isActive(3) ? <Minus /> : <Plus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(3)}>
            <div>
              <p className="m-0">
                A financial advisor helps clients decide how to manage their money. They assess their client’s economic health and determine their long- and short-term goals before making recommendations to meet them. Financial advisors help invest their clients’ money in the stock market and other investments, recommend products like life insurance, or offer assistance with tax planning. Financial advisors may also educate their clients about their financial health and habits that can help them build their wealth. In addition to working directly with clients, financial advisors spend time marketing their services. Many financial advisors may spend considerable time establishing and building client relationships.
              </p>
            </div>
          </FaqAccordianContent>
        </div>
        <div className={style["accordian-item"]}>
          <div
            className={`${style["accordian-header"]}`}
            onClick={() => updateAccordionIndex(4)}
            style={isActive(4) ? { color: "#042b62" } : { color: "black" }}
          >
            <span>Which is Better, CFA or CFP?</span>{" "}
            {isActive(4) ? <Minus /> : <Plus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(4)}>
            <div>
              <p className="m-0">
                A CFA is a financial professional who has passed a series of exams administered by the CFA Institute. They are often employed by investment management companies and analyze companies' growth, profitability, and creditworthiness. CFAs also provide personal financial planning and wealth management services.
              </p>
              <p className="m-0">
                A CFP is a financial advisor who typically works with individual clients. They are known for their trustworthiness and follow a strict code of ethics. CFPs offer a range of financial management services, such as retirement planning, tax planning, and risk management.

              </p>
            </div>
          </FaqAccordianContent>
        </div>
        <div className={style["accordian-item"]}>
          <div
            className={`${style["accordian-header"]}`}
            onClick={() => updateAccordionIndex(5)}
            style={isActive(5) ? { color: "#042b62" } : { color: "black" }}
          >
            <span>How to Become a SEBI Certified Financial Advisor?</span>{" "}
            {isActive(5) ? <Minus /> : <Plus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(5)}>
            <div>
              <p className="m-0">
                To become a SEBI-certified financial advisor, meet the eligibility criteria, which include a postgraduate degree in finance-related fields, CFA, or NISM certifications, and 2-5 years of relevant experience. Ensure a minimum net worth of ₹5 lakhs (individuals) or ₹50 lakhs (non-individuals). Set up adequate infrastructure, including office space and research tools. Obtain BASL approval and then apply to SEBI with the required documents and a non-refundable ₹2000 application fee. Once approved, adhere to SEBI guidelines for compliance and certification renewal.

              </p>
            </div>
          </FaqAccordianContent>
        </div>
        <div className={style["accordian-item"]}>
          <div
            className={`${style["accordian-header"]}`}
            onClick={() => updateAccordionIndex(6)}
            style={isActive(6) ? { color: "#042b62" } : { color: "black" }}
          >
            <span>Is it Good to Be a Financial Advisor?</span>{" "}
            {isActive(6) ? <Minus /> : <Plus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(6)}>
            <div>
              <p className="m-0">
                Becoming a financial advisor can be a rewarding career if you enjoy assisting people with their financial goals, have a knack for understanding complex financial concepts, and are dedicated to building strong client relationships. However, the profession is highly competitive, demands continuous learning to keep up with regulations, and can be stressful, making it a better fit for those who thrive under pressure and have a passion for personal finance.

              </p>
            </div>
          </FaqAccordianContent>
        </div>
        <div className={style["accordian-item"]}>
          <div
            className={`${style["accordian-header"]}`}
            onClick={() => updateAccordionIndex(7)}
            style={isActive(7) ? { color: "#042b62" } : { color: "black" }}
          >
            <span>How Do Financial Consultants Earn?</span>{" "}
            {isActive(7) ? <Minus /> : <Plus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(7)}>
            <div>
              <p className="m-0">
                Financial consultants earn through a combination of client fees, commissions, and salaries. Client fees can be charged hourly, as a fixed amount, or as a percentage of assets under management. Commissions come from transactions like selling insurance products or trading securities. Additionally, some consultants working for firms receive traditional salaries. The exact payment structure varies by firm, as there is no universal approach to how financial consultants are compensated.
              </p>
            </div>
          </FaqAccordianContent>
        </div>
        <div className={style["accordian-item"]}>
          <div
            className={`${style["accordian-header"]}`}
            onClick={() => updateAccordionIndex(8)}
            style={isActive(8) ? { color: "#042b62" } : { color: "black" }}
          >
            <span>What is a Personal Financial Planner?</span>{" "}
            {isActive(8) ? <Minus /> : <Plus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(8)}>
            <div>
              <p className="m-0">
                A personal financial planner is someone who helps you manage your money and reach your long-term goals, like saving for retirement or funding your kids' education. They advise on investments, taxes, and budgeting, and may specialize in areas like retirement planning or estate planning. Some planners work with specific groups, such as young professionals or retirees, to tailor their advice to your needs.
              </p>
            </div>
          </FaqAccordianContent>
        </div>
        <div className={style["accordian-item"]}>
          <div
            className={`${style["accordian-header"]}`}
            onClick={() => updateAccordionIndex(9)}
            style={isActive(9) ? { color: "#042b62" } : { color: "black" }}
          >
            <span>What is a Certified Financial Planner for a Business?</span>{" "}
            {isActive(9) ? <Minus /> : <Plus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(9)}>
            <div>
              <p className="m-0">
                A Certified Financial Planner (CFP) for a business is a professional who holds the CFP designation from the CFP Board of Standards. This designation signifies that the individual has comprehensive expertise and experience in financial planning, allowing them to provide businesses with specialized guidance on managing their finances, investments, and long-term financial strategies.

              </p>
            </div>
          </FaqAccordianContent>
        </div>
        <div className={style["accordian-item"]}>
          <div
            className={`${style["accordian-header"]}`}
            onClick={() => updateAccordionIndex(10)}
            style={isActive(10) ? { color: "#042b62" } : { color: "black" }}
          >
            <span>What is a Virtual Financial Advisor?</span>{" "}
            {isActive(10) ? <Minus /> : <Plus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(10)}>
            <div>
              <p className="m-0">
                A virtual financial advisor is an expert who offers personalized financial guidance remotely, leveraging digital tools and technology. They provide live advice on planning and investing, using communication methods such as videoconferencing and co-browsing. These advisors often utilize digital platforms to streamline the advisory process.
              </p>
            </div>
          </FaqAccordianContent>
        </div>
        <div className={style["accordian-item"]}>
          <div
            className={`${style["accordian-header"]}`}
            onClick={() => updateAccordionIndex(11)}
            style={isActive(11) ? { color: "#042b62" } : { color: "black" }}
          >
            <span>What Does a Digital Financial Planner Do?</span>{" "}
            {isActive(11) ? <Minus /> : <Plus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(11)}>
            <div>
              <p className="m-0">
                A digital financial planner is perfect for staying organized and taking control of your money. It helps you track expenses, set budgets, plan for future goals, and make smarter investment decisions, all through convenient online tools. With real-time insights and personalized advice, it empowers you to make informed financial decisions and stay on top of your financial journey

              </p>
            </div>
          </FaqAccordianContent>
        </div>
        <div className={style["accordian-item"]}>
          <div
            className={`${style["accordian-header"]}`}
            onClick={() => updateAccordionIndex(12)}
            style={isActive(12) ? { color: "#042b62" } : { color: "black" }}
          >
            <span>Is There an AI Financial Advisor?</span>{" "}
            {isActive(12) ? <Minus /> : <Plus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(12)}>
            <div>
              <p className="m-0">
                Yes, there are AI financial advisors, commonly known as robo-advisors, that use artificial intelligence (AI) to provide financial advice. These automated platforms analyze your financial data and goals, offering personalized investment strategies, portfolio management, and financial planning advice.
              </p>
            </div>
          </FaqAccordianContent>
        </div>
        <div className={style["accordian-item"]}>
          <div
            className={`${style["accordian-header"]}`}
            onClick={() => updateAccordionIndex(13)}
            style={isActive(13) ? { color: "#042b62" } : { color: "black" }}
          >
            <span>How Much Does a Certified Financial Planner Cost in India?</span>{" "}
            {isActive(13) ? <Minus /> : <Plus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(13)}>
            <div>
              <p className="m-0">
                The cost of becoming a Certified Financial Planner (CFP) in India typically ranges from INR 1.5 to 2 lakhs. Annual charges for CFP services can vary between INR 6,000 and INR 40,000, depending on the advisor. These professionals assist with investment planning, risk management, asset management, and tax planning.

              </p>
            </div>
          </FaqAccordianContent>
        </div>
        <div className={style["accordian-item"]}>
          <div
            className={`${style["accordian-header"]}`}
            onClick={() => updateAccordionIndex(14)}
            style={isActive(14) ? { color: "#042b62" } : { color: "black" }}
          >
            <span>Who Needs Financial Planning?</span>{" "}
            {isActive(14) ? <Minus /> : <Plus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(14)}>
            <div>
              <p className="m-0">
                Financial planning is beneficial for everyone a must regardless of age or financial situation. Major life events like graduating college, getting married, expanding your family, or starting a business often prompt the need to reassess finances. A financial advisor can guide you through these changes, helping you stay on track with your goals.
              </p>
            </div>
          </FaqAccordianContent>
        </div>
        <div className={style["accordian-item"]}>
          <div
            className={`${style["accordian-header"]}`}
            onClick={() => updateAccordionIndex(15)}
            style={isActive(15) ? { color: "#042b62" } : { color: "black" }}
          >
            <span>What Does a Digital Financial Planner Do?</span>{" "}
            {isActive(15) ? <Minus /> : <Plus />}{" "}
          </div>
          <FaqAccordianContent activeIndex={isActive(15)}>
            <div>
              <p className="m-0">
              To become a financial planner, you typically need a bachelor's degree in a relevant field, such as finance, business, accounting, economics, or law, from an accredited institution. Additionally, obtaining a certification like the Certified Financial Planner (CFP) from FPSB India, which is globally recognized, is essential. You must also pass a financial planning exam to meet professional standards. Key skills that benefit financial planners include strong analytical and research abilities, attention to detail, and mathematical proficiency, which are crucial for developing effective financial strategies and staying updated on trends.
              </p>
            </div>
          </FaqAccordianContent>
        </div>
        
      </div>
    </>
  );
}

export default FaqAccordian;
