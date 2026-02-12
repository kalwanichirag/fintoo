import style from "./style.module.css";
import ICICI from "../../Assets/Images/CommonDashboard/ICICIBank.png";
import HDFC from "../../Assets/Images/CommonDashboard/hdfc.png";
import TATA from "../../Assets/Images/CommonDashboard/tata-icon.png";
import TopPickItem from "./Item";
import Slider from "react-slick";
import Style from "./style.module.css";

const TopPicks = (props) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    arrows: false,
    dotsClass: "slick-dots top-picks-slick-dots",
    responsive: [
      {
        breakpoint: 600,
        settings: {
            slidesToShow: 2,
            slidesToScroll: 2
        }
      }
    ]
  };

  const items = props.data.length > 0 ? props.data.map((i)=> ({scheme_name: i.scheme_name, nav: i.nav, return_3yr: i.return_year3, amc_code: i.amc_code, slug: i.scheme_slug})) : [{scheme_name: "ICICI Prudential Commodities Growth", nav: "445", return_3yr: "2.25 %", amc: ICICI, slug: "icici-prudential-commodities-fund-direct-growth"}];

  return (
    <div className={Style.MFListItems}>
      <Slider {...settings}>
        {items.map((v)=> <TopPickItem data={v} />)}
      </Slider>
    </div>
  );
};
export default TopPicks;
