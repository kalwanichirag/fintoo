
import moment from 'moment';
import {useState} from 'react';
import DatePicker from 'react-date-picker';
import style from './style.css';
const NomineeDatePicker = (props) => {
    const [date, setDate] = useState(props.value);
    // 
    return (
        <div className={` fn-date ${date ? 'fn-selected' : ''}`}>
            {/* {minDate={new Date()}} */}
            <DatePicker maxDate={props.maxDate} calendarIcon={<img width={'20px'} src={require('../../../Assets/Images/calendar-336.png')} />}  monthPlaceholder="MM" yearPlaceholder="YYYY" dayPlaceholder="DD" onChange={(v)=> {
                setDate(v);
                if(props.onChange != undefined) {
                    props.onChange(v);
                }
            }} value={date} format="dd-MM-y" />
        </div>
    );
}
export default NomineeDatePicker;