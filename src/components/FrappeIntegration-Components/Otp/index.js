
import React, { useEffect, useState } from 'react';
import styles from './Otpview.module.css';
import { numericKeysRegex } from '../../../Utils/FrappeIntegration-Utils/regex';

export default function Otpview({
    otp,
    length = 5,
    error,
    onChange,
    onComplete,
    onError,
    containerStyle,
    inputStyle,
    text,
}) {

    const validateOtp = (otpString) => /^\d+$/.test(otpString) && otpString.length === length;
    const handleInput = (e, index) => {
        const { value } = e.target;
        if (/^\d$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            onChange(newOtp);
            if (index < length - 1) {
                const nextInput = document.getElementById(`otp-input-${index + 1}`);
                nextInput?.focus();
            }
            if (newOtp.join("").length === length) {
                if (validateOtp(newOtp.join(""))) {
                    onComplete(newOtp.join(""));
                } else {
                }
            }
        } else if (value === "") {
            const newOtp = [...otp];
            newOtp[index] = "";
            onChange(newOtp);
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            const newOtp = [...otp];
            if (!otp[index] && index > 0) {
                const prevInput = document.getElementById(`otp-input-${index - 1}`);
                prevInput?.focus();
            }
            newOtp[index] = "";
            onChange(newOtp);
        }
    };

    const handlePaste = (e) => {
        const pastedData = e.clipboardData.getData("text").slice(0, length);

        if (/^\d+$/.test(pastedData)) {
            const newOtp = [...otp];
            pastedData.split("").forEach((char, i) => {
                if (i < length) {
                    newOtp[i] = char;
                }
            });
            onChange(newOtp);
            if (newOtp.join("").length === length) {
                if (validateOtp(newOtp.join(""))) {
                    onComplete(newOtp.join(""));
                    onError("");
                } else {
                    onError("Invalid OTP. Please enter the correct code.");
                }
            }
            const nextIndex = Math.min(pastedData.length, length - 1);
            const nextInput = document.getElementById(`otp-input-${nextIndex}`);
            nextInput?.focus();
        }
    };

    useEffect(() => {
        const firstInput = document.getElementById("otp-input-0");
        firstInput?.focus();
    }, []);

    return (
        <div className={styles.otpWrapper} onPaste={handlePaste}>
            <div>
                <p className={styles.otpText}>{text}</p>
                <div className={styles.otpInputContainer} style={containerStyle}>
                    {otp?.map((value, index) => (
                        <input
                            key={index}
                            id={`otp-input-${index}`}
                            type="text"
                            maxLength="1"
                            autoComplete={false}
                            value={value}
                            onInput={(e) => handleInput(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            // style={{
                            //     width: "40px",
                            //     height: "40px",
                            //     textAlign: "center",
                            //     fontSize: "18px",
                            //     border: "1px solid #aeaeae",
                            //     borderRadius: "5px",
                            //     outline: "none",
                            //     ...inputStyle,
                            // }}
                            className={styles.otpInput}
                            onFocus={(e) => (e.target.style.borderColor = "#0758C9")}
                            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
                        />
                    ))}
                </div>
                {error && <p className={styles.otpError}>{error}</p>}
            </div>
        </div>
    );
}

export const OTPInput = ({ length, isRectangular, onComplete, isPin, otp, setOtp, ID, externalStyle }) => {
    // const [otp, setOtp] = useState(Array(length).fill(""));

    // Handle input change
    const handleChange = (value, index) => {
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Ensure only one character is input
        setOtp(newOtp);

        // Move to next input if value is entered
        if (value && index < length - 1) {
            document.getElementById(`otp-${index + 1}${ID ? ID : ''}`).focus();
        }
    };

    // Handle backspace key to move focus to the previous input
    const handleKeyDown = (event, index) => {
        const allowedKeys = [
            "Backspace",
            "ArrowLeft",
            "ArrowRight",
            "Tab",
        ];

        if (
            !allowedKeys.includes(event.key) && // Allow special keys
            !numericKeysRegex.test(event.key) // Allow numeric keys
        ) {
            event.preventDefault();
        }

        if (event.key === "Backspace" && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}${ID ? ID : ''}`).focus();
        }

        if (event.key === "Enter" && otp.every((digit) => digit !== "")) {
            onComplete && onComplete(otp.join(""));
        }
    };

    useEffect(() => {
        const firstInput = document.getElementById("otp-0");
        firstInput?.focus();
    }, []);

    // useEffect(() => {
    //     const firstInput = document.getElementById(`otp-0${ID ? ID : ''}`);
    //     firstInput?.focus();
    // }, [ID]);

    return (
        <div className={styles.otpInputBox}>
            <div className={styles.otpRow}>
                {otp.map((value, index) => (
                    <div key={index} className={`${styles.otpCell} ${isRectangular ? styles.otpCellRect : ''}`}>
                        <input
                            key={index}
                            id={`otp-${index}${ID ? ID : ''}`}
                            type={isPin?"password":"text"}
                            inputMode="numeric"
                            autoComplete="off"
                            maxLength="1"
                            value={value}
                            onChange={(e) => handleChange(e.target.value, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className={`${externalStyle ? styles.otpInputFieldSized : styles.otpInputField}`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

