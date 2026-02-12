import React, { useState, useEffect } from 'react';
import style from '../../style.module.css';
import Styles from '../../moneymanagement.module.css';
import ApplyWhiteBg from '../../../../components/ApplyWhiteBg';
import BankAccountDataView from '../BankAccountDataView/BankAccountDataView';
import MyDashBoard from '../../components/AccountBalance/MyDashBoard';
import commonEncode from '../../../../commonEncode';
// import ActiveAccounts from '../../components/AccountBalance/ActiveAccounts';
import {
    CheckSession,
    getMemberId,
    getUserId,
    removeMemberId,
    setFpUserDetailsId,
    setMemberId,
    setUserId
} from '../../../../common_utilities';
const DashBoard = (props) => {
    const [currentUsername, setCurrentUsername] = useState("");

    useEffect(() => {
        try {
            let isFamilySelected = Boolean(localStorage.getItem("family"));
            if (!isFamilySelected) {
                let users = JSON.parse(commonEncode.decrypt(localStorage.getItem("member")));
                let currentUser = getMemberId();
                if (!currentUser) {
                    currentUser = getUserId();
                }
                setCurrentUsername(users.filter(v => v.id == currentUser)[0]['name']);
                // let users = JSON.parse(commonEncode.decrypt(localStorage.getItem("member")));
                // setCurrentUsername(users[0].name);
            } else {
                setCurrentUsername("For Family");
            }
        } catch {
            setCurrentUsername('');
        }
    }, [])




    return (
            <div>
                <ApplyWhiteBg />
                <div className={`${Styles.trackbankaccount}`}>
                    <div className={`${Styles.AccountHolderName}`}>
                        Track Your Bank Account <span>{currentUsername}</span>
                    </div>
                    <MyDashBoard />
                    {/* <ActiveAccounts /> */}
                </div>
            </div>
    )
};
export default DashBoard;
