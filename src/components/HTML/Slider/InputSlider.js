import Slider from "./index";
const InputSlider = ({min, max, value, step = 1, onChange}) => {
  return <div className="return-slider"><Slider min={min} max={max} value={value} step={step} onChange={onChange} /></div>;
};
export default InputSlider;