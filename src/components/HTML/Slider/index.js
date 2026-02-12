// import React, { useState } from "react";
// import InputSlider from "react-input-slider";

// const Slider = (props) => {
//   const [sliderValue, setSliderValue] = useState(props.defaultValue)

//   const handleChange = (newValue) => {
//     setSliderValue(newValue.x);
//     props.onChange(newValue.x);
//   };

//   return (
//     <div style={{ position: "relative", gap: "0.5rem", marginTop: "1rem" }}>
//       <div style={{ position: "absolute", left: "-9px", top: "20px" }}>
//         {props.min}
//       </div>
//       <InputSlider
//         axis="x"
//         x={sliderValue}
//         xmin={props.min}
//         xmax={props.max}
//         xstep={props.step}
//         onChange={handleChange}
//         styles={{
//           track: {
//             backgroundColor: "#042b62",
//             width: "100%",
//             height: "3px",
//           },
//           active: {
//             backgroundColor: "#042b62",
//             height: "3px",
//           },
//           thumb: {
//             border: "1px solid #042b62",
//             backgroundColor: "#ffffff",
//             width: "13px",
//             height: "13px",
//             top: "-.6%",
//             ":before": {
//               content: `"${
//                 props.x == props.min || props.x == props.max ? "" : props.x
//               }"`,
//               position: "absolute",
//               bottom: "-22px",
//               // left: "-4px",
//               textAlign : "center"
//             },
//           },
//         }}
//       />
//       <div style={{ position: "absolute", right: "-13px", top: "20px" }}>
//         {props.max}
//       </div>
//     </div>
//   );
// };

// export default Slider;


import { default as RCSlider } from "rc-slider";
import { useState } from "react";
import "./style.css";
const Slider = ({min, max, value, step = 1, onChange}) => {
  // const [sliderValue, setSliderValue] = useState(props.defaultValue);
  return (
    <div
    style={{position :"relative", zIndex : 0}}
      className={`py-3 gs-slider fintoo-input-slider ${value > max - 1 && "sl-hide-right"} ${value < min + 1 && "sl-hide-left"}`}
      data-min={min}
      data-max={max}
    >
      <RCSlider
        // key={"slider-" + props.defaultValue}
        min={min}
        max={max}
        value={value}
        // defaultValue={props.defaultValue}
        step={step}
        onChange={onChange}
        handleStyle={{
          borderColor: "#042b62",
          backgroundColor: "#ffffff",
        }}
        railStyle={{
          backgroundColor: "#042b62",
        }}
        trackStyle={{
          backgroundColor: "#042b62",
        }}
        dotStyle={{
          display: "none"
        }}
      />
    </div>
  );
};
export default Slider;
