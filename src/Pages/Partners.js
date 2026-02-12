import React from "react";
import Slider from "react-slick";
function Partners() {
  const settings = {
    className: "center",
    centerMode: true,
    centerPadding: "4rem",
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    speed: 3000,
    autoplaySpeed: 3000,
    cssEase: "linear",
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  return (
    <div className="PartnerSlideImg">
      <div className="p-5 container  w-100 m-auto">
        <Slider
          itemsToShow={4}
          {...settings} autoplay
        >
          <div>
            <img
              alt="Reliance industry limited"
              style={{ opacity: 1 }}
              src={
                process.env.REACT_APP_STATIC_URL + "media/AboutUs/clogo-1.svg"
              }
            />
          </div>
          <div
            className="owl-item cloned"
            style={{ width: "auto", marginRight: 40 }}
          >
            <div>
            <img
              alt="Johnson and johnson"
              style={{ opacity: 1 }}
              src={
                process.env.REACT_APP_STATIC_URL + "media/AboutUs/clogo-2.svg"
              }
            />
            </div>
          </div>
          <div>
          <img
              alt="Pepsico"
              style={{ opacity: 1 }}
              src={
                process.env.REACT_APP_STATIC_URL + "media/AboutUs/clogo-3.svg"
              }
            />
          </div>
          <div>
          <img
              alt="Mahindra"
              style={{ opacity: 1 }}
              src={
                process.env.REACT_APP_STATIC_URL + "media/AboutUs/clogo-4.svg"
              }
            />
          </div>
          <div>
          <img
              alt="Airgo"
              style={{ opacity: 1 }}
              src={
                process.env.REACT_APP_STATIC_URL + "media/AboutUs/clogo-5.svg"
              }
            />
          </div>
          <div>
          <img
              alt="Reliance industry limited"
              style={{ opacity: 1 }}
              src={
                process.env.REACT_APP_STATIC_URL + "media/AboutUs/clogo-1.svg"
              }
            />
          </div>
          <div>
          <img
              alt="Johnson and johnson"
              style={{ opacity: 1 }}
              src={
                process.env.REACT_APP_STATIC_URL + "media/AboutUs/clogo-2.svg"
              }
            />
          </div>
          <div>
          <img
              alt="Pepsico"
              style={{ opacity: 1 }}
              src={
                process.env.REACT_APP_STATIC_URL + "media/AboutUs/clogo-3.svg"
              }
            />
          </div>
          <div>
          <img
              alt="Mahindra"
              style={{ opacity: 1 }}
              src={
                process.env.REACT_APP_STATIC_URL + "media/AboutUs/clogo-4.svg"
              }
            />
          </div>
        </Slider>
      </div>
    </div>
  );
}

export default Partners;
