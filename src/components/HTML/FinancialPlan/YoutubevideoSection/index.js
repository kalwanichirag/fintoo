import styles from "./style.module.css";
import SectionHeader from "../../../SectionHeader";
function YoutubevideoSection() {
  return (
    <section className={`pb-5 pt-5 ${styles.YoutubevideoSection}`}>
      <div className={`${styles.YoutubevideoContent}`}>
        <SectionHeader
          className="text-center"
          headerText={
            "How Fintoo’s Tailored Financial Planning helps Achieve Financial Security, Stability, and Freedom!"
          }
        />
      </div>
      {/* <div>
        <div className={`${styles.YoutubevideoBox}`}>
        
          <iframe
            src="https://www.youtube.com/embed/DUA-Qa3ogYc"
            url="https://www.youtube.com/watch?v=DUA-Qa3ogYc"
            id=""
            className={`${styles.VideoFrame}`}
            width="560"
            height="615"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            display="block"
            position="relative"
          />
        </div>
      </div> */}
      <div className={`${styles.YoutubevideoBox}`}>
        <div className={`${styles.videobackground}`}>
          <div className={`${styles.videoforeground}`}>
            <div className="mt-4" style={{width: '90%', height: '41.875rem', margin: 'auto'}}>
              <iframe
                src="https://www.youtube.com/embed/DUA-Qa3ogYc"
                url="https://www.youtube.com/watch?v=DUA-Qa3ogYc"
                frameborder="0"
                allowfullscreen
                style={{width: '100%', height: '100%'}}
                ></iframe>
              </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default YoutubevideoSection;
