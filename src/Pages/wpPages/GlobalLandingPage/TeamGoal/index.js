
import styles from "./style.module.css";
import member1 from "../images/suchita-maam.png"
import member2 from "../images/manish-sir.png"
import member3 from "../images/nikhil-sir.png"

const TeamGoal = () => {

    return (
        <section className={`${styles.TeamGoalSection}`}>
            <div className={`text-center ${styles.GlobalText2}`} style={{ paddingBottom: '0' }}>
                One Team… One Goal.
            </div>
            <p>Meet Our Team, Whose Only Goal Is To Assist You In Achieving Your Financial Independence.</p>
            <br /><br />
            <div className={`${styles.TeamMemberContainer}`}>
                <div className={`${styles.TeamMemberElem}`}>
                    <div className={`${styles.TeamMemberElemImg}`}>
                        <img style={{ width: '100%' }} src={member2} alt="" />
                    </div>
                    <div className={`${styles.TeamMemberElemInfo}`}>
                        <h4>CA Manish Hingar</h4>
                        <h5>Founder & CEO</h5>
                    </div>
                </div>
                <div className={`${styles.TeamMemberElem}`}>
                    <div className={`${styles.TeamMemberElemImg}`}>
                        <img style={{ width: '100%' }} src={member1} alt="" />
                    </div>
                    <div className={`${styles.TeamMemberElemInfo}`}>
                        <h4>Suchita Hingar</h4>
                        <h5>Co-Founder</h5>
                    </div>
                </div>
                {/* <div className={`${styles.TeamMemberElem}`}>
                    <div className={`${styles.TeamMemberElemImg}`}>
                        <img style={{ width: '100%' }} src={member3} alt="" />
                    </div>
                    <div className={`${styles.TeamMemberElemInfo}`}>
                        <h4>CA Nikhil Sharma</h4>
                        <h5>Chief Revenue Officer</h5>
                    </div>
                </div> */}
            </div>
            {/* <br /><br /> */}
        </section>
    );
};

export default TeamGoal;
