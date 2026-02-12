import { useEffect, useRef, useState } from "react";
import style from '../style.module.css'
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { Form, FormGroup } from "react-bootstrap";
import SimpleReactValidator from "simple-react-validator";

const initialFormState = {
    accountNumber: '',
    IFSC: '',
    accountType: '',
}

function MinorsBankDetails(props) {

    const [formState, setFormState] = useState(initialFormState);
    const [, forceUpdate] = useState();

    const simpleValidator = useRef(new SimpleReactValidator());

    const validateForm = () => {
        simpleValidator.current.showMessages();
        forceUpdate(1);
        return simpleValidator.current.allValid()
    };

    const onInputChange = (e, isNumeric) => {
        const name = e.target.name;
        let value = e.target.value;

        if (isNumeric && !numericRegex.test(value) && value !== '') {
            return;
        }

        setFormState({ ...formState, [name]: value });
    };

    const onDateAndSelectInputChange = (name, value) => {
        setFormState({ ...formState, [name]: value });
    };

    const onNextClick = () => {
        if (validateForm()) {
            props.onNext()
        }
    }

    return (
        <div className={`${style.addMinorSectionView}`}>
            <div className={`${style.addMinorSectionViewImg}`} style={{ width: '90%' }}>
                <img style={{ width: '100%' }} src={process.env.REACT_APP_STATIC_URL + "media/DMF/minorFlow/minorflowimg3.png"} alt="" />
            </div>
            <div className=" ">
                <div className={`${style.addMinorFormTitleContainer}`}>
                    <div
                        onClick={() => props.onPrevious()}
                    >
                        <IoChevronBackCircleOutline className={`${style.addMinorFormTitlebackBtn}`} />
                    </div>

                    <div className={`${style.addMinorFormTitle}`}>Bank Details</div>
                </div>

                <div className={`${style.uploadContentContainer}`}>
                    <div className={`${style.noteTextContent}`}>
                        Please enter the details of minor's bank account.
                    </div>
                    <br />
                    <Form >
                        <div className={`${style.formInputContainer}`}>
                            <Form.Label className={`${style.formLabel}`} htmlFor="inputText">
                                Account Number
                            </Form.Label>
                            <Form.Control
                                controlId="validationCustom05"
                                maxLength="20"
                                placeholder="Enter minor's bank account number"
                                className={`${style.formInput}`}
                                required
                                type="text"
                                name="accountNumber"
                                value={formState.accountNumber}
                                onChange={(e) => onInputChange(e, false)}
                            ></Form.Control>
                            {simpleValidator.current.message(
                                "accountNumber",
                                formState.accountNumber,
                                "required|integer",
                                { messages: { integer: "Please enter a valid bank account number" } }
                            )}
                        </div>
                        <div className={`${style.formInputContainer}`}>
                            <Form.Label className={`${style.formLabel}`} htmlFor="inputText">
                                IFSC
                            </Form.Label>
                            <Form.Control
                                controlId="validationCustom05"
                                maxLength="18"
                                placeholder="Enter code"
                                className={`${style.formInput}`}
                                required
                                type="text"
                                name="IFSC"
                                value={formState.IFSC}
                                onChange={(e) => onInputChange(e, false)}
                            ></Form.Control>
                            {simpleValidator.current.message(
                                "IFSC",
                                formState.IFSC,
                                "required|regex:^[A-Za-z]{4}0[A-Z0-9a-z]{6}$",
                                { messages: { regex: "Please enter a valid IFSC code" } }
                            )}
                        </div>
                        <div className={`${style.formInputContainer}`}>
                            <Form.Label className={`${style.formLabel}`} htmlFor="inputText">
                                Account Type
                            </Form.Label>
                            <Form.Select
                                className={`${style.formInput}`}
                                required
                                name="accountType"
                                value={formState.accountType}
                                onChange={(e) => onDateAndSelectInputChange('accountType', e.target.value)}
                            >
                                <option value="">Select account type</option>
                                <option value="Savings">Savings</option>
                                <option value="Current">Current</option>
                            </Form.Select>
                            {simpleValidator.current.message(
                                "accountType",
                                formState.accountType,
                                "required"
                            )}
                        </div>

                    </Form>
                </div>
                <div className="fintoo-top-border mt-4 pt-4">
                    <div className={`${style.nextBtn}`} onClick={() => onNextClick()}>
                        Next
                    </div>
                </div>

            </div>
        </div>
    );
}

export default MinorsBankDetails;
