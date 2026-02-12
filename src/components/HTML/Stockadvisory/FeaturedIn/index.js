import BoldSectionHeader from "../../../BoldSectionHeader";
import styles from "./style.module.css";
import Slider from "react-slick";
import SectionHeader from "../../../SectionHeader";
import "./custom.css";

const FeaturedIn = () => {
  const images = [
    // { image: require("./images/Untitled-design-3.png") },
    // { image: require("./images/Untitled-design-4.png") },
    // { image: require("./images/Untitled-design-5.png") },
    { image: require("./images/Untitled-design-3.png") },
    { image: require("./images/Untitled-design-7.png") },
    { image: require("./images/Untitled-design-9.png") },
    { image: require("./images/Untitled-design-10.png") },
    { image: require("./images/Untitled-design-11.png") },
    { image: require("./images/Untitled-design-12.png") },
    { image: require("./images/Untitled-design-13.png") },
  ];
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 4,
    slidesToScroll: 4,
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
    <section className={`${styles.investsection} py-5`}>
      <SectionHeader
        className="text-center"
        headerText={"Corporate Companies We Are Proud To Be Associated With."}
      />
      <div className={`container ${styles.container}`}>
        {/* <p className={`text-center mt-4 ${styles.SectionSubtext}`}>Companies We Are Proud To Be Associated With</p> */}
        <div
          className={`featured-in-xuiisis8 pt-5 ${styles["featured-in-xu"]}`}
        >
          <Slider {...settings}>
            {images.map((v, i) => (
              <div key={`feacturedin-img-${i}`} className={styles["card-item"]}>
                <img src={v.image} />
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
