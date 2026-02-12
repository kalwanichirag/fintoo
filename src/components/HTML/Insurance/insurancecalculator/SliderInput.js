import React, { useState, useEffect } from 'react';
import styles from './style.module.css';
import CustomSlider from './CustominsuranceSlider';

export const indianRupeeFormat = (v, decimal = null) => {
    if (isNaN(v) || v === null || v === undefined) return '';
    const options = {
        style: "currency",
        currency: "INR",
        ...(decimal !== null && { maximumFractionDigits: decimal }),
    };
    const s = Number(v).toLocaleString("en-IN", options);
    return s.replace("₹", "₹ ");
};

const SliderInput = ({ label, min, max, value, unit, onChange, formatValue, onBlur }) => {
    const [inputValue, setInputValue] = useState(value.toString());
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (!isFocused) {
            setInputValue(value.toString());
        }
    }, [value, isFocused]);

    const handleInputChange = (e) => {
        let raw = e.target.value;

        // If input is cleared
        if (raw === '') {
            setInputValue('');
            onChange('');
            return;
        }

        // Allow only digits and decimal point
        raw = raw.replace(/[^0-9.]/g, '');

        setInputValue(raw);

        const numeric = parseFloat(raw);
        if (!isNaN(numeric) && numeric >= min && numeric <= max) {
            onChange(numeric);
        }
    };


    const handleBlur = () => {
        setIsFocused(false);

        if (inputValue === '') {
            // Either keep empty or default to 0
            setInputValue('');
            onChange(''); // Or onChange(0) if you want to reset to 0
            if (onBlur) onBlur();
            return;
        }

        const numericValue = parseFloat(inputValue);
        if (!isNaN(numericValue)) {
            const clamped = Math.max(min, Math.min(numericValue, max));
            setInputValue(clamped.toString());
            onChange(clamped);
        } else {
            setInputValue(value.toString());
        }
        if (onBlur) onBlur();
    };


    const displayValue = () => {
        if (isFocused) return inputValue;
        if (inputValue === '') return '';
        return unit === "₹" ? indianRupeeFormat(Number(inputValue), 2) : `${inputValue} ${unit}`;
    };

    const formatToLacOrCr = (num) => {
        const value = Number(num);
        if (isNaN(value)) return '₹ 0';

        if (value >= 10000000) {
            return `₹ ${Math.round(value / 10000000)} Cr`;
        } else if (value >= 100000) {
            return `₹ ${Math.round(value / 100000)} Lac`;
        } else {
            return `₹ ${value.toLocaleString('en-IN')}`;
        }
    };

    const displayFormat = (val) => {
        if (unit === "₹") {
            return formatToLacOrCr(val);
        }
        return formatValue ? formatValue(val) : val;
    };

    return (
        <div className={styles.sliderContainer}>
            <div className={styles.labelRow}>
                <span>{label}</span>
                <div className={styles.inputWithUnit}>
                    <input
                        type="text"
                        className={styles.inputNumber}
                        value={displayValue()}
                        onFocus={() => setIsFocused(true)}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                    />
                </div>
            </div>

            <CustomSlider
                min={min}
                max={max}
                value={value}
                onChange={(val) => {
                    setInputValue(val.toString());
                    onChange(val);
                }}
            />

            <div className={styles.rangeLabels}>
                <span>{displayFormat(min)}</span>
                <span>{displayFormat(max)}</span>
            </div>
        </div>
    );
};

export default SliderInput;
