import { useRef, useState } from "react";
import Styles from "./style.module.css";
import FintooLoader from "../../../../components/FintooLoader";
const ProgressBar = ({progress}) => {
    // const now = 42;
    const [isLoading, setIsLoading] = useState(true);
    return (
        <>
            <div
                className={` DeamtBasicDetailsSection ${Styles.BasicDetailsSection}`}
            >
                <div className="mt-5">
                    <div>
                        <center>
                            {/* <img
                                className="ms-2"
                                src={
                                    process.env.REACT_APP_STATIC_URL +
                                    "media/Loader.gif"
                                }
                                alt="Loader"
                                width={150}
                            /> */}
                             <FintooLoader isLoading={isLoading} />
                        </center>
                        <div className={`${Styles.ProgressBar}`}>
                            <div className={`${Styles.progress}`}>
                                <div
                                    className={`${Styles.progressview} custom-background-color`}
                                    // className="progress-bar"
                                    role="progressbar"
                                    style={{ width: `${progress}%`, background: "#042b62" }}
                                    aria-valuenow={progress}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                ></div>
                            </div>
                            <div className={`${Styles.Progresstext}`}>
                                {progress}% completed
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default ProgressBar;
