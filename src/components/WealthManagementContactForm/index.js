import SimpleReactValidator from "simple-react-validator";
import styles from "./style.module.css";
import commonStyles from "../Layout/Fullpage/style.module.css";
import { useRef, useState } from "react";
import { sendContactData } from "./service/API";
import { contactFormServicesData } from "./model";

const initialContactFormData = {
  fullname: "",
  mobile: "",
  email: "",
  incomeslab: "",
  tagval: "",
  servicename: "",
  plan_name: "",
  rm_id: "",
  comment: "",
  skip_mail: "",
  service: 36,
  tags: "",
  utm_source: "",
};

const inputValidationFlages = {
  Name: true,
  Mobile_Number: true,
  Email: true,
  Annual_Income: true,
};

const nameRefObj = {
  fullname: "Name",
  mobile: "Mobile_Number",
  email: "Email",
  incomeslab: "Annual_Income",
};

function WealthContactForm({ imgSrc, serviceType, onSuccess }) {
  const [formState, SetFormState] = useState(initialContactFormData);
  const [inputValidationFlagesState, SetInputValidationFlagesState] = useState(
    inputValidationFlages
  );
  const [, forceUpdateContact] = useState();

  const onBlurInput = (e) => {
    SetInputValidationFlagesState({
      ...inputValidationFlagesState,
      [nameRefObj[e.target.name]]: contactFormValidator.current.fieldValid(
        nameRefObj[e.target.name]
      ),
    });
    contactFormValidator.current.showMessageFor(nameRefObj[e.target.name]);
  };

  const contactFormValidator = useRef(
    new SimpleReactValidator({
      validators: {
        phone: {
          required: true,
          message: "invalid phone number.",
          rule: (val) => {
            return parseInt(val) > 5000000000 && parseInt(val) < 9999999999;
          },
        },
      },
    })
  );

  const onFormDataChange = (e) => {
    e.preventDefault();

    SetFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const isValidInput = (flag) => flag === false;

  const onSubmit = async () => {
    if (contactFormValidator.current.allValid()) {
      const payload = buildPayload();

      const result = await sendContactData(payload);

      if (result) {
        if (result) {
          if (contactFormServicesData[serviceType].external_redirect) {
            return window.location.replace(
              contactFormServicesData[serviceType].redirect_url
            );
          } else {
            SetFormState(initialContactFormData);
            contactFormValidator.current.hideMessages();
            contactFormValidator.current.visibleFields = [];
            forceUpdateContact(1);
            return onSuccess();
          }
        }
      }
    } else {
      SetInputValidationFlagesState({
        Name: contactFormValidator.current.fieldValid("Name"),
        Mobile_Number: contactFormValidator.current.fieldValid("Mobile_Number"),
        Email: contactFormValidator.current.fieldValid("Email"),
        Annual_Income: contactFormValidator.current.fieldValid("Annual_Income"),
      });
      contactFormValidator.current.showMessages();
      forceUpdateContact(1);
    }
  };

  const buildPayload = () => {
    var vars = [],
      hash;
    var hashes = window.location.href
      .slice(window.location.href.indexOf("?") + 1)
      .split("&");
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split("=");
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }

    if (vars.utm_source == undefined || vars.utm_source == "") {
      vars.utm_source = contactFormServicesData[serviceType].utm_source;
    }

    if (vars.utm_campaign == undefined || vars.utm_campaign == "") {
      vars.utm_campaign = contactFormServicesData[serviceType].utm_campaign;
    }

    if (vars.tags == undefined || vars.tags == "") {
      vars.tags = contactFormServicesData[serviceType].tags;
    }

    var payload = {};

    payload["tagval"] = contactFormServicesData[serviceType].tagval
      ? contactFormServicesData[serviceType].tagval
      : "minty_financial_planning";
    payload["servicename"] = contactFormServicesData[serviceType].servicename
      ? contactFormServicesData[serviceType].servicename
      : "financial-planning";
    payload["plan_name"] = contactFormServicesData[serviceType].plan_name
      ? contactFormServicesData[serviceType].plan_name
      : "Financial Plan";
    payload["rm_id"] = "96";
    payload["comment"] = "";
    payload["skip_mail"] = "1";
    payload["service"] = vars.utm_campaign;
    payload["tags"] = vars.tags;
    payload["utm_source"] = vars.utm_source;
    payload["fullname"] = formState.fullname;
    payload["mobile"] = formState.mobile;
    payload["email"] = formState.email;
    payload["incomeslab"] = formState.incomeslab;

    return payload;
  };
  contactFormValidator.current.purgeFields();
  return (
    <>
      <section className={`${styles["wealth-contact-section"]}`}>
        <div
          className={`${styles["wealth-contact-section-container"]} ${commonStyles["padding-class"]}`}
          style={{ backgroundImage: `url(${imgSrc})` }}
        >
          <div
            className={`${styles["wealth-contact-section-contact-form-container"]}`}
          >
            <div className={`${styles["wealth-contact-section-contact-form"]}`}>
              <span className={`${styles["form-section-title"]}`}>
                Get in touch
              </span>
              <div>
                <div className={`${styles["contact-form-input-container"]}`}>
                  {" "}
                  <label
                    className={`${styles["contact-form-label"]}`}
                    htmlFor=""
                  >
                    Name*
                  </label>
                  <input
                    name="fullname"
                    className={`${styles["contact-form-input"]} ${
                      isValidInput(inputValidationFlagesState.Name)
                        ? styles["invalid-border"]
                        : ""
                    }`}
                    type="text"
                    value={formState.fullname}
                    onChange={(e) => onFormDataChange(e)}
                    onBlur={(e) => onBlurInput(e)}
                  />
                  <span style={{ textTransform: "capitalize" }}>
                    {contactFormValidator.current.message(
                      "Name",
                      formState.fullname,
                      "required|alpha_space"
                    )}
                  </span>
                </div>

                <div className={`${styles["contact-form-input-container"]}`}>
                  <label
                    className={`${styles["contact-form-label"]}`}
                    htmlFor=""
                  >
                    Mobile Number*
                  </label>
                  <input
                    name="mobile"
                    className={`${styles["contact-form-input"]} ${
                      isValidInput(inputValidationFlagesState.Mobile_Number)
                        ? styles["invalid-border"]
                        : ""
                    }`}
                    type="number"
                    value={formState.mobile}
                    onChange={(e) => onFormDataChange(e)}
                    onBlur={(e) => onBlurInput(e)}
                  />

                  <span style={{ textTransform: "capitalize" }}>
                    {contactFormValidator.current.message(
                      "Mobile_Number",
                      formState.mobile,
                      "phone"
                    ) && formState.mobile === "" ? (
                      <p style={{ color: "red" }}>
                        The Mobile Number field is required.
                      </p>
                    ) : (
                      contactFormValidator.current.message(
                        "Mobile_Number",
                        formState.mobile,
                        "phone"
                      )
                    )}
                  </span>
                </div>

                <div className={`${styles["contact-form-input-container"]}`}>
                  <label
                    className={`${styles["contact-form-label"]}`}
                    htmlFor=""
                  >
                    Email*
                  </label>
                  <input
                    name="email"
                    className={`${styles["contact-form-input"]} ${
                      isValidInput(inputValidationFlagesState.Email)
                        ? styles["invalid-border"]
                        : ""
                    }`}
                    type="email"
                    value={formState.email}
                    onChange={(e) => onFormDataChange(e)}
                    onBlur={(e) => onBlurInput(e)}
                  />

                  <span style={{ textTransform: "capitalize" }}>
                    {contactFormValidator.current.message(
                      "Email",
                      formState.email,
                      "required|email"
                    )}
                  </span>
                </div>

                <div className={`${styles["contact-form-input-container"]}`}>
                  <label
                    className={`${styles["contact-form-label"]}`}
                    htmlFor=""
                  >
                    {" "}
                    Annual Income*
                  </label>
                  <select
                    name="incomeslab"
                    className={`${styles["contact-form-input"]} ${
                      styles["select-input"]
                    } ${
                      isValidInput(inputValidationFlagesState.Annual_Income)
                        ? styles["invalid-border"]
                        : ""
                    }`}
                    aria-required="true"
                    value={formState.incomeslab}
                    onChange={(e) => onFormDataChange(e)}
                    onBlur={(e) => onBlurInput(e)}
                  >
                    <option value="">Select Income</option>
                    <option value="1">0 to 10 Lac</option>
                    <option value="2">10 Lac to 35 Lac</option>
                    <option value="3">35 Lac to 50 Lac</option>
                    <option value="4">50 Lac to 1 Crore</option>
                    <option value="5">Above 1 Crore</option>
                  </select>
                  <span style={{ textTransform: "capitalize" }}>
                    {contactFormValidator.current.message(
                      "Annual_Income",
                      formState.incomeslab,
                      "required"
                    )}
                  </span>
                </div>

                <div className="text-center">
                  <button
                    className={`${styles["contact-form-btn"]}`}
                    onClick={() => onSubmit()}
                  >
                    Book An Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default WealthContactForm;
