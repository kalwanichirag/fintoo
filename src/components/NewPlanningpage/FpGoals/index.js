import React from 'react'
import Style from "./style.module.css"
const FpGoals = () => {
    return (
        <div className={`${Style.FpGoals}`}>
            <h2 className={`${Style.FpGoalstitle}`}>
                Ready to Achieve Your Financial Goals?
            </h2>
            <div className={`${Style.FpGoalssubtitle}`}>Don’t leave your financial future to chance—partner with Fintoo for holistic advice and expert guidance that puts you on the path to financial success.
            </div>
            <div className={`${Style.btn}`}>
                <button>Get Started Today!</button>
            </div>
        </div>
    )
}

export default FpGoals
