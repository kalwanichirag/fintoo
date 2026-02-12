import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import checkmark from "../../Assets/Images/checkmark.png";
import { imagePath } from "../../constants";

const GoalSelectionModal = ({
  goalsData,
  isOpenGoalSelectionModal,
  setIsOpenGoalSelectionModal,
  handleOnClose,
  assetData,
  onHide
}) => {
  const defaultGoal = { label: "Automated Linkage", value: 0 };

  const [tempPriorityArray, setTempPriorityArray] = useState([]);

  const updateGoals = () => {
    const goals = tempPriorityArray.length > 0 ? tempPriorityArray : [defaultGoal.value];

    const selectedGoals = goals.map((goalId, index) => ({
      linkage_goal_id: goalId,
      linkage_priority: index + 1
    }));

    handleOnClose({ selectedGoals });
    setIsOpenGoalSelectionModal(false);
  };

  const reset = () => {
    setTempPriorityArray([]);
  };

  useEffect(() => {
    try {
      if (Array.isArray(assetData?.linked_goals) && assetData.linked_goals.length > 0) {
        const orderedGoals = [...assetData.linked_goals]
          .sort((a, b) => a.linkage_priority - b.linkage_priority)
          .map((g) => {
            const id = g.linkage_goal_id;
            return /^\d+$/.test(id) ? Number(id) : id;
          });

        setTempPriorityArray(orderedGoals);
      } else {
        setTempPriorityArray([defaultGoal.value]);
      }
    } catch {
      setTempPriorityArray([defaultGoal.value]);
    }
  }, [assetData?.linked_goals]);




  return (
    <Modal show={isOpenGoalSelectionModal} className="popupmodal" centered onHide={onHide}>
      <Modal.Header className="ModalHead">
        <div className="d-flex" style={{ height: "26px" }}>
          <div className="w-100"> Link This Asset To Goals</div>
          <div>
            <img
              onClick={() => {
                setIsOpenGoalSelectionModal(false);
                onHide();
              }}
              className="pointer"
              src={ imagePath + "/static/media/Images/cancel_white.svg"}
              width={40}
            />
          </div>
        </div>
        <small style={{ fontSize: "14px", fontWeight: "lighter" }}>
          You can set the priority as per your goals
        </small>
      </Modal.Header>

      <Modal.Body>
        <div className="table-container">
          <table className="goal-table">
            <thead>
              <tr className="goal-table-header">
                <td>Priority</td>
                <td>Goal Name</td>
              </tr>
            </thead>
            <tbody className="dropdown-content">
              {goalsData.map((goal) => {
                const isSelected = tempPriorityArray.includes(goal.value);
                const index = tempPriorityArray.indexOf(goal.value);
                const isAutomatedLinkageSelected = tempPriorityArray.includes(defaultGoal.value);
                const isOtherGoalSelected = tempPriorityArray.some((val) => val !== defaultGoal.value);
                const isDisabled =
                  (goal.value === defaultGoal.value && isOtherGoalSelected) || // disable default if others selected
                  (goal.value !== defaultGoal.value && isAutomatedLinkageSelected);
                return (
                  <tr
                    key={goal.value}
                    className={`${isSelected ? "goalSelected" : ""} ${isDisabled ? "goalDisabled" : ""}`}
                    onClick={() => {
                      if (isDisabled) return;

                      setTempPriorityArray((prev) => {
                        // Selecting "Automated Linkage"
                        if (goal.value === defaultGoal.value) {
                          return [defaultGoal.value];
                        } else {
                          // Selecting other goal(s)
                          if (prev.includes(goal.value)) {
                            const updated = prev.filter((v) => v !== goal.value);
                            return updated.length === 0 ? [defaultGoal.value] : updated;
                          } else {
                            return [...prev.filter((v) => v !== defaultGoal.value), goal.value];
                          }
                        }
                      });
                    }}
                    style={{ cursor: isDisabled ? "not-allowed" : "pointer", opacity: isDisabled ? 0.5 : 1 }}
                  >
                    <td width={50} className="prioritytd">
                      {goal.value === defaultGoal.value && isSelected ? (
                        <div className="circle">
                          <img className="checkmark-img" src={checkmark} width={40} />
                        </div>
                      ) : (
                        <div className="circle">{index >= 0 ? index + 1 : ""}</div>
                      )}
                    </td>
                    <td width={100} className="goalName">{goal.label}</td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      </Modal.Body>

      <Modal.Footer className="my-modal-footer">
        <div style={{ textAlign: "center" }}>
          <button type="button" className="btn LInkOTPBTn" onClick={updateGoals}>
            Done
          </button>
          <button type="button" className="btn LInkOTPBTn" onClick={reset}>
            Reset
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default GoalSelectionModal;
