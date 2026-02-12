import DatePicker from 'react-datepicker';
import './style.css';

const DmfDatePicker = ({ onChange, selected, removeStyle, customClass, showYearDropdown, investmentFundBox, ...options }) => {
    const colorCode = {
        color: "#042b62"
    }
    const filterDates = investmentFundBox ? (date) => {
        // Disable dates prior to the current date
        const currentDate = new Date();
        if (date < currentDate) return false;

        // Disable dates beyond the 28th of each month
        if (date.getDate() > 28) return false;

        return true;
    } : null;
    return (
        <div className={`${removeStyle ? 'no-style-calendar' : 'style-calendar'}  ReportDatePicker fn-date ${options.date ? 'fn-selected' : ''}`}>
            {/* {minDate={new Date()}} */}
            <DatePicker
                // autoComplete='off'
                // {...options}
                // wrapperClassName={`${customClass ? customClass : ""}`}
                // showMonthDropdown
                // showYearDropdown={showYearDropdown}
                // dropdownMode="select"
                autoComplete='off'
                selected={selected}
                onChange={onChange}
                {...options}
                wrapperClassName={`${customClass ? customClass : ""}`}
                showMonthDropdown={false}
                showYearDropdown={showYearDropdown}
                dropdownMode="select"
                minDate={new Date()}
                maxDate={new Date(new Date().getFullYear(), 11, 31)}
                dateFormat="dd/MM/yyyy"
                filterDate={filterDates}
            />
        </div>
    );
}
export default DmfDatePicker;