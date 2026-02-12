
import styles from "./style.module.css";
import graphImg from "../images/EquityReturnsData.png"

const ExtraPerformanceAdvice = () => {

    return (
        <section className={`${styles.ExtraPerformanceAdviceSection}`}>
            <div className={`text-center ${styles.GlobalText2}`} style={{ paddingBottom: '0' }}>
                Expert Advice For Extra Performance
            </div>
            <p className={`${styles.para}`}>
                Boost your annual returns with the help of Fintoo’s Premium Wealth Management Services.</p>
            <br />
            <div>
                <img style={{width:'65%'}} src={graphImg} alt="" />
            </div>
            <br /><br />
        </section>
    );
};

export default ExtraPerformanceAdvice;
