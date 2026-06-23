import Slider from 'react-slick';
import { mistakes } from '../data';
import Icon from '../shared/Icon';
import SectionHeader from '../shared/SectionHeader';

const mobileSliderSettings = {
  arrows: false,
  dots: true,
  infinite: true,
  speed: 450,
  slidesToShow: 1,
  slidesToScroll: 1,
};

export default function MistakesSection() {
  const renderCards = () => mistakes.map(([title, copy]) => (
    <article className="mistake-card fade-up" key={title}>
      <div className="mistake-stamp"><span className="tw-text-[0.85rem]"><Icon name="x" /></span><span className="tw-text-[0.65rem]">Error Detected</span></div>
      <h4 className="tw-text-[0.95rem]">{title}</h4>
      <p className="tw-text-[0.8rem]">{copy}</p>
    </article>
  ));

  return (
    <section className="mistakes-section">
      <div className="container">
        <SectionHeader className="mistakes-header" label="The Hidden Risk" title="Why Most Taxpayers Make Costly Mistakes" />
        <div className="mistakes-grid">
          {renderCards()}
        </div>
        <Slider className="mobile-card-slider mistakes-mobile-slider" {...mobileSliderSettings}>
          {renderCards()}
        </Slider>
        <div className="mistakes-transition fade-up">
          <p className="tw-text-[1.3rem]">"Your tax return is more than a form. It's a financial declaration."</p>
          <small className="tw-text-[0.88rem]">One mistake can lead to notices, penalties, or excess tax payments. Do not leave it to software.</small>
        </div>
      </div>
    </section>
  );
}
