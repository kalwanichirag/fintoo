import styles from "./style.module.css";
import Iframe from "react-iframe";

function YoutubevideoSection() {
  return (
    <section className={ `pb-5 pt-5 ${styles.YoutubevideoSection}` } >
      <div className={`${styles.YoutubevideoContent}`}>
        
        <div className={`${styles.YoutubevideoBox}`}>
        {/* <iframe width="727" height="409" src="https://www.youtube.com/embed/DUA-Qa3ogYc" title="Introduction To Fintoo’s AI-Based Robo Advisory | Easy, Smart & Best Way To Start Financial Planning" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe> */}
          <Iframe
          src="https://www.youtube.com/embed/DUA-Qa3ogYc"
            url="https://www.youtube.com/watch?v=DUA-Qa3ogYc"
            id=""
            className={`${styles.VideoFrame}`}
            // width="746px"
            // height="428px"
            display="block"
            position="relative"
          />
        </div>
      </div>
    </section>
  );
}

export default YoutubevideoSection;
