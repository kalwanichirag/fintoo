import {React, useState} from "react";
import OTPInput, { ResendOTP } from "otp-input-react";
// import MobileOTP from "./MobileOTP";
function MobileOTP() {
  const [mobileNumber, setMobilenumber] = useState();
  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setMobilenumber(value);
    
  };
  const [OTP, setOTP] = useState("");
  const [val, setVal] = useState();
  // const [open, setOpen] = useState(false);
  // const onClick = () => setOpen(true);
  return (
    <div>
      <div className="mobileOTP">
        <div className="container d-flex justify-content-center align-items-center">
          <div className="card text-center">
            <div className="card-header p-2">
              <h4 className="mb-2">OTP Verification</h4>
              <p>Enter the 4-digit code send to</p>
              <div>
                <small>+91******1258</small>
              </div>
            </div>
            <div className="input-container d-flex flex-row justify-content-center mt-2">
              <OTPInput
                value={OTP}
                onChange={setOTP}
                autoFocus
                className="rounded rounded-otp"
                OTPLength={4}
                otpType="number"
                disabled={false}
                // secure
              />
            </div>
            <div className="p-3">
              <small>
                <a href="#" className="text-decoration-none">
                  Resend OTP
                </a>
              </small>
            </div>
            <div className="mt-3 mb-5">
              <button className="btn btn-success px-4 verify-btn">
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileOTP;
