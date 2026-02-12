import Select from "react-select";
import FintooDatePicker from "../../../../components/HTML/FintooDatePicker";
import { useEffect, useRef, useState } from "react";
import SimpleReactValidator from "simple-react-validator";
import style from "./insuranceForm.module.css";
import { formatDatefun } from "../../../../Utils/Date/DateFormat";
import moment from "moment";

const RecurringMaturityForm = (props) => {
  const [, forceUpdate] = useState();

  const options_frequency = [
    { value: "1", label: "Monthly" },
    { value: "2", label: "Quarterly" },
    { value: "3", label: "Half Yearly" },
    { value: "4", label: "Yearly" },
    { value: "6", label: "Once in 2 Years" },
    { value: "7", label: "Once in 3 Years" },
    { value: "8", label: "Once in 4 Years" },
    { value: "9", label: "Once in 5 Years" },
  ];

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

  // Function to validate that end date is greater than start date
  const validateDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return true; // Allow if either date is not selected yet
    const start = moment(startDate, "DD/MM/YYYY");
    const end = moment(endDate, "DD/MM/YYYY");
    return end.isAfter(start);
  };

  // Helper: format number with commas (e.g. 34567 → 34,567)
  const formatNumberWithCommas = (value) => {
    if (!value) return "";
    const num = value.toString().replace(/,/g, "");
    return isNaN(num) ? value : Number(num).toLocaleString("en-IN");
  };

  return (
    <div className={`col-12 ${style.recurringFormContainer}`}>
      <div
        className="col-12 col-md-11"
        style={{ display: "flex", flexWrap: "wrap" }}
      >
        <div className="col-6 col-md-3 px-2">
          <div className="">
            <span className="lbl-newbond">Start date *</span>
            <br />
            <div className="bonds-datepicker">
              <FintooDatePicker
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                autoComplete="off"
                name="insurance_start_date"
                minDate={new Date()}
                maxDate={
                  props.data.insurance_end_date
                    ? moment(props.data.insurance_end_date, "DD/MM/YYYY")
                        .subtract(1, "day")
                        .toDate()
                    : null
                }
                dateFormat="dd/MM/yyyy"
                customClass="datePickerDMF"
                selected={
                  "insurance_start_date" in props.data
                    ? moment(
                        props.data.insurance_start_date,
                        "DD/MM/YYYY"
                      ).toDate()
                    : ""
                }
                onChange={(date) =>
                  props.update(
                    props.id,
                    "insurance_start_date",
                    moment(date, "DD/MM/YYYY").toDate()
                  )
                }
              />
            </div>
            {simpleValidator.current.message(
              "insurance_start_date",
              props.data.insurance_start_date,
              "required"
            )}
            {!validateDateRange(
              props.data.insurance_start_date,
              props.data.insurance_end_date
            ) &&
              props.data.insurance_start_date &&
              props.data.insurance_end_date && (
                <div
                  className="text-danger"
                  style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}
                >
                  Start date must be before end date.
                </div>
              )}
          </div>
        </div>
        <div className="col-6 col-md-3 px-2">
          <div className="">
            <span className="lbl-newbond">End date *</span>
            <br />
            <div className="bonds-datepicker">
              <FintooDatePicker
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                autoComplete="off"
                name="insurance_end_date"
                minDate={
                  props.data.insurance_start_date
                    ? moment(props.data.insurance_start_date, "DD/MM/YYYY")
                        .add(1, "day")
                        .toDate()
                    : new Date()
                }
                dateFormat="dd/MM/yyyy"
                customClass="datePickerDMF"
                selected={
                  "insurance_end_date" in props.data
                    ? moment(
                        props.data.insurance_end_date,
                        "DD/MM/YYYY"
                      ).toDate()
                    : ""
                }
                onChange={(date) =>
                  props.update(
                    props.id,
                    "insurance_end_date",
                    moment(date, "DD/MM/YYYY").toDate()
                  )
                }
              />
            </div>
            {simpleValidator.current.message(
              "insurance_end_date",
              props.data.insurance_end_date,
              "required"
            )}
            {!validateDateRange(
              props.data.insurance_start_date,
              props.data.insurance_end_date
            ) &&
              props.data.insurance_start_date &&
              props.data.insurance_end_date && (
                <div
                  className="text-danger"
                  style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}
                >
                  End date must be after start date.
                </div>
              )}
          </div>
        </div>
        <div className="col-6 col-md-3 px-2">
          <div className="">
            <span className="lbl-newbond">Amount *</span>
            <br />
            <input
              placeholder="Enter Amount"
              className={` w-100 fntoo-textbox-react`}
              type="text"
              name="insurance_recurring_amount"
              maxLength={9}
              value={formatNumberWithCommas(
                props.data.insurance_recurring_amount || ""
              )}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/,/g, "");
                props.update(props.id, e.target.name, rawValue, true);
              }}
            />
          </div>
          {simpleValidator.current.message(
            "insurance_recurring_amount",
            props.data.insurance_recurring_amount
              ? props.data.insurance_recurring_amount.replace(/,/g, "")
              : "",
            "required|numeric|min:1,num"
          )}
        </div>
        <div className="col-6 col-md-3 px-2">
          <div className="">
            <span className="lbl-newbond">Frequency *</span>
            <br />

            {(() => {
              const selectedOption = options_frequency.find(
                (item) => item.value === props.data.insurance_frequency
              );
              return (
                <Select
                  key={`frequency-${props.id}-${props.data.insurance_frequency}`}
                  className="fnto-dropdown-react"
                  classNamePrefix="sortSelect"
                  isSearchable={false}
                  options={options_frequency}
                  value={selectedOption}
                  onChange={(e) =>
                    props.update(props.id, "insurance_frequency", e.value)
                  }
                />
              );
            })()}
          </div>
          {simpleValidator.current.message(
            "insurance_frequency",
            props.data.insurance_frequency,
            "required"
          )}
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
export default RecurringMaturityForm;
