import styles from "./style.module.css";
import commonStyles from "../../../Layout/Fullpage/style.module.css";
import Slider from "react-slick";
import SectionHeader from "../../../SectionHeader";

const NriTaxationFeaturedIn = () => {
    const images = [
        { image: require("./assets/f1.jpg") },
        { image: require("./assets/f2.png") },
        { image: require("./assets/f3.png") },
        { image: require("./assets/f4.png") },
        { image: require("./assets/f5.png") },
        { image: require("./assets/f6.png") },
        { image: require("./assets/f7.jpg") },
        { image: require("./assets/f8.jpg") },
        { image: require("./assets/f9.jpg") },
        { image: require("./assets/f10.jpg") },
        { image: require("./assets/f11.jpg") },
        { image: require("./assets/f12.jpg") },
        { image: require("./assets/f13.jpg") },
        { image: require("./assets/f14.jpg") },
        { image: require("./assets/f15.jpg") },
        { image: require("./assets/f16.jpg") },
        { image: require("./assets/f17.jpg") },
        { image: require("./assets/f18.jpg") },
        { image: require("./assets/f19.jpg") },
        { image: require("./assets/f20.jpg") },
    ];
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
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
        <section className={`${styles.investsection}  ${commonStyles['padding-class']}`}>
            <SectionHeader
                className="text-center"
                headerText={"Corporate Companies We Are Proud To Be Associated With."}
            />
            <div className={`container ${styles.container}`}>
                <br />
                <div
                    className={`${styles['featured-in-xuiisis8']} pt-2 ${styles["featured-in-xu"]}`}
                >
                    <Slider {...settings} className={`${styles['sliderWrapper']}`}>
                        {images.map((v, i) => (
                            <div key={`feacturedin-img-${i}`} className={styles["card-item"]}>
                                <img src={v.image} />
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </section>
    );
};
export default NriTaxationFeaturedIn;
