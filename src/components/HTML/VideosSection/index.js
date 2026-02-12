import React from "react";
import Slider from "react-slick";
import styles from "./style.module.css";

const VideosSection = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    autoplay: true,
    slidesToScroll: 1,
    prevArrow: (
      <button className={styles.btnopt}>
        <i className="fa-solid fa-chevron-left"></i>
      </button>
    ),
    nextArrow: (
      <button className={styles.btnopt}>
        <i className="fa-solid fa-chevron-right"></i>
      </button>
    ),
  };

  const videos = [
    "https://www.youtube.com/embed/akCsYoRcVfU?rel=0&controls=1",
    "https://www.youtube.com/embed/3-MGUU4QWOc?rel=0&controls=1",
    "https://www.youtube.com/embed/Bq7vHocVG14?rel=0&controls=1",
  ];

  return (
    <section className={styles.section} id="oa-y-9">
      <div className={`${styles.container} container`}>
        <div className={`text-center ${styles.GlobalText}`}>
          Here’s why our clients trust us with their portfolio management.
        </div>

        {/* Desktop View */}
        <div className={styles.desktopView}>
          <div
            style={{
              width: "100%",
              margin: "0 auto",
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              justifyContent: "center",
            }}
          >
            {videos.map((src, index) => (
              <iframe
                key={index}
                className={styles.videoIframe}
                src={src}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`video-${index}`}
              ></iframe>
            ))}
          </div>
        </div>

        {/* Mobile View */}
        <div className={styles.mobileView}>
          <div style={{ padding: "0 1rem" }}>
            <Slider {...settings}>
              {videos.map((src, index) => (
                <div key={index}>
                  <iframe
                    className={styles.videoIframe}
                    src={src}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={`video-mobile-${index}`}
                  ></iframe>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideosSection;
