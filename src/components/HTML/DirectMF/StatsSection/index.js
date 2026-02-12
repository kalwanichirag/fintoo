import { useRef,useEffect } from "react";
import { useViewCheckOnce } from "../../../../Utils/Hooks/UseViewCheck";
import styles from "./style.module.css";
import commonStyles from "../../../Layout/Fullpage/style.module.css";
import { MdOutlineGroup, MdOutlineGroups } from 'react-icons/md'
import { SlCalender } from 'react-icons/sl'
import SectionHeader from "../../../SectionHeader";
import { getUserId } from "../../../../common_utilities";

function StatsSection() {
    const ref = useRef(null)
    const isVisible = useViewCheckOnce(ref);
    const interval = useRef(null);
    const timer = useRef(0);
    const startTimer = () =>{
        // if idle for more than 5 mins logout
        if(timer.current>=4){
          clearInterval(interval.current)
            if(getUserId()){
              window.location.href="https://stg.minty.co.in/web/logout"
            }
          }
          else{
            timer.current=timer.current+1
          }
      }
    const incrementTimer =() =>{
        interval.current = setInterval(() => {
            startTimer()
        }, 60000);
    }
    const resetTimer = () =>{
        clearInterval(interval.current)
    }
    useEffect(() => {
        // incrementTimer();
      }, []);
    return (
        <>
            <section className={`${styles['stats-section']} ${commonStyles['padding-class']}`} 
            onMouseEnter={() => {
                resetTimer();
            }}
            onMouseLeave={() => {
                resetTimer();
            }}
            >
                <SectionHeader headerText={'Trust Is Our Sole Driving Force And We Are Proud To Be Trusted By 1,40,000+ Investors Across The Globe'} />
                <br /><br />
                <div ref={ref} className={`${styles['stats-items-container']} ${styles['slide-in']} ${isVisible ? styles['active'] : ''}`}>
                    <div className={`${styles['stats-item']}`}>
                        <div className={`${styles['stats-item-icon']}`}> <MdOutlineGroups /> </div>
                        <div className={`${styles['stats-item-heading']}`}> <span>₹ 300cr+</span> </div>
                        <div className={`${styles['stats-item-content']}`}> <span>Assets Under Advisory (AUA)</span> </div>
                    </div>
                    <div className={`${styles['stats-item']}`}>
                        <div className={`${styles['stats-item-icon']}`}> <SlCalender /> </div>
                        <div className={`${styles['stats-item-heading']}`}> <span>94%</span> </div>
                        <div className={`${styles['stats-item-content']}`}> <span>Persistency</span> </div>
                    </div>
                    <div className={`${styles['stats-item']}`}>
                        <div className={`${styles['stats-item-icon']}`}> <MdOutlineGroup /> </div>
                        <div className={`${styles['stats-item-heading']}`}> <span>5000+</span> </div>
                        <div className={`${styles['stats-item-content']}`}> <span>SIPs registered</span> </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default StatsSection
