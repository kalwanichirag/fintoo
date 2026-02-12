import React, { useState } from "react";
import Link from "../../../MainComponents/Link";
// import "bootstrap/dist/css/bootstrap.min.css";
import man from "../../../Assets/man.png";
import { Container, Row, Col, Button } from "react-bootstrap";
import Resident from "../../../Assets/04_fatca_resident.svg";
import NRIResident from "../../../Assets/NRI.svg";
import NROResident from "../../../Assets/nro.png";
import HoldingNature from "../../../Assets/07_holding_nature_single.png";
import HoldingNatureJoint from "../../../Assets/08_holding_nature_joint.svg";
import HoldingNatureSurvivor from "../../../Assets/09_holding_nature_anyone_survivor.svg";
import { FaFemale, FaMale, ImMan } from "react-icons/fa";
import { SegmentedControl } from "evergreen-ui";

function Fatca(props) {
  const [options] = React.useState([
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
    { label: "Partially Exposed", value: "Partially Exposed" },
  ]);
  const [options1] = React.useState([
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ]);
  const [value, setValue] = React.useState("No");
  const [value1, setValue1] = React.useState("No");

  const [residential, setResidential] = useState("RES");

  function onChangeValue(event) {
    setResidential(event.target.value);

  }
  const [isActive, setActive] = useState("true");

  const handleToggle = () => {
    setActive(!isActive);
  };
  //
  const [holding, setHolding] = useState("Single");

  function onChangeValue1(event) {
    setHolding(event.target.value);

  }
  const [isActive1, setActive1] = useState("true");

  const handleToggle2 = () => {
    setActive1(!isActive1);
  };

  return (
    <div className="Fatca">
      <hr
        className="ProfileHr"
        style={{
          marginTop: "0.2rem",
        }}
      />
      <h5 className="ResiStatus">Residential Status</h5>
      <div
        className="Residential"
        onChange={onChangeValue}
        style={{ marginTop: "0rem" }}
      >
        <div className="Resi_Sta">
          <input
            style={{ visibility: "hidden" }}
            id="RES"
            type="radio"
            value="RES"
            name="gender"
            checked={residential === "RES"}
          />
          <label onClick={handleToggle} htmlFor="RES">
            <img
              src={process.env.REACT_APP_STATIC_URL + "media/DMF/04_fatca_resident.svg"}
              className={
                residential.toLowerCase() == "res"
                  ? "ColorChangeDark"
                  : "ColorChange"
              }
              style={{
                fontSize: "60px",
              }}
            />
          </label>
        </div>
        <div className="Resi_Sta">
          <input
            style={{ visibility: "hidden" }}
            id="NRI"
            type="radio"
            value="NRI"
            name="gender"
            checked={residential === "NRI"}
          />
          <label htmlFor="NRI">
            <img
              src={NRIResident}
              className={
                residential.toLowerCase() == "nri"
                  ? "ColorChangeDark"
                  : "ColorChange"
              }
              style={{
                fontSize: "60px",
              }}
            />
          </label>
        </div>
        <div className="Resi_Sta">
          <input
            style={{ visibility: "hidden" }}
            id="NRO"
            type="radio"
            value="NRO"
            name="gender"
            checked={residential === "NRO"}
          />
          <label htmlFor="NRO">
            <img
              src={NROResident}
              className={
                residential.toLowerCase() == "nro"
                  ? "ColorChangeDark"
                  : "ColorChange"
              }
              style={{
                fontSize: "60px",
              }}
            />
          </label>
        </div>
        <div className="ResidentType">
          <span>RES-Resident</span>
        </div>
        <div className="ResidentType">
          <span style={{ whiteSpace: "nowrap" }}>NRI-Non Resident</span>
        </div>
        <div className="ResidentType">
          <span>NRO-Resident</span>
        </div>
      </div>
      <hr
        className="ProfileHr"
        style={{
          marginTop: "0.2rem",
        }}
      />
      <h5 className="ResiStatus" style={{ whiteSpace: "nowrap" }}>
        Tax Resident in country other than india ?
      </h5>
      <div className="Option">
        <SegmentedControl
          className="TaxRes"
          width={240}
          options={options1}
          value={value1}
          onChange={(value1) => setValue1(value1)}
        />
      </div>
      <hr
        className="ProfileHr"
        style={{
          marginTop: "1.5rem",
        }}
      />
      <h5 className="ResiStatus">Holding Nature</h5>

      <div
        className="Residential"
        onChange={onChangeValue1}
        style={{ marginTop: "0rem" }}
      >
        <div className="Resi_Sta">
          <input
            style={{ visibility: "hidden" }}
            id="Single"
            type="radio"
            value="Single"
            name="gender"
            checked={holding === "Single"}
          />
          <label onClick={handleToggle2} htmlFor="Single">
            <img
              src={process.env.REACT_APP_STATIC_URL + "media/DMF/07_holding_nature_single.svg"}
              className={
                holding.toLowerCase() == "single"
                  ? "ColorChangeDark"
                  : "ColorChange"
              }
              style={{
                fontSize: "60px",
              }}
            />
          </label>
        </div>
        <div className="Resi_Sta">
          <input
            style={{ visibility: "hidden" }}
            id="Joint"
            type="radio"
            value="Joint"
            name="gender"
            checked={holding === "Joint"}
          />
          <label onClick={handleToggle2} htmlFor="Joint">
            <img
              src={HoldingNatureJoint}
              className={
                holding.toLowerCase() == "joint"
                  ? "ColorChangeDark"
                  : "ColorChange"
              }
              style={{
                fontSize: "60px",
              }}
            />
          </label>
        </div>
        <div className="Resi_Sta">
          <input
            style={{ visibility: "hidden" }}
            id="Anyone"
            type="radio"
            value="Anyone"
            name="gender"
            checked={holding === "Anyone"}
          />
          <label onClick={handleToggle2} htmlFor="Anyone">
            <img
              src={HoldingNatureSurvivor}
              className={
                holding.toLowerCase() == "anyone"
                  ? "ColorChangeDark"
                  : "ColorChange"
              }
              style={{
                fontSize: "60px",
              }}
            />
          </label>
        </div>
        <div className="ResidentType">
          <span>Single</span>
        </div>
        <div className="ResidentType">
          <span>Joint Holding</span>
        </div>
        <div className="ResidentType">
          <span style={{ whiteSpace: "nowrap" }}>Anyone or Survivor</span>
        </div>
      </div>

      <hr
        className="ProfileHr"
        style={{
          marginTop: "0.2rem",
        }}
      />
      <h5 className="ResiStatus">Are you politically exposed ?</h5>
      <div className="Option">
        <SegmentedControl
          width={240}
          options={options}
          value={value}
          onChange={(value) => setValue(value)}
        />
      </div>
      <hr
        className="ProfileHr"
        style={{
          marginTop: "1.5rem",
        }}
      />
      <div>
        <Button
          type="Submit"
          style={{ float: "right" }}
          className="NextBtn shadow-none "
          variant="outline-primary"
          onClick={() => props.onNext()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
export default Fatca;
