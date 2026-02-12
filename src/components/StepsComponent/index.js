import style from './style.module.css'

const StepComponent = ({ stepsData }) => {

    const showCheck = (current, completed) => {
        if (current) {
            return false;
        } else {
            return completed
        }
    }
    return (
        <div className={`${style.stepsContainer}`}>
            {
                stepsData.map((data, index) => <div className={`${style.stepItem}`} >
                    <div className={`${style.stepItemCount} ${data.stepCompleted || data.current ? '' : style.stepItemCountDisabled}`} >{
                        showCheck(data.current, data.stepCompleted) ? <i className="fa-solid fa-check"></i> : index + 1
                    }</div>
                    <div className={`${style.stepConnector} ${data.current || data.stepCompleted ? '' : style.stepItemCountDisabled}`}></div>
                    <div className={`${style.stepName}`} >{data.name}</div>
                </div>)
            }
        </div>
    )
}

export default StepComponent