
import { useEffect, useRef, useState } from "react";
import styles from "../style.module.css";
import mainStyles from "../../style.module.css";
import SimpleReactValidator from "simple-react-validator";
import { getPublicMediaURL } from "../../../../common_utilities";
import Select from "react-select";


const options = [
    { value: 'WIRC_virtual_cfo', label: 'Virtual CFO', service_id: 125, serialNo: 1 },
    { value: 'WIRC_venture_debt_equity', label: 'Venture Debt & Equity', service_id: 125, serialNo: 2 },
    { value: 'WIRC_offshore_business_setup', label: 'Offshore & Gift City Business Setup', service_id: 125, serialNo: 3 },
    { value: 'WIRC_family_office_setup', label: 'Family Office Setup', service_id: 125, serialNo: 4 },
    { value: 'WIRC_global_investments', label: 'Global Investments', service_id: 11, serialNo: 5 },
    { value: 'WIRC_subbroker_imp_solution', label: 'Broker Partner for Investment Marketplace', service_id: 126, serialNo: 6 },
    { value: 'WIRC_fp_saas_solution', label: 'Financial Planning Software', service_id: 127, serialNo: 7 }
]

const initialContactFormData = {
    FullName: "",
    Email: "",
    Mobile: "",
    IntereatAreas: []
};

const BasicInfo = ({
    setBasicInfoCurrentStep,
    basicInfo,
    setBasicInfo,
    sendOtp
}) => {

    const [formState, setFormState] = useState(initialContactFormData);
    const [, forceUpdateContact] = useState();

    const contactFormValidator = useRef(new SimpleReactValidator(
        {
            validators: {
                email: {
                    required: true,
                    message: "Please enter valid email address.",
                    rule: (val, _, validator) => {
                        return validator.helpers.testRegex(val, /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
                    },
                },
                phone: {
                    required: true,
                    message: "Invalid phone number.",
                    rule: (val, _, validator) => {
                        if (`${val}`.charAt(0) === '0') return false;
                        if (!validator.helpers.testRegex(val, /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)) return false;
                        return parseInt(val) > 5000000000 && parseInt(val) < 9999999999;
                    },
                },
                IntereatAreas: {
                    required: true,
                    message: "Area of interest field is required.",
                    rule: (val, _) => {
                        return val.length > 0;
                    },
                }
            },
        }
    ));

    const onContinue = async () => {
        if (contactFormValidator.current.allValid()) {
            setBasicInfo((prev) => ({ ...prev, ...formState }));
            const sendOtpResult = await sendOtp(formState.Mobile);
            if (sendOtpResult) {
                setBasicInfoCurrentStep(2);
            }
        } else {
            contactFormValidator.current.showMessages();
            forceUpdateContact(1);
        }
    };

    const onFormDataChange = (e) => {
        e.preventDefault();

        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        setFormState(prev => ({ ...prev, FullName: basicInfo.FullName, Email: basicInfo.Email, Mobile: basicInfo.Mobile }));
    }, [])

    return (
        <div>
            {/* <div className={`${styles.Text2}`}>
                Basic Info
            </div> */}

            <div >
                <div className={`${styles.InputContainer}`}>
                    <label >Name*</label>
                    <input type="text" name="FullName" placeholder="Enter Name" id="" value={formState.FullName} onChange={(e) => onFormDataChange(e)} />
                    <span>
                        {contactFormValidator.current.message(
                            "Name",
                            formState.FullName,
                            "required|alpha_space"
                        )}
                    </span>
                </div>
                <br />
                <div className={`${styles.InputContainer}`}>
                    <label >Email Address*</label>
                    <input type="email" name="Email" placeholder="Enter Email" id="" value={formState.Email} onChange={(e) => onFormDataChange(e)} />
                    <span >
                        {contactFormValidator.current.message(
                            "Email",
                            formState.Email,
                            "required|email"
                        )}
                    </span>
                </div>
                <br />
                <div className={`${styles.InputContainer}`}>
                    <label >Mobile Number*</label>
                    <div style={{ position: 'relative' }}>
                        <input style={{ paddingLeft: '45px' }} type="text" name="Mobile" placeholder="Enter Mobile No" id="" maxLength={10} value={formState.Mobile} onChange={(e) => onFormDataChange(e)} />
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
                <br />
                <div >
                    <div className={`${styles.InputContainer}`}>
                        <label >Area of Interest*</label>
                    </div>
                    <Select
                        classNamePrefix="sortSelect"
                        isMulti
                        name="IntereatAreas"
                        placeholder="Select area of interest"
                        isSearchable={false}
                        options={options}
                        onChange={(e) => { setFormState({ ...formState, IntereatAreas: e.map(data => data) }) }}
                    />
                    <span>
                        {contactFormValidator.current.message(
                            "IntereatAreas",
                            formState.IntereatAreas,
                            "IntereatAreas"
                        )}
                    </span>
                </div>
            </div>
            <br />
            <br />

            <div className={`${styles.btn1}`} style={{ margin: '0 auto' }} onClick={() => onContinue()}>
                {' Submit'}
            </div>


        </div>
    );
};

export default BasicInfo;
