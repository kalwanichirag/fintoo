import React, { useState, useEffect } from "react";

const OTPResend = ({ resendTime = 30, resendFunction, children }) => {
    const [counter, setCounter] = useState(resendTime);
    const [isClickable, setIsClickable] = useState(false);

    useEffect(() => {
        let timer;
        if (counter > 0) {
            timer = setTimeout(() => setCounter(counter - 1), 1000);
        } else {
            setIsClickable(true);
        }
        return () => clearTimeout(timer);
    }, [counter]);


    const handleResend = () => {
        if (!isClickable) return;
        resendFunction();
        setCounter(resendTime);
        setIsClickable(false);
    };

    return (
        <div>
            {typeof children === "function"
                ? children({ counter, isClickable, handleResend })
                : null}
        </div>
    );
};

export default OTPResend;
