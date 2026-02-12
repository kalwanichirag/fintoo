import React, { useState } from "react";
import Styles from "./Bonds.module.css";
import { SlClose } from "react-icons/sl";

function formatToIndianRupee(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

function BondCalculator(props) {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleDecrement = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  let principalAmount = 1014906.0;
  let accruedInterest = 7134.0;
  let investmentAmount = 1022094.0;
  let interestEarned = 461884.93;
  let estimatedReturns = 1461884.93;

  // Update amounts with count
  principalAmount *= 1 + count;
  accruedInterest *= 1 + count;
  investmentAmount *= 1 + count;
  interestEarned *= 1 + count;
  estimatedReturns *= 1 + count;

  return (
    <div>
      <div className={`d-md-none d-block ${Styles.Popupclose}`}>
        <SlClose
          style={{
            fontSize: "1.5rem",
            position: "absolute",
            right: "1rem",
            top: "1rem",
          }}
          onClick={props.onCloseModal}
        />
      </div>
      <div className={`${Styles.BondCalculator}`}>
        <div className={`${Styles.bondheader}`}>Calculate Investment</div>
        <div className={`${Styles.countercontainer}`}>
          <button className={`${Styles.button}`} onClick={handleDecrement}>
            -
          </button>
          <div className={`${Styles.count}`}>{count}</div>
          <button className={`${Styles.button}`} onClick={handleIncrement}>
            +
          </button>
        </div>
        <div className={`${Styles.calDetails}`}>
          <div>
            <div className={`${Styles.label}`}>Principal Amount</div>
            <div className={`${Styles.Amount}`}>
              {formatToIndianRupee(principalAmount)}
            </div>
          </div>
          <div className={`${Styles.Vrline}`}></div>
          <div className="text-center">
            <div className={`${Styles.label}`}>
              Accrued Interest{" "}
              <div className={`${Styles.bondvaliddate}`}>
                (till 3rd March 2023)
              </div>
            </div>
            <div className={`${Styles.Amount}`}>
              {formatToIndianRupee(accruedInterest)}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className={`${Styles.investtitle}`}>Total Investment</div>
          <div className={`${Styles.investamount}`}>
            {formatToIndianRupee(investmentAmount)}
          </div>
        </div>
        <hr className={`m-4 mt-3 ${Styles.hrline}`} />
        <div className={`${Styles.calDetails}`}>
          <div>
            <div className={`${Styles.label}`}>Investment Amount</div>
            <div className={`${Styles.Amount}`}>
              {formatToIndianRupee(principalAmount)}
            </div>
          </div>
          <div className={`${Styles.Vrline}`}></div>
          <div className="text-left">
            <div className={`${Styles.label}`}>Interest Earned</div>
            <div className={`${Styles.Amount}`}>
              {formatToIndianRupee(interestEarned)}
            </div>
          </div>
        </div>
        <div className={`mt-4 ${Styles.maturityReturn}`}>
          <div className={`${Styles.bondheader}`}>
            Estimated Returns on <br /> Maturity
          </div>
          <div className={`pt-1 ${Styles.investamount}`}>
            {formatToIndianRupee(estimatedReturns)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BondCalculator;
