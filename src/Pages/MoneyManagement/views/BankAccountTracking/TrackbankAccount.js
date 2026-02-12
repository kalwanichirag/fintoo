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
import { DataProvider } from '../../context/DataContext';
import { getItemLocal } from '../../../../common_utilities';
import { useNavigate } from 'react-router-dom';
import * as toastr from "toastr";

const TrackbankAccount = (props) => {

    const navigate = useNavigate();
    useEffect(() => {
        if (getItemLocal("family") == '1') {
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error('Please select member');
            return navigate(`${process.env.PUBLIC_URL}/money-management/bank-tracking-overview`);
        }
    }, [])

    return (
            <DataProvider>
                <div>
                    {/* <HideFooter /> */}
                    <ApplyWhiteBg />
                    <div className={`${Styles.trackbankaccount}`}>
                        {/* <div className={`${Styles.AccountHolderName}`}>Track Your Bank Account <span>Bipin mishra</span></div> */}
                        <BankTrackingProcess />
                        {/* <BankTrackingProcess /> */}
                        {/* <div className={`${Styles.AccountHolderName}`}>Track Your Bank Account <span>Bipin mishra</span></div> */}

                        {/* <BankTrackingProcess /> */}
                        {/* <BankAccountDataView /> */}
                        {/* <AccountBalance /> */}
                    </div>
                </div>
            </DataProvider>
    )
};
export default TrackbankAccount;
