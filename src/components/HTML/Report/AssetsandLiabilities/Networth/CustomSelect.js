import React, { useState } from 'react';
import styles from './Networth.module.css'; // Import the CSS module
import { MdKeyboardArrowDown } from "react-icons/md";
import Calendar from 'react-calendar';

const CustomSelect = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date());
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionChange = (value) => {
    if (value === 'year') {
      setIsOpen(true);
      setSelectedYear(new Date()); 
    } else {
      setIsOpen(false);
      setSelectedYear(null); 
    }
  };

  const handleChange = (date) => {
    const year = date.getFullYear();
    setSelectedYear(new Date(year, 0, 1));
    setIsOpen(!isOpen);
  };

  return (
    <div className={`${styles.customselectbox}`}>
      <div onClick={toggleDropdown}>
        {selectedYear ? selectedYear.getFullYear() : 'Summary'} <MdKeyboardArrowDown style={{ fontSize: '1.4rem' }} />
      </div>
      {isOpen && (
        <div className={styles.dropdown}>
          <div className="custom-select">
            <label>
              <input
                type="radio"
                name="options"
                value="summary"
                checked={selectedYear === null}
                onChange={() => handleOptionChange('summary')}
              />
              Summary
            </label>
            <hr className='p-1 m-1' />
            <label>
              <input
                type="radio"
                name="options"
                value="year"
                checked={selectedYear !== null}
                onChange={() => handleOptionChange('year')}
              />
              Select Year
            </label>
          </div>
          {selectedYear !== null && (
            <div className="custom-options">
              <Calendar
                value={selectedYear} 
                onClickYear={handleChange} 
                view="decade"
                showNavigation={true}
                className={styles.customCalendar}
                tileClassName={styles.customCalendarTile}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CustomSelect;
