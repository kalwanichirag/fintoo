import { useState, useEffect, useRef } from "react";
import "react-responsive-modal/styles.css";
import Profile_1 from "../../../Assets/03_Location_search.svg";
import Button from "react-bootstrap/Button";
import { Container, Row, Col } from "react-bootstrap";
import ProgressBar from "@ramonak/react-progress-bar";
import Back from "../../../Assets/left-arrow.png";
import AadharPic from "../../../Assets/10_Aadhar_card.png";
import PassportPic from "../../../Assets/11_passport.png";
import DrivingLicPic from "../../../Assets/12_Driving_licence.png";
import FintooProfileBack from "../../../HTML/FintooProfileBack";
import FintooButton from "../../../HTML/FintooButton";
import { useSelector } from "react-redux";
import { CheckSession } from "../../../../common_utilities";
import commonEncode from "../../../../commonEncode";
function AadharDocument(props) {
  const [validated, setValidated] = useState(false);
  const showBack = useSelector((state) => state.isBackVisible);
  const [choise, setchoise] = useState("");
  const [disabled, setdisabled] = useState(false);
  const btnRef = useRef();

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };
  const [addressdoc, setAddressdoc] = useState(
    localStorage.getItem("doc") ? localStorage.getItem("doc") : ""
  );

  useEffect(() => {
    props.onDocumentSelect(
      localStorage.getItem("doc") != "" ? localStorage.getItem("doc") : ""
    );
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }, []);

  function onChangeValue(event) {
    setAddressdoc(event.target.value);
  }

  const [isActive, setActive] = useState("true");

  useEffect(() => {
    if (addressdoc == "") {
      setdisabled(true);
    }
  }, []);

  const handleToggle = () => {
    setActive(!isActive);
  };

  return (
    <Row className="reverse">
      <Col className=" ProfileImg p-2">
        <div>
          <img src={process.env.REACT_APP_STATIC_URL + "media/DMF/03_Location_search.svg"}  alt="" />
        </div>
      </Col>
      <Col className="p-2 RightPanel document-selection">
        <div className="rhl-inner">
          {showBack == true && (
            <FintooProfileBack
              title="Select Address Document"
              onClick={() => props.onPrevious()}
            />
          )}
          <div>
            <div>
              <p className="">
                Please select one of the documents to be uploaded.
              </p>
            </div>

            <div className="VerifyDetails py-4">
              <div className="d-flex">
                <div
                  className={`w-33 rs-type-bx text-center ${
                    addressdoc.toLowerCase() == "aadhar" ? "active" : ""
                  }`}
                >
                  <div
                    className={`rs-type-ck `}
                    onClick={() => {
                      setAddressdoc("aadhar");
                      localStorage.setItem("doc", "aadhar");
                      props.onDocumentSelect("aadhar");
                      setdisabled(false);
                    }}
                  >
                    <label>
                      <img src={process.env.REACT_APP_STATIC_URL + "media/DMF/10_Aadhar_card.svg"} />
                    </label>
                    <div className="ResidentType">
                      <span>Aadhar Card</span>
                    </div>
                  </div>
                </div>
                <div
                  className={`w-33 rs-type-bx text-center ${
                    addressdoc.toLowerCase() == "passport" ? "active" : ""
                  }`}
                >
                  <div
                    className={`rs-type-ck `}
                    onClick={() => {
                      setAddressdoc("passport");
                      localStorage.setItem("doc", "passport");
                      props.onDocumentSelect("passport");
                      setdisabled(false);
                    }}
                  >
                    <label>
                    <img src={process.env.REACT_APP_STATIC_URL + "media/DMF/11_passport.svg"} alt="passport pic."/>
                    </label>
                    <div className="ResidentType">
                      <span>Passport</span>
                    </div>
                  </div>
                </div>

                <div
                  className={`w-33 rs-type-bx text-center ${
                    addressdoc.toLowerCase().indexOf("driving") > -1
                      ? "active"
                      : ""
                  }`}
                >
                  <div
                    className={`rs-type-ck `}
                    onClick={() => {
                      setAddressdoc("driving");
                      localStorage.setItem("doc", "driving license");
                      props.onDocumentSelect("driving license");
                      setdisabled(false);
                    }}
                  >
                    <label>
                    <img src={process.env.REACT_APP_STATIC_URL + "media/DMF/12_Driving_licence.png"} alt="Driving Licence"/>
                    </label>
                    <div className="ResidentType">
                      <span>Driving Licence</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <hr className="ProfileHr" style={{marginTop: "1.5rem"}} /> */}
            <div className="fintoo-top-border pt-4 ">
              <FintooButton
                disabled={disabled}
                // ref={btnRef}
                type="button"
                onClick={() => props.onNext()}
                title="Next"
                className="d-block ms-auto me-0"
              />
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
}

export default AadharDocument;
