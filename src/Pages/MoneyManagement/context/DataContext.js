import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [selectedUserData, setSelectedUserData] = useState(null);
    const [mob_no, setMobNo] = useState();
    const [trackMonth, setTrackMonth]  = useState("3 Month");
    const [handleId, setHandleId]  = useState(null);
    const [otpReference, setOtpReference] = useState(null);
    const [sidData, setSidData] = useState(null);
    const [counter, setCounter] = useState(null);
    const [res, setRes] = useState(null);
    const [data_dict, setDataDict] = useState(null);
    const [data_fetch_dict, setDataFetchDict] = useState(null);
    const [data_fetch_user_info, setDataFetchUserInfo] = useState(null);
    const [bankIdDetails, setBankIdDetails] = useState(null);
    const [accDiscData, setaccDiscData] = useState(null);
    const [linkedAccData, setLinkedAccData] = useState(null);
    const [secondAccHandleId, setSecondAccountHandleId] = useState(null);
    const [mergeAccDetails, setMergeAccountDetails] = useState(null);
    const [handleIdfromConsent, setHandleIdfromConsent] = useState(null);
    const [linkingRefNum, setLinkingRefNum] = useState(null);
    const [jwtToken, setJwtToken] = useState(null);
    const [finvuToken, setFinvuToken] = useState(null);
    const [consentId, setConsentId] = useState(null);
    const [customerInfo, setCustomerInfo] = useState(null);
    const [statementAccounts, setStatementAccounts] = useState(null);
    const [xnsOther, setXnsOther] = useState(null);
    const [xnsExceptOther, setXnsExceptOther] = useState(null);

    return (
        <DataContext.Provider
        value={{
            selectedUserData,
            setSelectedUserData,
            trackMonth,
            setTrackMonth,
            mob_no,
            setMobNo,
            handleId,
            setHandleId,
            otpReference,
            setOtpReference,
            sidData,
            setSidData,
            counter,
            setCounter,
            res,
            setRes,
            data_dict,
            setDataDict,
            data_fetch_dict,
            setDataFetchDict,
            data_fetch_user_info,
            setDataFetchUserInfo,
            bankIdDetails,
            setBankIdDetails, 
            accDiscData,
            setaccDiscData,
            linkedAccData,
            setLinkedAccData,
            secondAccHandleId,
            setSecondAccountHandleId,
            mergeAccDetails,
            setMergeAccountDetails,
            handleIdfromConsent,
            setHandleIdfromConsent,
            linkingRefNum,
            setLinkingRefNum,
            jwtToken,
            setJwtToken,
            finvuToken,
            setFinvuToken,
            consentId,
            setConsentId,
            customerInfo,
            setCustomerInfo,
            statementAccounts,
            setStatementAccounts,
            xnsOther,
            setXnsOther,
            xnsExceptOther,
            setXnsExceptOther
        }}
        >
        {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
  return useContext(DataContext);
};
