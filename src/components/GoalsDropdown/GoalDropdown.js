import { useEffect, useState, useRef } from "react";
import "./GoalDropdown.css";
import { Modal } from "react-bootstrap";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
// import checkmark from "../../Assets/Images/checkmark_white.svg"
// import checkmark from "../../Assets/Images/checkmark_white.png";
import checkmark from "../../Assets/Images/checkmark-hover.png";


import { goalFilter, insuranceGoalFilter } from "../../common_utilities";
import { imagePath } from "../../constants";

const GoalsDropdown = (props) => {


  const [open, setOpen] = useState(true);
  const goalIdArray = useRef(
    props.selectedGoalsId ? props.selectedGoalsId : []
  );
  const goalNameArray = useRef(
    props.selectedGoals ? props.selectedGoals.split(",") : []
  );
  const goalPriorityArray = useRef(
    props.selectedPriorityArray ? props.selectedPriorityArray : []
  );
  const goalPriority = useRef(
    props.selectedGoalsId ? props.selectedGoalsId.length : 0
  );
  const [originalGoals, setOriginalGoals] = useState(
    props.goals ? props.goals : []
  );



  const [unchangedGoals, setUnchangedGoals] = useState(
    props.unchangedgoaldata ? props.unchangedgoaldata : []
  );
  const closeGoalsModal = () => {

    props.closeModal();

    originalGoals.forEach((goal) => {
      goal.priority = "";
    });

    setOriginalGoals([...originalGoals]);
    props.setAutoMatedGoal(true);


    // if (props.selectedGoals != "") {
    //   props.setAutoMatedGoal(false);

    //   originalGoals.forEach((goal) => {
    //     var priority_array = unchangedGoals.filter((filteredGoal) => {
    //       return filteredGoal.value == goal.value || filteredGoal.value == goal.goal_id
    //     })[0];

    //     console.log("priority_array", priority_array)

    //     if (priority_array) {
    //       goal.priority = priority_array.priority;
    //     }
    //   });
    //   setOriginalGoals([...originalGoals]);
    // } else {
    //   originalGoals.forEach((goal) => {
    //     goal.priority = "";
    //   });

    //   setOriginalGoals([...originalGoals]);
    //   props.setAutoMatedGoal(true);
    // }
  };
  useEffect(() => {
    if (props.selectedGoals == "Automated Linkage") {
      props.setAutoMatedGoal(true);
    }
  }, []);
  useEffect(() => {
    if (props.type == "Asset" && props.isGoalFilter == "Recurring") {
      if (props.user_asset_maturity_date) {
        var goals_array = [];
        var goals_array1 = [];
        var goalsFilter = goalFilter(props.goals, props.user_asset_maturity_date);
        if (goalsFilter) {
          if (goalsFilter.length > 0) {
            goalsFilter.map((goal) => {
              goals_array.push({
                value: goal.value,
                label: goal.label,
                goal_end_date: goal.goal_end_date,
                goal_start_date: goal.goal_start_date,
                goal_isRecurring: goal.goal_isRecurring == "1" ? "1" : "0",
                priority:
                  goalIdArray.current.indexOf(goal.value) != -1
                    ? goal.priority
                    : "",
              });
              goals_array1.push({
                value: goal.value,
                label: goal.label,
                goal_end_date: goal.goal_end_date,
                goal_start_date: goal.goal_start_date,
                goal_isRecurring: goal.goal_isRecurring == "1" ? "1" : "0",
                priority:
                  goalIdArray.current.indexOf(goal.value) != -1
                    ? goal.priority
                    : "",
              });
            });
            if (goals_array.length > 0) {
              setOriginalGoals([...goals_array]);
            }
            if (goals_array1.length > 0) {
              setUnchangedGoals([...goals_array1]);
            }
          } else {
            setOriginalGoals([]);
            setUnchangedGoals([]);
          }
          // setOriginalGoals([...goals_array])
          // setUnchangedGoals([...goals_array1])
        }
      }
    }
  }, [props.user_asset_maturity_date]);

  useEffect(() => {
    if (props.type == "Insurance") {
      if (props.insurancePolicyTerm && props.insurancePurchaseDate) {
        var goals_array = [];
        var goals_array1 = [];
        var insurance = insuranceGoalFilter(
          props.goals,
          props.insurancePolicyTerm,
          props.insurancePurchaseDate
        );
        if (insurance) {
          if (insurance.length > 0) {
            if (
              props?.insuranceCategoryId != 47 &&
              props?.insuranceCategoryId != 48
            ) {
              var contingencyGoal = props.unchangedgoaldata.filter((goal) => {
                return goal.label == "contingency goal-Family";
              })[0];
              if (contingencyGoal) {
                insurance.push(contingencyGoal);
              }
              insurance.map((goal) => {
                goals_array.push({
                  value: goal.value,
                  label: goal.label,
                  goal_end_date: goal.goal_end_date,
                  goal_start_date: goal.goal_start_date,
                  goal_isRecurring: goal.goal_isRecurring == "1" ? "1" : "0",
                  priority:
                    goalIdArray.current.indexOf(goal.value) != -1
                      ? goal.priority
                      : "",
                });
                goals_array1.push({
                  value: goal.value,
                  label: goal.label,
                  goal_end_date: goal.goal_end_date,
                  goal_start_date: goal.goal_start_date,
                  goal_isRecurring: goal.goal_isRecurring == "1" ? "1" : "0",
                  priority:
                    goalIdArray.current.indexOf(goal.value) != -1
                      ? goal.priority
                      : "",
                });
              });

              setOriginalGoals([...goals_array]);
              setUnchangedGoals([...goals_array1]);
            } else {
              insurance.map((goal) => {
                goals_array.push({
                  value: goal.value,
                  label: goal.label,
                  goal_end_date: goal.goal_end_date,
                  goal_start_date: goal.goal_start_date,
                  goal_isRecurring: goal.goal_isRecurring == "1" ? "1" : "0",
                  priority:
                    goalIdArray.current.indexOf(goal.value) != -1
                      ? goal.priority
                      : "",
                });
                goals_array1.push({
                  value: goal.value,
                  label: goal.label,
                  goal_end_date: goal.goal_end_date,
                  goal_start_date: goal.goal_start_date,
                  goal_isRecurring: goal.goal_isRecurring == "1" ? "1" : "0",
                  priority:
                    goalIdArray.current.indexOf(goal.value) != -1
                      ? goal.priority
                      : "",
                });
              });
              //   goals_array.push(contingencyGoal)
              //   goals_array1.push(contingencyGoal)
              setOriginalGoals([...goals_array]);
              setUnchangedGoals([...goals_array1]);
            }
          } else {
            setOriginalGoals([]);
            setUnchangedGoals([]);
          }
        }
      }
    }
  }, [props.insurancePolicyTerm, props.insurancePurchaseDate]);

  const handleModalClose = () => {
    if (goalIdArray.current.length == 0 && props.isAutoMatedGoal == false) {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Please select atleast one goal ");
    } else {
      props.closeModal();
      props.selectGoals(goalNameArray.current, goalIdArray.current, goalPriorityArray.current);
      props.selectedGoalIdArray(goalIdArray.current);
      props.setPriorityArray(goalPriorityArray.current);
      var goals = props.goals;
      props.unchangedgoaldata.forEach((goal) => {
        var priority_array = originalGoals.filter((filteredGoal) => {
          return filteredGoal.value == goal.value;
        })[0];
        if (priority_array) {
          goal.priority = priority_array.priority;
        }
      });

      props.goals.forEach((goal) => {
        var priority_array = originalGoals.filter((filteredGoal) => {
          return filteredGoal.value == goal.value;
        })[0];
        if (priority_array) {
          goal.priority = priority_array.priority;
        }
      });

      if (props.isAutoMatedGoal) {
        props.setAutoMatedGoal(true);
      } else {
        props.setAutoMatedGoal(false);
      }
      props.setGoalLink(goalIdArray.current);
    }
  };
  const reset = () => {
    props.setAutoMatedGoal(false);

    goalPriorityArray.current = [];
    goalPriority.current = 0;
    goalNameArray.current = [];
    goalIdArray.current = [];
    originalGoals.forEach((goal) => {
      goal.priority = "";
    });
    setOriginalGoals([...originalGoals]);
    // setDataChange(data=>!data)
  };

  const handleGoalSelect = (goalId, goalName, currenntGoalPriority) => {
    // setDataChange(data=>!data)
    if (goalName == "Automated Linkage") {
      props.setAutoMatedGoal(true);
      goalPriorityArray.current = [];
      goalPriority.current = 0;
      goalIdArray.current = [goalId];
      goalNameArray.current = [goalName];

      originalGoals.forEach((goal) => {
        goal.priority = "";
      });
      setOriginalGoals([...originalGoals]);
    } else {
      props.setAutoMatedGoal(false);

      if (goalIdArray.current.length == 0) {
        goalPriorityArray.current = [];
        goalPriority.current = 0;
      }
      if (goalIdArray.current.indexOf(goalId) == -1) {
        goalIdArray.current.push(goalId);
        goalNameArray.current.push(goalName);
        originalGoals.forEach((goal) => {
          if (goal.value == goalId) {
            if (goalPriority.current == 0) {
              goal.priority = 1;
              goalPriority.current = goalPriority.current + 1;
              goalPriorityArray.current.push(goalPriority.current);
            } else {
              goalPriority.current = goalPriority.current + 1;
              goal.priority = goalPriorityArray.current.length + 1;
              goalPriorityArray.current.push(goalPriority.current);
            }
          }
        });

        setOriginalGoals([...originalGoals]);
      } else {
        const index = goalIdArray.current.indexOf(goalId);

        const nameIndex = goalNameArray.current.findIndex((element) =>
          element.includes(goalName.split("-")[0].trim())
        );
        goalIdArray.current.splice(index, 1);
        goalNameArray.current.splice(nameIndex, 1);

        const priorityIndex =
          goalPriorityArray.current.indexOf(currenntGoalPriority);
        goalPriorityArray.current.splice(priorityIndex, 1);

        originalGoals.forEach((goal) => {
          if (goal.value == goalId) {
            goal.priority = "";
          } else {
            if (goal.priority && goal.priority != "" && goal.priority != 1) {
              if (
                currenntGoalPriority &&
                currenntGoalPriority < goal.priority
              ) {
                goalPriorityArray.current.push(goal.priority);
                const priorityIndex =
                  goalPriorityArray.current.indexOf(currenntGoalPriority);
                goalPriorityArray.current.splice(priorityIndex, 1);
                if (goal.priority == 1) {
                  goal.priority == "";
                } else if (!goal.priority) {
                  goal.priority == "";
                } else {
                  goal.priority = goal.priority - 1;
                }
              }
            }
          }
        });
        setOriginalGoals([...originalGoals]);
      }
    }
  };
  return (
    <div>
      <Modal show={open} className="popupmodal" centered>
        <Modal.Header className="ModalHead">
          <div className="d-flex" style={{ height: "26px" }}>
            <div className="w-100"> Link This {props.type} To Goals </div>

            <div className="">
              <img
                onClick={() => {
                  closeGoalsModal();
                }}
                className="pointer"
                src={imagePath + "/static/media/Images/cancel_white.svg"}
                width={40}
              />
            </div>
          </div>
          <small style={{ fontSize: "14px", fontWeight: "lighter" }}>
            You can set the priority as per your goals
          </small>
          <br></br>
        </Modal.Header>
        <div className=" p-3 d-grid place-items-center align-item-center">
          <div className=" HeaderModal mt-2">
            <div className="row py-md-2">
              <div className="col-12">
                <div className="material">
                  {open ? (
                    <div className="table-container">
                      <table className="goal-table">
                        <tbody className="dropdown-content">
                          <tr className="goal-table-header">
                            <th style={{ borderRight: "1px solid" }}>
                              Priority
                            </th>
                            <th>Goal Name</th>
                          </tr>
                          <tr
                            className={
                              props.isAutoMatedGoal ? `isAutomatedSelected` : ""
                            }
                            onClick={() =>
                              handleGoalSelect("", "Automated Linkage", "")
                            }
                          >
                            <td width={50} className="prioritytd">
                              <div className="circle">
                                {props.isAutoMatedGoal && (
                                  <img
                                    className={
                                      props.isAutoMatedGoal
                                        ? `checkmark-img`
                                        : ""
                                    }
                                    src={checkmark}
                                    width={40}
                                  />
                                )}
                              </div>
                            </td>
                            <td width={100} className="goalName">
                              Automated Linkage
                            </td>
                          </tr>
                          {
                            //console.log("isAutoMatedGoal", originalGoals)
                          }
                          {originalGoals &&
                            originalGoals.map((goal, index) => (
                              <tr
                                className={
                                  props.isAutoMatedGoal
                                    ? `disabled`
                                    : goal.priority
                                      ? `goalSelected`
                                      : ""
                                }
                                onClick={() =>
                                  handleGoalSelect(
                                    goal.value,
                                    goal.label,
                                    goal.priority ? goal.priority : null
                                  )
                                }
                              >
                                <td width={50} className="prioritytd">
                                  <div className="circle">{goal.priority}</div>
                                </td>
                                <td width={100} className="goalName">
                                  {goal.label || goal.goal_name}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ) : null}
                  <div style={{ textAlign: "center" }}>
                    <button
                      type="button"
                      className="btn LInkOTPBTn"
                      onClick={() => {
                        handleModalClose();
                      }}
                    >
                      Done
                    </button>
                    <button
                      type="button"
                      className="btn LInkOTPBTn"
                      onClick={() => {
                        reset();
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GoalsDropdown;
