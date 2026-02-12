import { useEffect, useState } from "react";
import RecurringMaturityForm from "./RecurringMaturityForm";

const numericRegex = new RegExp(/^\d*\.?\d*$/);

const RecurringMaturityComponent = ({ setToggle, data, onAdd, onUpdate }) => {
  const addMaturityData = () => {
    if (data?.length === 5) return;
    onAdd();
  };
  const deleteMaturityData = (id) => {
    let newData = data?.filter((item, index) => index !== id);
    if (newData.length === 0) setToggle();
    onUpdate(newData);
  };

  const checkMaturityValidation = (addObj) => {
    // Check if all required fields are present
    const hasRequiredFields = Boolean(
      addObj.insurance_start_date &&
        addObj.insurance_end_date &&
        addObj.insurance_recurring_amount &&
        addObj.insurance_recurring_amount > 0 &&
        addObj.insurance_frequency
    );

    // Check if end date is after start date
    const isDateRangeValid = () => {
      if (!addObj.insurance_start_date || !addObj.insurance_end_date)
        return true; // Allow if either date is not selected yet
      const start = new Date(addObj.insurance_start_date);
      const end = new Date(addObj.insurance_end_date);
      return end > start;
    };

    return hasRequiredFields && isDateRangeValid();
  };

  const updateMaturityData = (id, key, value, isNumeric) => {
    let newData = data?.map((item, index) => {
      if (index === id) {
        item[key] = value;
        item.isValid = checkMaturityValidation(item);
      }
      return item;
    });

    onUpdate(newData);
  };

  return (
    <div
      className="row"
      style={{
        border: "1px solid #d8d8d8",
        borderRadius: 10,
        padding: "1rem 0.5rem",
      }}
    >
      {data?.map((data, index) => {
        return (
          <div key={data.refId || index}>
            <RecurringMaturityForm
              add={addMaturityData}
              delete={deleteMaturityData}
              update={updateMaturityData}
              data={{ ...data }}
              id={index}
              isLast={index == data.length - 1}
            />
            {index !== data.length - 1 && <hr />}
          </div>
        );
      })}
    </div>
  );
};
export default RecurringMaturityComponent;
