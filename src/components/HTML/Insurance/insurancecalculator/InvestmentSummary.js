import React from 'react';
import styles from './style.module.css';
import { indianRupeeFormat } from '../../../../common_utilities';

const InvestmentSummary = ({ totalLifeCoverNeeded = 0, existingLifeCover = 0, netLifeCoverNeeded = 0, Roundofhlvvalue=0 }) => {

    const formatToLacOrCr = (num) => {
        const value = Number(num);
        if (isNaN(value) || value < 0) return '₹ 0';
    
        if (value >= 10000000) {
            return `₹ ${Math.round(value / 10000000)} Cr`;
        } else if (value >= 100000) {
            return `₹ ${Math.round(value / 100000)} Lac`;
        } else {
            return `₹ ${value.toLocaleString('en-IN')}`;
        }
    };
    

    const formatValue = (value) => {
        const numericValue = Number(value);
        return isNaN(numericValue) ? '₹ 0' : indianRupeeFormat(numericValue);
    };

    return (
        <div className={styles.summaryContainer}>
            <div>
                <h2>Total Life Cover Needed</h2>
                <h3 className={styles.totalValue}>{formatValue(totalLifeCoverNeeded)}</h3>
            </div>
            <div>
                <h2>Existing Life Cover</h2>
                <h3 className={styles.totalValue}>{formatValue(existingLifeCover)}</h3>
            </div>
            <div>
                <h2>Human Life Value</h2>
                <h3 className={styles.totalValue}>{formatValue(netLifeCoverNeeded)}</h3>
            </div>
            <div className={styles.notelifeInsurance}>
                {/* <div className='d-flex justify-content-center align-items-center'>
                    <div className={styles.dot}></div>
                    <div className='ms-2'>Note</div>
                </div> */}
                <div className={styles.note}>Your Required Life Cover to Secure your loved ones is </div>
                <h3 style={{ color: "#fff", padding: "0", margin: '0' }} className={styles.totalValue}>{formatToLacOrCr(Roundofhlvvalue)}</h3>
            </div>
        </div>
    );
};

export default InvestmentSummary;
