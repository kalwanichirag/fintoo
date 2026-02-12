import BoldSectionHeader from "../../BoldSectionHeader";
import Testimonial from "../../Testimonial";
import styles from "./style.module.css";
import Slider from "react-slick";
import "./custom.css";

const FeaturedIn = () => {
  const images = [
    {
      image: require("./images/Untitled-design-3.png"),
      link: "https://economictimes.indiatimes.com/wealth/spend/upi-payment-extended-to-inbound- travellers-nris-coming-to-india-rbi/articleshow/97717972.cms ",
    },
    {
      image: require("./images/Untitled-design-4.png"),
      link: "https://www.newindianexpress.com/business/2022/nov/13/expensive-valuations-volatility-in- equity-market-hit-nfo-inflows-in-sep-quarter-2517886.html ",
    },
    {
      image: require("./images/Untitled-design-5.png"),
      link: "https://www.zeebiz.com/union-budget/news-budget-2023-maturity-proceeds-of-life-insurance-policies-with-annual-premium-of-over-rs-5-lakh-to-be-taxed-fm-220065",
    },
    {
      image: require("./images/Untitled-design-7.png"),
      link: "https://www.outlookindia.com/business/rbi-mpc-curbs-arbitrary-penal-interest-on-loans- for-consumer-protection-to-release-draft-guidelines-soon-news-260491 ",
    },
    {
      image: require("./images/Untitled-design-8.png"),
      link: "https://www.financialexpress.com/budget/budget-2023-income-tax-slab-rate-live-updates- tax-calculator-salaried-senior-citizens-nri-pension-investment-saving-news-2966481/ ",
    },
  ];
  const settings = {
    dots: true,
    infinite: true,
    speed: 2000,
    slidesToShow: 3,
    autoplay: true,
    slidesToScroll: 3,
    prevArrow: (
      <button className={styles.btnopt}>
        <i class="fa-solid fa-chevron-left"></i>
      </button>
    ),
    nextArrow: (
      <button className={styles.btnopt}>
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    ),
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <section className={`${styles.investsection} py-3`}>
      <div className={`container ${styles.container}`}>
        <BoldSectionHeader headerText={"Featured In"} />
        <div
          className={`featured-in-xuiisis8 pt-2 ${styles["featured-in-xu"]}`}
        >
          <Slider {...settings}>
            {images.map((v, i) => (
              <div key={`feacturedin-img-${i}`} className={styles["card-item"]}>
                <div style={{
                  display : "grid"
                }} >
                <a target="_blank" className="m-auto" href={v.link}>
                  <img src={v.image} />
                </a>
                </div>
              </div>
            ))}
          </Slider>
        </div>
        <p>&nbsp;</p>
      </div>
    </section>
  );
};
export default FeaturedIn;
