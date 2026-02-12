import styles from "./style.module.css";

import SectionHeader from "../../../SectionHeader";
function YoutubevideoSection() {
  return (
    <section className={ `pb-5 pt-5 ${styles.YoutubevideoSection}` } >
      <div className={`${styles.YoutubevideoContent}`}>
        <SectionHeader
          className="text-center"
          headerText={
            "How Financial Planning Helps You Achieve Your Goal"
          }
        />
        </div>
        <div className={`${styles.YoutubevideoBox}`}>
          <div className={`${styles.videobackground}`}>
            <div className={`${styles.videoforeground}`}>
              <div
                className="mt-4"
                style={{ width: "90%", height: "41.875rem", margin: "auto" }}
              >
                <iframe
                src="https://www.youtube.com/embed/DUA-Qa3ogYc"
                url="https://www.youtube.com/embed/DUA-Qa3ogYc"
                  frameborder="0"
                  allowfullscreen
                  style={{ width: "100%", height: "100%" }}
                ></iframe>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
}

export default YoutubevideoSection;
