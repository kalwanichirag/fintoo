import Slider from "react-slick";
import styles from './style.module.css'
import commonStyles from "../../../Layout/Fullpage/style.module.css";
import carouselImg1 from './assets/LifeChoiceCarouselImg1.jpg'
import carouselImg2 from './assets/LifeChoiceCarouselImg2.jpg'
import carouselImg3 from './assets/LifeChoiceCarouselImg3.jpg'
import { useState } from "react";
import SectionHeader from "../../../SectionHeader";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";

const NextArrowComp = (props) => {
    const { onClick } = props;
    return (
        <div className={`${styles['slick-next-custom']}`} onClick={onClick}>
            <TbChevronRight />
        </div>
    );
}

function PrevArrowComp(props) {
    const { onClick } = props;
    return (
        <div className={`${styles['slick-prev-custom']}`} onClick={onClick}>
            <TbChevronLeft />
        </div>
    );
}

function LifeChoiceSection() {

    const [activeIdx, SetActiveIdx] = useState(0)

    const settings = {
        dots: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        beforeChange: (_, newIndex) => {
            SetActiveIdx(() => newIndex)
        },
        nextArrow: < NextArrowComp />,
        prevArrow: <PrevArrowComp />
    };

    return (
        <div className={`${styles['life-choice-section']} ${commonStyles['padding-class']}`}>
            <span style={{position:'relative',zIndex:'77'}}>
                <SectionHeader headerText={'Your Life… Your Choice'} />
            </span>

            <br />
            <div className={`${commonStyles['section-content-text']} text-center`}>
                Empower yourself to write the story of your life the way you want it. From becoming a successful entrepreneur to living the influencer life or simply upgrading your current lifestyle. Bring your or your family’s dream life to reality by making the right choice at the right time, and by using the right way.
            </div>
            <br />
            <br />
            <div className={`${styles['carousel-container']}`}>
                <Slider {...settings} className={`${styles['sliderWrapper']}`}>
                    <div>
                        <div className={`${styles['carousel-item-container']} `} style={{ backgroundImage: `url(${carouselImg1})` }} >
                            <div className={`${styles['carousel-item-container-background-overlay']}`}></div>
                            <div className={`${styles['carousel-item-content']} ${styles['animated']} ${styles['fadeInUp']} ${activeIdx === 0 ? '' : styles['none-display']}`} style={{ color: 'white', zIndex: '999' }}>
                                <h1>YouTuber & Influencer</h1>
                                <h3>Investment Started - Current Progress – Financial Goal</h3>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className={`${styles['carousel-item-container']}`} style={{ backgroundImage: `url(${carouselImg2})` }}>
                            <div className={`${styles['carousel-item-container-background-overlay']}`}></div>
                            <div className={`${styles['carousel-item-content']} ${styles['animated']} ${styles['fadeInUp']} ${activeIdx === 1 ? '' : styles['none-display']}`} style={{ color: 'white', zIndex: '999' }}>
                                <h1> Aspiring Actor</h1>
                                <h3>Investment Started - Current Progress – Financial Goal</h3>
                            </div>

                        </div>
                    </div>
                    <div>
                        <div className={`${styles['carousel-item-container']}`} style={{ backgroundImage: `url(${carouselImg3})` }}>
                            <div className={`${styles['carousel-item-container-background-overlay']}`}></div>

                            <div className={`${styles['carousel-item-content']} ${styles['animated']} ${styles['fadeInUp']} ${activeIdx === 2 ? '' : styles['none-display']}`} style={{ color: 'white', zIndex: '999' }}>
                                <h1>Aspiring Entrepreneur</h1>
                                <h3>Investment Started - Current Progress – Financial Goal</h3>
                            </div>
                        </div>
                    </div>
                </Slider>
            </div>
            <br /><br />
            <div className={`${commonStyles['section-content-text']} text-center`}>
                Don’t let financial insecurity stop you from chasing your dreams. Take the right step today to financially secure your tomorrow and pursue your goals with complete confidence and freedom.
            </div>
            <br /><br />
            <div className="text-center">
                <a className={`${styles['life-choice-section-section-btn']}`} href="">SECURE FUTURE NOW</a>
            </div>

        </div>
    );
}

export default LifeChoiceSection
