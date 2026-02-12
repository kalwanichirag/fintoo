
import { useState } from "react";
import FintooDatePicker from "../FintooDatePicker";
export default function ReactDatePicker(props) {
  const [selectdate, setSelectDate] = useState(props.select_date);

  return (
    <FintooDatePicker
      selected={props.select_date ? new Date(props.select_date).setHours(0,0,0,0) : ''}
      onChange={(date) =>{setSelectDate(date),props.setDate(date)}}
      dateFormatCalendar={"MMM yyyy"}
      peekNextMonth
      showMonthDropdown
      showYearDropdown
      useShortMonthInDropdown
      dropdownMode="select"
      placeholder="Please select your D.O.B"
      dateFormat="dd/MM/yyyy"
      minDate={props.minDate?new Date(props.minDate):''}
      maxDate={props.maxDate?new Date(props.maxDate):''}
      onFocus={e => e.target.blur()}
      readOnly={props.readOnly?props.readOnly:false}
    />
  );
}
