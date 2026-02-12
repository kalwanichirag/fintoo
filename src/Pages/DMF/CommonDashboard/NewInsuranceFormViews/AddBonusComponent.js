import { useEffect, useState } from "react";
import uuid from "react-uuid";
import AddBonusForm from "./AddBonusForm";

// const numericRegex = new RegExp(/^\d*\.?\d*$/);

// const defaultBonusData = {
//     id: uuid(),
//     bonusAmount: '',
//     dateOfBonus: '',
// }

// const AddBonusComponent = (props) => {

//     const [bonusData, setBonusData] = useState([defaultBonusData])

//     const addBonusData = () => {
//         if (bonusData.length === 5) return;
//         setBonusData((prev) => [...prev, {
//             id: uuid(),
//             bonusAmount: '',
//             dateOfBonus: '',
//         }])
//     }
//     const deleteBonusData = (id) => {
//         setBonusData((prev) => prev.filter((item) => item.id !== id))
//     }

//     const updateBonusData = (id, key, value, isNumeric) => {

//         if (isNumeric && !numericRegex.test(value) && value !== '') {
//             return;
//         }

//         setBonusData((prev) => prev.map((item) => {
//             if (item.id === id) {
//                 item[key] = value;
//             }
//             return item;
//         }))
//     }

//     useEffect(() => {
//         if (bonusData.length == 0) {
//             props.setToggle();
//         }
//     }, [bonusData])

//     return (
//         <div className="row" style={{ border: "1px solid #d8d8d8", borderRadius: 10, padding: '1rem 0.5rem' }}>
//             {
//                 bonusData.map((data, index) => (
//                     <div key={data.id} id={data.id}>
//                         <AddBonusForm add={addBonusData} delete={deleteBonusData} update={updateBonusData} data={data} isLast={index == bonusData.length - 1} />
//                         {
//                             index !== bonusData.length - 1 && <hr />
//                         }
//                     </div>
//                 ))
//             }
//         </div>
//     );
// };
// export default AddBonusComponent;

// import { useEffect, useState } from "react";
// import RecurringMaturityForm from "./RecurringMaturityForm";
// import uuid from "react-uuid";

const numericRegex = new RegExp(/^\d*\.?\d*$/);

const AddBonusComponent = ({ setToggle, bonousData, onAdd, onUpdate }) => {
  // const [maturityData, setMaturityData] = useState([defauotMaturityData])

  const addbonus = () => {
    if (bonousData?.length === 5) return;
    onAdd();
  };
  const deletebonusData = (id) => {
    // setMaturityData((prev) => prev.filter((item) => item.id !== id))
    let newData = bonousData?.filter((item, index) => index !== id);
    if (newData.length === 0) setToggle();
    onUpdate(newData);
  };

  const checkAddValidation = (addObj) => {
    // Remove commas before validation to handle formatted numbers
    const cleanAmount = addObj.insurance_bonus_amount
      ? addObj.insurance_bonus_amount.toString().replace(/,/g, "")
      : "";
    return Boolean(
      cleanAmount && parseFloat(cleanAmount) > 0 && addObj.insurance_bonus_date
    );
  };

  const updatebonousData = (id, key, value, isNumeric) => {
    let newData = bonousData?.map((item, index) => {
      if (index === id) {
        item[key] = value;
        item.isValid = checkAddValidation(item);
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
      {bonousData?.map((i, index) => (
        <div key={index}>
          <AddBonusForm
            add={addbonus}
            delete={deletebonusData}
            update={updatebonousData}
            data={{ ...i }}
            id={index}
            isLast={index == bonousData?.length - 1}
          />
          {index !== bonousData?.length - 1 && <hr />}
        </div>
      ))}
    </div>
  );
};
export default AddBonusComponent;
