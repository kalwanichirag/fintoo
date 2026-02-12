import React, { useState } from "react";
import  Link  from '../../../MainComponents/Link';
// import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Profile_1 from "../../../Assets/Profile_1.png";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Container, Row, Col } from "react-bootstrap";
import ProgressBar from "@ramonak/react-progress-bar";
import man from "../../../Assets/man.png";
import { SegmentedControl } from "evergreen-ui";
function Fatca() {
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };
  return (
    <div className="Fatca">
      <hr
        className="ProfileHr"
        style={{
          marginTop: "0.2rem",
        }}
      />
      <Col className="p-2 ">
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <div
            className=""
            style={{
              marginTop: "-1rem",
            }}
          >
            <Row>
              <Col className=" p-2">
                <Form.Label className="LabelName" htmlFor="inputText">
                  Address
                </Form.Label>
                <FloatingLabel controlId="floatingTextarea2">
                  <Form.Control
                    required
                    as="textarea"
                    placeholder="Leave a comment here"
                    className="shadow-none"
                    style={{ height: "140px", borderRadius: "10px" }}
                  />
                </FloatingLabel>
                <Form.Control.Feedback type="invalid">
                  Address is Required
                </Form.Control.Feedback>

                <div className="Nominee_Identity">
                  <div className="Nominee_Option">
                    <div className="InputOpt">
                      <Form.Label className="LabelName" htmlFor="inputText">
                        Zipcode
                      </Form.Label>
                      <Form.Control
                        aria-label="Default select example"
                        className="shadow-none"
                        style={{
                          borderRadius: "10px",
                          height: "2.5rem",
                          outline: "none",
                        }}
                        onchange="handleCardNumber(this.value)"
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                      ></Form.Control>
                      <Form.Control.Feedback type="invalid">
                        This field Required
                      </Form.Control.Feedback>
                    </div>
                    <div className="Space">
                      <div className="InputOpt Space">
                        <Form.Label className="LabelName" htmlFor="inputText">
                          City
                        </Form.Label>
                        <Form.Select
                          controlId="validationCustom02"
                          required
                          className="shadow-none"
                          aria-label="Default select example"
                          style={{
                            borderRadius: "10px",
                            height: "2.5rem",
                            outline: "none",
                          }}
                        >
                          <option>Select</option>
                          <option value="1">one</option>
                          <option value="2">two</option>
                          <option value="3">three</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          This field Required
                        </Form.Control.Feedback>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="Nominee_Identity">
                  <Form.Label className="LabelName" htmlFor="inputText">
                    Country
                  </Form.Label>
                  <Form.Select
                    controlId="validationCustom02"
                    required
                    className="shadow-none"
                    aria-label="Default select example"
                    style={{
                      borderRadius: "10px",
                      height: "2.5rem",
                      outline: "none",
                    }}
                  >
                    <option>Select</option>
                    <option value="1">one</option>
                    <option value="2">two</option>
                    <option value="3">three</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    This field Required
                  </Form.Control.Feedback>
                </div>
                <div className="Nominee_Identity">
                  <Form.Label className="LabelName" htmlFor="inputText">
                    Tax Payer ID Number
                  </Form.Label>
                  <Form.Select
                    controlId="validationCustom02"
                    required
                    className="shadow-none"
                    aria-label="Default select example"
                    style={{
                      borderRadius: "10px",
                      height: "2.5rem",
                      outline: "none",
                    }}
                  >
                    <option>Select</option>
                    <option value="1">one</option>
                    <option value="2">two</option>
                    <option value="3">three</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    This field Required
                  </Form.Control.Feedback>
                </div>
                <div className="Nominee_Identity">
                  <Form.Label className="LabelName" htmlFor="inputText">
                    Identification Type
                  </Form.Label>
                  <Form.Select
                    controlId="validationCustom02"
                    required
                    className="shadow-none"
                    aria-label="Default select example"
                    style={{
                      borderRadius: "10px",
                      height: "2.5rem",
                      outline: "none",
                    }}
                  >
                    <option>Select</option>
                    <option value="1">one</option>
                    <option value="2">two</option>
                    <option value="3">three</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    This field Required
                  </Form.Control.Feedback>
                </div>
              </Col>
            </Row>
          </div>
        </Form>
        <hr className="ProfileHr" />
        <div>
          <Link
            to="/direct-mutual-fund/profile/nominee-details"
            type="Submit"
            className="NextBtn"
            variant="outline-primary"
            style={{
              // marginTop: "1rem",
              marginLeft: "20.4rem",
            }}
          >
            Next
          </Link>
        </div>
      </Col>
    </div>
  );
}
export default Fatca;
