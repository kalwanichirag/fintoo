
import { useEffect, useRef, useState } from "react";
import styles from "../style.module.css";
import mainStyles from "../../style.module.css";
import { getPublicMediaURL } from "../../../../common_utilities";
import SimpleReactValidator from "simple-react-validator";
import Tooltip from "react-tooltip";
// import { Tooltip } from "react-bootstrap";
// import { Tooltip } from 'react-tooltip';

const initialContactFormData = {
    Mobile: "",
    PAN: ""
};

const BasicInfoSecond = ({ setBasicInfoCurrentStep,
    basicInfo,
    setBasicInfo,
    sendOTP
}) => {

    const [formState, setFormState] = useState(initialContactFormData);
    const [, forceUpdateContact] = useState();

    const contactFormValidator = useRef(
        new SimpleReactValidator(
            {
                validators: {
                    phone: {
                        required: true,
                        message: "Invalid phone number.",
                        rule: (val, _, validator) => {
                            if (`${val}`.charAt(0) === '0') return false;
                            if (!validator.helpers.testRegex(val, /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)) return false;
                            return parseInt(val) > 5000000000 && parseInt(val) < 9999999999;
                        },
                    },
                    PAN: {
                        required: true,
                        message: "Invalid PAN.",
                        rule: (val, _, validator) => {
                            return validator.helpers.testRegex(val, /^[a-zA-Z]{3}[p|P|c|C|h|H|f|F|a|A|t|T|b|B|l|L|j|J|g|G][A-Za-z][\d]{4}[A-Za-z]$/);
                        },
                    },
                },
            }
        )
    );

    const onContinue = async () => {
        if (contactFormValidator.current.allValid()) {

            setBasicInfo((prev) => ({ ...prev, ...formState }))

            const isSendOtpSuccess = await sendOTP(formState.PAN, formState.Mobile);

            if (isSendOtpSuccess) {
                setBasicInfoCurrentStep(3);
            }
        } else {
            contactFormValidator.current.showMessages();
            forceUpdateContact(1);
        }
    };

    const onFormDataChange = (e) => {
        e.preventDefault();

        setFormState({ ...formState, [e.target.name]: e.target.name == 'PAN' ? e.target.value.toUpperCase() : e.target.value });
    };

    useEffect(() => {
        setFormState(prev => ({ ...prev, Mobile: basicInfo.Mobile, PAN: basicInfo.PAN }));
    }, [])

    return (
        <div>
            <div className={`${styles.Text2}`}>
                Basic Info
            </div>
            <br />
            <div className={`${styles.TwoInputsContainer}`}>
                <div className={`${styles.InputContainer}`}>
                    <label >Mobile Number</label>
                    <div style={{ position: 'relative' }}>
                        <input style={{ paddingLeft: '45px' }} type="text" name="Mobile" id="" value={formState.Mobile} onChange={(e) => onFormDataChange(e)} />
                        <img
                            src={getPublicMediaURL("static/media/flagIndia.svg")}
                            alt="Mobile"
                            style={{
                                width: '30px',
                                position: 'absolute',
                                left: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)'
                            }}
                        />
                    </div>
                    <span >
                        {contactFormValidator.current.message(
                            "Mobile_Number",
                            formState.Mobile,
                            "phone"
                        ) && formState.Mobile === "" ? (
                            <div className='srv-validation-message'>
                                The mobile number field is required.
                            </div>
                        ) : (
                            contactFormValidator.current.message(
                                "Mobile_Number",
                                formState.Mobile,
                                "phone"
                            )
                        )}
                    </span>
                </div>
                <div className={`${styles.InputContainer}`}>
                    <label >PAN&nbsp;
                        <Tooltip id="PANTIP" place="top" >
                            Please enter your PAN to securely fetch your mutual fund holdings. This information is necessary to access your investment details and is protected with industry-standard encryption to ensure your privacy and security.
                        </Tooltip>
                        <img
                            data-tip
                            data-for="PANTIP"
                            src={getPublicMediaURL("static/media/MFSnippet/infoicon.svg")}
                            alt=""
                            className=".my-anchor-element-tip"
                            style={{ cursor: 'pointer', filter: 'brightness(20%)' }}
                        />
                    </label>
                    <input type="text" name="PAN" id="" value={formState.PAN} onChange={(e) => onFormDataChange(e)} />
                    <span >
                        {contactFormValidator.current.message(
                            "PAN",
                            formState.PAN,
                            "PAN"
                        ) && formState.PAN === "" ? (
                            <div className='srv-validation-message'>
                                PAN is required.
                            </div>
                        ) : (
                            contactFormValidator.current.message(
                                "PAN",
                                formState.PAN,
                                "PAN"
                            )
                        )}
                    </span>
                </div>
            </div>
            <br />
            <br />
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className={`${styles.btn2}`} onClick={() => setBasicInfoCurrentStep(1)}>
                    {'< Back'}
                </div>
                <div className={`${styles.btn1}`} onClick={() => onContinue()}>
                    {' Submit >'}
                </div>
            </div>



        </div>
    );
};

export default BasicInfoSecond;
