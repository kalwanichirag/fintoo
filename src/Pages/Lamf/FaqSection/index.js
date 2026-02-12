import styles from "./style.module.css";
import pageStyle from "../style.module.css";
import FaqAccordian from "./faqAccordian";

function FaqSection() {
  return (
    <>
      <section className={`${styles["faq-section"]} py-5`}>
        <div className="container">
          <p
            className={`m-0 mb-5 text-capitalize ${pageStyle["section-title"]}`}
          >
            Freequently asked Questions
          </p>
          <FaqAccordian />
        </div>
      </section>
    </>
  );
}

export default FaqSection;
