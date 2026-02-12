import React, { useRef, useEffect, useState } from "react";
import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css";
import SimpleReactValidator from "simple-react-validator";
import { useLocation } from "react-router-dom";

const InternationalNumber = ({ value, disabled, onChange, onBlur, setCountryCode, setMobileValidation, fetchValidateMobileNo, setMobileErrorMsg, setErrorMsg, setIsMobileFieldValid }) => {
  const utilsScriptUrl = "https://cdn.jsdelivr.net/npm/intl-tel-input@18.0.3/build/js/utils.js";
  const inputRef = useRef(null);
  const [notice, setNotice] = useState(null);
  const [pageurl, setPageurl] = useState(false);
  const location = useLocation();
  const simpleValidator = useRef(new SimpleReactValidator());
  const errorMap = ["Please enter valid mobile number", "Invalid country code", "Please enter valid mobile number", "Please enter valid mobile number", "Please enter valid mobile number"];

  const checkInput = (e) => {
    let inputValue = e.target.value;
    let onlyDigits = inputValue.replace(/\D/g, "");
  
    if (onlyDigits && /^[1-9]/.test(onlyDigits)) {
      onlyDigits = onlyDigits.replace(/^0+/, '');
    } else if (onlyDigits && !/^[1-9]/.test(onlyDigits)) {
      onlyDigits = '';
      setErrorMsg('Mobile number must start with 6, 7, 8, or 9 and be 10 digits long.');
    }
  
    onChange(onlyDigits);
  
    if (!onlyDigits.trim()) {
      setErrorMsg('');
      setMobileValidation(false);
      setIsMobileFieldValid(false);
    } else if (/^[6-9]\d{9}$/.test(onlyDigits)) {
      setErrorMsg('');
      setMobileValidation(true);
      setIsMobileFieldValid(true);
    } else {
      setErrorMsg('Please enter valid mobile number');
      setMobileValidation(false);
      setIsMobileFieldValid(false);
    }
  };
  

  const [options, toggleOptions] = useState({
    allowDropdown: true,
    autoHideDialCode: true,
    initialCountry: "IN",
    separateDialCode: true,
    nationalMode: true,
    hadInitialPlaceholder: true,
    utilsScript: utilsScriptUrl,
    customPlaceholder: function (selectedCountryPlaceholder, selectedCountryData) {
      return "e.g. " + selectedCountryPlaceholder;
    },
  });

  useEffect(() => {
    const input = document.querySelector("#phone");
    if (!input) return;
    const iti = intlTelInput(input, { ...options });

    input.addEventListener("countrychange", function () {
      setCountryCode(iti.selectedCountryData.dialCode);
    });

    input.addEventListener('keyup', () => {
      if (input.value.trim()) {
        if (iti.isValidNumber()) {
          setErrorMsg('');
          setMobileErrorMsg('');
          setMobileValidation(true);
          setIsMobileFieldValid(true);
        } else {
          const errorCode = iti.getValidationError();
          setErrorMsg(errorMap[errorCode]);
          setMobileValidation(false);
          setIsMobileFieldValid(false);
        }
      } else {
        setIsMobileFieldValid(false);
      }
    });

    return () => {
      iti.destroy();
    };
  }, []);

  useEffect(() => {
    toggleOptions((o) => ({
      ...o,
      allowDropdown: !disabled,
    }));
  }, [disabled]);

  useEffect(() => {
    if ("pathname" in location) {
      setPageurl(location.pathname);
    }
  }, [location]);

  return (
    <div>
      <div className={pageurl == "/web/sign-up" ? "newSignup" : null}>
        <input
          disabled={disabled}
          id="phone"
          style={{ width: "100%" }}
          type="phone"
          containerClassName="intl-tel-input"
          inputClassName="form-control"
          value={value}
          tabIndex="3"
          maxLength={15}
          name="mobileNo"
          onInput={(e) => { checkInput(e); }}
          onBlur={() => { fetchValidateMobileNo() }}
          ref={inputRef}
          placeholder="Mobile Number*"
          onFocus={(e) => checkInput(e)}
        />
      </div>
      {notice && <div>{notice}</div>}
    </div>
  );
};

export default InternationalNumber;
