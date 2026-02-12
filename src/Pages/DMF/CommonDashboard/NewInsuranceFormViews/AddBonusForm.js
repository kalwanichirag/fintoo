import FintooDatePicker from "../../../../components/HTML/FintooDatePicker";
import { useEffect, useRef, useState } from "react";
import SimpleReactValidator from "simple-react-validator";
import style from "./insuranceForm.module.css";
import { formatDatefun } from "../../../../Utils/Date/DateFormat";
import moment from "moment";

const AddBonusForm = (props) => {
  const [, forceUpdate] = useState();
  const simpleValidator = useRef(new SimpleReactValidator());

  simpleValidator.current.purgeFields();

  useEffect(() => {
    simpleValidator.current.allValid();
    simpleValidator.current.showMessages();
    forceUpdate(1);
  }, []);

  const addNewForm = () => {
    forceUpdate(2);
    if (simpleValidator.current.allValid()) {
      props.add();
    }
  };

  // Function to format number with commas
  const formatNumberWithCommas = (value) => {
    if (!value || value === "") return "";
    // Remove any existing commas and non-digit characters except decimal point
    const cleanValue = value.toString().replace(/[^\d.]/g, "");
    // Add commas for thousands
    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className={`col-12 ${style.recurringFormContainer}`}>
      <div
        className="col-12 col-md-11 px-2"
        style={{ display: "flex", flexWrap: "wrap" }}
      >
        <div className="col-6 px-2">
          <div className="">
            <span className="lbl-newbond">Bonus Amount *</span>
            <br />
            <div className="bonds-datepicker">
              <input
                placeholder="Enter Bonus Amount"
                autoComplete="off"
                className={` w-100 fntoo-textbox-react inputPlaceholder`}
                type="text"
                maxLength={11}
                name="insurance_bonus_amount"
                value={formatNumberWithCommas(
                  props.data.insurance_bonus_amount || ""
                )}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/,/g, "");
                  props.update(props.id, e.target.name, rawValue, true);
                }}
              />
            </div>
            {simpleValidator.current.message(
              "insurance_bonus_amount",
              props.data.insurance_bonus_amount
                ? props.data.insurance_bonus_amount.toString().replace(/,/g, "")
                : "",
              "required|numeric|min:1,num",
              { messages: { min: "bonus amount must be greater than 0" } }
            )}
          </div>
        </div>
        <div className="col-6 px-2">
          <div className="">
            <span className="lbl-newbond">Date Of Bonus *</span>
            <br />
            <div className="bonds-datepicker">
              <FintooDatePicker
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                autoComplete="off"
                name="dateOfBonus"
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                customClass="datePickerDMF"
                selected={
                  "insurance_bonus_date" in props.data
                    ? moment(
                        props.data.insurance_bonus_date,
                        "DD/MM/YYYY"
                      ).toDate()
                    : ""
                }
                onChange={(date) =>
                  props.update(
                    props.id,
                    "insurance_bonus_date",
                    moment(date, "DD/MM/YYYY").toDate()
                  )
                }
              />
            </div>
            {simpleValidator.current.message(
              "insurance_bonus_date",
              props.data.insurance_bonus_date,
              "required"
            )}
          </div>
        </div>
      </div>
      <div
        className="col-12 col-md-1"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          gap: "1rem",
        }}
      >
        <div
          className="col-1 col-md-6"
          style={{
            display: "flex",
            justifyContent: "center",
            cursor: "pointer",
            color: "#042b62",
          }}
        >
          <i
            onClick={() => props.delete(props.id)}
            className="fa-solid fa-trash-can"
          ></i>
        </div>
        {props.isLast && (
          <div
            className="col-1 col-md-6"
            style={{
              display: "flex",
              justifyContent: "center",
              cursor: "pointer",
              color: "#042b62",
            }}
          >
            <i
              onClick={addNewForm}
              className={
                props.id != 4
                  ? "fa-solid fa-circle-plus"
                  : "disabled fa-solid fa-circle-plus"
              }
            ></i>
          </div>
        )}
      </div>
    </div>
  );
};
export default AddBonusForm;
