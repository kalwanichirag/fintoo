import BoldSectionHeader from "../../../BoldSectionHeader";
import styles from "./style.module.css";
import Slider from "react-slick";
import SectionHeader from "../../../SectionHeader";
import "./custom.css";

const FeaturedIn = ({headerText}) => {
  const images = [
    // { image: require("./images/Untitled-design-3.png") },
    // { image: require("./images/Untitled-design-4.png") },
    // { image: require("./images/Untitled-design-5.png") },
    { image: require("./images/Untitled-design-2.jpg") },
    { image: require("./images/Untitled-design-3.jpg") },
    { image: require("./images/Untitled-design-4.jpg") },
    { image: require("./images/Untitled-design-5.jpg") },
    { image: require("./images/Untitled-design-6.jpg") },
    { image: require("./images/Untitled-design-7.jpg") },
    { image: require("./images/Untitled-design-9.jpg") },
    { image: require("./images/Untitled-design-10.jpg") },
    { image: require("./images/Untitled-design-11.jpg") },
    { image: require("./images/Untitled-design-12.jpg") },
    { image: require("./images/Untitled-design-13.jpg") },
    { image: require("./images/Untitled-design-14.jpg") },
    { image: require("./images/Untitled-design-15.jpg") },
    { image: require("./images/Untitled-design-16.jpg") },
    { image: require("./images/Untitled-design-17.jpg") },
  ];
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
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
        headerText={headerText}
      />
      <div className={`container ${styles.container}`}>
        {/* <p className={`text-center mt-4 ${styles.SectionSubtext}`}>
          Companies We Are Proud To Be Associated With
        </p> */}
        <br /><br />
        <div
          className={`featured-in-xuiisis8 pt-2 ${styles["featured-in-xu"]}`}
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
