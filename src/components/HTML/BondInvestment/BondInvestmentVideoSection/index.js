import styles from "./style.module.css";
import SectionHeader from "../../../SectionHeader";

function BondinvestmentVideoSection() {
  return (
    <section className={`pb-5 pt-5 ${styles.YoutubevideoSection}`}>
      <div className={`${styles.YoutubevideoContent}`}>
        <SectionHeader
          className="text-center"
          headerText={
            "How Fintoo Helps You Buy The Best Bonds That Will Give You High Returns And Enable You To Achieve Your Financial Goals."
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

export default BondinvestmentVideoSection;
