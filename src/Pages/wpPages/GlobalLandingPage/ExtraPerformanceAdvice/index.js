
import styles from "./style.module.css";
import graphImg from "../images/EquityReturnsData.png"

const ExtraPerformanceAdvice = () => {

    return (
        <section className={`${styles.ExtraPerformanceAdviceSection}`}>
            <div className={`text-center ${styles.GlobalText2}`} style={{ paddingBottom: '0' }}>
                Expert Advice For Extra Performance
            </div>
            <p>Boost your annual returns with the help of Fintoo’s Premium Wealth Management Services.</p>
            <br />
            <div>
                {/* <img src={graphImg} alt="" /> */}
                <img style={{width:'90%'}} src='https://www.fintoo.in/wealthmanagement/wp-content/uploads/2025/02/Fintoo-GlobalEyes-and-SP-500-Benchmark-3-1536x864.png' alt="" />
            </div>
            <br /><br />
        </section>
    );
};

export default ExtraPerformanceAdvice;
