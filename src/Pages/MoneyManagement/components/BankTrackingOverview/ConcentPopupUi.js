import React, { useState, useContext, useEffect } from 'react';
import style from '../../style.module.css';
import { Form } from 'react-bootstrap';
import { useData } from '../../context/DataContext';

const ConcentPopupUi = (props) => {
    const { setTrackMonth, trackMonth } = useData();
    // const trackMonth = "1 Year";
    // setTrackMonth("3 Month");
    // Component logic goes here
    
    const [startingDate, setStartingDate] = useState(new Date());

    const handleSelectChange = (e) => {
        setTrackMonth(e.target.value);
        const currentDate = new Date();
        setStartingDate(currentDate);
    };

    const calculateEndDate = (trackMonth) => {
        let endDate = new Date(startingDate);

        switch (trackMonth) {
        case '1 Month':
            endDate.setMonth(endDate.getMonth() - 1);
            break;
        case '2 Month':
            endDate.setMonth(endDate.getMonth() - 2);
            break;
        case '3 Month':
            endDate.setMonth(endDate.getMonth() - 3);
            break;
        // case '6 Month':
        //     endDate.setMonth(endDate.getMonth() - 6);
        //     break;
        // case '9 Month':
        //     endDate.setMonth(endDate.getMonth() - 9);
        //     break;
        // case '1 Year':
        //     endDate.setFullYear(endDate.getFullYear() - 1);
        //     break;
        default:
            break;
        }

        localStorage.setItem("consentMonth", endDate);

        const formattedEndDate = `${endDate.getDate()}${getOrdinalSuffix(endDate.getDate())} ${getMonthName(
        endDate.getMonth()
        )}'${endDate.getFullYear().toString().substr(-2)}`;

        return formattedEndDate;
    };

    const formatDate = (date) => {
        const day = date.getDate();
        const suffix = getOrdinalSuffix(day);
        const formattedDate = `${day}${suffix} ${getMonthName(date.getMonth())}'${date.getFullYear().toString().substr(-2)}`;
        return formattedDate;
    };

    const getExpiryDate = (currentDate) => {
        let expiryDate = new Date(currentDate);
        expiryDate.setFullYear(currentDate.getFullYear() + 1);
      
        const formattedExpiryDate = `${expiryDate.getDate()}${getOrdinalSuffix(expiryDate.getDate())} ${getMonthName(
          expiryDate.getMonth()
        )}  ${expiryDate.getFullYear().toString()}`;
      
        return formattedExpiryDate;
      };
      

    const getOrdinalSuffix = (number) => {
        if (number >= 11 && number <= 13) {
        return 'th';
        }
        const lastDigit = number % 10;
        switch (lastDigit) {
        case 1:
            return 'st';
        case 2:
            return 'nd';
        case 3:
            return 'rd';
        default:
            return 'th';
        }
    };

    const getMonthName = (monthIndex) => {
        const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        return months[monthIndex];
    };

    return (
        // JSX markup goes here
        <div className={`${style.popuiContainer}`}>
            <div className={`${style.popuiHeader}`}> <img style={{ width: '25px' }} src={process.env.REACT_APP_STATIC_URL + "media/MoneyManagement/zondicons_shield.svg"} /><span className={`${style.headerText2}`}>Track With Security!</span></div>
            {/* <p className={`${style.secondaryText4}`} style={{ display: 'flex', alignItems: 'center' }}>
                When you grant us consent to access your bank transactions through the RBI-regulated Account Aggregator FINVU enables Fintoo to receive end-to-end encrypted data safely, please rest assured that we do not store your password or any other sensitive details. Once you consent, ensure your financial information remains secure.
            </p> */}
            <div className={`${style.borderedContainer}`}>
                <div>
                    <div className={`${style.label1}`}>
                        Purpose
                    </div>
                    <div className={`${style.labelValue1}`}>
                        Customer spending patterns and budgeting
                    </div>
                </div>
                <br />
                <div className={`${style.labelGrid3}`}>
                    <div style={{ marginBottom: (calculateEndDate(trackMonth) && calculateEndDate(trackMonth).length > 20) ? '20px' : '0' }}>
                        <div className={`${style.label1}`}>
                            Details will be shared from
                        </div>
                        <div className={`${style.labelValue1}`}>
                            {`${calculateEndDate(trackMonth)} to ${formatDate(startingDate)}`}
                            {/* {`${formatDate(startingDate)} to ${calculateEndDate(trackMonth)}`} */}
                        </div>
                    </div>

                    <div>
                    <div className={`${style.label1}`}>
                            Consent Expires on
                        </div>
                        <div className={`${style.labelValue1}`}>
                            {`${getExpiryDate(startingDate)}`}
                        </div>

                        {/* <div className={`${style.label1}`}>
                            Details will be updated
                        </div>
                        <div className={`${style.labelValue1}`}>
                            2 times in a DAY
                        </div> */}
                    </div>

                    <div>
                        
                    </div>
                </div>
                <br />
                <div>
                    <div>
                        <div className={`${style.label1}`}>
                            Basic Information to be Shared
                        </div>
                        <div className={`${style.labelValue1}`}>
                            Account Information : Profile, Summary, Transactions
                        </div>
                        <div className={`${style.labelValue1}`}>
                            Account Type : Deposit
                        </div>
                    </div>
                </div>
                <div className={`${style.popupNoteContainer}`} >
                    <div className={`${style.popupNoteContentContainer}`}>
                        <span className={`${style.labelValue1}`} style={{ fontWeight: '600' }}>Note :-</span> <span className={`${style.label1}`} style={{ fontWeight: '600' }}> Default Frequency of the consent is </span>

                        <Form.Select
                            required
                            name="guardianRelation"
                            style={{
                                width: 'fit-content', border: 'none',
                                color: '#042b62',
                                fontSize: '1.125rem',
                                fontStyle: 'normal',
                                fontWeight: 700,
                                lineHeight: '1.25rem',
                                textDecorationLine: 'underline',
                                textUnderlineOffset: '0.25rem',
                            }}
                            onChange={handleSelectChange}
                            value={trackMonth}
                          >
                            <option value="1 Month">1 Month</option>
                            <option value="2 Month">2 Month</option>
                            <option value="3 Month">3 Month</option>
                            {/* <option value="6 Month">6 Month</option>
                            <option value="9 Month">9 Month</option>
                            <option value="1 Year">1 Year</option> */}
                            </Form.Select>
                    </div>
                </div>

            </div>
            <br />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className={`${style.btn3}`} onClick={() => props.closePopup()}>Got it!</div>
            </div>

        </div>
    );
};

export default ConcentPopupUi;
