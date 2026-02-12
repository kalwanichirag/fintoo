import React, { useRef } from 'react';
import styles from './style.module.css';

const CustominsuranceSlider = ({ min, max, value, onChange }) => {
  const sliderRef = useRef(null);

  const calculateValueFromPosition = (position) => {
    const slider = sliderRef.current;
    const rect = slider.getBoundingClientRect();
    const relativePosition = position - rect.left;
    const percentage = relativePosition / rect.width;
    const newValue = Math.round(percentage * (max - min) + min);
    return Math.max(min, Math.min(newValue, max));
  };

  const handleMouseDown = (e) => {
    const newValue = calculateValueFromPosition(e.clientX);
    onChange(newValue);  

    const handleMouseMove = (event) => {
      const updatedValue = calculateValueFromPosition(event.clientX);
      onChange(updatedValue); 
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className={styles.sliderContainer}>
      <div
        className={styles.sliderTrack}
        ref={sliderRef}
        onMouseDown={handleMouseDown}
      >
        <div
          className={styles.sliderProgress}
          style={{ width: `${((value - min) / (max - min)) * 100}%` }} 
        />
        <div
          className={styles.sliderThumb}
          style={{ left: `${((value - min) / (max - min)) * 100}%` }} 
        />
      </div>
    </div>
  );
};

export default CustominsuranceSlider;
