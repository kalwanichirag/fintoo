import React from 'react'
import { imagePath } from '../../../../constants';
import Styles from "./style.module.css"
import Goalsection from '../../../../components/DGReport/whatifanalysis/Goalsection';
import Education from "./images/Education.svg";
import Marriage from "./images/Marriage.svg";
import Other from "./images/Other.svg";
import Car from "./images/Car.svg";
import Vacation from "./images/Vacation.svg"
import whatifanalysis from "./images/whatifanalysis.svg";
import Property from "./images/Property.png";
import Emergency from "./images/Emergency.png";
const Whatifanalysis = ({ totalgoals, unachievableGoalrecoom }) => {
    // const goals = ["Education", "Marriage", "Others", "Vehicle"];
    const images = [Education, Marriage,Car, Property, Vacation, Emergency, Other];
    return (
        <div className={`${Styles.Whatifanalysis}`}>
            
            {
                totalgoals.Total_goals = 0 ? <>
                    <div className={`${Styles.InsuranceCompBox}`}>
                        <img
                            src={process.env.REACT_APP_STATIC_URL + "media/DMF/insurance_done.png"}
                            alt="Insurance Done"
                        />
                        <h1>Great!</h1>
                        <p style={{textAlign : "center !important"}}>
                            “You’ve successfully achieved your goals. As it is self-evidently
                            needless to provide you with recommendations from our end, for any
                            given plan to invest you in a life insurance policy.”
                        </p>
                    </div>
                </> : <>

                    <h4 className="rTitle " style={{ marginTop: 20 }}>
                        <img
                            width={30}
                            className="title-icon"
                            src={whatifanalysis}
                        />
                        &nbsp;What If Analysis
                    </h4>
                    <div className="rContent  ">
                        <p>  What if the analysis is based on multiple scenarios and their outcomes to fulfill the goals set by you. Based on the criticality and preferences of the goals you set, Fintoo recommends multiple options if there is a shortfall in achieving those goals.</p>
                    </div>
                    <div className='profileHolderBox'>
                        <div className={`${Styles.GoalBox}`}>
                            <div className={`${Styles.textData}`}>
                                <div>Total Goals</div>
                                <div>{totalgoals.Total_Goals < 10 ? "0" + totalgoals.Total_Goals : totalgoals.Total_Goals}</div>
                            </div>
                            <div className={`${Styles.vrline}`}></div>
                            <div className={`${Styles.textData}`}>
                                <div>Goals Achievable</div>
                                <div>{totalgoals.Achievable_Goals < 10 ? "0" + totalgoals.Achievable_Goals : totalgoals.Achievable_Goals}</div>
                            </div>
                            <div className={`${Styles.vrline}`}></div>
                            <div className={`${Styles.textData}`}>
                                <div>Goals Under Scanner</div>
                                <div>{totalgoals.Unachievable_Goals < 10 ? "0" + totalgoals.Unachievable_Goals : totalgoals.Unachievable_Goals}</div>
                            </div>
                        </div>
                        <div className='mt-5'>
                            {unachievableGoalrecoom.map((goal, index) => (
                                <>
                                {/* {goal.goal_category_id} */}
                                <Goalsection key={index}  goal_name={goal.goal_name}  goal_value={goal.goal_value} goal_future_value={goal.goal_future_value} goal_future_value={goal.goal_future_value} achievable_amount={goal.achievable_amount} shortfall_amount={goal.shortfall_amount} fintoo_recommended_investment={goal.fintoo_recommended_investment} user_investment_available_per_month={goal.user_investment_available_per_month} recommendation={goal.recommendation} imageUrl={images[goal.goal_category_id - 1]} />
                                </>
                            ))}
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default Whatifanalysis
