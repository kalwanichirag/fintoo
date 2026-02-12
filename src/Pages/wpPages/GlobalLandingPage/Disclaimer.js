import React from "react";
import styles from "./style.module.css";


const Disclaimer = () => {

    return (
        <div className={`${styles.DisclaimerContainer}`} style={{ backgroundColor: '#042b62', color: 'white', fontSize: '1rem' }}>
            <p> <span style={{ fontWeight: 'bold' }}>Disclaimer:</span>
                <br />
                Global investment diversification and advisory services are offered exclusively on a reserved solicitation basis, following a comprehensive explanation of the associated risk evaluation and compliance processes to the client.
                For ESOP or RSU migrations, clients are required to transfer these assets from their source accounts to Fintoo Wealth Private Limited's Interactive Brokers (IBKR) account at their discretion. Fintoo Wealth Private Limited leverages IBKR’s advanced technology platform to facilitate global investment advisory services.
                Upon assessing the client’s risk appetite in consultation with both Global and Financial/Investment Advisors, a customized global investment strategy will be developed. This strategy may include, but is not limited to, direct stocks, treasury bills, ETFs, and mutual funds, ensuring alignment with the client’s financial objectives and risk tolerance.
            </p>
        </div>
    );
}

export default Disclaimer;
