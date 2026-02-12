import styles from "./style.module.css";
import Iframe from "react-iframe";
import SectionHeader from "../../../SectionHeader";
function TaxPlanningVideoSection() {
    return (
        <section className={`pb-5 pt-5 ${styles.YoutubevideoSection}`} >
            <div className={`${styles.YoutubevideoContent}`}>
                <SectionHeader
                    className="text-center"
                    headerText={
                        "How Fintoo’s Customised Tax Planning Helps You To  Minimise Your Tax Liability And Maximise Your Income Benefits."
                    }
                />
                <div className={`${styles.YoutubevideoBox}`}>
                    <Iframe
                        src="https://www.youtube.com/embed/DeVHdH1Ypu4"
                        url="https://www.youtube.com/embed/DeVHdH1Ypu4"
                        id=""
                        className={`${styles.VideoFrame}`}
                        display="block"
                        position="relative"
                    />
                </div>
            </div>
        </section>
    );
}

export default TaxPlanningVideoSection;
