import DatePicker from 'react-datepicker';
import './style.css';
import { useEffect, useRef } from 'react';

const FintooDatePicker = ({removeStyle,Placeholder,  ...options}) => {
    const datepickerRef = useRef();
    return (
        <div className={`${removeStyle ? 'no-style-calendar' : 'style-calendar'} fintoo-datepicker fn-date ${options.date ? 'fn-selected' : ''}`}>
            {/* {minDate={new Date()}} */}
            <DatePicker
            onKeyDown={(e)=> e.preventDefault()}
            placeholderText={Placeholder}
            dropdownMode="select"
            autoComplete='off'
            {...options}
            calendarIcon={<img width={'20px'} src={require('./Images/calendar73.svg')} />}
            />
        </div>
    );
}
export default FintooDatePicker;