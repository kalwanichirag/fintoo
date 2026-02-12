import React, { useEffect, useState } from "react";
import Bankbalance from '../BankCashbalance/Bankbalance.module.css'
import HideFooter from "../../../components/HideFooter";
import HideHeader from "../../../components/HideHeader";
import { Link } from "react-router-dom";

function Waiting(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const loadingDuration = 3000; // 3 seconds

    useEffect(() => {
        let loadingTimeout = setTimeout(() => {
            if (progress >= 100) return;
            setProgress(progress + 1);
        }, loadingDuration / 100);

        if (progress === 100) {
            setIsLoading(false);
        }

        return () => {
            clearTimeout(loadingTimeout);
        };
    }, [progress]);

    const size = 150;
    const trackWidth = 10;
    const indicatorWidth = 10;
    const trackColor = `#f0f0f0`;
    const indicatorColor = `#042b62`;
    const indicatorCap = `round`;
    const spinnerMode = false;
    const spinnerSpeed = 1;

    const center = size / 2;
    const radius = center - (trackWidth > indicatorWidth ? trackWidth : indicatorWidth);
    const dashArray = 2 * Math.PI * radius;
    const dashOffset = dashArray * ((100 - progress) / 100);

    return (
        <div>
            <HideHeader />
            <div className={`white-modal fn-redeem-modal ${Bankbalance.BanklistData}`}>
                <div className={`${Bankbalance.BankaccLoader}`}>
                    <div className={`${Bankbalance.svgpiwrapper}`} style={{ width: size, height: size }}>
                        <svg className="svg-pi" style={{ width: size, height: size }}>
                            <circle
                                className="svg-pi-track"
                                cx={center}
                                cy={center}
                                fill="transparent"
                                r={radius}
                                stroke={trackColor}
                                strokeWidth={trackWidth}
                            />

                            <circle
                                className={`svg-pi-indicator ${spinnerMode ? "svg-pi-indicator--spinner" : ""}`}
                                style={{ animationDuration: `${spinnerSpeed * 1000}ms` }}
                                cx={center}
                                cy={center}
                                fill="transparent"
                                r={radius}
                                stroke={indicatorColor}
                                strokeWidth={indicatorWidth}
                                strokeDasharray={dashArray}
                                strokeDashoffset={dashOffset}
                                strokeLinecap={indicatorCap}
                            />

                            <image
                                x={center - 25} // Adjust the position as needed
                                y={center - 20} // Adjust the position as needed
                                width="50"
                                height="50"
                                href={process.env.REACT_APP_STATIC_URL + "media/wp/FintooImg.png"}
                            />
                        </svg>
                    </div>
                    <p className={`${Bankbalance.LoadContent}`}>Please Wait While We Fetch Your Account Details</p>
                </div>
            </div>
            <HideFooter />
        </div>
    );
}

export default Waiting;
