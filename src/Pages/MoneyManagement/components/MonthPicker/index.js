import Styles from "../../moneymanagement.module.css";
import FintooDatePicker from "../../../../components/HTML/FintooDatePicker";
import { forwardRef } from "react";
import moment from "moment";

const MonthPicker = ({ ...options }) => {

    const getformattedDate = (val) => {
        const valArr = val.split(' - ');
        return `${moment(valArr[0], 'MM/YYYY').format('MMM YYYY')} - ${valArr[1] ? moment(valArr[1], 'MM/YYYY').format('MMM YYYY') : ''}`
    }

    const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
        <div className={`${Styles['fltr-section']}`} onClick={onClick} ref={ref}>
            <div className={`${Styles['styled-select']}`} style={{ width: 'fit-content', paddingRight: '2.5rem' }}>
                <div>
                    {!value ? 'Select Month' : getformattedDate(value)}
                </div>
                <span className={`${Styles['fa-sort-desc']}`}></span>
            </div>
        </div>
    ));

    return (
        <div className='MonthPickerContainer'>
            <FintooDatePicker
                {...options}
                customInput={<ExampleCustomInput />}
            />
        </div>
    );
};
export default MonthPicker;
