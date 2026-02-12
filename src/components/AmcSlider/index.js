import Slider from "react-slick";
import SliderItem from "./Item";
import Style from './style.module.css';
import ICICI from "../../Assets/Images/CommonDashboard/ICICIBank.png";
import HDFC from "../../Assets/Images/CommonDashboard/hdfc.png";
import TATA from "../../Assets/Images/CommonDashboard/tata-icon.png";

const AmcSlider = (props) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    arrows: false,
    dotsClass: "slick-dots categories-slick-dots",
    responsive: [
      {
        breakpoint: 600,
        settings: {
            slidesToShow: 1,
            slidesToScroll: 1
        }
      }
    ]
  };
  
  const items = props.data.length > 0 ? props.data.map((i)=> ({image:i.amc_code,title:i.amc_name})) : [{image: ICICI, title: 'ICICI Prudential'},
  {image: HDFC, title: 'HDFC'},
  {image: TATA, title: 'TATA'},
  {image: ICICI, title: 'ICIC Prudential'},];

  return (
    <div className={Style.sliderBox}>
      <Slider {...settings}>
        {items.map((v)=> <SliderItem data={v} />)}
      </Slider>
    </div>
  );
};
export default AmcSlider;
