import React, { useEffect, useState } from 'react';
import style from '../../style.module.css';
import Trackbankstepper from '../../components/BankTrackingProcess/Trackbankstepper';
import Styles from '../../moneymanagement.module.css';
import HideFooter from '../../../../components/HideFooter';
import ApplyWhiteBg from '../../../../components/ApplyWhiteBg';
import SelectBanks from '../../TrackBankAccount/SelectBanks';
import BankTrackingProcess from '../../components/BankTrackingProcess/BankTrackingProcess';
import BankAccountDataView from '../BankAccountDataView/BankAccountDataView';
import AccountBalance from '../AccountBalance/AccountBalance';
import { CheckSession } from '../../../../common_utilities';
import { useSelector } from 'react-redux';
const TrackbankAccount3 = (props) => {

    return (
            <div>
                {/* <HideFooter /> */}
                <ApplyWhiteBg />
                <div className={`${Styles.trackbankaccount}`}>
                    {/* <div className={`${Styles.AccountHolderName}`}>Track Your Bank Account <span>Bipin mishra</span></div> */}
                    {/* <BankTrackingProcess /> */}
                    {/* <BankTrackingProcess /> */}
                    {/* <div className={`${Styles.AccountHolderName}`}>Track Your Bank Account <span>Bipin mishra</span></div> */}

                    {/* <BankTrackingProcess /> */}
                    <BankAccountDataView />
                    {/* <AccountBalance /> */}
                </div>
            </div>
    )
};
export default TrackbankAccount3;
