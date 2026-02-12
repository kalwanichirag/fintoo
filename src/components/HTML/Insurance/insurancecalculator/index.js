import React, { useState } from 'react';
import style from './style.module.css';
import SliderInput from './SliderInput';
import InvestmentSummary from './InvestmentSummary';

const roundLifeCover = (value) => {
    if (value < 5000000) {
        return Math.ceil(value / 500000) * 500000;
    }
    if (value >= 5000000 && value < 7500000) {
        return 7500000;
    }
    if (value >= 7500000 && value < 10000000) {
        return 10000000;
    }
    if (value >= 10000000 && value < 50000000) {
        return Math.round(value / 5000000) * 5000000;
    }
    return Math.round(value / 10000000) * 10000000;
};

const Insurancecalculator = ({ title, description }) => {
    const [monthlyExpense, setMonthlyExpense] = useState(20000);
    const [currentAge, setCurrentAge] = useState(30);
    const [inflationRate, setInflationRate] = useState(6);
    const [roi, setROI] = useState(8);
    const [outstandingLoanAmount, setOutstandingLoanAmount] = useState(0);
    const [existingLifeCover, setExistingLifeCover] = useState(0);

    const lifeExpectancyAge = 85;

    const annualExpense = monthlyExpense * 12;
    const yearsRemaining = lifeExpectancyAge - currentAge;

    const realRate = parseFloat((((1 + roi / 100) / (1 + inflationRate / 100)) - 1) * 100).toFixed(5);

    let presentValueOfFutureExpense;

    if (parseFloat(realRate) === 0) {
        presentValueOfFutureExpense = annualExpense * yearsRemaining;
    } else {
        presentValueOfFutureExpense = annualExpense * (
            (1 - Math.pow(1 + realRate / 100, -yearsRemaining)) / (realRate / 100)
        );
    }

    presentValueOfFutureExpense = parseFloat(presentValueOfFutureExpense).toFixed();


    const humanLifeValue = parseFloat(presentValueOfFutureExpense) + outstandingLoanAmount - existingLifeCover;
    const netLifeCoverNeeded = humanLifeValue - existingLifeCover;

    const Roundofhlvvalue = roundLifeCover(netLifeCoverNeeded);

    return (
        <div className={`container ${style.Insurancecalculator}`}>
            <div className={style.Insurancecalculatortitle}>{title}</div>
            <div className={style.Insurancecalculatordescription}>{description}</div>
            <div className={`row ${style.calculatorContainer}`}>
                <div className={`col-md-5 col-12 ${style.leftPanel}`}>
                    <SliderInput
                        label="Total Monthly Expenses"
                        min={500}
                        max={1000000}
                        value={monthlyExpense}
                        onChange={(val) => setMonthlyExpense(Number(val))}
                        formatValue={(val) => `₹ ${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(val)}`}
                        unit="₹"
                    />
                    <SliderInput
                        label="Current Age"
                        min={1}
                        max={100}
                        value={currentAge}
                        onChange={(val) => setCurrentAge(Number(val))}
                        formatValue={(val) => `${val} ${val === 1 ? 'Year' : 'Years'}`}
                        unit={currentAge === 1 ? 'Year' : 'Years'}
                    />

                    <SliderInput
                        label="Outstanding Loan Amount"
                        min={0}
                        max={10000000}
                        value={outstandingLoanAmount}
                        onChange={(val) => setOutstandingLoanAmount(Number(val))}
                        formatValue={(val) => `₹ ${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(val)}`}
                        unit="₹"
                    />
                    <SliderInput
                        label="Existing Life Cover"
                        min={0}
                        max={50000000}
                        value={existingLifeCover}
                        onChange={(val) => setExistingLifeCover(Number(val))}
                        formatValue={(val) => `₹ ${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(val)}`}
                        unit="₹"
                    />
                    <p>
                        We have kept below few values constant throughout the working of the calculator. However, you can customize them as per your requirements.
                    </p>
                    <SliderInput
                        label="Inflation Rate"
                        min={1}
                        max={30}
                        value={inflationRate}
                        onChange={(val) => setInflationRate(Number(val))}
                        formatValue={(val) => `${val} %`}
                        unit="%"
                    />
                    <SliderInput
                        label="Rate of Return (ROI)"
                        min={1}
                        max={30}
                        value={roi}
                        onChange={(val) => setROI(Number(val))}
                        formatValue={(val) => `${val} %`}
                        unit="%"
                    />
                </div>
                <div className={`col-2 ${style.Divider}`}></div>
                <div className={`col-md-5 col-12 ${style.rightPanel}`}>
                    <InvestmentSummary
                        totalLifeCoverNeeded={presentValueOfFutureExpense}
                        existingLifeCover={existingLifeCover}
                        netLifeCoverNeeded={humanLifeValue}
                        Roundofhlvvalue={Roundofhlvvalue}
                    />
                </div>
            </div>
        </div>
    );
};

export default Insurancecalculator;
