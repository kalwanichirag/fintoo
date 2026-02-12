import React from 'react'
import Style from "./Style.module.css"
const FPPlanner = ({ title, textInfo, textInfo2 }) => {
    return (
        <div className={` ${Style.FPPlanner}`}>
            <div className='mb-4'>
                <h2 className={`text-center ${Style.FPPlannertitle}`}>{title}</h2>
            </div>
            <div className={` ${Style.FPPlannerinfo}`}>
                <div>
                    {
                        textInfo
                    }
                </div>
                {
                    textInfo2 && (
                        <div>
                            <br />
                            {
                                textInfo2
                            }
                        </div>

                    )
                }
            </div>
        </div>
    )
}

export default FPPlanner;
