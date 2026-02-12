
import { useEffect, useRef, useState } from "react";
import styles from "../style.module.css";
import mainStyles from "../../style.module.css";
import SimpleReactValidator from "simple-react-validator";


const initialContactFormData = {
    FullName: "",
    Email: ""
};

const BasicInfoFirst = ({
    setBasicInfoCurrentStep,
    basicInfo,
    setBasicInfo
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
            },
        }
    ));

    const onContinue = async () => {
        if (contactFormValidator.current.allValid()) {
            setBasicInfo((prev) => ({ ...prev, ...formState }))
            setBasicInfoCurrentStep(2);
        } else {
            contactFormValidator.current.showMessages();
            forceUpdateContact(1);
            // setSubscribeErrorMsg('Please agree to receive alerts.');
        }
    };

    const onFormDataChange = (e) => {
        e.preventDefault();

        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        setFormState(prev => ({ ...prev, FullName: basicInfo.FullName, Email: basicInfo.Email }));
    }, [])

    return (
        <div>
            <div className={`${styles.Text2}`}>
                Basic Info
            </div>
            <br />
            <div className={`${styles.TwoInputsContainer}`}>
                <div className={`${styles.InputContainer}`}>
                    <label >Full Name</label>
                    <input type="text" name="FullName" id="" value={formState.FullName} onChange={(e) => onFormDataChange(e)} />
                    <span>
                        {contactFormValidator.current.message(
                            "Name",
                            formState.FullName,
                            "required|alpha_space"
                        )}
                    </span>
                </div>
                <div className={`${styles.InputContainer}`}>
                    <label >Email Address</label>
                    <input type="email" name="Email" id="" value={formState.Email} onChange={(e) => onFormDataChange(e)} />
                    <span >
                        {contactFormValidator.current.message(
                            "Email",
                            formState.Email,
                            "required|email"
                        )}
                    </span>
                </div>
            </div>
            <br />
            <br />

            <div className={`${styles.btn1}`} style={{ margin: '0 auto' }} onClick={() => onContinue()}>
                {' Continue >'}
            </div>


        </div>
    );
};

export default BasicInfoFirst;
