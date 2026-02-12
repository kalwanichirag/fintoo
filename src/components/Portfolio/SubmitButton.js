import styleObj from "./otpmodal.module.css";
const SubmitButton = ({title, onClick, disabled}) => {
    return (<div
        className={`${Boolean(disabled) ? styleObj['btn-disable'] : styleObj['btn-active']} mt-3 ${styleObj['switch-fund-btn']} mobile-bottom-button`}
        onClick={() => {
            //   submitOtp();
            if(Boolean(disabled) === false) {
                onClick();
            }
        }}
      >
        {Boolean(disabled) ? 'Loading...' : title}
      </div>)
};
export default SubmitButton;