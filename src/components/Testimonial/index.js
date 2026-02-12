import React from "react";
import Slider from "react-slick";
import styles from './style.module.css';
import './custom.css';

const Testimonial = ({ data }) => {
    const settings = {
        dots: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };
    return (
        <div className={`${styles['card-box']} fintoo-client-testimonial-j4r`}>
            <Slider {...settings}>
                {data.map((v, i) => (
                    <div key={`testurt-${i}`} className={styles['card-item']}>
                        <div className={styles['card-item-container']}>
                            <div className="text-center">
                                <img src={require('./images/quote.png')} width={50} style={{ display: 'inline-block' }} />
                            </div>
                            <p className={styles['text']}>{v.text}</p>
                        </div>
                        <div className={styles['given-by']}>
                            <p><strong>{v.from}</strong></p>
                            <p>{v.designation}</p>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};
export default Testimonial;
