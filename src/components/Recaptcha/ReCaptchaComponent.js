import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const ReCaptchaComponent = forwardRef(({ onChange }, ref) => {
    const recaptchaRef = useRef();

    useImperativeHandle(ref, () => ({
        reset: () => {
            recaptchaRef.current.reset();
        }
    }));

    return (
        <ReCAPTCHA
            ref={recaptchaRef}
            //sitekey="6Ler4xgqAAAAABdiBfx2GGRJTeU25xT9PAMyPkh_"
            sitekey="6LdFgtQrAAAAACEuuZZbWPodu6vVHumdx3brHUrD"
            onChange={onChange}
        />
    );
});

export default ReCaptchaComponent;
