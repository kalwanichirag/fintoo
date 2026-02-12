import React, { useState } from "react";
import Loader from "../Assets/Images/Rolling-1s-200px.svg";
import { memo } from "react";
import FintooLoader from "./FintooLoader";
const styles = {
    parentDiv: {
        textAlign: 'center'
    },
    loaderTxt: {
        paddingTop: '5px'
    }
};
const FintooInlineLoader = ({ isLoading, hideText = true }) => {
    return (
        <>
            {isLoading ? (<div style={styles.parentDiv}>
                <img src={Loader} style={{ width: '30px' }} />
                {hideText == false && <p style={styles.loaderTxt}>Loading...</p>}
            </div>) : <></>}
        </>
    );
}
export default memo(FintooInlineLoader);

const CircularProgressBar = memo(({ percentage }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    let color;
    if (percentage < 50) {
        color = 'red';
    } else if (percentage < 75) {
        color = 'orange';
    } else {
        color = 'green';
    }

    return (
        <div style={styles.parentDiv}>
            <svg width="120" height="120" viewBox="0 0 120 120">
                <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke="#e6e6e6"
                    fill="none"
                    strokeWidth="10"
                />
                <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke={color}
                    fill="none"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                />
                <text
                    x="60"
                    y="60"
                    textAnchor="middle"
                    dy="0.3em"
                    fontSize="20px"
                    fill={color}
                >
                    {`${percentage}%`}
                </text>
            </svg>
        </div>

    );
});

export { CircularProgressBar }

const FintooLogoLoader = memo(({ message }) => {
    const[isLoading, setIsLoading] = useState(true);

    return (
        <div style={styles.parentDiv}>
            <FintooLoader isLoading={isLoading} />
            <p style={styles.loaderTxt}>{message}</p>
        </div>
    );
});

export { FintooLogoLoader }