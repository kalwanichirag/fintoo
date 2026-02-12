import { useState } from "react";
import Rupee from "../Assets/Rupee.png";
import CurrencyInput from "react-currency-input-field";
function SIP_Lumpsum() {
  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    setToggleState(index);
  };
  const [value, setValue] = useState(0);
  const handleChange = (e) => {
    e.preventDefault();
    const { value = "" } = e.target;
    const parsedValue = value.replace(/[^\d.]/gi, "");
    setValue(parsedValue);
  };
  const handleOnBlur = () => setValue(Number(value).toFixed(2));
  return (
    <div className="TabData">
      <div className="bloc-tabs">
        <button
          className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(1)}
        >
          SIP
        </button>
        <button
          className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(2)}
        >
          Lumpsum
        </button>
      </div>

      <div className="content-tabs">
        <div
          className={toggleState === 1 ? "content  active-content" : "content"}
        >
          <div>
            <div
              style={{
                display: "flex",
                borderBottom: "1px solid #d8d8d8",
                paddingBottom: "0.5rem",
              }}
            >
              <label className="Input_Rupee" for="name">
                ₹
              </label>
              <CurrencyInput
                // prefix={prefix}
                name="currencyInput"
                id="currencyInput"
                data-number-to-fixed="0"
                data-number-stepfactor="100"
                value={value}
                placeholder=""
                onChange={handleChange}
                onBlur={handleOnBlur}
                allowDecimals
                decimalsLimit="2"
                disableAbbreviations
              />
              {/* <input type="text" id="name" name="name" placeholder="10,0000" onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }} /> */}
            </div>
            <div className="Plan">
              <div className="Plan_SIP" style={{ display: "grid" }}>
                <span>SIP Tenure (years)</span>
                <span className="Total_amnt">
                  <img className="Rupeee" src={process.env.REACT_APP_STATIC_URL + "media/DMF/Rupee.png"} alt="Rs" />
                  <input
                  
                    type="text"
                    className="Value form-control"
                    id=""
                    aria-describedby="emailHelp"
                    // placeholder="Enter email"
                  >20</input>
                  {/* <span> </span> */}
                </span>
              </div>
              <div className="Plan_SIP" style={{ display: "grid" }}>
                <span>Start Date</span>
                <span className="Total_amnt">
                  <img className="Rupeee" src={process.env.REACT_APP_STATIC_URL + "media/DMF/Rupee.png"} alt="Rs" />
                  {/* <input type="date" name="" id="" /> */}
                  <span className="Value"> 20th June</span>
                </span>
              </div>
            </div>
            <div className="years">
              <span>
                <input type="checkbox" name="" id="" />{" "}
                <span>Perpetual (60 Years)</span>
              </span>
            </div>
          </div>
        </div>

        <div
          className={toggleState === 2 ? "content  active-content" : "content"}
        >
          <div>
            <div
              style={{
                display: "flex",
                borderBottom: "1px solid #d8d8d8",
                paddingBottom: "0.5rem",
                marginTop: "4rem",
              }}
            >
              <label className="Input_Rupee" for="name">
                ₹
              </label>
              <CurrencyInput
                // prefix={prefix}
                name="currencyInput"
                id="currencyInput"
                data-number-to-fixed="2"
                data-number-stepfactor="100"
                value={value}
                placeholder=""
                onChange={handleChange}
                onBlur={handleOnBlur}
                allowDecimals
                decimalsLimit="2"
                disableAbbreviations
              />
            </div>
          </div>
        </div>
      </div>
      <div className="Right_Btn">
        <button> Invest </button>
        <button> Add to Cart </button>
      </div>
    </div>
  );
}

export default SIP_Lumpsum;
