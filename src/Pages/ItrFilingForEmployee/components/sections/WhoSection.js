import Slider from 'react-slick';
import { audienceCards } from '../data';
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

export default function WhoSection() {
  const renderCards = () => audienceCards.map(([icon, title, copy]) => (
    <article className="who-card fade-up" key={title}>
      <span className="who-icon tw-text-[2rem]"><Icon name={icon} /></span>
      <h3 className="tw-text-[1.05rem]">{title}</h3>
      <p className="tw-text-[0.83rem]">{copy}</p>
    </article>
  ));

  return (
    <section className="who-section">
      <div className="container">
        <SectionHeader className="who-header" label="Who It's For" title="Built For Complex Tax Situations" />
        <div className="who-grid">
          {renderCards()}
        </div>
        <Slider className="mobile-card-slider who-mobile-slider" {...mobileSliderSettings}>
          {renderCards()}
        </Slider>
      </div>
    </section>
  );
}
