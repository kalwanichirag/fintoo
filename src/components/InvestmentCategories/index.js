import Slider from "react-slick";
import InvestmentCategoriesItem from "./Item";
import Style from "./style.module.css";
import AMZ from './images/amz.png';
import LargeCapImage from './images/01_LargeCap2.png';
import MidCapImage from './images/02_Midcap2.png';
import SmallCapImage from './images/03_SmallCap2.png';
import FDBondsImage from './images/04_FDBonds2.png';
import NFOImage from './images/05_NFO2.png';
import BankingFinanceImage from './images/01BankingFinance.png';
import PharmaImage from './images/02Pharma.png';
import DefenseImage from './images/03_Defense.png';
import SoftwareServicesImage from './images/04SoftwareServices.svg';
import RealtyImage from './images/05Realty1.png';
import IndexImage from './images/Index-Funds.png';
import BankingPSUImage from './images/Banking-PSU.png';
import CorporateBondsImage from './images/Corporate-Bonds.png';
import MoneyMarketImage from './images/Money-Market.png';
import FofImage from './images/FOF.png';
import ArbitrageFundsImage from './images/Arbitrage-Funds.png';

import { useSelector } from "react-redux";

const InvestmentCategories = () => {
  const rdxSelectedTab = useSelector((state)=> state.investDashboardTabActiveTab);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    arrows: false,
    dotsClass: "slick-dots categories-slick-dots",
    responsive: [
      {
        breakpoint: 600,
        settings: {
            slidesToShow: 3,
            slidesToScroll: 3
        }
      }
    ]
  };
  const cats = [
    [
      { title: "Large Cap", param: 'large_cap', image: LargeCapImage },
      { title: "Mid cap", param: 'mid_cap', image: MidCapImage },
      { title: "Small Cap", param: 'small_cap', image: SmallCapImage },
      { title: "Index Funds", param: 'index_funds', image: IndexImage },
      { title: "NFO", param: 'nfo', image: NFOImage },
      { title: "Banking & PSU", param: 'banking_psu', image: BankingPSUImage },
      { title: "Money Market", param: 'money_market', image: MoneyMarketImage },
      { title: "Corporate Bond", param: 'corporate_bond', image: CorporateBondsImage },
      { title: "FoF(Fund of Funds)", param: 'fund_of_funds', image: FofImage },
      { title: "Arbitrage Fund", param: 'arbitrage_fund', image: ArbitrageFundsImage },
    ],
    [
      { title: "Banking & Finance", param: 'banking', image: BankingFinanceImage },
      { title: "Pharma", param: 'pharma', image: PharmaImage },
      { title: "Defence", param: 'large_cap', image: DefenseImage },
      { title: "Software & Services", param: 'software', image: SoftwareServicesImage },
      { title: "Realty", param: 'realty', image: RealtyImage },
    ]
  ];
  return (
    <div className={Style.sliderBox}>
      <Slider {...settings} key={'tb-' + rdxSelectedTab}>
        {cats[Number(rdxSelectedTab === 'stocks')].map((v)=> <InvestmentCategoriesItem data={v} />)}
      </Slider>
    </div>
  );
};
export default InvestmentCategories;
