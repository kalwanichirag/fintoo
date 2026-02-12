import React, { useState, useEffect } from "react";
import Vacation from '../../Assets/Images/CommonDashboard/Vaction.svg'
import Car from '../../Assets/Images/CommonDashboard/car.svg';
import Anniversary from '../../Assets/Images/CommonDashboard/anniversary.svg';
import Graduation from '../../Assets/Images/CommonDashboard/graduation-cap.svg';
import Home from '../../Assets/Images/CommonDashboard/home.svg';
import Emergency from '../../Assets/Images/CommonDashboard/emergency.svg';
import Retirement from '../../Assets/Images/CommonDashboard/retirement_new.svg';
import NotAchievedGoals from '../../Assets/Images/CommonDashboard/goals_Not_achived.svg'
import UpcomingGoals from '../../Assets/Images/CommonDashboard/upcoming_goal.svg'
import PendingGoals from '../../Assets/Images/CommonDashboard/pending_goals.svg'
import CustomBar from "./Custombar";
import { BASE_API_URL } from "../../constants";
import { getItemLocal } from "../../common_utilities";

function TotalGoals(props) {
  const [goals, setGoals] = useState([])
  const renewpopup = props.renewpopup;


  const viewNowButtonStyle = {
    backgroundColor: "#042b62",
    color: "#fff",
    padding: "0.4rem 1.4rem",
    // width: "8rem",
    fontSize: ".8rem",
    fontWeight: "700",
    float: "left",
    borderRadius: "20px",
    border: "1px solid #042b62",

  };

  const openGoalsPage = () => {
    if (props.planId == "fp_robo") {
      window.location.href = `${process.env.PUBLIC_URL}/report/goal-analysis`;
    }
    else {
      window.location.href = `${process.env.PUBLIC_URL}/datagathering/goals`;

    }
  }
  // const goalApiCall = async () => {
  //   if (props.goals.length == 0) {
  //     setGoals(props.goals);
  //   } else if (getItemLocal("family")) {
  //     props.goals.forEach((g) => {
  //       var today = new Date()
  //       var goal_start_date = new Date(g.goal_start_date).getFullYear();
  //       var goal_end_date = new Date(g.goal_end_date).getFullYear();
  //       if (goal_start_date < today.getFullYear()) {
  //         goal_start_date = today.getFullYear()
  //       }
  //       g["goalstartdate"] = goal_start_date;
  //       g["goalenddate"] = goal_end_date;
  //     });
  //     if (props.goal_type == "all") {
  //       setGoals(props.goals);
  //     } else {
  //       let filtered_goal = props.goals.filter((goal) => {
  //         return goal.goal_type.includes(props.goal_type);
  //       });
  //       setGoals(filtered_goal);
  //     }
  //   } else {
  //     if (props.goal_type != "all") {
  //       props.goals.forEach((g) => {
  //         var today = new Date()
  //         var goal_start_date = new Date(g.goal_start_date).getFullYear();
  //         var goal_end_date = new Date(g.goal_end_date).getFullYear();
  //         if (goal_start_date < today.getFullYear()) {
  //           goal_start_date = today.getFullYear()
  //         }
  //         g['goalstartdate'] = goal_start_date;
  //         g['goalenddate'] = goal_end_date;
  //       })

  //       if (props.member_selected) {
  //         let filtered_goal = props.goals.filter(goal => {
  //           return goal.goal_type.includes(props.goal_type) && goal.goal_for_member == props.member_id

  //         })
  //         setGoals(filtered_goal)
  //       }
  //       else {
  //         let filtered_goal = props.goals.filter(goal => {
  //           return goal.goal_type.includes(props.goal_type)

  //         })
  //         setGoals(filtered_goal)

  //       }





  //     }
  //     else {
  //       props.goals.forEach((g) => {
  //         var today = new Date()
  //         var goal_start_date = new Date(g.goal_start_date).getFullYear();
  //         var goal_end_date = new Date(g.goal_end_date).getFullYear();
  //         if (goal_start_date < today.getFullYear()) {
  //           goal_start_date = today.getFullYear()
  //         }
  //         g['goalstartdate'] = goal_start_date;
  //         g['goalenddate'] = goal_end_date;
  //       })


  //       if (props.member_selected) {
  //         let filtered_goal = props.goals.filter(goal => {
  //           return goal.goal_for_member == props.member_id
  //         })
  //         setGoals(filtered_goal)

  //       }
  //       else {

  //         setGoals(props.goals)



  //       }


  //     }
  //   }

  // }

  const goalApiCall = async () => {
    if (props.goals.length === 0) {
      setGoals([]);
      return;
    }
  
    const todayYear = new Date().getFullYear();
  
    // Normalize goal dates
    props.goals.forEach((goal) => {
      let startYear = new Date(goal.user_goal_start_date).getFullYear();
      let endYear = new Date(goal.user_goal_end_date).getFullYear();
  
      if (startYear < todayYear) {
        startYear = todayYear;
      }
  
      goal["goalstartdate"] = startYear;
      goal["goalenddate"] = endYear;
    });
  
    let filteredGoals = props.goals;
  
    // Filter by goal_type if not 'all'
    if (props.goal_type !== "all") {
      filteredGoals = filteredGoals.filter(goal =>
        goal.goal_type.includes(props.goal_type)
      );
    }
  
    // Filter by member if selected
    if (props.member_selected) {
      filteredGoals = filteredGoals.filter(goal =>
        goal.user_goal_for === props.member_id
      );
    }
  
    setGoals(filteredGoals);
  };
  
  
  useEffect(() => {
    goalApiCall();
  }, [props.goals, props.member_selected]);

  

 useEffect(() => {
  if (!window.webengage) return;
  if (!goals || goals.length === 0) return;

  goals.forEach((goal) => {
    window.webengage.track(goal.goal_cat_name, {
  
      goal_start_year: String(goal.goalstartdate || ""),
      goal_end_year: String(goal.goalenddate || ""),
      goal_percentage: Number(goal.goal_percent_achieved || 0),
    
    });
  });

 }, [goals]);
  





  return (
    <div className="totalGoals">
      {(goals.length == 0 && props.is_data) ? (
        (props.goal_type == 'achieved') ? (<div className="item-continer-bx stock-container">
          <div className="row item-continer-row">
            <div className="col-8">
              <div className="d-md-flex align-items-center">
                <div style={{ width: "330px" }}>
                  <img style={{ width: "350px", marginTop: "-43px", marginLeft: "-40px" }} src={NotAchievedGoals} />

                </div>
                <div >
                  <h2 style={{ color: "#042b62" }}><strong>You Have Not Achieved Any of Your Total Goals</strong> </h2>

                </div>
              </div>
            </div>
            <div className="col-4">
              <div>
                {props.renewpopup === 1 ? (
                  <a
                    onClick={props.onOpenModal}
                  >
                    {" "}
                    <button style={viewNowButtonStyle} className="AddGoalBtn">View Now !</button>{" "}
                  </a>
                ) : (
                  <a href={process.env.PUBLIC_URL + "/datagathering/goals/"}>
                    <button style={viewNowButtonStyle} className="AddGoalBtn">View Now !</button>{" "}
                  </a>
                )}

              </div>
            </div>
          </div>
        </div>) : (props.goal_type == 'pending') ? (<div className="item-continer-bx stock-container">
          <div className="row item-continer-row">
            <div className="col-8">
              <div className="d-md-flex align-items-center">
                <div style={{ width: "330px" }}>
                  <img style={{ width: "300px", marginTop: "-43px", marginLeft: "-40px" }} src={PendingGoals} />

                </div>
                <div>
                  <h2 style={{ color: "#042b62" }}><strong>You Do Not Have Any Pending Goals On Your List</strong> </h2>
                </div>
              </div>
            </div>

            <div className="col-4">
              <div>
                {props.renewpopup === 1 ? (
                  <a
                    onClick={props.onOpenModal}
                  >
                    {" "}
                    <button style={viewNowButtonStyle} className="AddGoalBtn">View Now !</button>{" "}
                  </a>
                ) : (
                  <a href={process.env.PUBLIC_URL + "/datagathering/goals/"}
                  >
                    <button style={viewNowButtonStyle} className="AddGoalBtn">View Now !</button>{" "}
                  </a>
                )}

              </div>
            </div>
          </div>
        </div>) : (props.goal_type == 'upcoming') ? (<div className="item-continer-bx stock-container">
          <div className="row item-continer-row">
            <div className="col-8">
              <div className="d-md-flex align-items-center">
                <div style={{ width: "330px" }}>
                  <img style={{ width: "300px", marginTop: "-43px", marginLeft: "-40px" }} src={UpcomingGoals} />
                </div>
                <div>
                  <h2 style={{ color: "#042b62" }}><strong>Within The Next Three Months, There Are No Upcoming Goals</strong> </h2>
                </div>
              </div>
            </div>

            <div className="col-4">
              {props.renewpopup === 1 ? (
                <a
                  onClick={props.onOpenModal}
                >
                  {" "}
                  <button style={viewNowButtonStyle} className="AddGoalBtn">View Now !</button>{" "}
                </a>
              ) : (
                <a href={process.env.PUBLIC_URL + "/datagathering/goals/"}>
                  <button style={viewNowButtonStyle} className="AddGoalBtn">View Now !</button>{" "}
                </a>
              )}

            </div>

          </div>
        </div>) : (

          <div className="item-continer-bx stock-container">
            <div className="row item-continer-row">
              <div className="col-6">
                <div className="d-md-flex align-items-center">
                  <div style={{ width: "330px" }}>
                    <img style={{ width: "300px", marginTop: "-43px", marginLeft: "-40px" }} src={UpcomingGoals} />

                  </div>
                  <div style={{ width: "330px" }}>
                    <h2 style={{ color: "#042b62" }}><strong>There Are No Goals</strong> </h2>

                  </div>
                </div>
              </div>
              <div className="col-6">
                {props.renewpopup === 1 ? (
                  <a
                    onClick={props.onOpenModal}
                  >
                    {" "}
                    <button style={viewNowButtonStyle} className="AddGoalBtn">View Now !</button>{" "}
                  </a>
                ) : (
                  <a href={process.env.PUBLIC_URL + "/datagathering/goals/"}>
                    <button style={viewNowButtonStyle} className="AddGoalBtn">View Now !</button>{" "}
                  </a>
                )}

              </div>
            </div>
          </div>
        )


      ) : (


        <div>
          <div className="row mb-4 TotalGoalBox">
            {goals.map(goal => (
              <div
                className=""
                style={{
                  borderRight: "1px solid #e7e7e7",
                  cursor: 'pointer',
                }}
                key={goal.goal_id}
              >
                {props.renewpopup == 1 ? (<div className="GoalsBox Activebox" onClick={props.onOpenModal}>
                  <div className="d-flex">
                    <div className="GoalImg">
                      {goal.category_name == 'Vehicle' ? (<img src={Car} width={10} />) : (goal.category_name == 'Vacation') ? (<img src={Vacation} width={10} />) : (goal.category_name == 'Education') ? (<img src={Graduation} width={10} />) : (goal.category_name == 'Property') ? (<img src={Home} width={10} />) : (goal.category_name == 'Emergency') ? (<img src={Emergency} width={10} />) : (goal.category_name == 'Retirement') ? (<img src={Retirement} width={10} />) : (<img src={Anniversary} width={10} />)}
                    </div>
                    <div className="GoalTypeSection ms-2">
                      <div className="GoalName">{goal.name}</div>
                      <div className="GoalSubTxt">{goal.goal_percent_achieved}% of Goal Value</div>
                      <div>
                        <CustomBar percent={goal.goal_percent_achieved} />
                      </div>
                    </div>
                  </div>
                  <div className="ms-3">
                    <div className="GoalValue">
                      <span className="RsSymbol">&#8377;</span>
                      {/* <span className="goalAmt">{goal.future_value_formatted}</span> */}
                      <span className="goalAmt">
                        {goal.goaltype === "ContingencyGoal"
                          ? goal.present_value
                          : goal.future_value_formatted}
                      </span>

                    </div>
                    <div className="mt-2">
                      <span className="RsSymbol2">{(goal.short_fall).toFixed(2) == 0.00 ? '' : "₹"}</span>
                      <span className="goalNegAmt">{(goal.short_fall).toFixed(2) == 0.00 ? '' : goal.short_fall_formatted} </span>
                      <span className="GoalType">{Math.sign(goal.short_fall) == -1 || goal.future_value == 0 ? <span style={{ color: "red" }}>(Shortfall)</span> : <span style={{ color: "green" }}>(Surplus)</span>}</span>
                    </div>
                  </div>
                </div>) : (<div className="GoalsBox Activebox" onClick={openGoalsPage}>
                  <div className="d-flex">
                    <div className="GoalImg">
                      {goal.category_name == 'Vehicle' ? (<img src={Car} width={10} />) : (goal.category_name == 'Vacation') ? (<img src={Vacation} width={10} />) : (goal.category_name == 'Education') ? (<img src={Graduation} width={10} />) : (goal.category_name == 'Property') ? (<img src={Home} width={10} />) : (goal.category_name == 'Emergency') ? (<img src={Emergency} width={10} />) : (goal.category_name == 'Retirement') ? (<img src={Retirement} width={10} />) : (<img src={Anniversary} width={10} />)}
                    </div>
                    <div className="GoalTypeSection ms-2">
                      {goal.goal_isRecurring == '1' ? (<div className="GoalDate">{goal.goalstartdate} - {goal.goalenddate}</div>) : <div className="GoalDate">{goal.goalenddate}</div>}
                      <div className="GoalName">{goal.name}</div>
                      <div className="GoalSubTxt">{goal.goal_percent_achieved}% of Goal Value</div>
                      <div>
                        <CustomBar percent={goal.goal_percent_achieved} />
                      </div>
                    </div>
                  </div>
                  <div className="ms-3" style={{
                    lineHeight: "16px"
                  }}>
                    <div className="GoalValue">
                      <span className="RsSymbol">&#8377;</span>
                      {/* <span className="goalAmt">{goal.future_value_formatted}</span> */}
                      <span className="goalAmt">
                        {goal.goaltype === "ContingencyGoal"
                          ? goal.present_value
                          : goal.future_value_formatted}
                      </span>

                    </div>
                    <div className="mt-2">
                      <span className="RsSymbol2">{(goal.short_fall).toFixed(2) == 0.00 ? '' : "₹"}</span>
                      <span className="goalNegAmt">{(goal.short_fall).toFixed(2) == 0.00 ? '' : goal.short_fall_formatted} </span>
                      <span className="GoalType">{Math.sign(goal.short_fall) == -1 || goal.future_value == 0 ? <span style={{ color: "red" }}> (Shortfall)</span> : <span style={{ color: "green" }}>(Surplus)</span>}</span>
                    </div>
                  </div>
                </div>)}

                <br />

              </div>

            ))}


          </div>
          <hr style={{
            border: "1px solid #e7e7e7"
          }} className="mt-4" />

        </div>
      )}
    </div>
  );
}

export default TotalGoals;
