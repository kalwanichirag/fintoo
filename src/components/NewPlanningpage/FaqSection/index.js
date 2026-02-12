import styles from "./style.module.css";
import FaqAccordian from "./faqAccordian";
import Book_consultation from "../Book_consultation";

function FaqSection() {
  return (
    <>
      <section className={`${styles["faq-section"]} py-5`}>
        <div className="container">
          <div
            className={`text-capitalize ${styles["section-title"]}`}
          >
            Frequently asked questions
          </div>

          <div className={`${styles.bottomTxt}`}>We're happy to answer your questions</div>
          <p style={{ height: "3rem" }}></p>
          <FaqAccordian />
          <p style={{ height: "4rem" }}></p>
        </div>
      </section>
    </>
  );
}

export default FaqSection;
