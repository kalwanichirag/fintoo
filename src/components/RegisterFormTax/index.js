import { useState, useEffect } from "react";
import Select from "react-select";
const RegisterFormTax = () => {
  const optionsIncomeSlab = [
    // { value: "1", label: "Income Slab" },
    { value: "2", label: "0 to 10 Lacs" },
    { value: "3", label: "10 Lacs to 25 Lacs" },
    { value: "4", label: "25+ Lacs" },
  ];
  const optionsSourceIncome = [
    // { value: "1", label: "Source of Income" },
    { value: "2", label: "Business" },
    { value: "3", label: "Profession" },
    { value: "4", label: "Pvt.Sector Service" },
    { value: "5", label: "Public Sector Service" },
    { value: "6", label: "Other" },
  ];
  const customStyles = {
    option: (base, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...base,
        backgroundColor: isFocused ? "#ffff" : "#ffff",
        color: isFocused ? "#042b62" : "#042b62",
        cursor: "pointer",
      };

    },
    menuList: (base) => ({
      ...base,
      height: "100px",
      overflowY: 'scroll',
      scrollBehavior: 'smooth',
      "::-webkit-scrollbar": {
        width: "4px",
        height: "0px",
      },
      "::-webkit-scrollbar-track": {
        background: "#fff"
      },
      "::-webkit-scrollbar-thumb": {
        background: "#042b62"
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: "#555"
      }
    })
  };
  return (
    <>
      <div style={{ paddingTop: "30%" }}>
        <h2
          class="page-header text-center"
          style={{
            fontWeight: "600",
          }}
        >
          Fill in your details
        </h2>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="material input">
              <input type="text" tabindex="1" placeholder="Name*" />
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="material input">
              <input type="text" tabindex="1" placeholder="Email Address*" />
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="material input">
              <input type="text" tabindex="1" placeholder="Mobile Number*" />
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-8 DropMenu pt-3">
            <Select
              classNamePrefix="sortSelectData"
              isSearchable={false}
              styles={customStyles}
              options={optionsIncomeSlab}
              placeholder="Income Slab"
            />
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-8 DropMenu pt-3">
            <Select
              classNamePrefix="sortSelectData"
              isSearchable={false}
              styles={customStyles}
              options={optionsSourceIncome}
              placeholder="Source of Income"
            />
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="material input">
              <input type="text" tabindex="1" placeholder="Add Income here*" />
            </div>
          </div>
        </div>
        {/* <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="material input">
                        <input type="text" tabindex="1" placeholder="Select Expert*" />
                    </div>
                </div>
            </div> */}
        <div className="expertcallback_captcha_div pt-3">
          <div className="row form-row justify-content-center">
            <div className="col-md-4">
              <div id="captcha_block">
                <img
                  src={require("../../Assets/Images/main/captcha.png")}
                  style={{ float: "left" }}
                  draggable="false"
                />
              </div>
            </div>
            <div className="col-md-4">
              <img

                src={imagePath + "/static/media/Images/assets/img/refresh_captcha.svg"}
                className="refresh_captcha"
                alt="REFRESH CAPTCHA"
              />
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="material input">
              <input type="text" tabindex="1" placeholder="Captcha*" />
            </div>
          </div>
        </div>
        <div className="btn-container text-center">
          <button type="button" value="Submit" className="default-btn">
            Submit
          </button>
        </div>
      </div>
    </>
  );
};
export default RegisterFormTax;
