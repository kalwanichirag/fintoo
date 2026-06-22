import { useState } from 'react';
import { faqs } from '../data';
import SectionHeader from '../shared/SectionHeader';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const leftFaqs = faqs.filter((_, index) => index % 2 === 0);
  const rightFaqs = faqs.filter((_, index) => index % 2 === 1);

  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <SectionHeader className="faq-header" label="Common Questions" title="Frequently Asked" />
        <div className="faq-grid">
          {[leftFaqs, rightFaqs].map((column, columnIndex) => (
            <div className="faq-column" key={columnIndex === 0 ? 'left-faqs' : 'right-faqs'}>
              {column.map(([question, answer]) => {
                const index = faqs.findIndex(([faqQuestion]) => faqQuestion === question);
                const isOpen = openIndex === index;

                return (
                  <div className={`faq-item${isOpen ? ' open' : ''}`} key={question}>
                    <button
                      type="button"
                      className="faq-q tw-text-sm"
                      aria-expanded={isOpen}
                      onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    >
                      {question}
                      <span className="faq-icon tw-text-sm">+</span>
                    </button>
                    <div className="faq-a">
                      <div className="faq-a-inner tw-text-sm">{answer}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
